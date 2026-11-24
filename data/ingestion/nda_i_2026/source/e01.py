from qfmt import Q, F

# NDA I 2026 General Ability Test, Set A (NPSS-B-TGA/65A), Part A English, Q1-50
SYN = "Directions: Each item consists of a sentence with an underlined word/words followed by four words. Select the word that is nearest in meaning to the underlined word/words.\n\n"
ANT = "Directions: Each item consists of a sentence with an underlined word followed by four words. Select the word that is opposite in meaning to the underlined word.\n\n"
IDI = "Directions: Select the most appropriate alternative which gives the correct meaning of the idiom/phrase.\n\n"
WC = "Directions: Each of the following sentences has word/words underlined. Read the sentence carefully and identify which word class the underlined word/words belongs/belong to.\n\n"
CMP = "Directions: Complete the sentence by choosing the correct alternative.\n\n"
COR = "Directions: The following item has four sentences, one of which is correct. Select the correct sentence."
ERR = "Directions: The sentence has four underlined parts labelled (a), (b), (c) and (d). Find out the underlined part that has an error.\n\n"
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"

F(26, "half after a possessive read as an adjective; could be argued as a determiner")
F(31, "till/until are equivalent in (a) and (b); DP picks 'unless'")
F(35, "(a) and (b) are near-equivalent; DP picks 'until you see the light turn green'")
F(41, "No obvious error; DP treats 'staff are' as the intended error")
F(46, "Passive of an advisory imperative; DP rejects the split-infinitive version in II")


def syn(n, sent, opts, key, expl, diff=20):
    Q(n, SYN + sent, opts, key, "Vocabulary > Synonyms > Contextual Meaning", diff, expl)


def ant(n, sent, opts, key, expl, diff=25):
    Q(n, ANT + sent, opts, key, "Vocabulary > Antonyms > Contextual Meaning", diff, expl)


syn(1, "The 'Jataka Tales' present moral narratives in the form of __allegories__.",
    ["aphorisms", "adages", "enjambments", "parables"], "D",
    "Concept: an allegory is a story with a hidden moral meaning.\nStep 1: A parable is a short moral story, the closest match. Aphorisms and adages are sayings; enjambment is a feature of verse.\nAnswer: (d)")
syn(2, "He was upbraided for appearing in court in a state of __inebriation__.",
    ["ululation", "intoxication", "confabulation", "sublimation"], "B",
    "Concept: inebriation means drunkenness.\nStep 1: Intoxication has the same meaning.\nAnswer: (b)", 15)
syn(3, "The __obstreperous__ behavior of the students inside the classroom drew the attention of the Principal.",
    ["compliant", "obnoxious", "inconspicuous", "disorderly"], "D",
    "Concept: obstreperous means noisy and difficult to control.\nStep 1: Disorderly is the closest; obnoxious means offensive, not unruly.\nAnswer: (d)", 30)
syn(4, "These were based primarily in Himachal Pradesh, where the treks were as __gruelling__ as the terrain.",
    ["rigorous", "egregious", "unctuous", "ominous"], "A",
    "Concept: gruelling means extremely tiring and demanding.\nStep 1: Rigorous (severe, demanding) is the closest.\nAnswer: (a)")
syn(5, "I think they would wish for some more __adornment__ around the school campus for the special function.",
    ["subsummation", "decoration", "coloration", "inculcation"], "B",
    "Concept: adornment means ornamentation.\nStep 1: Decoration has the same meaning.\nAnswer: (b)", 10)
syn(6, "The travel company tried to identify destinations that were __off the beaten track__.",
    ["untenanted", "unfrequented", "unattended", "untoward"], "B",
    "Concept: off the beaten track means remote, little visited.\nStep 1: Unfrequented (rarely visited) matches.\nAnswer: (b)")
syn(7, "Women gather in the community park on a regular basis to __chant__ prayers for the benefit of all.",
    ["confound", "inculcate", "indite", "recite"], "D",
    "Concept: to chant prayers is to say or sing them repeatedly.\nStep 1: Recite is the closest; indite means to write.\nAnswer: (d)", 15)
syn(8, "The HR Manager was able to __utilize__ the specific skills of each member of the team assembled for the project.",
    ["harness", "harbor", "harangue", "herald"], "A",
    "Concept: utilize means to make practical use of.\nStep 1: Harness (to bring under control and use) matches.\nAnswer: (a)")
syn(9, "The oppressive pollution was noticed to have __abated__ after the unseasonal rainfall.",
    ["mitigated", "enhanced", "discontinued", "suppressed"], "A",
    "Concept: abate means to become less intense.\nStep 1: Mitigated (lessened) is the closest; discontinued and suppressed suggest stopping completely.\nAnswer: (a)")
syn(10, "Often, the context and structure of an __ambiguous__ statement is difficult to discern.",
    ["absolutistic", "explicit", "cryptic", "solipsistic"], "C",
    "Concept: ambiguous means open to more than one interpretation.\nStep 1: Cryptic (obscure, with a hidden meaning) is the closest; explicit is the opposite.\nAnswer: (c)", 25)

ant(11, "She had a __ruddy__, open face and an oddly guileless manner.",
    ["cacophonous", "cadaverous", "nauseous", "bumptious"], "B",
    "Concept: ruddy means having a healthy red colour.\nStep 1: Cadaverous (very pale, corpse-like) is the opposite.\nAnswer: (b)", 40)
ant(12, "He used to be known among his colleagues for his __righteousness__.",
    ["iniquity", "ingenuity", "absorptivity", "incredulity"], "A",
    "Concept: righteousness means moral uprightness.\nStep 1: Iniquity (wickedness, injustice) is the opposite.\nAnswer: (a)")
ant(13, "He found the musical rendition by the septuagenarian maestro to be __listless__.",
    ["wearying", "unedifying", "unengaging", "scintillating"], "D",
    "Concept: listless means lacking energy or enthusiasm.\nStep 1: Scintillating (brilliantly lively) is the opposite.\nAnswer: (d)")
ant(14, "The official accused of espionage was found to be __disingenuous__.",
    ["scrupulous", "duplicitous", "mendacious", "perfidious"], "A",
    "Concept: disingenuous means insincere, dishonest.\nStep 1: Duplicitous, mendacious and perfidious are near-synonyms; scrupulous (careful to be honest) is the opposite.\nAnswer: (a)", 35)
ant(15, "The young are easily __excitable__ when presented with strong emotional triggers.",
    ["composed", "agitated", "aggrieved", "alarmed"], "A",
    "Concept: excitable means easily agitated.\nStep 1: Composed (calm, self-controlled) is the opposite.\nAnswer: (a)", 15)
ant(16, "Our professor was __perplexed__ by the answers we wrote in the examination.",
    ["misled", "enlightened", "confused", "befuddled"], "B",
    "Concept: perplexed means puzzled.\nStep 1: Enlightened (having clear understanding) is the opposite.\nAnswer: (b)", 15)
ant(17, "Effective governance seeks to __optimize__ public resource allocation.",
    ["upgrade", "rationalize", "maximize", "degrade"], "D",
    "Concept: optimize means to make the best or most effective use of.\nStep 1: Degrade (make worse) is the opposite.\nAnswer: (d)", 15)
ant(18, "The student's striking __audaciousness__ disturbed long-standing social hierarchies on campus.",
    ["boldness", "fearlessness", "timidness", "insightfulness"], "C",
    "Concept: audaciousness means bold daring.\nStep 1: Timidness (lack of courage) is the opposite.\nAnswer: (c)", 15)
ant(19, "There are four __concurrent__ handloom fairs around the city.",
    ["consecutive", "distributive", "aberrative", "abstersive"], "A",
    "Concept: concurrent means happening at the same time.\nStep 1: Consecutive (following one after another) is the opposite.\nAnswer: (a)", 35)
ant(20, "__Lucidity__ is a desired quality in effective communication.",
    ["Clarity", "Felicity", "Facility", "Ambiguity"], "D",
    "Concept: lucidity means clarity of expression.\nStep 1: Ambiguity is the opposite.\nAnswer: (d)", 10)

for n, idiom, opts, key, expl in [
    (21, "'Nuts and bolts'", ["To complete the first step in a process", "To get down to practical details", "To receive harm or punishment for one's actions", "To irritate people and make them go away"], "B",
     "Concept: the nuts and bolts of something are its basic practical details.\nAnswer: (b)"),
    (22, "'Hat in hand'", ["With humility", "Easy to use", "Available for anyone", "To marry someone"], "A",
     "Concept: hat in hand means humbly, especially when asking for something.\nAnswer: (a)"),
    (23, "'Straight from the horse's mouth'", ["Ready and eager to engage in an activity", "Significantly disturbing business", "Information from reliable and authoritative source", "Sudden feelings of fear and embarrassment"], "C",
     "Concept: straight from the horse's mouth means from the most reliable, first-hand source.\nAnswer: (c)"),
    (24, "'Bite off more than you can chew'", ["To suddenly wrap out of conversation", "To try to do more than you can manage", "To do something in the easiest or cheapest way", "To exaggerate something wildly"], "B",
     "Concept: to bite off more than you can chew is to take on more than you can handle.\nAnswer: (b)"),
    (25, "'A piece of cake'", ["Something difficult to extract from the original", "Something very difficult to understand", "Something that appears very inviting", "Something very easy to accomplish"], "D",
     "Concept: a piece of cake is something very easy to do.\nAnswer: (d)"),
]:
    Q(n, IDI + idiom, opts, key, "Vocabulary > Idioms and Phrases > Idiom Meaning", 10, expl)

for n, sent, opts, key, expl, diff in [
    (26, "He claimed his __half__ share of the booty.", ["Adverb", "Adjective", "Noun", "Determiner"], "B",
     "Concept: a word placed between a possessive and a noun, describing the noun, functions as an adjective.\nStep 1: In 'his half share', half describes share; it is not the pre-determiner use seen in 'half the booty'.\nAnswer: (b)", 45),
    (27, "__Swimming__ is a healthy exercise.", ["Verb", "Gerund", "Adjective", "Adverb"], "B",
     "Concept: an -ing form used as a noun (here the subject) is a gerund.\nAnswer: (b)", 10),
    (28, "I have told you __now and again__ that you must not read such trash.", ["Conjunction", "Preposition", "Noun", "Adverb"], "D",
     "Concept: now and again means occasionally and modifies the verb 'have told'.\nStep 1: It works as an adverb (adverbial phrase).\nAnswer: (d)", 20),
    (29, "He succeeded __by dint of__ perseverance and sheer hard work.", ["Conjunctival phrase", "Adjectival phrase", "Prepositional phrase", "Adverbial phrase"], "C",
     "Concept: by dint of (by means of) is a complex preposition taking a noun object.\nStep 1: It is a prepositional phrase.\nAnswer: (c)", 30),
    (30, "I need you to return __those__ books I lent you last month.", ["Modal", "Determiner", "Noun", "Adjective"], "B",
     "Concept: demonstratives placed before a noun (this, that, these, those) are determiners.\nAnswer: (b)", 25),
]:
    Q(n, WC + sent, opts, key, "Grammar and Usage > Parts of Speech > Word Class", diff, expl)

for n, stem, opts, key, sub, expl, diff in [
    (31, "I will not pay for the goods", ["till he sends me the bill again", "until he sends me the bill again", "if he sends me the bill again", "unless he sends me the bill again"], "D", "Conjunctions",
     "Concept: the sentence states a condition for payment.\nStep 1: 'Unless' expresses the condition (if he does not send the bill again, I will not pay). 'Till' and 'until' mean the same, so neither can be the single correct choice; 'if' reverses the sense.\nAnswer: (d)", 40),
    (32, "I did not buy it", ["because I did not like the look of it", "as far as I did not like the look of it", "anyway I did not like the look of it", "if I did not like the look of it"], "A", "Conjunctions",
     "Concept: the second clause gives the reason.\nStep 1: 'Because' introduces a reason.\nAnswer: (a)", 10),
    (33, "I sent her a bouquet of orchids", ["for which she was absolutely delighted", "with which she was absolutely delighted", "of which she was absolutely delighted", "on which she was absolutely delighted"], "B", "Prepositions",
     "Concept: the idiom is 'delighted with' something.\nStep 1: So the relative clause is 'with which she was absolutely delighted'.\nAnswer: (b)", 30),
    (34, "You must stay inside", ["where it starts raining", "when it starts raining", "because it starts raining", "till it starts raining"], "B", "Conjunctions",
     "Concept: a time clause is needed.\nStep 1: 'When it starts raining' gives the sensible condition for staying inside.\nAnswer: (b)", 10),
    (35, "We must wait", ["until you see the light turn green", "till you see the green light", "because you can see the green light", "unless you see the red signal"], "A", "Conjunctions",
     "Concept: 'wait until' marks the point at which waiting ends.\nStep 1: 'Until you see the light turn green' completes the sentence naturally; 'because' and 'unless you see the red signal' are illogical.\nAnswer: (a)", 35),
]:
    Q(n, CMP + stem, opts, key, f"Grammar and Usage > Fill in the Blanks > {sub}", diff, expl)

for n, opts, key, expl, diff in [
    (36, ["Although it was raining, we had the picnic.", "Although it was raining, still we had the picnic.", "Although it was raining, yet we had the picnic.", "Although it was raining, even then we had the picnic."], "A",
     "Concept: 'although' is not followed by a correlative such as still, yet or even then in the main clause.\nAnswer: (a)", 25),
    (37, ["When I would arrive, I will call you.", "When I shall arrive, I will call you.", "When I will arrive, I will call you.", "When I arrive, I will call you."], "D",
     "Concept: a time clause about the future uses the simple present, not will/shall.\nAnswer: (d)", 15),
    (38, ["Who among you has the answer?", "Whom among you has the answer?", "Whom amongst you has the answer?", "Who amid you has the answer?"], "A",
     "Concept: the pronoun is the subject of 'has', so 'who' is required; 'among' is the right preposition.\nAnswer: (a)", 15),
    (39, ["No sooner than he reached the station the train left.", "No sooner had he reached the station than the train left.", "No sooner he had reached the station than the train left.", "No sooner had he reached the station then the train left."], "B",
     "Concept: 'no sooner' takes inverted word order (had he) and is followed by 'than'.\nAnswer: (b)", 15),
    (40, ["Hardly had I arrived at the airport than the plane departed.", "Scarcely had I arrived at the airport when the plane departed.", "Hardly I had arrived at the airport when the plane departed.", "Scarcely had I arrived at the airport then the plane departed."], "B",
     "Concept: 'hardly/scarcely' take inversion and are followed by 'when' (not than or then).\nAnswer: (b)", 20),
]:
    Q(n, COR, opts, key, "Grammar and Usage > Sentence Improvement > Grammar Correction", diff, expl)

for n, parts, key, sub, expl, diff in [
    (41, ["The project staff are", "working on the weekend", "so as not to delay", "the project any further."], "A", "Spotting Errors > Subject-Verb Agreement",
     "Concept: the intended error is agreement with the collective noun 'staff', treated here as a single body.\nStep 1: 'The project staff is working...' is the intended correction; the other parts are correct.\nAnswer: (a)", 50),
    (42, ["When I saw Arnab", "he said he", "had taken his", "driving test yesterday."], "D", "Spotting Errors > Tenses",
     "Concept: in reported speech, 'yesterday' becomes 'the previous day' (or 'the day before').\nAnswer: (d)", 35),
    (43, ["Of all the players", "it was Ramesh", "who plan his tactics", "with utmost care."], "C", "Spotting Errors > Tenses",
     "Concept: the sentence is in the past ('it was'), and 'plan' does not agree with 'who' (Ramesh).\nStep 1: Correct form: 'who planned his tactics'.\nAnswer: (c)", 20),
    (44, ["Many people in India are", "still not aware", "of India's indigenous fabrics", "that reflects the rich heritage of craftmanship."], "D", "Spotting Errors > Subject-Verb Agreement",
     "Concept: the relative pronoun 'that' refers to the plural 'fabrics'.\nStep 1: Correct form: 'that reflect the rich heritage of craftsmanship'.\nAnswer: (d)", 25),
    (45, ["Meaningful ecological", "affects of the handloom", "sector can be optimized", "through recycling practices."], "B", "Spotting Errors > Word Form and Confusables",
     "Concept: 'affect' is usually a verb; the noun meaning results is 'effects'.\nStep 1: Correct form: 'effects of the handloom'.\nAnswer: (b)", 15),
]:
    sent = " ".join(f"__{p}__ ({c})" for p, c in zip(parts, "abcd"))
    Q(n, ERR + sent, parts, key, f"Grammar and Usage > {sub}", diff, expl)

Q(46, """Read the following pairs:

Active Voice | Passive Voice
I. They laughed at his warnings and objected to all his proposals. | His warnings were laughed at and his proposals were objected to.
II. Do not insult the weak. | You are advised to not insult the weak.

Identify the pair(s) wherein the Passive Voice is correctly stated.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "A",
  "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Voice", 45,
  "Step 1: Pair I correctly passivises both prepositional verbs ('laughed at', 'objected to').\nStep 2: Pair II is not the passive of 'Do not insult the weak'; the standard form is 'Let the weak not be insulted' (and 'to not insult' splits the infinitive).\nAnswer: (a)", pattern=S2)

Q(47, """Read the following pairs:

Direct Speech | Indirect Speech
I. The policeman said to us, "Where are you going?" | The policeman asked where were we going.
II. "Call the first witness", said the Judge. | The Judge said them to call the witness first.

Identify the pair(s) wherein the Indirect Speech is correctly stated.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Narration", 35,
  "Step 1: I should read 'The policeman asked us where we were going' (statement word order); the given form keeps question order.\nStep 2: II should read 'The Judge ordered them to call the first witness'; 'said them' is wrong and 'the witness first' changes the meaning.\nAnswer: (d)", pattern=S2)

Q(48, """Read the following pairs:

Idiom/Phrase | Meaning
I. Have one foot in the grave | To be in the last stage of life
II. Get your feet wet | Establish yourself securely in an establishment
III. Follow suit | Correctly conform to another's action

Identify the pair(s) wherein the meaning is correctly stated.""",
  ["I only", "III only", "I and III", "II and III"], "C",
  "Vocabulary > Idioms and Phrases > Idiom Meaning", 25,
  "Step 1: I and III are correct.\nStep 2: 'Get your feet wet' means to try something new for the first time, so II is wrong.\nAnswer: (c)", pattern=S3)

Q(49, """Read the following pairs:

Group of words | One-word substitution
I. Decayed with usually a very bad or disgusting smell | Putrid
II. Humorous in a clever and often ironic way | Wry
III. In a state of tremulous excitement | Aflutter

Identify the pairs wherein the one-word substitution is correctly stated.""",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "D",
  "Vocabulary > One-word Substitution > One-word Substitution", 40,
  "Step 1: Putrid means decaying with a foul smell; wry means cleverly and often ironically humorous; aflutter means in a state of nervous excitement.\nStep 2: All three pairs are correct.\nAnswer: (d)", pattern=S3)

Q(50, """Fill in the blanks (X, Y) in the following sentences with the appropriate word/phrase given in the brackets:

I. I spent ___X___ (less/the least) money on clothes in the whole family.
II. The people who work the hardest make ___Y___ (a few/the fewest) mistakes.

Identify the words/phrases.""",
  ["I—the least, II—the fewest", "I—the least, II—a few", "I—less, II—a few", "I—less, II—the fewest"], "A",
  "Grammar and Usage > Fill in the Blanks > Vocabulary in Context", 20,
  "Step 1: 'In the whole family' compares with everyone, so the superlative 'the least' fits I.\nStep 2: II pairs with the superlative 'the hardest', so 'the fewest' fits.\nAnswer: (a)")
