"""Compact source format for NDA I 2026 transcription.

Q(n, stem, opts, key, node, diff, expl, pattern="Single MCQ", passage=None, theme="")
node = "Subject > Topic > Subtopic"
"""
QS = []
PASSAGES = {}


def Q(n, stem, opts, key, node, diff, expl, pattern="Single MCQ", passage=None, theme=""):
    subj, topic, sub = [s.strip() for s in node.split(">")]
    assert len(opts) == 4 and key in "ABCD", n
    QS.append(dict(q_num=n, question=stem.strip(), opts=opts, key=key, subject=subj, topic=topic,
                   subtopic=sub, theme=theme, diff=diff, explanation=expl.strip(), pattern=pattern,
                   passage=passage))


def P(key, title, body):
    PASSAGES[key] = dict(title=title, body=body.strip())

# Keys that need checking against the official UPSC key (question number -> reason)
FLAGS = {}


def F(n, why):
    FLAGS[n] = why
