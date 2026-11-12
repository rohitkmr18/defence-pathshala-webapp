"""Uncapped greedy Whisper decoding over sherpa-onnx exported ONNX models.
Supports an initial text prompt (<|startofprev|>) so Hinglish speech can be
steered to Roman script. Based on the reference decode in k2-fsa/sherpa-onnx
scripts/whisper/test.py (Apache-2.0)."""
import base64, numpy as np, onnxruntime as ort, kaldi_native_fbank as knf

class Whisper:
    def __init__(self, mdir, prefix="turbo"):
        so = ort.SessionOptions(); so.intra_op_num_threads = 4
        self.enc = ort.InferenceSession(f"{mdir}/{prefix}-encoder.int8.onnx", so, providers=["CPUExecutionProvider"])
        self.dec = ort.InferenceSession(f"{mdir}/{prefix}-decoder.int8.onnx", so, providers=["CPUExecutionProvider"])
        m = self.enc.get_modelmeta().custom_metadata_map
        g = lambda k: int(m[k])
        self.L, self.ctx, self.D, self.mels = g("n_text_layer"), g("n_text_ctx"), g("n_text_state"), g("n_mels")
        self.sot, self.eot, self.transcribe_id, self.translate_id = g("sot"), g("eot"), g("transcribe"), g("translate")
        self.no_ts, self.no_speech, self.blank = g("no_timestamps"), g("no_speech"), g("blank_id")
        self.lang2id = dict(zip(m["all_language_codes"].split(","), map(int, m["all_language_tokens"].split(","))))
        self.id2bytes, self.bytes2id = {}, {}
        for line in open(f"{mdir}/{prefix}-tokens.txt"):
            t, i = line.split(); b = base64.b64decode(t); self.id2bytes[int(i)] = b; self.bytes2id[b] = int(i)
        self.startofprev = self.sot - 1  # <|startofprev|> precedes <|startoftranscript|> in whisper vocab? verified below
    def encode_text(self, text):
        """Byte-level BPE using token ids as merge ranks (tiktoken semantics)."""
        import re
        out = []
        for piece in re.findall(r"""'s|'t|'re|'ve|'m|'ll|'d| ?\w+| ?\d+| ?[^\s\w]+|\s+(?!\S)|\s+""", text):
            parts = [bytes([c]) for c in piece.encode()]
            while len(parts) > 1:
                best, bi = None, -1
                for k in range(len(parts) - 1):
                    r = self.bytes2id.get(parts[k] + parts[k + 1])
                    if r is not None and (best is None or r < best): best, bi = r, k
                if best is None: break
                parts[bi:bi + 2] = [parts[bi] + parts[bi + 1]]
            out += [self.bytes2id[p] for p in parts]
        return out
    def features(self, wave16k):
        o = knf.WhisperFeatureOptions(); o.dim = self.mels
        f = knf.OnlineWhisperFbank(o); f.accept_waveform(16000, wave16k); f.input_finished()
        x = np.stack([f.get_frame(i) for i in range(f.num_frames_ready)])
        x = np.log10(np.clip(x, 1e-10, None)); x = np.maximum(x, x.max() - 8.0); x = (x + 4.0) / 4.0
        x = np.pad(x, ((0, 1500), (0, 0)))
        if x.shape[0] > 3000: x = np.pad(x[:2950], ((0, 50), (0, 0)))
        return x.T[None].astype(np.float32)
    def _dec(self, toks, kc, vc, ck, cv, off):
        names = [o.name for o in self.dec.get_outputs()[:3]]
        ins = [i.name for i in self.dec.get_inputs()]
        return self.dec.run(names, {ins[0]: np.array([toks], np.int64), ins[1]: kc, ins[2]: vc, ins[3]: ck, ins[4]: cv, ins[5]: np.array([off], np.int64)})
    def transcribe(self, wave16k, lang="hi", prompt=None, max_tokens=200):
        ck, cv = self.enc.run(None, {self.enc.get_inputs()[0].name: self.features(wave16k)})[:2]
        kc = np.zeros((self.L, 1, self.ctx, self.D), np.float32); vc = kc.copy()
        seq = []
        if prompt:
            seq = [self.startofprev] + self.encode_text(" " + prompt.strip())[-120:]
        seq += [self.sot, self.lang2id[lang], self.transcribe_id, self.no_ts]
        logits, kc, vc = self._dec(seq, kc, vc, ck, cv, 0); off = len(seq)
        res = []
        for step in range(max_tokens):
            lg = logits[0, -1].copy()
            lg[[self.sot, self.no_speech, self.translate_id, self.no_ts, self.startofprev]] = -np.inf
            if step == 0: lg[[self.eot, self.blank]] = -np.inf
            lg[self.no_ts + 1:] = -np.inf  # no timestamp tokens
            t = int(lg.argmax())
            if t == self.eot: break
            # repetition guard
            if len(res) > 12 and res[-6:] == res[-12:-6]: break
            res.append(t)
            logits, kc, vc = self._dec([t], kc, vc, ck, cv, off); off += 1
        return b"".join(self.id2bytes.get(i, b"") for i in res).decode("utf-8", "replace").strip()
