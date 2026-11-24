from qfmt import Q, P, F, W

# NDA I 2025 GAT, Set A (AEBC-A-GAT), Part B General Knowledge, Q51-150
PH = "Science & Technology > Physics > "
CH = "Science & Technology > Chemistry > "
BI = "Science & Technology > Biology/Life Sciences > "
PG = "Geography > Physical Geography > "
IG = "Geography > Indian Geography > "
MH = "History > Modern History > "
AH = "History > Ancient History > "
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"
S4 = "4-Statement Combination"
MT = "Match the Following"
CHR = "Chronology"

Q(51, "Which of the following main industry/industries was/were developed in the second industrial revolution that took place after about 1850?",
  ["Coal and iron", "Cotton spinning and weaving", "Chemical and electrical", "Steam engines"], "C", "History > World History > Industrial Revolution", 20,
  "The first industrial revolution was built on cotton, coal, iron and steam. The second (after about 1850) brought chemicals, electricity, steel and later oil and automobiles.\nAnswer: (c)", theme="Second industrial revolution")

Q(52, "Which among the following materials was used in making the Harappan seals?",
  ["Sandstone", "Lapis lazuli", "Jasper", "Steatite"], "D", AH + "Indus Valley Civilization", 10,
  "Most Harappan seals were carved from steatite (soapstone).\nAnswer: (d)", theme="Harappan seals")

Q(53, "Which one among the following mahajanapadas in ancient India was an oligarchy?",
  ["Vajji", "Kosala", "Gandhara", "Magadha"], "A", AH + "Mahajanapadas & Magadha", 15,
  "The Vajji confederacy (with Vaishali) was a gana-sangha ruled by an assembly. Kosala, Gandhara and Magadha were monarchies.\nAnswer: (a)", theme="Gana-sanghas")

Q(54, "Which one of the following sculptures found at Sanchi Stupa is NOT directly inspired by Buddhist ideas?",
  ["Empty seat", "Shalbhanjika", "Tree", "Wheel"], "B", "History > Art & Culture > Sculpture & Visual Arts", 30,
  "The empty seat, tree and wheel are symbols of the Buddha's meditation, enlightenment and first sermon. The shalabhanjika (woman under a tree) is an auspicious folk fertility motif, not a Buddhist idea.\nAnswer: (b)", theme="Sanchi sculptures")

Q(55, "In British India, which one among the following Acts permitted detention without trial for up to two years?",
  ["Regulating Act, 1773", "Rowlatt Act, 1919", "Pitt's India Act, 1784", "Government of India Act, 1935"], "B", MH + "Indian National Movement", 10,
  "The Rowlatt Act (1919) allowed political prisoners to be detained without trial for up to two years.\nAnswer: (b)", theme="Rowlatt Act")

Q(56, "Which one of the following statements about the Bhoodan Movement is correct?",
  ["The target was to get one-sixth of cultivable land in India as donation", "It was approved through a Central Government Act",
   "It was ensured that the donated land was free from all litigation", "The first donation of land was in Bihar"], "A", MH + "Post-Independence India", 35,
  "Vinoba Bhave asked landowners to give one-sixth of their land and set a target of 50 million acres, about one-sixth of India's cultivable land. The first gift was at Pochampally (Telangana) in 1951. There was no central Act, and much donated land was disputed or unfit.\nAnswer: (a)", theme="Bhoodan movement")

Q(57, "The Constitution (Seventy-third Amendment) Act provides for",
  ["an elaborate system of establishing municipal self-government", "an elaborate system of establishing panchayats as units of self-government",
   "establishing a Commission for Linguistic Minorities", "the creation of the Jharkhand State"], "B", "Polity > Local Government > Panchayati Raj", 10,
  "The 73rd Amendment (1992) added Part IX on panchayats; the 74th deals with municipalities.\nAnswer: (b)", theme="73rd Amendment")

Q(58, "BHARATPOL portal has been developed by",
  ["The Election Commission of India", "The Central Bureau of Investigation", "The Enforcement Directorate", "The Securities and Exchange Board of India"], "B",
  "Current Affairs > Defence & Security > Internal Security", 20,
  "BHARATPOL, launched in January 2025, was developed by the CBI to connect Indian law enforcement agencies with Interpol for faster international assistance.\nAnswer: (b)", theme="BHARATPOL")

Q(59, "Which one of the following statements about the Parliament of India is correct?",
  ["A majority of members of Rajya Sabha are elected by a system of proportional representation by means of single transferable vote",
   "The Deputy Chairperson of the Rajya Sabha is nominated by the President from among the members of the Rajya Sabha",
   "The Lok Sabha cannot be dissolved before the completion of its five year term", "The members of Lok Sabha also vote in the election of the members of Rajya Sabha"], "A",
  "Polity > Legislature > Parliament", 20,
  "Elected Rajya Sabha members (all but 12) are chosen by state legislators by proportional representation through the single transferable vote. The Deputy Chairman is elected by the House, the Lok Sabha can be dissolved early, and Lok Sabha members do not vote in Rajya Sabha elections.\nAnswer: (a)", theme="Rajya Sabha elections")

Q(60, "Which one among the following does NOT figure among the Five Principles of Panchsheel?",
  ["Mutual respect for each other's territorial integrity and sovereignty", "Equality and mutual benefit", "Peaceful coexistence", "Nuclear non-proliferation"], "D",
  "International Relations > International Political Concepts > Non-Aligned Movement", 10,
  "Panchsheel (1954): mutual respect for territorial integrity and sovereignty, non-aggression, non-interference, equality and mutual benefit, and peaceful coexistence.\nAnswer: (d)", theme="Panchsheel")

Q(61, "Maize (makka) was introduced into India in the seventeenth century via",
  ["Portugal", "Africa and Spain", "China and Mongolia", "Turkey"], "B", "History > Medieval History > Society, Economy & Technology", 30,
  "NCERT (Themes in Indian History II) says maize reached India via Africa and Spain and by the seventeenth century was one of the main crops of western India.\nAnswer: (b)", theme="Introduction of maize")

Q(62, """Match List I with List II and select the answer using the code given below the Lists:

| List I (Five Year Plan) | List II (Objective) |
|---|---|
| A. Fifth Five Year Plan | 1. Towards Faster and More Inclusive Growth |
| B. Seventh Five Year Plan | 2. Garibi Hatao (Removal of Poverty) |
| C. Ninth Five Year Plan | 3. Food, Work and Productivity |
| D. Eleventh Five Year Plan | 4. Growth with Social Justice and Equality |

Code:""",
  ["A-1, B-4, C-3, D-2", "A-2, B-3, C-4, D-1", "A-2, B-4, C-3, D-1", "A-1, B-3, C-4, D-2"], "B", "Economy > Development & Welfare > Economic Planning", 25,
  "Fifth: Garibi Hatao; Seventh: Food, Work and Productivity; Ninth: Growth with Social Justice and Equality; Eleventh: Faster and More Inclusive Growth.\nAnswer: (b)", pattern=MT, theme="Plan slogans")

Q(63, """Which of the following statements about Srimanta Shankardeva is/are correct?

1. In the late fifteenth century Shankardeva emerged as one of the leading proponents of Vaishnavism in Assam
2. He was the founder of Gaudiya Vaishnavism
3. His teachings are known as Bhagavati Dharma
4. He encouraged the establishment of satra and naam ghar

Select the answer using the code given below:""",
  ["1 and 2 only", "2 and 3 only", "1, 3 and 4 only", "1, 2, 3 and 4"], "C", "History > Medieval History > Bhakti & Sufi Traditions", 25,
  "Shankardeva led Vaishnavism in Assam from the late 15th century; his teachings are called Bhagavati dharma; he set up satras and naam ghars. Gaudiya Vaishnavism was founded by Chaitanya.\nAnswer: (c)", pattern=S4, theme="Shankardeva")

Q(64, "At which one among the following places did the British East India Company found its factory in the year 1611?",
  ["Madras", "Masulipatam", "Bombay", "Balasore"], "B", MH + "European Expansion & Company Rule", 20,
  "The English set up their first factory on the east coast at Masulipatnam in 1611 (Surat followed in 1613).\nAnswer: (b)", theme="Early English factories")

Q(65, """Chronologically arrange the following political events related to Indian National Movement beginning from the earliest:

1. Formation of Swaraj Party
2. Communal Award
3. Lucknow Pact
4. Simla Conference

Select the answer using the code given below:""",
  ["3, 1, 2, 4", "1, 3, 2, 4", "2, 1, 4, 3", "1, 2, 3, 4"], "A", MH + "Indian National Movement", 15,
  "Lucknow Pact (1916), Swaraj Party (1923), Communal Award (1932), Simla Conference (1945).\nAnswer: (a)", pattern=CHR, theme="National movement timeline")

Q(66, "Which among the following Acts provided for the establishment of a Supreme Court of Justice at Calcutta for Europeans, their employees and the citizens of India?",
  ["The Regulating Act of 1773", "The Charter Act of 1793", "The Charter Act of 1813", "Government of India Act of 1858"], "A", MH + "British Administration & Constitutional Development", 10,
  "The Regulating Act, 1773 set up the Supreme Court at Calcutta (established 1774).\nAnswer: (a)", theme="Supreme Court at Calcutta")

Q(67, "Who, among the following, has introduced a resolution in 1882 which is also called the Magna Carta of Local Self-Government in India?",
  ["Lord Macaulay", "Lord Canning", "Lord Ripon", "Lord William Bentinck"], "C", MH + "British Administration & Constitutional Development", 10,
  "Lord Ripon's resolution of 1882 is called the Magna Carta of local self-government.\nAnswer: (c)", theme="Ripon's resolution")

Q(68, "Which one of the following terms is associated with the practice of Sufism?",
  ["Jizya", "Ijma", "Muqaddam", "Murid"], "D", "History > Medieval History > Bhakti & Sufi Traditions", 15,
  "A murid is a disciple of a Sufi master (pir/shaikh). Jizya is a tax, ijma is consensus in Islamic law and muqaddam a village headman.\nAnswer: (d)", theme="Sufi terms")

Q(69, """Consider the following features:

1. Consent of the governed
2. Political equality
3. Accountability of the ruled to the ruler

Which of the above feature/features outline democratic rule?""",
  ["1 and 2 only", "2 and 3 only", "1, 2 and 3", "3 only"], "A", "Polity > Political Theory > Political Concepts & Ideologies", 15,
  "Democracy rests on the consent of the governed and political equality. It is the rulers who are accountable to the ruled, not the reverse.\nAnswer: (a)", pattern=S3, theme="Features of democracy")

Q(70, """Placing the earliest first, arrange the following countries in the chronological order in which they granted universal adult franchise:

1. USA
2. Sri Lanka
3. Japan
4. India

Select the answer using the code given below:""",
  ["1, 2, 3, 4", "2, 3, 4, 1", "1, 3, 4, 2", "3, 4, 1, 2"], "B", "Polity > Elections > Electoral System", 30,
  "Following NCERT's table: Sri Lanka 1931, Japan 1945, India 1950 and the USA 1965 (when voting rights were secured for all).\nAnswer: (b)", pattern=CHR, theme="Universal adult franchise")

Q(71, "Which one of the following statements is NOT correct?",
  ["The molecules of soap are sodium or potassium salts of long chain fatty acids", "The molecules of soap contain both hydrophobic and hydrophilic ends",
   "Detergents are more effective than soaps in hard water", "In micelles the ionic-end of the molecules is towards oil droplet while the other end faces outside"], "D",
  CH + "Organic Chemistry & Carbon Compounds", 15,
  "In a micelle the hydrocarbon (hydrophobic) tails point into the oil droplet and the ionic heads face the water outside.\nAnswer: (d)", theme="Soap micelles")

Q(72, "Which one of the following statements is correct?",
  ["A neutron is formed by combination of an electron and a proton. Therefore, it is neutral", "The mass of an electron is about 1/2000 times that of a proton",
   "An isotope of cobalt is used in the treatment of goiter", "J. J. Thomson proposed that the nucleus of an atom contains only neutrons"], "B",
  CH + "Atomic Structure, Isotopes & Periodicity", 15,
  "An electron's mass is about 1/1836 (roughly 1/2000) of a proton's. A neutron is a separate particle, iodine-131 treats goitre, and Thomson had no nucleus in his model.\nAnswer: (b)", theme="Subatomic particles")

Q(73, "Which one of the following particles in the nucleus of an atom was discovered by J. Chadwick?",
  ["Electron", "Proton", "Positron", "Neutron"], "D", CH + "Atomic Structure, Isotopes & Periodicity", 5,
  "James Chadwick discovered the neutron in 1932.\nAnswer: (d)", theme="Discovery of the neutron")

Q(74, "Which one of the following findings is NOT observed in Rutherford's Nuclear Model of Atom?",
  ["There is a neutral centre in an atom called nucleus", "Nearly all the mass of an atom resides in the nucleus", "The electrons revolve around the nucleus in a circular path", "The size of a nucleus is very small as compared to the size of atom"], "A",
  CH + "Atomic Structure, Isotopes & Periodicity", 15,
  "Rutherford found a positively charged centre, not a neutral one.\nAnswer: (a)", theme="Rutherford's model")

Q(75, "Element X forms a chloride with the formula XCl$_2$, which is a solid with high melting point. X would most likely be in the same group of periodic table as",
  ["Na", "Al", "Mg", "K"], "C", CH + "Atomic Structure, Isotopes & Periodicity", 15,
  "XCl$_2$ means valency 2, and the high melting point shows an ionic chloride, like the group 2 metal magnesium (MgCl$_2$).\nAnswer: (c)", theme="Valency from a chloride formula")

Q(76, "Which one of the following oxides is a neutral oxide?", ["CO", "CO$_2$", "Na$_2$O", "MgO"], "A", CH + "Acids, Bases, pH & Commercial Inorganic Salts", 10,
  "Carbon monoxide is neutral. CO$_2$ is acidic; Na$_2$O and MgO are basic.\nAnswer: (a)", theme="Neutral oxides")

Q(77, "Which one of the following is also known as Dry ice in its solid form?", ["SiO$_2$", "CO$_2$", "CaO", "MgO"], "B", CH + "States of Matter & Phase Behaviour", 5,
  "Solid carbon dioxide is dry ice.\nAnswer: (b)", theme="Dry ice")

Q(78, "Which one of the following statements is NOT correct?",
  ["A scale measuring hydrogen ion concentration in a solution is called pH scale", "The higher the hydrogen ion concentration in a solution, higher is its pH",
   "We can measure pH generally from 0 to 14 on a pH scale", "The 'p' in pH stands for 'potenz' in German meaning power"], "B", CH + "Acids, Bases, pH & Commercial Inorganic Salts", 10,
  "pH $=-\\log[\\mathrm H^+]$, so a higher hydrogen ion concentration means a lower pH.\nAnswer: (b)", theme="pH scale")

Q(79, "Which one of the following statements is NOT correct?",
  ["Half mole of nitrogen gas is measured 11.2 litre at STP", "17 gram of ammonia gas contains $6.022\\times10^{23}$ molecules at STP",
   "22.4 litre of CO$_2$ gas at STP contains 44 gram of molecules", "4 gram of hydrogen gas contains $6.022\\times10^{23}$ molecules"], "D", CH + "Chemical Reactions, Stoichiometry & Energetics", 20,
  "4 g of H$_2$ is 2 mol, i.e. $1.204\\times10^{24}$ molecules. The other statements are correct.\nAnswer: (d)", theme="Mole concept")

Q(80, "Which one of the following statements about a compound is NOT correct?",
  ["A compound is a substance composed of two or more elements, chemically combined in a fixed proportion", "Properties of a compound are different from its constituent elements",
   "A compound is an impure substance", "The constituents of a compound can be separated only by chemical or electrochemical reactions"], "C", CH + "Chemical Composition & Classification", 10,
  "A compound is a pure substance with a fixed composition.\nAnswer: (c)", theme="Compounds are pure")

Q(81, """Match List I with List II and select the answer using the code given below the Lists:

| List I (Chemical Name) | List II (Chemical Formula) |
|---|---|
| A. Washing soda | 1. CaOCl$_2$ |
| B. Baking soda | 2. NaHCO$_3$ |
| C. Bleaching powder | 3. Na$_2$CO$_3\\cdot$10H$_2$O |
| D. Gypsum | 4. CaSO$_4\\cdot$2H$_2$O |

Code:""",
  ["A-4, B-2, C-1, D-3", "A-4, B-1, C-2, D-3", "A-3, B-1, C-2, D-4", "A-3, B-2, C-1, D-4"], "D", CH + "Acids, Bases, pH & Commercial Inorganic Salts", 10,
  "Washing soda Na$_2$CO$_3\\cdot$10H$_2$O; baking soda NaHCO$_3$; bleaching powder CaOCl$_2$; gypsum CaSO$_4\\cdot$2H$_2$O.\nAnswer: (d)", pattern=MT, theme="Common salts")

Q(82, "Which one of the following nitrogen oxides may dimerize?", ["N$_2$O", "NO$_2$", "N$_2$O$_3$", "N$_2$O$_5$"], "B", CH + "Chemical Bonding & Molecular Structure", 25,
  "NO$_2$ has an unpaired electron and dimerises to N$_2$O$_4$.\nAnswer: (b)", theme="Dimerisation of NO2")

Q(83, "Which one of the following statements regarding oxidation and reduction reactions is NOT correct?",
  ["If a substance loses hydrogen during reaction, it is reduced", "If a substance loses oxygen during reaction, it is reduced", "If a substance gains hydrogen during reaction, it is reduced", "If a substance gains oxygen during reaction, it is oxidized"], "A",
  CH + "Chemical Reactions, Stoichiometry & Energetics", 10,
  "Loss of hydrogen is oxidation, not reduction.\nAnswer: (a)", theme="Oxidation and reduction")

Q(84, """Match List I with List II and select the answer using the code given below the Lists:

| List I (Physical Quantity) | List II (SI Unit) |
|---|---|
| A. Temperature | 1. Kelvin |
| B. Weight | 2. Kilogram |
| C. Mass | 3. Pascal |
| D. Pressure | 4. Newton |

Code:""",
  ["A-1, B-2, C-4, D-3", "A-3, B-4, C-2, D-1", "A-1, B-4, C-2, D-3", "A-3, B-2, C-4, D-1"], "C", PH + "Units, Dimensions & Measurement", 10,
  "Temperature: kelvin; weight (a force): newton; mass: kilogram; pressure: pascal.\nAnswer: (c)", pattern=MT, theme="SI units")

Q(85, "For acid rain, the pH of rain water should be less than", ["7.0", "6.6", "5.6", "8.0"], "C", "Environment > Environmental Pollution > Air Pollution", 15,
  "Normal rain is slightly acidic (about 5.6) from dissolved CO$_2$; rain below pH 5.6 is called acid rain.\nAnswer: (c)", theme="Acid rain threshold")

Q(86, """Consider the following lines of Longitude and Latitude:

1. Prime Meridian
2. Tropic of Cancer
3. Equator

Which of the above lines is/are a Great Circle?""",
  ["1, 2 and 3", "1 and 2 only", "1 and 3 only", "3 only"], "C", PG + "Earth Motions & Geographical Coordinates", 30,
  "The equator is a great circle. The Prime Meridian with its opposite meridian (180°) forms a great circle, so it is treated as one. The Tropic of Cancer is a small circle.\nAnswer: (c)", pattern=S3, theme="Great circles")
F(86, "A single meridian is a semicircle; strict reading gives '3 only'. DP follows the usual key (c)")

Q(87, """Which of the following is the correct ascending order of the given minerals in terms of their presence in the Earth's crust?

1. Amphibolite
2. Mica
3. Pyroxene

Select the answer using the code given below:""",
  ["2, 3, 1", "1, 2, 3", "2, 1, 3", "1, 3, 2"], "C", PG + "Rocks & Minerals", 40,
  "Approximate crustal shares: mica about 4-5%, amphiboles about 5-7%, pyroxenes about 11%. Ascending: mica, amphibole, pyroxene.\nAnswer: (c)", pattern="Ordering/Sequence", theme="Abundance of crustal minerals")
F(87, "Abundance figures vary by source; DP order mica < amphibole < pyroxene")

Q(88, """Which of the following is/are the applied forces in mechanical weathering process?

1. Gravitational force
2. Expansion force
3. Force due to water pressure

Select the answer using the code given below:""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PG + "Geomorphology & Earth Surface Processes", 25,
  "NCERT: in mechanical weathering the applied forces can be gravitational (overburden, load, shearing), expansion (temperature change, crystal growth, animals) and water pressure from wetting and drying.\nAnswer: (d)", pattern=S3, theme="Forces in mechanical weathering")

Q(89, """Which of the following is/are cold ocean current/currents?

1. Alaska Current
2. North Atlantic Drift
3. West Wind Drift

Select the answer using the code given below:""",
  ["1 only", "1 and 2", "2 and 3", "3 only"], "D", PG + "Oceanography", 20,
  "The Alaska Current and North Atlantic Drift are warm; the West Wind Drift (Antarctic Circumpolar Current) is cold.\nAnswer: (d)", pattern=S3, theme="Cold currents")

Q(90, "Which one of the following latitudes will experience a minimum angle of the Sun's rays when it is Summer Solstice in the Northern Hemisphere?",
  ["Arctic Circle", "Equator", "Tropic of Cancer", "Tropic of Capricorn"], "D", PG + "Earth Motions & Geographical Coordinates", 35,
  "On 21 June the Sun is overhead at 23.5°N. Noon altitude is 90° minus the angular distance from 23.5°N: Tropic of Cancer 90°, Equator 66.5°, Arctic Circle 47°, Tropic of Capricorn 43°. The lowest angle is at the Tropic of Capricorn.\nAnswer: (d)", theme="Sun angle at the June solstice")

Q(91, """Which of the following statements with reference to Coriolis force is/are correct?

1. Coriolis force acts perpendicular to the pressure gradient force
2. At the equator, the Coriolis force is zero and the wind blows perpendicular to the isobars

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Geography > Physical Geography > Atmospheric Circulation", 25,
  "Both are NCERT statements: the Coriolis force acts perpendicular to the pressure gradient force, and at the equator it is zero, so wind blows perpendicular to the isobars.\nAnswer: (c)", pattern=S2, theme="Coriolis force")

Q(92, """Which of the following statements with reference to Sleet is/are correct?

1. Sleet is frozen raindrops and refrozen melted snow-water
2. It occurs when a layer of air with the temperature below freezing point overlies a warm layer near the ground surface

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", PG + "Climatology", 30,
  "Statement 1 is NCERT's definition. Sleet forms when a layer above freezing overlies a sub-freezing layer near the ground; statement 2 reverses this.\nAnswer: (a)", pattern=S2, theme="Sleet")

Q(93, "Humid Subtropical Climate is NOT experienced in which one among the following regions?",
  ["Coastal South Africa", "East coast of Australia", "South Japan", "South Argentina"], "D", "Geography > World Geography > World Regional Geography", 30,
  "Humid subtropical climate occurs on the eastern margins of continents around 25-35°: south-east Africa, eastern Australia, southern Japan and north-east Argentina/Uruguay. Southern Argentina (Patagonia) is cool and dry.\nAnswer: (d)", theme="Humid subtropical regions")

Q(94, "Mahendragiri, the highest peak of the Eastern Ghats, is located in which one of the following states?",
  ["Andhra Pradesh", "Odisha", "Telangana", "Tamil Nadu"], "B", IG + "Physiography of India", 20,
  "NCERT names Mahendragiri (1,501 m), in Odisha, as the highest peak of the Eastern Ghats. (Arma Konda in Andhra Pradesh is higher by some measures.)\nAnswer: (b)", theme="Mahendragiri")

Q(95, """Temperate forests of South India, known as 'Sholas' are found in which of the following hills?

1. Anaimalai
2. Nilgiris
3. Palani

Select the answer using the code given below:""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", IG + "Indian Vegetation", 20,
  "NCERT: the temperate forests called sholas are found in the Nilgiris, Anaimalai and Palani hills.\nAnswer: (d)", pattern=S3, theme="Shola forests")

Q(96, "As per the Annual Report 2023-24 of the Ministry of Mines, Government of India, which of the following states are the major producer of Copper in the country?",
  ["Rajasthan and Gujarat", "Rajasthan and Madhya Pradesh", "Jharkhand and Rajasthan", "Jharkhand and Madhya Pradesh"], "B", IG + "Resources & Minerals", 25,
  "Copper ore output comes almost entirely from Madhya Pradesh (Malanjkhand) and Rajasthan (Khetri).\nAnswer: (b)", theme="Copper-producing states")

Q(97, "Which one among the following is NOT a major oil field located in Gujarat?", ["Ankaleshwar", "Kosamba", "Mehsana", "Moran"], "D", IG + "Resources & Minerals", 15,
  "Moran is an oil field in Assam; the others are in Gujarat.\nAnswer: (d)", theme="Gujarat oil fields")

Q(98, "As per the Land Revenue Records, any land is categorized as Culturable Waste-Land if it is left fallow (uncultivated) for more than",
  ["2 years", "3 years", "4 years", "5 years"], "D", "Geography > Human Geography > Economic Geography", 20,
  "NCERT: land left uncultivated for more than five years is classed as culturable waste-land.\nAnswer: (d)", theme="Land-use categories")

Q(99, "Which one among the following is NOT included in the National Food Security Mission Commercial Crops (NFSM-CC)?",
  ["Cotton", "Coffee", "Jute", "Sugar cane"], "B", "Economy > Agriculture & Rural Economy > Agricultural Policy", 25,
  "NFSM-Commercial Crops covers cotton, jute and sugarcane. Coffee is handled by the Coffee Board.\nAnswer: (b)", theme="NFSM commercial crops")

Q(100, """Consider the following statements with regard to a steel plant:

I. It was setup in 1964 with Russian collaboration
II. It receives iron ore from the Rourkela region
III. Water and Hydel power is supplied by the Damodar Valley Corporation

Identify the Steel Plant on the basis of the above facts:""",
  ["Bhilai Steel Plant", "Bokaro Steel Plant", "Rourkela Steel Plant", "Durgapur Steel Plant"], "B", "Geography > Economic Geography > Industrial Geography", 20,
  "NCERT describes Bokaro: set up in 1964 with Russian collaboration, iron ore from the Rourkela region, water and hydel power from the DVC.\nAnswer: (b)", theme="Bokaro steel plant")

Q(101, "An offshore terminal at Vadinar has been developed to reduce pressure from which of the following major ports in India?",
  ["Kandla Port", "Cochin Port", "Mormugao Port", "New Mangalore Port"], "A", IG + "Transport & Connectivity", 15,
  "NCERT: the offshore terminal at Vadinar was developed to reduce pressure on Kandla port (Deendayal port).\nAnswer: (a)", theme="Vadinar terminal")

Q(102, "As per the India State of Forest Report 2021, which one of the following Himalayan states has the highest percentage of its geographical area under forest?",
  ["Arunachal Pradesh", "Himachal Pradesh", "Sikkim", "Uttarakhand"], "A", "Environment > Environmental Governance > Forestry & Forest Assessment", 20,
  "ISFR 2021: Arunachal Pradesh about 79% of its area, Sikkim about 47%, Uttarakhand about 45% and Himachal about 28%.\nAnswer: (a)", theme="Forest cover by state")

Q(103, """Which of the following statements with reference to L-Wave or Long Wave generated by an earthquake is/are correct?

1. They follow the Earth's circumference
2. They travel at more or less at a constant rate

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", PG + "Earth Interior & Geotectonics", 35,
  "L (surface) waves travel along the surface, following the earth's circumference, at a fairly uniform speed of about 3-4 km/s, slower than P and S waves.\nAnswer: (c)", pattern=S2, theme="Surface waves")
F(103, "Statement 2 depends on the textbook; DP accepts both")

Q(104, "Which one of the following is formed when volcanic ash is carried by running water and is deposited as a sedimentary layer?",
  ["Basalt", "Lapilli", "Slate", "Tuff"], "D", PG + "Rocks & Minerals", 30,
  "Tuff is rock formed from consolidated volcanic ash, including ash reworked and deposited by water in layers. Basalt is lava, lapilli are ejected fragments and slate is metamorphic.\nAnswer: (d)", theme="Tuff")

Q(105, """Condensation of water vapour into water is influenced by which of the following factor/factors?

1. Volume of air
2. Humidity
3. Temperature

Select the answer using the code given below:""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PG + "Climatology", 20,
  "NCERT: condensation is influenced by the volume of air, temperature, pressure and humidity.\nAnswer: (d)", pattern=S3, theme="Factors of condensation")

Q(106, "The lactic acid that gets accumulated in the muscle cells during rigorous exercise causing muscle cramps is produced from",
  ["ATP", "Pyruvate", "Ethanol", "Glucose"], "B", BI + "Biomolecules, Enzymes & Bioenergetics", 15,
  "Without enough oxygen, pyruvate from glycolysis is reduced to lactic acid in muscle.\nAnswer: (b)", theme="Lactic acid formation")

Q(107, "A chain of peptide containing linear sequences of amino acid linked by peptide bonds best represent the",
  ["Primary structure", "Secondary structure", "Tertiary structure", "Quaternary structure"], "A", BI + "Biomolecules, Enzymes & Bioenergetics", 15,
  "The linear sequence of amino acids is a protein's primary structure.\nAnswer: (a)", theme="Primary structure of proteins")

Q(108, "Cambium is an example of", ["Lateral meristem", "Apical meristem", "Intercalary meristem", "Permanent tissue"], "A", BI + "Plant Anatomy, Transport & Physiology", 10,
  "Vascular and cork cambium are lateral meristems that increase girth.\nAnswer: (a)", theme="Lateral meristem")

Q(109, "What happens when the fat and oil containing food materials are left outside for a long time?",
  ["Fats and oils in the food get oxidized", "Fats and oils in the food get reduced", "Fats and oils in the food get ice-covered", "No reaction takes place"], "A",
  CH + "Chemical Reactions, Stoichiometry & Energetics", 5,
  "Fats and oils get oxidised and turn rancid.\nAnswer: (a)", theme="Rancidity")

Q(110, "Which is the correct base pairing found in a normal DNA molecule?",
  ["Adenine pairs with Thymine", "Adenine pairs with Guanine", "Adenine pairs with Cytosine", "Thymine pairs with Guanine"], "A", BI + "Genetics, Molecular Biology & Inheritance", 5,
  "In DNA, A pairs with T and G with C.\nAnswer: (a)", theme="DNA base pairing")

Q(111, "Clotting of blood involves which one among the following clotting proteins?", ["Pathogen", "Fibrinogen", "Macrophage", "Phagocytes"], "B", BI + "Human Anatomy & Systemic Physiology", 5,
  "Fibrinogen is converted to fibrin, which forms the clot.\nAnswer: (b)", theme="Fibrinogen")

Q(112, "Initial discovery of antibiotic penicillin was done by", ["Francis Crick", "Maurice Wilkins", "Charles Darwin", "Alexander Fleming"], "D", BI + "Human Pathology, Immunology & Deficiency Diseases", 5,
  "Alexander Fleming discovered penicillin in 1928.\nAnswer: (d)", theme="Discovery of penicillin")

Q(113, "The vector of malaria parasites is", ["Male Anopheles mosquito", "Male Culex mosquito", "Female Anopheles mosquito", "Female Culex mosquito"], "C", BI + "Human Pathology, Immunology & Deficiency Diseases", 5,
  "Plasmodium is transmitted by the female Anopheles mosquito.\nAnswer: (c)", theme="Malaria vector")

Q(114, """Which of the following pairs is/are correctly matched?

1. Malaria : Mycobacterium
2. TB : Plasmodium

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "D", BI + "Human Pathology, Immunology & Deficiency Diseases", 10,
  "The pathogens are swapped: malaria is caused by Plasmodium and TB by Mycobacterium tuberculosis.\nAnswer: (d)", pattern=S2, theme="Disease pathogens")

Q(115, "Vitamin B1 is also known as", ["Riboflavin", "Thiamin", "Retinol", "Tocopherol"], "B", BI + "Human Pathology, Immunology & Deficiency Diseases", 5,
  "B1 is thiamine; riboflavin is B2, retinol A and tocopherol E.\nAnswer: (b)", theme="Vitamin B1")

Q(116, "Gaja Dwar, Ashwa Dwar, Garuda Dwar, Makar Dwar, Shardula Dwar and Hamsa Dwar are located in a building at",
  ["New Delhi", "Varanasi", "Aurangabad", "Thanjavur"], "A", "Current Affairs > Culture & Heritage > Art & Architecture", 25,
  "These are the six ceremonial gates of the new Parliament House in New Delhi (opened in 2023).\nAnswer: (a)", theme="Gates of the new Parliament")

Q(117, "Which dance form of India has been inscribed into UNESCO's Representative List of Intangible Cultural Heritage of Humanity?",
  ["Kathakali", "Garba", "Bhangra", "Odissi"], "B", "Current Affairs > Culture & Heritage > Performing Arts", 15,
  "Garba of Gujarat was inscribed in December 2023.\nAnswer: (b)", theme="Garba on the UNESCO list")

Q(118, 'Which Ministry has initiated the "Dhara", a special initiative dedicated to Indian Knowledge System (IKS)?',
  ["The Ministry of Education", "The Ministry of Home Affairs", "The Ministry of Information & Broadcasting", "The Ministry of Culture"], "D", "Current Affairs > Culture & Heritage > Heritage", 35,
  "'Dhara' is a series on Indian Knowledge Systems run by the Ministry of Culture (with IGNCA).\nAnswer: (d)", theme="Dhara initiative")
F(118, "Ministry of Education also runs an IKS division; DP picks Culture for 'Dhara'")

Q(119, "The scheme PRASHAD (Pilgrimage Rejuvenation & Spiritual Heritage Augmentation Drive) provides assistance for",
  ["e-Visa Facility", "Multilingual Tourist Infoline", "The development of tourism infrastructures in States & Union Territories", "Promoting Dekho Apna Desh scheme"], "C",
  "Current Affairs > Polity & Governance > Government Schemes & Policies", 15,
  "PRASHAD funds tourism infrastructure at pilgrimage and heritage sites in states and UTs.\nAnswer: (c)", theme="PRASHAD scheme")

Q(120, "The Joint Venture named 'ASHVINI' to develop nuclear power facility in India is between",
  ["NPCIL and NTPC", "TMC and VECC", "HWB and BARC", "IGACR and NTPC"], "A", "Current Affairs > Economy & Finance > Energy & Strategic Resources", 25,
  "Anushakti Vidhyut Nigam Ltd (ASHVINI) is a joint venture of NPCIL (51%) and NTPC (49%), set up to build the Mahi Banswara nuclear plant.\nAnswer: (a)", theme="ASHVINI joint venture")

Q(121, "Which one of the following statements about 'REJUPAVE' is correct?",
  ["It's a joint venture between Food and Agriculture Organisation (FAO) and Government of India to promote organic farming", "It's the name given to the lightest surveillance aircraft developed by DRDO",
   "It's a centrally sponsored flagship Programme of the Ministry of Women and Child Development, Government of India", "It's an indigenously developed road construction technology at high altitudes"], "D",
  "Current Affairs > Science & Technology > Physics & Applied Science", 30,
  "REJUPAVE, developed by CSIR-CRRI, is a bituminous road technology for low temperatures, used by BRO for high-altitude roads.\nAnswer: (d)", theme="REJUPAVE")

Q(122, """Which of the following statements about 'C-Bot' is/are correct?

1. It's an underwater vehicle to monitor coral reefs
2. It has been developed by CSIR and NIO

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Current Affairs > Science & Technology > Science Institutions & Programmes", 30,
  "C-Bot is an autonomous underwater robotic vehicle for monitoring coral reefs, developed by CSIR's National Institute of Oceanography.\nAnswer: (c)", pattern=S2, theme="C-Bot")

Q(123, "India's Gas Turbine Research Establishment (GTRE), part of the Defence Research and Development Organisation (DRDO) has developed an aero-engine which will potentially make India self-reliance in aero-engine technology. What is the name of the engine?",
  ["Ganga", "Yamuna", "Krishna", "Kaveri"], "D", "Current Affairs > Defence & Security > Defence Technology", 10,
  "GTRE's aero-engine programme is Kaveri.\nAnswer: (d)", theme="Kaveri engine")

Q(124, "Who among the following Presidents/Vice Presidents of the United States of America was awarded Nobel Peace Prize for work to find peaceful solutions to international conflicts, to advance democracy and human rights, and to promote economic and social development?",
  ["Jimmy Carter", "Woodrow Wilson", "Barack Obama", "Al Gore"], "A", "Current Affairs > Awards, Appointments & Personalities > International Awards", 20,
  "This is the citation of Jimmy Carter's 2002 Nobel Peace Prize (he died in December 2024).\nAnswer: (a)", theme="Jimmy Carter Nobel citation")

Q(125, "Which among the following agencies releases report on 'S.A.F.E. Accommodation: Worker Housing for Manufacturing Growth'?",
  ["RBI", "NITI Aayog", "National Housing Bank", "Housing and Urban Development Corporation"], "B", "Current Affairs > Polity & Governance > Reports & Governance Indicators", 30,
  "NITI Aayog released the S.A.F.E. (Secure, Accessible, Flexible, Efficient) Accommodation report on worker housing in January 2025.\nAnswer: (b)", theme="SAFE Accommodation report")

Q(126, "An object is placed between infinity and the pole (P) of a convex mirror. The position of the image is",
  ["between pole (P) and the focus (F), behind the mirror", "between the focus (F) and infinity, behind the mirror", "between the pole (P) and the infinity, in front of the mirror", "at the focus (F), behind the mirror"], "A",
  PH + "Geometrical & Physical Optics", 15,
  "A convex mirror always forms a virtual, erect, diminished image between P and F behind the mirror.\nAnswer: (a)", theme="Image in a convex mirror")

Q(127, "The work done in moving a charge of 2 coulomb (C) from point A to point B is 24 J. What is the potential difference between A and B?",
  ["48 V", "6 V", "12 V", "0.08 V"], "C", PH + "Electricity & Electric Circuits", 5,
  "$V=W/q=24/2=12$ V.\nAnswer: (c)", theme="Potential difference")

Q(128, "Two conducting wires of the same material and of equal lengths and equal diameters are first connected in parallel and then in series in a circuit across the same potential difference. The ratio of heat produced in parallel and series combinations is",
  ["2 : 1", "4 : 1", "1 : 2", "1 : 4"], "B", PH + "Electricity & Electric Circuits", 25,
  "Parallel: $R/2$; series: $2R$. With the same voltage, heat $\\propto 1/R$, so the ratio is $\\dfrac{2/R}{1/(2R)}=4:1$.\nAnswer: (b)", theme="Heating in series and parallel")

Q(129, "The magnetic field inside a long straight solenoid-carrying current",
  ["is zero", "decreases as we move towards its end", "increases as we move towards its end", "is uniform inside the solenoid"], "D", PH + "Magnetism & Electromagnetism", 10,
  "The field inside a long solenoid is uniform.\nAnswer: (d)", theme="Field in a solenoid")

Q(130, "A car has an initial velocity of 12 m/s and is brought to rest over a distance of 45 m. The acceleration of the car is",
  ["+1.6 m/s$^{2}$", "+3.2 m/s$^{2}$", "$-1.6$ m/s$^{2}$", "$-0.8$ m/s$^{2}$"], "C", PH + "Classical Mechanics, Motion & Gravitation", 10,
  "$v^2=u^2+2as$: $0=144+90a$, so $a=-1.6$ m/s$^2$.\nAnswer: (c)", theme="Deceleration from stopping distance")

Q(131, "The universal constant of gravitation G has the unit", ["N", "m/s", "Joule", "N-m$^{2}$/kg$^{2}$"], "D", PH + "Units, Dimensions & Measurement", 5,
  "From $F=Gm_1m_2/r^2$, G has units N m$^2$ kg$^{-2}$.\nAnswer: (d)", theme="Units of G")

Q(132, "Two bodies of unequal masses are dropped from a tower. At any instant, they have equal",
  ["Momentum", "Acceleration", "Potential energy", "Kinetic energy"], "B", PH + "Classical Mechanics, Motion & Gravitation", 5,
  "Ignoring air resistance, both fall with acceleration g.\nAnswer: (b)", theme="Free fall")

Q(133, "The frequency ($f$), wavelength ($\\lambda$) and speed ($v$) of a sound wave are related as",
  ["$f=v\\lambda$", "$\\lambda=vf$", "$f=\\lambda/v$", "$v=\\lambda f$"], "D", PH + "Waves, Acoustics & Electromagnetic Spectrum", 5,
  "Wave speed equals wavelength times frequency.\nAnswer: (d)", theme="Wave equation")

Q(134, "The length of a simple pendulum is increased four times to its previous value while the mass is doubled. What is the ratio of the new and previous time period of the pendulum?",
  ["3 : 1", "2 : 5", "2 : 1", "3 : 2"], "C", PH + "Classical Mechanics, Motion & Gravitation", 10,
  "$T=2\\pi\\sqrt{L/g}$ does not depend on mass; quadrupling $L$ doubles $T$.\nAnswer: (c)", theme="Pendulum period")

Q(135, "Which one of the following is NOT a basic property of electric charge?",
  ["Charges can be added", "Charge is conserved", "Charge on a body is always an integral multiple of an electron or a proton charge", "Charges can be created and destroyed in an isolated system"], "D",
  PH + "Electricity & Electric Circuits", 10,
  "Charge is conserved: in an isolated system it is neither created nor destroyed (net).\nAnswer: (d)", theme="Properties of charge")

Q(136, "What happens when the sunlight travels through the Earth's atmosphere?",
  ["The blue colour is scattered more compared to the red colour", "The red colour is scattered more compared to the blue colour", "Both the blue and the red colours are scattered equally", "The blue colour is not scattered but the red colour is scattered the most"], "A",
  PH + "Geometrical & Physical Optics", 5,
  "Rayleigh scattering varies as $1/\\lambda^4$, so blue light scatters much more than red.\nAnswer: (a)", theme="Scattering of sunlight")

Q(137, """When a solid body is partially or completely immersed in a fluid, the fluid exerts an upward force on the body. The magnitude of the force is equal to

1. the mass of the body
2. the weight of the displaced fluid by the body

Which of the above is/are correct?""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "B", PH + "Fluid Mechanics & Properties of Fluids", 10,
  "Archimedes' principle: the buoyant force equals the weight of fluid displaced.\nAnswer: (b)", pattern=S2, theme="Archimedes' principle")

Q(138, "If the length of a copper wire is increased by twice, then its resistivity will be", ["Doubled", "Halved", "Same", "One-fourth"], "C", PH + "Electricity & Electric Circuits", 10,
  "Resistivity is a property of the material; only resistance changes with length.\nAnswer: (c)", theme="Resistivity")

Q(139, "Which one of the following is dimensionless quantity?", ["Stress", "Strain", "Pressure", "Force"], "B", PH + "Units, Dimensions & Measurement", 5,
  "Strain is change in length divided by original length, a pure ratio.\nAnswer: (b)", theme="Dimensionless strain")

Q(140, "A system that does NOT allow exchange of heat with its surrounding is called",
  ["Adiabatic system", "Non-adiabatic system", "Equilibrium system", "Non-equilibrium system"], "A", PH + "Thermodynamics, Heat & Kinetic Theory", 5,
  "An adiabatic system exchanges no heat with its surroundings.\nAnswer: (a)", theme="Adiabatic system")

Q(141, "If the speed of light in carbon disulfide and vacuum is $X$ and $Y$ respectively, then", ["$X<Y$", "$X>Y$", "$X\\geq Y$", "$X=Y$"], "A", PH + "Geometrical & Physical Optics", 5,
  "Light is slowest in a dense medium; its speed in vacuum is the maximum.\nAnswer: (a)", theme="Speed of light in a medium")

Q(142, "A current through a horizontal power line flows in east to west direction. What will be the direction of magnetic field at a point directly below it when viewed from east end?",
  ["Clockwise in a plane perpendicular to the wire", "Anti-clockwise in a plane perpendicular to the wire", "Clockwise in a plane of parallel to the wire", "Anti-clockwise in a plane of parallel to the wire"], "A",
  PH + "Magnetism & Electromagnetism", 40,
  "Viewed from the east end, the current flows away from the observer. By the right-hand thumb rule the field lines are clockwise circles in a plane perpendicular to the wire (at a point directly below, the field points north to south).\nAnswer: (a)", theme="Field around a straight current")

Q(143, "Which one among the following elements is known to be discovered the earliest?", ["Copper", "Gold", "Oxygen", "Uranium"], "A", CH + "Metals, Non-Metals & Metallurgy", 30,
  "Copper is usually listed as the earliest metal used by humans (about 9000 BCE), ahead of gold. Oxygen (1770s) and uranium (1789) came much later.\nAnswer: (a)", theme="Earliest known element")
F(143, "Copper vs gold both prehistoric; DP follows common key (copper)")

Q(144, "When a light ray passes through from air to water with a non-zero angle the ray will be",
  ["bending towards the normal", "bending away from the normal", "propagating in straight line", "reflected towards the opposite direction"], "A", PH + "Geometrical & Physical Optics", 5,
  "Going into the optically denser water, light bends towards the normal.\nAnswer: (a)", theme="Refraction into water")

Q(145, "Which one of the following equations related to the motion of an object is NOT correct? (Symbols carry their usual meanings)",
  ["$s=ut+\\frac12at^{2}$", "$u=v-at$", "$u^{2}-v^{2}=2as$", "Distance travelled during $n^{th}$ second $=u+\\frac12a(2n-1)$"], "C", PH + "Classical Mechanics, Motion & Gravitation", 10,
  "The correct form is $v^2-u^2=2as$.\nAnswer: (c)", theme="Equations of motion")

Q(146, "Which one of the following statements is NOT correct?",
  ["An ammeter is always connected in series in the circuit to measure the current", "A Voltmeter is always connected to parallel in a circuit to measure the voltage",
   "A voltmeter has a high resistance and an ammeter has a low resistance", "A voltmeter has a low resistance and an ammeter has a high resistance"], "D", PH + "Electricity & Electric Circuits", 5,
  "A voltmeter has high resistance and an ammeter low resistance; (d) reverses them.\nAnswer: (d)", theme="Ammeter and voltmeter")

Q(147, "Which one of the following is a non-conventional source of energy?", ["Petroleum", "Natural Gas", "Tidal energy", "Coal"], "C", PH + "Energy & Power Technologies", 5,
  "Tidal energy is a non-conventional, renewable source.\nAnswer: (c)", theme="Non-conventional energy")

Q(148, "If three resistors of 1 Ohm each connect in parallel to each other the resultant resistance is", ["1 Ohm", "1/3 Ohm", "3 Ohm", "9 Ohm"], "B", PH + "Electricity & Electric Circuits", 5,
  "$1/R=1+1+1$, so $R=1/3$ Ω.\nAnswer: (b)", theme="Parallel resistors")

Q(149, "We hear an echo due to", ["Refraction of sound waves", "Reflection of sound waves", "Diffraction of sound waves", "Resonance due to sound waves"], "B", PH + "Waves, Acoustics & Electromagnetic Spectrum", 5,
  "An echo is reflected sound.\nAnswer: (b)", theme="Echo")

Q(150, "At uniform speed the acceleration is", ["Maximum", "Minimum", "Zero", "Constant"], "C", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "For motion in a straight line at uniform speed (uniform velocity), acceleration is zero. (In uniform circular motion it would be non-zero, so the item assumes straight-line motion.)\nAnswer: (c)", theme="Acceleration at uniform speed")
F(150, "Uniform circular motion has non-zero acceleration; DP takes straight-line motion")
