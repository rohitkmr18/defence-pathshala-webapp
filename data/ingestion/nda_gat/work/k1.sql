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
Answer: (a)$q$,$q$COMP.SNT.PHYSICS|SRC.NCERT.SCIENCE$q$,'E',false)
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