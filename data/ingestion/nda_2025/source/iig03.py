from qfmt import Q, P, F, W

# NDA II 2025 GAT, Set A, Part B, Q102-150 (booklet pages 31-49)
CH = "Science & Technology > Chemistry > "
PG = "Geography > Physical Geography > "
IG = "Geography > Indian Geography > "
BI = "Science & Technology > Biology/Life Sciences > "
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"
S4 = "4-Statement Combination"
MT = "Match the Following"

Q(102, "Which one of the following is NOT a heterogeneous mixture?",
  ["Sulphur in carbon disulphide", "Mixture of sugar and salt crystals", "Sandy water", "Sulphur in water"], "A", CH + "Chemical Composition & Classification", 25,
  "Sulphur dissolves completely in carbon disulphide and forms a uniform solution, a homogeneous mixture. Sugar and salt crystals, sand in water and sulphur in water all have visibly separate components.\nAnswer: (a)", theme="Homogeneous and heterogeneous mixtures")

Q(103, """Match List I with List II and select the answer using the code given below the Lists:

| List I (Element) | List II (Atomicity) |
|---|---|
| A. Phosphorus | 1. 2 |
| B. Nitrogen | 2. 1 |
| C. Neon | 3. 8 |
| D. Sulphur | 4. 4 |

Code:""",
  ["A-4, B-1, C-2, D-3", "A-4, B-2, C-1, D-3", "A-3, B-2, C-1, D-4", "A-3, B-1, C-2, D-4"], "A", CH + "Chemical Composition & Classification", 15,
  "Phosphorus exists as P$_4$, nitrogen as N$_2$, neon as single atoms and sulphur as S$_8$.\nAnswer: (a)", pattern=MT, theme="Atomicity of elements")

Q(104, r"""In the following redox reaction, which compound is acting as a reducing agent?

$\mathrm{N_2H_4+2H_2O_2\to N_2+4H_2O}$""",
  [r"$\mathrm{H_2O_2}$", r"$\mathrm{N_2H_4}$", r"$\mathrm{N_2}$", r"$\mathrm{H_2O}$"], "B", CH + "Chemical Reactions, Stoichiometry & Energetics", 25,
  "Nitrogen goes from $-2$ in hydrazine to 0 in N$_2$, so hydrazine is oxidised and is the reducing agent. H$_2$O$_2$ is reduced (oxygen goes from $-1$ to $-2$).\nAnswer: (b)", theme="Identifying the reducing agent")

Q(105, "Which one of the following is considered to be the purest source of water?",
  ["River water", "Sea water", "Well water", "Rain water"], "D", CH + "Chemical Composition & Classification", 10,
  "Rain water forms by natural distillation (evaporation and condensation), so it is the purest natural water, though it can dissolve some gases.\nAnswer: (d)", theme="Purest natural water")

Q(106, "Which one of the following salts is responsible for temporary hardness of water?",
  ["Sulphates of calcium", "Chlorides of magnesium", "Bicarbonates of magnesium", "Sulphates of magnesium"], "C", CH + "Industrial, Materials & Applied Chemistry", 10,
  "Temporary hardness is caused by bicarbonates of calcium and magnesium and is removed by boiling. Chlorides and sulphates cause permanent hardness.\nAnswer: (c)", theme="Temporary hardness of water")

Q(107, r"""Match List I with List II and select the answer using the code given below the Lists:

| List I (Reaction) | List II (Type) |
|---|---|
| A. $\mathrm{CaO(s)+H_2O(l)\to Ca(OH)_2(aq)}$ | 1. Single displacement |
| B. $\mathrm{CaCO_3(s)\to CaO(s)+CO_2(g)}$ | 2. Double displacement |
| C. $\mathrm{Pb(s)+CuCl_2(aq)\to PbCl_2(aq)+Cu(s)}$ | 3. Combination |
| D. $\mathrm{Na_2SO_4(aq)+BaCl_2(aq)\to BaSO_4(s)+2NaCl(aq)}$ | 4. Decomposition |

Code:""",
  ["A-2, B-1, C-4, D-3", "A-2, B-4, C-1, D-3", "A-3, B-4, C-1, D-2", "A-3, B-1, C-4, D-2"], "C", CH + "Chemical Reactions, Stoichiometry & Energetics", 15,
  "A joins two substances (combination); B splits one (decomposition); in C lead displaces copper (single displacement); in D ions are exchanged (double displacement).\nAnswer: (c)", pattern=MT, theme="Types of chemical reactions")

Q(108, r"""Which one of the following is an endothermic reaction?""",
  [r"$\mathrm{CH_4(g)+2O_2(g)\to CO_2(g)+2O_2(g)}$", r"$\mathrm{C_6H_{12}O_6(aq)+6O_2(g)\to 6CO_2(g)+6H_2O(l)}$",
   r"$\mathrm{N_2(g)+3H_2(g)\to 2NH_3(g)}$", r"$\mathrm{2Pb(NO_3)_2(s)\to 2PbO(s)+4NO_2(g)+O_2(g)}$"], "D", CH + "Chemical Reactions, Stoichiometry & Energetics", 25,
  "Combustion of methane, respiration of glucose and ammonia synthesis all release heat. Thermal decomposition of lead nitrate needs continuous heating, so it is endothermic.\nAnswer: (d)", theme="Endothermic decomposition")

Q(109, "Which one of the following is known as 'water gas'?",
  [r"$\mathrm{H_2O+CO_2}$", r"$\mathrm{NH_3}$", r"$\mathrm{H_2+N_2}$", r"$\mathrm{CO+H_2}$"], "D", CH + "Industrial, Materials & Applied Chemistry", 10,
  "Water gas (syngas) is the mixture of carbon monoxide and hydrogen made by passing steam over red-hot coke.\nAnswer: (d)", theme="Water gas")

Q(110, "Which one of the following statements is NOT correct?",
  ["Diamond is hard due to extended covalent bonding in it", "Fullerene is composed of five and six membered rings", "Diamond is a good conductor of electricity", "Graphite is used as a lubricant"], "C",
  CH + "Chemical Bonding & Molecular Structure", 10,
  "In diamond every carbon uses all four electrons in bonds, leaving no free electrons, so diamond is a poor conductor of electricity (graphite conducts).\nAnswer: (c)", theme="Allotropes of carbon")

Q(111, """Arrange the following zones in ascending order in terms of their latitudinal extent on the Earth surface:

1. Equatorial zone
2. Midlatitude zone
3. Subarctic zone
4. Tropical zone

Select the answer using the code given below:""",
  ["1 - 3 - 2 - 4", "1 - 3 - 4 - 2", "1 - 4 - 2 - 3", "3 - 1 - 2 - 4"], "B", PG + "Earth Motions & Geographical Coordinates", 50,
  "Using the standard latitude zones (per hemisphere): equatorial about 0-10° (10°), subarctic about 55/60-65/70° (about 10°), tropical about 10-25° (15°) and mid-latitude about 35-55° (20°). In ascending order of extent: equatorial, subarctic, tropical, mid-latitude.\nAnswer: (b)", pattern="Ordering/Sequence", theme="Latitudinal extent of zones")
F(111, "Zone boundaries vary by textbook; DP order 1-3-4-2")

Q(112, """Consider the following statements with reference to Feldspar mineral:

1. Half of the earth's crust is composed of feldspar
2. It has light cream to salmon pink colour
3. Magnesium is a common element in all types of feldspar

Which of the statements given above is/are correct?""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "B", PG + "Rocks & Minerals", 30,
  "Feldspar makes up about half of the crust and is light cream to salmon pink. Silicon and oxygen are its common elements, with sodium, potassium, calcium and aluminium; magnesium is not common to all feldspars.\nAnswer: (b)", pattern=S3, theme="Feldspar")

Q(113, """Consider the following pairs with reference to sedimentary rocks and the process of their formation:

| Sedimentary Rock | Process of Formation |
|---|---|
| 1. Chert | Chemically formed |
| 2. Geyserite | Organically formed |
| 3. Shale | Mechanically formed |

Which of the pairs given above is/are correctly matched?""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PG + "Rocks & Minerals", 35,
  "NCERT classifies chert as chemically formed, geyserite as organically formed and shale as mechanically formed. All three pairs are correct.\nAnswer: (d)", pattern=S3, theme="Sedimentary rock formation")

Q(114, """Which of the following statements is/are correct?

1. Oceanic trenches are very significant in the study of plate movements
2. Oceanic trenches are associated with active volcanoes and strong earthquakes

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", PG + "Earth Interior & Geotectonics", 20,
  "Trenches mark subduction zones, so they are key evidence for plate movement, and they are associated with active volcanoes and strong earthquakes.\nAnswer: (c)", pattern=S2, theme="Oceanic trenches")

Q(115, """Which of the following statements with reference to shadow zones in an event of an earthquake is/are correct?

1. Zone between 105° and 145° from epicentre was identified as the shadow zone for both P-waves and S-waves
2. The shadow zone of P-waves is much larger than that of the S-waves

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", PG + "Earth Interior & Geotectonics", 35,
  "NCERT states that the zone between 105° and 145° from the epicentre is the shadow zone for both types of waves. The S-wave shadow zone (everything beyond 105°) is much larger than the P-wave shadow zone, so statement 2 is reversed.\nAnswer: (a)", pattern=S2, theme="Seismic shadow zones")

Q(116, "Which one among the following volcanic island chains is NOT associated with mid-oceanic ridge?",
  ["Azores Islands", "Ascension Islands", "Hawaiian Islands", "Tristan da Cunha"], "C", PG + "Earth Interior & Geotectonics", 25,
  "The Azores, Ascension and Tristan da Cunha lie on or near the Mid-Atlantic Ridge. The Hawaiian Islands were formed by a hotspot in the middle of the Pacific Plate.\nAnswer: (c)", theme="Hotspot versus ridge islands")

Q(117, """Consider the following statements with reference to sea waves:

1. The height of waves is determined by wind speed, wind duration, and fetch
2. The energy of a wave is proportional to the square of its height
3. Waves retain most of their energy as they travel across the deep ocean

Which of the statements given above is/are correct?""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PG + "Oceanography", 35,
  "Wave height depends on wind speed, duration and fetch; wave energy varies as the square of height; in deep water waves lose little energy until they reach shallow coasts.\nAnswer: (d)", pattern=S3, theme="Ocean waves")

Q(118, """Which of the following statements with reference to soil forming processes is/are correct?

1. Translocation, enrichment, removal and transformation are different classes of soil forming processes
2. In translocation, fine particles are transported downward by eluviation and accumulate in lower horizons by illuviation

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", PG + "Soil Geography", 35,
  "Soil-forming processes are grouped as additions (enrichment), removals, translocations and transformations. In translocation, eluviation washes fine material down and illuviation deposits it in lower horizons.\nAnswer: (c)", pattern=S2, theme="Soil forming processes")

Q(119, """Consider the following statements with reference to structure of the Earth's atmosphere:

1. Thickness of the troposphere is greatest at the equator
2. The air temperature of the tropopause is highest above the poles
3. The temperature in troposphere decreases at the rate of 1°F for every 165 m of height

Which of the statements given above is/are correct?""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "B", PG + "Climatology", 40,
  "The troposphere is about 18 km thick at the equator and 8 km at the poles. The tropopause is about $-80$°C over the equator and about $-45$°C over the poles, so it is warmest over the poles. The lapse rate is 1°C (not 1°F) per 165 m.\nAnswer: (b)", pattern=S3, theme="Troposphere and tropopause")

Q(120, """Which of the following are the factors that cause variation in the amount of insolation on the Earth?

1. Rotation of the earth on its axis
2. Length of the day
3. Distribution of land and water on the earth

Select the answer using the code given below:""",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "B", PG + "Climatology", 35,
  "NCERT lists rotation of the earth on its axis, angle of the sun's rays, length of day, transparency of the atmosphere and the aspect of land. Land-water distribution affects how heat is absorbed and temperature, not the insolation received.\nAnswer: (b)", pattern=S3, theme="Factors affecting insolation")

Q(121, """Consider the following conditions favourable for the formation and intensification of Tropical Storms:

1. Presence of the Coriolis force
2. Upper divergence above the sea level system
3. High variations in the vertical wind speed

Which of the conditions given above is/are correct?""",
  ["1 only", "2 only", "1 and 2", "2 and 3"], "C", "Geography > Physical Geography > Atmospheric Circulation", 25,
  "Tropical cyclones need warm seas, the Coriolis force, small variation in vertical wind speed (low wind shear), a pre-existing low and upper-level divergence. High vertical wind shear prevents them.\nAnswer: (c)", pattern=S3, theme="Conditions for tropical cyclones")

Q(122, """Which of the following factors influence the ocean currents?

1. Coriolis force
2. Gravity
3. Heating by solar energy
4. Wind

Select the answer using the code given below:""",
  ["1 and 4 only", "2 and 3 only", "1, 2 and 3 only", "1, 2, 3 and 4"], "D", PG + "Oceanography", 20,
  "Ocean currents are driven by solar heating, wind and gravity, and deflected by the Coriolis force. All four are factors.\nAnswer: (d)", pattern=S4, theme="Forces on ocean currents")

Q(123, """Which of the following is/are warm ocean current(s)?

1. Alaska Current
2. Agulhas Current
3. Falkland Current
4. West Australian Current

Select the answer using the code given below:""",
  ["1 only", "1 and 2", "3 and 4", "4 only"], "B", PG + "Oceanography", 25,
  "The Alaska and Agulhas currents are warm; the Falkland and West Australian currents are cold.\nAnswer: (b)", pattern=S4, theme="Warm and cold currents")

Q(124, "State of Assam shares borders with how many other countries and Indian states respectively?",
  ["2 countries and 6 Indian states respectively", "2 countries and 7 Indian states respectively", "3 countries and 7 Indian states respectively", "3 countries and 6 Indian states respectively"], "B",
  IG + "Political Geography of India", 30,
  "Assam borders Bhutan and Bangladesh, and the states of Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, Meghalaya and West Bengal.\nAnswer: (b)", theme="Borders of Assam")

Q(125, "Which one of the following is the northernmost river basin of the Deccan Plateau?",
  ["Chambal", "Mahi", "Narmada", "Tapti"], "C", IG + "Indian Drainage", 40,
  "The Chambal belongs to the Ganga system on the Malwa side and the Mahi drains the Malwa-Gujarat region. Among peninsular rivers draining the Deccan, the Narmada (in the rift valley at its northern edge) is the northernmost.\nAnswer: (c)", theme="Northernmost Deccan river")
F(125, "Narmada vs Tapti depends on whether the Narmada rift is counted in the Deccan; DP picks Narmada")

Q(126, """Laterite soil in India is rich in which of the following?

1. Calcium
2. Nitrogen
3. Phosphate
4. Potash

Select the answer using the code given below:""",
  ["1 only", "1 and 2", "3 and 4", "4 only"], "D", IG + "Indian Soils", 30,
  "NCERT: laterite soils are poor in organic matter, nitrogen, phosphate and calcium, while iron oxide and potash are in excess.\nAnswer: (d)", pattern=S4, theme="Laterite soil")

Q(127, """Which of the following statements with reference to crops cultivated in India is/are correct?

1. Bajra grows well in sandy and shallow black soils, whereas red and shallow black soil is suited for Ragi
2. Bajra is predominantly grown in states like Rajasthan, Uttar Pradesh and Maharashtra, while Ragi is mainly cultivated in Karnataka, Tamil Nadu and Himachal Pradesh

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", IG + "Agriculture & Crops", 25,
  "Both match NCERT: bajra on sandy and shallow black soils in Rajasthan, UP, Maharashtra and Gujarat; ragi on red, black and shallow black soils in Karnataka, Tamil Nadu, Himachal Pradesh and others.\nAnswer: (c)", pattern=S2, theme="Bajra and ragi")

Q(128, """Match List I with List II and select the answer using the code given below the Lists:

| List I (City) | List II (Mineral) |
|---|---|
| A. Bewar | 1. Manganese |
| B. Balaghat | 2. Mica |
| C. Bilaspur | 3. Iron-ore |
| D. Ballary | 4. Bauxite |

Code:""",
  ["A-3, B-1, C-4, D-2", "A-3, B-4, C-1, D-2", "A-2, B-1, C-4, D-3", "A-2, B-4, C-1, D-3"], "C", IG + "Resources & Minerals", 35,
  "Beawar (Rajasthan) is a mica area; Balaghat (MP) is known for manganese; Bilaspur (Chhattisgarh) region for bauxite; Ballari (Karnataka) for iron ore.\nAnswer: (c)", pattern=MT, theme="Mineral-producing centres")

Q(129, "Which one among the following is NOT a beneficiary state from the Vindhyachal Power Plant of the NTPC?",
  ["Gujarat", "Goa", "Maharashtra", "Uttar Pradesh"], "D", "Geography > Economic Geography > Industrial Geography", 40,
  "Vindhyachal (Singrauli, MP) supplies the Western Region: Madhya Pradesh, Chhattisgarh, Gujarat, Maharashtra, Goa and the western UTs. Uttar Pradesh is in the Northern Region.\nAnswer: (d)", theme="Vindhyachal power station")

Q(130, """Consider the following pairs with reference to Thermal Power Plants and their location in respective states in India:

| Thermal Power Plant | Located in State |
|---|---|
| I. Panki | Uttar Pradesh |
| II. Parli | Karnataka |
| III. Vijayawada | Telangana |
| IV. Vanakbari | Gujarat |

How many of the pairs given above is/are correctly matched?""",
  ["1", "2", "3", "4"], "B", "Geography > Economic Geography > Industrial Geography", 30,
  "Panki is in Kanpur (UP) and Vanakbori is in Gujarat. Parli is in Maharashtra and Vijayawada in Andhra Pradesh.\nAnswer: (b)", pattern="Statement Count", theme="Thermal power stations")

Q(131, "The book 'The Origin of Species by Means of Natural Selection' was authored by",
  ["Charles Darwin", "Carolus Linnaeus", "Barbara McClintock", "Copernicus"], "A", BI + "Evolutionary Biology & Population Genetics", 5,
  "Charles Darwin published On the Origin of Species in 1859.\nAnswer: (a)", theme="Origin of Species")

Q(132, "The headquarters of World Meteorological Organization (WMO) is located at",
  ["Switzerland", "Scotland", "South Africa", "Italy"], "A", "International Relations > International Organisations > UN System & Multilateral Institutions", 10,
  "The WMO, a UN specialised agency, is headquartered in Geneva, Switzerland.\nAnswer: (a)", theme="WMO headquarters")

Q(133, "The optimum pH at which the enzymes pepsin and trypsin of the human alimentary canal works are",
  ["pH 2.0 and 7.9, respectively", "pH 4.5 and 3.5, respectively", "pH 9.5 and 4.5, respectively", "pH 7.0 and 8.0, respectively"], "A", BI + "Biomolecules, Enzymes & Bioenergetics", 25,
  "Pepsin works in the acidic stomach (about pH 2); trypsin works in the alkaline small intestine (about pH 7.8-8).\nAnswer: (a)", theme="Optimum pH of digestive enzymes")

Q(134, "The amount of air breathed in and out during a normal respiration by human lungs is referred to as",
  ["Vital capacity", "Tidal volume", "Inspiratory volume", "Total lung capacity"], "B", BI + "Human Anatomy & Systemic Physiology", 10,
  "Tidal volume (about 500 mL) is the air inspired or expired in a normal breath.\nAnswer: (b)", theme="Tidal volume")

Q(135, "Which one among the following statements about arteries and veins in humans is NOT correct?",
  ["Arteries carry blood away from heart while veins bring blood towards the heart", "Pulmonary arteries always carry oxygenated blood while Pulmonary veins always carry deoxygenated blood",
   "Arteries have thicker and more elastic walls compared to veins in general", "Arteries do not have valves but veins do have valves"], "B", BI + "Human Anatomy & Systemic Physiology", 15,
  "It is the reverse: the pulmonary artery carries deoxygenated blood to the lungs and the pulmonary veins carry oxygenated blood to the heart.\nAnswer: (b)", theme="Pulmonary vessels")

Q(136, "Identify the functions that are controlled by the hind brain of human being",
  ["Involuntary actions such as blood pressure, salivation vomiting etc.", "Controlling the regions receiving sensory impulses from receptors", "Controlling the movement of voluntary muscles", "Sensation of hunger or being full"], "A",
  BI + "Human Anatomy & Systemic Physiology", 25,
  "The medulla in the hind brain controls involuntary actions such as blood pressure, salivation and vomiting. Sensory areas and voluntary movement belong to the forebrain (cerebrum), and hunger to the hypothalamus.\nAnswer: (a)", theme="Functions of the hind brain")

Q(137, "Iodized salt is a vital part of our diet as it is essential for the synthesis of",
  ["Estrogen", "Thyroxin", "Insulin", "Adrenalin"], "B", BI + "Human Anatomy & Systemic Physiology", 5,
  "The thyroid gland needs iodine to make thyroxine; deficiency causes goitre.\nAnswer: (b)", theme="Iodine and thyroxine")

Q(138, "The menstrual cycle in females is controlled by hormones that are secreted by",
  ["Ovary and lacrimal gland", "Ovary and sebaceous gland", "Ovary and pituitary gland", "Prostate and pituitary gland"], "C", BI + "Human Anatomy & Systemic Physiology", 15,
  "Pituitary hormones (FSH, LH) and ovarian hormones (estrogen, progesterone) regulate the menstrual cycle.\nAnswer: (c)", theme="Hormonal control of the menstrual cycle")

Q(139, "Which one of the following blood cells type secrete large number of antibodies during an immune response of the body?",
  ["Neutrophils", "Eosinophils", "Lymphocytes", "Monocytes"], "C", BI + "Human Pathology, Immunology & Deficiency Diseases", 15,
  "B-lymphocytes (as plasma cells) produce antibodies.\nAnswer: (c)", theme="Antibody-producing cells")

Q(140, "Which of the following organelles have their own DNA and ribosomes?",
  ["Endoplasmic reticulum and Golgi bodies", "Mitochondria and Chloroplast", "Endoplasmic reticulum and cytoskeleton", "Cell wall and nucleolus"], "B", BI + "Cytology & Cell Architecture", 10,
  "Mitochondria and chloroplasts are semi-autonomous: they contain their own DNA and 70S ribosomes.\nAnswer: (b)", theme="Semi-autonomous organelles")

Q(141, "What is the nickname of the National Men's Hockey Team of Australia?",
  ["The Kangaroos", "The Boomers", "The Dolphins", "The Kookaburras"], "D", "Current Affairs > Sports > Other Sports", 30,
  "Australia's men's hockey team is the Kookaburras. The Kangaroos are the rugby league team and the Boomers the men's basketball team.\nAnswer: (d)", theme="Australian team nicknames")

Q(142, "Which one of the following organisations has completed 150 years of service to the nation in the year 2025?",
  ["Botanical Survey of India", "Survey of India", "India Meteorological Department", "Press Trust of India"], "C", "Current Affairs > Science & Technology > Science Institutions & Programmes", 25,
  "The India Meteorological Department was set up in 1875 and celebrated its 150th foundation year on 15 January 2025.\nAnswer: (c)", theme="IMD at 150")

Q(143, """Which of the following statements about 'Jalvahak' is/are correct?

1. It is a newly commissioned naval ship inducted into Indian Navy
2. It is a major policy for cargo promotion unveiled by the Government of India

Select the answer using the code given below:""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "B", "Current Affairs > Economy & Finance > Infrastructure & Connectivity", 35,
  "Jalvahak is the cargo promotion scheme launched in December 2024 to encourage cargo movement on National Waterways 1, 2 and 16. It is not a naval ship.\nAnswer: (b)", pattern=S2, theme="Jalvahak scheme")

Q(144, "How many rural districts does Mahatma Gandhi National Rural Employment Guarantee Act cover as on 2024-25?",
  ["600", "740", "700", "680"], "B", "Current Affairs > Polity & Governance > Government Schemes & Policies", 35,
  "Ministry of Rural Development replies in Parliament in 2024-25 state that MGNREGS operates in 740 districts.\nAnswer: (b)", theme="MGNREGA coverage")

Q(145, "Under which one of the following initiatives does the NITI Aayog support interested States to establish a State Institution for Transformation (SIT)?",
  ["NITI for States Platform", "Bharat Ke Badhte Kadam", "State Support Mission", "Aspirational Block Programme"], "C", "Current Affairs > Polity & Governance > Government Schemes & Policies", 35,
  "Under its State Support Mission, NITI Aayog helps states set up State Institutions for Transformation to strengthen planning and policy capacity.\nAnswer: (c)", theme="State Support Mission")

Q(146, "Which one of the following Indian States account for the maximum deposits of Bauxite and Chromite?",
  ["Andhra Pradesh", "Madhya Pradesh", "Jharkhand", "Odisha"], "D", IG + "Resources & Minerals", 20,
  "Odisha has the largest reserves of both bauxite and chromite (Sukinda valley) in India.\nAnswer: (d)", theme="Bauxite and chromite reserves")

Q(147, """Consider the following statements with regard to National Technology Day:

1. It commemorates the momentous events of 11th May 1998, when India conducted successful nuclear tests under Operation Shakti
2. The official theme for National Technology Day 2025 is 'School to Startups - Igniting Young Minds to Innovate'

Which of the statements given above is/are correct?""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", "Current Affairs > Polity & Governance > Important Days & Government Themes", 35,
  "11 May marks the Pokhran-II tests (Operation Shakti) of 1998. The 2025 theme was 'YANTRA - Yugantar for Advancing New Technology, Research & Acceleration'; 'School to Startups' was the 2024 theme.\nAnswer: (a)", pattern=S2, theme="National Technology Day")

Q(148, """Which of the following were added in India as Ramsar Site in the year 2025?

1. Sakkarakottai Bird Sanctuary
2. Udhwa Lake
3. Rudrasagar Lake
4. Bakhira Wildlife Sanctuary

Select the answer using the code given below:""",
  ["1 and 4", "2 and 3 only", "1 and 2 only", "1, 2 and 3"], "C", "Current Affairs > Environment & Ecology > Biodiversity & Wildlife", 35,
  "On World Wetlands Day 2025, Sakkarakottai and Therthangal (Tamil Nadu), Khecheopalri (Sikkim) and Udhwa Lake (Jharkhand) were added. Rudrasagar (Tripura) was designated in 2005 and Bakhira (UP) in 2021-22.\nAnswer: (c)", pattern=S4, theme="Ramsar sites added in 2025")

Q(149, """Consider the following statements about Cricket player Virat Kohli:

1. He is the only captain to have scored seven double centuries in Test Cricket
2. He is the only Indian cricketer with most centuries as a captain
3. He is the first Indian captain to achieve twin centuries on captaincy debut
4. He holds the record for the most double centuries by an Indian in Test Cricket

Which of the statements given above are correct?""",
  ["1 and 2 only", "2 and 3 only", "1, 3 and 4 only", "1, 2, 3 and 4"], "D", "Current Affairs > Sports > Cricket", 45,
  "All seven of Kohli's Test double centuries came as captain, more than any captain; he has the most international centuries as Indian captain; he scored 115 and 141 at Adelaide in 2014 in his first Test as captain; and his seven double centuries are the most by an Indian.\nAnswer: (d)", pattern=S4, theme="Virat Kohli records")
F(149, "Statement 2 wording loose; DP accepts all four")

Q(150, "Ethereum, Tether, Solana and Cardano are all forms of",
  ["Crypto currency", "Artificial Intelligence(AI) Startups", "Humanoid Robots", "Medical apps"], "A", "Current Affairs > Science & Technology > Digital Technology", 5,
  "All four are cryptocurrencies (Tether is a stablecoin).\nAnswer: (a)", theme="Cryptocurrencies")
