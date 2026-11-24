from qfmt import Q, P, F

# NDA I 2025 General Ability Test, Set A (AEBC-A-GAT), Part A English, Q1-50
RC = "Reading Comprehension > Comprehension Passages > "
NAR = "Directions: The item has a sentence in direct or indirect speech with four options. One of the options converts it correctly. Select the correct option.\n\n"
COR = "Directions: The item has four sentences, one of which is correct. Find the correct option.\n\n"
PAIR = "Directions: In the following item, a pair of words is provided. Select the option that most appropriately describes the meaning of both the words.\n\n"
SYN = "Directions: A sentence is given with a word that is underlined, followed by four options. Select the option that is nearest in meaning to the underlined word.\n\n"
SEQ = "Directions: The item consists of six sentences of a passage. The first and sixth sentences are given as S1 and S6. The middle four sentences have been jumbled and labelled P, Q, R and S. Find the proper sequence of the four sentences.\n\n"
DM = "Directions: The sentence uses a discourse marker/expression to make it complete. Identify the most appropriate discourse marker/expression.\n\n"
DEF = "Directions: A word is given, followed by four options. Identify its correct meaning.\n\n"
PARTS = "Directions: The parts of the sentence have been jumbled and labelled P, Q, R and S. Select the option that sequences the parts correctly.\n\n"
FIB = "Directions: The sentence has a blank space followed by four options. Select the most appropriate option to fill in the blank.\n\n"
ORD = "Ordering/Sequence"
LS = "Linked Item Set"
WM = "Vocabulary > Synonyms > Word Meaning"
FC = "Grammar and Usage > Fill in the Blanks > Conjunctions"
SP = "Sentence Organisation > Ordering of Sentence Parts > Sentence Parts"
SS = "Sentence Organisation > Ordering of Sentences in a Passage > Sentence Sequence"

P("lang", "Counting the world's languages", r"""Directions: Read the following passage carefully and answer the questions that follow, based solely on the passage.

An attempt to determine the number of languages in the world is affected by other factors. A few new languages do continue to be discovered, even these days, as unexplored regions of the world begin to be opened up. The discovery does not usually take place straight away. Often there are similarities with an already known language which make the investigators assume that what they have found is just a dialect of that language. Only after a considerable period of contact does it transpire that the speech is so different that it has to be considered a different language. It takes a language survey to establish the facts, and there are still many countries where such surveys are incomplete or have not even begun. The people may be known, but the identity of their language may not be. Because many such peoples are bilingual or multilingual, and converse with outsiders in lingua franca, it may take a while before linguists come to realize that there is an ethnic language there at all.""")

Q(1, "Which one of the following is NOT the reason for the difficulty in estimating the number of languages of the world?",
  ["New languages continue to be discovered", "There are still unexplored regions", "New languages are considered a dialect of a known language", "People who speak the language do not claim their language"], "D",
  RC + "Inference", 25,
  "The passage gives new discoveries, unexplored regions and confusion with dialects as reasons. It never says speakers fail to claim their language; they simply use a lingua franca with outsiders.\nAnswer: (d)", passage="lang", pattern=LS, theme="What is not a stated reason")

Q(2, "Which one of the following is a way to establish the discovery of a new language?",
  ["By establishing contact over a period of time with the speakers of the language", "By finding the similarities of the language with other languages",
   "By comparing with the lingua franca of the region", "By conducting a survey of all languages of the region"], "D",
  RC + "Factual Detail", 30,
  "The passage says 'It takes a language survey to establish the facts'. Long contact only reveals the difference; the survey establishes it.\nAnswer: (d)", passage="lang", pattern=LS, theme="How a new language is established")
F(2, "(a) also arguable from 'considerable period of contact'; DP picks survey (d)")

Q(3, "Which one of the following statements is correct?",
  ["Language surveys have been conducted by all nations", "There is hardly any language to be discovered in the world",
   "All the languages are either complete languages or dialects of other major languages", "No new language needs to be discovered since all languages are known to the world"], "C",
  RC + "Inference", 35,
  "(a), (b) and (d) contradict the passage, which says surveys are incomplete in many countries and new languages are still discovered. The passage's distinction between a separate language and a dialect of a known language fits (c).\nAnswer: (c)", passage="lang", pattern=LS, theme="Statement consistent with the passage")
F(3, "Weakly supported; chosen by elimination")

Q(4, "'The people may be known, but the identity of their language may not be,' means",
  ["People are recognised as different ethnic groups but not necessarily their language", "People are recognised as different ethnic groups and their language is recognised",
   "People are not recognised as different ethnic groups, and so are their languages", "Because the people are not from different ethnic groups and their language is recognised"], "A",
  RC + "Inference", 15,
  "The group is known, but whether they have a separate language is not.\nAnswer: (a)", passage="lang", pattern=LS, theme="Meaning of a key sentence")

Q(5, "Which one of the following words from passage means 'come to be known'?",
  ["transpire", "lingua franca", "straight", "variant"], "A", RC + "Vocabulary in Context", 15,
  "'Transpire' means to become known ('does it transpire that the speech is so different').\nAnswer: (a)", passage="lang", pattern=LS, theme="Transpire")

NARR = "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Narration"

Q(6, NAR + 'Convert from direct speech to indirect speech:\n\nCharu said to her friend, "I want you to be here at 6.00 p.m. tomorrow for the meeting."',
  ["Charu told her friend that she wanted her to be there at 6.00 p.m. the next day for the meeting", "Charu told her friend that she wanted her to be there at 6.00 p.m. tomorrow for the meeting",
   "Charu requested her friend that she wanted her to be there at 6.00 p.m. tomorrow for the meeting", "Charu told her friend that she will want her to be here at 6.00 p.m. the next day for the meeting"], "A",
  NARR, 20, "'want' becomes 'wanted', 'here' becomes 'there' and 'tomorrow' becomes 'the next day'.\nAnswer: (a)", theme="Reported statement with time and place shift")

Q(7, NAR + 'Convert from direct speech to indirect speech:\n\nNitin said to his brother, "What a beautiful painting it is?"',
  ["Nitin wondered to his brother that what a beautiful painting it was", "Nitin wondered before his brother that it was a beautiful painting",
   "Nitin exclaimed that it is a beautiful painting", "Nitin asked his brother whether it was beautiful painting"], "A",
  NARR, 45,
  "The sentence is an exclamation of wonder, so the reporting verb should express it, and 'is' must shift to 'was'. (c) keeps 'is' and (d) wrongly turns it into a question. (a) keeps the sense of wonder with the correct tense, though the usual form would be 'exclaimed that it was a very beautiful painting'.\nAnswer: (a)", theme="Reported exclamation")
F(7, "No fully idiomatic option; DP picks (a)")

Q(8, "Directions: The item has a sentence in indirect speech. Select the option that converts it correctly into direct speech.\n\nThe teacher asked her students why they had been quiet in the previous class.",
  ['The teacher asked her students, "Why were they keeping quiet in the previous class?"', 'The teacher said to her students, "Why were you quiet in the previous class?"',
   'The teacher said to her students, "Why had you been quiet in the previous class?"', 'The teacher said to her students, "Why were you quiet in previous class?"'], "B",
  NARR, 25, "In direct speech the past perfect 'had been' goes back to the simple past 'were', 'they' becomes 'you', and 'the previous class' keeps its article.\nAnswer: (b)", theme="Indirect to direct question")

Q(9, COR + "Which one of the following sentences is correct?",
  ["He is considered as the brightest intellectual in the country", "He is considered as one among the brightest intellectual in the country",
   "He is considered as one among the brighter intellectual in the country", "He is considered as one of the intellectual in the country"], "A",
  "Grammar and Usage > Sentence Improvement > Grammar Correction", 25,
  "'One among/of the ...' needs a plural noun ('intellectuals'), so (b), (c) and (d) are wrong. (a) uses the superlative with a singular noun correctly.\nAnswer: (a)", theme="Superlative with a singular noun")

Q(10, COR + "Which one of the following sentences is correct?",
  ["No other mountain is taller than the Himalayas", "No other mountain is tall than the Himalayas", "No other mountains taller than the Himalayas", "No other mountain is taller then the Himalayas"], "A",
  "Grammar and Usage > Sentence Improvement > Grammar Correction", 10,
  "A comparison needs the comparative 'taller' and 'than', with a verb.\nAnswer: (a)", theme="Comparative with than")

Q(11, PAIR + "Confident and Confidant",
  ["Confident means certain and confidant means close friend", "Confidant means certain and confident means close friend", "Confident means belief and confidant means an emissary", "Confident means assurance and confidant means intimate person"], "A",
  WM, 20, "Confident (adjective) means sure or certain; a confidant (noun) is a close friend one confides in.\nAnswer: (a)", theme="Confident and confidant")

Q(12, PAIR + "Broke and brook",
  ["Broke means abundance and brook means a flowing water body", "Broke means bankrupt and brook means a stream", "Broke means fractured and brook means nonsense", "Broke means negotiate and brook means a stream"], "B",
  WM, 15, "Broke (informal) means having no money; a brook is a small stream.\nAnswer: (b)", theme="Broke and brook")

Q(13, PAIR + "Accept and Except",
  ["Accept means apart from and except means recognise", "Accept means recognise and except means include", "Accept means consent and except means apart from", "Accept means allude and except means apart from"], "C",
  WM, 15, "To accept is to agree or consent; except means apart from.\nAnswer: (c)", theme="Accept and except")

Q(14, PAIR + "Accord and Accrued",
  ["Accord means collected and accrued means agreement", "Accord means agreement and accrued means arrived", "Accord means accepted and accrued means received", "Accord means agreement and accrued means accumulated"], "D",
  WM, 20, "An accord is an agreement; accrued means accumulated over time (e.g. accrued interest).\nAnswer: (d)", theme="Accord and accrued")

Q(15, PAIR + "Guarantee and Warranty",
  ["Guarantee is an agreement and warranty is a service contract", "Guarantee is a business agreement and warranty is a service contract", "Guarantee is a promise and warranty is a service contract", "Guarantee is acceptance and warranty is a service contract"], "C",
  WM, 30, "A guarantee is a formal promise or assurance; a warranty is a written undertaking to repair or replace, i.e. a service contract.\nAnswer: (c)", theme="Guarantee and warranty")

SC = "Vocabulary > Synonyms > Contextual Meaning"
Q(16, SYN + "The Constitution of India ensures __proportionate__ representation from all regions.", ["balanced", "partial", "unlikely", "suffragette"], "A", SC, 15,
  "Proportionate means in correct proportion, i.e. balanced.\nAnswer: (a)", theme="Proportionate")
Q(17, SYN + "There is a feeling of __disenchantment__ among the members of the group.", ["delight", "disappointment", "idealism", "unrelenting"], "B", SC, 15,
  "Disenchantment is a feeling of disappointment after losing one's admiration for something.\nAnswer: (b)", theme="Disenchantment")
Q(18, SYN + "She believed that it was __imminent__ that he would be chosen as the leader of the group.", ["timely", "distant", "unlikely", "inevitable"], "D", SC, 25,
  "Imminent means about to happen; of the options, 'inevitable' (certain to happen) is nearest.\nAnswer: (d)", theme="Imminent")
Q(19, SYN + "The brave soldiers left an __indelible__ impression on the people of the land.", ["permanent", "fleeting", "hilarious", "eradicable"], "A", SC, 10,
  "Indelible means that cannot be removed, i.e. permanent.\nAnswer: (a)", theme="Indelible")
Q(20, SYN + "The manager always provides __instantaneous__ replies to all queries.", ["immediate", "delayed", "deliberate", "unwanted"], "A", SC, 5,
  "Instantaneous means happening at once, immediate.\nAnswer: (a)", theme="Instantaneous")

Q(21, SEQ + """S1: Although all sources of energy ultimately come from natural processes, non-renewable resources cannot be replaced naturally at the rate they are being used.
S6: The sustainable use of natural resources in a manner that provides the maximum benefit of these resources to humans over a period of time can be termed as conservation.
P: This will increase the time and cost of mining and once these resources are used up they cannot be replaced.
Q: Hence, we must remember that though our country is rich in mineral deposits these resources are short-lived.
R: Extraction of these ores through the process of mining will soon become difficult and very expensive because these minerals have to be mined from greater depths over time.
S: Mineral resources can be said to be finite and non-renewable.""",
  ["Q P R S", "S P Q R", "S Q R P", "S Q P R"], "C", SS, 40,
  "S states that minerals are finite; Q ('Hence ... short-lived') draws the consequence; R explains that extraction becomes harder; P ('This will increase the time and cost') follows from R and leads to conservation in S6.\nAnswer: (c)", pattern=ORD, theme="Mineral conservation")
F(21, "S-R-P-Q also reads well but is not an option; DP picks SQRP")

Q(22, SEQ + """S1: India, at present, has one of the largest road networks in the world.
S6: It passes through Howrah, Delhi and Amritsar and terminates in Kabul (Afghanistan).
P: The importance of roads has been recognised in India since the ancient times.
Q: The Grand Trunk Road was built by Sher Shah Suri across the Indo-Gangetic plain, from Chittagong (Bangladesh) to Peshawar (Pakistan).
R: Kings such as Ashoka and Chandragupta built roads for easy transportation of goods and people.
S: Construction of roads continued as an important activity in the late medieval period.""",
  ["Q P R S", "S P Q R", "P Q R S", "P R S Q"], "D", SS, 20,
  "The passage moves through time: ancient importance (P), Ashoka and Chandragupta (R), late medieval road building (S), and the Grand Trunk Road (Q), whose route continues in S6.\nAnswer: (d)", pattern=ORD, theme="History of Indian roads")

Q(23, SEQ + """S1: National highways connect one state with another and are of national importance.
S6: These road systems are also known as primary road systems and are laid and operated under the supervision of the National Highway Authority of India.
P: They are important because whereas they constitute merely two per cent of the total road networks, they nevertheless carry 40 per cent of the total road traffic.
Q: The road infrastructure of the country is therefore crucial, and their construction and maintenance is of critical importance.
R: They bear the load of traffic because these roads connect long distances and pass through major cities and towns.
S: Since they cover the length and breadth of the nation and connect cities and towns, these highways are the primary facilitators of trade and connectivity.""",
  ["P R S Q", "S P Q R", "P R Q S", "S Q R P"], "A", SS, 30,
  "P gives the 2%/40% fact; R explains why they carry so much traffic; S adds their role in trade; Q concludes ('therefore crucial'), before S6.\nAnswer: (a)", pattern=ORD, theme="National highways")

Q(24, SEQ + """S1: The South African Constitution was inaugurated in December 1996.
S6: A special constitutional court enforces the rights enshrined in the Constitution.
P: Its creation and promulgation took place at a time when South Africa still faced the threat of a civil war after the dissolution of the Apartheid Government.
Q: The South African Constitution says that its "Bill of Rights is a cornerstone of democracy in South Africa."
R: Apropos, it forbids discrimination on the grounds of "race, gender, pregnancy, marital status, ethnic or social origin, colour, age, disability, religion, conscience, belief, culture, language and birth".
S: The Bill of Rights grants perhaps the most extensive range of rights to the citizens.""",
  ["Q S R P", "S P Q R", "P Q R S", "P Q S R"], "D", SS, 30,
  "P describes the context of its creation; Q introduces the Bill of Rights; S says it grants extensive rights; R gives an example ('Apropos, it forbids discrimination'); S6 names the court that enforces them.\nAnswer: (d)", pattern=ORD, theme="South African Constitution")

Q(25, SEQ + """S1: Our Constitution reminds us of the necessity of representation in a large democracy.
S6: Elections have today become the most visible symbol of the democratic process.
P: This is why elections become important.
Q: Therefore representatives are elected by the people.
R: Whenever we think of India as a democracy, our mind invariably turns to our successful elections.
S: All citizens cannot participate in taking every decision.""",
  ["Q S R P", "S P Q R", "P Q S R", "S Q P R"], "D", SS, 25,
  "S explains why representation is needed; Q follows ('Therefore representatives are elected'); P ('This is why elections become important'); R and S6 develop the point about elections.\nAnswer: (d)", pattern=ORD, theme="Representation and elections")

Q(26, DM + "__________ your transfer request is concerned, we'll be discussing it at the next meeting.", ["As far as", "To begin with", "By the way", "Talking about"], "A", FC, 10,
  "'As far as ... is concerned' is the fixed expression.\nAnswer: (a)", theme="As far as ... is concerned")
Q(27, DM + "__________, did you know Ravi has a new job?", ["For one thing", "By the way", "In the first place", "As a result"], "B", FC, 10,
  "'By the way' introduces a new, incidental topic.\nAnswer: (b)", theme="By the way")
Q(28, DM + "__________ the wind, it was getting stronger, and I was getting colder.", ["To begin with", "By the way", "First of all", "Speaking of"], "D", FC, 25,
  "'Speaking of the wind' picks up a topic and then comments on it ('it was getting stronger').\nAnswer: (d)", theme="Speaking of")
Q(29, DM + "__________, what are you doing in my room?", ["On the other hand", "Excuse me", "Look there", "Eventually"], "B", FC, 15,
  "'Excuse me' is used to challenge or politely question someone.\nAnswer: (b)", theme="Excuse me")
Q(30, DM + "__________ an unhappy childhood leads to criminal behaviour.", ["Still if", "Even somewhat", "In some cases", "In progression"], "C", FC, 15,
  "'In some cases' limits the generalisation.\nAnswer: (c)", theme="In some cases")
Q(31, DM + "__________, the problem is nothing but a wrong assumption about processes.", ["In the meanwhile", "Somewhat", "Engagingly", "In other words"], "D", FC, 15,
  "'In other words' restates an earlier point more simply.\nAnswer: (d)", theme="In other words")
Q(32, DM + "Many, __________, hesitate to publicly broach such question for fear of nurturing discrimination.", ["understandably", "despite", "until", "of course"], "A", FC, 20,
  "'Understandably' comments that their hesitation is reasonable. 'Despite' and 'until' need an object.\nAnswer: (a)", theme="Understandably")
Q(33, DM + "__________, one notes that in the nineteenth century an important development of reflection and questioning gained momentum.", ["Particularly speaking", "Generally speaking", "Otherwise", "Of course"], "B", FC, 20,
  "'Generally speaking' introduces a broad observation about a century.\nAnswer: (b)", theme="Generally speaking")
Q(34, DM + "__________, the situation has completely transformed over the past few years.", ["Somewhat", "Believably", "Thus", "Predominantly"], "C", FC, 30,
  "'Somewhat' contradicts 'completely', and 'Believably' and 'Predominantly' do not fit. 'Thus' presents the statement as a conclusion.\nAnswer: (c)", theme="Thus")
F(34, "Weak options; DP picks 'Thus'")
Q(35, DM + "__________, the committee is of the opinion that all academic matters will be discussed in the Executive Body Meeting.", ["Hence", "But", "Later", "Although"], "A", FC, 25,
  "'Hence' presents the committee's view as a consequence. 'Although' would need a second clause and 'But' needs an earlier contrast.\nAnswer: (a)", theme="Hence")

Q(36, DEF + "Cynosure:", ["Person or thing that causes a change", "Person or thing that attracts a lot of attention", "Person or thing regarded as exact copy", "Person or animal that lives in a particular place"], "B",
  WM, 20, "A cynosure is the centre of attention or admiration.\nAnswer: (b)", theme="Cynosure")
Q(37, DEF + "Coeval:", ["Person of roughly the same age", "Person or organisation that cooperates with others", "Person employed to drive a private car", "Person employed in taking census"], "A",
  WM, 30, "A coeval is a person of the same age or period, a contemporary.\nAnswer: (a)", theme="Coeval")
Q(38, DEF + "Retrogression:", ["Sudden sharp drop in price", "Reverse pressure", "Return to earlier state", "Sudden occurrence of a past event"], "C",
  WM, 20, "Retrogression is a return to an earlier, usually worse, state.\nAnswer: (c)", theme="Retrogression")
Q(39, DEF + "Imprest:", ["Surprise attack by people", "Money used to manage small expenses", "Sudden occurrence of laughter", "Sudden increase in activity"], "B",
  WM, 35, "An imprest is a fund of money advanced for small, routine expenses (an imprest account).\nAnswer: (b)", theme="Imprest")
Q(40, DEF + "Turgid:", ["Determined or loyal", "Dirty or untidy", "Swollen or distended", "Excited or upset"], "C",
  WM, 25, "Turgid means swollen or distended (also used of pompous, swollen language).\nAnswer: (c)", theme="Turgid")

Q(41, PARTS + "P: participate in the function\nQ: many of the people who had come to\nR: the auditorium was over-crowded\nS: could not find a seat because", ["P R Q S", "P Q R S", "Q P S R", "S P R Q"], "C", SP, 15,
  "Many of the people who had come to (Q) participate in the function (P) could not find a seat because (S) the auditorium was over-crowded (R).\nAnswer: (c)", pattern=ORD, theme="Over-crowded auditorium")
Q(42, PARTS + "P: lay outside her existing life\nQ: she knew that the answer\nR: somewhere in the back of her mind\nS: to her questions about life", ["R P Q S", "Q S P R", "Q P S R", "R Q S P"], "D", SP, 20,
  "Somewhere in the back of her mind (R) she knew that the answer (Q) to her questions about life (S) lay outside her existing life (P).\nAnswer: (d)", pattern=ORD, theme="Answer outside her life")
Q(43, PARTS + "P: works of literature\nQ: inside the pages of all good\nR: lies the truth about some of\nS: the more challenging questions posed by humanity", ["P R Q S", "Q P R S", "Q P S R", "R P S Q"], "B", SP, 15,
  "Inside the pages of all good (Q) works of literature (P) lies the truth about some of (R) the more challenging questions posed by humanity (S).\nAnswer: (b)", pattern=ORD, theme="Truth in literature")
Q(44, PARTS + "P: takes on account of its economic successes\nQ: to address continuing social inequality\nR: for every stride of progress any nation\nS: it takes two back if it is unable", ["P R Q S", "Q P R S", "R P S Q", "R P Q S"], "C", SP, 20,
  "For every stride of progress any nation (R) takes on account of its economic successes (P), it takes two back if it is unable (S) to address continuing social inequality (Q).\nAnswer: (c)", pattern=ORD, theme="Progress and inequality")
Q(45, PARTS + "P: the book-value of a loan or\nQ: an intangible asset over a set period of time\nR: used to periodically lower\nS: amortisation is an accounting technique", ["S R P Q", "R S P Q", "S R Q P", "R P S Q"], "A", SP, 20,
  "Amortisation is an accounting technique (S) used to periodically lower (R) the book-value of a loan or (P) an intangible asset over a set period of time (Q).\nAnswer: (a)", pattern=ORD, theme="Amortisation")

FV = "Grammar and Usage > Fill in the Blanks > Vocabulary in Context"
Q(46, FIB + "There is more than __________ to get the job done.", ["one way", "one ways", "any ways", "any way"], "A", FV, 10,
  "'More than one way' is idiomatic; 'one' takes a singular noun.\nAnswer: (a)", theme="More than one way")
Q(47, FIB + "The class decided to organise __________.", ["picnic", "a picnic", "picnics", "the picnic"], "B", "Grammar and Usage > Fill in the Blanks > Articles", 10,
  "A singular countable noun mentioned for the first time takes 'a'.\nAnswer: (b)", theme="Indefinite article")
Q(48, FIB + "The accused __________ before the judge.", ["tried", "was trial", "sat trial", "stood trial"], "D", FV, 15,
  "'To stand trial' is the fixed expression for being tried in court.\nAnswer: (d)", theme="Stood trial")
Q(49, FIB + "The manner in which the demolitions have been carried out __________ scrutiny by the High Court.", ["was under", "under", "is under", "however under"], "C", FV, 25,
  "The subject 'the manner' is singular and the sentence is in the present ('have been carried out'), so 'is under scrutiny'.\nAnswer: (c)", theme="Subject-verb agreement")
Q(50, FIB + "I __________ consider the opinions of all stakeholders before taking a final decision.", ["will not", "have", "will", "shall"], "C", FV, 25,
  "The sentence expresses a commitment about the future; 'will consider' fits. 'Will not' contradicts the sense and 'have' needs 'considered'. ('Shall' is also possible in formal British usage.)\nAnswer: (c)", theme="Will for future intention")
F(50, "will vs shall both possible; DP picks 'will'")
