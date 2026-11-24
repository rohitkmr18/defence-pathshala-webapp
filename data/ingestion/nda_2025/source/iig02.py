from qfmt import Q, P, F, W

# NDA II 2025 GAT, Set A, Part B, Q69-101 (booklet pages 19-29)
PH = "Science & Technology > Physics > "
CH = "Science & Technology > Chemistry > "
MH = "History > Modern History > "
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"

Q(69, "Bottom of a tank containing water appears to be raised. It is due to",
  ["Reflection of light", "Refraction of light", "Interference of light", "Diffraction of light"], "B", PH + "Geometrical & Physical Optics", 10,
  "Light from the bottom bends away from the normal as it passes from water into air, so the bottom appears at a smaller apparent depth (real depth divided by refractive index).\nAnswer: (b)", theme="Apparent depth")

Q(70, "SONAR stands for",
  ["Sonographic Natural Ranging", "Simple Operational Navigation Ranging", "Sound Navigation and Ranging", "Simple Operational Natural Ranging"], "C", PH + "Waves, Acoustics & Electromagnetic Spectrum", 5,
  "SONAR is Sound Navigation and Ranging; it uses ultrasonic echoes to locate underwater objects.\nAnswer: (c)", theme="SONAR")

Q(71, "Which one of the following radiations has longer wavelength?",
  ["X-rays", "Ultraviolet", "Micro Wave", "Infra-red"], "C", PH + "Waves, Acoustics & Electromagnetic Spectrum", 10,
  "In order of increasing wavelength: X-rays < ultraviolet < infrared < microwaves.\nAnswer: (c)", theme="Order of the EM spectrum")

Q(72, "For a material under static conditions, which one among the following statements is correct?",
  ["An insulator can be charged", "A perfect conductor can be charged", "Both perfect conductor and insulator can be charged", "Both perfect conductor and insulator cannot be charged"], "C",
  PH + "Electricity & Electric Circuits", 30,
  "Any isolated body can hold a static charge. An insulator keeps it where it is placed; an insulated conductor keeps it on its outer surface. So both can be charged.\nAnswer: (c)", theme="Charging conductors and insulators")
F(72, "Wording ambiguous; DP picks 'both can be charged'")

Q(73, "A person can see nearby objects clearly but cannot see distant object distinctly, the person is suffering with",
  ["Hypermetropia", "Presbyopia", "Myopia", "None of above"], "C", PH + "Geometrical & Physical Optics", 5,
  "Short-sightedness (myopia) is the inability to see distant objects clearly; it is corrected with a concave lens.\nAnswer: (c)", theme="Myopia")

Q(74, "The energy is always conserved for a system which is",
  ["isolated only", "non-isolated only", "both isolated and non-isolated", "none of above"], "A", PH + "Thermodynamics, Heat & Kinetic Theory", 25,
  "The total energy of a system stays constant only if no energy enters or leaves it, i.e. for an isolated system. A non-isolated system can gain or lose energy.\nAnswer: (a)", theme="Conservation of energy in isolated systems")

Q(75, "Suppose, a ball of mass M is thrown upwards from a point A and it reaches up to the highest point B and returns back to point A, which one among the following is correct?",
  ["Kinetic Energy at A = Potential Energy at B", "Kinetic Energy at A = Potential Energy at A", "Kinetic Energy at B = Potential Energy at B", "Kinetic Energy at B = Kinetic Energy at A"], "A", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "Taking A as the zero of potential energy and ignoring air resistance, all the kinetic energy at A becomes potential energy at the highest point B, where the speed is zero.\nAnswer: (a)", theme="Energy conversion in vertical throw")

Q(76, "Who among the following presided over the first session of All India Kisan Sabha in Lucknow in April 1936?",
  ["Sahajananda Saraswati", "R. G. Ranga", "Ram Manohar Lohia", "Jayaprakash Narayan"], "A", MH + "Peasant & Tribal Movements", 30,
  "The All India Kisan Sabha was founded at Lucknow in April 1936 with Swami Sahajananda Saraswati as president and N. G. Ranga as general secretary.\nAnswer: (a)", theme="All India Kisan Sabha 1936")

Q(77, "Who among the following founded the 'Self-Respect Movement'?",
  ["Jyotiba Phule", "Swami Vivekananda", "E. V. Ramaswami Naicker", "Dr. B. R. Ambedkar"], "C", MH + "Socio-Religious Reform", 10,
  "E. V. Ramaswami Naicker (Periyar) launched the Self-Respect Movement in Tamil Nadu in 1925.\nAnswer: (c)", theme="Self-Respect Movement")

Q(78, "Chola inscriptions mention several categories of lands. Which one of the following was meant for the maintenance of school?",
  ["Tirunamattukkani", "Shalabhoga", "Vellanvagai", "Pallichhandam"], "B", "History > Medieval History > Regional Kingdoms & States", 35,
  "In Chola inscriptions, shalabhoga was land for the maintenance of a school; tirunamattukkani was land gifted to temples, vellanvagai was land of non-Brahmana peasant proprietors and pallichhandam was land donated to Jaina institutions.\nAnswer: (b)", theme="Chola land categories")

Q(79, """Which of the following statements about the Home Rule League are correct?

1. Lokamanya Tilak set up the Home Rule League at the Bombay Provincial Conference held at Belgaum in April 1916
2. Annie Besant announced the formation of Home Rule League in September 1916
3. To avoid friction, Tilak's League was to work in Maharashtra (excluding Bombay city), Karnataka, Central Provinces and Berar and Besant's League was given charge of the rest of India

Select the answer using the code given below:""",
  ["1 and 2 only", "1 and 3 only", "2 and 3 only", "1, 2 and 3"], "D", MH + "Indian National Movement", 35,
  "Tilak's League was set up at the Bombay Provincial Conference at Belgaum in April 1916; Besant announced hers in September 1916. The two leagues divided the work exactly as stated in 3.\nAnswer: (d)", pattern=S3, theme="Home Rule Leagues")

Q(80, "Which one of the following statements about Ishwar Chandra Vidyasagar is NOT correct?",
  ["He was the Principal of Sanskrit College, Calcutta", "He was a Government Inspector of Schools", "He was a Secretary to the Bethune School", "He was the founder of Widow Remarriage Association"], "D", MH + "Socio-Religious Reform", 35,
  "Vidyasagar was Principal of Sanskrit College, an inspector of schools and secretary of the Bethune School. He led the campaign that produced the Widow Remarriage Act of 1856, but the Widow Remarriage Association was founded in Bombay by Vishnu Shastri Pandit.\nAnswer: (d)", theme="Ishwar Chandra Vidyasagar")

Q(81, """Match List I with List II and select the answer using the code given below the Lists:

| List I (Reformer) | List II (Social Work/Text) |
|---|---|
| A. Vishnu Shastri Pundit | 1. Vedic Physics: Scientific Origin of Hinduism |
| B. Karsondas Mulji | 2. Widow Remarriage Association |
| C. Debendranath Tagore | 3. Satya Prakash |
| D. Raja Ram Mohan Roy | 4. Tattvabodhini Sabha |

Code:""",
  ["A-1, B-3, C-4, D-2", "A-1, B-4, C-3, D-2", "A-2, B-3, C-4, D-1", "A-2, B-4, C-3, D-1"], "C", MH + "Socio-Religious Reform", 35,
  "Vishnu Shastri Pandit founded the Widow Remarriage Association; Karsondas Mulji ran the Gujarati paper Satya Prakash; Debendranath Tagore founded the Tattvabodhini Sabha; the remaining pair goes to Ram Mohan Roy.\nAnswer: (c)", pattern="Match the Following", theme="Reformers and their works")

Q(82, "In the Harappan Civilization, traces of canals have been found at",
  ["Banawali", "Lothal", "Shortughai", "Dholavira"], "C", "History > Ancient History > Indus Valley Civilization", 30,
  "Traces of irrigation canals have been found at the Harappan site of Shortughai in Afghanistan.\nAnswer: (c)", theme="Harappan canals")

Q(83, """Arrange the following foreign travellers to India in chronological order, beginning with the earliest:

1. Peter Mundy
2. Antonio Monserrate
3. Afanasii Nikitich Nikitin
4. Ibn Battuta

Select the answer using the code given below:""",
  ["2 - 1 - 4 - 3", "2 - 3 - 4 - 1", "4 - 3 - 2 - 1", "3 - 4 - 1 - 2"], "C", "History > Medieval History > Society, Economy & Technology", 30,
  "Ibn Battuta (1330s), Afanasii Nikitin (1460s-70s), Antonio Monserrate at Akbar's court (1580s), Peter Mundy (1630s).\nAnswer: (c)", pattern="Chronology", theme="Foreign travellers to India")

Q(84, "With which of the following was the Bretton Woods System NOT associated",
  ["International Monetary Fund", "Economic recovery after the Second World War", "International Bank for Reconstruction and Development", "Establishment of a monetary system based on floating exchange rate"], "D",
  "History > World History > Economic & Monetary History", 20,
  "The Bretton Woods conference (1944) created the IMF and IBRD to support post-war recovery and set up fixed (pegged) exchange rates. Floating rates came after the system collapsed in the early 1970s.\nAnswer: (d)", theme="Bretton Woods system")

Q(85, "Senguttuvan is the name of",
  ["a Pandya ruler", "a Chola king", "a minister in Satavahana court", "the capital city of the Cheras"], "B", "History > Ancient History > South Indian Kingdoms", 40,
  "Senguttuvan (the 'Red Chera') was a Chera ruler of the Sangam age, celebrated in the Silappadikaram for building a memorial to Kannagi. He was not a Pandya or Chola king, a Satavahana minister or a Chera capital, so none of the printed options is correct.\nAnswer: none of the options is correct (item withheld)", theme="Senguttuvan")
W(85, "No correct option: Senguttuvan was a Chera king; options list Pandya ruler, Chola king, Satavahana minister, Chera capital.")

Q(86, "The Ramacharita, an example of dvyasrya-kavya, telling two stories simultaneously, was written by",
  ["Subandhu", "Bhatti", "Sandhyakara", "Kamban"], "C", "History > Medieval History > Literature, Architecture & Arts", 40,
  "Sandhyakara Nandi's Ramacharita (12th century) narrates the story of Rama and of the Pala king Ramapala at the same time, verse by verse.\nAnswer: (c)", theme="Ramacharita of Sandhyakara Nandi")

Q(87, "Which of the following Acts established the Board of Control to guide and control the work of the Court of Directors and the Government of India?",
  ["Regulating Act of 1773", "Pitt's India Act of 1784", "Charter Act of 1793", "Charter Act of 1813"], "B", MH + "British Administration & Constitutional Development", 15,
  "Pitt's India Act, 1784 created the Board of Control, setting up dual control of the Company's Indian affairs.\nAnswer: (b)", theme="Pitt's India Act")

Q(88, "Who among the following Sikh Gurus laid the foundation of the Khalsa Panth?",
  ["Guru Nanak", "Guru Arjan", "Guru Hargobind", "Guru Gobind Singh"], "D", "History > Medieval History > Maratha & Sikh Traditions", 5,
  "Guru Gobind Singh founded the Khalsa at Anandpur in 1699.\nAnswer: (d)", theme="Founding of the Khalsa")

PLAN = "Economy > Development & Welfare > Economic Planning"

Q(89, "Which one among the following plans is also known as Mahalanobis Plan?",
  ["First Five Year Plan", "Second Five Year Plan", "Third Five Year Plan", "Sixth Five Year Plan"], "B", PLAN, 10,
  "The Second Five Year Plan (1956-61), stressing heavy industry, was based on P. C. Mahalanobis's model.\nAnswer: (b)", theme="Mahalanobis model")

Q(90, "Which of the following were the years of Annual Plans?",
  ["1956-1957", "1966-1969", "1975-1976", "1992-1993"], "B", PLAN, 15,
  "After the Third Plan, three Annual Plans were run from 1966 to 1969 (the 'plan holiday') before the Fourth Plan. Another pair of annual plans ran in 1990-92.\nAnswer: (b)", theme="Plan holiday")

Q(91, """Consider the following statements about BRICS Summits:

1. The first BRICS Summit was held in Brazil
2. BRICS Summits were held in New Delhi on three occasions

Which of the statements given above is/are correct?""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "D", "International Relations > Regional Organisations > Global & Transregional Groupings", 40,
  "The first (BRIC) summit was held at Yekaterinburg, Russia in 2009. India hosted in 2012 (New Delhi), 2016 (Goa) and 2021 (virtual, chaired from New Delhi), so only one in-person summit was held in New Delhi.\nAnswer: (d)", pattern=S2, theme="BRICS summits")
F(91, "Statement 2 depends on counting the 2021 virtual summit; DP treats it as not correct")

Q(92, """Placing the earliest first, arrange the following international events in the chronological order:

1. Introduction of www (World Wide Web)
2. Advent of Inter-Continental Ballistic Missiles
3. Launch of first communication satellite

Select the answer using the code given below:""",
  ["2 - 1 - 3", "1 - 2 - 3", "3 - 2 - 1", "2 - 3 - 1"], "D", "History > World History > Cold War & Decolonization", 25,
  "The first ICBM (Soviet R-7) flew in 1957; the first communication satellite (SCORE, 1958; Telstar, 1962) followed; the World Wide Web came in 1989-91.\nAnswer: (d)", pattern="Chronology", theme="Cold War technology timeline")

Q(93, """Which of the following rights under the Constitution of India is/are Fundamental Right(s)?

1. Right to work
2. Right to privacy
3. Right to free and compulsory education in the age bracket of six to eighteen years

Select the answer using the code given below:""",
  ["1 and 2", "2 and 3", "2 only", "3 only"], "C", "Polity > Rights & Liberties > Fundamental Rights", 25,
  "The right to work is a Directive Principle (Article 41). Privacy is part of Article 21 (Puttaswamy, 2017). Article 21A covers children aged 6 to 14, not 6 to 18.\nAnswer: (c)", pattern=S3, theme="Fundamental Rights")

Q(94, """Consider the following statements with regard to flags of International Organizations:

1. The flag of EU has a circle of gold stars on a white background
2. The Flag of the UN carries two pairs of olive tree branches
3. The ASEAN flag carries blue, red, white and yellow colours

How many of the above statements is/are correct?""",
  ["Nil", "1", "2", "3"], "B", "International Relations > International Organisations > UN System & Multilateral Institutions", 40,
  "The EU flag has 12 gold stars on a blue background. The UN flag shows the world map within a wreath of two olive branches (one pair). The ASEAN flag uses blue, red, white and yellow. Only 3 is correct.\nAnswer: (b)", pattern="Statement Count", theme="Flags of international organisations")
F(94, "UN emblem has two olive branches (one pair); DP treats statement 2 as wrong")

Q(95, "Which one of the following committees is NOT associated with decentralization of Panchayati Raj institutions in India?",
  ["Balwant Rai Mehta Committee", "Ashok Mehta Committee", "L. M. Singhvi Committee", "Abhijit Sen Committee"], "D", "Polity > Local Government > Panchayati Raj", 20,
  "Balwant Rai Mehta (1957), Ashok Mehta (1977) and L. M. Singhvi (1986) all dealt with Panchayati Raj. The Abhijit Sen Committee (2000-02) dealt with long-term grain policy.\nAnswer: (d)", theme="Panchayati Raj committees")

Q(96, "The reaction that occurs on passing carbon dioxide gas through lime water is",
  [r"$\mathrm{CaCO_3+H_2O+CO_2\to Ca(HCO_3)_2}$", r"$\mathrm{Ca(OH)_2+CO_2\to CaCO_3+H_2O}$", r"$\mathrm{CaO+CO_2\to CaCO_3}$", r"$\mathrm{CaCl_2+H_2O+CO_2\to CaCO_3+2HCl}$"], "B",
  CH + "Chemical Reactions, Stoichiometry & Energetics", 10,
  "Lime water is calcium hydroxide solution; CO$_2$ forms insoluble calcium carbonate, which makes it milky. (a) happens only with excess CO$_2$.\nAnswer: (b)", theme="Lime water test")

Q(97, "Which one of the following statements is NOT correct?",
  ["Water of crystallization is the fixed number of water molecules present in one formula unit of a salt", r"The molecular formula of Plaster of Paris is $\mathrm{CaSO_4\cdot 2H_2O}$",
   "Washing soda is used for removing the permanent hardness of water", "The atmosphere of Venus is made up of thick white and yellow clouds of sulphuric acid"], "B",
  CH + "Acids, Bases, pH & Commercial Inorganic Salts", 20,
  "Plaster of Paris is $\\mathrm{CaSO_4\\cdot\\tfrac12H_2O}$; $\\mathrm{CaSO_4\\cdot2H_2O}$ is gypsum.\nAnswer: (b)", theme="Plaster of Paris and gypsum")

Q(98, "Which one of the following type of medicines is used for treating indigestion?",
  ["Analgesic", "Antiseptic", "Antibiotic", "Antacid"], "D", CH + "Industrial, Materials & Applied Chemistry", 5,
  "Antacids neutralise excess stomach acid and relieve indigestion.\nAnswer: (d)", theme="Antacids")

Q(99, "Which one of the following is NOT present in cement?",
  [r"$\mathrm{2CaO\cdot SiO_2}$", r"$\mathrm{3CaO\cdot SiO_2}$", r"$\mathrm{4CaO\cdot SiO_2}$", r"$\mathrm{3CaO\cdot Al_2O_3}$"], "C", CH + "Industrial, Materials & Applied Chemistry", 30,
  "Portland cement contains dicalcium silicate, tricalcium silicate, tricalcium aluminate and tetracalcium aluminoferrite. There is no '4CaO·SiO$_2$'.\nAnswer: (c)", theme="Composition of cement")

Q(100, "Which one of the following is NOT a chemical change?",
  ["Burning of coal", "Rusting of metal", "Melting of ice", "Reaction of acid with base"], "C", CH + "Chemical Composition & Classification", 5,
  "Melting changes only the physical state of water; no new substance is formed.\nAnswer: (c)", theme="Physical and chemical changes")

Q(101, "Which one of the following statements is NOT correct?",
  ["The interconversion of states of matter is a physical change", "During burning of a candle, both chemical and physical changes take place",
   "During a physical change, the chemical composition of molecules changes", "Rusting of iron is a chemical change"], "C", CH + "Chemical Composition & Classification", 10,
  "In a physical change the composition stays the same; only the form or state changes.\nAnswer: (c)", theme="Nature of physical change")
