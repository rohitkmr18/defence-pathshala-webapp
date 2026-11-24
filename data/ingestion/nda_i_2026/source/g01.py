from qfmt import Q, F

# NDA I 2026 General Ability Test, Set A (NPSS-B-TGA/65A), Part B General Knowledge, Q51-150
FIG = "/pyq-figures/nda-2026-i-gat"
SC = "Select the correct answer using the code given below."
PH = "Science & Technology > Physics > "
CH = "Science & Technology > Chemistry > "
BI = "Science & Technology > Biology/Life Sciences > "
S2, S3, S4 = "2-Statement Combination", "3-Statement Combination", "4-Statement Combination"
CNT, MT, CHR = "Statement Count", "Match the Following", "Chronology"
I2 = ["I only", "II only", "Both I and II", "Neither I nor II"]

F(68, "Liquid filling does not change mirror orientation; DP key 'unchanged'")
F(75, "Final speed assumes the object starts from rest (impulse 400 N s)")
F(86, "Emulsion-paint constituents per engineering-chemistry texts: pine oil antifoaming, driers with oxidizable oils")
F(88, "Statement II reverses cause and effect; DP treats it as incorrect")
F(91, "Elastic fibres aid ventilation rather than gas exchange; DP key I and III only")
F(136, "Rajya Sabha makes recommendations on a Money Bill; DP treats 'suggest amendment(s)' as correct")

Q(51, "A pendulum of length $L$ oscillates with an angular amplitude of $\\theta=60^{\\circ}$ and time period $T$. Let $T_{0}=2\\pi\\sqrt{\\frac{L}{g}}$ be the time period for small angle of oscillations, where $g$ is the acceleration due to gravity. If air resistance is negligibly small and the string remains straight, then which one of the following is correct?",
  ["$T$ will be slightly greater than $T_{0}$.", "$T$ will be slightly smaller than $T_{0}$.", "$T$ will be exactly equal to $T_{0}$.", "$T$ will depend upon the mass of the bob."], "A",
  PH + "Classical Mechanics, Motion & Gravitation", 45,
  "Concept: $T_0=2\\pi\\sqrt{L/g}$ is the small-angle approximation ($\\sin\\theta\\approx\\theta$).\nStep 1: For large amplitudes the restoring torque grows more slowly than $\\theta$, so the period increases: $T\\approx T_0\\left(1+\\frac{\\theta_0^2}{16}\\right)$, about 7% more at $60^\\circ$.\nStep 2: The period does not depend on the bob's mass.\nAnswer: (a)")

Q(52, "Two forces of equal magnitude simultaneously act at a point. It is observed that the resultant force is equal in magnitude to the individual forces. Which of the following statements is/are correct?\n\nI. The angle between one of the individual forces and the resultant force is $\\pi/3$.\nII. The angle between the individual forces is $2\\pi/3$.\n\n" + SC,
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  PH + "Classical Mechanics, Motion & Gravitation", 30,
  "Step 1: $R^2=F^2+F^2+2F^2\\cos\\alpha=F^2$ gives $\\cos\\alpha=-\\frac12$, so $\\alpha=\\frac{2\\pi}{3}$. II is correct.\nStep 2: For equal forces the resultant bisects the angle, so it makes $\\frac{\\pi}{3}$ with each force. I is correct.\nAnswer: (c)", pattern=S2)

Q(53, "A solid of mass $m$ has temperature-dependent specific heat as $C(T)=C_{0}+\\alpha T$, where $C_{0}$ and $\\alpha$ are constants. The solid is heated from $T_{1}$ to $T_{2}$. Which one of the following is the correct expression for quantity of heat ($Q$) of the solid mass?",
  ["$Q=mC_{0}(T_{2}-T_{1})$", "$Q=m(T_{2}-T_{1})[C_{0}+\\alpha(T_{1}+T_{2})]$", "$Q=m(T_{2}-T_{1})[C_{0}(T_{1}+T_{2})+\\alpha]$", "$Q=m(T_{2}-T_{1})\\left[C_{0}+\\frac{\\alpha}{2}(T_{1}+T_{2})\\right]$"], "D",
  PH + "Thermodynamics, Heat & Kinetic Theory", 40,
  "Step 1: $Q=m\\int_{T_1}^{T_2}(C_0+\\alpha T)\\,dT=m\\left[C_0(T_2-T_1)+\\frac{\\alpha}{2}(T_2^2-T_1^2)\\right]$.\nStep 2: Factorising: $Q=m(T_2-T_1)\\left[C_0+\\frac{\\alpha}{2}(T_1+T_2)\\right]$.\nAnswer: (d)")

Q(54, "In a certain process, the relation between pressure ($P$) and volume ($V$), for an ideal gas, is given by $PV^{2}=$ constant. If the initial temperature is $T_{1}$ and the final temperature is $T_{2}$; and the initial volume is $V_{1}$ and the final volume is $V_{2}$, then which one of the following is correct?",
  ["$\\frac{T_{1}}{T_{2}}=\\frac{V_{1}}{V_{2}}$", "$\\frac{T_{1}}{T_{2}}=\\left(\\frac{V_{1}}{V_{2}}\\right)^{2}$", "$\\frac{T_{1}}{T_{2}}=\\frac{V_{2}}{V_{1}}$", "$\\frac{T_{1}}{T_{2}}=\\left(\\frac{V_{2}}{V_{1}}\\right)^{2}$"], "C",
  PH + "Thermodynamics, Heat & Kinetic Theory", 35,
  "Step 1: $P=\\frac{nRT}{V}$, so $PV^2=nRTV=$ constant, i.e. $TV$ is constant.\nStep 2: $T_1V_1=T_2V_2$, so $\\frac{T_1}{T_2}=\\frac{V_2}{V_1}$.\nAnswer: (c)")

Q(55, "For an ideal gas, a process is described by $P=kT$, where $k$ is a constant. If the molar heat capacity for this process is $C$, then which one of the following is correct (where the symbols have their usual meanings)?",
  ["$C=C_{P}$", "$C=C_{V}$", "$C=(C_{P}+C_{V})/2$", "$C$ is never constant"], "B",
  PH + "Thermodynamics, Heat & Kinetic Theory", 30,
  "Step 1: $PV=nRT$ with $P=kT$ gives $V=\\frac{nR}{k}$, a constant volume.\nStep 2: The process is isochoric, so the molar heat capacity is $C_V$.\nAnswer: (b)")

Q(56, "For an object in gravitational field, the gravitational potential is the same at two points $A$ and $B$, but the gravitational field is not the same at these two points. Which one of the following statements is correct?",
  ["Positive work is done by gravity in moving the object from point $A$ to point $B$.", "Negative work is done by gravity in moving the object from point $A$ to point $B$.", "Gravity must be non-conservative in such a region.", "No work is done by gravity in moving the object from point $A$ to point $B$."], "D",
  PH + "Classical Mechanics, Motion & Gravitation", 25,
  "Step 1: Work done by gravity $=-m(V_B-V_A)$, which depends only on the potentials at the end points.\nStep 2: $V_A=V_B$, so the work is zero, whatever the field values.\nAnswer: (d)")

Q(57, "The position vector of a particle is given by $\\vec{r}=\\sqrt{3}t^{2}\\hat{i}+\\sqrt{2}t\\hat{j}+\\sqrt{5}\\hat{k}$. Which one of the following statements is correct?",
  ["The force acting on the particle is parallel to the instantaneous momentum of the particle.", "The force acting on the particle is perpendicular to the instantaneous momentum of the particle.", "The particle experiences zero force.", "The force acting on the particle is not parallel to the instantaneous momentum of the particle."], "D",
  PH + "Classical Mechanics, Motion & Gravitation", 35,
  "Step 1: $\\vec v=2\\sqrt3t\\,\\hat i+\\sqrt2\\,\\hat j$ and $\\vec a=2\\sqrt3\\,\\hat i$, so the force is along $\\hat i$ and non-zero.\nStep 2: The momentum always has a $\\hat j$ component, so it is never parallel to the force; their dot product $12t$ is not zero for $t>0$, so they are not perpendicular either.\nAnswer: (d)")

Q(58, "A ball is dropped from rest from height $h$ above the ground in frame $S$ (the Earth's frame). Another frame $S'$ is moving upwards with constant speed $u$ relative to the Earth. In frame $S'$, the ball has initial downward speed $v$. Pertaining to the change in kinetic energy ($\\Delta K$) of the ball from release to just before hitting the ground as measured in frames $S$ and $S'$ separately, which one of the following is correct?",
  ["$\\Delta K$ is the same in both the frames.", "$\\Delta K$ is larger in frame $S$.", "$\\Delta K$ is larger in frame $S'$.", "$\\Delta K$ cannot be compared without the information of mass of the ball."], "C",
  PH + "Classical Mechanics, Motion & Gravitation", 55,
  "Step 1: In $S$, $\\Delta K=mgh$ (from rest to speed $\\sqrt{2gh}$).\nStep 2: In $S'$ the speeds are $u$ and $\\sqrt{2gh}+u$, so $\\Delta K'=\\frac12m\\left[(\\sqrt{2gh}+u)^2-u^2\\right]=mgh+mu\\sqrt{2gh}$.\nStep 3: $\\Delta K'>\\Delta K$ for any mass.\nAnswer: (c)")

Q(59, "A floating body is in stable state. Which one of the following is correct?",
  ["The centre of gravity of the body is above its centre of buoyancy.", "The centre of gravity of the body is below its centre of buoyancy.", "The centre of gravity of the body coincides with its centre of buoyancy.", "The centre of gravity of the body is below the metacentre."], "D",
  PH + "Fluid Mechanics & Properties of Fluids", 45,
  "Concept: a floating body is in stable equilibrium when its metacentre lies above its centre of gravity.\nStep 1: The centre of gravity may lie above the centre of buoyancy (as in ships) and still be stable, so (a), (b) and (c) are not the condition.\nAnswer: (d)")

Q(60, "A constant power machine pulls a block on a smooth horizontal surface. Which one of the following correctly describes the relation between speed of the block ($v$) and time ($t$)?",
  ["$v\\propto t$", "$v\\propto\\sqrt{t}$", "$v\\propto t^{2}$", "$v\\propto t^{3/2}$"], "B",
  PH + "Classical Mechanics, Motion & Gravitation", 35,
  "Step 1: Constant power means the kinetic energy grows linearly: $\\frac12mv^2=Pt$ (starting from rest).\nStep 2: So $v\\propto\\sqrt t$.\nAnswer: (b)")

Q(61, "A 5 g piece of ice at $-20^{\\circ}$C is put into $m$ kg of water at $30^{\\circ}$C temperature. The heat is exchanged only between the ice and the water. The final temperature of the mixture is $0^{\\circ}$C in liquid phase. What is the value of $m$ in kg?",
  ["0.050", "0.010", "0.015", "0.150"], "C",
  PH + "Thermodynamics, Heat & Kinetic Theory", 40,
  "Step 1: Heat gained by ice: warming $5\\times0.5\\times20=50$ cal, melting $5\\times80=400$ cal; total 450 cal.\nStep 2: Heat lost by water: $1000m\\times1\\times30=30000m$ cal.\nStep 3: $30000m=450$ gives $m=0.015$ kg.\nAnswer: (c)")

Q(62, "A very large container consists of an ideal gas. The speed of sound in the gas is $x$. When the pressure of the gas is doubled while keeping the temperature constant, the speed of sound now becomes $y$. What is the ratio of $x$ to $y$?",
  ["1", "$\\sqrt{2}$", "2", "4"], "A",
  PH + "Waves, Acoustics & Electromagnetic Spectrum", 25,
  "Step 1: $v=\\sqrt{\\gamma P/\\rho}=\\sqrt{\\gamma RT/M}$, which depends only on temperature for a given gas.\nStep 2: Doubling pressure at constant temperature also doubles density, so the speed is unchanged and $x:y=1$.\nAnswer: (a)")

Q(63, "A person jumps from a height on soft sand. Which one of the following is the correct reason for less likely injury to the person?",
  ["The sand exerts no reaction force.", "The sand reduces the change in momentum.", "The sand increases the impact time.", "The sand increases the momentum."], "C",
  PH + "Classical Mechanics, Motion & Gravitation", 10,
  "Step 1: The change in momentum on landing is fixed by the landing speed.\nStep 2: Soft sand increases the time of impact, so the average force $F=\\Delta p/\\Delta t$ is smaller.\nAnswer: (c)")

Q(64, "An object is placed far beyond the centre of curvature of a concave mirror. The object then starts accelerating towards the mirror. Which one of the following is correct?",
  ["The image will accelerate towards the centre of curvature.", "The image will accelerate towards the focus.", "The image will accelerate towards the pole of the mirror.", "The image will move with a constant speed towards the focus."], "A",
  PH + "Geometrical & Physical Optics", 40,
  "Step 1: For an object beyond $C$, the real image lies between $F$ and $C$.\nStep 2: As the object approaches $C$, the image moves from near $F$ out towards $C$, and the image speed $v_i=(v/u)^2v_o$ grows as the object accelerates and nears $C$.\nAnswer: (a)")

Q(65, "A particle is moved from point $X$ to point $Y$ under a force field. The work done depends only on the initial and final speeds. Which one of the following is correct?",
  ["The force is conservative.", "The net work equals the change in kinetic energy.", "The force is constant.", "The velocity must always increase."], "B",
  PH + "Classical Mechanics, Motion & Gravitation", 30,
  "Concept: the work-energy theorem.\nStep 1: Net work equals the change in kinetic energy, which depends only on the initial and final speeds. Nothing more can be concluded about the force.\nAnswer: (b)")

Q(66, "One year at a planet is 8 times as large as compared to the one year at the Earth. Which one of the following is correct about the planet's orbit?",
  ["The semimajor axis of the planet's orbit is same as that of the Earth.", "The semimajor axis of the planet's orbit is twice as compared to that of the Earth.", "The semimajor axis of the planet's orbit is thrice as compared to that of the Earth.", "The semimajor axis of the planet's orbit is four times as compared to that of the Earth."], "D",
  PH + "Classical Mechanics, Motion & Gravitation", 25,
  "Step 1: Kepler's third law: $T^2\\propto a^3$.\nStep 2: $8^2=64=a^3$, so $a=4$ times the Earth's.\nAnswer: (d)")

Q(67, "A lightning rod with sharp tip reduces damage risk. Which one of the following is the primary reason for it?",
  ["It attracts lightning directly.", "The sharp tip reduces the local electric field.", "It enhances field and promotes continuous corona discharge.", "It repels charged clouds."], "C",
  PH + "Electricity & Electric Circuits", 30,
  "Step 1: Charge density, and so the electric field, is highest at sharp points.\nStep 2: The strong field ionises nearby air, allowing a continuous (corona) discharge that leaks charge safely to the earth.\nAnswer: (c)")

Q(68, "A periscope uses two plane mirrors inclined at $45^{\\circ}$. If the tube of the periscope is filled with a complete transparent liquid of refractive index 1.5, then which one of the following is correct in respect of the image seen?",
  ["The image will remain unchanged.", "The image will appear laterally shifted.", "The image will appear 1.5 times brighter.", "The image will appear 1.5 times darker."], "A",
  PH + "Geometrical & Physical Optics", 45,
  "Step 1: The image is formed by reflection at the two plane mirrors; the liquid does not change the reflections or the orientation and size of the image.\nStep 2: Light travels along the tube axis, normal to the liquid surfaces, so there is no lateral shift, and a transparent liquid does not change brightness by a factor of 1.5.\nAnswer: (a)")

Q(69, "It has been observed that a mirror always forms the image between the pole and the focus, irrespective of the location of the object. Which one of the following is correct in respect of the nature of the mirror?",
  ["It is a plane mirror.", "It is a convex mirror.", "It is a concave mirror of small focal length.", "It is a concave mirror of large focal length."], "B",
  PH + "Geometrical & Physical Optics", 15,
  "Step 1: A convex mirror always forms a virtual, erect, diminished image between its pole and focus, wherever a real object is placed.\nAnswer: (b)")

Q(70, "What is the upward force acting on a skydiver of mass 60 kg who is falling at a uniform speed of 2 m/s?",
  ["0", "60 N", "588 N", "708 N"], "C",
  PH + "Classical Mechanics, Motion & Gravitation", 15,
  "Step 1: Uniform speed means zero net force, so the upward drag equals the weight.\nStep 2: $60\\times9.8=588$ N.\nAnswer: (c)")

Q(71, "With respect to electromagnetic waves, the human eye is sensitive to",
  ["both electric and magnetic fields", "electric field only", "magnetic field only", "infrared part of the electromagnetic spectrum"], "B",
  PH + "Waves, Acoustics & Electromagnetic Spectrum", 40,
  "Concept: in optical interactions with matter, the electric field vector does the work on electrons; it is called the light vector.\nStep 1: The retina responds to the electric field of visible light, not to the magnetic field or infrared.\nAnswer: (b)")

Q(72, f"Three wires each of length $L$, cross-sectional area $A$ and resistivity $\\rho$ are connected as shown in the figure. These are to be replaced by another wire of same resistivity such that the resistance between points $X$ and $Z$ does not change. If $L_{{1}}$ is the length and $A_{{1}}$ is the cross-sectional area of the new wire, then which one among the following is correct?\n![Two wires (each L, A) in parallel between X and Y, and a third wire (L, A) from Y to Z]({FIG}/q72.png)",
  ["$L_{1}=3L$ and $A_{1}=2A$", "$L_{1}=L$ and $A_{1}=A$", "$L_{1}=2L$ and $A_{1}=3A$", "$L_{1}=2L$ and $A_{1}=2A$"], "A",
  PH + "Electricity & Electric Circuits", 35,
  "Step 1: Each wire has $R=\\rho L/A$. Two in parallel give $R/2$, plus $R$ in series: $R_{XZ}=\\frac32R=\\frac{3\\rho L}{2A}$.\nStep 2: The new wire needs $\\frac{\\rho L_1}{A_1}=\\frac{\\rho(3L)}{2A}$, which $L_1=3L$, $A_1=2A$ satisfies.\nAnswer: (a)")

Q(73, f"A light ray is falling on a face of an equilateral glass prism as shown in the figure:\n![Ray incident normally on one face of an equilateral glass prism]({FIG}/q73.png)\nWhich one of the following diagrams correctly shows the complete path of the ray through the glass prism?\n![Four ray diagrams labelled (a) to (d)]({FIG}/q73-options.png)",
  ["Diagram (a)", "Diagram (b)", "Diagram (c)", "Diagram (d)"], "D",
  PH + "Geometrical & Physical Optics", 60,
  "Step 1: The ray enters normally, undeviated, and meets the second face at $60^\\circ$, more than the critical angle of glass (about $42^\\circ$), so it is totally internally reflected.\nStep 2: Reflecting a ray travelling at $-30^\\circ$ off a face whose normal is at $+30^\\circ$ sends it straight down, perpendicular to the base.\nStep 3: It therefore leaves the base normally without bending, as drawn in diagram (d).\nAnswer: (d)")

Q(74, f"A glass slab of refractive index 1.5 is cut in the shape of a parallelepiped $ABCD$ as shown in the figure. Surface $BC$ is polished to form a perfect reflector. Light is incident at surface $AB$ from inside at an angle $\\pi/3$. Which one of the following is the correct angle $ABC$ ($\\theta$) such that the reflected light retraces its path?\n![Parallelogram ABCD with BC silvered and angle theta at B]({FIG}/q74.png)",
  ["$\\pi/6$", "$\\pi/3$", "$\\pi/4$", "$5\\pi/12$"], "B",
  PH + "Geometrical & Physical Optics", 55,
  "Step 1: The critical angle for $n=1.5$ is about $42^\\circ$, so light hitting $AB$ at $60^\\circ$ is totally reflected and leaves at $30^\\circ$ to the surface $AB$.\nStep 2: To retrace its path the ray must strike the mirror $BC$ normally. In the triangle formed with $AB$ and $BC$: $\\theta+30^\\circ+90^\\circ=180^\\circ$.\nStep 3: $\\theta=60^\\circ=\\pi/3$.\nAnswer: (b)")

Q(75, f"The force-time ($F$-$t$) graph of a 10 kg moving object is shown below:\n![Force rises from 0 to 20 N in 0-5 s, stays at 20 N till 20 s, and falls to 0 at 25 s]({FIG}/q75.png)\nWhat is the final speed of the object?",
  ["0", "15 m/s", "30 m/s", "40 m/s"], "D",
  PH + "Classical Mechanics, Motion & Gravitation", 35,
  "Step 1: Impulse = area under the graph $=\\frac12(5)(20)+15(20)+\\frac12(5)(20)=400$ N s.\nStep 2: $\\Delta v=\\frac{400}{10}=40$ m/s; starting from rest, the final speed is 40 m/s.\nAnswer: (d)")

Q(76, "If $x$ is the number of electrons and $y$ is the number of nucleons present in ${}^{32}_{16}\\mathrm{S}^{2-}$, then which one of the following is correct?",
  ["$x=14$ and $y=32$", "$x=16$ and $y=30$", "$x=18$ and $y=32$", "$x=18$ and $y=30$"], "C",
  CH + "Atomic Structure, Isotopes & Periodicity", 10,
  "Step 1: Electrons: $16+2=18$ for the 2$-$ ion.\nStep 2: Nucleons (mass number): 32.\nAnswer: (c)")

Q(77, "Which one of the following forms of carbon is thermodynamically most stable?",
  ["Coal", "Graphite", "Diamond", "Fullerene"], "B",
  CH + "Organic Chemistry & Carbon Compounds", 15,
  "Step 1: Graphite is the standard state of carbon ($\\Delta_fH^\\circ=0$); diamond and fullerene have higher enthalpy, and coal is not a pure allotrope.\nAnswer: (b)")

Q(78, "Consider the following statements:\n\nI. A colloid and a suspension are heterogeneous mixtures.\nII. Colloids can be separated from the mixture by the process of centrifugation.\nIII. Particles of colloids and suspensions can be seen by naked eye.\nIV. The aqueous solution of copper sulphate does not show Tyndall effect; however, the mixture of milk and water shows Tyndall effect.\n\nWhich of the statements given above is/are correct?",
  ["I only", "II and III only", "I, II and III", "I, II and IV"], "D",
  CH + "Chemical Composition & Classification", 30,
  "Step 1: Colloids and suspensions are heterogeneous (I); colloidal particles can be separated by centrifugation (II).\nStep 2: Colloidal particles are too small to see with the naked eye, so III is wrong.\nStep 3: A true solution shows no Tyndall effect, while milk in water (a colloid) does (IV).\nAnswer: (d)", pattern=S4)

Q(79, "A non-volatile solid solute may be separated from a solution by which of the following processes?\n\nI. Evaporation\nII. Crystallization\n\n" + SC,
  I2, "C", CH + "Separation Techniques & Purification", 15,
  "Step 1: Evaporating the solvent leaves the non-volatile solute behind; crystallization gives a purer solid from the solution. Both work.\nAnswer: (c)", pattern=S2)

Q(80, "Which of the following are oxidation reactions?\n\nI. Rusting of iron\nII. Burning of fuel\nIII. Rancidity of oils and fats\nIV. Browning of fruits\n\n" + SC,
  ["I, II and III only", "I, II and IV only", "III and IV only", "I, II, III and IV"], "D",
  CH + "Chemical Reactions, Stoichiometry & Energetics", 20,
  "Step 1: Rusting, combustion, rancidity and enzymatic browning of cut fruit all involve reaction with oxygen.\nAnswer: (d)", pattern=S4)

Q(81, "Consider the following statement:\n\n\"Acids are substances that dissociate in water to give hydrogen ions H$^{+}$(aq), and bases are substances that produce hydroxyl ions OH$^{-}$(aq).\"\n\nThe above statement is based on which one of the following concepts?",
  ["Brønsted-Lowry concept", "Lewis acid-base concept", "Arrhenius concept", "Conjugate acid-base concept"], "C",
  CH + "Acids, Bases, pH & Commercial Inorganic Salts", 10,
  "Step 1: Defining acids and bases by the H$^+$ and OH$^-$ ions they give in water is the Arrhenius concept.\nAnswer: (c)")

Q(82, "Superphosphate of lime—a phosphate fertilizer—is obtained by the reaction of",
  ["calcium phosphate with sodium hydroxide", "calcium phosphate with sulphuric acid", "calcium phosphate with hydrogen chloride", "calcium phosphate with nitric acid"], "B",
  CH + "Industrial, Materials & Applied Chemistry", 20,
  "Step 1: $\\mathrm{Ca_3(PO_4)_2+2H_2SO_4\\rightarrow Ca(H_2PO_4)_2+2CaSO_4}$; the mixture is superphosphate of lime.\nAnswer: (b)")

Q(83, "1.7 g of silver nitrate is dissolved in 100 g of water, and 0.585 g of sodium chloride is dissolved in 100 g of water. Both are mixed and a chemical reaction occurs. 1.435 g of silver chloride and 0.85 g of sodium nitrate are formed. Which law of chemical combination is shown by the above reaction?",
  ["Law of multiple proportions", "Law of conservation of mass", "Law of reciprocal proportions", "Law of constant proportions"], "B",
  CH + "Chemical Reactions, Stoichiometry & Energetics", 15,
  "Step 1: Reactants: $1.7+0.585=2.285$ g. Products: $1.435+0.85=2.285$ g.\nStep 2: Mass is conserved.\nAnswer: (b)")

Q(84, "Which of the following statements is/are correct with regard to Nitrolim?\n\nI. It is prepared by heating calcium carbide with nitrogen.\nII. It decomposes into ammonia in soil.\nIII. It is an NPK fertilizer.\nIV. It is an organic fertilizer.\n\n" + SC,
  ["I and II only", "I, II and III", "IV only", "I, II and IV"], "A",
  CH + "Industrial, Materials & Applied Chemistry", 40,
  "Step 1: Nitrolim (calcium cyanamide with carbon) is made by heating calcium carbide in nitrogen, $\\mathrm{CaC_2+N_2\\rightarrow CaCN_2+C}$, and hydrolyses in soil to ammonia. I and II are correct.\nStep 2: It supplies only nitrogen (not NPK) and is an inorganic fertilizer.\nAnswer: (a)", pattern=S4)

Q(85, "Consider the following pairs:\n\nI. Pigment : TiO$_2$\nII. Drier : Turpentine\nIII. Thinner : Naphthenates\nIV. Antiskinning agent : Polyhydroxy phenol\n\nHow many of the pairs given above are correctly matched?",
  ["One", "Two", "Three", "All the four"], "B",
  CH + "Industrial, Materials & Applied Chemistry", 45,
  "Step 1: TiO$_2$ is a white pigment and polyhydroxy phenols are antiskinning agents: correct.\nStep 2: Turpentine is a thinner and metal naphthenates are driers, so II and III are interchanged.\nAnswer: (b)", pattern=CNT)

Q(86, "Consider the following statements:\n\nI. Pine oil is used as antifoaming agent in the emulsion paints.\nII. Protective colloids are used in the emulsion paints to decrease their stability.\nIII. Driers having oxidizable oils are added to the emulsion paints to accelerate drying process.\n\nWhich of the statements given above is/are correct?",
  ["I and II", "I only", "II and III", "I and III"], "D",
  CH + "Industrial, Materials & Applied Chemistry", 55,
  "Step 1: Pine oil is a standard antifoaming agent in emulsion paints (I correct), and driers with oxidizable oils are added to speed drying (III correct).\nStep 2: Protective colloids such as casein are added to increase, not decrease, the stability of the emulsion (II wrong).\nAnswer: (d)", pattern=S3)

Q(87, "Consider the following:\n\nI. AlCl$_3$\nII. NH$_3$\nIII. BF$_3$\nIV. FeCl$_3$\n\nHow many of the above are Lewis acids?",
  ["One", "Two", "Three", "All the four"], "C",
  CH + "Acids, Bases, pH & Commercial Inorganic Salts", 25,
  "Step 1: AlCl$_3$, BF$_3$ and FeCl$_3$ are electron-pair acceptors (Lewis acids).\nStep 2: NH$_3$ donates a lone pair, so it is a Lewis base.\nAnswer: (c)", pattern=CNT)

Q(88, "Consider the following statements:\n\nI. Soaps are sodium or potassium salts of long-chain carboxylic acids.\nII. The properties of catenation and isomerism in the element carbon are attributed to existence of large number of organic compounds than inorganic compounds.\nIII. Carbon dioxide is acidic but carbon monoxide is neutral molecule.\n\nWhich of the statements given above are correct?",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "C",
  CH + "Organic Chemistry & Carbon Compounds", 45,
  "Step 1: I and III are correct.\nStep 2: II reverses cause and effect: the large number of organic compounds is due to carbon's catenation and isomerism, not the other way round.\nAnswer: (c)", pattern=S3)

Q(89, "Which of the following is/are the physical test(s) employed for the manufacture of paper?\n\nI. Mechanical and strength properties\nII. Surface properties\nIII. Optical properties\nIV. Permeability to fluids\n\n" + SC,
  ["I only", "II and III only", "I, II and III only", "I, II, III and IV"], "D",
  CH + "Industrial, Materials & Applied Chemistry", 35,
  "Step 1: Paper testing covers mechanical strength (tensile, burst, tear), surface properties (smoothness, roughness), optical properties (brightness, opacity) and permeability (air, water, oil). All four apply.\nAnswer: (d)", pattern=S4)

Q(90, "Consider the following pairs of reactions and properties:\n\nI. Fe(s) + 2HCl(aq) $\\rightarrow$ FeCl$_2$(aq) + H$_2$(g) : Fe is reductant\nII. Zn(s) + CuSO$_4$(aq) $\\rightarrow$ ZnSO$_4$(aq) + Cu(s) : Cu is being reduced\nIII. Br$_2$(l) + 2I$^-$(aq) $\\rightarrow$ 2Br$^-$(aq) + I$_2$(s) : Br$_2$ is reductant\nIV. CH$_4$(g) + 2O$_2$(g) $\\rightarrow$ CO$_2$(g) + 2H$_2$O(l) : C atom in CH$_4$ is oxidized\n\nWhich of the above pairs are correct?",
  ["I and II only", "II, III and IV", "I, II and IV", "I, III and IV"], "C",
  CH + "Chemical Reactions, Stoichiometry & Energetics", 30,
  "Step 1: Fe is oxidised to Fe$^{2+}$ (reductant); Cu$^{2+}$ is reduced to Cu; carbon goes from $-4$ to $+4$ (oxidised).\nStep 2: Br$_2$ is reduced to Br$^-$, so it is the oxidant, not the reductant.\nAnswer: (c)", pattern=S4)

Q(91, "Which of the following properties of alveoli is/are helpful in gaseous exchange during respiration in human beings?\n\nI. The epithelial lining of alveoli is very thin.\nII. Elastic fibres are present in alveolar wall.\nIII. Wall of alveoli is surrounded by many blood capillaries.\n\n" + SC,
  ["I and II only", "I and III only", "III only", "I, II and III"], "B",
  BI + "Human Anatomy & Systemic Physiology", 40,
  "Step 1: A very thin epithelium and a dense capillary network give a short diffusion path and large blood supply, directly aiding gas exchange.\nStep 2: Elastic fibres help the alveoli recoil during breathing (ventilation) rather than the exchange of gases itself.\nAnswer: (b)", pattern=S3)

Q(92, "In which one of the following groups of animals, oestrus cycle is not observed?",
  ["Cows", "Monkeys", "Rats", "Tigers"], "B",
  BI + "Human Anatomy & Systemic Physiology", 20,
  "Step 1: Primates such as monkeys, apes and humans have a menstrual cycle; non-primate mammals such as cows, rats and tigers have an oestrus cycle.\nAnswer: (b)")

Q(93, "Which one of the following tissues in plants is usually without protoplast and regarded as dead cells?",
  ["Collenchyma", "Parenchyma", "Sclerenchyma", "Xylem parenchyma"], "C",
  BI + "Plant Anatomy, Transport & Physiology", 15,
  "Step 1: Mature sclerenchyma cells have thick lignified walls and no protoplast; they are dead.\nAnswer: (c)")

Q(94, "In which cell does the first meiotic cell division take place during the process of spermatogenesis?",
  ["Spermatogonium", "Primary spermatocyte", "Secondary spermatocyte", "Sertoli cell"], "B",
  BI + "Human Anatomy & Systemic Physiology", 20,
  "Step 1: Spermatogonia divide by mitosis to form primary spermatocytes, which undergo meiosis I to give secondary spermatocytes.\nAnswer: (b)")

Q(95, "Consider the following statements in respect of cell and its structure:\n\nI. All cells possess cell wall.\nII. All cells have ribosomes present inside.\nIII. All cells have well-organized nucleus.\nIV. All cells have linear DNA molecules present in them.\n\nWhich of the statements given above is/are correct?",
  ["II and III", "II only", "II and IV", "I and III"], "B",
  BI + "Cytology & Cell Architecture", 25,
  "Step 1: Ribosomes are present in all living cells, prokaryotic and eukaryotic (II).\nStep 2: Animal cells lack a cell wall, prokaryotes lack an organised nucleus, and prokaryotic DNA is circular.\nAnswer: (b)", pattern=S4)

Q(96, "Which part of the plant or flower contributes in the form of false fruit like apple?",
  ["Petal", "Sepal", "Stamen", "Thalamus"], "D",
  BI + "Plant Anatomy, Transport & Physiology", 15,
  "Step 1: In false fruits such as apple, the fleshy edible part develops from the thalamus, not the ovary.\nAnswer: (d)")

Q(97, "In which of the following parts of organisms, the process of gaseous exchange during respiration does not take place?",
  ["Skin of earthworms", "Bronchi of humans", "Gills of Pila", "Alveoli of humans"], "B",
  BI + "Human Anatomy & Systemic Physiology", 15,
  "Step 1: Bronchi are conducting airways; in humans gas exchange happens only in the alveoli. Earthworm skin and Pila's gills are respiratory surfaces.\nAnswer: (b)")

Q(98, "Which one of the following parts of an ovule possesses reserve food?",
  ["Integument", "Funicle", "Chalaza", "Nucellus"], "D",
  BI + "Plant Anatomy, Transport & Physiology", 25,
  "Step 1: The nucellus is the mass of cells inside the integuments that has reserve food materials.\nAnswer: (d)")

Q(99, "Which one of the following respiratory volumes of human lung is the lowest?",
  ["Residual volume", "Tidal volume", "Inspiratory reserve volume", "Expiratory reserve volume"], "B",
  BI + "Human Anatomy & Systemic Physiology", 20,
  "Step 1: Typical values: tidal volume about 500 mL; expiratory reserve 1000-1100 mL; residual 1100-1200 mL; inspiratory reserve 2500-3000 mL.\nAnswer: (b)")

Q(100, "Which one of the following valves guards the opening between the right ventricle and the pulmonary artery?",
  ["Bicuspid valve", "Semilunar valve", "Mitral valve", "Tricuspid valve"], "B",
  BI + "Human Anatomy & Systemic Physiology", 15,
  "Step 1: The pulmonary semilunar valve guards the opening of the right ventricle into the pulmonary artery. The tricuspid is between the right atrium and ventricle; the bicuspid (mitral) is on the left side.\nAnswer: (b)")

Q(101, "Which one of the following is not a strategy in the Rainfed Area Development (RAD) scheme of India?",
  ["Diversified farming", "Soil health management", "Adaptation of cluster-based approaches", "Optimizing canal irrigation"], "D",
  "Economy > Agriculture & Rural Economy > Agricultural Policy", 30,
  "Step 1: RAD (under the National Mission for Sustainable Agriculture) promotes integrated and diversified farming systems, soil health management and cluster-based approaches in rainfed areas.\nStep 2: Canal irrigation is not part of a rainfed-area strategy.\nAnswer: (d)")

Q(102, "Consider the following statements about Kamarajar Port:\n\nI. It is an example of corporatized public company.\nII. It was earlier known as Ennore Port.\nIII. It is a natural port.\n\nWhich of the statements given above are correct?",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "A",
  "Geography > Economic Geography > Transport Geography", 35,
  "Step 1: Kamarajar Port Limited, formerly Ennore Port, is India's first corporatised major port, run as a public company.\nStep 2: It is an artificial harbour built with breakwaters, not a natural port.\nAnswer: (a)", pattern=S3)

Q(103, "Consider the following statements:\n\nI. Earthquake waves are basically of two types, namely body waves and surface waves.\nII. The body waves interact with the surface rocks and generate surface waves.\n\nWhich of the statements given above is/are correct?",
  I2, "C", "Geography > Physical Geography > Earth Interior & Geotectonics", 20,
  "Step 1: Earthquake waves are body waves and surface waves; body waves interacting with surface rocks generate the surface waves. Both statements are correct.\nAnswer: (c)", pattern=S2)

Q(104, "Consider the following statements regarding the Earth's crust:\n\nI. The continental crust is thinner under fold mountains.\nII. The mean thickness of ocean crust is 30 km.\nIII. The Earth's crust is brittle in nature.\n\nWhich of the statements given above is/are correct?",
  ["I only", "I and II", "III only", "I and III"], "C",
  "Geography > Physical Geography > Earth Interior & Geotectonics", 30,
  "Step 1: The crust is thicker, not thinner, under major mountain systems (about 70 km under the Himalayas).\nStep 2: Oceanic crust averages about 5 km; 30 km is the continental average.\nStep 3: The crust is the brittle outermost solid layer.\nAnswer: (c)", pattern=S3)

Q(105, "Which of the following are associated with composite volcanoes?\n\nI. They result in explosive eruptions.\nII. They eject pyroclastic materials.\nIII. Pyroclastic materials and ashes accumulate near the vent, forming layers.\n\n" + SC,
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "D",
  "Geography > Physical Geography > Earth Interior & Geotectonics", 25,
  "Step 1: Composite volcanoes erupt cooler, viscous lava explosively, with large quantities of pyroclastic material and ash that accumulate around the vent in layers. All three apply.\nAnswer: (d)", pattern=S3)

Q(106, "Loose sediments are transformed into sedimentary rocks by the process of",
  ["lithification", "weathering", "mass wasting", "solifluction"], "A",
  "Geography > Physical Geography > Rocks & Minerals", 10,
  "Step 1: Compaction and cementation that turn loose sediments into rock are called lithification.\nAnswer: (a)")

Q(107, "Consider the following statements about temperature inversion:\n\nI. This happens when normal lapse rate gets inverted.\nII. Winter nights with cloudy skies are conducive for temperature inversion.\nIII. Polar areas experience inversion throughout the year.\n\nWhich of the statements given above are correct?",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "C",
  "Geography > Physical Geography > Climatology", 30,
  "Step 1: In an inversion, temperature increases with height instead of falling (I), and polar areas have it throughout the year (III).\nStep 2: Long winter nights with clear skies, not cloudy ones, favour inversion.\nAnswer: (c)", pattern=S3)

Q(108, "Consider the following statements regarding extratropical cyclones:\n\nI. They usually develop in the mid and high latitudes.\nII. They affect a much larger area as compared to tropical cyclone.\nIII. They move from east to west.\n\nWhich of the statements given above are correct?",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "A",
  "Geography > Physical Geography > Atmospheric Circulation", 25,
  "Step 1: Extratropical cyclones form in the mid and high latitudes along fronts and cover a much larger area than tropical cyclones.\nStep 2: Steered by the westerlies, they move from west to east.\nAnswer: (a)", pattern=S3)

Q(109, "Which one of the following receives an average annual rainfall of below 50 cm in India, indicating highest inadequacy?",
  ["Madhya Pradesh", "Haryana", "Ladakh", "Jharkhand"], "C",
  "Geography > Indian Geography > Indian Climate", 15,
  "Step 1: Ladakh, a cold desert in the rain shadow of the Himalayas, gets well below 50 cm of rain a year; the other three receive more.\nAnswer: (c)")

Q(110, "As per the land-use categories in the Land Revenue Records of India, \"a cultivable land which is left uncultivated for more than a year but less than 5 years\" is called",
  ["current fallow", "fallow, other than current fallow", "barren land", "culturable wasteland"], "B",
  "Geography > Indian Geography > Agriculture & Crops", 20,
  "Step 1: Current fallow is left uncultivated for one year or less; fallow other than current fallow, for more than a year but less than five; culturable wasteland, for more than five years.\nAnswer: (b)")

Q(111, "Consider the following pairs:\n\nTypes of Chemical Weathering : Characteristics\nI. Solution : Results in leaching of minerals\nII. Carbonation : Helps in breaking down feldspars\nIII. Hydration : Causes an increase in the volume of rocks\nIV. Oxidation : Changes the colour of rocks\n\nHow many pairs given above are correctly matched?",
  ["One", "Two", "Three", "All the four"], "D",
  "Geography > Physical Geography > Geomorphology & Earth Surface Processes", 30,
  "Step 1: Solution removes soluble minerals (leaching); carbonation breaks down feldspars and carbonate minerals; hydration makes rocks swell; oxidation gives red, brown or yellow colours. All four are correct.\nAnswer: (d)", pattern=CNT)

Q(112, "Quartzite is metamorphosed from which one of the following rocks?",
  ["Pegmatite", "Limestone", "Sandstone", "Shale"], "C",
  "Geography > Physical Geography > Rocks & Minerals", 10,
  "Step 1: Sandstone becomes quartzite; limestone becomes marble and shale becomes slate.\nAnswer: (c)")

Q(113, "Consider the following statements:\n\nI. In a seismograph, P waves are recorded earlier than S waves.\nII. In P waves, the individual particles vibrate to and fro in the direction of wave propagation whereas in S waves, the particles vibrate up and down at right angles to the direction of wave propagation.\n\nWhich of the statements given above is/are correct?",
  I2, "C", "Geography > Physical Geography > Earth Interior & Geotectonics", 15,
  "Step 1: P waves are faster, so they arrive first. They are longitudinal, while S waves are transverse. Both statements are correct.\nAnswer: (c)", pattern=S2)

Q(114, "Consider the following statements regarding hypocentre:\n\nI. It is the point where the energy is released and is called the focus of an earthquake.\nII. It is the point where the earthquake starts and may be many kilometers deep within the Earth.\n\nWhich of the statements given above is/are correct?",
  I2, "C", "Geography > Physical Geography > Earth Interior & Geotectonics", 15,
  "Step 1: The hypocentre (focus) is the point below the surface where the earthquake originates and energy is released, often many kilometres deep. Both statements are correct.\nAnswer: (c)", pattern=S2)

Q(115, "Consider the following critical minerals:\n\nI. Neodymium\nII. Tellurium\nIII. Dysprosium\nIV. Gallium\n\nWhich of the above minerals are not used for the production of photovoltaic cells used in solar panels?",
  ["I and IV", "II and III", "I and III", "II and IV"], "C",
  "Geography > Economic Geography > Resource Geography", 40,
  "Step 1: Tellurium (cadmium telluride cells) and gallium (gallium arsenide and CIGS cells) are used in photovoltaics.\nStep 2: Neodymium and dysprosium are rare earths used mainly in permanent magnets for motors and wind turbines.\nAnswer: (c)", pattern=S4)

Q(116, "Which one of the following winds is responsible for wildfires in Southern California?",
  ["Diablo wind", "Chinook wind", "Santa Ana wind", "Jarbo Gap wind"], "C",
  "Geography > Physical Geography > Atmospheric Circulation", 20,
  "Step 1: The hot, dry Santa Ana winds drive wildfires in Southern California; the Diablo and Jarbo Gap winds affect Northern California, and the Chinook blows east of the Rockies.\nAnswer: (c)")

Q(117, "Which one of the following is not a pass of Arunachal Pradesh?",
  ["Kumjawng Pass", "Yonggyap Pass", "Muling La", "Bomdi La"], "C",
  "Geography > Indian Geography > Himalayas, Mountains & Passes", 35,
  "Step 1: Kumjawng, Yonggyap and Bomdi La are passes in Arunachal Pradesh.\nStep 2: Muling La is in Uttarakhand.\nAnswer: (c)")

Q(118, "Mount Ibu, which recently erupted in Indonesia, is a",
  ["shield volcano", "composite volcano", "volcanic dome", "cinder cone"], "B",
  "Geography > Physical Geography > Natural Hazards", 35,
  "Step 1: Mount Ibu on Halmahera island is a stratovolcano, i.e. a composite volcano built of alternating lava and ash layers.\nAnswer: (b)")

Q(119, "Consider the following statements in case of terrestrial planets:\n\nI. Mercury, Venus, Earth and Mars are terrestrial planets having low densities as compared to other planets.\nII. They lie between the Sun and the belt of asteroids.\nIII. Their lower gravity can hold the escaping gases.\n\nWhich of the statements given above is/are correct?",
  ["I and II", "II and III", "I and III", "II only"], "D",
  "Science & Technology > Space Technology & Astronomy > Theoretical Astronomy & Astrophysics", 25,
  "Step 1: The terrestrial (inner) planets lie between the Sun and the asteroid belt (II).\nStep 2: They are dense, rocky planets (I wrong), and their lower gravity could not hold escaping gases (III wrong).\nAnswer: (d)", pattern=S3)

Q(120, "Consider the following pairs:\n\nLayers of Atmosphere : Characteristics\nI. Troposphere : Absorbs ultraviolet radiation\nII. Stratosphere : Changes in weather and climate\nIII. Mesosphere : Reflects radio waves back to the Earth\n\nHow many of the pairs given above are correctly matched?",
  ["None", "One", "Two", "All the three"], "A",
  "Geography > Physical Geography > Climatology", 20,
  "Step 1: Weather occurs in the troposphere; the ozone layer in the stratosphere absorbs ultraviolet radiation; the ionosphere reflects radio waves. None of the pairs is correct.\nAnswer: (a)", pattern=CNT)

Q(121, "Consider the following pairs:\n\nBooks : Authors\nI. Dayabhaga : Jimutavahana\nII. Prithviraj Raso : Chandbardai\nIII. Lilavati : Bhaskaracharya\nIV. Mitakshara : Vijnaneshvara\n\nHow many pairs given above are correctly matched?",
  ["One", "Two", "Three", "All the four"], "D",
  "History > Art & Culture > Literature & Languages", 25,
  "Step 1: Dayabhaga (Jimutavahana), Prithviraj Raso (Chand Bardai), Lilavati (Bhaskaracharya II) and Mitakshara (Vijnaneshvara) are all correctly matched.\nAnswer: (d)", pattern=CNT)

Q(122, "Arrange the following in chronological order from the earliest to recent:\n\nI. British East India Company formed\nII. Magellan circumnavigated the globe\nIII. Dutch East India Company formed\nIV. Vasco da Gama reached Calicut/Kozhikode\n\n" + SC,
  ["IV, I, II, III", "IV, II, I, III", "II, IV, III, I", "II, IV, I, III"], "B",
  "History > Modern History > European Expansion & Company Rule", 30,
  "Step 1: Vasco da Gama reached Calicut in 1498; Magellan's expedition circled the globe in 1519-22; the English East India Company was formed in 1600 and the Dutch VOC in 1602.\nAnswer: (b)", pattern=CHR)

Q(123, "Consider the following pairs:\n\nInventions : Inventors\nI. Flying shuttle loom : John Kay\nII. Water frame : James Hargreaves\nIII. Spinning jenny : Richard Arkwright\n\nHow many of the pairs given above are correctly matched?",
  ["One", "Two", "All the three", "None"], "A",
  "History > World History > Industrial Revolution", 25,
  "Step 1: John Kay invented the flying shuttle (correct).\nStep 2: Richard Arkwright built the water frame and James Hargreaves the spinning jenny, so II and III are interchanged.\nAnswer: (a)", pattern=CNT)

Q(124, "Consider the following statements in respect of the Rowlatt Act of 1919:\n\nI. Gandhiji launched a nationwide Satyagraha against the proposed Rowlatt Act, 1919.\nII. The Act had been hurriedly passed through the Imperial Legislative Council despite the opposition of Indian members.\nIII. The Act gave the Government enormous powers to repress political activities.\n\nWhich of the statements given above is/are correct?",
  ["I only", "III only", "I and II only", "I, II and III"], "D",
  "History > Modern History > Gandhian Movements", 20,
  "Step 1: Gandhiji launched a nationwide satyagraha against the proposed Rowlatt Act, which was hurriedly passed despite the united opposition of Indian members and allowed repression of political activity and detention without trial. All three are correct.\nAnswer: (d)", pattern=S3)

Q(125, "Consider the following statements regarding the Industrial Revolution in Britain:\n\nI. There was availability of banks which could loan money to set up industries.\nII. There was a good transport network.\n\nWhich of the statements given above is/are correct?",
  I2, "C", "History > World History > Industrial Revolution", 15,
  "Step 1: Britain had a network of banks to finance industry and a good transport network of rivers, canals and later railways. Both factors helped industrialisation.\nAnswer: (c)", pattern=S2)

Q(126, "Consider the following statements regarding the Russian Revolution:\n\nI. The incident known as 'Bloody Sunday' started a series of events known as the 1905 Revolution.\nII. Lawyers, doctors, engineers and other middle-class workers established the Union of Unions and demanded a Constituent Assembly.\n\nWhich of the statements given above is/are correct?",
  I2, "C", "History > World History > World Wars & Global Conflict", 25,
  "Step 1: Bloody Sunday (January 1905) set off the 1905 Revolution, during which professionals formed the Union of Unions and demanded a constituent assembly. Both statements are correct.\nAnswer: (c)", pattern=S2)

Q(127, "Who among the following advocated the construction of initial railways in India for facilitating army movement?",
  ["Lord Dalhousie", "Lord Lytton", "Winston Churchill", "Lord Wellesley"], "A",
  "History > Modern History > Colonial Economy", 15,
  "Step 1: Lord Dalhousie's Railway Minute of 1853 argued for railways in India, including their value for moving troops quickly.\nAnswer: (a)")

Q(128, "The large well supplying water to the Great Bath of Mohenjo-daro was located",
  ["near the drain of the tank", "at the top of one of the staircases", "in one of the adjoining rooms on the eastern side", "at the bottom of the tank in a corner"], "C",
  "History > Ancient History > Indus Valley Civilization", 40,
  "Step 1: The Great Bath was surrounded by rooms, and a large well in one of the rooms on its eastern side supplied the water.\nAnswer: (c)")

Q(129, "If you like to visit famous Jain pilgrimage sites, which of the following towns you will have to travel to?\n\nI. Moodabidri\nII. Madurai\nIII. Sonagiri\n\n" + SC,
  ["I and II only", "I and III only", "II and III only", "I, II and III"], "B",
  "History > Ancient History > Religious & Philosophical Traditions", 35,
  "Step 1: Moodabidri in Karnataka (the 'Jain Kashi') and Sonagiri in Madhya Pradesh are well-known Jain pilgrimage centres.\nStep 2: Madurai is best known for the Meenakshi temple, a Hindu shrine.\nAnswer: (b)", pattern=S3)

Q(130, "Consider the following statements with regard to bead production in Harappan towns:\n\nI. The materials used to make beads included carnelian, quartz and steatite.\nII. The beads were cylindrical, barrel-shaped and disc-shaped.\nIII. Specialized stone drills were used for making holes through the beads.\n\nWhich of the statements given above are correct?",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "D",
  "History > Ancient History > Indus Valley Civilization", 25,
  "Step 1: Harappan beads used carnelian, jasper, crystal, quartz and steatite; shapes included disc, cylindrical, spherical, barrel and segmented; specialised drills have been found at Chanhudaro, Lothal and Dholavira. All three are correct.\nAnswer: (d)", pattern=S3)

Q(131, "Consider the following statements:\n\nI. The Second Five-Year Plan sought to promote development which would establish socialistic pattern of society in India.\nII. Between 1966 and 1969, three Annual Plans were formulated.\nIII. The Ninth Five-Year Plan could not take off at its stipulated time in the 60th year of India's Independence.\n\nWhich of the statements given above are correct?",
  ["I and II only", "I and III only", "II and III only", "I, II and III"], "A",
  "Economy > Development & Welfare > Economic Planning", 35,
  "Step 1: The Second Plan aimed at a socialistic pattern of society (I), and three Annual Plans covered 1966-69 (II).\nStep 2: The Ninth Plan (1997-2002) came in the 50th year of Independence, not the 60th.\nAnswer: (a)", pattern=S3)

Q(132, "With reference to the Constitution of India, consider the following statements about the Comptroller and Auditor General (CAG) of India:\n\nI. The CAG shall be appointed by the President of India.\nII. The CAG is not eligible for further office under the Government of India after he has ceased to hold his office.\nIII. The reports of the CAG relating to the accounts of the Union shall be submitted to the Prime Minister who shall cause them to be laid before the House of the People.\n\nWhich of the statements given above are correct?",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "A",
  "Polity > Constitutional & Statutory Bodies > Constitutional Bodies", 25,
  "Step 1: Article 148 provides appointment by the President (I) and bars further government office after tenure (II).\nStep 2: Under Article 151 the reports go to the President, who has them laid before each House of Parliament, so III is wrong.\nAnswer: (a)", pattern=S3)

Q(133, "Consider the following offices:\n\nI. The Vice President of India\nII. The Governors within their respective States\nIII. The Prime Minister of India\nIV. The Speaker of the Lok Sabha\n\nWhich one of the following options represents the correct order of these offices for ceremonial occasions in the Table of Precedence as approved by the President of India?",
  ["III, I, II, IV", "I, III, II, IV", "I, III, IV, II", "III, I, IV, II"], "B",
  "Polity > Civic Institutions > Public & Political Institutions", 35,
  "Step 1: Table of Precedence: President (1), Vice-President (2), Prime Minister (3), Governors within their States (4), ..., Speaker of the Lok Sabha (6).\nAnswer: (b)", pattern="Ordering/Sequence")

Q(134, "Consider the following pairs with reference to the Constitution of India:\n\nI. Part IX A : The Municipalities\nII. Part IX B : The Cooperative Societies\nIII. Part X : Relations between the Union and States\nIV. Part XII : Finance, Property, Contracts and Suits\n\nHow many of the pairs given above are correctly matched?",
  ["One", "Two", "Three", "All the four"], "C",
  "Polity > Constitutional Framework > Constitutional Structure", 30,
  "Step 1: Part IXA (Municipalities), Part IXB (Co-operative Societies) and Part XII (Finance, Property, Contracts and Suits) are correct.\nStep 2: Part X covers the Scheduled and Tribal Areas; Union-State relations are in Part XI.\nAnswer: (c)", pattern=CNT)

Q(135, "Consider the following pairs related to the United Nations (UN) Sustainable Development Goals:\n\nI. Goal 1 : End poverty in all forms everywhere\nII. Goal 2 : Ensure healthy lives\nIII. Goal 3 : Ensure quality education\nIV. Goal 4 : Achieve gender equality\n\nHow many of the pairs given above are correctly matched?",
  ["One", "Two", "Three", "All the four"], "A",
  "Environment > Sustainable Development > Sustainable Development Frameworks", 25,
  "Step 1: SDG 1 is no poverty (correct). SDG 2 is zero hunger, SDG 3 good health and well-being, SDG 4 quality education and SDG 5 gender equality, so II to IV are wrong.\nAnswer: (a)", pattern=CNT)

Q(136, "Consider the following statements:\n\nI. A Money Bill shall not be introduced in the Rajya Sabha.\nII. The Rajya Sabha has no power to reject a Money Bill but can suggest amendment(s).\n\nWhich of the statements given above is/are correct?",
  I2, "C", "Polity > Legislature > Financial Procedure", 30,
  "Step 1: Article 109 says a Money Bill can be introduced only in the Lok Sabha (I).\nStep 2: The Rajya Sabha cannot reject it; within 14 days it may only return it with recommendations (suggested amendments), which the Lok Sabha may accept or reject (II).\nAnswer: (c)", pattern=S2)

Q(137, "Consider the following statements:\n\nI. The Constitution of India mentions that the Speaker has the power to adjourn both the Houses sine die.\nII. On prorogation, it is only the Speaker who can summon the Houses.\n\nWhich of the statements given above is/are correct?",
  I2, "D", "Polity > Legislature > Parliamentary Procedure", 30,
  "Step 1: Under Article 85 the President summons and prorogues the Houses; adjournment sine die is done by the presiding officer of each House in its own sittings, not by the Speaker for both Houses.\nStep 2: After prorogation only the President can summon the Houses. Neither statement is correct.\nAnswer: (d)", pattern=S2)

Q(138, "With reference to the United Nations (UN), consider the following pairs:\n\nUnited Nations Peacekeeping Operations : Countries\nI. UNMOGIP : India and Pakistan\nII. UNFICYP : Cyprus\nIII. UNMIK : Kosovo\nIV. UNTSO : Haiti\n\nHow many of the pairs given above are correctly matched?",
  ["One", "Two", "Three", "All the four"], "C",
  "International Relations > International Organisations > UN Procedures & Operations", 30,
  "Step 1: UNMOGIP (India-Pakistan), UNFICYP (Cyprus) and UNMIK (Kosovo) are correct.\nStep 2: UNTSO is the truce supervision mission in the Middle East, not Haiti.\nAnswer: (c)", pattern=CNT)

Q(139, "With reference to the territorial jurisdictions of High Courts in India, consider the following pairs:\n\nHigh Courts : Territorial Jurisdictions\nI. Calcutta High Court : Lakshadweep\nII. Madras High Court : Puducherry\nIII. Gauhati High Court : Manipur\nIV. Kerala High Court : Andaman and Nicobar Islands\n\nHow many of the pairs given above are correctly matched?",
  ["One", "Two", "Three", "All the four"], "A",
  "Polity > Legal & Constitutional System > Legal System & Law-Making", 35,
  "Step 1: Madras High Court covers Puducherry (correct).\nStep 2: Andaman and Nicobar is under Calcutta and Lakshadweep under Kerala, so I and IV are interchanged; Manipur has had its own High Court since 2013.\nAnswer: (a)", pattern=CNT)

Q(140, "As per Article 324 of the Constitution of India, the Chief Election Commissioner shall not be removed from his office except in like manner and on the like grounds as",
  ["a Judge of the Supreme Court", "a Judge of a High Court", "the Speaker of the Lok Sabha", "the Governor of a State"], "A",
  "Polity > Elections > Election Commission", 15,
  "Step 1: Article 324(5) protects the CEC: removal only in like manner and on like grounds as a Judge of the Supreme Court.\nAnswer: (a)")

Q(141, "With reference to defence cooperation between India and Russia, which of the following statements is/are correct?\n\nI. BrahMos Cruise Missile system is jointly developed by India's DRDO and Russia's NPO Mashinostroyeniya (NPOM).\nII. The production site of the Indo-Russia Rifles Private Limited (IRRPL) joint venture is in Korwa, Madhya Pradesh under the 'Atmanirbhar Bharat' initiative.\n\n" + SC,
  I2, "A", "Current Affairs > Defence & Security > Defence Institutions & Agreements", 35,
  "Step 1: BrahMos Aerospace is a joint venture of DRDO and NPO Mashinostroyeniya (I).\nStep 2: IRRPL's AK-203 plant is at Korwa in Amethi district, Uttar Pradesh, not Madhya Pradesh.\nAnswer: (a)", pattern=S2)

Q(142, "Which one among the following Departments is not under the Ministry of Home Affairs?",
  ["The Department of States", "The Department of Official Language", "The Department of Border Management", "The Department of Drinking Water and Sanitation"], "D",
  "Polity > Governance > Public Administration", 20,
  "Step 1: The Ministry of Home Affairs includes the Departments of Border Management, Internal Security, Home, Official Language, and States, among others.\nStep 2: The Department of Drinking Water and Sanitation is under the Ministry of Jal Shakti.\nAnswer: (d)")

Q(143, "The Atal Innovation Mission (AIM) is set up by the",
  ["Department of Science and Technology, Government of India", "NITI Aayog", "Ministry of Statistics and Programme Implementation, Government of India", "Ministry of Corporate Affairs, Government of India"], "B",
  "Economy > Development & Welfare > Economic Institutions & Policy", 10,
  "Step 1: The Atal Innovation Mission was set up in 2016 by NITI Aayog to promote innovation and entrepreneurship.\nAnswer: (b)")

Q(144, "Which one amongst the following cities has been designated as the UNESCO Creative City of Gastronomy in 2025?",
  ["Agra", "Lucknow", "Indore", "Ludhiana"], "B",
  "Current Affairs > Culture & Heritage > Heritage", 25,
  "Step 1: In 2025 UNESCO added Lucknow to its Creative Cities Network in the field of gastronomy, for its Awadhi culinary heritage.\nAnswer: (b)")

Q(145, "PM MITRA Parks relate to which one of the following industries?",
  ["Automobile", "Shipbuilding", "Textile", "Pottery"], "C",
  "Economy > Industry & Infrastructure > Manufacturing", 10,
  "Step 1: PM MITRA (Mega Integrated Textile Region and Apparel) Parks are large integrated parks for the textile and apparel industry.\nAnswer: (c)")

Q(146, "Which one of the following countries became the 11th member of ASEAN in 2025?",
  ["Timor-Leste", "Vietnam", "Brunei", "Cambodia"], "A",
  "Current Affairs > International Relations > International Groupings", 10,
  "Step 1: Timor-Leste was admitted as ASEAN's 11th member at the October 2025 summit in Kuala Lumpur.\nAnswer: (a)")

Q(147, "Who among the following is the winner of the 2024-2025 Ranji Trophy?",
  ["Vidarbha", "Kerala", "Karnataka", "Saurashtra"], "A",
  "Current Affairs > Sports > Cricket", 15,
  "Step 1: Vidarbha won the 2024-25 Ranji Trophy, on first-innings lead over Kerala in the final.\nAnswer: (a)")

Q(148, "Choose the correct set of the following cities in descending order (according to the Degree of Urbanization definitions in 2025) in terms of population.",
  ["Tokyo, Dhaka, Manila, New Delhi, Jakarta", "Jakarta, Dhaka, Tokyo, New Delhi, Manila", "Tokyo, Manila, Dhaka, Jakarta, New Delhi", "Jakarta, Tokyo, Dhaka, New Delhi, Manila"], "B",
  "Geography > Human Geography > Settlement Geography", 40,
  "Step 1: The UN's World Urbanization Prospects 2025 (Degree of Urbanization method) ranks Jakarta (41.9 million) first, then Dhaka (36.6 million), Tokyo (33.4 million), New Delhi (30.2 million), with Manila (24.7 million) further down.\nAnswer: (b)", pattern="Ordering/Sequence")

Q(149, "Consider the following countries:\n\nI. Haiti\nII. Philippines\nIII. Nicaragua\nIV. India\n\nAccording to the Climate Risk Index 2026, which of the above countries were affected by recurring extreme events during 1995-2024?",
  ["I and III only", "II and IV only", "I, II and IV only", "I, II, III and IV"], "D",
  "Current Affairs > Environment & Ecology > Climate Change", 40,
  "Step 1: Germanwatch's Climate Risk Index 2026 divides the most affected countries for 1995-2024 into those hit by rare, extreme events (such as Dominica, Myanmar, Honduras and Libya) and those hit by recurring extreme events: Haiti, the Philippines, Nicaragua and India.\nAnswer: (d)", pattern=S4)

Q(150, "Match List-I with List-II and select the correct answer using the code given below the Lists:\n\nList-I (Rescue Operations carried out by the Government of India)\nA. Operation Kaveri\nB. Operation Indravati\nC. Operation Ajay\nD. Operation Ganga\n\nList-II (Countries)\nI. Israel\nII. Haiti\nIII. Ukraine\nIV. Sudan",
  ["A-III, B-II, C-I, D-IV", "A-III, B-I, C-II, D-IV", "A-IV, B-II, C-I, D-III", "A-IV, B-I, C-II, D-III"], "C",
  "Current Affairs > Defence & Security > Military Operations", 20,
  "Step 1: Operation Kaveri (Sudan, 2023), Operation Indravati (Haiti, 2024), Operation Ajay (Israel, 2023) and Operation Ganga (Ukraine, 2022).\nAnswer: (c)", pattern=MT)
