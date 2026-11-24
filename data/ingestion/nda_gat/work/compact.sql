with b as (select id from dp_ingest.batches where batch_code='NDA_2026_II_GAT_GK_SET_A'),
v(n,qt,a,b_,c,d,k,subj,top,sub,th,pat,ex,cs,df,neg) as (values
(51,$q$A bicycle racing track is a level circular road of radius 10 m. Three cyclists P, Q and R with identical cycles are cycling on the track with speeds 2 m/s, 3 m/s and 5 m/s respectively. If the coefficient of friction between the tyres and the road is 0.1, then which cyclist will slip? (Take g = 10 m/s²)$q$,$q$P only$q$,$q$Q only$q$,$q$R only$q$,$q$All will slip$q$,'C',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Maximum speed on a flat circular track$q$,$q$Single MCQ$q$,$q$Concept: friction supplies the centripetal force, so the maximum safe speed is $v_{max}=\sqrt{\mu rg}$.
Step 1: $v_{max}=\sqrt{0.1\times10\times10}=\sqrt{10}\approx3.16$ m/s.
Step 2: P (2) and Q (3) are below this; R (5) is above, so only R slips.
Answer: (c)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(52,$q$The bob of a simple pendulum is displaced from its mean position and then released from rest 0.20 m above its mean position. What is the speed of the bob as it passes through the mean position? (Take g = 10 m/s²)$q$,$q$0 m/s$q$,$q$1 m/s$q$,$q$2 m/s$q$,$q$√10 m/s$q$,'C',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Energy conservation in a pendulum$q$,$q$Single MCQ$q$,$q$Concept: potential energy converts to kinetic energy.
$v=\sqrt{2gh}=\sqrt{2\times10\times0.20}=2$ m/s.
Answer: (c)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'E',false),
(53,$q$A tennis ball of mass 350 g is thrown vertically upwards at a speed of 4 m/s. If M is the maximum gravitational potential energy of the ball and H is the maximum height it reaches, then which one of the following is correct? (Take g = 10 m/s²)$q$,$q$M = 5.6 J, H = 1.6 m$q$,$q$M = 2.8 J, H = 1.6 m$q$,$q$M = 5.6 J, H = 0.8 m$q$,$q$M = 2.8 J, H = 0.8 m$q$,'D',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Maximum height and potential energy of a thrown ball$q$,$q$Single MCQ$q$,$q$Step 1: $H=\frac{v^2}{2g}=\frac{16}{20}=0.8$ m.
Step 2: $M=mgH=0.35\times10\times0.8=2.8$ J.
Answer: (d)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'E',false),
(54,$q$Which of the following is correct regarding the total internal reflection at the interface between two different optical media?$q$,$q$The phenomenon of total internal reflection can occur only if light is passing at any angle from a medium of low refractive index to a medium of high refractive index.$q$,$q$The phenomenon of total internal reflection can occur only if light is passing from a medium of high refractive index to a medium of low refractive index and at an angle greater than the critical angle.$q$,$q$The phenomenon of total internal reflection can occur only if light is passing at any angle from a medium of high refractive index to a medium of low refractive index.$q$,$q$The phenomenon of total internal reflection can occur only if light is passing from a medium of low refractive index to a medium of high refractive index and at an angle greater than the critical angle.$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Geometrical & Physical Optics$q$,$q$Conditions for total internal reflection$q$,$q$Single MCQ$q$,$q$Concept: total internal reflection needs light going from a denser to a rarer medium with the angle of incidence greater than the critical angle.
Only (b) states both conditions.
Answer: (b)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'E',false),
(55,$q$Consider the following statements:
I. The weight of an object is the same everywhere on the surface of the Earth, but its inertial mass could be different.
II. The inertial mass and gravitational mass of an object are proportional and the proportionality constant is the same everywhere.
III. The inertial mass and weight of an object are the same at different places on Earth.
Which of the statements given above is/are correct?$q$,$q$I only$q$,$q$II only$q$,$q$I and II$q$,$q$II and III$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Inertial mass, gravitational mass and weight$q$,$q$3-Statement Combination$q$,$q$I: weight varies slightly with place (g changes) while inertial mass is constant, so I is false.
II: inertial and gravitational mass are proportional with a universal constant (equivalence principle): true.
III: weight differs between places: false.
Answer: (b)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(56,$q$Consider the following:
I. Gravitational field due to a spherical body
II. Electrostatic field due to a point charge
III. Strong nuclear force field due to a proton
IV. Magnetic field due to a bar magnet
How many of the above follow the inverse square law?$q$,$q$One$q$,$q$Two$q$,$q$Three$q$,$q$All four$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Fields that obey the inverse square law$q$,$q$Statement Count$q$,$q$I and II follow the inverse square law (outside the source).
III: the strong force is short-ranged and does not follow it.
IV: a bar magnet's far field falls as $1/r^3$ (dipole).
Two follow it.
Answer: (b)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(57,$q$While pouring water slowly from a jug, a general observation is that a water layer usually flows along the side of the jug. Which property of water among the following is responsible for this phenomenon?$q$,$q$Surface tension$q$,$q$Relatively low vapour pressure at room temperature$q$,$q$Negligible compressibility$q$,$q$Low viscosity at room temperature$q$,'A',$q$Science & Technology$q$,$q$Physics$q$,$q$Fluid Mechanics & Properties of Fluids$q$,$q$Teapot effect$q$,$q$Single MCQ$q$,$q$Concept: the 'teapot effect' occurs because of cohesion and adhesion of the water layer at the surface; of the listed properties, surface tension is responsible.
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(58,$q$A fish is at a depth d in water of refractive index 4/3. If a transparent slab of refractive index 3/2 and thickness d/2 is placed on the surface of water, then which one of the following is the apparent depth of the fish as observed by an observer in air?$q$,$q$d/2$q$,$q$5d/8$q$,$q$13d/12$q$,$q$17d/24$q$,'C',$q$Science & Technology$q$,$q$Physics$q$,$q$Geometrical & Physical Optics$q$,$q$Apparent depth through layered media$q$,$q$Single MCQ$q$,$q$Concept: apparent depth of each layer = real thickness / refractive index.
Step 1: water layer: $\frac{d}{4/3}=\frac{3d}4$.
Step 2: slab: $\frac{d/2}{3/2}=\frac d3$.
Step 3: total $=\frac{3d}4+\frac d3=\frac{13d}{12}$.
Answer: (c)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(59,$q$A particle of mass m moves along x-direction under the force F(x) = F₀(1 − x/L) for 0 ≤ x ≤ L. If the particle starts from rest at x = 0, then what is the speed (v) of the particle at x = L?$q$,$q$√(2F₀L/m)$q$,$q$√(F₀L/m)$q$,$q$√(F₀L/2m)$q$,$q$v = 0$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Work-energy theorem with a variable force$q$,$q$Single MCQ$q$,$q$Step 1: work done $=\int_0^LF_0\left(1-\frac xL\right)dx=\frac{F_0L}2$.
Step 2: $\frac12mv^2=\frac{F_0L}2\Rightarrow v=\sqrt{\frac{F_0L}m}$.
Answer: (b)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(60,$q$A narrow tunnel passes through the centre of a planet of radius R and uniform mass density ρ. A particle is released into the tunnel. What is the angular frequency of oscillation of the particle (ω) equal to? (Symbols carry their usual meaning)$q$,$q$√(4πGρ/3)$q$,$q$√(2πGρ/3)$q$,$q$ω = ∞$q$,$q$ω = 0$q$,'A',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Oscillation through a tunnel in a uniform planet$q$,$q$Single MCQ$q$,$q$Concept: inside a uniform planet, $g(r)=\frac43\pi G\rho r$, which is linear in $r$ so the motion is simple harmonic.
$\omega^2=\frac43\pi G\rho\Rightarrow\omega=\sqrt{\frac{4\pi G\rho}3}$.
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(61,$q$On a rainy day, rain drops fall vertically with speed v. An observer is moving towards east with speed v, while another observer moves towards north with the same speed v. What is the angle between apparent rain directions observed by them?$q$,$q$0°$q$,$q$30°$q$,$q$45°$q$,$q$60°$q$,'D',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Relative velocity of rain$q$,$q$Single MCQ$q$,$q$Relative velocities of rain are $(-v,0,-v)$ and $(0,-v,-v)$ (east, north, down).
$\cos\theta=\frac{v^2}{2v^2}=\frac12\Rightarrow\theta=60^\circ$.
Answer: (d)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(62,$q$What is the minimum horizontal speed given to the bob of a simple pendulum of length 50 cm so that it describes a complete circle? (Take g = 10 m/s²)$q$,$q$5 m/s$q$,$q$7.5 m/s$q$,$q$10 m/s$q$,$q$12.5 m/s$q$,'A',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Vertical circular motion$q$,$q$Single MCQ$q$,$q$Concept: for a complete circle with a string, the speed at the bottom must be at least $\sqrt{5gL}$.
$\sqrt{5\times10\times0.5}=5$ m/s.
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(63,$q$Two conducting wires made of the same material have lengths L and 1.2 L. If the volume of the longer wire is half that of the shorter wire, then what is the electric resistance of the longer wire in comparison with the shorter wire?$q$,$q$288% larger$q$,$q$200% larger$q$,$q$188% larger$q$,$q$108% larger$q$,'C',$q$Science & Technology$q$,$q$Physics$q$,$q$Electricity & Electric Circuits$q$,$q$Resistance of wires of different geometry$q$,$q$Single MCQ$q$,$q$Concept: $R=\rho\frac{\ell}{A}=\rho\frac{\ell^2}{V}$.
Step 1: $\frac{R_2}{R_1}=\frac{(1.2)^2}{1}\times\frac{V_1}{V_2}=1.44\times2=2.88$.
Step 2: the longer wire's resistance is 2.88 times, i.e. 188% larger.
Answer: (c)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(64,$q$A biconvex lens is made of a material of refractive index 2 such that the ratio of the radii of curvature of its two faces is 1 : 2. A point source in air is placed on the principal axis of this lens at a distance u from the lens. Which one of the following is correct if the image is formed exactly at the same distance as that of the point source? (where R is the radius of curvature of the first face)$q$,$q$u = R$q$,$q$u = 2R$q$,$q$2u = 3R$q$,$q$3u = 4R$q$,'D',$q$Science & Technology$q$,$q$Physics$q$,$q$Geometrical & Physical Optics$q$,$q$Lens maker's formula and image distance$q$,$q$Single MCQ$q$,$q$Step 1: $\frac1f=(2-1)\left(\frac1R+\frac1{2R}\right)=\frac3{2R}\Rightarrow f=\frac{2R}3$.
Step 2: image at the same distance as the object means $u=v=2f=\frac{4R}3$.
So $3u=4R$.
Answer: (d)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'H',false),
(65,$q$In a carrom game, a striker of mass 15 g hits a coin of mass 5 g head on and the coin moves with a speed of 0.36 m/s. If the time of contact between the striker and the coin is 3 milliseconds, then what is the average force applied by the striker on the coin?$q$,$q$0.72 N$q$,$q$0.60 N$q$,$q$0.54 N$q$,$q$0.30 N$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Impulse-momentum on the coin$q$,$q$Single MCQ$q$,$q$Concept: average force $=\frac{\Delta p}{t}$ on the coin.
$F=\frac{0.005\times0.36}{0.003}=0.60$ N.
Answer: (b)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(66,$q$A hollow prism is filled with water of refractive index 1.34 and white light is incident on the prism. The white light is assumed to have wavelengths ranging from 4020 Å to 6700 Å. What is the corresponding wavelength range in water?$q$,$q$3000 Å to 5000 Å$q$,$q$4020 Å to 6700 Å$q$,$q$5000 Å to 7000 Å$q$,$q$5386 Å to 8978 Å$q$,'A',$q$Science & Technology$q$,$q$Physics$q$,$q$Geometrical & Physical Optics$q$,$q$Wavelength in a medium$q$,$q$Single MCQ$q$,$q$Concept: $\lambda_{medium}=\frac{\lambda_{air}}{n}$.
$\frac{4020}{1.34}=3000$ Å and $\frac{6700}{1.34}=5000$ Å.
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'E',false),
(67,$q$A heating filament and an ideal resistor of fixed value are connected in series with a DC voltage source. After some time, the filament has reached its operating point so that the current in the circuit is steady. Which one of the following is correct?$q$,$q$The steady current is larger than the initial value.$q$,$q$The steady voltage across the ideal resistor decreases as compared to its initial value.$q$,$q$Overall resistance of the circuit decreases.$q$,$q$Power dissipation through the filament increases as compared to its initial value.$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Electricity & Electric Circuits$q$,$q$Resistance of a heated filament$q$,$q$Single MCQ$q$,$q$Concept: a metallic filament's resistance rises with temperature.
Step 1: so the total resistance increases and the steady current is lower than at switch-on.
Step 2: the voltage across the fixed resistor ($IR$) therefore falls.
Answer: (b)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'H',false),
(68,$q$Two astronauts X and Y float in deep space far from external forces. Initially, they are at rest relative to one another. X throws a tool towards Y. Consider the two astronauts and the tool as one system. Which one of the following statements is correct?$q$,$q$The centre of mass of the system moves towards Y.$q$,$q$X moves and the centre of mass of the system follows him.$q$,$q$The centre of mass follows the tool.$q$,$q$The centre of mass remains fixed.$q$,'D',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Centre of mass with no external force$q$,$q$Single MCQ$q$,$q$Concept: with no external force, the centre of mass of the system keeps its state of rest.
Internal forces cannot move it.
Answer: (d)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'E',false),
(69,$q$A uniform rope hangs symmetrically over a smooth pulley. One end of the rope is given a slight mass, making that side slightly heavier. Which one of the following is correct?$q$,$q$As the rope starts moving, every point on the rope has the same acceleration.$q$,$q$As the rope starts moving, every point on the rope has the same speed, but not the same acceleration.$q$,$q$As the rope starts moving, the tension remains the same throughout the rope.$q$,$q$As the rope starts moving, the centre of mass remains stationary.$q$,'A',$q$Science & Technology$q$,$q$Physics$q$,$q$Classical Mechanics, Motion & Gravitation$q$,$q$Rope over a pulley$q$,$q$Single MCQ$q$,$q$Concept: an inextensible rope moves as a whole, so every point has the same speed and the same acceleration magnitude.
(b) contradicts this; (c) is false because tension varies along a rope with mass; (d) is false because the centre of mass moves downward on the heavier side.
Key (a) is the intended reading (same magnitude, direction along the rope).
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'H',false),
(70,$q$An insulating container contains 250 g of water at 20°C. Steam at 100°C is passed through it, heating it up to 25°C. During this process, part of the steam also gets condensed, raising the mass of water to 252 g. If the specific heat of water is 1 Cal g⁻¹ °C⁻¹, then what is the value of the latent heat of steam?$q$,$q$530 Cal/g$q$,$q$540 Cal/g$q$,$q$550 Cal/g$q$,$q$560 Cal/g$q$,'C',$q$Science & Technology$q$,$q$Physics$q$,$q$Thermodynamics, Heat & Kinetic Theory$q$,$q$Calorimetry with steam$q$,$q$Single MCQ$q$,$q$Step 1: heat gained by the water $=250\times1\times5=1250$ Cal.
Step 2: 2 g of steam condensed, giving $2L+2\times1\times(100-25)=1250$.
Step 3: $2L=1100\Rightarrow L=550$ Cal/g.
Answer: (c)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(71,$q$Three parallel glass slabs of refractive indices 1.5, √3 and 1.5 respectively have widths 2 mm, 1 mm and 4 mm. The combination is in air. Light is incident at the first slab at an angle of incidence π/3. What is the angle with respect to the normal at which the light will emerge from the final surface?$q$,$q$π/6$q$,$q$π/4$q$,$q$π/3$q$,$q$π/12$q$,'C',$q$Science & Technology$q$,$q$Physics$q$,$q$Geometrical & Physical Optics$q$,$q$Refraction through parallel slabs$q$,$q$Single MCQ$q$,$q$Concept: by Snell's law across parallel faces, $n_1\sin\theta_1=n_2\sin\theta_2=\dots$, so the product $n\sin\theta$ is constant.
The light starts and ends in air, so the emergent angle equals the incident angle, $\frac\pi3$ (no total internal reflection occurs inside since $\sin\theta<1$ in every slab).
Answer: (c)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(72,$q$Consider three wires X, Y and Z of the same length such that the ratio of their conductivities is 1 : 2 : 3. Further, the cross-sectional area of wire Z is twice that of Y and the resistance of X is equal to the resistance of Z. What is the ratio of the resistance of Y to that of X?$q$,$q$1 : 1$q$,$q$3 : 1$q$,$q$2 : 1$q$,$q$1 : 2$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Electricity & Electric Circuits$q$,$q$Resistance from conductivity and area$q$,$q$Single MCQ$q$,$q$Concept: $R=\frac{\ell}{\sigma A}$.
Step 1: $R_X=R_Z\Rightarrow\frac1{1\cdot A_X}=\frac1{3\cdot2A_Y}\Rightarrow A_X=6A_Y$.
Step 2: $\frac{R_Y}{R_X}=\frac{1/(2A_Y)}{1/A_X}=\frac{A_X}{2A_Y}=3$.
Answer: (b) 3 : 1$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(73,$q$Two point charges of 4 C and 16 C are kept at a distance of 0.18 m. A third point charge of 1 C is kept between them such that the potential energy of the system is minimum. What is the magnitude of the electric field at the 1 C charge?$q$,$q$0$q$,$q$(1/4πε₀)(1/9) N C⁻¹$q$,$q$(1/4πε₀)(2/9) N C⁻¹$q$,$q$(1/4πε₀)(1/18) N C⁻¹$q$,'A',$q$Science & Technology$q$,$q$Physics$q$,$q$Electricity & Electric Circuits$q$,$q$Equilibrium point between two charges$q$,$q$Single MCQ$q$,$q$Concept: the potential energy is minimum at the equilibrium point, where the net force (hence field) on the third charge is zero.
The point lies at 0.06 m from the 4 C charge ($\frac{x}{0.18-x}=\sqrt{\frac4{16}}$).
Field $=0$.
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(74,$q$Consider the following statements in respect of sound waves:
I. The speed of sound waves decreases with an increase in temperature if the atmospheric pressure remains the same.
II. The speed of sound waves increases with increasing humidity if the atmospheric pressure remains the same.
III. The speed of sound waves is not affected by a change in atmospheric pressure, provided the temperature is kept constant.
Which of the statements given above are correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'B',$q$Science & Technology$q$,$q$Physics$q$,$q$Waves, Acoustics & Electromagnetic Spectrum$q$,$q$Factors affecting the speed of sound$q$,$q$3-Statement Combination$q$,$q$I: speed rises with temperature (false).
II: humid air is less dense, so speed rises (true).
III: at constant temperature, speed is independent of pressure (true).
Answer: (b)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'M',false),
(75,$q$Consider the following statements:
Statement-I: Marine animals remain alive in winter and move near the bottom of lakes despite frozen water on the surface.
Statement-II: The density of water is maximum at 4°C and water at the bottom of lakes remains warm in winter.
Which one of the following is correct in respect of the above statements?$q$,$q$Both Statement-I and Statement-II are correct and Statement-II explains Statement-I.$q$,$q$Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I.$q$,$q$Statement-I is correct, but Statement-II is not correct.$q$,$q$Statement-I is not correct, but Statement-II is correct.$q$,'A',$q$Science & Technology$q$,$q$Physics$q$,$q$Thermodynamics, Heat & Kinetic Theory$q$,$q$Anomalous expansion of water$q$,$q$Assertion-Reason$q$,$q$Water is densest at 4°C, so the densest water sinks and stays at about 4°C at the bottom while the top freezes.
This keeps a liquid, relatively warm layer where animals survive.
Both statements are correct and II explains I.
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'E',false),
(76,$q$Consider the following statements regarding oxidation numbers:
I. The oxidation number of oxygen in peroxides and superoxides is assigned as −1 and −1/2 respectively.
II. In all its compounds, fluorine has an oxidation number of −1.
III. In a reduction half-reaction, the oxidation number of the reductant decreases.
Which of the statements given above are correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'A',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Reactions, Stoichiometry & Energetics$q$,$q$Oxidation number rules$q$,$q$3-Statement Combination$q$,$q$I and II are standard rules.
III is wrong: in a reduction half-reaction the oxidation number of the oxidant (the species being reduced) decreases, not that of the reductant.
Answer: (a)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(77,$q$Consider the following statements regarding the properties of hydrogen and water:
I. Tritium, the isotope of hydrogen, is radioactive and emits low energy alpha particles.
II. In the gas phase, the structure of water is linear.
III. The basic principle of a hydrogen economy is the transportation and storage of energy in the form of liquid or gaseous molecular hydrogen.
Which of the statements given above is/are not correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$II only$q$,'A',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Atomic Structure, Isotopes & Periodicity$q$,$q$Properties of hydrogen isotopes and water$q$,$q$3-Statement Combination$q$,$q$I is wrong: tritium emits low-energy beta particles, not alpha particles.
II is wrong: gaseous water is bent (V-shaped), not linear.
III is correct.
Statements I and II are not correct.
Answer: (a)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(78,$q$Consider the following statements regarding nitrogen:
I. Nitrogen contains a triple bond.
II. Nitrogen is a triatomic gas.
III. Forces acting between nitrogen molecules are weak van der Waals forces.
Which of the statements given above are correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'C',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Bonding & Molecular Structure$q$,$q$Structure and bonding of nitrogen$q$,$q$3-Statement Combination$q$,$q$N₂ has a triple bond (I true), is diatomic (II false) and has weak van der Waals forces between molecules (III true).
Answer: (c)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'E',false),
(79,$q$In a dry test tube, 2 mL of HCl (0.1 N) is taken. To this, 4 mL of NaOH (0.1 N) is added. The solution is stirred well, followed by the addition of 2 drops of phenolphthalein. What will be the colour of the solution?$q$,$q$Colourless$q$,$q$Red$q$,$q$Pink$q$,$q$Blue$q$,'C',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Acids, Bases, pH & Commercial Inorganic Salts$q$,$q$Neutralisation and indicator colour$q$,$q$Single MCQ$q$,$q$Step 1: HCl gives $2\times0.1=0.2$ meq; NaOH gives $4\times0.1=0.4$ meq.
Step 2: NaOH is in excess by 0.2 meq, so the solution is basic.
Step 3: phenolphthalein is pink in basic solution.
Answer: (c)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(80,$q$Consider the following statements:
I. Zinc metal, when treated with both HCl (aq.) and NaOH (aq.) separately, produces molecular hydrogen.
II. An aqueous copper sulphate solution cannot be kept in a zinc vessel.
III. Lemon, tamarind and tomato are natural sources of citric acid, oxalic acid and tartaric acid, respectively.
Which of the statements given above are correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'A',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Metals, Non-Metals & Metallurgy$q$,$q$Reactions of zinc and natural acids$q$,$q$3-Statement Combination$q$,$q$I: Zn reacts with both acid and alkali to give H₂ (true).
II: zinc displaces copper from CuSO₄ (true).
III: tamarind contains tartaric acid and tomato contains oxalic acid, so the pairing is wrong.
Answer: (a)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(81,$q$Consider the following statements:
I. A solution of iodine in ethanol known as 'tincture of iodine' is a heterogeneous mixture.
II. A suspension is a heterogeneous mixture and its particles scatter a beam of light passing through it, making its path visible.
III. A colloidal solution, although it appears homogeneous, is a heterogeneous mixture.
Which of the statements given above are correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'B',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Composition & Classification$q$,$q$Solutions, suspensions and colloids$q$,$q$3-Statement Combination$q$,$q$I is false: tincture of iodine is a true solution (homogeneous).
II: suspensions are heterogeneous and their particles scatter light (true).
III: a colloid looks homogeneous but is heterogeneous (true).
Answer: (b)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(82,$q$Consider the following statements:
I. A 30% solution of hydrogen peroxide is marketed as '10 volume' H₂O₂.
II. In the compound copper sulphate pentahydrate, all the five water molecules are hydrogen bonded.
Which of the statements given above is/are correct?$q$,$q$I only$q$,$q$II only$q$,$q$Both I and II$q$,$q$Neither I nor II$q$,'D',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Bonding & Molecular Structure$q$,$q$Hydrogen peroxide strength and hydrated copper sulphate$q$,$q$2-Statement Combination$q$,$q$I is false: a 30% (w/v) solution is marketed as '100 volume' H₂O₂; '10 volume' is about 3%.
II is false: four water molecules are coordinated to Cu²⁺ and only the fifth is hydrogen bonded.
Answer: (d)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'H',false),
(83,$q$Consider the following statements:
I. The leaves of nettle, a herbaceous plant, cause painful stings when touched accidentally because of the secretion of formic acid.
II. When gypsum is heated at 100°C, it forms calcium carbonate hemihydrate, called Plaster of Paris.
III. When moistened with water, anhydrous copper sulphate forms a green-coloured copper sulphate dihydrate.
Which of the statements given above is/are correct?$q$,$q$I only$q$,$q$III only$q$,$q$II and III$q$,$q$I and II$q$,'A',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Industrial, Materials & Applied Chemistry$q$,$q$Everyday chemistry of formic acid, gypsum and copper sulphate$q$,$q$3-Statement Combination$q$,$q$I: nettle stings contain methanoic (formic) acid (true).
II: heated gypsum gives calcium sulphate hemihydrate, not carbonate (false).
III: anhydrous copper sulphate turns blue as the pentahydrate forms (false).
Answer: (a)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(84,$q$Consider the following pairs:
I. Fe(s) + CuSO₄(aq.) → FeSO₄(aq.) + Cu(s): Displacement reaction
II. Na₂SO₄(aq.) + BaCl₂(aq.) → BaSO₄(s) + 2NaCl(aq.): Double displacement reaction
III. Fe₂O₃(s) + 3CO(g) → 2Fe(s) + 3CO₂(g): Redox reaction
IV. 2KClO₃(s) → 2KCl(s) + 3O₂(g): Thermal decomposition reaction
How many of the pairs given above are correctly matched?$q$,$q$One$q$,$q$Two$q$,$q$Three$q$,$q$All four$q$,'D',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Reactions, Stoichiometry & Energetics$q$,$q$Types of chemical reactions$q$,$q$Statement Count$q$,$q$I: iron displaces copper (displacement).
II: ions exchange partners and BaSO₄ precipitates (double displacement).
III: CO is oxidised and Fe₂O₃ is reduced (redox).
IV: KClO₃ decomposes on heating.
All four are correct.
Answer: (d)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'E',false),
(85,$q$What are the approximate percentages by mass of nitrogen and hydrogen respectively in urea?$q$,$q$43% and 5%$q$,$q$47% and 5%$q$,$q$43% and 7%$q$,$q$47% and 7%$q$,'D',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Composition & Classification$q$,$q$Percentage composition of urea$q$,$q$Single MCQ$q$,$q$Urea is CO(NH₂)₂ with molar mass 60 g/mol.
N: $\frac{28}{60}=46.7\%\approx47\%$. H: $\frac{4}{60}=6.7\%\approx7\%$.
Answer: (d)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(86,$q$Coconut oil upon hydrolysis with potassium hydroxide gives:$q$,$q$Free fatty acids and sodium hydroxide$q$,$q$Glycerol and sodium salts of fatty acids$q$,$q$Glycol and potassium salts of fatty acids$q$,$q$Glycerol and potassium salts of fatty acids$q$,'D',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Organic Chemistry & Carbon Compounds$q$,$q$Saponification of an oil$q$,$q$Single MCQ$q$,$q$Concept: oils and fats are triglycerides; alkaline hydrolysis (saponification) gives glycerol plus the salt of the fatty acids from the base used.
With KOH the salts are potassium salts.
Answer: (d)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'E',false),
(87,$q$Consider the following statements regarding hydrogen bonds:
I. Hydrogen bonds can only form when hydrogen is bonded to oxygen, nitrogen or fluorine.
II. Hydrogen bonds are intramolecular only.
III. The strength of a hydrogen bond decreases with a decrease in the electronegativity of the two bonded atoms.
Which of the statements given above is/are not correct?$q$,$q$I only$q$,$q$II only$q$,$q$I and II$q$,$q$II and III$q$,'B',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Bonding & Molecular Structure$q$,$q$Hydrogen bonding$q$,$q$3-Statement Combination$q$,$q$I is the standard textbook condition (H bonded to N, O or F), so it is taken as correct.
II is wrong: hydrogen bonds are both intermolecular and intramolecular.
III is correct: lower electronegativity gives a weaker bond.
Only II is not correct.
Answer: (b)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'H',false),
(88,$q$Ionic compounds have high melting and boiling points. This is due to:$q$,$q$the presence of strong electrostatic forces between ions in the crystal lattice.$q$,$q$the weak intermolecular van der Waals forces.$q$,$q$the presence of a 'sea of delocalized electrons'.$q$,$q$lower lattice energy.$q$,'A',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Bonding & Molecular Structure$q$,$q$Properties of ionic compounds$q$,$q$Single MCQ$q$,$q$Ionic solids are held by strong electrostatic attraction between oppositely charged ions in the lattice, and a large lattice energy must be overcome to melt them.
Answer: (a)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'E',false),
(89,$q$Which of the following statements is/are correct in respect of Portland cement?
I. Adding more water (higher water-cement ratio) accelerates the initial setting time of cement.
II. The addition of a small percentage of gypsum gives the desired retardation.
III. Gypsum is added during manufacturing to accelerate the setting time of cement.$q$,$q$I and II$q$,$q$I and III$q$,$q$I only$q$,$q$II only$q$,'D',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Industrial, Materials & Applied Chemistry$q$,$q$Setting of Portland cement$q$,$q$3-Statement Combination$q$,$q$Gypsum is added to retard (slow) the setting, so II is true and III is false.
A higher water-cement ratio delays, not accelerates, setting, so I is false.
Answer: (d)$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'M',false),
(90,$q$Consider the following pairs:
I. Cloud: Aerosol
II. Mud: Sol
III. Milk: Emulsion
IV. Rubber: Foam
How many of the pairs given above are correctly matched?$q$,$q$One$q$,$q$Two$q$,$q$Three$q$,$q$All four$q$,'D',$q$Science & Technology$q$,$q$Chemistry$q$,$q$Chemical Composition & Classification$q$,$q$Types of colloids$q$,$q$Statement Count$q$,$q$Cloud is a liquid-in-gas aerosol; mud is a solid-in-liquid sol; milk is a liquid-in-liquid emulsion; foam rubber is a solid foam (gas dispersed in a solid).
All four pairs are acceptable.
Answer: (d). Medium confidence: the rubber pair is the weak link.$q$,$q$COMP.SNT.CHEMISTRY|SRC.NCERT.SCIENCE$q$,'H',false),
(91,$q$Consider the following statements in relation to respiration in animals:
I. Glucose breaks down into pyruvate in the cytoplasm of all cells in both aerobic and anaerobic conditions.
II. The energy released during anaerobic respiration is greater than the energy released in aerobic respiration.
III. Carbon dioxide is released only in aerobic respiration.
Which of the statements given above is/are correct?$q$,$q$I only$q$,$q$II only$q$,$q$I and III$q$,$q$II and III$q$,'C',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Biomolecules, Enzymes & Bioenergetics$q$,$q$Aerobic and anaerobic respiration in animals$q$,$q$3-Statement Combination$q$,$q$I: glycolysis occurs in the cytoplasm in both modes (true).
II: anaerobic respiration releases far less energy (false).
III: in animals anaerobic respiration gives lactic acid and no CO₂, so CO₂ is released only in aerobic respiration (true).
Answer: (c)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'M',false),
(92,$q$In humans, the exit of partially digested food from the stomach into the small intestine is regulated by which one of the following structures/processes?$q$,$q$Peristalsis$q$,$q$Muscular walls of stomach$q$,$q$Sphincter muscle$q$,$q$Villi in small intestine$q$,'C',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Human Anatomy & Systemic Physiology$q$,$q$Pyloric sphincter$q$,$q$Single MCQ$q$,$q$The pyloric sphincter at the stomach's lower end opens and closes to release food into the small intestine.
Answer: (c)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'E',false),
(93,$q$Which of the following cells form components of complex permanent tissue in plants?
I. Companion cells
II. Sieve tubes
III. Tracheids
IV. Vessels$q$,$q$I, II, III and IV$q$,$q$II, III and IV only$q$,$q$I, III and IV only$q$,$q$I and II only$q$,'A',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Plant Anatomy, Transport & Physiology$q$,$q$Complex permanent tissues$q$,$q$4-Statement Combination$q$,$q$Complex tissues are xylem (tracheids, vessels) and phloem (sieve tubes, companion cells).
All four are components.
Answer: (a)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'M',false),
(94,$q$Which one of the following is not a part of the hindbrain of human beings?$q$,$q$Medulla$q$,$q$Pons$q$,$q$Corpus callosum$q$,$q$Cerebellum$q$,'C',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Human Anatomy & Systemic Physiology$q$,$q$Parts of the human brain$q$,$q$Single MCQ$q$,$q$The hindbrain has the cerebellum, pons and medulla oblongata.
The corpus callosum joins the two cerebral hemispheres (forebrain).
Answer: (c)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'E',true),
(95,$q$Which of the following organisms show external fertilization?
I. Pigeon
II. Frog
III. Fish
IV. Lizard$q$,$q$II, III and IV$q$,$q$II and III only$q$,$q$I and IV only$q$,$q$I, II and III$q$,'B',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Biological Classification & Diversity$q$,$q$Modes of fertilisation in vertebrates$q$,$q$4-Statement Combination$q$,$q$Frogs and most fishes shed gametes into water (external fertilization).
Pigeons and lizards (birds and reptiles) fertilise internally.
Answer: (b)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'M',false),
(96,$q$Which one of the following plant groups is characterized by having a haploid plant body?$q$,$q$Gymnosperms$q$,$q$Angiosperms$q$,$q$Pteridophytes$q$,$q$Bryophytes$q$,'D',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Biological Classification & Diversity$q$,$q$Dominant generation in plant groups$q$,$q$Single MCQ$q$,$q$In bryophytes the dominant plant body is the haploid gametophyte.
In pteridophytes, gymnosperms and angiosperms the main body is the diploid sporophyte.
Answer: (d)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'E',false),
(97,$q$A flower typically is composed of:$q$,$q$Stomata, Cotyledon, Petals, Sepals$q$,$q$Carpels, Sepals, Petals, Cambium$q$,$q$Carpels, Stamens, Petals, Sepals$q$,$q$Petals, Sepals, Perianth, Root cap$q$,'C',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Plant Anatomy, Transport & Physiology$q$,$q$Parts of a flower$q$,$q$Single MCQ$q$,$q$A typical flower has four whorls: sepals, petals, stamens and carpels.
Answer: (c)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'E',false),
(98,$q$Which one of the following organelles is found in both prokaryotic and eukaryotic cells?$q$,$q$Nucleus$q$,$q$Mitochondria$q$,$q$Ribosome$q$,$q$Golgi complex$q$,'C',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Cytology & Cell Architecture$q$,$q$Organelles common to all cells$q$,$q$Single MCQ$q$,$q$Ribosomes occur in both prokaryotes (70S) and eukaryotes (80S).
A nucleus, mitochondria and Golgi complex are absent in prokaryotes.
Answer: (c)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'E',false),
(99,$q$Which one of the following is not a connective tissue in the human body?$q$,$q$Cardiac muscle$q$,$q$Cartilage$q$,$q$Blood$q$,$q$Bone$q$,'A',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Animal Histology & Cell Types$q$,$q$Types of animal tissue$q$,$q$Single MCQ$q$,$q$Cartilage, blood and bone are connective tissues.
Cardiac muscle is muscular tissue.
Answer: (a)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'E',true),
(100,$q$Which one of the following is not a characteristic of an insect-pollinated plant?$q$,$q$Brightly coloured and fragrant flowers$q$,$q$Light and small pollen grains$q$,$q$Sticky and/or spiny pollen grains$q$,$q$Presence of nectar in a flower$q$,'B',$q$Science & Technology$q$,$q$Biology/Life Sciences$q$,$q$Ecology & Plant Adaptations$q$,$q$Pollination adaptations$q$,$q$Single MCQ$q$,$q$Insect-pollinated flowers are showy, scented and nectar-bearing with sticky or spiny pollen.
Light, small pollen grains are a feature of wind pollination.
Answer: (b)$q$,$q$COMP.SNT.BIOLOGY|SRC.NCERT.SCIENCE$q$,'E',true),
(101,$q$Consider the following States:
I. Tripura
II. Chhattisgarh
III. Assam
IV. Odisha
How many of the States given above have jute mills?$q$,$q$One$q$,$q$Two$q$,$q$Three$q$,$q$All four$q$,'D',$q$Geography$q$,$q$Economic Geography$q$,$q$Industrial Geography$q$,$q$Distribution of jute mills$q$,$q$Statement Count$q$,$q$Beyond West Bengal, jute mills operate in several states: Tripura (1), Chhattisgarh (2), Assam (2) and Odisha (1 to 3) per Ministry of Textiles replies in Parliament.
All four states have jute mills.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.HUMAN|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(102,$q$Which one of the following is classified under the physical processes of weathering?$q$,$q$Water pressure$q$,$q$Oxidation$q$,$q$Carbonation$q$,$q$Hydration$q$,'A',$q$Geography$q$,$q$Physical Geography$q$,$q$Geomorphology & Earth Surface Processes$q$,$q$Physical versus chemical weathering$q$,$q$Single MCQ$q$,$q$Oxidation, carbonation and hydration are chemical weathering processes.
Pressure from water (for example freezing in cracks and other pressure release) acts mechanically, so it is the physical process listed.
Answer: (a)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(103,$q$Consider the following statements:
I. The Steppes of Eurasia are temperate grasslands.
II. The Pampas of South America are classified as tropical grasslands.
Which of the statements given above is/are correct?$q$,$q$I only$q$,$q$II only$q$,$q$Both I and II$q$,$q$Neither I nor II$q$,'A',$q$Geography$q$,$q$Physical Geography$q$,$q$Biogeography$q$,$q$Temperate grasslands of the world$q$,$q$2-Statement Combination$q$,$q$I: the Eurasian Steppes are temperate grasslands (true).
II: the Pampas of Argentina and Uruguay are also temperate grasslands, not tropical (false).
Answer: (a)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(104,$q$Consider the following statements regarding the slash-and-burn agricultural practices in India:
I. This practice is a primitive subsistence farming.
II. This practice is known as Jhum in the North Eastern Hill region.
III. When soil fertility decreases, farmers shift to a fresh patch of land.
Which of the statements given above is/are correct?$q$,$q$I only$q$,$q$III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'D',$q$Geography$q$,$q$Indian Geography$q$,$q$Agriculture & Crops$q$,$q$Shifting cultivation in India$q$,$q$3-Statement Combination$q$,$q$Slash-and-burn (shifting) cultivation is primitive subsistence farming (I), called Jhum in the north-eastern hills (II), and farmers move to fresh land when fertility drops (III).
Answer: (d)$q$,$q$COMP.GEOGRAPHY.INDIA|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(105,$q$Consider the following statements regarding western disturbances in the Indian climate:
I. These are shallow cyclonic depressions.
II. They originate over the Caspian Sea and travel to India.
Which of the statements given above is/are correct?$q$,$q$I only$q$,$q$II only$q$,$q$Both I and II$q$,$q$Neither I nor II$q$,'A',$q$Geography$q$,$q$Indian Geography$q$,$q$Indian Climate$q$,$q$Western disturbances$q$,$q$2-Statement Combination$q$,$q$I: western disturbances are shallow cyclonic depressions (true).
II: standard texts say they originate over the Mediterranean Sea and travel eastwards, so the Caspian origin is taken as incorrect.
Answer: (a)$q$,$q$COMP.GEOGRAPHY.INDIA|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(106,$q$Consider the following statements regarding earthquake waves:
I. P-waves are similar to sound waves.
II. S-waves can travel through gaseous, liquid and solid materials.
III. The zone between 105° and 145° from the epicentre is identified as the shadow zone for both P- and S-waves.
Which of the statements given above are correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'C',$q$Geography$q$,$q$Physical Geography$q$,$q$Earth Interior & Geotectonics$q$,$q$Seismic waves and shadow zones$q$,$q$3-Statement Combination$q$,$q$I: P-waves are longitudinal like sound waves (true).
II: S-waves cannot pass through liquids or gases (false).
III: between 105° and 145° neither P- nor S-waves are recorded (true).
Answer: (c)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(107,$q$Consider the following statements:
I. At the equator, the Coriolis force is zero and here the winds blow perpendicular to the isobars.
II. The Coriolis force is directly proportional to the angle of latitude.
III. The Coriolis force and the resultant wind do not blow parallel to the isobars at higher latitudes.
Which of the statements given above are correct?$q$,$q$I, II and III$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I and II only$q$,'D',$q$Geography$q$,$q$Physical Geography$q$,$q$Atmospheric Circulation$q$,$q$Coriolis force and wind direction$q$,$q$3-Statement Combination$q$,$q$I and II follow the standard NCERT statements: the Coriolis force is zero at the equator and increases with latitude, so winds cross the isobars at the equator.
III is false: at higher latitudes the wind blows parallel to the isobars (geostrophic wind).
Answer: (d)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(108,$q$The Hawaiian volcanoes are the most famous examples of:$q$,$q$Flood basalt provinces$q$,$q$Calderas$q$,$q$Composite volcanoes$q$,$q$Shield volcanoes$q$,'D',$q$Geography$q$,$q$Physical Geography$q$,$q$Geomorphology & Earth Surface Processes$q$,$q$Types of volcanoes$q$,$q$Single MCQ$q$,$q$Hawaiian volcanoes are built by runny basaltic lava that forms broad gentle slopes, the classic shield volcanoes.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(109,$q$The temperate forests in the Nilgiris, Anaimalai and Palani hills are called:$q$,$q$Myristica$q$,$q$Kar forest$q$,$q$Devarakadu$q$,$q$Sholas$q$,'D',$q$Geography$q$,$q$Indian Geography$q$,$q$Indian Vegetation$q$,$q$Montane forests of southern India$q$,$q$Single MCQ$q$,$q$In the higher Western Ghats the temperate (montane) forests are known as Sholas.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.INDIA|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(110,$q$Consider the following statements with regard to igneous rocks:
I. These rocks cannot be changed into metamorphic rocks.
II. When molten material is cooled slowly at great depths, mineral grains tend to be very small.
III. These rocks are known as primary rocks.
Which of the statements given above is/are correct?$q$,$q$I and II only$q$,$q$III only$q$,$q$II and III only$q$,$q$I, II and III$q$,'B',$q$Geography$q$,$q$Physical Geography$q$,$q$Rocks & Minerals$q$,$q$Igneous rocks$q$,$q$3-Statement Combination$q$,$q$I is false: igneous rocks can be metamorphosed.
II is false: slow cooling at depth gives large grains.
III is true: igneous rocks are called primary rocks.
Answer: (b)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(111,$q$Consider the following statements:
I. The Prime Meridian is the same as the International Date Line.
II. West of the International Date Line is always a day later than east of the line.
III. The Earth turns 15° of longitude in an hour.
Which of the statements given above is/are correct?$q$,$q$I and II only$q$,$q$I and III only$q$,$q$II and III only$q$,$q$III only$q$,'C',$q$Geography$q$,$q$Physical Geography$q$,$q$Earth Motions & Geographical Coordinates$q$,$q$Date line and rotation$q$,$q$3-Statement Combination$q$,$q$I is false: the Prime Meridian is $0^\circ$ and the Date Line is near $180^\circ$.
II: the place to the west of the line is one day ahead (true).
III: $360^\circ/24$ h $=15^\circ$ per hour (true).
Answer: (c)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(112,$q$The Earth's equatorial region bulges outward, but the Earth flattens slightly towards the polar regions due to the:$q$,$q$Presence of a large oceanic mass in the southern hemisphere$q$,$q$Earth's rotational force$q$,$q$Earth's revolution$q$,$q$Greater gravitational force at the equator$q$,'B',$q$Geography$q$,$q$Physical Geography$q$,$q$Earth Motions & Geographical Coordinates$q$,$q$Shape of the Earth$q$,$q$Single MCQ$q$,$q$Rotation produces a centrifugal effect that is greatest at the equator, so the equator bulges and the poles flatten.
Answer: (b)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(113,$q$In the southern hemisphere, trade winds blow from:$q$,$q$North-East to South-West$q$,$q$South-East to North-West$q$,$q$North-West to South-East$q$,$q$South-West to North-East$q$,'B',$q$Geography$q$,$q$Physical Geography$q$,$q$Atmospheric Circulation$q$,$q$Direction of trade winds$q$,$q$Single MCQ$q$,$q$Trade winds blow towards the equator, deflected to the left in the southern hemisphere, so they are the south-east trades blowing from the south-east to the north-west.
Answer: (b)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(114,$q$Consider the following statements regarding the structure of the atmosphere:
I. The average height of the troposphere is higher nearer the poles than at the equator.
II. The mesosphere contains the ozone layer.
III. Radio waves transmitted from the Earth are reflected to the Earth by the ionosphere.
IV. In the mesosphere, temperature decreases with an increase in altitude.
Which of the statements given above are correct?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$III and IV only$q$,$q$I, II, III and IV$q$,'C',$q$Geography$q$,$q$Physical Geography$q$,$q$Climatology$q$,$q$Layers of the atmosphere$q$,$q$4-Statement Combination$q$,$q$I is false: the troposphere is about 18 km at the equator and 8 km at the poles.
II is false: the ozone layer is in the stratosphere.
III and IV are true.
Answer: (c)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(115,$q$Consider the following oceanic currents:
I. Oyashio
II. Canaries
III. Labrador
IV. Kuroshio
V. Benguela
VI. Alaska
VII. Humboldt
How many of the above are Pacific Ocean currents?$q$,$q$One$q$,$q$Two$q$,$q$Three$q$,$q$Four$q$,'D',$q$Geography$q$,$q$Physical Geography$q$,$q$Oceanography$q$,$q$Ocean currents by ocean basin$q$,$q$Statement Count$q$,$q$Pacific: Oyashio, Kuroshio, Alaska and Humboldt (four).
Atlantic: Canaries, Labrador and Benguela.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(116,$q$Consider the following:
I. Abrasion
II. Attrition
III. Hydraulic action
IV. Solution
Which of the above are the main types of river erosion?$q$,$q$I, II and III only$q$,$q$I, III and IV only$q$,$q$II and IV only$q$,$q$I, II, III and IV$q$,'D',$q$Geography$q$,$q$Physical Geography$q$,$q$Geomorphology & Earth Surface Processes$q$,$q$Types of river erosion$q$,$q$4-Statement Combination$q$,$q$The main processes of river erosion are hydraulic action, abrasion (corrasion), attrition and solution (corrosion).
All four.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',false),
(117,$q$A prolonged period of inadequate rainfall marked with mal-distribution of the same over time and space is known as:$q$,$q$Agricultural drought$q$,$q$Hydrological drought$q$,$q$Ecological drought$q$,$q$Meteorological drought$q$,'D',$q$Geography$q$,$q$Physical Geography$q$,$q$Natural Hazards$q$,$q$Types of drought$q$,$q$Single MCQ$q$,$q$A meteorological drought is defined by a prolonged period of deficient and unevenly distributed rainfall.
Agricultural, hydrological and ecological droughts describe the impacts on crops, water and ecosystems.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(118,$q$Which group of landlocked states shares a boundary with Madhya Pradesh?$q$,$q$Rajasthan, Uttar Pradesh, Chhattisgarh, Maharashtra and Gujarat only$q$,$q$Rajasthan, Uttar Pradesh, Jharkhand and Chhattisgarh only$q$,$q$Rajasthan, Uttar Pradesh, Jharkhand, Chhattisgarh, Maharashtra and Gujarat$q$,$q$Rajasthan, Uttar Pradesh and Chhattisgarh only$q$,'D',$q$Geography$q$,$q$Indian Geography$q$,$q$Political Geography of India$q$,$q$States bordering Madhya Pradesh$q$,$q$Single MCQ$q$,$q$Madhya Pradesh borders Rajasthan, Uttar Pradesh, Chhattisgarh, Maharashtra and Gujarat; it does not border Jharkhand.
Maharashtra and Gujarat are coastal, so the landlocked neighbours are Rajasthan, Uttar Pradesh and Chhattisgarh.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.INDIA|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(119,$q$Consider the following statements regarding the nature of rocks:
I. Rocks are aggregates of one or more minerals.
II. Granite is softer than soapstone.
III. Gabbro is black and quartzite can be milky white.
IV. Sedimentary rocks are related to foliation.
Which of the statements given above are not correct?$q$,$q$I and II$q$,$q$I and III$q$,$q$II and IV$q$,$q$II and III$q$,'C',$q$Geography$q$,$q$Physical Geography$q$,$q$Rocks & Minerals$q$,$q$Properties of rocks$q$,$q$4-Statement Combination$q$,$q$I and III are correct.
II is wrong: granite is hard while soapstone is very soft.
IV is wrong: foliation is a feature of metamorphic rocks.
Answer: (c)$q$,$q$COMP.GEOGRAPHY.PHYSICAL|SRC.NCERT.GEOGRAPHY$q$,'M',true),
(120,$q$The 'Agricultural Population Density' is referred to as the ratio of the:$q$,$q$Total population to Net cultivable land$q$,$q$Agricultural population to Gross cropped area$q$,$q$Total population to Total reported land$q$,$q$Total agricultural population to Net cultivable land$q$,'D',$q$Geography$q$,$q$Human Geography$q$,$q$Population Geography$q$,$q$Measures of population density$q$,$q$Single MCQ$q$,$q$Agricultural density is the number of agricultural workers or the agricultural population per unit of net cultivated (cultivable) area.
Answer: (d)$q$,$q$COMP.GEOGRAPHY.HUMAN|SRC.NCERT.GEOGRAPHY$q$,'E',false),
(121,$q$The annual session of the Indian National Congress in December 1929 was held in :$q$,$q$Surat$q$,$q$Lahore$q$,$q$Amritsar$q$,$q$Tripura$q$,'B',$q$History$q$,$q$Modern History$q$,$q$Indian National Movement$q$,$q$Lahore session 1929$q$,$q$Single MCQ$q$,$q$The December 1929 Lahore session under Jawaharlal Nehru adopted the Purna Swaraj resolution.
Answer: (b)$q$,$q$COMP.HISTORY.MOVEMENTS|SRC.NCERT.HISTORY$q$,'E',false),
(122,$q$Shortughai, a Harappan trading post in Afghanistan, was important to the Harappans for the possible supply of :$q$,$q$Conch shells$q$,$q$Iron$q$,$q$Copper$q$,$q$Lapis lazuli and camel$q$,'D',$q$History$q$,$q$Ancient History$q$,$q$Indus Valley Civilization$q$,$q$Harappan trade sites$q$,$q$Single MCQ$q$,$q$Shortughai near the Oxus lay close to the lapis lazuli mines of Badakhshan; lapis was the main item.
Answer: (d)$q$,$q$COMP.HISTORY.INSTITUTIONS|SRC.NCERT.HISTORY$q$,'M',false),
(123,$q$Which of the following statements are correct regarding the demands of the protest movement known as Luddism (1811 – 17) ?
I. A minimum wage for workers.
II. The right to form trade unions so that they could legally present their demands.
III. The use of machinery for efficient labour-saving production.
Select the answer using the code given below :$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'A',$q$History$q$,$q$World History$q$,$q$Industrial Revolution$q$,$q$Luddite movement$q$,$q$3-Statement Combination$q$,$q$The Luddites demanded a minimum wage and the right to form unions; they opposed, not demanded, labour-saving machinery.
Answer: (a)$q$,$q$COMP.HISTORY.ECONOMIC|SRC.NCERT.HISTORY$q$,'M',false),
(124,$q$Consider the following statements regarding the Industrial Revolution in Britain :
I. At the beginning of industrialization, coal and iron ore were plentifully available in Britain.
II. The blast furnace came into use at the beginning of the 18th century.
III. Britain was lucky in possessing excellent coking coal and high-grade iron ore in the same basins.
Which of the statements given above are correct ?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'D',$q$History$q$,$q$World History$q$,$q$Industrial Revolution$q$,$q$Resources and technology of British industrialisation$q$,$q$3-Statement Combination$q$,$q$All three are standard points: abundant coal and iron, Darby's coke blast furnace c.1709, and co-located coking coal and iron ore.
Answer: (d)$q$,$q$COMP.HISTORY.ECONOMIC|SRC.NCERT.HISTORY$q$,'M',false),
(125,$q$Which one of the following inscriptions records the history of a guild of silk weavers ?$q$,$q$The Hathigumpha inscription$q$,$q$The Mandasor inscription$q$,$q$The Kudumiyamalai inscription$q$,$q$The Udayagiri Cave inscription$q$,'B',$q$History$q$,$q$Ancient History$q$,$q$Literature, Science & Inscriptions$q$,$q$Guild inscriptions$q$,$q$Single MCQ$q$,$q$The Mandasor inscription (c. 5th century CE) records the migration and history of a silk weavers' guild.
Answer: (b)$q$,$q$COMP.HISTORY.INSTITUTIONS|SRC.NCERT.HISTORY$q$,'E',false),
(126,$q$Match List I with List II :
List I (Event): I. Passing of the Age of Consent Bill; II. Establishment of the Arya Samaj; III. Death of Dayanand Saraswati; IV. Foundation of the Nagari Pracharini Sabha
List II (Year): A. 1893; B. 1883; C. 1875; D. 1891
Select the answer using the code given below :$q$,$q$I-D, II-C, III-B, IV-A$q$,$q$I-C, II-D, III-A, IV-B$q$,$q$I-D, II-C, III-A, IV-B$q$,$q$I-C, II-D, III-B, IV-A$q$,'A',$q$History$q$,$q$Modern History$q$,$q$Socio-Religious Reform$q$,$q$Dates of reform events$q$,$q$Match the Following$q$,$q$Age of Consent Act 1891; Arya Samaj 1875; Dayanand died 1883; Nagari Pracharini Sabha 1893.
Answer: (a)$q$,$q$COMP.HISTORY.MOVEMENTS|SRC.NCERT.HISTORY$q$,'M',false),
(127,$q$Consider the following statements with regard to the types of land listed in the Amarakosha.
I. Devamatrika refers to land watered by rain.
II. Aprahata refers to fallow land.
III. Pankila refers to highly fertile land.
Which of the statements given above is/are correct ?$q$,$q$I and II only$q$,$q$II only$q$,$q$I and III only$q$,$q$I, II and III$q$,'A',$q$History$q$,$q$Ancient History$q$,$q$Society, Economy & Trade$q$,$q$Land classification in the Amarakosha$q$,$q$3-Statement Combination$q$,$q$Devamatrika is rain-fed and aprahata is fallow. Pankila is muddy or marshy land, while urvara is the fertile category, so III is wrong. Medium confidence on the glossary.
Answer: (a)$q$,$q$COMP.HISTORY.INSTITUTIONS|SRC.NCERT.HISTORY$q$,'H',false),
(128,$q$Consider the following statements regarding the role of political parties in modern democracies :
I. In most democracies, elections are fought mainly among the candidates put up by political parties.
II. Political parties put forward different policies and programmes and the voters choose from them.
III. Political parties shape public opinion.
Which of the statements given above are correct ?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'D',$q$Polity$q$,$q$Elections$q$,$q$Political Parties & Anti-Defection$q$,$q$Role of political parties$q$,$q$3-Statement Combination$q$,$q$All three are standard NCERT statements on political parties.
Answer: (d)$q$,$q$COMP.POLITY.GOVERNANCE|SRC.LAXMIKANTH$q$,'E',false),
(129,$q$Consider the following statements with regard to the Lahore Session :
I. The Congress decided to observe Independence Day on 26 January 1930.
II. It was decided to hoist the National Flag and sing patriotic songs at different venues.
III. Gandhiji suggested that the event be held synchronously in all the places.
Which of the statements given above are correct ?$q$,$q$I and II only$q$,$q$II and III only$q$,$q$I and III only$q$,$q$I, II and III$q$,'D',$q$History$q$,$q$Modern History$q$,$q$Indian National Movement$q$,$q$Lahore Session and Independence Day pledge$q$,$q$3-Statement Combination$q$,$q$The NCERT account of the Lahore Session and the 26 January 1930 observance contains all three points.
Answer: (d)$q$,$q$COMP.HISTORY.MOVEMENTS|SRC.NCERT.HISTORY$q$,'M',false),
(130,$q$Consider the following statements :
I. The Kailasanatha temple of Kanchi is the earliest Pallava temple hewn from solid rock.
II. The Vaikuntha Perumal temple at Kanchi is a rare Pallava temple dedicated to Lord Vishnu.
Which of the statements given above is/are correct ?$q$,$q$I only$q$,$q$II only$q$,$q$Both I and II$q$,$q$Neither I nor II$q$,'B',$q$History$q$,$q$Art & Culture$q$,$q$Architecture & Archaeology$q$,$q$Pallava temples$q$,$q$2-Statement Combination$q$,$q$The Kailasanatha temple is a structural temple of Rajasimha, not the earliest rock-cut Pallava temple. The Vaikuntha Perumal temple is a Vishnu temple.
Answer: (b)$q$,$q$COMP.HISTORY.CULTURE|SRC.NCERT.HISTORY$q$,'M',false),
(131,$q$Consider the following pairs with reference to the Constitution of India :
I. Part V : The Union
II. Part X : The Scheduled and Tribal Areas
III. Part XII : Relations between the Union and the States
IV. Part XIV : Amendment of the Constitution
How many of the pairs given above are correctly matched ?$q$,$q$One$q$,$q$Two$q$,$q$Three$q$,$q$All four$q$,'B',$q$Polity$q$,$q$Constitutional Framework$q$,$q$Constitutional Structure$q$,$q$Parts of the Constitution$q$,$q$Statement Count$q$,$q$Part V (Union) and Part X (Scheduled and Tribal Areas) are correct.
Part XI deals with Centre-State relations, Part XII with finance and Part XIV with services, and amendment is Part XX.
Answer: (b)$q$,$q$COMP.POLITY.CONSTITUTION|SRC.LAXMIKANTH$q$,'M',false),
(132,$q$With reference to the Panchsheel, which of the following is/are correct ?
I. Mutual respect for territorial integrity and sovereignty
II. Mutual non-interference
III. Collective security against non-aggression
IV. Peaceful co-existence
Select the answer using the code given below :$q$,$q$I only$q$,$q$I, II and III$q$,$q$II, III and IV$q$,$q$I, II and IV$q$,'D',$q$International Relations$q$,$q$International Politics$q$,$q$Core Concepts of International Politics$q$,$q$Five Principles of Panchsheel$q$,$q$4-Statement Combination$q$,$q$Panchsheel: mutual respect for sovereignty, non-aggression, non-interference, equality and mutual benefit, peaceful co-existence. Collective security is not among them.
Answer: (d)$q$,$q$COMP.IR.INSTITUTIONS|SRC.OTHER_REFERENCE$q$,'E',false),
(133,$q$Consider the following statements related to national integration :
I. The expression of regional issues is not a part of democratic politics.
II. Nation-building is an ongoing process.
III. Regional imbalance is associated with India's development experience.
IV. Regions together form the nation.
Which of the statements given above are correct ?$q$,$q$II, III and IV$q$,$q$I, II and IV$q$,$q$III and IV only$q$,$q$II and III only$q$,'A',$q$Polity$q$,$q$Political Theory$q$,$q$Political Concepts & Ideologies$q$,$q$National integration and regionalism$q$,$q$4-Statement Combination$q$,$q$Regional issues are a normal part of democratic politics, so I is wrong; II, III and IV follow NCERT.
Answer: (a)$q$,$q$COMP.POLITY.GOVERNANCE|SRC.LAXMIKANTH$q$,'M',false),
(134,$q$Consider the following statements regarding UN reforms :
I. India demands an expanded Security Council.
II. India does not support an increase in non-permanent members.
III. The majority of the UN General Assembly members are from developing countries.
Which of the statements given above is/are correct ?$q$,$q$I only$q$,$q$II only$q$,$q$I and II$q$,$q$I and III$q$,'D',$q$International Relations$q$,$q$International Organisations$q$,$q$UN System & Multilateral Institutions$q$,$q$UN Security Council reform$q$,$q$3-Statement Combination$q$,$q$India seeks expansion in both permanent and non-permanent categories, so II is wrong; I and III are correct.
Answer: (d)$q$,$q$COMP.IR.INSTITUTIONS|SRC.OTHER_REFERENCE$q$,'M',false),
(135,$q$Which one of the following Five-Year Plan documents was titled as 'Towards Faster and More Inclusive Growth' ?$q$,$q$Eighth Plan$q$,$q$Ninth Plan$q$,$q$Tenth Plan$q$,$q$Eleventh Plan$q$,'D',$q$Economy$q$,$q$Development & Welfare$q$,$q$Economic Planning$q$,$q$Five-Year Plan themes$q$,$q$Single MCQ$q$,$q$The approach paper to the Eleventh Plan (2007-12) was titled Towards Faster and More Inclusive Growth.
Answer: (d)$q$,$q$COMP.ECONOMY.DEVELOPMENT|SRC.NCERT.ECONOMICS$q$,'E',false),
(136,$q$Consider the following statements regarding the PESA Act, 1996 :
I. Gram Sabhas have the power to declare Scheduled Areas.
II. Gram Sabhas have the powers related to the management of community resources.
III. The PESA applies to all States except areas under the Fifth Schedule.
Which of the statements given above is/are not correct ?$q$,$q$I and II$q$,$q$II and III$q$,$q$I and III$q$,$q$II only$q$,'C',$q$Polity$q$,$q$Local Government$q$,$q$Panchayati Raj$q$,$q$PESA Act 1996$q$,$q$3-Statement Combination$q$,$q$Scheduled Areas are declared by the President, so I is wrong. PESA applies to Fifth Schedule areas, so III is wrong. II is correct.
Statements I and III are not correct.
Answer: (c)$q$,$q$COMP.POLITY.GOVERNANCE|SRC.LAXMIKANTH$q$,'M',true),
(137,$q$Which one of the following is neither a constitutional nor a statutory body ?$q$,$q$Finance Commission$q$,$q$NITI Aayog$q$,$q$National Green Tribunal$q$,$q$Union Public Service Commission$q$,'B',$q$Polity$q$,$q$Constitutional & Statutory Bodies$q$,$q$Extra-Constitutional Bodies$q$,$q$Types of institutions$q$,$q$Single MCQ$q$,$q$Finance Commission and UPSC are constitutional, the NGT is statutory, and NITI Aayog was set up by an executive resolution.
Answer: (b)$q$,$q$COMP.POLITY.GOVERNANCE|SRC.LAXMIKANTH$q$,'E',false),
(138,$q$Which one of the following committees recommended constitutional recognition for local bodies ?$q$,$q$K. Hanumanthaiah Committee$q$,$q$Veerappa Moily Committee$q$,$q$P.K. Thungon Committee$q$,$q$Kasturirangan Committee$q$,'C',$q$Polity$q$,$q$Local Government$q$,$q$Panchayati Raj$q$,$q$Committees on Panchayati Raj$q$,$q$Single MCQ$q$,$q$The L.M. Singhvi and P.K. Thungon committees recommended constitutional recognition of local bodies; Thungon is the one listed.
Answer: (c)$q$,$q$COMP.POLITY.GOVERNANCE|SRC.LAXMIKANTH$q$,'M',false),
(139,$q$The anti-defection provisions were incorporated in the Constitution through which one of the following Constitutional Amendments ?$q$,$q$50th Amendment$q$,$q$52nd Amendment$q$,$q$58th Amendment$q$,$q$61st Amendment$q$,'B',$q$Polity$q$,$q$Elections$q$,$q$Political Parties & Anti-Defection$q$,$q$Tenth Schedule$q$,$q$Single MCQ$q$,$q$The 52nd Amendment (1985) added the Tenth Schedule.
Answer: (b)$q$,$q$COMP.POLITY.GOVERNANCE|SRC.LAXMIKANTH$q$,'E',false),
(140,$q$Consider the following statements regarding the Neighbourhood First Policy :
I. India provides high-impact community development projects to Afghanistan.
II. Bhutan is India's key maritime neighbour and vital partner in Vision MAHASAGAR.
III. India launched Operation Brahma to provide relief following an earthquake in Myanmar.
Which of the statements given above are correct ?$q$,$q$I and II only$q$,$q$I and III only$q$,$q$II and III only$q$,$q$I, II and III$q$,'B',$q$Current Affairs$q$,$q$International Relations$q$,$q$Bilateral Relations$q$,$q$Neighbourhood First Policy$q$,$q$3-Statement Combination$q$,$q$Bhutan is landlocked, so II is wrong. India runs high-impact community development projects in Afghanistan, and Operation Brahma was the March 2025 relief to Myanmar.
Answer: (b)$q$,$q$COMP.IR.BILATERAL|SRC.PIB$q$,'M',false),
(141,$q$India has engaged in an agreement to supply BrahMos missiles to which of the following countries ?
I. Indonesia
II. Philippines
III. Singapore
IV. Vietnam
Select the correct answer using the code given below :$q$,$q$I, II and III$q$,$q$I, III and IV$q$,$q$I, II and IV$q$,$q$II and IV only$q$,'C',$q$Current Affairs$q$,$q$Defence & Security$q$,$q$Defence Procurement & Industry$q$,$q$BrahMos exports$q$,$q$4-Statement Combination$q$,$q$Philippines (2022 contract), Indonesia (2026 deal) and Vietnam (signed, confirmed May 2026). Singapore has no BrahMos agreement.
Answer: (c)$q$,$q$COMP.SECURITY.OPERATIONS|SRC.PIB$q$,'M',false),
(142,$q$Ramanujan Fellowship is an initiative of the Department of Science & Technology, Government of India. It was launched under the :$q$,$q$Research, Development and Innovation Fund$q$,$q$Anusandhan National Research Foundation$q$,$q$National Quantum Mission$q$,$q$National Supercomputing Mission$q$,'B',$q$Current Affairs$q$,$q$Science & Technology$q$,$q$Science Institutions & Programmes$q$,$q$Research fellowships$q$,$q$Single MCQ$q$,$q$The fellowship, earlier run by SERB, is now administered by the Anusandhan National Research Foundation. Medium confidence because the stem says launched under.
Answer: (b)$q$,$q$COMP.CA.SCIENCE|SRC.PIB$q$,'M',false),
(143,$q$Which of the following countries is not a member of the International Big Cat Alliance ?$q$,$q$France$q$,$q$Somalia$q$,$q$Sri Lanka$q$,$q$Saudi Arabia$q$,'A',$q$Current Affairs$q$,$q$Environment & Ecology$q$,$q$Biodiversity & Wildlife$q$,$q$International Big Cat Alliance$q$,$q$Single MCQ$q$,$q$Somalia and Sri Lanka are members, and Saudi Arabia joined on 22 May 2026 as the 26th member. France is not in the published member list.
Answer: (a)$q$,$q$COMP.ENVIRONMENT.BIODIVERSITY|SRC.PIB$q$,'M',true),
(144,$q$Consider the following statements regarding the 'Green Nobel' :
I. It is given every alternate year.
II. In 2026, six winners were chosen and one of the winners is from Asia.
III. All the winners of 2026 are women.
Which of the statements given above is/are correct ?$q$,$q$I only$q$,$q$II only$q$,$q$III only$q$,$q$II and III$q$,'D',$q$Current Affairs$q$,$q$Awards, Appointments & Personalities$q$,$q$International Awards$q$,$q$Goldman Environmental Prize$q$,$q$3-Statement Combination$q$,$q$The Goldman Prize is annual. 2026 had six winners, all women, including Borim Kim of South Korea (Asia).
Answer: (d)$q$,$q$COMP.CA.EVENTS|SRC.PIB$q$,'M',false),
(145,$q$Which two countries signed a $ 2.6 billion uranium supply agreement in March 2026 ?$q$,$q$India and Russia$q$,$q$India and Canada$q$,$q$India and Australia$q$,$q$Australia and Canada$q$,'B',$q$Current Affairs$q$,$q$Economy & Finance$q$,$q$Energy & Strategic Resources$q$,$q$Uranium supply deals$q$,$q$Single MCQ$q$,$q$Cameco signed a C$2.6 billion supply contract with India's Department of Atomic Energy during Mark Carney's visit.
Answer: (b)$q$,$q$COMP.CA.POLICY|SRC.PIB$q$,'M',false),
(146,$q$Consider the following statements regarding Exercise DUSTLIK-2026 :
I. It is a joint military exercise between India and UAE.
II. Its aim is to foster military cooperation and enhance combined capabilities to execute joint operations in semi-mountainous terrain.
Which of the statements given above is/are correct ?$q$,$q$I only$q$,$q$II only$q$,$q$Both I and II$q$,$q$Neither I nor II$q$,'B',$q$Current Affairs$q$,$q$Defence & Security$q$,$q$Military Exercises$q$,$q$Bilateral military exercises$q$,$q$2-Statement Combination$q$,$q$Dustlik is the India-Uzbekistan exercise, so I is wrong. II describes its aim. Not re-verified on the web; rests on prior knowledge of the exercise.
Answer: (b)$q$,$q$COMP.SECURITY.OPERATIONS|SRC.PIB$q$,'M',false),
(147,$q$Which of the following statements about 'Vayu Shakti-2026' is/are correct ?
I. The Vayu Shakti-2026 exercise took place in Jaisalmer, Rajasthan.
II. Advanced fighter aircraft of the Indian Air Force, including Rafale, HAL Tejas and Mirage 2000 carried out strikes.
III. Boeing Apache and Boeing Chinook helicopters participated in this exercise.
Select the answer using the code given below :$q$,$q$I, II and III$q$,$q$I and III only$q$,$q$II and III only$q$,$q$I only$q$,'A',$q$Current Affairs$q$,$q$Defence & Security$q$,$q$Military Exercises$q$,$q$IAF Vayu Shakti 2026$q$,$q$3-Statement Combination$q$,$q$The President's press release confirms Pokhran, Jaisalmer; strikes by Rafale, Tejas and Mirage 2000; and Apache and Chinook participation.
Answer: (a)$q$,$q$COMP.SECURITY.OPERATIONS|SRC.PIB$q$,'E',false),
(148,$q$Which of the following statements related to water governance is/are correct ?
I. River Basin Management (RBM) is a Central Sector Scheme under the Ministry of Jal Shakti, Government of India.
II. The major objectives of the RBM Scheme focus on promoting the use of water for domestic use.
III. The Brahmaputra Board is one of the key implementing agencies of the RBM.
Select the answer using the code given below :$q$,$q$I, II and III$q$,$q$I and III only$q$,$q$II and III only$q$,$q$II only$q$,'B',$q$Current Affairs$q$,$q$Polity & Governance$q$,$q$Government Schemes & Policies$q$,$q$River Basin Management Scheme$q$,$q$3-Statement Combination$q$,$q$I and III are confirmed by PIB. The scheme objectives are sustainable use supporting irrigation, hydropower and flood management, not domestic use, so II is wrong. Medium confidence on II.
Answer: (b)$q$,$q$COMP.CA.POLICY|SRC.PIB$q$,'M',false),
(149,$q$Which of the following statements regarding the Khelo India Tribal Games is/are correct ?
I. The inaugural edition of the Khelo India Tribal Games was organized in two States : Jharkhand and Odisha.
II. 'Morveer' was the official mascot of these games.
III. The Khelo India Tribal Games are part of the Khelo India Scheme.
Select the answer using the code given below :$q$,$q$I, II and III$q$,$q$I and II only$q$,$q$II and III only$q$,$q$III only$q$,'C',$q$Current Affairs$q$,$q$Sports$q$,$q$Major Sporting Events$q$,$q$Khelo India Tribal Games$q$,$q$3-Statement Combination$q$,$q$The inaugural games were held in Chhattisgarh, so I is wrong. Morveer was the mascot and the games sit under the Khelo India Scheme.
Answer: (c)$q$,$q$COMP.CA.EVENTS|SRC.PIB$q$,'M',false),
(150,$q$Consider the following statements :
I. Over 60% of defence equipment sourced by the Armed Forces of India is now produced domestically.
II. The Indian defence focus is on scale, resilience and indigenous capability.
Which of the statements given above is/are correct ?$q$,$q$I only$q$,$q$II only$q$,$q$Both I and II$q$,$q$Neither I nor II$q$,'C',$q$Current Affairs$q$,$q$Defence & Security$q$,$q$Defence Procurement & Industry$q$,$q$Indigenisation of defence production$q$,$q$2-Statement Combination$q$,$q$Government figures put domestic production at about 65 percent, so over 60 percent holds, and II is the stated policy focus.
Answer: (c)$q$,$q$COMP.SECURITY.OPERATIONS|SRC.PIB$q$,'M',false)
)
insert into dp_ingest.rows(batch_id,q_num,raw_question,raw_opt_a,raw_opt_b,raw_opt_c,raw_opt_d,extraction_confidence,extraction_flags,question_id,question,opt_a,opt_b,opt_c,opt_d,content_hash,source_key_opt,key_authority,key_source_url,llm_opt,final_opt,key_discrepancy,subject,topic,subtopic,theme,q_type,q_pattern,pattern_id,explanation,source,is_negative,tags,static_current_link,difficulty_score,difficulty_category,source_fidelity_confidence,taxonomy_confidence,intelligence_confidence,review_required,row_status,release_disposition,taxonomy_concept,competency_id,source_id,temporal_context_id,expected_knowledge,source_accessibility,preparation_accessibility,cognitive_complexity,esac_score,relation_degree,same_concept_degree,cross_exam_variant_degree,conceptual_variant_degree,model_audit)
select b.id,v.n,v.qt,v.a,v.b_,v.c,v.d,0.98,'{}'::text[],'NDA_II_2026_GK_'||lpad(v.n::text,3,'0'),v.qt,v.a,v.b_,v.c,v.d,
 encode(sha256(convert_to(lower(regexp_replace(v.qt,'\s+',' ','g'))||'|'||lower(v.a||'|'||v.b_||'|'||v.c||'|'||v.d),'UTF8')),'hex'),
 v.k,'MODEL_ONLY','dp-solved://NDA_2026_II_GAT_GK_SET_A',v.k,v.k,false,v.subj,v.top,v.sub,v.th,'Knowledge',v.pat,
 (select pattern_id from public.dp_pattern_dictionary where display_label=v.pat),v.ex,'NDA II 2026 General Ability Test Part B (English side)',v.neg,
 array['format:single_mcq','key:dp_solved'],case when v.subj='Current Affairs' then 'Current Affairs' else 'Static' end,
 case v.df when 'E' then 20 when 'M' then 42.25 else 62 end, case v.df when 'E' then 'Easy' when 'M' then 'Moderate' else 'Hard' end,
 0.97,0.85,0.85,false,'ENRICHED','INCLUDE',v.th,split_part(v.cs,'|',1),split_part(v.cs,'|',2),
 case when v.subj='Current Affairs' then 'TEMP.CURRENT_DEVELOPMENT' else 'TEMP.STATIC' end,
 80,case when v.subj='Current Affairs' then 70 else 90 end,100,60,
 100-case v.df when 'E' then 20 when 'M' then 42.25 else 62 end,0,0,0,0,
 jsonb_build_object('answer_audit',jsonb_build_object('authority','DP_SOLVED_INTERNAL','note','Not an official UPSC key'),'source_explanation_evidence',jsonb_build_object('captured',true,'provider','DP internal solved key','text',v.ex))
from b, v;