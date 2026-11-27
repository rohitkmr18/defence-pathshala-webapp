from qfmt import Q, P, F, W

# NDA II 2024 GAT, Set A (SURN-A-GAT), Part B General Knowledge, Q51-150
PH = "Science & Technology > Physics > "
CH = "Science & Technology > Chemistry > "
BI = "Science & Technology > Biology/Life Sciences > "
PG = "Geography > Physical Geography > "
IG = "Geography > Indian Geography > "
MH = "History > Modern History > "
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"
S4 = "4-Statement Combination"
MT = "Match the Following"
FIG = "/pyq-figures/nda-2024-ii-gat"

Q(51, "Which one of the following statements about lysosomes is NOT correct?",
  ["They are waste disposal system of the cell", "They breakdown all inorganic materials", "These are also referred to as \"suicidal bags\"", "Lysosomes stop entry of foreign materials"], "D",
  BI + "Cytology & Cell Architecture", 30,
  "Lysosomes digest worn-out organelles and foreign material that has already entered the cell (NCERT: they break down foreign material such as bacteria and food). They do not stop entry; that is the cell membrane's role. NCERT does say lysosomes break down organic material, so (b) is also loosely worded.\nAnswer: (d)", theme="Lysosome functions")
F(51, "(b) 'all inorganic materials' also inaccurate; DP picks (d)")

Q(52, "Which of the following two cell organelles have their own genetic material?",
  ["Endoplasmic reticulum and plastids", "Endoplasmic reticulum and mitochondria", "Mitochondria and plastids", "Lysosomes and Golgi apparatus"], "C", BI + "Cytology & Cell Architecture", 10,
  "Mitochondria and plastids have their own DNA and ribosomes.\nAnswer: (c)", theme="Organelles with DNA")

Q(53, "Which one among the following tissues help to connect two bones?", ["Tendons", "Ligaments", "Areolar tissue", "Cartilage"], "B", BI + "Animal Histology & Cell Types", 10,
  "Ligaments join bone to bone; tendons join muscle to bone.\nAnswer: (b)", theme="Ligaments")

Q(54, "Which one among the following is the source of energy in cells?", ["ADP", "ATP", "AMP", "NAD"], "B", BI + "Biomolecules, Enzymes & Bioenergetics", 5,
  "ATP is the energy currency of the cell.\nAnswer: (b)", theme="ATP")

Q(55, "In which one among the following the vegetative propagation takes place through Eye Buds?", ["Potato", "Ginger", "Onion", "Sugarcane"], "A", BI + "Plant Anatomy, Transport & Physiology", 10,
  "Potato tubers carry 'eyes' (buds) that grow into new plants.\nAnswer: (a)", theme="Eyes of a potato")

Q(56, "The intermixing of particles of two different types of matter on their own is called", ["Osmosis", "Brownian motion", "Diffusion", "Conductance"], "C", CH + "States of Matter & Phase Behaviour", 5,
  "Spontaneous intermixing of particles is diffusion.\nAnswer: (c)", theme="Diffusion")

Q(57, "Which one among the following separation techniques is used for blood tests in diagnostic laboratories?", ["Filtration", "Chromatography", "Centrifugation", "Crystallization"], "C", CH + "Separation Techniques & Purification", 10,
  "Centrifugation separates blood cells from plasma for tests.\nAnswer: (c)", theme="Centrifugation")

Q(58, "Which one among the following elements is polyatomic?", ["Phosphorus", "Sulphur", "Chlorine", "Aluminium"], "B", CH + "Chemical Composition & Classification", 30,
  "Atomicity: P$_4$ (tetra-atomic), S$_8$ (polyatomic), Cl$_2$ (diatomic), Al (monatomic). NCERT classes atomicity 4 as tetra-atomic and more than 4 as polyatomic, so sulphur is the polyatomic one.\nAnswer: (b)", theme="Atomicity")
F(58, "Phosphorus (P4) is also sometimes called polyatomic; NCERT table makes sulphur the answer")

Q(59, "Which of the following anions has a valency of $-3$?", ["Nitride", "Nitrate", "Sulphide", "Sulphate"], "A", CH + "Chemical Composition & Classification", 10,
  "Nitride is N$^{3-}$; nitrate is NO$_3^-$, sulphide S$^{2-}$, sulphate SO$_4^{2-}$.\nAnswer: (a)", theme="Nitride ion")

Q(60, "The mass of 0.5 mole of N$_2$ gas is", ["7 g", "14 g", "21 g", "28 g"], "B", CH + "Chemical Reactions, Stoichiometry & Energetics", 5,
  "$0.5\\times28=14$ g.\nAnswer: (b)", theme="Mole to mass")

Q(61, "The chemical reaction $\\mathrm{2AgCl(s)\\to2Ag(s)+Cl_2(g)}$ takes place", ["in dark", "in sunlight", "on heating", "under high pressure"], "B", CH + "Chemical Reactions, Stoichiometry & Energetics", 5,
  "Silver chloride decomposes in sunlight (photolytic decomposition), used in photography.\nAnswer: (b)", theme="Photolytic decomposition")

Q(62, "Which one among the following is commonly used as an 'anti-skinning agent' in paints?", ["Gelatin", "N-methyl pyrrolidone", "Pyridine", "Polyhydroxy phenol"], "D", CH + "Industrial, Materials & Applied Chemistry", 45,
  "Anti-skinning agents are antioxidants that stop a skin forming on paint; phenolic antioxidants (polyhydroxy phenols such as hydroquinone) and oximes are used.\nAnswer: (d)", theme="Anti-skinning agents")
F(62, "Common answer keys vary; DP picks polyhydroxy phenol")

Q(63, "Two resistances of 5.0 Ω and 7.0 Ω are connected in series and the combination is connected in parallel with a resistance of 36.0 Ω. The equivalent resistance of the combination of three resistors is",
  ["24.0 Ω", "12.0 Ω", "9.0 Ω", "6.0 Ω"], "C", PH + "Electricity & Electric Circuits", 15,
  "Series: 12 Ω. Parallel with 36 Ω: $\\dfrac{12\\times36}{48}=9$ Ω.\nAnswer: (c)", theme="Series-parallel combination")

Q(64, f"Shown in the figure are two hollow cubes $C_1$ and $C_2$ of negligible mass partially filled (depicted by darkened area) with liquids of densities $\\rho_1$ and $\\rho_2$, respectively, floating in water (density $\\rho_W$). The relationship between $\\rho_1$, $\\rho_2$ and $\\rho_W$ is\n\n![Two cubes floating in water; C2 sinks deeper and holds less liquid above the waterline than C1]({FIG}/q64.png)",
  [r"$\rho_2<\rho_W<\rho_1$", r"$\rho_2<\rho_1<\rho_W$", r"$\rho_1<\rho_2<\rho_W$", r"$\rho_1<\rho_W<\rho_2$"], "D", PH + "Fluid Mechanics & Properties of Fluids", 45,
  "For a floating cube of negligible mass, the weight of the liquid inside equals the weight of water displaced. In $C_1$ the liquid column is taller than the submerged depth, so $\\rho_1<\\rho_W$. In $C_2$ the submerged depth is greater than the liquid column, so $\\rho_2>\\rho_W$.\nAnswer: (d)", theme="Floating cubes with liquids")
F(64, "Figure-dependent; check reading of liquid levels")

Q(65, "An astronaut whose weight on the Earth is 600 N experiences weightlessness on International Space Station orbiting around the Earth. It means that",
  ["acceleration of the astronaut is zero", "normal reaction of the space-station floor on the astronaut is zero", "gravitational pull of earth on the astronaut is zero", "space station applies a centrifugal force on the astronaut"], "B",
  PH + "Classical Mechanics, Motion & Gravitation", 20,
  "In orbit both the astronaut and the station are in free fall, so the floor exerts no normal force. Gravity still acts and provides the centripetal acceleration.\nAnswer: (b)", theme="Weightlessness in orbit")

Q(66, """Which of the following statements give characteristics of contact forces?

1. It appears between an object when it is in contact with some other object
2. It satisfies the third law of motion
3. It may appear between a pair of solid and fluid

Select the answer using the code given below:""", ["1 and 3 only", "2 and 3 only", "1 and 2 only", "1, 2 and 3"], "D", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "Contact forces act on touching bodies, come in action-reaction pairs, and include forces between solids and fluids (buoyancy, viscous drag).\nAnswer: (d)", pattern=S3, theme="Contact forces")

Q(67, f"Which one among the following figures correctly represents the ray diagram? (Consider the lens to be thin)\n\n![Four ray diagrams (a) to (d) through a convex lens]({FIG}/q67.png)",
  ["Figure (a)", "Figure (b)", "Figure (c)", "Figure (d)"], "D", PH + "Geometrical & Physical Optics", 40,
  "(a) Rays from a point at $f$ should emerge parallel, not converge to $f$. (c) Rays from $2f$ should converge to $2f$, not emerge parallel. In (d), the ray from the object top passing through the front focus emerges parallel to the axis, and the image forms inverted at $2f$ on the other side: correct.\nAnswer: (d)", theme="Ray diagrams for a convex lens")
F(67, "Figure-dependent; (b) vs (d) distinction relies on the ray through f")

Q(68, "Lightning is due to",
  ["The flow of charges between different parts of the cloud", "The short-circuiting of charges between the upper and lower surfaces of the cloud",
   "The collection of positively charged particles on the base and collection of negatively charged particles at the top of the cloud", "The induction of positive charge on the ground below the negative charge at the base of the cloud"], "D",
  PH + "Electricity & Electric Circuits", 40,
  "NCERT: negative charges collect at the lower edge of the cloud and positive charges are induced on the ground; when the accumulation becomes very large, the air no longer insulates and lightning strikes. Charge flow within clouds (a) also produces lightning, but the textbook cause is the cloud-ground charge separation.\nAnswer: (d)", theme="Cause of lightning")
F(68, "(a) also defensible; DP follows NCERT (d)")

Q(69, f"In which one among the following situations, the bulb would glow the most? (Consider all batteries are the same)\n\n![Circuits: (a) one cell, two bulbs in series; (b) two cells, two bulbs in series; (c) one cell, one bulb; (d) two cells, two bulbs in parallel]({FIG}/q69.png)",
  ["Circuit (a)", "Circuit (b)", "Circuit (c)", "Circuit (d)"], "D", PH + "Electricity & Electric Circuits", 25,
  "In (d) each bulb gets the full voltage of two cells ($2V$). In (b) each bulb gets $V$, in (c) $V$, in (a) $V/2$.\nAnswer: (d)", theme="Brightness of bulbs")

Q(70, f"Which one among the following diagrams may correctly represent the motion of a skydiver during a jump?\n\n![Four speed-time graphs (a) to (d)]({FIG}/q70.png)",
  ["Graph (a)", "Graph (b)", "Graph (c)", "Graph (d)"], "A", PH + "Classical Mechanics, Motion & Gravitation", 30,
  "Speed rises and levels off at terminal velocity (air resistance grows), then drops sharply when the parachute opens to a new, low terminal speed. Graph (a) shows this.\nAnswer: (a)", theme="Skydiver speed-time graph")

Q(71, f"Which one of the following sketches correctly describes a lever of second class?\n\n![Four lever sketches (a) to (d)]({FIG}/q71.png)",
  ["Sketch (a)", "Sketch (b)", "Sketch (c)", "Sketch (d)"], "C", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "In a second-class lever the load is between the fulcrum and the effort (as in a wheelbarrow). Sketch (c) shows fulcrum at one end, effort at the other end and load in between.\nAnswer: (c)", theme="Classes of levers")

Q(72, f"For an electric circuit given below, the correct combination of voltage ($V$) and current ($I$) is\n\n![100 Ω (with voltmeter across it and ammeter reading 3 A), 200 Ω and 300 Ω in parallel; total current I]({FIG}/q72.png)",
  ["$V=900$ V; $I=18$ A", "$V=300$ V; $I=5.5$ A", "$V=600$ V; $I=1$ A", "$V=300$ V; $I=2$ A"], "B", PH + "Electricity & Electric Circuits", 25,
  "$V=3\\times100=300$ V across all three. Currents: 3 A, 1.5 A and 1 A, so $I=5.5$ A.\nAnswer: (b)", theme="Parallel circuit")

Q(73, "Taxila was the capital of which one among the following Mahajanapadas of ancient India?", ["Kuru", "Kasi", "Gandhar", "Avanti"], "C", "History > Ancient History > Mahajanapadas & Magadha", 10,
  "Taxila (Takshashila) was the capital of Gandhara.\nAnswer: (c)", theme="Gandhara")

Q(74, "Who among the following was the last Governor-General of India before the office was permanently abolished?", ["Lord Mountbatten", "Chakravarti Rajagopalachari", "Lord Wavell", "Lord Linlithgow"], "B", MH + "Independence & Partition", 10,
  "C. Rajagopalachari was Governor-General from 1948 until the office ended in January 1950.\nAnswer: (b)", theme="Last Governor-General")

Q(75, """Which among the following is/are the objective(s) of setting up of Planning Commission in the 1950s in India?

1. To increase production and offering opportunities to all for employment
2. To make assessment of all resources of the country

Select the answer using the code given below:""", ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Economy > Development & Welfare > Economic Planning", 20,
  "The 1950 resolution set the aims of raising production, offering employment to all, and assessing the country's material, capital and human resources.\nAnswer: (c)", pattern=S2, theme="Planning Commission objectives")

Q(76, """Which among the following statements with regard to Five Year Plans in India is/are correct?

1. The First and Ninth five year plans accorded high priority to agriculture
2. The Third Plan was based on the Harrod-Domar Model
3. Seventh Plan focused on food, work and productivity
4. The Ninth five year plan emphasized on massive investments in public sector

Select the answer using the code given below:""", ["1 only", "1 and 3", "3 and 4", "1, 2 and 4"], "B", "Economy > Development & Welfare > Economic Planning", 30,
  "The First Plan (Harrod-Domar based) and Ninth Plan prioritised agriculture; the Seventh Plan's slogan was food, work and productivity. The Third Plan was not Harrod-Domar based and the Ninth Plan did not stress massive public-sector investment.\nAnswer: (b)", pattern=S4, theme="Five Year Plans")

Q(77, """Before the inception of the First Five year Plan, which among the following Plans were initiated in India?

1. Bombay Plan
2. Peoples Plan
3. Sarvodaya Plan
4. Gandhian Plan

Select the answer using the code given below:""", ["1 and 2 only", "1 and 3 only", "3 and 4 only", "1, 2, 3 and 4"], "D", "Economy > Development & Welfare > Economic Planning", 20,
  "Bombay Plan (1944), Gandhian Plan (1944), People's Plan (1945) and Sarvodaya Plan (1950) all came before the First Plan (1951).\nAnswer: (d)", pattern=S4, theme="Pre-independence plans")

Q(78, "Any land that is left fallow for more than five years is termed as", ["Current fallow", "Fallow other than current fallow", "Culturable waste land", "Barren and waste land"], "C", "Geography > Human Geography > Economic Geography", 15,
  "NCERT: land left uncultivated for more than five years is culturable waste-land.\nAnswer: (c)", theme="Land-use categories")

Q(79, "Which statement is NOT correct with reference to Andaman and Nicobar Islands?",
  ["Climate is humid, tropical coastal climate", "Maximum rainfall occurs between March and April", "Andaman and Nicobar islands are separated by 10 degree Channel which is 150 Km wide", "Islands are inhabited by Negrito tribes"], "B",
  IG + "Physiography of India", 25,
  "The islands get most rain from the south-west and north-east monsoons (May to December), not in March-April.\nAnswer: (b)", theme="Andaman and Nicobar Islands")

Q(80, "Which one among the following local winds is NOT related to Mediterranean Sea?", ["Harmattan", "Khamsin", "Sirocco", "Mistral"], "A", "Geography > Physical Geography > Atmospheric Circulation", 20,
  "Harmattan is a dry wind over West Africa. Khamsin, Sirocco and Mistral blow across or into the Mediterranean region.\nAnswer: (a)", theme="Local winds")

Q(81, "Which one among the following is a landlocked water body?", ["Mediterranean Sea", "Black Sea", "Red Sea", "Caspian Sea"], "D", "Geography > World Geography > World Rivers, Seas & Waterways", 5,
  "The Caspian Sea has no outlet to the ocean.\nAnswer: (d)", theme="Caspian Sea")

Q(82, "Which one among the following statements with reference to Benguela current is NOT correct?",
  ["It influences the climate of the West coast of North Africa", "It is a cold current", "Its direction is from South to North", "It flows in the Atlantic Ocean"], "A", PG + "Oceanography", 15,
  "The Benguela current is a cold, northward current off south-west Africa (Namibia), not North Africa (that is the Canaries current).\nAnswer: (a)", theme="Benguela current")

Q(83, "The lowest part of most bolsons is occupied by a landform called playa. Which category of landform formation does it represent?", ["Fluvial landforms", "Arid landforms", "Glacial landforms", "Periglacial landforms"], "B",
  PG + "Geomorphology & Earth Surface Processes", 15,
  "Playas are desert basin floors, an arid landform.\nAnswer: (b)", theme="Playas")

Q(84, "Which one among the following diseases is caused due to deficiency of Vitamin D in humans?", ["Beriberi", "Scurvy", "Rickets", "Pneumonia"], "C", BI + "Human Pathology, Immunology & Deficiency Diseases", 5,
  "Vitamin D deficiency causes rickets.\nAnswer: (c)", theme="Rickets")

Q(85, "Which one among the following combinations most appropriately represent the components of balanced diet?",
  ["Carbohydrate, vitamins, proteins, fat, minerals, fibres and water", "Carbohydrate, vitamins, proteins, fat and minerals", "Carbohydrate, vitamins, proteins, minerals and water", "Vitamins, proteins, fat, minerals, fibres and water"], "A",
  BI + "Human Anatomy & Systemic Physiology", 5, "A balanced diet includes all nutrients plus roughage and water.\nAnswer: (a)", theme="Balanced diet")

Q(86, "In which part or organ of human body cartilage is NOT found?", ["Nose", "Trachea", "Bronchiole", "Knee joint"], "C", BI + "Human Anatomy & Systemic Physiology", 25,
  "Bronchioles lack cartilage rings; the trachea and bronchi have them.\nAnswer: (c)", theme="Cartilage in airways")

Q(87, "Which part of nephron of the human kidney is responsible for filtration of blood for excretion?", ["Collecting duct", "Renal vein", "Ureter", "Bowman's capsule"], "D", BI + "Human Anatomy & Systemic Physiology", 10,
  "Glomerular filtration takes place in Bowman's capsule.\nAnswer: (d)", theme="Bowman's capsule")

Q(88, "Organisms of which of the following phylum are called sponges?", ["Coelenterata", "Platyhelminthes", "Porifera", "Echinodermata"], "C", BI + "Biological Classification & Diversity", 5,
  "Sponges belong to Porifera.\nAnswer: (c)", theme="Porifera")

Q(89, "A point object is placed at the centre of curvature of a spherical concave mirror. Which one among the following would be the correct location of image formed?", ["At infinity", "At the centre of curvature", "At the focal point", "Between the focal point and the centre of curvature"], "B",
  PH + "Geometrical & Physical Optics", 10, "An object at C forms its image at C.\nAnswer: (b)", theme="Object at centre of curvature")

Q(90, "Which one among the following is correct for a person suffering from myopia?",
  ["The person can see near objects clearly", "The person can see distant objects clearly", "The person cannot distinguish colours", "The person can neither see near objects nor distant objects clearly"], "A",
  PH + "Geometrical & Physical Optics", 5, "A myopic person sees near objects clearly but not distant ones.\nAnswer: (a)", theme="Myopia")

Q(91, "A vehicle starts moving along a straight line path from rest. In first $t$ seconds it moves with an acceleration of 2 m/s$^{2}$ and then in next 10 seconds it moves with an acceleration of 5 m/s$^{2}$. The total distance travelled by the vehicle is 550 m. The value of time $t$ is",
  ["10 s", "13 s", "20 s", "25 s"], "A", PH + "Classical Mechanics, Motion & Gravitation", 30,
  "Stage 1: $t^2$ m, final speed $2t$. Stage 2: $2t\\cdot10+\\frac12\\cdot5\\cdot100=20t+250$. So $t^2+20t+250=550$, $t=10$ s.\nAnswer: (a)", theme="Two-stage motion")

Q(92, "A pumpkin weighs 7.5 N. On submerging it completely in water, $\\frac34$ L of water gets displaced. The acceleration due to gravity at the place where the pumpkin was weighed is 10 m/s$^{2}$. Which one of the following is the correct value of the density of the pumpkin?",
  ["10 kg/m$^{3}$", "100 kg/m$^{3}$", "1000 kg/m$^{3}$", "10000 kg/m$^{3}$"], "C", PH + "Fluid Mechanics & Properties of Fluids", 20,
  "Mass 0.75 kg, volume $0.75\\times10^{-3}$ m$^3$: density 1000 kg/m$^3$.\nAnswer: (c)", theme="Density from displacement")

Q(93, "An incandescent electric bulb converts 20% of its power consumption into light, and the remaining power is dissipated as heat. The bulb's filament has a resistance of 200 Ω and 2 A current flows through it. If the bulb remains ON for 10 h and the rate of electricity charge is ₹5/unit, then which among the following is the correct amount for the money spent on producing light?",
  ["₹5", "₹6", "₹7", "₹8"], "D", PH + "Electricity & Electric Circuits", 30,
  "$P=I^2R=800$ W; in 10 h, 8 kWh costing ₹40. Light is 20%: ₹8.\nAnswer: (d)", theme="Cost of electrical energy")

Q(94, "Which one of the following statements best defines the concept of heat?",
  ["The transformation of energy from one form to another", "The conversion of energy into mass and vice-versa due to temperature difference", "The transfer of energy due to temperature difference", "The change in volume of a substance with temperature"], "C",
  PH + "Thermodynamics, Heat & Kinetic Theory", 10, "Heat is energy in transit because of a temperature difference.\nAnswer: (c)", theme="Definition of heat")

Q(95, "The masses of two planets are in the ratio of 1 : 7. The ratio between their diameters is 2 : 1. The ratio of forces which they exert on each other is", ["1 : 7", "7 : 1", "1 : 1", "2 : 1"], "C",
  PH + "Classical Mechanics, Motion & Gravitation", 15, "By Newton's third law the mutual gravitational forces are equal.\nAnswer: (c)", theme="Mutual gravitational forces")

Q(96, "A car weighs 1000 kg. It is moving with a uniform velocity of 72 km/h towards a straight road. The driver suddenly presses the brakes. The car stops in 0.2 s. The retarding force applied on the car to stop it is", ["100 N", "1000 N", "10 kN", "100 kN"], "D",
  PH + "Classical Mechanics, Motion & Gravitation", 15, "$72$ km/h $=20$ m/s; $a=100$ m/s$^2$; $F=1000\\times100=10^5$ N.\nAnswer: (d)", theme="Retarding force")

Q(97, "There is a ball of mass 320 g. It has 625 J potential energy when released freely from a height. The speed with which it will hit the ground is", ["62.5 m/s", "2.0 m/s", "50 m/s", "40 m/s"], "A",
  PH + "Classical Mechanics, Motion & Gravitation", 15, "$\\frac12(0.32)v^2=625$ gives $v^2=3906.25$, $v=62.5$ m/s.\nAnswer: (a)", theme="Energy conservation")

Q(98, "Starting from rest a vehicle accelerates at the rate of 2 m/s$^{2}$ towards east for 10 s. It then stops suddenly. It then accelerates again at a rate of $4\\sqrt2$ m/s$^{2}$ for next 10 s towards south and then again comes to rest. The net displacement of the vehicle from the starting point is",
  ["100 m", "200 m", "300 m", "400 m"], "C", PH + "Classical Mechanics, Motion & Gravitation", 30,
  "East: $\\frac12\\cdot2\\cdot100=100$ m. South: $\\frac12\\cdot4\\sqrt2\\cdot100=200\\sqrt2$ m. Net $=\\sqrt{100^2+80000}=300$ m.\nAnswer: (c)", theme="Resultant displacement")

Q(99, "Which one of the following statements about the Industrial Revolution is correct?",
  ["Thomas Savery invented astrolabe", "Thomas Newcomen invented chemical dyes", "James Watt's invention converted the steam engine from being a mere pump into one which would provide energy to power machines in factories", "Mathew Boulton discovered the technique of refining gold of impurities"], "C",
  "History > World History > Industrial Revolution", 15,
  "Watt's improvements turned the steam engine from a mine pump into a prime mover for factories. Savery and Newcomen built early steam pumps; Boulton was Watt's business partner.\nAnswer: (c)", theme="Watt's steam engine")

Q(100, "The first cotton mill in British India which began production in 1856 was set up by", ["Ghanshyam Das Birla", "Jamnalal Bajaj", "Ambalal Sarabhai", "C. N. Davar"], "D", MH + "Colonial Economy", 15,
  "Cowasji Nanabhai Davar set up the first cotton mill in Bombay (production from 1856).\nAnswer: (d)", theme="First cotton mill")

Q(101, """Consider the following statements about the Linguistic Reorganization of the States:

1. Gandhiji, in 1948, had argued for the reorganization of provinces on a linguistic basis
2. The Constituent Assembly recommended it to be incorporated in the Constitution of India

Which of the statements given above is/are correct?""", ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", MH + "Post-Independence India", 40,
  "Gandhi supported linguistic provinces, writing in favour of them shortly before his death in January 1948. The Constituent Assembly's Dar Commission (1948) advised against reorganisation on a linguistic basis, so it was not incorporated.\nAnswer: (a)", pattern=S2, theme="Linguistic reorganisation")
F(101, "Statement 1 date-sensitive; DP picks (a)")

Q(102, "Inspired by the Dandi March by Mahatma Gandhi, in Tamilnadu, C Rajagopalachari led a salt march from",
  ["Tirunelveli to Nagercoil", "Kanchipuram to Mahabalipuram", "Trichinopoly to Vedaranniyam on Tanjore coast", "Chennai to Vellore"], "C", MH + "Gandhian Movements", 10,
  "Rajagopalachari marched from Trichinopoly to Vedaranyam in April 1930.\nAnswer: (c)", theme="Vedaranyam salt march")

Q(103, "Acharya Vinoba Bhave received the first donation of land under the Bhoodan Movement at", ["Ramgarh", "Garhwa", "Hyderabad", "Pochampally"], "D", MH + "Post-Independence India", 10,
  "The first Bhoodan gift was at Pochampally (Telangana) in April 1951.\nAnswer: (d)", theme="First Bhoodan gift")

Q(104, "Maize (makka) was introduced into India via", ["America and England", "Africa and Spain", "France and Russia", "Portugal and Italy"], "B", "History > Medieval History > Society, Economy & Technology", 20,
  "NCERT (Themes in Indian History II): maize came to India via Africa and Spain.\nAnswer: (b)", theme="Introduction of maize")

Q(105, """Which of the following pairs of Himalayan Passes and the Ranges in which they are located is/are correctly matched?

1. Zoji La — Great Himalayas
2. Banihal Pass — Pir Panjal Range
3. Photu La — Ladakh Range
4. Khardung La — Karakoram Range

Select the answer using the code given below:""", ["2 only", "4", "1 and 2 only", "1, 2 and 3"], "C", IG + "Himalayas, Mountains & Passes", 35,
  "Zoji La lies in the Great Himalaya (Zaskar axis) and Banihal in the Pir Panjal. Fotu La is in the Zaskar range and Khardung La in the Ladakh range.\nAnswer: (c)", pattern=S4, theme="Himalayan passes")

Q(106, "Which one among the following statements with reference to the black cotton soils of India is NOT correct?",
  ["The black cotton soils are also called 'Regur'", "They are highly moisture retentive", "They are rich in lime", "These soils have less clay factor and hence can support a wide variety of crops and vegetables"], "D",
  IG + "Indian Soils", 15, "Black soils are clayey (high clay content), which makes them sticky and moisture-retentive.\nAnswer: (d)", theme="Black soils")

Q(107, """Match List I with List II and select the correct answer using the code given below the Lists:

| List I (Hydroelectric Power Plant) | List II (State) |
|---|---|
| A. Doyang | 1. Arunachal Pradesh |
| B. Gomuti | 2. Assam |
| C. Kapili | 3. Tripura |
| D. Ranganadi | 4. Nagaland |

Code:""", ["A-4, B-3, C-2, D-1", "A-4, B-2, C-3, D-1", "A-1, B-2, C-3, D-4", "A-1, B-3, C-2, D-4"], "A", "Geography > Economic Geography > Industrial Geography", 30,
  "Doyang (Nagaland), Gumti (Tripura), Kopili (Assam), Ranganadi (Arunachal Pradesh).\nAnswer: (a)", pattern=MT, theme="North-east hydro projects")

Q(108, """Match List I with List II and select the correct answer using the code given below the Lists:

| List I (Tropical Cyclone) | List II (Country) |
|---|---|
| A. Hurricanes | 1. China |
| B. Willy Willy | 2. Philippines |
| C. Baguio | 3. Australia |
| D. Typhoons | 4. USA |

Code:""", ["A-4, B-3, C-2, D-1", "A-1, B-2, C-3, D-4", "A-4, B-2, C-3, D-1", "A-1, B-3, C-2, D-4"], "A", "Geography > Physical Geography > Atmospheric Circulation", 15,
  "Hurricanes (Atlantic, USA), willy-willies (Australia), baguios (Philippines), typhoons (China seas).\nAnswer: (a)", pattern=MT, theme="Names of cyclones")

Q(109, """Consider the following facts of the rivers of the Indus system:

1. The Satluj originates in Tibet where it is known as Langchen Khambab
2. The Satluj is a classic example of an antecedent river
3. The Jhelum is the largest tributary of the Indus System

Select the answer using the code given below:""", ["2 only", "3 only", "1 and 2", "2 and 3"], "C", IG + "Indian Drainage", 25,
  "NCERT: the Satluj (Langchen Khambab) rises near Rakas Lake in Tibet and is an antecedent river. The Chenab is the largest tributary of the Indus.\nAnswer: (c)", pattern=S3, theme="Indus tributaries")

Q(110, "Which one of the following is an example of both an igneous as well as a metamorphic rock?", ["Gabbro", "Geyserite", "Gneissoid", "Granite"], "D", PG + "Rocks & Minerals", 45,
  "Granite is a typical igneous rock, and NCERT's list of metamorphic rock examples ('gneissoid, granite, syenite, slate...') also includes granite. Gabbro is igneous only, geyserite sedimentary and gneissoid metamorphic.\nAnswer: (d)", theme="Igneous and metamorphic")
F(110, "Based on NCERT list; gneissoid is also arguable")

Q(111, "Which one of the following is correct?",
  ["Pyroxene is commonly found in meteorites", "Amphiboles form about 20% of the Earth's crust", "Quartz is soluble in water", "The word 'sedimentary' is derived from the Latin word kelimentum"], "A",
  PG + "Rocks & Minerals", 30,
  "NCERT: pyroxene forms 10% of the crust and is commonly found in meteorites. Amphiboles form about 7%, quartz is insoluble, and 'sedimentary' comes from the Latin sedimentum.\nAnswer: (a)", theme="Crustal minerals")

Q(112, "Which one among the following processes is NOT part of chemical weathering?", ["Solution", "Hydration", "Reduction", "Thawing"], "D", PG + "Geomorphology & Earth Surface Processes", 10,
  "Thawing (freeze-thaw) is a physical process; solution, hydration and oxidation-reduction are chemical.\nAnswer: (d)", theme="Chemical weathering")

Q(113, "What is the maximum number of electrons that can occupy the first shell of an atom?", ["2", "4", "8", "16"], "A", CH + "Atomic Structure, Isotopes & Periodicity", 5,
  "The K shell holds $2n^2=2$ electrons.\nAnswer: (a)", theme="K shell")

Q(114, "At which temperature does liquid water show maximum density?", ["299 K", "277 K", "285 K", "373 K"], "B", PH + "Thermodynamics, Heat & Kinetic Theory", 10,
  "Water is densest at 4°C, i.e. 277 K.\nAnswer: (b)", theme="Anomalous expansion of water")

Q(115, "Which one among the following has valency of 3?", ["Carbon", "Oxygen", "Nitrogen", "Sodium"], "C", CH + "Atomic Structure, Isotopes & Periodicity", 5,
  "Nitrogen (2, 5) needs 3 electrons: valency 3.\nAnswer: (c)", theme="Valency")

Q(116, "Which one among the following is an example of oxidation reaction?", ["Freezing of water", "Dissolving sugar in water", "Rusting of iron", "Boiling of petrol"], "C", CH + "Chemical Reactions, Stoichiometry & Energetics", 5,
  "Rusting is iron combining with oxygen.\nAnswer: (c)", theme="Rusting")

Q(117, "Which one among the following fertilizers is a source of nitrogen?", ["Superphosphate", "Potassium sulfate", "Bone meal", "Urea"], "D", CH + "Industrial, Materials & Applied Chemistry", 5,
  "Urea contains about 46% nitrogen.\nAnswer: (d)", theme="Nitrogen fertiliser")

Q(118, "For Aluminium (Al) (atomic number: 13, mass number: 27), which one among the following statements is NOT correct?",
  ["Number of electrons present in Al is 13", "Number of protons present in Al is 13", "Number of neutrons present in Al is 14", "The valency of Al is 2"], "D", CH + "Atomic Structure, Isotopes & Periodicity", 5,
  "Al (2, 8, 3) has valency 3.\nAnswer: (d)", theme="Aluminium atom")

Q(119, "The elemental composition of diamond is", ["Carbon and Hydrogen", "Carbon and Oxygen", "Pure Carbon", "Pure Silicon"], "C", CH + "Chemical Bonding & Molecular Structure", 5,
  "Diamond is an allotrope of carbon.\nAnswer: (c)", theme="Diamond")

Q(120, "Which one among the following is an example of chemical change?", ["Sublimation of camphor", "Melting of ice", "Heating of an iron rod", "Mixing of NaOH and HCl"], "D", CH + "Chemical Composition & Classification", 5,
  "Neutralisation forms new substances (NaCl and water).\nAnswer: (d)", theme="Neutralisation")

Q(121, "Which one among the following is the correct focal length of a combination of lenses of power 2.5 D and $-2.0$ D?", ["+0.5 m", "$-0.5$ m", "+2.0 m", "$-2.0$ m"], "C", PH + "Geometrical & Physical Optics", 10,
  "$P=0.5$ D, so $f=+2$ m.\nAnswer: (c)", theme="Lens combination")

Q(122, "The AC mains domestic supply current in India changes direction in every", ["50 s", "1/50 s", "100 s", "1/100 s"], "D", PH + "Electricity & Electric Circuits", 20,
  "At 50 Hz each cycle lasts 1/50 s and the current reverses twice per cycle, i.e. every 1/100 s.\nAnswer: (d)", theme="AC frequency")

Q(123, "A block of mass 2.0 kg slides on a rough horizontal plane surface. Let the speed of the block at a particular instant is 10 m/s. It comes to rest after travelling a distance of 20 m. Which one of the following could be the magnitude of the frictional force?",
  ["10 N", "20 N", "40 N", "50 N"], "A", PH + "Classical Mechanics, Motion & Gravitation", 35,
  "$v^2=2as$: $100=40a$, so $a=2.5$ m/s$^2$ and $F=2\\times2.5=5$ N. None of the options matches.\nAnswer: no option is correct (item withheld)", theme="Friction from stopping distance")
W(123, "Correct friction is 5 N; options are 10, 20, 40, 50 N.")

Q(124, """Given below are the four cases in which certain heat transfer is taking place:

1. Ice is melting in a glass full of water
2. Water is boiling in an open container
3. A metal rod is heated in a furnace
4. A cup of coffee is allowed to cool on a table

In which of the above cases, the Newton's Law of Cooling is applicable?""", ["1 only", "4 only", "1 and 4 only", "1, 2 and 3"], "B", PH + "Thermodynamics, Heat & Kinetic Theory", 25,
  "Newton's law describes a body cooling to its surroundings with small temperature differences and no phase change, as in the coffee cup.\nAnswer: (b)", pattern=S4, theme="Newton's law of cooling")

Q(125, "A skydiver is acted on by two forces: P acting downward and Q acting upward. Which one among the following statements is correct about the two forces?",
  ["Force P is caused by the gravity and force Q is caused by the friction", "When the force P is bigger than the force Q, the speed of the skydiver remains the same",
   "After the parachute opens, force P remains the same while force Q increases", "After the parachute opens, force P decreases while force Q increases"], "C",
  PH + "Classical Mechanics, Motion & Gravitation", 30,
  "P is the weight (unchanged) and Q is air resistance. Opening the parachute greatly increases air resistance while weight stays the same. ((a) is loosely true, since air resistance is a frictional force, but (c) is the intended statement.)\nAnswer: (c)", theme="Forces on a skydiver")
F(125, "(a) also arguably correct (air resistance = fluid friction); DP picks (c)")

Q(126, "Vijayanagara rulers claimed that they were ruling on behalf of", ["Lord Murugan", "Lord Venkateshwara", "Shri Virupaksha", "Shri Vallabha"], "C", "History > Medieval History > Vijayanagara & Deccan", 15,
  "NCERT: Vijayanagara rulers claimed to rule on behalf of the god Virupaksha.\nAnswer: (c)", theme="Virupaksha")

Q(127, "Domingo Paes describes a king in these words: 'Of medium height, and of fair complexion and good figure, rather fat than thin; he has on his face signs of smallpox'. Identify the king from the options given below.",
  ["Krishnadeva Raya", "Ram Raya", "Devaraya II", "Devaraya I"], "A", "History > Medieval History > Vijayanagara & Deccan", 15,
  "Paes visited Krishnadeva Raya's court and described him so (NCERT).\nAnswer: (a)", theme="Paes on Krishnadeva Raya")

Q(128, "In which Schedule of the Constitution of India, provisions as to disqualification on grounds of defection are given?", ["Ninth Schedule", "Tenth Schedule", "Eleventh Schedule", "Sixth Schedule"], "B", "Polity > Elections > Political Parties & Anti-Defection", 5,
  "The anti-defection law is in the Tenth Schedule (52nd Amendment, 1985).\nAnswer: (b)", theme="Tenth Schedule")

Q(129, """Consider the following statements:

1. The duties of the Attorney General of India are to give advice to the Government of India upon such legal matters, and to perform such other duties of a legal character, as may from time to time be referred to or assigned to him by the President of India
2. The Solicitor General of India is the secondary Law Officer of the country, who assists the Attorney General, and is himself assisted by several Additional Solicitor Generals of India

Which of the statements given above is/are correct?""", ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Polity > Union Executive > Attorney General & Constitutional Legal Officers", 20,
  "Statement 1 restates Article 76(2); statement 2 correctly describes the Solicitor General.\nAnswer: (c)", pattern=S2, theme="Law officers")

Q(130, """Which of the following Committees does NOT consist of Members from the Upper House of the Parliament?

1. Public Accounts Committee
2. Estimates Committee
3. Committee on Public Undertakings

Select the answer using the code given below:""", ["1 and 2", "1 and 3", "2 only", "3 only"], "C", "Polity > Legislature > Parliamentary Committees", 15,
  "The Estimates Committee has only Lok Sabha members; the PAC and COPU include Rajya Sabha members.\nAnswer: (c)", pattern=S3, theme="Estimates Committee")

Q(131, "In the passing of a Money Bill, the Rajya Sabha has limited powers in that it shall return the Bill, with or without any recommendation, within the stipulated time of", ["12 days", "21 days", "14 days", "30 days"], "C", "Polity > Legislature > Financial Procedure", 5,
  "Article 109: within 14 days.\nAnswer: (c)", theme="Money Bill")

Q(132, """Which of the following statements with regard to Article 19(1) of the Constitution of India is/are correct?

1. Freedoms under this Article are not absolute
2. Reasonable restrictions can be imposed on the exercise of freedoms under this Article

Select the answer using the code given below:""", ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Polity > Rights & Liberties > Freedom", 10,
  "Articles 19(2) to 19(6) allow reasonable restrictions, so the freedoms are not absolute.\nAnswer: (c)", pattern=S2, theme="Article 19 freedoms")

Q(133, "Which of the following is NOT a part of the five principles enshrined in the 'Panchsheel' agreement signed by India and China in 1954?", ["Mutual non-aggression", "Mutual non-interference", "Peaceful coexistence", "Cultural cooperation"], "D",
  "International Relations > International Political Concepts > Non-Aligned Movement", 10,
  "Cultural cooperation is not one of the five principles.\nAnswer: (d)", theme="Panchsheel")

Q(134, "Freedom Fighter Kanaklata Barua sacrificed her life while participating in", ["Rowlatt Satyagraha", "Non-Cooperation Movement", "Civil Disobedience Movement", "Quit India Movement"], "D", MH + "Indian National Movement", 15,
  "Kanaklata Barua was shot at Gohpur, Assam in September 1942 during the Quit India Movement.\nAnswer: (d)", theme="Kanaklata Barua")

Q(135, "Where is the Coriolis Effect the largest?", ["At the Equator", "At the Tropic of Capricorn and Tropic of Cancer", "At the North Pole", "At 45 degree latitude in each hemisphere"], "C", "Geography > Physical Geography > Atmospheric Circulation", 10,
  "The Coriolis force is proportional to $\\sin\\phi$: zero at the equator and greatest at the poles.\nAnswer: (c)", theme="Coriolis effect")

Q(136, """In which among the following states in India, the Sun rays are never perpendicular?

1. Bihar
2. Chhattisgarh
3. Manipur
4. Rajasthan

Select the answer using the code given below:""", ["1 and 2", "1 and 3", "2 and 3", "2 and 4"], "B", IG + "Political Geography of India", 30,
  "The overhead sun never goes north of the Tropic of Cancer. Bihar and Manipur lie wholly north of it, while the Tropic passes through Chhattisgarh and Rajasthan.\nAnswer: (b)", pattern=S4, theme="Tropic of Cancer")

Q(137, """Which of the following is/are east flowing rivers in India?

1. Palar
2. Periyar
3. Pennar
4. Kalinadi

Select the answer using the code given below:""", ["1 only", "1 and 3", "2 and 4", "4 only"], "B", IG + "Indian Drainage", 15,
  "The Palar and Pennar flow into the Bay of Bengal; the Periyar and Kalinadi flow west.\nAnswer: (b)", pattern=S4, theme="East-flowing rivers")

Q(138, """Which of the following tributaries is/are correctly matched with the Deccan Rivers?

| Tributary | River |
|---|---|
| 1. Bhavani | Krishna |
| 2. Kabini | Kaveri |
| 3. Manjra | Godavari |
| 4. Bhima | Mahanadi |

Select the answer using the code given below:""", ["1 and 2", "2 and 3", "1 and 3", "3 and 4"], "B", IG + "Indian Drainage", 20,
  "Kabini joins the Kaveri and Manjra the Godavari. Bhavani joins the Kaveri and Bhima the Krishna.\nAnswer: (b)", pattern=S4, theme="Peninsular tributaries")

Q(139, "Which one of the following is found in appreciable amount in Laterite soil in India?", ["Calcium", "Phosphate", "Potash", "Nitrogen"], "C", IG + "Indian Soils", 25,
  "NCERT: laterite soils are poor in nitrogen, phosphate and calcium, while iron oxide and potash are in excess.\nAnswer: (c)", theme="Laterite soil")

Q(140, """Consider the following statements regarding River Brahmaputra:

1. It rises in Tibet, near Lake Mansarovar
2. It takes a "U" turn near Namcha Barwa and enters India through a gorge

Which of the statements given above is/are correct?""", ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", IG + "Indian Drainage", 15,
  "NCERT: it rises in the Chemayungdung glacier near Mansarovar and, around Namcha Barwa, takes a U-turn into India through a gorge as the Siang/Dihang.\nAnswer: (c)", pattern=S2, theme="Brahmaputra")

Q(141, "\"Not me, but you\" is the motto of which one of the following youth organizations/schemes?", ["Rashtriya Yuva Sashaktikaran Karyakram", "National Service Scheme (NSS)", "National Young Leaders Programme", "National Discipline Scheme (NDS)"], "B",
  "Current Affairs > Social Sector & Human Development > Education", 15, "'Not Me But You' is the NSS motto.\nAnswer: (b)", theme="NSS motto")

Q(142, "\"Fitness ka dose, aadha ghanta roz\" campaign, is associated with", ["Khelo India", "Fit India Programme", "Mera Yuva Bharat", "Healthy Heart Programme"], "B", "Current Affairs > Polity & Governance > Government Schemes & Policies", 15,
  "It is the slogan of the Fit India Movement.\nAnswer: (b)", theme="Fit India slogan")

Q(143, """Consider the following statements:

1. Kozhikode has been included in UNESCO's creative cities network as the 'City of Music'
2. Garba of Gujarat has been declared by UNESCO as an intangible cultural heritage
3. Gwalior has been included in UNESCO's creative cities network as the 'City of Literature'

How many of the above statements is/are correct?""", ["None", "1", "2", "3"], "B", "Current Affairs > Culture & Heritage > Heritage", 30,
  "In 2023 Kozhikode became a City of Literature and Gwalior a City of Music (the statements swap them). Garba was inscribed in December 2023.\nAnswer: (b)", pattern="Statement Count", theme="UNESCO creative cities")

Q(144, "ASEAN-India Millet Festival-2023, organized by Indian Mission to ASEAN, was held in which one of the following countries?", ["India", "Indonesia", "Malaysia", "Thailand"], "B", "Current Affairs > International Relations > International Groupings", 25,
  "It was held in Jakarta, Indonesia, where India's Mission to ASEAN is based.\nAnswer: (b)", theme="ASEAN-India Millet Festival")

Q(145, """Consider the following statements:

1. First Indian Military Heritage festival was inaugurated in October 2023 in Pune
2. First Green Hydrogen Fuel Cell Bus was flagged off in India in Bangalore
3. South Africa chaired the 15th BRICS Summit held in 2023
4. Viksit Bharat Sankalp Yatra was flagged off in 2023 from Jharkhand

How many of the above statements is/are correct?""", ["1", "2", "3", "4"], "B", "Current Affairs > Polity & Governance > Government & Administration", 40,
  "The first Indian Military Heritage Festival (October 2023) was in New Delhi, and the first green hydrogen fuel cell bus was flagged off in New Delhi/Leh, not Bangalore. South Africa hosted the 15th BRICS summit, and the Viksit Bharat Sankalp Yatra began from Khunti, Jharkhand in November 2023.\nAnswer: (b)", pattern="Statement Count", theme="2023 events")
F(145, "Hydrogen bus location varies by source; DP counts 2 correct")

Q(146, """Which of the following statements about 'ULLAS' scheme is/are NOT correct?

1. It's a Centrally Sponsored scheme which aims at securing childhood for street children
2. It's a scheme aligned with National Education Policy-2020 which aims at empowering adults aged 15 or above who could not get due schooling

Select the answer using the code given below:""", ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", "Current Affairs > Social Sector & Human Development > Education", 25,
  "ULLAS (Understanding Lifelong Learning for All in Society) is the New India Literacy Programme for adults 15+, aligned with NEP 2020. It is not a street-children scheme.\nAnswer: (a)", pattern=S2, theme="ULLAS")

Q(147, "Which one of the following statements is NOT correct about NATO?",
  ["It was formed out of the signing of the Washington Treaty", "Russia is not a member of this organization", "It derives its authority from the UN Charter", "Finland is its latest member"], "D",
  "International Relations > International Organisations > UN System & Multilateral Institutions", 30,
  "Sweden joined in March 2024, after Finland (April 2023), so Finland is no longer the latest member. NATO's collective defence rests on Article 51 of the UN Charter.\nAnswer: (d)", theme="NATO membership")

Q(148, "In January 2024, India has entered into a bilateral agreement through which it will provide grant assistance to a country to construct a 20 feet Bailey bridge. Identify the country.", ["Nepal", "Bangladesh", "Bhutan", "Myanmar"], "A",
  "Current Affairs > International Relations > Bilateral Relations", 40,
  "In January 2024 India signed an agreement with Nepal to build a Bailey bridge with Indian grant assistance.\nAnswer: (a)", theme="Bailey bridge grant")
F(148, "Could not verify from search; DP key Nepal per common keys")

Q(149, "Which one among the following Joint Military Exercises was NOT conducted between India and USA?", ["Yudhabhyas", "Vajra Prahar", "Malabar", "Varuna"], "D", "Current Affairs > Defence & Security > Military Exercises", 10,
  "Varuna is the India-France naval exercise.\nAnswer: (d)", theme="India-US exercises")

Q(150, """Consider the following statements:

1. India has secured 10th rank in International Shipment category in World Bank's Logistics Performance Index Report-2023
2. Global Maritime India Summit-2023 was held in Vishakhapatnam
3. 'Maritime Amrit Kaal Vision 2047' was launched during Global Maritime India Summit-2023

How many of the above statements is/are correct?""", ["None", "1", "2", "3"], "B", "Current Affairs > Economy & Finance > Infrastructure & Connectivity", 35,
  "India ranked 22nd in international shipments in LPI 2023, and GMIS 2023 was held in Mumbai. The Maritime Amrit Kaal Vision 2047 was launched at GMIS 2023.\nAnswer: (b)", pattern="Statement Count", theme="Maritime developments 2023")
