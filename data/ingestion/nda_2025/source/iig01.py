from qfmt import Q, P, F

# NDA II 2025 General Ability Test, Set A, Part B General Knowledge, Q51-68 (booklet pages 13-17)
PH = "Science & Technology > Physics > "

Q(51, "The focal length of a concave lens is 0.5 m. The power of the lens is",
  ["+0.5 D", "-0.5 D", "+2.0 D", "-2.0 D"], "D", PH + "Geometrical & Physical Optics", 15,
  "Concept: $P=1/f$ (in metres), and a concave lens has a negative focal length.\nStep 1: $P=\\dfrac{1}{-0.5}=-2.0$ D.\nAnswer: (d)", theme="Power of a concave lens")

Q(52, "The rule to determine the direction of a force experienced by a straight current carrying conductor placed in a magnetic field which is perpendicular to it is",
  ["Right-hand thumb rule", "Fleming's left-hand rule", "Fleming's right-hand rule", "Hund's rule"], "B", PH + "Magnetism & Electromagnetism", 10,
  "Fleming's left-hand rule gives the direction of force on a current-carrying conductor in a magnetic field (motor rule). The right-hand rule gives the induced current (generator rule).\nAnswer: (b)", theme="Force on a current-carrying conductor")

Q(53, "One parsec in astronomical units (A.U.) is about",
  ["$2\\times10^{3}$ A.U.", "$2\\times10^{4}$ A.U.", "$2\\times10^{5}$ A.U.", "$2\\times10^{6}$ A.U."], "C",
  "Science & Technology > Space Technology & Astronomy > Theoretical Astronomy & Astrophysics", 35,
  "1 parsec is the distance at which 1 AU subtends 1 arc-second: $1\\text{ pc}=\\dfrac{1}{\\tan 1''}\\text{ AU}\\approx206265\\text{ AU}\\approx2\\times10^5$ AU.\nAnswer: (c)", theme="Parsec and astronomical unit")

Q(54, "Which one of the following statements for second law of motion is NOT correct?",
  ["The net force on a body is proportional to that body's acceleration", "The net force on a body is in the same direction as the acceleration",
   "The time rate of change of momentum is equal to force", "The net force on a body is proportional to that body's momentum"], "D", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "Newton's second law: $F=\\dfrac{dp}{dt}=ma$. Force is proportional to the rate of change of momentum, not to momentum itself.\nAnswer: (d)", theme="Newton's second law")

Q(55, "The temperature of a body increases from 310 K to 340 K. The temperature increase in degree Celsius is",
  ["20°C", "30°C", "37°C", "67°C"], "B", PH + "Thermodynamics, Heat & Kinetic Theory", 10,
  "A change of 1 K equals a change of 1°C, so a rise of $340-310=30$ K is a rise of 30°C.\nAnswer: (b)", theme="Temperature differences in K and °C")

Q(56, "Which one of the following statements for the work done by gravity on a body is NOT correct?",
  ["Work done is independent of the path followed by the body", "Work done depends only on the vertical distance separating the initial and the final position of the body",
   "Work done depends on the path followed by the body", "Work done is zero if the body is displaced horizontally to the force of gravity"], "C", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "Gravity is a conservative force: its work depends only on the change in height, not on the path. So (c) is the incorrect statement.\nAnswer: (c)", theme="Work done by a conservative force")

Q(57, "Which one among the following statements is correct?",
  ["Pressure has magnitude as well as direction", "As we go deeper in a liquid, the pressure decreases",
   "Action and reaction forces act on the same object", "Pascal and N/m$^{2}$ represent the same unit"], "D", PH + "Fluid Mechanics & Properties of Fluids", 15,
  "Pressure is a scalar; it increases with depth; action and reaction act on different bodies. 1 Pa is defined as 1 N/m$^2$.\nAnswer: (d)", theme="Pressure basics")

Q(58, "Which one of the following wavelength radiations may correspond to an X-ray?",
  ["1 nm", "10 nm", "100 nm", "300 nm"], "A", PH + "Waves, Acoustics & Electromagnetic Spectrum", 25,
  "X-rays span roughly 0.01 nm to 10 nm, with typical values around 0.1-1 nm. 100 nm and 300 nm are ultraviolet, and 10 nm is at the UV/X-ray boundary. 1 nm is clearly an X-ray.\nAnswer: (a)", theme="X-ray wavelength range")

Q(59, "In a Telescope, compared to the eyepiece lens the objective lens has",
  ["larger focal length and larger aperture", "larger focal length and smaller aperture", "smaller focal length and larger aperture", "smaller focal length and smaller aperture"], "A", PH + "Geometrical & Physical Optics", 20,
  "A telescope objective has a long focal length (for magnification $f_o/f_e$) and a large aperture to gather light.\nAnswer: (a)", theme="Telescope objective lens")

Q(60, "The energy, $E$, of a photon can be expressed as $E=hf$ where $f$ is the frequency and $h$ is Planck's constant. The dimensions of $h$ are the same as that of",
  ["linear momentum", "angular momentum", "displacement", "torque"], "B", PH + "Units, Dimensions & Measurement", 30,
  "$h=E/f$ has units J s $=$ kg m$^2$ s$^{-1}$, which are the units of angular momentum ($mvr$).\nAnswer: (b)", theme="Dimensions of Planck's constant")

Q(61, "The work done by the force acting on an object is zero if the displacement of the object",
  ["is in the opposite direction of the direction of force", "is in the same direction of the direction of force", "is in perpendicular direction of the direction of force", "none of above"], "C", PH + "Classical Mechanics, Motion & Gravitation", 10,
  "$W=Fd\\cos\\theta$ is zero when $\\theta=90^\\circ$.\nAnswer: (c)", theme="Zero work")

Q(62, "The magnetic field inside a current carrying very long solenoid is",
  ["Uniform", "Non-uniform", "Zero", "Highest at mid-point"], "A", PH + "Magnetism & Electromagnetism", 15,
  "Inside a long solenoid the field lines are parallel and evenly spaced: $B=\\mu_0nI$ is uniform.\nAnswer: (a)", theme="Field inside a solenoid")

Q(63, "Which one of the following instruments can be used to measure -250°C temperature?",
  ["By using a mercury based thermometer", "By using an alcohol based thermometer", "By using a clinical thermometer", "By using thermocouple based thermometer"], "D", PH + "Thermodynamics, Heat & Kinetic Theory", 25,
  "Mercury freezes at about -39°C and alcohol at about -114°C; a clinical thermometer covers only 35-42°C. Thermocouples work down to cryogenic temperatures near -270°C.\nAnswer: (d)", theme="Measuring very low temperatures")

Q(64, "The quantity of heat needed to change unit mass of a substance from liquid to vapour without changing the temperature, is called",
  ["specific heat", "specific latent heat", "thermal capacity", "heat energy"], "B", PH + "Thermodynamics, Heat & Kinetic Theory", 10,
  "Heat absorbed per unit mass during a change of state at constant temperature is the specific latent heat (here, of vaporisation).\nAnswer: (b)", theme="Latent heat of vaporisation")

Q(65, 'The temperature at which "vapour pressure of the liquid in an open vessel becomes equal to the atmospheric pressure" is called',
  ["Melting point", "Boiling point", "Liquid point", "None of the above"], "B", PH + "Thermodynamics, Heat & Kinetic Theory", 10,
  "A liquid boils when its vapour pressure equals the surrounding pressure.\nAnswer: (b)", theme="Boiling point definition")

Q(66, "Which one of the following statements about surface tension is correct?",
  ["It increases when temperature increases", "It decreases when temperature increases", "It will remain same with increase or decrease of temperature", "It will always decrease with increase or decrease of temperature"], "B",
  PH + "Fluid Mechanics & Properties of Fluids", 15,
  "Rising temperature weakens intermolecular cohesion, so surface tension falls as temperature rises.\nAnswer: (b)", theme="Surface tension and temperature")

Q(67, "A body sinks in water when",
  ["density of water is greater than density of body", "density of water is less than density of body", "density of water is equal to density of body", "the body is heavy"], "B", PH + "Fluid Mechanics & Properties of Fluids", 10,
  "A body sinks when its weight exceeds the buoyant force, i.e. when its density is greater than that of water.\nAnswer: (b)", theme="Sinking and floating")

Q(68, "Why a fielder in the ground gradually pulls his hands backward while catching a fast moving cricket ball?",
  ["To reduce the acceleration of the ball", "To increase the acceleration of the ball", "To increase the velocity of the ball", "None of above"], "A", PH + "Classical Mechanics, Motion & Gravitation", 20,
  "Pulling the hands back increases the time taken to stop the ball. The same change in momentum over a longer time means a smaller deceleration and therefore a smaller force on the hands.\nAnswer: (a)", theme="Impulse and catching a ball")
