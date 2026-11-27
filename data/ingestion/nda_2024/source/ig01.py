from qfmt import Q, P, F, W

# NDA I 2024 GAT, Set A (RRAN-A-GAT), Part B General Knowledge, Q51-150 (English pages 11-47, odd)
# Figure items are carried as text descriptions of the printed diagram (no image files for this paper).
PH = "Science & Technology > Physics > "
CH = "Science & Technology > Chemistry > "
BI = "Science & Technology > Biology/Life Sciences > "
PG = "Geography > Physical Geography > "
IG = "Geography > Indian Geography > "
AH = "History > Ancient History > "
MD = "History > Medieval History > "
MH = "History > Modern History > "
CA = "Current Affairs > "
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"
S4 = "4-Statement Combination"
SC = "Statement Count"
MT = "Match the Following"
CHR = "Chronology"
AR = "Assertion-Reason"

Q(51, "An infinite combination of resistors, each having resistance R = 4 Ω, is given below. What is the net resistance between the points A and B? (Each resistance is of equal value, R = 4)\n\n(Figure: an infinite ladder network between A and B. Each section has one resistor R in series, placed alternately in the upper and lower line, followed by one resistor R connected across the two lines, repeating to infinity.)",
  ["0 Ω", "2 + 2√5 Ω", "2 + √5 Ω", "∞ Ω"], "B", PH + "Electricity & Electric Circuits", 40,
  "Step 1: Adding one more section leaves an infinite ladder unchanged, so x = R + Rx/(R + x).\nStep 2: x² − Rx − R² = 0 gives x = R(1 + √5)/2 = 2(1 + √5) = 2 + 2√5 Ω for R = 4 Ω.\nAnswer: (b)", theme="Infinite ladder network")

Q(52, "An electric circuit is given below. V₁ = 1 V and Resistance R = 1000 Ω.\n\n(Figure 1: battery V₁ connected across R; A and B are the ends of R.)\n\nThe current through the resistance R is very close to 1 mA and the voltage across point A and B, V_AB = 1 V. Now the circuit is changed to:\n\n(Figure 2: batteries V₁ and V₂ connected in parallel with each other and with R, between A and B.)\n\nwhere value of V₂ = 5 V. The internal resistances of both the batteries are 0.1 Ω. The current through the resistance R is about:",
  ["1.0 mA", "1.2 mA", "3.0 mA", "5.0 mA"], "C", PH + "Electricity & Electric Circuits", 40,
  "Step 1: With equal internal resistances and a large load, the common terminal voltage is the average of the EMFs: (1/0.1 + 5/0.1)/(2/0.1) ≈ 3 V (a large current circulates between the batteries).\nStep 2: Current through R ≈ 3 V/1000 Ω = 3 mA.\nAnswer: (c)", theme="Unequal batteries in parallel")

Q(53, "If the current through an electrical machine running on direct current is 15 A and the machine runs for 10 minutes, the charge that passes through the machine during this time is:",
  ["1.50 C", "150 C", "900 C", "9000 C"], "D", PH + "Electricity & Electric Circuits", 5,
  "Q = It = 15 × 600 = 9000 C.\nAnswer: (d)", theme="Charge from current and time")

Q(54, "Which one of the following is the best shape of a solid metal rod to form the top end of a lightning conductor?\n\n(Options are drawings of a rod's top end.)",
  ["Rod ending in a pointed conical tip", "Rod with a flat, disc-shaped top", "Rod topped by a sphere", "Plain blunt rectangular rod"], "A", PH + "Electricity & Electric Circuits", 15,
  "Charge density and the electric field are greatest at sharp points, so a pointed tip discharges the atmosphere best (action of points).\nAnswer: (a)", theme="Action of points")

Q(55, "Which of the following forces is/are fundamental in nature?\n\n1. Gravitational force\n2. Electromagnetic forces\n3. Strong and weak nuclear forces\n\nSelect the correct answer using the code given below:",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PH + "Classical Mechanics, Motion & Gravitation", 10,
  "The four fundamental forces are gravitational, electromagnetic, strong nuclear and weak nuclear.\nAnswer: (d)", pattern=S3, theme="Fundamental forces")

Q(56, "A spherical shell of outer radius R and inner radius R/2 contains a solid sphere of radius R/2 (see figure). The density of the material of the solid sphere is ρ and that of the shell is ρ/2. What is the average mass density of the larger sphere thus formed?\n\n(Figure: a dark solid core of radius R/2 inside a lighter shell of outer radius R.)",
  ["3ρ/4", "9ρ/16", "7ρ/8", "5ρ/8"], "B", PH + "Classical Mechanics, Motion & Gravitation", 30,
  "Step 1: With V the volume of the full sphere, the core has volume V/8 and mass ρV/8; the shell has volume 7V/8 and mass 7ρV/16.\nStep 2: Total mass 9ρV/16, so average density 9ρ/16.\nAnswer: (b)", theme="Average density of a composite sphere")

Q(57, "The human eye is like a camera that has a lens with:",
  ["fixed focal length and fixed aperture size.", "variable focal length and fixed aperture size.", "fixed focal length and variable aperture size.", "variable focal length and variable aperture size."], "D", PH + "Geometrical & Physical Optics", 15,
  "Ciliary muscles change the focal length (accommodation) and the iris changes the pupil (aperture) size.\nAnswer: (d)", theme="Eye as a camera")

Q(58, "Under Article 371A of the Constitution of India, with respect to which of the following item(s) the Acts of the Parliament of India shall *not* apply to the State of Nagaland, unless the Legislative Assembly of the State of Nagaland by a resolution so decides?\n\n1. Religious or social practices of Nagas\n2. Naga customary law and procedure\n3. Ownership and transfer of land and its resources\n4. Boundaries of Nagaland with other states\n\nSelect the answer using the code given below:",
  ["1 only", "2 and 3 only", "1, 2 and 3 only", "1, 2, 3 and 4"], "C", "Polity > Federalism > Centre-State Relations", 25,
  "Article 371A protects religious or social practices of the Nagas, Naga customary law and procedure, administration of civil and criminal justice under that law, and ownership and transfer of land and its resources. Boundaries are not covered.\nAnswer: (c)", pattern=S4, theme="Article 371A")

Q(59, "Under Article 191 of the Constitution of India, a person shall be disqualified for being chosen as, and for being, a member of the Legislative Assembly or Legislative Council of a state if the person holds any office of profit under:\n\n1. the Government of India.\n2. any State Government.\n\nSelect the correct answer using the code given below:",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Polity > Legislature > Parliament", 15,
  "Article 191(1)(a) disqualifies a person holding an office of profit under the Government of India or the Government of any State (other than an exempted office).\nAnswer: (c)", pattern=S2, theme="Office of profit")

Q(60, "Consider the following UN Declarations/Covenants:\n\n1. Universal Declaration of Human Rights\n2. Convention on the Elimination of All Forms of Discrimination Against Women\n3. International Covenant of Economic, Social and Cultural Rights\n4. Convention on Refugees\n\nWhich one of the following is the correct chronological order (starting with the earliest) of the above?",
  ["1, 4, 3, 2", "1, 2, 3, 4", "1, 3, 2, 4", "4, 1, 2, 3"], "A", "International Relations > International Law & Human Rights > International Human Rights", 25,
  "UDHR 1948; Refugee Convention 1951; ICESCR 1966; CEDAW 1979.\nAnswer: (a)", pattern=CHR, theme="UN human rights instruments")

Q(61, "Which one of the following statements regarding the objectives of the Second Five-Year Plan is *not* correct?",
  ["Development of the basic and heavy industry sector", "Increase in national income to raise living standards", "Expansion of the consumer goods sector", "Expansion of employment opportunities"], "C", "Economy > Development & Welfare > Economic Planning", 20,
  "The Mahalanobis-model Second Plan stressed basic and heavy industry, higher national income, more employment and reduced inequality. Consumer-goods expansion was not an objective.\nAnswer: (c)", theme="Second Five-Year Plan")

Q(62, "Consider the following statements about the emergence of urban centres in India from circa 6th Century BCE:\n\n1. All of them developed away from the capitals of *mahajanpadas*.\n2. Major towns were located along routes of communication.\n3. Many were bustling centres of commercial, cultural and political activity.\n\nHow many of the above statements is/are correct?",
  ["1", "2", "3", "None"], "B", AH + "Mahajanapadas & Magadha", 30,
  "Many cities of this period were themselves capitals of mahajanapadas, so statement 1 is wrong. Towns grew along land and river routes and were centres of trade, culture and politics.\nAnswer: (b)", pattern=SC, theme="Second urbanisation")

Q(63, "Consider the following statements about ancient Indian inscriptions:\n\n1. The earliest inscriptions are in Sanskrit.\n2. Kharosthi script, used in inscriptions in the north-west, was deciphered with the help of coins of Indo-Greek kings who ruled over the area.\n3. Most of the inscriptions mention grand, unique events, and routine agricultural practices do not find mention.\n\nHow many of the above statements is/are correct?",
  ["1", "2", "3", "None"], "B", AH + "Literature, Science & Inscriptions", 30,
  "The earliest inscriptions (Asokan) are in Prakrit, not Sanskrit. Kharosthi was deciphered using bilingual Indo-Greek coins, and inscriptions record grand events, not routine agriculture.\nAnswer: (b)", pattern=SC, theme="Inscriptional evidence")

Q(64, "The relative atomic mass of boron (which exists in two isotopic forms ¹⁰B and ¹¹B) is 10.81. What will be the abundance of ¹⁰B and ¹¹B, respectively (consider a sample of 100 atoms)?",
  ["19% and 81%", "81% and 19%", "38% and 62%", "62% and 38%"], "A", CH + "Atomic Structure, Isotopes & Periodicity", 20,
  "10x + 11(100 − x) = 1081 gives x = 19: 19% ¹⁰B and 81% ¹¹B.\nAnswer: (a)", theme="Isotopic abundance")

Q(65, "Which among the following are essential constituents of Portland cement?",
  ["Sand, lime, clay", "Silica, alumina, lime", "Silica, lime, graphite powder", "Sand, graphene, clay"], "B", CH + "Industrial, Materials & Applied Chemistry", 15,
  "Portland cement is made mainly of lime (CaO), silica (SiO₂) and alumina (Al₂O₃), with some iron oxide.\nAnswer: (b)", theme="Composition of cement")

Q(66, "Litmus, a well-known acid-base indicator, is derived from:", ["Fungi", "Lichens", "Bacteria", "Termite"], "B", CH + "Acids, Bases, pH & Commercial Inorganic Salts", 5,
  "Litmus is extracted from lichens.\nAnswer: (b)", theme="Source of litmus")

Q(67, "What is the oxidation state of Vanadium in V₂O₅?", ["+2", "+4", "+3", "+5"], "D", CH + "Chemical Reactions, Stoichiometry & Energetics", 5,
  "2x + 5(−2) = 0 gives x = +5.\nAnswer: (d)", theme="Oxidation state")

Q(68, "Match List-I with List-II and select the correct answer using the code given below the Lists:\n\n| List-I (Allotrope of Carbon) | List-II (Property) |\n|---|---|\n| A. Graphite | 1. Thinnest and strongest material |\n| B. Diamond | 2. Hardest natural substance |\n| C. Fullerene | 3. Very light and strong material |\n| D. Graphene | 4. Soft and slippery material |",
  ["A-4, B-2, C-3, D-1", "A-4, B-3, C-2, D-1", "A-1, B-3, C-2, D-4", "A-1, B-2, C-3, D-4"], "A", CH + "Chemical Bonding & Molecular Structure", 15,
  "Graphite is soft and slippery; diamond is the hardest natural substance; fullerenes are light and strong; graphene is the thinnest and strongest material.\nAnswer: (a)", pattern=MT, theme="Allotropes of carbon")

Q(69, "Consider the following statements regarding the International Date Line:\n\n1. It is roughly 180° meridian, which deviates slightly East and West to avoid land areas surrounded by the Atlantic Ocean.\n2. The date to the East of this line is (24 hours) earlier than to the West.\n\nWhich of the statements given above is/are correct?",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "B", PG + "Earth Motions & Geographical Coordinates", 25,
  "The Date Line zigzags to avoid land in the Pacific, not the Atlantic, so statement 1 is wrong. East of the line the calendar is one day behind (earlier) than west of it, so statement 2 is right.\nAnswer: (b)", pattern=S2, theme="International Date Line")
F(69, "Statement 2's wording ('earlier') is read as 'one day behind'; DP key (b)")

Q(70, "Which of the following statements regarding 'aurora' is/are correct?\n\n1. The solar wind upon reaching the Earth's atmosphere is directed towards two magnetic poles and a colourful display of lights is seen in the night sky.\n2. The particles interact with the different gases of the atmosphere and each gas glows with a particular colour.\n3. In April 2023, aurora was captured in the night sky in India by the Indian Astronomical Observatory at Hanle, Ladakh.\n\nSelect the answer using the code given below:",
  ["1 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "D", PG + "Climatology", 20,
  "Charged solar-wind particles are funnelled to the magnetic poles and excite atmospheric gases, each emitting a characteristic colour. Hanle's all-sky cameras recorded an aurora on 22-23 April 2023.\nAnswer: (d)", pattern=S3, theme="Aurora")

Q(71, "Which of the following statements regarding *Barchan* is/are correct?\n\n1. It is a crescent shaped mound of sand, which is deposited by the wind blowing constantly from one direction in a desert.\n2. The windward side has a convex steep slope with maximum height at the centre.\n3. Two ends of *Barchan* are called horns and point opposite to the direction the wind blows.\n\nSelect the answer using the code given below:",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "A", PG + "Geomorphology & Earth Surface Processes", 30,
  "A barchan is a crescent dune formed by wind from one direction. Its windward slope is gentle and convex (the steep slip face is on the leeward side), and its horns point downwind, i.e. in the direction the wind blows.\nAnswer: (a)", pattern=S3, theme="Barchan dunes")
F(71, "Depends on reading of statement 2 (windward slope is gentle, not steep); DP key (a)")

Q(72, "Which of the following statements regarding Regur soil is/are correct?\n\n1. It is a light coloured, clayey and fertile soil.\n2. It is developed on Deccan basaltic lava under hot and humid conditions.\n3. Cotton is extensively cultivated in this soil.\n\nSelect the answer using the code given below:",
  ["1 and 2", "2 and 3", "2 only", "3 only"], "B", IG + "Indian Soils", 25,
  "Regur (black cotton soil) is dark, not light coloured. It developed from weathered Deccan basalt and is ideal for cotton. The paper treats the Deccan-lava origin statement as correct (see also Q75).\nAnswer: (b)", pattern=S3, theme="Regur soil")
F(72, "Statement 2's 'hot and humid' is debatable (often described as semi-arid); kept consistent with Q75")

Q(73, "Which of the following statements regarding clouds is/are correct?\n\n1. Clouds are classified on the basis of altitude and their form.\n2. According to altitude they are classified as High, Middle and Low clouds.\n3. Stratus, Nimbostratus and Stratocumulus are high clouds.\n\nSelect the answer using the code given below:",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "B", PG + "Climatology", 15,
  "Clouds are classified by height and form into high, middle and low families. Stratus, nimbostratus and stratocumulus are low clouds.\nAnswer: (b)", pattern=S3, theme="Cloud classification")

Q(74, "Consider the following statements regarding 'fronts':\n\n1. The movement of a front causes a slow change in weather in the area over which it moves.\n2. Cold fronts are associated with thunderstorms.\n3. Warm front is the boundary between an advancing mass of warm air where it is overriding and rising above a mass of colder air.\n\nWhich of the statements given above is/are correct?",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "C", PG + "Atmospheric Circulation", 20,
  "A passing front brings abrupt weather changes, so statement 1 is wrong. Cold fronts force rapid uplift and thunderstorms; at a warm front warm air rides up over colder air.\nAnswer: (c)", pattern=S3, theme="Weather fronts")

Q(75, "Consider the following statements regarding soils:\n\n1. Soils having a very high content of sodium and calcium and pH of more than 7.0 are alkaline soils.\n2. Black cotton soil had developed on the Deccan basaltic lava under hot and humid conditions.\n3. Laterite soils are characterised by a deep weathered layer from which silica has been leached.\n\nWhich of the statements given above is/are correct?",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PG + "Soil Geography", 30,
  "Alkaline soils are rich in sodium and calcium with pH above 7; black soil is derived from Deccan basalt; laterites are deeply weathered with silica leached out. No option offers '1 and 3', so all three are taken as correct.\nAnswer: (d)", pattern=S3, theme="Soil types")
F(75, "Hinges on statement 2 ('hot and humid'); kept consistent with Q72")

Q(76, "Consider the following characteristics of a grassland:\n\n1. An extensive area of mid latitude grasslands are devoid of trees and shrubs.\n2. The climate is characterised by hot summers, cold winters and relatively low rainfall occurring mainly in spring and summer.\n3. In humid parts, grasses grow to a meter or more in height.\n\nOn the basis of the above characteristics, select the correct grassland from the options given below:",
  ["Steppes", "Prairies", "Savanna", "Pampas"], "B", "Geography > World Geography > World Regional Geography", 30,
  "These are the North American prairies: largely treeless mid-latitude grasslands with continental climate, where tall grasses of a metre or more grow in the more humid east.\nAnswer: (b)", theme="Prairies")
F(76, "Steppes share most traits; the tall-grass detail points to Prairies")

Q(77, "Which of the following statements regarding animal cell membrane is correct?",
  ["They are composed of phospholipids only.", "They are composed of proteins only.", "They are composed of phospholipids and proteins only.", "They are composed of phospholipids, proteins and cholesterol (lipid)."], "D", BI + "Cytology & Cell Architecture", 15,
  "Animal cell membranes contain phospholipids, proteins and cholesterol (plus some carbohydrate).\nAnswer: (d)", theme="Cell membrane composition")

Q(78, "Which of the following is *not* a part of compound microscope?", ["Mirror", "Stage", "Clip", "Retina"], "D", BI + "Cytology & Cell Architecture", 5,
  "Retina is part of the eye, not the microscope.\nAnswer: (d)", theme="Parts of a microscope")

Q(79, "Which one of the following is the correct sequence in increasing complexity?",
  ["Protein – Organism – Tissue – Organ", "Protein – Organ – Tissue – Organism", "Protein – Organism – Organ – Tissue", "Protein – Tissue – Organ – Organism"], "D", BI + "Biological Classification & Diversity", 5,
  "Molecules form cells, cells form tissues, tissues form organs, and organs make up the organism.\nAnswer: (d)", pattern="Ordering/Sequence", theme="Levels of organisation")

Q(80, "Consider the following cell types:\n\n1. Monocyte\n2. Chondrocyte\n3. Basophil\n4. Lymphocyte\n\nHow many of the above belong to animal cell types?",
  ["1", "2", "3", "4"], "D", BI + "Animal Histology & Cell Types", 15,
  "Monocytes, basophils and lymphocytes are white blood cells, and chondrocytes are cartilage cells: all four are animal cells.\nAnswer: (d)", pattern=SC, theme="Animal cell types")

Q(81, "In the human digestive system, which one among the following is the role of the pancreas?",
  ["Secretion of surfactants to break up lipid droplets", "Storage and regulated release of bile", "Secretion of lipase, amylase and protease", "Neutralizing stomach acids"], "C", BI + "Human Anatomy & Systemic Physiology", 15,
  "Pancreatic juice carries lipase, amylase and proteases (trypsin). Bile salts emulsify fat and the gall bladder stores bile.\nAnswer: (c)", theme="Pancreatic enzymes")

Q(82, "Consider the following statements:\n\n1. DNA replication takes place when chromatin is opened up.\n2. Chromatin organises itself into rod-shaped chromosomes before cell division.\n3. Both prokaryotes and eukaryotes have the same process for cell division.\n\nWhich of the statements given above is/are correct?",
  ["1 only", "1 and 2 only", "1, 2 and 3", "3 only"], "B", BI + "Genetics, Molecular Biology & Inheritance", 25,
  "Replication needs the chromatin to be unwound; chromatin condenses into rod-shaped chromosomes before division. Prokaryotes divide by binary fission, eukaryotes by mitosis/meiosis.\nAnswer: (b)", pattern=S3, theme="Chromatin and cell division")

Q(83, "A uniform meter scale of mass 0.24 kg is made of steel. It is kept on two wedges, W₁ and W₂, in a horizontal position. W₁ is at a distance of 0.2 m from one of its ends, while W₂ is at distance of 0.4 m from the other end. If the force on the scale is N₁ due to W₁ and N₂ due to W₂, then: (take g = 10.0 m s⁻²)",
  ["N₁ = 1.6 N and N₂ = 0.8 N", "N₁ = 0.8 N and N₂ = 1.6 N", "N₁ = 0.6 N and N₂ = 1.8 N", "N₁ = 1.8 N and N₂ = 0.6 N"], "C", PH + "Classical Mechanics, Motion & Gravitation", 30,
  "Step 1: W₁ is at 0.2 m, W₂ at 0.6 m, the centre of mass at 0.5 m; weight 2.4 N.\nStep 2: Moments about W₁: N₂ × 0.4 = 2.4 × 0.3, so N₂ = 1.8 N and N₁ = 0.6 N.\nAnswer: (c)", theme="Rod on two supports")

Q(84, "Escape speed from the Earth is close to 11.2 km s⁻¹. On another planet whose radius is half of the Earth's radius and whose mass density is four times that of the Earth, the escape speed in km s⁻¹ will be close to:",
  ["11.2", "15.8", "5.6", "7.9"], "A", PH + "Classical Mechanics, Motion & Gravitation", 30,
  "v = √(2GM/R) ∝ R√ρ. Halving R and quadrupling ρ gives (1/2)(2) = 1, so the speed is unchanged at 11.2 km s⁻¹.\nAnswer: (a)", theme="Escape speed scaling")

Q(85, "Which one of the following does *not* apply to sound waves in fluids?",
  ["They transport energy", "They need a medium to travel", "They are transverse", "They travel faster in liquids than in gases"], "C", PH + "Waves, Acoustics & Electromagnetic Spectrum", 10,
  "Fluids cannot sustain shear, so sound in fluids is longitudinal.\nAnswer: (c)", theme="Sound in fluids")

Q(86, "A ball of 0.1 kg mass is dropped on a hard floor from a height of 0.45 m and rises to a height of 0.20 m. If it was in touch with the floor for 0.1 s, the net force it applied on the floor while bouncing is: (take the gravitational acceleration g = 10 m s⁻²)",
  ["1.0 N", "6.0 N", "3.0 N", "5.0 N"], "D", PH + "Classical Mechanics, Motion & Gravitation", 35,
  "Step 1: Speed at impact √(2·10·0.45) = 3 m/s down; rebound speed √(2·10·0.20) = 2 m/s up.\nStep 2: Change in momentum 0.1 × 5 = 0.5 kg m/s over 0.1 s gives an average (net) force of 5 N.\nAnswer: (d)", theme="Impulse in a bounce")
F(86, "Including the ball's weight the floor reaction is 6 N (option b); 'net force' read as 5 N")

Q(87, "Which one of the following statements regarding simple pendulum is correct?\n\nSimple pendulum has a time period independent of amplitude:",
  ["only for small amplitudes because then the net force on its bob is independent of its displacement.", "for any amplitude because the net force on the bob is always proportional to its displacement.", "for any amplitude because the net force on the bob is independent of its displacement.", "only for small amplitudes because then the net force on its bob is proportional to its displacement."], "D", PH + "Classical Mechanics, Motion & Gravitation", 15,
  "Restoring force is mg sin θ ≈ mgθ only for small angles; then motion is simple harmonic and the period is amplitude-independent.\nAnswer: (d)", theme="Small-angle pendulum")

Q(88, "Which one of the following about different frictional forces is correct?",
  ["Kinetic friction > Static friction > Rolling friction", "Static friction > Rolling friction > Kinetic friction", "Static friction > Kinetic friction > Rolling friction", "Static friction > Kinetic friction = Rolling friction"], "C", PH + "Classical Mechanics, Motion & Gravitation", 10,
  "Limiting static friction exceeds kinetic (sliding) friction, which far exceeds rolling friction.\nAnswer: (c)", theme="Types of friction")

Q(89, "A metallic bob X of mass m is released from position A. It collides elastically with another identical bob Y placed at rest at position B on a horizontal frictionless table. The angle AOB is 30°.\n\n(Figure: X hangs from a string fixed at O and is pulled aside to A, the string making 30° with the vertical OB; Y rests on the table at B, directly below O.)\n\nHow high does the bob X rise immediately after the collision?",
  ["To the same height as that of position A on the other side in the same trajectory", "To half the height as that of position A on the other side along the same trajectory", "The same height at position A", "It stops at position B"], "D", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "In a head-on elastic collision between equal masses the velocities are exchanged: X stops at B and Y moves off with X's speed.\nAnswer: (d)", theme="Elastic collision of equal masses")

Q(90, "Consider the two statements given below:\n\nStatement-1: Infrared waves are also called heat waves.\nStatement-2: Water molecules readily absorb infrared waves.\n\nSelect the correct answer using the code given below:",
  ["Both the statements are individually true and Statement-2 is the correct explanation of Statement-1.", "Both the statements are individually true, but Statement-2 is *not* the correct explanation of Statement-1.", "Statement-1 is true, but Statement-2 is false.", "Statement-2 is true, but Statement-1 is false."], "A", PH + "Waves, Acoustics & Electromagnetic Spectrum", 25,
  "NCERT: infrared waves are called heat waves because water molecules present in most materials readily absorb them, raising their thermal motion.\nAnswer: (a)", pattern=AR, theme="Infrared as heat waves")

Q(91, "Which of the following statements are correct?\n\n1. British 'trade surplus' with India in the nineteenth century meant that the value of British exports to India was much higher than the value of British imports from India.\n2. India played a crucial role in the late-nineteenth-century world economy by helping Britain balance its deficits.\n3. Britain grew opium in India and exported it to China and, therefore, for a while after the 1820s, opium became India's single largest export.\n4. The nineteenth century saw export of Indian raw materials decline, and that of manufactured goods increase.\n\nSelect the answer using the code given below:",
  ["1 and 2 only", "3 and 4 only", "1, 2, 3 and 4", "1, 2 and 3 only"], "D", MH + "Colonial Economy", 25,
  "The first three follow NCERT's account of India in the world economy. In the nineteenth century raw-material exports rose and manufactured exports fell, so statement 4 is reversed.\nAnswer: (d)", pattern=S4, theme="India in the 19th-century world economy")

Q(92, "Match List-I with List-II and select the correct answer using the code given below the Lists:\n\n| List-I (Unit in use in early India) | List-II (Content) |\n|---|---|\n| A. *Muhurta* | 1. Measure of weight |\n| B. *Raktika* | 2. Measure of time |\n| C. *Angula* | 3. Metre of poetry |\n| D. *Pada* | 4. Measure of length |",
  ["A-2, B-1, C-4, D-3", "A-2, B-4, C-1, D-3", "A-3, B-4, C-1, D-2", "A-3, B-1, C-4, D-2"], "A", AH + "Literature, Science & Inscriptions", 25,
  "Muhurta is a unit of time (48 minutes); raktika (rati) a unit of weight; angula (finger-breadth) a unit of length; pada a quarter-verse of poetry.\nAnswer: (a)", pattern=MT, theme="Ancient units")

Q(93, "First coins in Indian history bearing the names and images of rulers were issued by the:", ["Mauryas", "Pushyabhutis", "Guptas", "Indo-Greeks"], "D", AH + "Post-Mauryan Period", 10,
  "The Indo-Greeks were the first to issue coins carrying rulers' names and portraits.\nAnswer: (d)", theme="Indo-Greek coinage")

Q(94, "Social theorists in the nineteenth and twentieth centuries emphasised the emergence of industrialisation, urbanisation, secularisation and bureaucratisation as hallmarks of:",
  ["Modernity", "Feudalism", "Kingship", "Medievalism"], "A", "History > World History > Global Intellectual & Cultural History", 10,
  "These processes are the classic markers of modernity in social theory.\nAnswer: (a)", theme="Modernity")

Q(95, "Consider the following events:\n\n1. Launch of Non-Cooperation Movement\n2. All-India Khilafat Conference in Delhi\n3. Passing of the Rowlatt Act\n4. Jallianwala Bagh incident\n\nWhich one of the following is the correct chronological order of the given events (earliest to latest)?",
  ["1, 2, 3, 4", "3, 4, 2, 1", "3, 2, 4, 1", "2, 3, 4, 1"], "B", MH + "Gandhian Movements", 20,
  "Rowlatt Act (March 1919), Jallianwala Bagh (April 1919), Khilafat Conference in Delhi (November 1919), Non-Cooperation Movement (1920).\nAnswer: (b)", pattern=CHR, theme="1919-20 sequence")

Q(96, "Match List-I with List-II and select the correct answer using the code given below the Lists:\n\n| List-I (System/Category) | List-II (Description) |\n|---|---|\n| A. *Upari* | 1. Peasants directly responsible for the payment of revenue |\n| B. *Pattadar* | 2. Category of tenancy tenure held under the Marathas |\n| C. *Mirasidar* | 3. Gifts of land or land revenue |\n| D. *Inam* lands | 4. Co-parcenary title holder and designated revenue payer in southern India |",
  ["A-2, B-1, C-4, D-3", "A-2, B-4, C-1, D-3", "A-3, B-4, C-1, D-2", "A-3, B-1, C-4, D-2"], "A", MD + "Society, Economy & Technology", 30,
  "Uparis were (temporary) tenants under the Maratha system; pattadars were the ryots directly liable for revenue; mirasidars held co-parcenary rights in South Indian villages; inams were grants of land or revenue.\nAnswer: (a)", pattern=MT, theme="Land tenure terms")

Q(97, "Which of the following statements about Vijayanagara king Krishnadevaraya's expeditions are correct?\n\n1. In the early years of his reign he marched against the ruler of Orissa.\n2. In 1520 CE, he captured the fort of Raichur from Ismail Adil Khan.\n3. Krishnadevaraya restored Sultan Mahmud Shah to power and assumed the title of *Yavana-rajya-sthapan-acharya*.\n\nSelect the answer using the code given below:",
  ["1 and 3 only", "2 and 3 only", "1, 2 and 3", "1 and 2 only"], "C", MD + "Vijayanagara & Deccan", 30,
  "His Orissa (Gajapati) campaigns of 1513-18 came early in his reign; he took Raichur from Ismail Adil Shah in 1520; and he restored the Bahmani sultan Mahmud Shah, taking the title Yavana-rajya-sthapanacharya.\nAnswer: (c)", pattern=S3, theme="Krishnadevaraya's campaigns")

Q(98, "Water gas is a mixture of:", ["CO₂ and H₂", "CO and H₂", "CO₂ and H₂O", "CO and H₂O"], "B", CH + "Industrial, Materials & Applied Chemistry", 5,
  "Water gas (syngas from steam over hot coke) is CO + H₂.\nAnswer: (b)", theme="Water gas")

Q(99, "Human body works in the pH range of:", ["6.8 – 7.2", "7.0 – 7.8", "6.5 – 7.5", "7.5 – 8.0"], "B", CH + "Acids, Bases, pH & Commercial Inorganic Salts", 15,
  "NCERT: our body works within the pH range of 7.0 to 7.8.\nAnswer: (b)", theme="Body pH")

Q(100, "Which one among the following statements with reference to the properties of water is *not* correct?",
  ["The specific heat of water is abnormally high.", "Latent heat of fusion of water is very low.", "Density of water is higher than ice.", "Pure water is a non-conductor of electricity."], "B", CH + "States of Matter & Phase Behaviour", 10,
  "Water's latent heat of fusion (about 334 J/g) is high, not low.\nAnswer: (b)", theme="Properties of water")

Q(101, "Which one among the following compounds has a sweet and fruity smell?", ["Ethyl alcohol", "Acetic acid", "Ethyl acetate", "Acetophenone"], "C", CH + "Organic Chemistry & Carbon Compounds", 5,
  "Esters such as ethyl acetate have sweet, fruity odours.\nAnswer: (c)", theme="Esters")

Q(102, "What is the coordination number of Na⁺ and Cl⁻ ions in NaCl lattice?", ["6, 1", "1, 6", "6, 6", "5, 5"], "C", CH + "Chemical Bonding & Molecular Structure", 10,
  "In the rock-salt structure each ion is surrounded octahedrally by six oppositely charged ions.\nAnswer: (c)", theme="Rock-salt structure")

Q(103, "Which one among the following is present in the nettle leaf hairs that causes burning pain?", ["Methanoic acid", "Ethanoic acid", "Benzoic acid", "Acetic acid"], "A", CH + "Acids, Bases, pH & Commercial Inorganic Salts", 5,
  "Nettle stings inject methanoic (formic) acid.\nAnswer: (a)", theme="Nettle sting")

Q(104, "Which one among the following is known as Milk of Magnesia?", ["Magnesium bicarbonate", "Magnesium carbonate", "Magnesium sulphate", "Magnesium hydroxide"], "D", CH + "Acids, Bases, pH & Commercial Inorganic Salts", 5,
  "Milk of magnesia is a suspension of Mg(OH)₂.\nAnswer: (d)", theme="Milk of magnesia")

Q(105, "Soap with water forms:", ["Metallotropic liquid crystal", "Thermotropic liquid crystal", "Homogeneous solution", "Lyotropic liquid crystal"], "D", CH + "States of Matter & Phase Behaviour", 30,
  "Soap-water systems form liquid-crystalline phases whose structure depends on concentration in a solvent: lyotropic liquid crystals.\nAnswer: (d)", theme="Lyotropic liquid crystals")

Q(106, "Which among the following is the correct composition of Borax?",
  ["Sodium, Boron, Magnesium and Hydrogen", "Sodium, Boron, Oxygen and Hydrogen", "Potassium, Boron, Oxygen and Hydrogen", "Sodium, Boron, Nitrogen and Hydrogen"], "B", CH + "Chemical Composition & Classification", 10,
  "Borax is Na₂B₄O₇·10H₂O: sodium, boron, oxygen and hydrogen.\nAnswer: (b)", theme="Borax")

Q(107, "Which one among the following oxides has the highest melting point?", ["Na₂O", "MgO", "Fe₂O₃", "CuO"], "B", CH + "Chemical Bonding & Molecular Structure", 20,
  "MgO (about 2850 °C), with small doubly charged ions and a high lattice energy, melts highest.\nAnswer: (b)", theme="Lattice energy and melting point")

Q(108, "Which of the following statements regarding neap tides is/are correct?\n\n1. It occurs every 14 – 15 days, which coincides with the first and third quarter of the Moon.\n2. This tide has a small tidal range because the gravitational forces of the Moon and the Sun are in quadrature.\n\nSelect the answer using the code given below:",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", PG + "Oceanography", 15,
  "Neap tides come twice a month, at the first and third quarters, when the Sun and Moon pull at right angles and the range is smallest.\nAnswer: (c)", pattern=S2, theme="Neap tides")

Q(109, "Which of the following statements regarding earthquakes is/are correct?\n\n1. The point on the Earth's surface directly above the focus is called the epicentre of the earthquake.\n2. Earthquakes generate Primary and Secondary waves that radiate outward from the earthquake focus.\n3. Deep-focus earthquakes are likely to cause more damage than shallow-focus earthquakes.\n\nSelect the answer using the code given below:",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "B", PG + "Natural Hazards", 15,
  "Shallow-focus earthquakes do more damage, since their energy reaches the surface with less attenuation. The other two statements are standard.\nAnswer: (b)", pattern=S3, theme="Earthquake basics")

Q(110, "Which of the following statements regarding air temperature is/are correct?\n\n1. Air temperature is measured at a standard height of 1.2 m (4.0 feet) above the ground surface.\n2. The average rate of temperature decrease with height is termed as the environmental temperature lapse rate.\n\nSelect the answer using the code given below:",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", PG + "Climatology", 25,
  "Standard screens hold thermometers about 1.2 m above ground, and the average decline of temperature with height (about 6.4 °C/km) is called the environmental temperature lapse rate.\nAnswer: (c)", pattern=S2, theme="Measuring air temperature")
F(110, "Some texts call the average rate the 'normal lapse rate'; terminology follows Strahler")

Q(111, "Which of the following statements regarding humidity is/are correct?\n\n1. It is a ratio between the actual amount of water vapour present in the atmosphere and the maximum amount it can hold at a given temperature.\n2. When the relative humidity is high, more water evaporates from the skin.\n3. Higher the air temperature lower the relative humidity of the air.\n\nSelect the answer using the code given below:",
  ["1 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "C", PG + "Climatology", 20,
  "Statement 1 defines relative humidity. Warmer air can hold more vapour, so for the same vapour content relative humidity falls. High humidity slows evaporation from the skin.\nAnswer: (c)", pattern=S3, theme="Relative humidity")

Q(112, "Which of the following statements regarding cyclones and anti-cyclones is/are correct?\n\n1. In the Northern Hemisphere, cyclones rotate counter clockwise and anticyclones rotate clockwise.\n2. Cyclones are often associated with cloudy or rainy weather, whereas anticyclones are often associated with fair weather.\n3. In the Southern Hemisphere, the cyclonic spiral will be clockwise because the Coriolis force acts to the left.\n\nSelect the answer using the code given below:",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PG + "Atmospheric Circulation", 20,
  "All three are correct: Coriolis deflection sets the rotation in each hemisphere, and rising air in cyclones gives cloud while subsiding air in anticyclones gives fair weather.\nAnswer: (d)", pattern=S3, theme="Cyclones and anticyclones")

Q(113, "Identify the sea-port in India on the basis of the given characteristics:\n\n1. It is more than a century old port on the west coast of India.\n2. It is a natural harbour protected by a breakwater and also by a mole.\n3. A deep draft channel of about 14 metres depth permits large vessels to enter the harbour.\n\nSelect the correct sea-port from the options given below:",
  ["Mormugao Port", "Deendayal Port", "Cochin Port", "Jawaharlal Nehru Port"], "A", IG + "Transport & Connectivity", 30,
  "Mormugao (Goa), opened in the 1880s, is a natural harbour protected by a breakwater and mole, with an approach channel about 14 m deep. Deendayal and JNPT are post-1950; Cochin port dates from 1928.\nAnswer: (a)", theme="Mormugao Port")

Q(114, "Identify the Iron and Steel Plant on the basis of the given characteristics:\n\n1. It receives coal from Jharia and iron-ore from Sundargarh and Kendujhar.\n2. Power for the electric furnaces is procured from Hirakund.\n3. Water is obtained from Koel and Sankh rivers.\n\nSelect the correct Iron and Steel Plant from the options given below:",
  ["Bhilai Steel Plant", "Durgapur Steel Plant", "Rourkela Steel Plant", "Bokaro Steel Plant"], "C", IG + "Resources & Minerals", 15,
  "Rourkela (Odisha) stands at the Koel-Sankh confluence, uses Hirakud power, Jharia coal and Sundargarh/Kendujhar ore.\nAnswer: (c)", theme="Rourkela Steel Plant")

Q(115, "Which of the following statements regarding Earth's internal structure is/are correct?\n\n1. The oceanic crust is heavier than the continental crust.\n2. Most of the Earth's internal heat is contained within the mantle.\n3. Large convective cells in the crust circulate heat and drive plate-tectonic processes.\n\nSelect the answer using the code given below:",
  ["3 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "B", PG + "Earth Interior & Geotectonics", 20,
  "Oceanic (basaltic) crust is denser than continental crust, and the mantle, the largest layer, holds most internal heat. Convection cells operate in the mantle, not the crust.\nAnswer: (b)", pattern=S3, theme="Earth's interior")

Q(116, "Which of the following statements regarding the given rivers is/are correct?\n\n1. Tsangpo crosses over into India under the name of Dihang.\n2. Godavari has the second largest river basin covering about 10 percent of the area of India.\n3. Rivers Chambal and Betwa are the important tributaries of river Ganga which join river Ganga directly in Uttar Pradesh.\n\nSelect the answer using the code given below:",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "B", IG + "Indian Drainage", 15,
  "The Tsangpo enters India as the Siang/Dihang, and the Godavari basin (about 10% of India) is second only to the Ganga's. Chambal and Betwa join the Yamuna, not the Ganga directly.\nAnswer: (b)", pattern=S3, theme="Indian rivers")

Q(117, "Which of the following statements regarding the World Climate Types and their relation with Inter Tropical Convergence Zone (ITCZ) is/are correct?\n\n1. Tropical Wet Climate is one of the world's rainiest due to the dominance of the ITCZ over it.\n2. Tropical Savanna Climate experiences a distinctive alternation of wet and dry seasons, caused chiefly by the seasonal shift in latitude of the subtropical highs and ITCZ.\n3. The Tropical Monsoonal Climate experiences heavy rainfall as a consequence of the nearness of the ITCZ for much of the year.\n\nSelect the answer using the code given below:",
  ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], "D", PG + "Climatology", 30,
  "All three follow the standard (Strahler) descriptions: ITCZ dominance makes the wet equatorial climate rainy, its seasonal shift with the subtropical highs gives the savanna its wet-dry rhythm, and its nearness much of the year brings heavy monsoon rain.\nAnswer: (d)", pattern=S3, theme="ITCZ and climate types")

Q(118, "Which of the following statements regarding tropical cyclones is/are correct?\n\n1. These storms develop during the summer and autumn in every tropical ocean except the South Atlantic and eastern South Pacific Oceans.\n2. Tropical cyclones that occur in the North Atlantic and eastern North Pacific Oceans are known as typhoons.\n3. Tropical cyclones that occur in the Indian and South Pacific Oceans are called cyclones.\n\nSelect the answer using the code given below:",
  ["3 only", "1 and 2 only", "1 and 3 only", "1, 2 and 3"], "C", PG + "Atmospheric Circulation", 20,
  "In the North Atlantic and eastern North Pacific they are hurricanes; typhoons are in the western North Pacific. The other two statements are correct.\nAnswer: (c)", pattern=S3, theme="Names of tropical cyclones")

Q(119, "Identify the land biome on the basis of the given characteristics:\n\n1. Their climates are characterised by high rainfall and temperatures that vary from cold to mild.\n2. These forests contain primarily deciduous trees – including maple, oak, hickory and beechwood.\n3. Raccoons, opossums, bats and squirrels are found in the trees.\n\nSelect the correct land biome from the options given below:",
  ["Tropical forest", "Temperate forest", "Boreal forest", "Mediterranean forest"], "B", PG + "Biogeography", 15,
  "Maple, oak, hickory and beech with raccoons and opossums describe the temperate deciduous forest.\nAnswer: (b)", theme="Temperate deciduous forest")

Q(120, "Leaves of most plants appear green because the chlorophyll present in it:",
  ["absorbs red and blue light while reflecting green light.", "absorbs green light only.", "absorbs green light while reflecting red and blue light.", "reflects red light and absorbs blue and green light."], "A", BI + "Plant Anatomy, Transport & Physiology", 5,
  "Chlorophyll absorbs mostly red and blue light and reflects green.\nAnswer: (a)", theme="Why leaves are green")

Q(121, "In most prokaryotes, the chromosome number is:", ["4", "3", "2", "1"], "D", BI + "Genetics, Molecular Biology & Inheritance", 10,
  "Most prokaryotes have a single circular chromosome.\nAnswer: (d)", theme="Prokaryotic chromosome")

Q(122, "Bacterial DNA is referred to as naked because it is *not* associated with:", ["any scaffold", "proteins", "ribozymes", "plasmid"], "B", BI + "Genetics, Molecular Biology & Inheritance", 15,
  "Prokaryotic DNA is not wrapped around histone proteins, hence 'naked'.\nAnswer: (b)", theme="Naked DNA")

Q(123, "Which one among the following cells produces antibodies against a foreign antigen?", ["Lymphocytes", "Erythrocytes", "Eosinophils", "Platelets"], "A", BI + "Human Pathology, Immunology & Deficiency Diseases", 5,
  "B-lymphocytes (as plasma cells) produce antibodies.\nAnswer: (a)", theme="Antibody-producing cells")

Q(124, "If the block P as shown in the figure below were to be at rest, what should the magnitude of force F be?\n\n(Figure: forces on block P: 10 N and 15 N act to the left; 2 N, 15 N and F act to the right.)",
  ["5 N", "6 N", "8 N", "10 N"], "C", PH + "Classical Mechanics, Motion & Gravitation", 10,
  "For equilibrium, 10 + 15 = 2 + 15 + F, so F = 8 N.\nAnswer: (c)", theme="Balancing forces")

Q(125, "Of the following, which does *not* belong to a nuclear reactor?", ["A turbine", "A heat exchanger", "A mechanism to reduce CO₂ emission", "A reaction chamber"], "C", PH + "Energy & Power Technologies", 10,
  "Fission produces no CO₂, so a reactor has no CO₂-reduction mechanism; turbines, heat exchangers and the core are standard.\nAnswer: (c)", theme="Parts of a nuclear power plant")

Q(126, "Consider the following electric circuit:\n\n(Figure: a 10 V battery in series with a 5 Ω resistor, then a parallel group of three branches of 10 Ω, 0 Ω and 10 Ω, then another 5 Ω resistor.)\n\nThe current in the above electric circuit is:",
  ["1 A", "(10/15) A", "2 A", "1.5 A"], "A", PH + "Electricity & Electric Circuits", 20,
  "The 0 Ω branch shorts the parallel group, so the total resistance is 5 + 0 + 5 = 10 Ω and I = 10/10 = 1 A.\nAnswer: (a)", theme="Short-circuited parallel group")

Q(127, "A microscope may be a combination of:", ["two convex lenses.", "a convex and a concave lens.", "two concave lenses.", "a convex lens and a convex mirror."], "A", PH + "Geometrical & Physical Optics", 10,
  "A compound microscope uses two convex lenses (objective and eyepiece).\nAnswer: (a)", theme="Compound microscope")

Q(128, "For a human eye, where u is the distance of an object from the eye, f is the focal length of the lens and v is the distance of image from the eye, which is the correct schematic graph?\n\n(Options are sketch graphs.)",
  ["v against u: falls steeply, then levels off", "v against u: a straight line sloping down", "f against u: rises, then levels off", "v against f: rises, then levels off"], "C", PH + "Geometrical & Physical Optics", 35,
  "The image always forms on the retina, so v is fixed. From 1/f = 1/v + 1/u, f = uv/(u + v) increases with u and levels off towards v: the f-u graph rises and saturates.\nAnswer: (c)", theme="Accommodation of the eye")

Q(129, "Which of the following statements with regard to the phenomenon of the primary rainbow formation by water droplets is/are correct?\n\n1. It involves refraction and one internal reflection of sunlight.\n2. It involves refraction of sunlight only.\n3. It is formed as the inner bow.\n4. It may involve more than one internal reflection as well as refraction of sunlight.\n\nSelect the answer using the code given below:",
  ["1 only", "1 and 3", "3 and 4", "2 and 3"], "B", PH + "Geometrical & Physical Optics", 15,
  "The primary bow comes from two refractions with one internal reflection and is the inner, brighter bow; two internal reflections give the outer secondary bow.\nAnswer: (b)", pattern=S4, theme="Primary rainbow")

Q(130, "Which one of the following scientists mentioned that an electron in an atom could revolve in certain stable orbits without the emission of radiant energy?",
  ["Ernest Rutherford", "J.J. Thomson", "Niels Bohr", "Albert Einstein"], "C", PH + "Atomic, Nuclear & Particle Physics", 5,
  "Bohr's first postulate: electrons revolve in stationary orbits without radiating.\nAnswer: (c)", theme="Bohr's postulate")

Q(131, "LIGO experiment confirmed one of the predictions of:", ["String theory", "Special theory of relativity", "Quantum mechanics", "General theory of relativity"], "D", "Science & Technology > Space Technology & Astronomy > Theoretical Astronomy & Astrophysics", 10,
  "LIGO detected gravitational waves, predicted by general relativity.\nAnswer: (d)", theme="Gravitational waves")

Q(132, "A block of mass 2 kg, moving with the initial speed of 3 m/s comes to rest on a rough horizontal surface after travelling a distance of 3 m. The magnitude of the frictional force is:",
  ["9 N", "3 N", "18 N", "1 N"], "B", PH + "Classical Mechanics, Motion & Gravitation", 15,
  "Work-energy: f × 3 = ½ × 2 × 3² = 9 J, so f = 3 N.\nAnswer: (b)", theme="Friction from stopping distance")

Q(133, "Which one of the following is primarily responsible for conduction of current in a metal?", ["Bound electrons", "Free electrons", "Both bound and free electrons", "Ions"], "B", PH + "Electricity & Electric Circuits", 5,
  "Metals conduct through their free (conduction) electrons.\nAnswer: (b)", theme="Conduction in metals")

Q(134, "Which of the following were features of the postal system of India as described by Ibn Battuta?\n\n1. The foot post carries a ringing bell in one hand.\n2. The horse post is called *uluq*, stationed at a distance of every four miles.\n3. The foot post or *dawa* has one station at every four *kos* of distance.\n4. The foot post is quicker than horse post.\n\nSelect the correct answer using the code given below:",
  ["1, 2 and 4", "1 and 2 only", "2 and 3 only", "1, 3 and 4"], "A", MD + "Delhi Sultanate", 25,
  "Ibn Battuta: the horse-post (uluq) had relays every four miles; the foot-post (dawa) had three stations per mile, its runner carrying a rod with copper bells; and the foot-post was quicker than the horse-post.\nAnswer: (a)", pattern=S4, theme="Ibn Battuta on the postal system")

Q(135, "Which one of the following texts is a commentary written by Chakrapanidatta (11 Century CE from Bengal) on the *Sushrut Samhita*?",
  ["*Sabdachandrika*", "*Bhanumati*", "*Nitiratnakara*", "*Lohasarvasava*"], "B", MD + "Science, Medicine & Knowledge", 30,
  "Chakrapanidatta's commentary on the Sushruta Samhita is the Bhanumati.\nAnswer: (b)", theme="Chakrapanidatta")

Q(136, "Consider the following statements about the arrival of tobacco in India:\n\n1. Tobacco plant arrived first in the Deccan.\n2. Tobacco spread to northern India in the early years of the seventeenth century.\n\nWhich of the statements given above is/are correct?",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", MD + "Mughal Empire", 20,
  "NCERT: tobacco first reached the Deccan and spread to north India in the early seventeenth century.\nAnswer: (c)", pattern=S2, theme="Arrival of tobacco")

Q(137, "Consider the following Women's Associations and their important associates in early twentieth century India:\n\n1. Women's Indian Association of 1917 : Margaret Cousins\n2. National Council of Women in India of 1925 : Sarala Devi Chaudhurani\n3. Bharat Stree Mahamandal of 1910 : Lady Meherbai Tata\n\nWhich of the above pairs is/are correctly matched?",
  ["1, 2 and 3", "2 and 3 only", "1 and 2 only", "1 only"], "D", MH + "Socio-Religious Reform", 30,
  "Margaret Cousins co-founded the WIA. The NCWI is associated with Lady Meherbai Tata, and the Bharat Stree Mahamandal was founded by Sarala Devi Chaudhurani: pairs 2 and 3 are swapped.\nAnswer: (d)", pattern=S3, theme="Women's organisations")

Q(138, "Consider the following statements about the issue of separate electorate during the early decades of the twentieth century in India as a means to secure adequate representation for the deprived social categories in the absence of universal adult franchise:\n\n1. The All India Depressed Classes Association of M.C. Rajah was staunchly in favour of joint electorate.\n2. The All India Depressed Classes Leaders' Conference demanded separate electorate.\n3. The Communal Award in September 1932 recognised the right to separate electorate for the 'untouchables'.\n\nWhich of the statements given above are correct?",
  ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "A", MH + "British Administration & Constitutional Development", 35,
  "Rajah's association backed joint electorates with reservation, while the Depressed Classes Leaders' Conference (Nagpur, 1930) demanded separate electorates. The Communal Award did grant separate electorates to the depressed classes, but it was announced in August 1932 (September 1932 was the Poona Pact).\nAnswer: (a)", pattern=S3, theme="Depressed classes and electorates")
F(138, "Turns on the month in statement 3 (Award was 16 Aug 1932); if the date is overlooked the answer is (d)")

Q(139, "Which of the following statements with regard to the famous 'silk routes' are correct?\n\n1. Silk routes refer to East-bound European silk cargoes along these routes.\n2. There were several silk routes, over land and by sea, joining together vast regions of Asia with Europe and northern Africa.\n3. They are known to have existed since before the Christian Era and thrived almost till the fifteenth century.\n4. Besides silk, Chinese pottery, textiles and spices from India and South-east Asia travelled the same route.\n\nSelect the answer using the code given below:",
  ["1, 2 and 3", "1, 3 and 4", "2, 3 and 4", "1, 2 and 4"], "C", "History > World History > Economic & Monetary History", 15,
  "The name comes from west-bound Chinese silk cargoes, not east-bound European ones. The other three statements follow NCERT.\nAnswer: (c)", pattern=S4, theme="Silk routes")

Q(140, "Consider the following statements about Ajanta paintings:\n\n1. The surface of the rock was coated with clay mixed with rice husk and gum and a coat of lime was applied over this.\n2. The outline drawing was done first on the lime coating and colours were added subsequently.\n\nWhich of the statements given above is/are correct?",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "History > Art & Culture > Sculpture & Visual Arts", 20,
  "The wall was plastered with clay mixed with rice husk and gum, then lime-coated; outlines were drawn first and colours filled in afterwards.\nAnswer: (c)", pattern=S2, theme="Ajanta painting technique")

Q(141, "Which of the following statements with regard to the Square Kilometer Array (SKA) project is/are correct?\n\n1. SKA is a state of the art, mega science international facility to build the world's biggest and most sensitive radio telescope for addressing a wide variety of cutting-edge science goals.\n2. The Government of India has accorded its approval for India's participation in the international mega science project.\n\nSelect the answer using the code given below:",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", CA + "Science & Technology > Science Institutions & Programmes", 15,
  "SKA will be the world's largest radio telescope, and the Union Cabinet approved India's participation (Rs 1,250 crore) in December 2023.\nAnswer: (c)", pattern=S2, theme="Square Kilometre Array")

Q(142, "Exercise Desert Cyclone is a joint military exercise between India and:", ["Kuwait", "Saudi Arabia", "United Arab Emirates", "Oman"], "C", CA + "Defence & Security > Military Exercises", 10,
  "Desert Cyclone is the India-UAE army exercise (first edition January 2024, Rajasthan).\nAnswer: (c)", theme="Exercise Desert Cyclone")

Q(143, "Which of the following statements with regard to the constitution of Finance Commission is/are correct?\n\n1. The Government of India has recently constituted the Sixteenth Finance Commission under the Chairmanship of Dr. Arvind Panagariya.\n2. Finance Commission is constituted in pursuance to Article 263 of the Constitution of India.\n\nSelect the answer using the code given below:",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", "Polity > Constitutional & Statutory Bodies > Constitutional Bodies", 15,
  "The 16th Finance Commission was constituted on 31 December 2023 under Arvind Panagariya. Finance Commissions are set up under Article 280; Article 263 concerns the Inter-State Council.\nAnswer: (a)", pattern=S2, theme="16th Finance Commission")

Q(144, "Recently the Ministry of Environment, Forest and Climate Change has submitted three nominations from India for Wetland City Accreditation (WCA) under the Ramsar Convention on Wetlands. Which one among the following cities is *not* one among them?",
  ["Indore", "Bhopal", "Udaipur", "Jodhpur"], "D", CA + "Environment & Ecology > Environmental Governance", 20,
  "India nominated Indore, Bhopal and Udaipur for Wetland City Accreditation.\nAnswer: (d)", theme="Wetland City Accreditation")

Q(145, "Which of the following statements is/are correct?\n\n1. In India, 12th March is celebrated as the National Youth Day.\n2. National Youth Day is celebrated to commemorate the birth anniversary of Swami Vivekananda.\n\nSelect the answer using the code given below:",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "B", CA + "Polity & Governance > Important Days & Government Themes", 5,
  "National Youth Day is 12 January, Swami Vivekananda's birth anniversary.\nAnswer: (b)", pattern=S2, theme="National Youth Day")

Q(146, "Consider the following statements about *INS Sagardhwani*:\n\n1. It is an oceanographic research vessel of Naval Physical and Oceanographic Laboratory (NPOL) of DRDO.\n2. Recently it embarked on the Sagar Maitri Mission-4 to establish long-term scientific partnerships with Indian Ocean Rim countries in Ocean Research and Development.\n\nWhich of the statements given above is/are correct?",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", CA + "Defence & Security > Defence Institutions & Agreements", 15,
  "INS Sagardhwani is NPOL's (DRDO) oceanographic research vessel and sailed on Sagar Maitri Mission-4 in December 2023.\nAnswer: (c)", pattern=S2, theme="INS Sagardhwani")

Q(147, "Who among the following is the Chairman of the Committee constituted by the Government of India to examine the issue of holding simultaneous elections in the country and to make recommendations thereon?",
  ["Union Home Minister Shri Amit Shah", "Chief Justice of India Shri Dhananjaya Yeshwant Chandrachud", "Former President of India Shri Ram Nath Kovind", "Chief Election Commissioner of India Shri Rajiv Kumar"], "C", CA + "Polity & Governance > Government & Administration", 5,
  "The High-Level Committee on One Nation, One Election (2023) was chaired by Ram Nath Kovind.\nAnswer: (c)", theme="Simultaneous elections committee")

Q(148, "In January 2024, India's first all-girls' Sainik School was inaugurated at:", ["Bhopal", "Kohima", "Vrindavan", "Namsai"], "C", CA + "Social Sector & Human Development > Education", 10,
  "Samvid Gurukulam Girls' Sainik School at Vrindavan (Mathura) was inaugurated in January 2024.\nAnswer: (c)", theme="First all-girls Sainik School")

Q(149, "In February 2024, Government of India has decided to scrap the Free Movement Regime (FMR) between India and:", ["Myanmar", "Bhutan", "Bangladesh", "Nepal"], "A", CA + "International Relations > Bilateral Relations", 5,
  "The FMR on the India-Myanmar border was scrapped in February 2024.\nAnswer: (a)", theme="Free Movement Regime")

Q(150, "Who among the following is the author of the book *Why Bharat Matters*?", ["L.K. Advani", "S. Jaishankar", "Mohan Bhagwat", "Pranab Mukherjee"], "B", CA + "Culture & Heritage > Literature & Books", 5,
  "Why Bharat Matters (2024) is by External Affairs Minister S. Jaishankar.\nAnswer: (b)", theme="Why Bharat Matters")
