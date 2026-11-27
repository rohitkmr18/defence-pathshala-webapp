from qfmt import Q, P, F

# NDA II 2024 General Ability Test, Set A (SURN-A-GAT), Part A English, Q1-50
ANT = "Directions: Each item consists of a sentence with an underlined word followed by four words or group of words. Select the option that is opposite in meaning to the underlined word.\n\n"
SYN = "Directions: Each item consists of a sentence with an underlined word followed by four words. Select the option that is nearest in meaning to the underlined word.\n\n"
COMP = "Directions: The item features one part of a sentence followed by four alternatives. Complete the sentence by choosing the correct alternative.\n\n"
IDM = "Directions: An idiom/phrase is given followed by four alternative meanings. Select the most appropriate meaning.\n\n"
PARTS = "Directions: The parts of the sentence have been jumbled and labelled P, Q, R and S. Rearrange the parts to form a meaningful sentence.\n\n"
POS = "Directions: The sentence has a word underlined. Find which word class the underlined word belongs to.\n\n"
AW = "Vocabulary > Antonyms > Contextual Meaning"
SC = "Vocabulary > Synonyms > Contextual Meaning"
CL = "Reading Comprehension > Cloze Test > Passage-based Blanks"
GC = "Grammar and Usage > Sentence Improvement > Grammar Correction"
IM = "Vocabulary > Idioms and Phrases > Idiom Meaning"
SP = "Sentence Organisation > Ordering of Sentence Parts > Sentence Parts"
WC = "Grammar and Usage > Parts of Speech > Word Class"
RC = "Reading Comprehension > Comprehension Passages > "
LS = "Linked Item Set"
ORD = "Ordering/Sequence"

Q(1, ANT + "All human beings are __fallible__", ["frail", "erring", "mortal", "perfect"], "D", AW, 15,
  "Fallible means capable of making mistakes; its opposite is perfect (infallible). 'Erring' is a synonym.\nAnswer: (d)", theme="Fallible")
Q(2, ANT + "His words were __vague__", ["identical", "obscure", "precise", "imperceptible"], "C", AW, 10,
  "Vague means unclear; the opposite is precise.\nAnswer: (c)", theme="Vague")
Q(3, ANT + "She performed all her duties __conscientiously__", ["assiduously", "carelessly", "painstakingly", "scrupulously"], "B", AW, 15,
  "Conscientiously means carefully and diligently; the opposite is carelessly. The other options are synonyms.\nAnswer: (b)", theme="Conscientiously")
Q(4, ANT + "These risks are __incidental__ to the work of a firefighter", ["essential", "adventitious", "serendipitous", "subsidiary"], "A", AW, 30,
  "Incidental means occurring as a minor accompaniment; its opposite is essential (central to it).\nAnswer: (a)", theme="Incidental")
Q(5, ANT + "She has always been __disdainful__ of poor people", ["reverential", "derisive", "supercilious", "insolent"], "A", AW, 20,
  "Disdainful means showing contempt; the opposite is reverential (showing deep respect).\nAnswer: (a)", theme="Disdainful")

P("cloze", "Agriculture and natural selection (cloze)", r"""Directions: In this section, there is a passage that has some blank spaces, each with four words or group of words. Select whichever word or group of words you consider the most appropriate for the blank space.

Most of our food comes from agriculture, so we tend to believe that it is ___(6)___ of natural biota. This is not true. In nature, ___(7)___ plants and animals ___(8)___ to the rigours of natural selection. Only the fittest survive. ___(9)___ wild populations have numerous traits for competitiveness, resistance to parasites, ___(10)___ to adverse conditions, ___(11)___ other aspects of vigour. In contrast, populations grown for many ___(12)___ under the pampered conditions of agriculture tend to lose these traits, because they ___(13)___ for production, not resilience. For example, a high-producing plant ___(14)___ lacks resistance to drought is ___(15)___ and the resistance to drought is ignored. Also, in the process of breeding plants for maximum production, all genetic variation is eliminated.""")

def cz(n, opts, key, expl, d=20, th=""):
    Q(n, f"Blank ({n}): choose the most appropriate option.", opts, key, CL, d, expl + "\nAnswer: (" + key.lower() + ")", passage="cloze", pattern=LS, theme=th)

cz(6, ["independent", "dependent", "relevant", "consequent"], "A", "The writer says 'This is not true', so the belief being rejected is that agriculture is independent of natural biota.", 25, "Independent of natural biota")
cz(7, ["the", "both", "some", "among"], "B", "'Both plants and animals' names the two groups together.", 15, "Both plants and animals")
cz(8, ["had been continuously subjected", "will be continuously subject", "continuously subjected", "are continuously subjected"], "D", "The passage states a general fact in the present tense: they 'are continuously subjected' to natural selection.", 20, "Present passive")
cz(9, ["Consequently", "Inadvertently", "Although", "Since"], "A", "Because only the fittest survive, wild populations consequently have many competitive traits.", 20, "Consequently")
cz(10, ["withdrawal", "tolerance", "adaptable", "compliance"], "B", "A noun parallel to 'resistance' is needed: 'tolerance to adverse conditions'.", 20, "Tolerance")
cz(11, ["and", "with", "by", "upon"], "A", "'and' joins the last item of the list.", 10, "And in a list")
cz(12, ["eras", "epochs", "periods", "generations"], "D", "Crop populations are bred over many generations.", 15, "Generations")
cz(13, ["had selected", "have selected", "are selected", "might select"], "C", "The populations are acted on, so passive present 'are selected' is needed.", 25, "Passive present")
cz(14, ["whichever", "whom", "that", "whenever"], "C", "The relative pronoun 'that' introduces the defining clause about the plant.", 15, "Relative pronoun that")
cz(15, ["heated", "irrigated", "showered", "deserted"], "B", "A plant lacking drought resistance is kept alive by being irrigated.", 15, "Irrigated")

Q(16, COMP + "Preeti suggests", ["that I ask to your advice", "that I had asked your advice", "that I can have asked your advice", "that I ask your advice"], "D", GC, 25,
  "'Suggest' takes a that-clause with the base (subjunctive) verb: 'suggests that I ask your advice'.\nAnswer: (d)", theme="Suggest with subjunctive")
Q(17, COMP + "We saw", ["the older of all monuments in the city", "the old of all monuments in the city", "the oldest monument in the city", "an oldest of all monuments in the city"], "C", GC, 10,
  "Comparing with all others needs the superlative with 'the'.\nAnswer: (c)", theme="Superlative")
Q(18, COMP + "Since you have been touring all day", ["you must be tired", "you ought to have been tired", "you could had been tired", "you might not be tired"], "A", GC, 15,
  "'Must' expresses a logical conclusion from evidence.\nAnswer: (a)", theme="Must for deduction")
Q(19, COMP + "His condition is serious, but", ["it should be worse", "it ought to be worse", "it could be worse", "it had been going to be worse"], "C", GC, 15,
  "'It could be worse' means the situation is not as bad as possible.\nAnswer: (c)", theme="Could be worse")
Q(20, COMP + "I hope the bus comes soon because", ["we waited for half an hour", "we have been waiting for half an hour", "we waiting for half an hour", "we could have been waiting for half an hour"], "B", GC, 15,
  "An action that began in the past and is still going on takes the present perfect continuous.\nAnswer: (b)", theme="Present perfect continuous")
Q(21, COMP + "Someone", ["has spilt juice on the sofa", "should have spilt juice on the sofa", "have spilt juice on the sofa", "would spilt juice on the sofa"], "A", GC, 15,
  "'Someone' is singular and the result is visible now: 'has spilt'.\nAnswer: (a)", theme="Singular indefinite pronoun")
Q(22, COMP + "What would you do", ["if you found your lost toy?", "if you will have found your lost toy?", "if you would found your lost toy?", "if you have find your lost toy?"], "A", GC, 15,
  "The second conditional pairs 'would do' with the simple past 'found'.\nAnswer: (a)", theme="Second conditional")
Q(23, COMP + "If I were you", ["I shouldn't buy that dress", "I wouldn't buy that dress", "I weren't buying that dress", "I mustn't buying that dress"], "B", GC, 15,
  "Advice with 'If I were you' takes 'would/wouldn't'.\nAnswer: (b)", theme="If I were you")
Q(24, COMP + "I wish", ["I could help you", "I ought to help you", "I did help you", "I must help you"], "A", GC, 15,
  "A present wish takes a past form: 'I wish I could help you'.\nAnswer: (a)", theme="Wish with could")
Q(25, COMP + "The efforts of the security services have not been quite", ["upto the incredibility", "up-take", "up-tight", "upto the mark"], "D", GC, 15,
  "'Up to the mark' means of the expected standard.\nAnswer: (d)", theme="Up to the mark")

Q(26, IDM + "A white lie", ["An offensive way of describing something", "To do something completely impossible", "A lie that is absolutely and universally true", "A lie that you tell to avoid hurting someone"], "D", IM, 5,
  "A white lie is a harmless lie told to spare someone's feelings.\nAnswer: (d)", theme="White lie")
Q(27, IDM + "Bad blood", ["Feelings of hatred between people", "A situation which goes from bad to worse", "A fatal accident", "To accept the unpleasant situation"], "A", IM, 10,
  "Bad blood is ill feeling or hostility between people.\nAnswer: (a)", theme="Bad blood")
Q(28, IDM + "Count your blessings", ["to start to understand how badly something has affected you", "an event which gradually becomes worse", "to be grateful for good things in your life", "something that you say in order to warn someone"], "C", IM, 5,
  "To count one's blessings is to be thankful for the good things one has.\nAnswer: (c)", theme="Count your blessings")
Q(29, IDM + "Have the last laugh", ["to be the worst example of something", "to succeed when others thought that you would not", "to solve all the problems of life", "to laugh at someone secretly"], "B", IM, 10,
  "To have the last laugh is to be proved right or succeed in the end after being doubted.\nAnswer: (b)", theme="Last laugh")
Q(30, IDM + "Sit on the fence", ["to make someone suddenly notice you", "to fail completely", "to delay making a decision", "to behave very badly"], "C", IM, 10,
  "To sit on the fence is to avoid taking sides or deciding.\nAnswer: (c)", theme="Sit on the fence")

Q(31, PARTS + "P: good quality elementary education conforming\nQ: as a fundamental right of all children\nR: the Right to Education Act (RTE) mandates\nS: to the standards and norms specified in the Act",
  ["Q S P R", "R P S Q", "R Q S P", "S Q P R"], "B", SP, 20,
  "The Right to Education Act (RTE) mandates (R) good quality elementary education conforming (P) to the standards and norms specified in the Act (S) as a fundamental right of all children (Q).\nAnswer: (b)", pattern=ORD, theme="RTE Act")
Q(32, PARTS + "P: the conflicts and disputes in their mind\nQ: music not only relieves the burden\nR: on children and the young\nS: but also alleviates",
  ["Q R S P", "P S R Q", "Q P R S", "P Q R S"], "A", SP, 15,
  "Music not only relieves the burden (Q) on children and the young (R) but also alleviates (S) the conflicts and disputes in their mind (P).\nAnswer: (a)", pattern=ORD, theme="Music relieves burden")
Q(33, PARTS + "P: but it is virtually covered by a dome-shaped\nQ: Antarctica is a continent\nR: nearly twice as large as Australia\nS: ice sheet nearly 2 miles thick",
  ["Q R P S", "S P R Q", "Q S P R", "S Q R P"], "A", SP, 15,
  "Antarctica is a continent (Q) nearly twice as large as Australia (R) but it is virtually covered by a dome-shaped (P) ice sheet nearly 2 miles thick (S).\nAnswer: (a)", pattern=ORD, theme="Antarctica")
Q(34, PARTS + "P: the global economic weight from the advanced economies\nQ: that there was a major shift in\nR: and Central Bank Governors, in recognition of the fact\nS: the G20 was formed in 1999, as a forum of Finance Ministers",
  ["S P Q R", "P Q R S", "Q R S P", "S R Q P"], "D", SP, 20,
  "The G20 was formed in 1999, as a forum of Finance Ministers (S) and Central Bank Governors, in recognition of the fact (R) that there was a major shift in (Q) the global economic weight from the advanced economies (P).\nAnswer: (d)", pattern=ORD, theme="Formation of G20")
Q(35, PARTS + "P: aquaculture nation in the world and\nQ: India's products are exported to many nations\nR: fish producing and the second largest\nS: India is the third largest",
  ["S R P Q", "Q P R S", "R P Q S", "P Q R S"], "A", SP, 15,
  "India is the third largest (S) fish producing and the second largest (R) aquaculture nation in the world and (P) India's products are exported to many nations (Q).\nAnswer: (a)", pattern=ORD, theme="India's fisheries")

Q(36, POS + "__Adders__ are the only poisonous snakes found across Britain", ["Noun", "Adjective", "Adverb", "Determiner"], "A", WC, 10,
  "Adders (a kind of snake) is the subject noun.\nAnswer: (a)", theme="Noun")
Q(37, POS + "She spoke to him once __since__ he has been in town", ["Adjective", "Adverb", "Conjunction", "Preposition"], "C", WC, 25,
  "'Since' introduces a full clause ('he has been in town'), so it is a conjunction.\nAnswer: (c)", theme="Since as conjunction")
Q(38, POS + "I don't really want to go. Besides, it's too late __now__", ["Adjective", "Adverb", "Preposition", "Conjunction"], "B", WC, 10,
  "'Now' is an adverb of time.\nAnswer: (b)", theme="Adverb of time")
Q(39, POS + "Look at __that__ man over there", ["Adverb", "Conjunction", "Determiner", "Article"], "C", WC, 15,
  "'That' before a noun is a demonstrative determiner.\nAnswer: (c)", theme="Demonstrative determiner")
Q(40, POS + "The plane is ready for __take-off__", ["Noun", "Conjunction", "Verb", "Gerund"], "A", WC, 15,
  "'Take-off' after the preposition 'for' is a compound noun.\nAnswer: (a)", theme="Compound noun")

P("plague", "Globalisation of disease", r"""Directions: Read the passage and answer the items based on it, using the contents of the passage and the opinion of the author only.

We live in a time when globalisation is rapidly encompassing travel, information, trade and investment. The internet ties people together in ways unimagined a few years ago. The globalisation of health, however, remains an elusive goal, similar to the globalisation of economic well-being. Laurie Garrett, in The Coming Plague, describes an unwelcome form of globalisation: the globalisation of disease. Garrett examines the recent history of emerging diseases such as AIDS, Ebola, Hantavirus, Rift Valley Fever, Legionnaires' disease, and others. She also explains the resurgence of familiar diseases like tuberculosis, cholera, and pneumonia as a consequence of the widespread and unwise use of antibiotics. Many of the new diseases are clearly linked to changes in land use, which brings humans into close contacts with rodents or other animals that harbour viruses previously unknown to medicine and often deadly to humans. Resurgent diseases, by contrast, are a creation of our medical practice. By treating people with antibiotics without restraint, we unknowingly select strains that are immune to the antibiotics and that pass on their resistant genes to unrelated bacteria by way of plasmid transfer. The heroes of her book are the women and men on the frontlines of epidemiology. Garrett makes a plea for a greater commitment from our universities, medical schools, and government agencies to train workers who will be capable of recognizing new diseases and who will be able to move about equally well in the laboratory, the hospital and the field in pursuit of knowledge and public-health intervention around the world.""")

Q(41, "What according to the passage is the 'unwelcome form of the globalization'?\n\n1. Globalization of the diseases\n2. Elusive goal of globalization\n3. History of fatal diseases\n4. Selective use of antibiotics\n\nSelect the correct answer using the code given below:",
  ["1 only", "2, 3 and 4", "3 only", "1 and 4"], "A", RC + "Factual Detail", 10,
  "The passage names 'an unwelcome form of globalisation: the globalisation of disease'.\nAnswer: (a)", passage="plague", pattern=LS, theme="Unwelcome globalisation")
Q(42, "According to the passage, globalisation of health has become imperative due to",
  ["the globalisation of diseases", "public health intervention", "the creation of new medical systems", "the indiscriminate use of antibiotics"], "A", RC + "Inference", 25,
  "Because diseases now spread globally, health action must also be global.\nAnswer: (a)", passage="plague", pattern=LS, theme="Why global health matters")
Q(43, "According to the passage, resurgent diseases are affected by:\n\n1. Medical practices\n2. Overuse of antibiotics\n3. Emergence of new strains\n\nSelect the correct answer using the code given below:",
  ["1 only", "2 only", "1 and 3 only", "1, 2 and 3"], "D", RC + "Factual Detail", 25,
  "Resurgent diseases are 'a creation of our medical practice': unrestrained antibiotic use selects resistant strains. All three are named.\nAnswer: (d)", passage="plague", pattern=LS, theme="Causes of resurgent diseases")
Q(44, "According to the passage, many new diseases are emerging due to change in land use because",
  ["humans are coming in contact with unfamiliar viruses", "urbanisation makes pathogens proliferate", "humans become adaptive and pass on their genes to related bacteria by way of plasmid transfer", "humans are inadvertently releasing new viruses"], "A", RC + "Factual Detail", 15,
  "Land-use change brings humans into contact with animals harbouring viruses previously unknown to medicine.\nAnswer: (a)", passage="plague", pattern=LS, theme="Land use and new diseases")
Q(45, 'What is the meaning of the word "epidemiology" in the passage?',
  ["The historical study of the spread of diseases", "The scientific study of the spread and control of diseases", "The scientific study of the invention and uses of drugs", "The scientific study of the uses of drugs"], "B", RC + "Vocabulary in Context", 10,
  "Epidemiology studies how diseases spread and how they can be controlled.\nAnswer: (b)", passage="plague", pattern=LS, theme="Epidemiology")

Q(46, SYN + "Sages and seers have __cautioned__ that the path towards enlightenment is full of illusory traps", ["reasoned", "admitted", "warned", "refused"], "C", SC, 5,
  "To caution is to warn.\nAnswer: (c)", theme="Cautioned")
Q(47, SYN + "The officer reported the details of the mission in a __monotonous__ manner", ["dull", "happy", "disturbed", "enthusiastic"], "A", SC, 10,
  "Monotonous means dull and lacking variety.\nAnswer: (a)", theme="Monotonous")
Q(48, SYN + "There are many __elusive__ questions in philosophy", ["clear", "baffling", "paramount", "truthful"], "B", SC, 20,
  "Elusive questions are hard to grasp or answer; 'baffling' is closest.\nAnswer: (b)", theme="Elusive")
Q(49, SYN + "Cleaning this mess is a __mammoth__ task", ["huge", "quick", "easy", "intelligent"], "A", SC, 5,
  "Mammoth means huge.\nAnswer: (a)", theme="Mammoth")
Q(50, SYN + "The police department's image was __tarnished__ after the high-profile murder case", ["enhanced", "tainted", "restored", "assigned"], "B", SC, 10,
  "Tarnished means damaged in reputation, i.e. tainted.\nAnswer: (b)", theme="Tarnished")
