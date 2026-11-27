from qfmt import Q, P, F

# NDA I 2024 General Ability Test, Set A (RRAN-A-GAT), Part A English, Q1-50 (booklet pages 2-9)
ANT = "Directions: Each item consists of a sentence with an underlined word followed by four words or groups of words. Select the option that is opposite in meaning to the underlined word.\n\n"
SYN = "Directions: Each item consists of a sentence with an underlined word followed by four words/group of words. Select the option that is nearest in meaning to the underlined word.\n\n"
COMP = "Directions: The item features one part of a sentence followed by four alternatives. Complete the sentence by choosing the correct alternative.\n\n"
IDM = "Directions: An idiom/phrase is given followed by four alternative meanings. Select the most appropriate meaning.\n\n"
PARTS = "Directions: The parts of the sentence have been jumbled and labelled P, Q, R and S. Rearrange the parts to form a meaningful sentence.\n\n"
POS = "Directions: The sentence has a word underlined. Find which word class the underlined word belongs to.\n\n"
AW = "Vocabulary > Antonyms > Contextual Meaning"
SC = "Vocabulary > Synonyms > Contextual Meaning"
CL = "Reading Comprehension > Cloze Test > Passage-based Blanks"
GC = "Grammar and Usage > Sentence Improvement > Grammar Correction"
PV = "Vocabulary > Idioms and Phrases > Phrasal Verbs"
PR = "Grammar and Usage > Fill in the Blanks > Prepositions"
IM = "Vocabulary > Idioms and Phrases > Idiom Meaning"
SP = "Sentence Organisation > Ordering of Sentence Parts > Sentence Parts"
WC = "Grammar and Usage > Parts of Speech > Word Class"
RC = "Reading Comprehension > Comprehension Passages > "
LS = "Linked Item Set"
ORD = "Ordering/Sequence"

Q(1, ANT + "Mohan was living in a __deplorable__ condition.", ["reprehensible", "opprobrious", "despicable", "commendable"], "D", AW, 15,
  "Deplorable means shockingly bad; its opposite is commendable. The other three are near-synonyms.\nAnswer: (d)", theme="Deplorable")
Q(2, ANT + "These exercises will __counteract__ the effects of stress and tension.", ["exacerbate", "foil", "thwart", "contravene"], "A", AW, 25,
  "To counteract is to reduce or neutralise an effect; to exacerbate is to make it worse. Foil and thwart are synonyms.\nAnswer: (a)", theme="Counteract")
Q(3, ANT + "You have to __persevere__ with difficult students.", ["give up", "persist", "carry on", "stand firm"], "A", AW, 10,
  "To persevere is to keep trying; the opposite is to give up.\nAnswer: (a)", theme="Persevere")
Q(4, ANT + "Their new colour scheme is __hideous__.", ["appalling", "beautiful", "grotesque", "macabre"], "B", AW, 10,
  "Hideous means very ugly; the opposite is beautiful.\nAnswer: (b)", theme="Hideous")
Q(5, ANT + "Everywhere they go, they __squander__ their earnings.", ["fritter away", "splurge", "squabble", "manage"], "D", AW, 20,
  "To squander is to waste money; of the options, the opposite sense is to manage (use carefully). Fritter away and splurge are synonyms.\nAnswer: (d)", theme="Squander")

P("cloze", "The changing climate (cloze)", r"""Directions: In this section, there is a passage having some blank spaces, each blank space is followed by four individual words or group of words. Select a word or group of words you consider the most appropriate for filling the blank space.

The Earth's climate is ___(6)___ changing and evolving. Some of ___(7)___ changes have been due to natural causes but others can be attributed to ___(8)___ activities such as deforestation, emissions from industry and transport, etc., which have led to the ___(9)___ of gases and aerosols in ___(10)___ atmosphere. These gases are known as greenhouse gases because they trap heat and ___(11)___ air temperatures near the ground, acting like a greenhouse on the surface of the ___(12)___. In order to create and strengthen the scientific and analytical capacity ___(13)___ assessment of climate change in the country, different studies under Climate Change Action Programme ___(14)___. Many important bilateral and multilateral meetings and negotiations are held ___(15)___ regular intervals.""")


def cz(n, opts, key, expl, d=20, th=""):
    Q(n, f"Blank ({n}): choose the most appropriate option.", opts, key, CL, d, expl + "\nAnswer: (" + key.lower() + ")", passage="cloze", pattern=LS, theme=th)


cz(6, ["passionately", "continually", "deadly", "thoughtfully"], "B", "The climate is always changing: 'continually changing and evolving'.", 10, "Continually")
cz(7, ["these", "those", "this", "that"], "A", "'These changes' refers to the changes just mentioned; a plural noun needs these/those, and the near reference takes 'these'.", 15, "These changes")
cz(8, ["practical", "geological", "human", "animal"], "C", "Deforestation and emissions from industry are human activities, set against natural causes.", 10, "Human activities")
cz(9, ["assimilation", "absolution", "collection", "accumulation"], "D", "Gases build up in the atmosphere: 'accumulation of gases'.", 15, "Accumulation")
cz(10, ["an", "a", "the", "no article"], "C", "There is only one atmosphere being referred to, so 'the atmosphere'.", 10, "The atmosphere")
cz(11, ["raise", "hike", "rise", "balance"], "A", "A transitive verb is needed with the object 'air temperatures': greenhouse gases raise air temperatures. 'Rise' is intransitive.", 25, "Raise vs rise")
cz(12, ["crust", "core", "mantle", "planet"], "D", "The greenhouse effect acts on the surface of the planet.", 10, "Surface of the planet")
cz(13, ["for", "of", "in", "to"], "A", "Capacity is built for a purpose: 'capacity for assessment'.", 20, "Capacity for")
cz(14, ["are developed", "are initiated", "have developed", "have initiated"], "B", "The studies are acted upon, so a passive is needed; studies are 'initiated' (begun). The active forms lack an object.", 25, "Passive: are initiated")
cz(15, ["with", "at", "in", "on"], "B", "The fixed phrase is 'at regular intervals'.", 10, "At regular intervals")

Q(16, COMP + "He paused", ["with a few moments.", "for a few moments.", "by a few moments.", "into a few moments."], "B", PR, 10,
  "Duration takes 'for': paused for a few moments.\nAnswer: (b)", theme="For with duration")
Q(17, COMP + "Late at night, our car", ["broke down on the highway.", "broke up on the highway.", "broke into the highway.", "broke out on the highway."], "A", PV, 10,
  "A vehicle that stops working 'breaks down'.\nAnswer: (a)", theme="Break down")
Q(18, COMP + "All the countries signed the treaty", ["beneath Germany and France.", "except Germany and France.", "among Germany and France.", "during Germany and France."], "B", PR, 10,
  "'All ... except' excludes the named countries.\nAnswer: (b)", theme="Except")
Q(19, COMP + "I reminded her", ["to turn off the lights at night.", "to call off the lights at night.", "to drop off the lights at night.", "to break off the lights at night."], "A", PV, 10,
  "Lights are switched or 'turned off'.\nAnswer: (a)", theme="Turn off")
Q(20, COMP + "They told us about the woman", ["whom lived next door.", "which lived next door.", "who lived next door.", "whose lived next door."], "C", GC, 10,
  "A person as the subject of the relative clause takes 'who'.\nAnswer: (c)", theme="Relative pronoun who")
Q(21, COMP + "I'll see you", ["at the end of February.", "on the end of February.", "along the end of February.", "for the end of February."], "A", PR, 10,
  "The fixed phrase is 'at the end of'.\nAnswer: (a)", theme="At the end of")
Q(22, COMP + "I dislike films", ["who have sad endings.", "that have sad endings.", "whose have sad endings.", "whom have sad endings."], "B", GC, 10,
  "For things, the relative pronoun is 'that' (or 'which'), not 'who'.\nAnswer: (b)", theme="Relative pronoun that")
Q(23, COMP + "The thieves denied", ["having stealing the money.", "stealing the money.", "had stolen the money.", "having to steal the money."], "B", GC, 20,
  "'Deny' is followed by a gerund: denied stealing (or having stolen) the money.\nAnswer: (b)", theme="Deny plus gerund")
Q(24, COMP + "Did you", ["drop out to see Sunita on your way home?", "drop in to see Sunita on your way home?", "drop behind to see Sunita on your way home?", "drop away to see Sunita on your way home?"], "B", PV, 15,
  "To 'drop in' is to pay a brief, informal visit.\nAnswer: (b)", theme="Drop in")
Q(25, COMP + "Would you like to", ["meeting her?", "meet her?", "met her?", "meet with her?"], "B", GC, 10,
  "'Would you like to' takes the bare infinitive: meet her.\nAnswer: (b)", theme="Like to plus infinitive")

Q(26, IDM + "Be bad news", ["feelings of hate", "someone who behaves in a dishonest way", "someone who is considered undesirable", "to be ill"], "C", IM, 20,
  "Calling a person 'bad news' means they are likely to cause trouble and are best avoided.\nAnswer: (c)", theme="Bad news")
Q(27, IDM + "Back to the drawing board", ["to draw comparisons", "to be a member of planning group", "to start planning again because the previous plan has failed", "to be fast at understanding a situation"], "C", IM, 10,
  "Going back to the drawing board means starting again after a failed attempt.\nAnswer: (c)", theme="Back to the drawing board")
Q(28, IDM + "Be in the eye of the storm", ["to look at something quickly", "to fail miserably at a sport", "to see something that you do not want to see", "to be in the midst of a controversy"], "D", IM, 15,
  "To be in the eye of the storm is to be at the centre of a controversy or crisis.\nAnswer: (d)", theme="Eye of the storm")
Q(29, IDM + "Life in the fast lane", ["to lead a selfless life", "to have a happy life without complaints", "life without money or comforts", "an exciting and eventful lifestyle"], "D", IM, 10,
  "Life in the fast lane is a busy, exciting lifestyle.\nAnswer: (d)", theme="Fast lane")
Q(30, IDM + "To pass the buck", ["to collect money from a group of people", "to shift the responsibility of something to someone", "to have a short conversation with someone", "to have the credentials for a particular job"], "B", IM, 10,
  "To pass the buck is to shift responsibility onto someone else.\nAnswer: (b)", theme="Pass the buck")

Q(31, PARTS + "P: include basic freedoms\nQ: the fundamental rights are\nR: guaranteed to the individual\nS: basic rights and",
  ["QSPR", "QRSP", "SQRP", "RQSP"], "A", SP, 15,
  "The fundamental rights are (Q) basic rights and (S) include basic freedoms (P) guaranteed to the individual (R).\nAnswer: (a)", pattern=ORD, theme="Fundamental rights")
Q(32, PARTS + "P: for many millennia\nQ: been in the making\nR: of a historical process that has\nS: the Indian nation is the product",
  ["SRQP", "SQPR", "PRSQ", "RSQP"], "A", SP, 15,
  "The Indian nation is the product (S) of a historical process that has (R) been in the making (Q) for many millennia (P).\nAnswer: (a)", pattern=ORD, theme="Indian nation")
Q(33, PARTS + "P: an epoch that was imbued\nQ: for its people the start of\nR: with a new vision\nS: India's Independence represented",
  ["SQPR", "QRPS", "SPQR", "RQSP"], "A", SP, 15,
  "India's Independence represented (S) for its people the start of (Q) an epoch that was imbued (P) with a new vision (R).\nAnswer: (a)", pattern=ORD, theme="India's Independence")
Q(34, PARTS + "P: science and mathematics exhibition\nQ: for a discussion on the forthcoming\nR: to be present before the Principal\nS: all students have been instructed",
  ["SQPR", "RPQS", "SRQP", "QPRS"], "C", SP, 15,
  "All students have been instructed (S) to be present before the Principal (R) for a discussion on the forthcoming (Q) science and mathematics exhibition (P).\nAnswer: (c)", pattern=ORD, theme="Exhibition instructions")
Q(35, PARTS + "P: two bowlers and two batsmen respectively\nQ: to the new team\nR: with the selection of another player\nS: the team now has",
  ["QPRS", "SQRP", "RQSP", "RPSQ"], "C", SP, 20,
  "With the selection of another player (R) to the new team (Q), the team now has (S) two bowlers and two batsmen respectively (P).\nAnswer: (c)", pattern=ORD, theme="New team selection")

Q(36, POS + "You are most welcome to visit my humble __abode__.", ["Noun", "Adjective", "Adverb", "Participle"], "A", WC, 10,
  "'Abode' (a home) is the object of 'visit', a noun.\nAnswer: (a)", theme="Noun")
Q(37, POS + "The situation is __beyond__ our control.", ["Adjective", "Adverb", "Conjunction", "Preposition"], "D", WC, 15,
  "'Beyond' governs the noun phrase 'our control', so it is a preposition.\nAnswer: (d)", theme="Preposition beyond")
Q(38, POS + "I didn't tell him anything __except__ that I needed the money.", ["Adjective", "Adverb", "Preposition", "Conjunction"], "D", WC, 30,
  "'Except (that)' introduces a full clause ('I needed the money'), so here it works as a conjunction meaning 'only that'.\nAnswer: (d)", theme="Except as conjunction")
F(38, "'except that' + clause: dictionaries label it a conjunction; some keys call 'except' a preposition here")
Q(39, POS + "He dry-cleaned my coat __nicely__.", ["Adjective", "Adverb", "Relative pronoun", "Conjunction"], "B", WC, 5,
  "'Nicely' describes how the action was done: an adverb.\nAnswer: (b)", theme="Adverb of manner")
Q(40, POS + "Would you like to buy __this__ new item?", ["Determiner", "Conjunction", "Interjection", "Adjective"], "A", WC, 20,
  "'This' before a noun phrase points it out: a demonstrative determiner.\nAnswer: (a)", theme="Demonstrative determiner")

P("biota", "The biotic community", r"""Directions: Read the following passage carefully and answer the items based on it. You are required to select your answers based solely on the contents of the passage and the opinion of the author.

The grouping or assemblage of plants, animals and microbes we observe when we study a natural forest, a grassland, a pond, a coral reef or some other undisturbed area, is referred to as the area's biota or biotic community. The plant portion of the biotic community includes all vegetation, from large trees down through to microscopic algae. Likewise, the animal portion includes everything from large mammals, birds, reptiles and amphibians through to earthworms, tiny insects and mites. Microbes encompass a large array of microscopic bacteria, fungi and protozoans. Thus, the biotic community comprises a plant community, an animal community and a microbial community.

The particular kind of biotic community found in a given area is, in large part, determined by abiotic factors such as the amount of water or moisture present, the temperature, the salinity, or the type of soil in the area. These abiotic factors both support and limit the particular community. For example, a relative lack of available moisture prevents the growth of most species of plants, but supports certain species, such as cacti; these kinds of areas are deserts. Land with plenty of available moisture and a suitable temperature supports forests. The presence of water is the major factor that sustains aquatic communities.

The first step in investigating a biotic community may be simply to catalogue all the species present. Species are the different kinds of plants, animals and microbes in the community. A given species includes all those individuals which have a strong similarity in appearance to one another and which are distinct in appearance from other such groups. Each species in a biotic community is represented by a certain population — that is, by a certain number of individuals that make up the interbreeding, reproducing group.""")

Q(41, "Which one of the following does *not* belong to the biotic community?", ["Water", "Human", "Protozoa", "Bush"], "A", RC + "Factual Detail", 10,
  "The biotic community is made of plants, animals and microbes; water is an abiotic factor.\nAnswer: (a)", passage="biota", pattern=LS, theme="Biotic vs abiotic")
Q(42, "The nature of the biotic community largely depends on:\n\n1. Biotic components\n2. Abiotic components\n\nSelect the correct answer using the code given below:",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "B", RC + "Factual Detail", 20,
  "The passage says the kind of biotic community is 'in large part, determined by abiotic factors'.\nAnswer: (b)", passage="biota", pattern=LS, theme="What shapes a community")
Q(43, "Which of the following is *not* an abiotic factor?", ["Temperature", "Humidity", "Algae", "Moisture"], "C", RC + "Factual Detail", 10,
  "Algae are part of the plant portion of the biotic community; the others are abiotic factors.\nAnswer: (c)", passage="biota", pattern=LS, theme="Abiotic factors")
Q(44, "In the passage, the word 'aquatic community' refers to:", ["Biotic community inhabiting the land", "Biotic community found in water", "Biotic community found in the air", "Assemblage of rain and moisture"], "B", RC + "Vocabulary in Context", 5,
  "Aquatic communities are those sustained by water: communities living in water.\nAnswer: (b)", passage="biota", pattern=LS, theme="Aquatic community")
Q(45, "Species are defined on the basis of:", ["Similarities only", "Differences only", "Both similarities and differences", "None of the above"], "C", RC + "Factual Detail", 15,
  "A species is a group of individuals strongly similar to one another and distinct from other groups: both similarity and difference.\nAnswer: (c)", passage="biota", pattern=LS, theme="Defining a species")

Q(46, SYN + "The king's son was __banished__ due to the political rivalry.", ["deported", "called back", "accepted", "notified"], "A", SC, 10,
  "To banish is to send someone away from a country; deported is closest.\nAnswer: (a)", theme="Banished")
Q(47, SYN + "He gave a __dazzling__ performance at the opera.", ["brilliant", "dismal", "pathetic", "puerile"], "A", SC, 5,
  "A dazzling performance is brilliant.\nAnswer: (a)", theme="Dazzling")
Q(48, SYN + "She __rebuffed__ all suggestions from her friends.", ["took", "rejected", "criticized", "granted"], "B", SC, 10,
  "To rebuff is to reject bluntly.\nAnswer: (b)", theme="Rebuffed")
Q(49, SYN + "He __disowned__ his royal legacy and became a commoner.", ["accepted", "abandoned", "allowed", "questioned"], "B", SC, 15,
  "To disown is to refuse to acknowledge as one's own; abandoned is closest.\nAnswer: (b)", theme="Disowned")
Q(50, SYN + "The public was __sceptical__ about the new government policy.", ["hopeful", "anxious", "doubtful", "expectant"], "C", SC, 5,
  "Sceptical means doubtful.\nAnswer: (c)", theme="Sceptical")
