from qfmt import Q, P, F

# NDA II 2025 General Ability Test, Set A (TODC-T-GAT), Part A English, Q1-50
RC = "Reading Comprehension > Comprehension Passages > "
NAR = "Directions: The following item has a sentence in direct speech, followed by four options. One of the options correctly converts the direct speech into indirect speech. Select the most appropriate option.\n\n"
VOI = "Directions: The following item has a sentence in active voice with four options. One of the options converts the active voice into passive voice correctly. Select the most appropriate option.\n\n"
PAIR = "Directions: In the following item, a pair of words is provided. Select the option that most appropriately describes the meaning of both the words.\n\n"
SYN = "Directions: A sentence is given with a word that is underlined, followed by four words or group of words. Select the option that is nearest in meaning to the underlined word.\n\n"
SEQ = "Directions: The item consists of six sentences of a passage. The first and sixth sentences are given in the beginning as S1 and S6. The middle four sentences have been jumbled up and labelled as P, Q, R and S. Find the proper sequence of the four sentences.\n\n"
DM = "Directions: The sentence uses a discourse marker/expression to make it complete. Identify the most appropriate discourse marker.\n\n"
DEF = "Directions: A word/expression/jargon is given, followed by four options. Identify the most appropriate option that defines it.\n\n"
PARTS = "Directions: The parts of the sentence have been jumbled and labelled P, Q, R and S. Select the most appropriate rearrangement of the parts.\n\n"
FIB = "Directions: The sentence has a blank space, followed by four options. Select the most appropriate option to fill in the blank.\n\n"
ORD = "Ordering/Sequence"

P("agri", "Agricultural productivity and ecological strain", r"""Directions: Read the following passage carefully and answer the items that follow the passage. Your answers to these items should be based solely on the passage.

Can agricultural productivity meet human needs in the long run? Since twentieth century advances, given increasing costs, do not seem sustainable, further increases in output will not be achieved easily. Global population growth, while showing signs of slowing down, has pushed farmers and herders into areas unsuited to intensive agriculture, accelerating worldwide ecological disruptions. Reserves of arable land and fresh water have diminished alarmingly. Chemical runoffs have compounded pollution problems. Invasion of natural habitats have hastened species extinction. Desertification has been severe in the last hundred years, especially in North Africa, southern portions of Africa, Australia, northern Mexico, and the American Southwest. Tropical forests have shrunk by one-half since World War II, with agricultural pressures causing three-quarters of that loss. Government intervention has produced its share of catastrophes, ranging from a terrible famine in China between 1958-1961 that may have killed 30 million people and destroyed the Aral Sea. Taking everything into consideration, we may remain hopeful about humankind's agricultural prospects, but we can scarcely look forward optimistically at the end of the first quarter of the twenty-first century.""")

Q(1, "Why do twentieth century advances not seem sustainable?",
  ["They do not meet the human needs", "Due to the increased cost of agricultural production", "Because they are outdated for the current times", "They are useful, but intensive"], "B",
  RC + "Factual Detail", 15,
  "The passage says twentieth century advances do not seem sustainable 'given increasing costs'. So the reason is the rising cost of production.\nAnswer: (b)", passage="agri", pattern="Linked Item Set", theme="Reason advances are unsustainable")

Q(2, "What pushes farmers into places unsuited for agriculture?",
  ["Population growth", "Industrialisation", "Water scarcity", "Desertification"], "A",
  RC + "Factual Detail", 10,
  "The passage states that global population growth 'has pushed farmers and herders into areas unsuited to intensive agriculture'.\nAnswer: (a)", passage="agri", pattern="Linked Item Set", theme="Cause of farming in unsuitable areas")

Q(3, "Which one of the following is NOT true, according to the passage, for ecological degradation?",
  ["Global population growth", "Excess use of chemicals", "Desertification", "World War II"], "D",
  RC + "Inference", 25,
  "Population growth, chemical runoffs and desertification are all named as causes or forms of ecological disruption. World War II is only used as a time marker ('since World War II'), not as a cause.\nAnswer: (d)", passage="agri", pattern="Linked Item Set", theme="Identifying what is not a cause")

Q(4, "What is the conclusion of the author in the passage about the prospects of agriculture in the world?",
  ["The author is both hopeful and sceptical of the prospects of agriculture", "The author is very hopeful of the prospects of agriculture",
   "The author is sceptical of the prospects of agriculture", "The author is neither hopeful nor sceptical of the prospects of agriculture"], "A",
  RC + "Main Idea", 30,
  "The last sentence says we 'may remain hopeful' but 'can scarcely look forward optimistically'. The author is hopeful and doubtful at the same time.\nAnswer: (a)", passage="agri", pattern="Linked Item Set", theme="Author's balanced conclusion")

Q(5, "Which one of the following words means 'incursion'?",
  ["invasion", "intensive", "severe", "intervention"], "A",
  RC + "Vocabulary in Context", 15,
  "An incursion is a sudden entry into territory, an invasion. The passage uses 'Invasion of natural habitats' in this sense.\nAnswer: (a)", passage="agri", pattern="Linked Item Set", theme="Meaning of incursion")

Q(6, NAR + 'Convert from direct into indirect speech.\n\nAyushi said to the group, "We have had enough of suffering today. It is time to march forward."',
  ["Ayushi told the group that they had had enough of suffering that day and it was time to march forward",
   "Ayushi asked the group that they had had enough of suffering this day and it was time to march forward",
   "Ayushi told the group that they had enough of suffering and that it is time to march forward",
   "Ayushi told the group that we had had enough of suffering this day and it was time to march forward"], "A",
  "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Narration", 25,
  "In reported speech: 'said to' becomes 'told', 'we' becomes 'they', 'have had' becomes 'had had', 'today' becomes 'that day', and 'is' becomes 'was'. Only (a) makes all these changes.\nAnswer: (a)", theme="Statement with time shift")

Q(7, NAR + 'Convert from direct speech into indirect speech.\n\n"Alas! We lost the match by one point," said the Captain',
  ["The Captain regretted that they had lost the match by one point", "The Captain regretted that they lost the match by one point",
   "The Captain exclaimed that they had lost the match by one point", "The Captain told the team that they had lost the match by one point"], "A",
  "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Narration", 35,
  "'Alas!' expresses sorrow, so the reporting verb should show regret, and the simple past 'lost' shifts to the past perfect 'had lost'. (a) does both. (c) uses 'exclaimed' without the sense of regret.\nAnswer: (a)", theme="Exclamation of regret")

Q(8, NAR + 'Convert from direct speech into indirect speech.\n\n"Where were you last week?" Alok asked Sheela',
  ["Alok told Sheela where she had been the week before", "Alok asked Sheela where she had been the week before",
   "Alok asked Sheela where she was the week before", "Alok asked Sheela where she had been the last week"], "B",
  "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Narration", 20,
  "A question keeps 'asked'; 'were' shifts to 'had been'; 'last week' becomes 'the week before'.\nAnswer: (b)", theme="Reported wh-question")

Q(9, VOI + "The king who the people loved built the castle five centuries ago",
  ["The castle was built five centuries ago by the king who was loved by the people", "The castle was built five centuries ago by the king who loved the people",
   "The castle built five centuries ago by the king loved by the people", "The castle was built five centuries ago by the people who were loved by the king"], "A",
  "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Voice", 25,
  "Both clauses become passive: 'the castle was built ... by the king' and 'who was loved by the people'. (b) and (d) reverse who loved whom; (c) has no finite verb.\nAnswer: (a)", theme="Passive with a relative clause")

Q(10, VOI + "The company has recruited four hundred engineers who will have to complete an internship for three weeks",
  ["Four hundred engineers have been recruited by the company and an internship of three weeks will have to be completed by them",
   "Four hundred engineers have been recruited by the company and they will have to complete an internship of three weeks",
   "The company has been recruited by four hundred engineers and an internship of three week will have to be completed by them",
   "Four hundred engineers have been recruited by the company. Internship of three weeks will have had to be completed by them"], "A",
  "Grammar and Usage > Active and Passive Voice / Direct and Indirect Speech > Voice", 35,
  "Both active verbs must become passive: 'have been recruited by the company' and 'will have to be completed by them'. (b) leaves the second clause active; (c) reverses the agent; (d) changes the tense.\nAnswer: (a)", theme="Passive of two clauses")

Q(11, PAIR + "Seldom and Often",
  ["Seldom means hardly ever and often means time and again", "Seldom means time and again and often means hardly ever",
   "Seldom means never and often means not at all", "Seldom means frequently and often means time and again"], "A",
  "Vocabulary > Synonyms > Word Meaning", 10,
  "Seldom means rarely (hardly ever); often means frequently (time and again).\nAnswer: (a)", theme="Seldom and often")

Q(12, PAIR + "Overview and Review",
  ["Overview means assessment and review means general idea", "Overview means general idea and review means assessment",
   "Overview means general analysis and review means go through", "Overview means summary and review means evaluation"], "B",
  "Vocabulary > Synonyms > Word Meaning", 30,
  "An overview gives a general idea of something; a review is a careful assessment of it. (b) states both correctly.\nAnswer: (b)", theme="Overview and review")
F(12, "(b) and (d) are close; DP picks (b)")

Q(13, PAIR + "Overcome and Succeed",
  ["Overcome means triumph over and succeed means to achieve something", "Overcome means achieve something and succeed means to triumph over",
   "Overcome means to be successful and succeed means to achieve something", "Overcome means winning and succeed means to rise above"], "A",
  "Vocabulary > Synonyms > Word Meaning", 20,
  "To overcome is to triumph over a difficulty; to succeed is to achieve what one aimed for.\nAnswer: (a)", theme="Overcome and succeed")

Q(14, PAIR + "Embed and Imbue",
  ["Embed means instil and imbue means implant", "Embed means implant and imbue means instil", "Embed means accept and imbue means detest", "Embed means include and imbue means accept"], "B",
  "Vocabulary > Synonyms > Word Meaning", 25,
  "To embed is to fix firmly inside something (implant); to imbue is to fill or inspire with a quality (instil).\nAnswer: (b)", theme="Embed and imbue")

Q(15, PAIR + "Emancipate and Empower",
  ["Emancipate means authorize and empower means liberate", "Emancipate means liberate and empower means authorise",
   "Emancipate means liberal and empower means authorisation", "Emancipate means freedom and empower means encounter"], "B",
  "Vocabulary > Synonyms > Word Meaning", 15,
  "To emancipate is to set free (liberate); to empower is to give authority or power (authorise).\nAnswer: (b)", theme="Emancipate and empower")

Q(16, SYN + "The Professor has been able to __instil__ confidence in her students",
  ["inculcate", "infer", "eradicate", "unlike"], "A", "Vocabulary > Synonyms > Contextual Meaning", 15,
  "To instil is to gradually establish an idea or feeling in someone; 'inculcate' has the same meaning.\nAnswer: (a)", theme="Instil")

Q(17, SYN + "The members of the group expressed their __allegiance__ to their leader",
  ["commitment", "disloyalty", "understanding", "unlikely"], "A", "Vocabulary > Synonyms > Contextual Meaning", 15,
  "Allegiance is loyalty or commitment to a person or cause.\nAnswer: (a)", theme="Allegiance")

Q(18, SYN + "The __inscrutability__ surrounding the incident remains unresolved until the end of the movie",
  ["clearness", "comprehensibility", "seriousness", "mystery"], "D", "Vocabulary > Synonyms > Contextual Meaning", 25,
  "Inscrutability is the quality of being impossible to understand, i.e. mystery. (a) and (b) are opposites.\nAnswer: (d)", theme="Inscrutability")

Q(19, SYN + "The __dodgy__ behaviour of the leader led to her fall",
  ["principled", "dubious", "dishonest", "painful"], "C", "Vocabulary > Synonyms > Contextual Meaning", 35,
  "'Dodgy' means dishonest or unreliable. Behaviour that brings about a leader's fall is best read as dishonest; 'dubious' (doubtful) is weaker.\nAnswer: (c)", theme="Dodgy")
F(19, "dubious vs dishonest both near; DP picks dishonest")

Q(20, SYN + "People have been advised not to venture into sea as the weather is likely to be __inclement__",
  ["squally", "calm", "pleasant", "indigent"], "A", "Vocabulary > Synonyms > Contextual Meaning", 25,
  "Inclement weather is cold, wet and stormy; 'squally' (marked by sudden storms) is closest. 'Indigent' means poor.\nAnswer: (a)", theme="Inclement")

Q(21, SEQ + """S1. Sufism is an English word coined in the Nineteenth Century
S6. It may also have been suffa, the platform outside a place of Islamic worship
P. Historians have understood this term in several ways
Q. According to some scholars, it is derived from suf, meaning wool
R. Others derive it from safa, meaning purity
S. The word used for Sufism in Islamic texts is tasawwuf""",
  ["Q R S P", "S P Q R", "P Q S R", "R P S Q"], "B", "Sentence Organisation > Ordering of Sentences in a Passage > Sentence Sequence", 30,
  "S1 introduces the English word; S gives the Islamic term, tasawwuf; P says historians understand 'this term' in several ways; Q and R give two derivations ('some scholars', 'Others'); S6 adds a third ('It may also have been').\nAnswer: (b)", pattern=ORD, theme="Origin of the word Sufism")

Q(22, SEQ + """S1. Al-Biruni was born in 973, in Khwarizm in present-day Uzbekistan
S6. He arrived in Ghazni as a hostage, but gradually developed a liking for the city
P. In 1017, when Sultan Mahmud invaded Khwarizm, he took several scholars back to his capital, Ghazni: Al-Biruni was one among them
Q. He was well versed in several languages; Syriac, Arabic, Persian, Hebrew, and Sanskrit
R. Khwarizm was an important centre of learning, and Al-Biruni received the best education available at the time
S. However he did not know Greek, although he was familiar with the works of Plato and other Greek philosophers""",
  ["Q S R P", "R Q S P", "P Q S R", "R P S Q"], "B", "Sentence Organisation > Ordering of Sentences in a Passage > Sentence Sequence", 30,
  "R follows the birthplace with his education there; Q lists his languages and S qualifies that ('However he did not know Greek'); P describes his removal to Ghazni, which leads into S6 ('arrived in Ghazni as a hostage').\nAnswer: (b)", pattern=ORD, theme="Al-Biruni's early life")

Q(23, SEQ + """S1. Vijayanagara or 'city of victory' was the name of both a city and an empire
S6. They remembered it as Hampi, a name derived from that of the local mother goddess, Pampadevi
P. In its heyday it stretched from the river Krishna in the north to the extreme south of the Indian peninsula
Q. Although it fell into ruin in the seventeenth-eighteenth centuries, it continued to live in the memories of the people who inhabited the Krishna-Tungabhadra doab
R. In 1565 the city was sacked and subsequently deserted
S. The Empire was founded in the fourteenth century""",
  ["S P R Q", "S Q P R", "P Q S R", "P Q R S"], "A", "Sentence Organisation > Ordering of Sentences in a Passage > Sentence Sequence", 25,
  "The story runs in time order: founding (S), its greatest extent (P), the sack of 1565 (R), and its survival in memory (Q), which leads into S6 ('They remembered it as Hampi').\nAnswer: (a)", pattern=ORD, theme="Vijayanagara")

Q(24, SEQ + """S1. Liberalisation and globalisation freed India's economy from the low GDP trap that had impeded India's progress
S6. Today India has transformed into one of the largest economies of the world
P. India's 3 pc rate of growth and a set of emergent circumstances led to a balance of payment crisis in the early 1990s
Q. Ease of business was ensured, and the requirement for import licences, and production quotas, were removed
R. Apart from these measures India also took a loan from the IMF to tide over the crisis, but after 1993, India has not taken another loan from the IMF
S. In a landmark budget in 1991, responding to the emergent crisis, India delicenced many industries and liberalised its economic policies""",
  ["Q S R P", "S Q P R", "R Q S P", "P S Q R"], "D", "Sentence Organisation > Ordering of Sentences in a Passage > Sentence Sequence", 30,
  "P describes the crisis; S gives the 1991 response; Q lists more reforms; R ('Apart from these measures') adds the IMF loan; S6 states the result.\nAnswer: (d)", pattern=ORD, theme="1991 economic reforms")

Q(25, SEQ + """S1. In many countries, there are millions of people who are underprivileged and deprived
S6. In the past forced labour was imposed by landlords, money-lenders, and other wealthy persons
P. Both of these are prohibited under the Constitution of India
Q. One such form of exploitation in our country has been begar or forced labour without payment
R. The marginalised are often subjected to exploitation by their fellow human beings
S. Another closely related form of exploitation is buying and selling of human beings and using them as slaves""",
  ["Q S R P", "R Q S P", "P Q S R", "Q S P R"], "B", "Sentence Organisation > Ordering of Sentences in a Passage > Sentence Sequence", 25,
  "R introduces exploitation; Q gives 'one such form' (begar); S gives 'another closely related form'; P says 'Both of these' are prohibited; S6 returns to forced labour in the past.\nAnswer: (b)", pattern=ORD, theme="Forced labour and trafficking")

FILL = "Grammar and Usage > Fill in the Blanks > Conjunctions"

Q(26, DM + "I can't be bothered to tell him what I think; __________ he would not listen to me.",
  ["meanwhile", "in any case", "in the meantime", "somehow"], "B", FILL, 20,
  "'In any case' adds a further reason that makes the first point unimportant: telling him is pointless because he would not listen anyway.\nAnswer: (b)", theme="In any case")

Q(27, DM + "__________, if the referee points his fingers, this indicates that someone has done something wrong.",
  ["On the contrary", "Whatever more", "Briefly", "As regards"], "C", FILL, 40,
  "The sentence states a rule in a short, summary form. 'Briefly' introduces such a short statement. 'On the contrary' needs a contrast, 'Whatever more' is not idiomatic and 'As regards' needs a noun after it.\nAnswer: (c)", theme="Briefly")
F(27, "Weak fit among options; DP picks 'Briefly'")

Q(28, DM + "__________, have you been to the local library yet?",
  ["Sort of", "Frankly", "All the same", "Incidentally"], "D", FILL, 20,
  "'Incidentally' introduces a new topic or a passing question.\nAnswer: (d)", theme="Incidentally")

Q(29, DM + "__________, women are healthier and are living longer than ever before: indeed on an average, they can expect to live five years longer than men.",
  ["To a large extent", "As regards", "As far as", "Turning now"], "A", FILL, 20,
  "'To a large extent' qualifies a general claim. 'As regards' and 'As far as' need a following noun or clause.\nAnswer: (a)", theme="To a large extent")

Q(30, DM + "The difference is that I have been fortunate to find a career that I love and, __________, I am getting paid reasonably for it.",
  ["briefly", "broadly speaking", "what is more", "in conclusion"], "C", FILL, 15,
  "'What is more' adds a further, stronger point.\nAnswer: (c)", theme="What is more")

Q(31, DM + "__________, the Government of India has followed the policy of trying to improve relations with its neighbours.",
  ["Particular", "Knowingly", "Otherwise", "In general"], "D", FILL, 15,
  "'In general' introduces a broad statement about a usual policy. 'Particular' is an adjective and does not fit here.\nAnswer: (d)", theme="In general")

Q(32, DM + "__________, this issue is likely to be discussed when the Council meets next.",
  ["As per reports", "Accordingly", "Likewise", "Briefly"], "A", FILL, 20,
  "The sentence reports an expectation that comes from other sources, so 'As per reports' fits. Nothing earlier makes 'Accordingly' or 'Likewise' appropriate.\nAnswer: (a)", theme="As per reports")

Q(33, DM + "__________, you needed to consult a physician to have a clear idea of what the disease is about.",
  ["In that case", "In these case", "Likewise", "Henceforth"], "A", FILL, 20,
  "'In that case' gives the consequence of a situation already mentioned. 'In these case' is ungrammatical.\nAnswer: (a)", theme="In that case")

Q(34, DM + "__________, in the year-ago period the current account deficit stood at $1.3 billion or 0.2% of the GDP.",
  ["Particularly", "Notably", "Seriously", "Unknowingly"], "B", FILL, 25,
  "'Notably' draws attention to a significant fact, which fits a comparison with the year-ago figure.\nAnswer: (b)", theme="Notably")

Q(35, DM + "__________, the records have been completely undermined by shoddy book-keeping.",
  ["Because of", "As such", "Forever", "Hence"], "B", FILL, 35,
  "'As such' means 'in that capacity' or 'consequently', and it fits a stand-alone sentence. 'Because of' needs a noun after it, and 'Forever' does not fit the meaning. 'Hence' would need an earlier stated cause.\nAnswer: (b)", theme="As such")
F(35, "As such vs Hence; DP picks 'As such'")

Q(36, DEF + "Infelicity:", ["Disloyalty towards one's nation", "An inappropriate remark", "To kill or destroy", "To touch or push gently"], "B",
  "Vocabulary > Synonyms > Word Meaning", 25, "An infelicity is an inappropriate or unsuitable remark or expression.\nAnswer: (b)", theme="Infelicity")

Q(37, DEF + "Corollary:", ["Something that is too expensive", "Something that looks real but does not really exist", "Something that naturally follows", "Something resembling a coal mine"], "C",
  "Vocabulary > Synonyms > Word Meaning", 15, "A corollary is a result or proposition that follows naturally from another.\nAnswer: (c)", theme="Corollary")

Q(38, DEF + "Quandary:", ["Situation in which you are confused about what to do", "Situation in which two people or group argue", "Situation in which no progress can be made", "Situation in which a relationship becomes friendlier"], "A",
  "Vocabulary > Synonyms > Word Meaning", 15, "A quandary is a state of uncertainty about what to do.\nAnswer: (a)", theme="Quandary")

Q(39, DEF + "Presumption:", ["Prediction based on past experiences", "Judgement made with certainty", "Decision based on facts", "Opinion formed before having all the facts"], "D",
  "Vocabulary > Synonyms > Word Meaning", 25, "A presumption is an idea taken to be true without full proof, an opinion formed before having all the facts.\nAnswer: (d)", theme="Presumption")

Q(40, DEF + "Smug:", ["Too confident about one's own achievements", "Too eager to help or obey someone important", "Too emotional or dramatic", "Too eager to bottle up conflicts"], "A",
  "Vocabulary > Synonyms > Word Meaning", 15, "Smug means excessively pleased with oneself or one's achievements. (b) describes obsequiousness.\nAnswer: (a)", theme="Smug")

SP = "Sentence Organisation > Ordering of Sentence Parts > Sentence Parts"

Q(41, PARTS + "P: of children they also contain deeply embedded\nQ: whereas traditional fairy tales\nR: moral lessons that are relevant even for adults\nS: were designed for the entertainment",
  ["R P Q S", "Q S R P", "R P S Q", "Q S P R"], "D", SP, 20,
  "Whereas traditional fairy tales (Q) were designed for the entertainment (S) of children they also contain deeply embedded (P) moral lessons that are relevant even for adults (R).\nAnswer: (d)", pattern=ORD, theme="Fairy tales and moral lessons")

Q(42, PARTS + "P: of school education is an ineluctable truth\nQ: that sporting activities are an integral part\nR: meaningfully towards the overall growth of a student\nS: that underscores the learning process and contributes",
  ["Q P S R", "Q S R P", "R P S Q", "Q S P R"], "A", SP, 30,
  "That sporting activities are an integral part (Q) of school education is an ineluctable truth (P) that underscores the learning process and contributes (S) meaningfully towards the overall growth of a student (R).\nAnswer: (a)", pattern=ORD, theme="Sports in school education")

Q(43, PARTS + "P: and contentment on account of a life lived\nQ: the beneficial outcome of\nR: well without retribution or rebuke\nS: a virtuous life is peace of mind",
  ["S R Q P", "S P Q R", "Q S P R", "Q S R P"], "C", SP, 25,
  "The beneficial outcome of (Q) a virtuous life is peace of mind (S) and contentment on account of a life lived (P) well without retribution or rebuke (R).\nAnswer: (c)", pattern=ORD, theme="Outcome of a virtuous life")

Q(44, PARTS + "P: more representative than the latter\nQ: from a non-parliamentary system\nR: in as much as the former is\nS: it is widely believed that the parliamentary system differs",
  ["S Q R P", "S P Q R", "R S P Q", "P S R Q"], "A", SP, 20,
  "It is widely believed that the parliamentary system differs (S) from a non-parliamentary system (Q) in as much as the former is (R) more representative than the latter (P).\nAnswer: (a)", pattern=ORD, theme="Parliamentary versus non-parliamentary systems")

Q(45, PARTS + "P: crushes the spirit behind the service\nQ: it stunts the person offering the same and\nR: exhibition or for fear of public opinion\nS: when service is done for",
  ["S Q R P", "S P Q R", "R S P Q", "S R Q P"], "D", SP, 20,
  "When service is done for (S) exhibition or for fear of public opinion (R), it stunts the person offering the same and (Q) crushes the spirit behind the service (P).\nAnswer: (d)", pattern=ORD, theme="Service done for show")

Q(46, FIB + "It does not look like he is going __________ in his studies than what was predicted by his school principal.",
  ["any further", "further", "farther", "any farther"], "A", "Grammar and Usage > Fill in the Blanks > Vocabulary in Context", 30,
  "'Further' is used for figurative progress (farther is for physical distance). In a negative sentence 'any further' is idiomatic: 'not going any further'.\nAnswer: (a)", theme="Further versus farther")

Q(47, FIB + "__________ all the confusion the thief made a quiet getaway.",
  ["Among", "Amongst", "Amidst", "Amid"], "D", "Grammar and Usage > Fill in the Blanks > Prepositions", 30,
  "'Among/amongst' are used with countable plurals; 'confusion' is uncountable, so 'amid' (in the middle of) is required. 'Amidst' is an older, more literary form of the same word.\nAnswer: (d)", theme="Amid with an uncountable noun")
F(47, "Amid and Amidst are equivalent; DP picks 'Amid'")

Q(48, FIB + "The intricate operation on the patient required the expertise of a/an __________ surgeon.",
  ["special", "especial", "specialist", "specialised"], "C", "Grammar and Usage > Fill in the Blanks > Vocabulary in Context", 25,
  "'Specialist surgeon' is the standard term for a surgeon with expert training in one field. 'Special' and 'especial' mean unusual or particular.\nAnswer: (c)", theme="Specialist")

Q(49, FIB + "There are __________ thirty students inside the classroom at any time.",
  ["less than", "fewer than", "less then", "fewer then"], "B", "Grammar and Usage > Fill in the Blanks > Vocabulary in Context", 15,
  "'Fewer' is used with countable nouns such as students, and the comparison word is 'than', not 'then'.\nAnswer: (b)", theme="Fewer than")

Q(50, FIB + "There are many __________ vehicles on the highway due to a sudden landslide.",
  ["stationery", "stationed", "stranded", "straggle"], "C", "Grammar and Usage > Fill in the Blanks > Vocabulary in Context", 15,
  "Vehicles unable to move because of a landslide are 'stranded'. 'Stationery' means writing materials.\nAnswer: (c)", theme="Stranded")
