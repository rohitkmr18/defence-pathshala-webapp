from qfmt import Q, P, F, W

# NDA I 2024 Mathematics, Set A (RRAN-B-MTH), booklet pages 21-43, Q51-120
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"
LS = "Linked Item Set"

Q(51, r"""If $(a, b)$ is the centre and $c$ is the radius of the circle $x^2+y^2+2x+6y+1=0$, then what is the value of $a^2+b^2+c^2$?""",
  ["19", "18", "17", "11"], "A", "Analytical Geometry > Circles > Equation and Parameters", 15,
  r"""Step 1: Centre $(-1,-3)$, so $a^2+b^2=10$.
Step 2: $c^2=1+9-1=9$.
Step 3: Total $=19$.
Answer: (a)""", theme="Centre and radius of a circle")

Q(52, r"""If $(1, -1, 2)$ and $(2, 1, -1)$ are the end points of a diameter of a sphere $x^2+y^2+z^2+2ux+2vy+2wz-1=0$, then what is $u+v+w$ equal to?""",
  ["$-2$", "$-1$", "1", "2"], "A", "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 20,
  r"""Step 1: The centre $(-u,-v,-w)$ is the midpoint $\left(\tfrac32, 0, \tfrac12\right)$.
Step 2: $u+v+w=-\tfrac32-0-\tfrac12=-2$.
Answer: (a)""", theme="Sphere from a diameter")

Q(53, r"""The number of points represented by the equation $x=5$ on the $xy$-plane is""",
  ["Zero", "One", "Two", "Infinitely many"], "D", "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 10,
  r"""Step 1: In the $xy$-plane, $x=5$ is a straight line parallel to the $y$-axis.
Step 2: A line has infinitely many points.
Answer: (d)""", theme="Equation x = constant in the plane")

Q(54, r"""If $\langle l, m, n\rangle$ are the direction cosines of a normal to the plane $2x-3y+6z+4=0$, then what is the value of $49(7l^2+m^2-n^2)$?""",
  ["0", "1", "3", "71"], "B", "Analytical Geometry > Three-dimensional Geometry > Direction Cosines and Direction Ratios", 15,
  r"""Step 1: The normal $(2,-3,6)$ has length 7, so $l^2=\tfrac4{49}$, $m^2=\tfrac9{49}$, $n^2=\tfrac{36}{49}$.
Step 2: $49(7l^2+m^2-n^2)=28+9-36=1$.
Answer: (b)""", theme="Direction cosines of a plane normal")

Q(55, r"""A line through $(1, -1, 2)$ with direction ratios $\langle 3, 2, 2\rangle$ meets the plane $x+2y+3z=18$. What is the point of intersection of line and plane?""",
  ["$(4, 4, 1)$", "$(2, 4, 1)$", "$(4, 1, 4)$", "$(3, 4, 7)$"], "C", "Analytical Geometry > Three-dimensional Geometry > Line in Space", 15,
  r"""Step 1: A general point is $(1+3t, -1+2t, 2+2t)$.
Step 2: Substituting: $5+13t=18$, so $t=1$, giving $(4,1,4)$.
Answer: (c)""", theme="Line meeting a plane")

Q(56, r"""If $p$ is the perpendicular distance from origin to the plane passing through $(1, 0, 0)$, $(0, 1, 0)$ and $(0, 0, 1)$, then what is $3p^2$ equal to?""",
  ["4", "3", "2", "1"], "D", "Analytical Geometry > Three-dimensional Geometry > Equation of a Plane", 10,
  r"""Step 1: The plane is $x+y+z=1$, so $p=\dfrac1{\sqrt3}$.
Step 2: $3p^2=1$.
Answer: (d)""", theme="Intercept form of a plane")

Q(57, r"""If the direction cosines $\langle l, m, n\rangle$ of a line are connected by relation $l+2m+n=0$, $2l-2m+3n=0$, then what is the value of $l^2+m^2-n^2$?""",
  [r"$\dfrac1{101}$", r"$\dfrac{29}{101}$", r"$\dfrac{41}{101}$", r"$\dfrac{92}{101}$"], "B", "Analytical Geometry > Three-dimensional Geometry > Direction Cosines and Direction Ratios", 30,
  r"""Step 1: The line is perpendicular to $(1,2,1)$ and $(2,-2,3)$; their cross product is $(8,-1,-6)$.
Step 2: $8^2+1+36=101$, so $l^2+m^2-n^2=\dfrac{64+1-36}{101}=\dfrac{29}{101}$.
Answer: (b)""", theme="Direction cosines from two linear relations")

Q(58, r"""If a variable line passes through the point of intersection of the lines $x+2y-1=0$ and $2x-y-1=0$ and meets the coordinate axes in $A$ and $B$, then what is the locus of the mid-point of $AB$?""",
  ["$3x+y=10xy$", "$x+3y=10xy$", "$3x+y=10$", "$x+3y=10$"], "B", "Analytical Geometry > Coordinate Geometry Basics > Locus", 30,
  r"""Step 1: The lines meet at $\left(\tfrac35, \tfrac15\right)$.
Step 2: With intercepts $a=2h$, $b=2k$: $\dfrac{3}{5\cdot2h}+\dfrac{1}{5\cdot2k}=1$, i.e. $3k+h=10hk$.
Step 3: The locus is $x+3y=10xy$.
Answer: (b)""", theme="Locus of the midpoint of intercepts")

Q(59, r"""What is the equation to the straight line passing through the point $(-\sin\theta, \cos\theta)$ and perpendicular to the line $x\cos\theta+y\sin\theta=9$?""",
  [r"$x\sin\theta-y\cos\theta-1=0$", r"$x\sin\theta-y\cos\theta+1=0$", r"$x\sin\theta-y\cos\theta=0$", r"$x\cos\theta-y\sin\theta+1=0$"], "B", "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 20,
  r"""Step 1: A perpendicular line has the form $x\sin\theta-y\cos\theta=c$.
Step 2: At $(-\sin\theta,\cos\theta)$: $c=-\sin^2\theta-\cos^2\theta=-1$.
Step 3: The line is $x\sin\theta-y\cos\theta+1=0$.
Answer: (b)""", theme="Perpendicular line through a point")

Q(60, r"""Two points $P$ and $Q$ lie on line $y=2x+3$. These two points $P$ and $Q$ are at a distance 2 units from another point $R(1, 5)$. What are the coordinates of the points $P$ and $Q$?""",
  [r"$\left(1+\dfrac2{\sqrt5}, 5+\dfrac4{\sqrt5}\right), \left(1-\dfrac2{\sqrt5}, 5-\dfrac4{\sqrt5}\right)$",
   r"$\left(3+\dfrac2{\sqrt5}, 5+\dfrac4{\sqrt5}\right), \left(-1-\dfrac2{\sqrt5}, 5-\dfrac4{\sqrt5}\right)$",
   r"$\left(1-\dfrac2{\sqrt5}, 5+\dfrac4{\sqrt5}\right), \left(1+\dfrac2{\sqrt5}, 5-\dfrac4{\sqrt5}\right)$",
   r"$\left(3-\dfrac2{\sqrt5}, 5+\dfrac4{\sqrt5}\right), \left(-1+\dfrac2{\sqrt5}, 5-\dfrac4{\sqrt5}\right)$"], "A", "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 25,
  r"""Step 1: $R(1,5)$ lies on the line, whose unit direction is $\left(\tfrac1{\sqrt5}, \tfrac2{\sqrt5}\right)$.
Step 2: Moving 2 units each way gives $\left(1\pm\tfrac2{\sqrt5}, 5\pm\tfrac4{\sqrt5}\right)$.
Answer: (a)""", theme="Points at a given distance along a line")

Q(61, r"""If two sides of a square lie on the lines $2x+y-3=0$ and $4x+2y+5=0$, then what is the area of the square in square units?""",
  ["6.05", "6.15", "6.25", "6.35"], "A", "Analytical Geometry > Straight Lines > Distance from a Point to a Line", 20,
  r"""Step 1: The lines are parallel: $2x+y-3=0$ and $2x+y+\tfrac52=0$.
Step 2: Side $=\dfrac{5.5}{\sqrt5}$, so area $=\dfrac{30.25}{5}=6.05$.
Answer: (a)""", theme="Square between parallel lines")

Q(62, r"""$ABC$ is a triangle with $A(3, 5)$. The mid-points of sides $AB$, $AC$ are at $(-1, 2)$, $(6, 4)$ respectively. What are the coordinates of centroid of the triangle $ABC$?""",
  [r"$\left(\dfrac83, \dfrac{11}3\right)$", r"$\left(\dfrac73, \dfrac73\right)$", r"$\left(2, \dfrac83\right)$", r"$\left(\dfrac83, 2\right)$"], "B", "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 15,
  r"""Step 1: $B=(-5,-1)$ and $C=(9,3)$.
Step 2: Centroid $=\left(\dfrac{3-5+9}3, \dfrac{5-1+3}3\right)=\left(\dfrac73, \dfrac73\right)$.
Answer: (b)""", theme="Centroid from midpoints")

Q(63, r"""$ABC$ is an acute angled isosceles triangle. Two equal sides $AB$ and $AC$ lie on the lines $7x-y-3=0$ and $x+y-5=0$. If $\theta$ is one of the equal angles, then what is $\cot\theta$ equal to?""",
  [r"$\dfrac13$", r"$\dfrac12$", r"$\dfrac23$", "2"], "B", "Analytical Geometry > Straight Lines > Angle between Lines", 35,
  r"""Step 1: Slopes 7 and $-1$ give $\tan A=\left|\dfrac{7+1}{1-7}\right|=\dfrac43$ (acute $A$).
Step 2: $\theta=90^\circ-\dfrac A2$, so $\cot\theta=\tan\dfrac A2$.
Step 3: $\dfrac{2t}{1-t^2}=\dfrac43$ gives $t=\dfrac12$.
Answer: (b)""", theme="Base angles of an isosceles triangle")

Q(64, r"""In the parabola $y^2=8x$, the focal distance of a point $P$ lying on it is 8 units. Which of the following statements is/are correct?
1. The coordinates of $P$ can be $(6, 4\sqrt3)$.
2. The perpendicular distance of $P$ from the directrix of parabola is 8 units.""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Analytical Geometry > Conic Sections > Parabola", 20,
  r"""Step 1: Focal distance $=x+2=8$, so $x=6$ and $y^2=48$, $y=\pm4\sqrt3$. Statement 1 is correct.
Step 2: Distance from the directrix equals the focal distance, 8. Statement 2 is correct.
Answer: (c)""", pattern=S2, theme="Focal distance on a parabola")

Q(65, r"""What is the eccentricity of the ellipse if the angle between the straight lines joining the foci to an extremity of the minor axis is $90^\circ$?""",
  [r"$\dfrac13$", r"$\dfrac12$", r"$\dfrac1{\sqrt3}$", r"$\dfrac1{\sqrt2}$"], "D", "Analytical Geometry > Conic Sections > Ellipse", 20,
  r"""Step 1: A right angle at $(0,b)$ means $b=ae$.
Step 2: $b^2=a^2(1-e^2)$ gives $e^2=1-e^2$, so $e=\dfrac1{\sqrt2}$.
Answer: (d)""", theme="Foci subtending a right angle")

Q(66, r"""Let $\vec a=\hat i-\hat j+\hat k$ and $\vec b=\hat i+2\hat j-\hat k$. If $\vec a\times(\vec b\times\vec a)=\alpha\hat i-\beta\hat j+\gamma\hat k$, then what is the value of $\alpha+\beta+\gamma$?""",
  ["8", "7", "6", "1"], "A", "Vector Algebra > Vectors > Vector (Cross) Product", 30,
  r"""Step 1: $\vec a\times(\vec b\times\vec a)=(\vec a\cdot\vec a)\vec b-(\vec a\cdot\vec b)\vec a=3\vec b+2\vec a=5\hat i+4\hat j-\hat k$.
Step 2: As printed ($-\beta\hat j$), $\alpha=5$, $\beta=-4$, $\gamma=-1$ and the sum is 0, which is not an option. Reading the $\hat j$ term as $+\beta\hat j$ gives 8.
Answer: none as printed; (a) under the intended reading""", theme="Vector triple product")
W(66, "As printed (alpha i - beta j + gamma k) the sum is 0, which is not an option; 8 only if the j-term sign is +.")

Q(67, r"""If a vector of magnitude 2 units makes an angle $\dfrac\pi3$ with $2\hat i$, $\dfrac\pi4$ with $3\hat j$ and an acute angle $\theta$ with $4\hat k$, then what are the components of the vector?""",
  [r"$(1, \sqrt2, 1)$", r"$(1, -\sqrt2, 1)$", r"$(1, -\sqrt2, -1)$", r"$(1, \sqrt2, -1)$"], "A", "Vector Algebra > Vectors > Basics and Position Vectors", 20,
  r"""Step 1: Components: $2\cos60^\circ=1$ and $2\cos45^\circ=\sqrt2$.
Step 2: $z^2=4-1-2=1$; the angle is acute, so $z=1$.
Answer: (a)""", theme="Components from direction angles")

Q(68, r"""Consider the following in respect of moment of a force:
1. The moment of force about a point is independent of point of application of force.
2. The moment of a force about a line is a vector quantity.
Which of the statements given above is/are correct?""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "D", "Vector Algebra > Vectors > Vector (Cross) Product", 30,
  r"""Step 1: The moment about a point is $\vec r\times\vec F$, which depends on where the force acts (it is unchanged only when the point slides along the line of action). Statement 1 is incorrect.
Step 2: The moment about a line is the component of the moment along that line, a scalar. Statement 2 is incorrect.
Answer: (d)""", pattern=S2, theme="Moment of a force")
F(68, "Statement 1 hinges on 'point of application' vs 'line of action'; the standard key treats it as false")

Q(69, r"""For any vector $\vec r$, what is $(\vec r\cdot\hat i)(\vec r\times\hat i)+(\vec r\cdot\hat j)(\vec r\times\hat j)+(\vec r\cdot\hat k)(\vec r\times\hat k)$ equal to?""",
  [r"$\vec 0$", r"$\vec r$", r"$2\vec r$", r"$3\vec r$"], "A", "Vector Algebra > Vectors > Vector (Cross) Product", 20,
  r"""Step 1: The sum is $\vec r\times\left[(\vec r\cdot\hat i)\hat i+(\vec r\cdot\hat j)\hat j+(\vec r\cdot\hat k)\hat k\right]=\vec r\times\vec r$.
Step 2: $\vec r\times\vec r=\vec 0$.
Answer: (a)""", theme="Resolving a vector inside a cross product")

Q(70, r"""Let $\vec a$ and $\vec b$ are two vectors of magnitude 4 inclined at an angle $\dfrac\pi3$, then what is the angle between $\vec a$ and $\vec a-\vec b$?""",
  [r"$\dfrac\pi2$", r"$\dfrac\pi3$", r"$\dfrac\pi4$", r"$\dfrac\pi6$"], "B", "Vector Algebra > Vectors > Scalar (Dot) Product", 20,
  r"""Step 1: $|\vec a-\vec b|^2=16+16-16=16$, so $|\vec a-\vec b|=4$.
Step 2: $\vec a\cdot(\vec a-\vec b)=16-8=8=4\cdot4\cos\phi$, so $\cos\phi=\dfrac12$.
Answer: (b)""", theme="Angle with a difference vector")

Q(71, r"""Let $y_1(x)$ and $y_2(x)$ be two solutions of the differential equation $\dfrac{dy}{dx}=x$. If $y_1(0)=0$ and $y_2(0)=4$, then what is the number of points of intersection of the curves $y_1(x)$ and $y_2(x)$?""",
  ["No point", "One point", "Two points", "More than two points"], "A", "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 15,
  r"""Step 1: $y_1=\dfrac{x^2}2$ and $y_2=\dfrac{x^2}2+4$.
Step 2: They differ by 4 everywhere, so they never meet.
Answer: (a)""", theme="Parallel solution curves")

Q(72, r"""The differential equation, representing the curve $y=e^x(a\cos x+b\sin x)$ where $a$ and $b$ are arbitrary constants, is""",
  [r"$\dfrac{d^2y}{dx^2}+2y=0$", r"$\dfrac{d^2y}{dx^2}+2\dfrac{dy}{dx}+2y=0$", r"$\dfrac{d^2y}{dx^2}-2\dfrac{dy}{dx}+2y=0$", r"$\dfrac{d^2y}{dx^2}+y=0$"], "C", "Integral Calculus and Differential Equations > Differential Equations > Formation", 25,
  r"""Step 1: The solution corresponds to characteristic roots $1\pm i$.
Step 2: Their equation is $m^2-2m+2=0$, so $y''-2y'+2y=0$.
Answer: (c)""", theme="Eliminating two constants")

Q(73, r"""If $f(x)=ax-b$ and $g(x)=cx+d$ are such that $f(g(x))=g(f(x))$, then which one of the following holds?""",
  ["$f(d)=g(b)$", "$f(b)+g(d)=0$", "$f(a)+g(c)=2a$", "$f(d)+g(b)=2d$"], "D", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 30,
  r"""Step 1: $f(g(x))=acx+ad-b$ and $g(f(x))=acx-bc+d$, so $ad+bc=b+d$.
Step 2: $f(d)+g(b)=ad-b+bc+d=(b+d)-b+d=2d$.
Answer: (d)""", theme="Commuting linear functions")

Q(74, r"""What is $\displaystyle\int_{-1}^{1}(3\sin x-\sin3x)\cos^2x\,dx$ equal to?""",
  [r"$-\dfrac14$", "0", r"$\dfrac12$", r"$\dfrac14$"], "B", "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 10,
  r"""Step 1: The integrand is odd.
Step 2: Over $[-1,1]$ the integral is 0.
Answer: (b)""", theme="Odd integrand over a symmetric interval")

Q(75, r"""What are the order and degree respectively of the differential equation $\left\{2-\left(\dfrac{dy}{dx}\right)^2\right\}^{0.6}=\dfrac{d^2y}{dx^2}$?""",
  ["2, 2", "2, 3", "5, 2", "2, 5"], "D", "Integral Calculus and Differential Equations > Differential Equations > Order and Degree", 20,
  r"""Step 1: $0.6=\dfrac35$; raising to the fifth power: $\left(2-y'^2\right)^3=\left(y''\right)^5$.
Step 2: Order 2, degree 5.
Answer: (d)""", theme="Clearing a fractional power")

Q(76, r"""If $\dfrac{dy}{dx}=2e^xy^3$, $y(0)=\dfrac12$ then what is $4y^2(2-e^x)$ equal to?""",
  ["1", "2", "3", "4"], "A", "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 25,
  r"""Step 1: Separating: $-\dfrac1{2y^2}=2e^x+C$; $y(0)=\dfrac12$ gives $C=-4$.
Step 2: $\dfrac1{2y^2}=4-2e^x$, i.e. $4y^2(2-e^x)=1$.
Answer: (a)""", theme="Variables separable")

Q(77, r"""Let $p=\displaystyle\int_a^b f(x)\,dx$ and $q=\displaystyle\int_a^b|f(x)|\,dx$. If $f(x)=e^{-x}$, then which one of the following is correct?""",
  ["$p=2q$", "$p=-q$", "$4p=q$", "$p=q$"], "D", "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 10,
  r"""Step 1: $e^{-x}>0$ for all $x$, so $|f(x)|=f(x)$.
Step 2: Hence $p=q$.
Answer: (d)""", theme="Integral of a positive function")

Q(78, r"""What is $\displaystyle\int_0^{\pi/2}\frac{a+\sin x}{2a+\sin x+\cos x}\,dx$ equal to?""",
  [r"$\dfrac\pi4$", r"$\dfrac\pi2$", "1", "0"], "A", "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 20,
  r"""Step 1: Replacing $x$ by $\dfrac\pi2-x$ gives the same integral with $a+\cos x$ on top.
Step 2: Adding: $2I=\displaystyle\int_0^{\pi/2}1\,dx=\dfrac\pi2$, so $I=\dfrac\pi4$.
Answer: (a)""", theme="King's property")

Q(79, r"""The non-negative values of $b$ for which the function $\dfrac{16x^3}3-4bx^2+x$ has neither maximum nor minimum in the range $x>0$ is""",
  ["$0<b<1$", "$1<b<2$", "$b>2$", r"$0\le b<1$"], "D", "Differential Calculus > Applications of Derivatives > Maxima and Minima", 30,
  r"""Step 1: $f'(x)=16x^2-8bx+1$. There is no extremum when $f'$ does not change sign: $64b^2-64\le0$, i.e. $b\le1$.
Step 2: With $b\ge0$ this is $0\le b\le1$; option (d) is the only one covering $b=0$ (at $b=1$, $f'=(4x-1)^2\ge0$ also has no extremum).
Answer: (d)""", theme="Cubic with no turning point")
F(79, "Exact range is 0 <= b <= 1; option (d) omits b = 1 but is the closest option")

Q(80, r"""Which one of the following is correct in respect of $f(x)=\dfrac1{\sqrt{|x|-x}}$ and $g(x)=\dfrac1{\sqrt{x-|x|}}$?""",
  ["$f(x)$ has some domain and $g(x)$ has no domain", "$f(x)$ has no domain and $g(x)$ has some domain", "$f(x)$ and $g(x)$ have the same domain", "$f(x)$ and $g(x)$ do not have any domain"], "A", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 20,
  r"""Step 1: $|x|-x>0$ exactly when $x<0$, so $f$ has domain $(-\infty,0)$.
Step 2: $x-|x|\le0$ for every $x$, so $g$ is defined nowhere.
Answer: (a)""", theme="Domains with modulus")

P("int29", "Linear combination of sine and cosine", r"""Given that $\displaystyle\int\frac{3\cos x+4\sin x}{2\cos x+5\sin x}\,dx=\frac{\alpha x}{29}+\frac{\beta}{29}\ln|2\cos x+5\sin x|+c$""")

Q(81, r"""What is the value of $\alpha$?""", ["7", "13", "17", "26"], "D", "Integral Calculus and Differential Equations > Indefinite Integration > Standard Forms", 30,
  r"""Step 1: Write $3\cos x+4\sin x=A(2\cos x+5\sin x)+B(5\cos x-2\sin x)$.
Step 2: $2A+5B=3$ and $5A-2B=4$ give $A=\dfrac{26}{29}$, $B=\dfrac7{29}$.
Step 3: $\alpha=26$.
Answer: (d)""", passage="int29", pattern=LS, theme="Coefficient of x")

Q(82, r"""What is the value of $\beta$?""", ["7", "13", "17", "26"], "A", "Integral Calculus and Differential Equations > Indefinite Integration > Standard Forms", 30,
  r"""Step 1: From the same split, $B=\dfrac7{29}$ multiplies $\ln|2\cos x+5\sin x|$.
Step 2: $\beta=7$.
Answer: (a)""", passage="int29", pattern=LS, theme="Coefficient of the log term")

P("xlnx", "The function x / ln x", r"""Let $f(x)=\dfrac{x}{\ln x}$; $(x>1)$""")

Q(83, r"""Consider the following statements:
1. $f(x)$ is increasing in the interval $(e, \infty)$
2. $f(x)$ is decreasing in the interval $(1, e)$
3. $9\ln7>7\ln9$
Which of the statements given above are correct?""",
  ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "D", "Differential Calculus > Applications of Derivatives > Increasing and Decreasing Functions", 30,
  r"""Step 1: $f'(x)=\dfrac{\ln x-1}{(\ln x)^2}$: positive for $x>e$, negative on $(1,e)$. Statements 1 and 2 are correct.
Step 2: $f$ increases beyond $e$, so $f(7)<f(9)$: $\dfrac7{\ln7}<\dfrac9{\ln9}$, i.e. $9\ln7>7\ln9$. Statement 3 is correct.
Answer: (d)""", passage="xlnx", pattern=LS, theme="Monotonicity of x/ln x")

Q(84, r"""Consider the following statements:
1. $f''(e)=\dfrac1e$
2. $f(x)$ attains local minimum value at $x=e$
3. A local minimum value of $f(x)$ is $e$
Which of the statements given above are correct?""",
  ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "D", "Differential Calculus > Applications of Derivatives > Maxima and Minima", 30,
  r"""Step 1: $f''(x)=\dfrac{2-\ln x}{x(\ln x)^3}$, so $f''(e)=\dfrac1e>0$.
Step 2: $f'(e)=0$ with $f''(e)>0$: a local minimum at $x=e$, of value $f(e)=e$.
Answer: (d)""", passage="xlnx", pattern=LS, theme="Second-derivative test for x/ln x")

P("fog", "Recovering f from f o g", r"""Let $f(x)$ and $g(x)$ be two functions such that $g(x)=x-\dfrac1x$ and $f\circ g(x)=x^3-\dfrac1{x^3}$.""")

Q(85, r"""What is $g[f(x)-3x]$ equal to?""",
  [r"$x^3-\dfrac1{x^3}$", r"$x^3+\dfrac1{x^3}$", r"$x^2-\dfrac1{x^2}$", r"$x^2+\dfrac1{x^2}$"], "A", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 30,
  r"""Step 1: $x^3-\dfrac1{x^3}=t^3+3t$ with $t=x-\dfrac1x$, so $f(t)=t^3+3t$.
Step 2: $f(x)-3x=x^3$ and $g(x^3)=x^3-\dfrac1{x^3}$.
Answer: (a)""", passage="fog", pattern=LS, theme="Composition after recovering f")

Q(86, r"""What is $f''(x)$ equal to?""", [r"$-\dfrac2{x^3}$", r"$2x+\dfrac2{x^3}$", "$6x+3$", "$6x$"], "D", "Differential Calculus > Differentiation > Higher-order Derivatives", 15,
  r"""Step 1: $f(x)=x^3+3x$.
Step 2: $f''(x)=6x$.
Answer: (d)""", passage="fog", pattern=LS, theme="Second derivative of the recovered f")

P("hfg", "Ratio with the greatest integer function", r"""Let $f(x)=|x|+1$ and $g(x)=[x]-1$, where $[\cdot]$ is the greatest integer function. Let $h(x)=\dfrac{f(x)}{g(x)}$.""")

Q(87, r"""Consider the following statements:
1. $f(x)$ is differentiable for all $x<0$
2. $g(x)$ is continuous at $x=0.0001$
3. The derivative of $g(x)$ at $x=2.5$ is 1
Which of the statements given above are correct?""",
  ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "A", "Differential Calculus > Limits and Continuity > Continuity", 25,
  r"""Step 1: For $x<0$, $f(x)=1-x$ is differentiable. Statement 1 is correct.
Step 2: $[x]$ is constant on $(0,1)$, so $g$ is continuous at 0.0001 and $g'(2.5)=0$. Statement 2 is correct; statement 3 is not.
Answer: (a)""", passage="hfg", pattern=S3, theme="Continuity of floor-based functions")

Q(88, r"""What is $\displaystyle\lim_{x\to0^-}h(x)+\lim_{x\to0^+}h(x)$ equal to?""",
  [r"$-\dfrac32$", r"$-\dfrac12$", r"$\dfrac12$", r"$\dfrac32$"], "A", "Differential Calculus > Limits and Continuity > Limits", 25,
  r"""Step 1: As $x\to0^-$, $[x]=-1$, so $h\to\dfrac1{-2}=-\dfrac12$.
Step 2: As $x\to0^+$, $[x]=0$, so $h\to\dfrac1{-1}=-1$.
Step 3: Sum $=-\dfrac32$.
Answer: (a)""", passage="hfg", pattern=LS, theme="One-sided limits")

P("phi", "Integral of |sin x| over 100 pi", r"""Let $\varphi(a)=\displaystyle\int_a^{a+100\pi}|\sin x|\,dx$""")

Q(89, r"""What is $\varphi(a)$ equal to?""", ["0", "$a$", "$100a$", "200"], "D", "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 20,
  r"""Step 1: $|\sin x|$ has period $\pi$ and $\displaystyle\int_0^\pi|\sin x|\,dx=2$.
Step 2: Over 100 periods the integral is 200, whatever $a$ is.
Answer: (d)""", passage="phi", pattern=LS, theme="Periodic integrand")

Q(90, r"""What is $\varphi'(a)$ equal to?""", ["0", r"$\pi$", "100", "200"], "A", "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 15,
  r"""Step 1: $\varphi(a)=200$ is constant.
Step 2: So $\varphi'(a)=0$.
Answer: (a)""", passage="phi", pattern=LS, theme="Derivative of a constant integral")

P("lmax", "Local maximum at the origin", r"""A differentiable function $f(x)$ has a local maximum at $x=0$. Let $y=2f(x)+ax-b$.""")

Q(91, r"""Which of the following is/are correct?
1. $f'(0)=0$
2. $f''(0)<0$""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", "Differential Calculus > Applications of Derivatives > Maxima and Minima", 25,
  r"""Step 1: At an interior local maximum of a differentiable function, $f'(0)=0$. Statement 1 is correct.
Step 2: $f''(0)$ need not be negative (e.g. $-x^4$ has $f''(0)=0$). Statement 2 is not necessarily true.
Answer: (a)""", passage="lmax", pattern=S2, theme="Necessary conditions at a maximum")

Q(92, r"""The function $y$ has a relative maxima at $x=0$ for""",
  ["$a>0$, $b=0$", "for all $b$ and $a=0$", "for all $b>0$ only", "for all $a$ and $b=0$"], "B", "Differential Calculus > Applications of Derivatives > Maxima and Minima", 25,
  r"""Step 1: $y'(0)=2f'(0)+a=a$, which must be 0.
Step 2: The constant $b$ only shifts the graph, so any $b$ works.
Answer: (b)""", passage="lmax", pattern=LS, theme="Keeping the maximum after adding a line")

P("hfx", "Product of |x-1| and [x]", r"""Let $f(x)=|x-1|$, $g(x)=[x]$ and $h(x)=f(x)g(x)$ where $[\cdot]$ is greatest integer function.""")

Q(93, r"""What is $\displaystyle\int_{-1}^{0}h(x)\,dx$ equal to?""",
  [r"$-\dfrac32$", "$-1$", "0", r"$\dfrac12$"], "A", "Integral Calculus and Differential Equations > Definite Integrals > Evaluation", 25,
  r"""Step 1: On $[-1,0)$, $[x]=-1$ and $|x-1|=1-x$, so $h=x-1$.
Step 2: $\displaystyle\int_{-1}^0(x-1)\,dx=-\dfrac12-1=-\dfrac32$.
Answer: (a)""", passage="hfx", pattern=LS, theme="Piecewise integral on [-1, 0]")

Q(94, r"""What is $\displaystyle\int_0^2h(x)\,dx$ equal to?""",
  [r"$-\dfrac32$", "$-1$", "0", r"$\dfrac12$"], "D", "Integral Calculus and Differential Equations > Definite Integrals > Evaluation", 25,
  r"""Step 1: On $[0,1)$, $[x]=0$, so $h=0$.
Step 2: On $[1,2)$, $h=x-1$, with integral $\dfrac12$.
Answer: (d)""", passage="hfx", pattern=LS, theme="Piecewise integral on [0, 2]")

P("sqrtint", "Rationalising a difference of roots", r"""Let $\displaystyle\int\frac{dx}{\sqrt{x+1}-\sqrt{x-1}}=\alpha(x+1)^{3/2}+\beta(x-1)^{3/2}+c$""")

Q(95, r"""What is the value of $\alpha$?""", [r"$\dfrac13$", r"$\dfrac23$", "1", r"$\dfrac43$"], "A", "Integral Calculus and Differential Equations > Indefinite Integration > Standard Forms", 25,
  r"""Step 1: Rationalising, the integrand is $\dfrac{\sqrt{x+1}+\sqrt{x-1}}2$.
Step 2: Integrating: $\dfrac13(x+1)^{3/2}+\dfrac13(x-1)^{3/2}+c$, so $\alpha=\dfrac13$.
Answer: (a)""", passage="sqrtint", pattern=LS, theme="Coefficient of (x+1)^(3/2)")

Q(96, r"""What is the value of $\beta$?""", [r"$-\dfrac23$", r"$-\dfrac13$", r"$\dfrac13$", r"$\dfrac23$"], "C", "Integral Calculus and Differential Equations > Indefinite Integration > Standard Forms", 25,
  r"""Step 1: From the same integral, the $(x-1)^{3/2}$ term has coefficient $\dfrac12\cdot\dfrac23=\dfrac13$.
Answer: (c)""", passage="sqrtint", pattern=LS, theme="Coefficient of (x-1)^(3/2)")

P("seg", "Circle cut by y = x", r"""The circle $x^2+y^2-2x=0$ is partitioned by line $y=x$ in two segments. Let $A_1$, $A_2$ be the areas of major and minor segments respectively.""")

Q(97, r"""What is the value of $A_1$?""",
  [r"$\dfrac{\pi-2}4$", r"$\dfrac{\pi+2}4$", r"$\dfrac{3\pi-2}4$", r"$\dfrac{3\pi+2}4$"], "D", "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 30,
  r"""Step 1: The circle has centre $(1,0)$, radius 1; the chord from $(0,0)$ to $(1,1)$ subtends $90^\circ$ at the centre.
Step 2: Minor segment $A_2=\dfrac\pi4-\dfrac12=\dfrac{\pi-2}4$.
Step 3: $A_1=\pi-A_2=\dfrac{3\pi+2}4$.
Answer: (d)""", passage="seg", pattern=LS, theme="Major segment area")

Q(98, r"""What is the value of $\dfrac{2(A_1+A_2)}{A_1-3A_2}$?""", [r"$\pi$", "1", "$-1$", r"$-\pi$"], "A", "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 25,
  r"""Step 1: $A_1+A_2=\pi$ and $A_1-3A_2=\dfrac{3\pi+2-3\pi+6}4=2$.
Step 2: The ratio is $\dfrac{2\pi}2=\pi$.
Answer: (a)""", passage="seg", pattern=LS, theme="Combining segment areas")

P("func", "Functional equation in f(x) and f(1/x)", r"""Let $3f(x)+f\left(\dfrac1x\right)=\dfrac1x+1$""")

Q(99, r"""What is $f(x)$ equal to?""",
  [r"$\dfrac1{8x}-\dfrac x8+\dfrac14$", r"$\dfrac3{8x}-\dfrac x8+\dfrac34$", r"$\dfrac3{8x}+\dfrac x8+\dfrac14$", r"$\dfrac3{8x}-\dfrac x8+\dfrac14$"], "D", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 25,
  r"""Step 1: Replacing $x$ by $\dfrac1x$: $3f\left(\dfrac1x\right)+f(x)=x+1$.
Step 2: Eliminating $f(1/x)$: $8f(x)=\dfrac3x-x+2$.
Answer: (d)""", passage="func", pattern=LS, theme="Solving the functional equation")

Q(100, r"""What is $8\displaystyle\int_1^2f(x)\,dx$ equal to?""",
  [r"$\ln(8\sqrt e)$", r"$\ln(4\sqrt e)$", r"$\ln2$", r"$\ln2-1$"], "A", "Integral Calculus and Differential Equations > Definite Integrals > Evaluation", 25,
  r"""Step 1: $\displaystyle\int_1^2\left(\frac3x-x+2\right)dx=3\ln2-\frac32+2=3\ln2+\frac12$.
Step 2: This equals $\ln8+\ln\sqrt e=\ln(8\sqrt e)$.
Answer: (a)""", passage="func", pattern=LS, theme="Integrating the solved function")

Q(101, r"""A bag contains 5 black and 4 white balls. A man selects two balls at random. What is the probability that both these are of the same colour?""",
  [r"$\dfrac16$", r"$\dfrac5{108}$", r"$\dfrac49$", r"$\dfrac5{18}$"], "C", "Probability > Classical Probability > Events and Sample Space", 15,
  r"""Step 1: Favourable: $\binom52+\binom42=10+6=16$; total $\binom92=36$.
Step 2: Probability $=\dfrac{16}{36}=\dfrac49$.
Answer: (c)""", theme="Same-colour draw")

Q(102, r"""If a random variable $(x)$ follows binomial distribution with mean 5 and variance 4, and $5^{23}P(X=3)=\lambda4^\lambda$, then what is the value of $\lambda$?""",
  ["3", "5", "23", "25"], "C", "Probability > Probability Distributions > Binomial Distribution", 30,
  r"""Step 1: $q=\dfrac45$, $p=\dfrac15$, $n=25$.
Step 2: $P(X=3)=\binom{25}3\dfrac{4^{22}}{5^{25}}=\dfrac{2300\cdot4^{22}}{5^{25}}$, so $5^{23}P=92\cdot4^{22}=23\cdot4^{23}$.
Step 3: $\lambda=23$.
Answer: (c)""", theme="Binomial parameters from mean and variance")

Q(103, r"""From data $(-4, 1)$, $(-1, 2)$, $(2, 7)$ and $(3, 1)$, the regression line of $y$ on $x$ is obtained as $y=a+bx$, then what is the value of $2a+15b$?""",
  ["6", "11", "17", "21"], "B", "Statistics > Correlation > Correlation Coefficient", 30,
  r"""Step 1: $\bar x=0$, $\bar y=\dfrac{11}4$, $\sum xy=11$, $\sum x^2=30$.
Step 2: $b=\dfrac{11}{30}$ and $a=\bar y=\dfrac{11}4$.
Step 3: $2a+15b=\dfrac{11}2+\dfrac{11}2=11$.
Answer: (b)""", theme="Least-squares regression line")

Q(104, r"""Let $x+2y+1=0$ and $2x+3y+4=0$ are two lines of regression computed from some bivariate data. If $\theta$ is the acute angle between them, then what is the value of $488\tan3\theta$?""",
  ["191", "161", "131", "121"], "A", "Statistics > Correlation > Correlation Coefficient", 30,
  r"""Step 1: Slopes $-\dfrac12$ and $-\dfrac23$ give $\tan\theta=\dfrac{1/6}{4/3}=\dfrac18$.
Step 2: $\tan3\theta=\dfrac{3/8-1/512}{1-3/64}=\dfrac{191}{488}$.
Step 3: $488\tan3\theta=191$.
Answer: (a)""", theme="Angle between regression lines")

Q(105, r"""If two random variables $X$ and $Y$ are connected by relation $\dfrac{2X-3Y}{5X+4Y}=4$ and $X$ follows Binomial distribution with parameters $n=10$ and $p=\dfrac12$, then what is the variance of $Y$?""",
  [r"$\dfrac{810}{361}$", r"$\dfrac9{19}$", r"$\dfrac{21}{361}$", r"$\dfrac{121}{361}$"], "A", "Probability > Probability Distributions > Binomial Distribution", 30,
  r"""Step 1: $2X-3Y=20X+16Y$ gives $Y=-\dfrac{18}{19}X$.
Step 2: $\operatorname{Var}X=10\cdot\dfrac14=\dfrac52$, so $\operatorname{Var}Y=\dfrac{324}{361}\cdot\dfrac52=\dfrac{810}{361}$.
Answer: (a)""", theme="Variance under a linear relation")

Q(106, r"""If $a, b, c$ are in HP, then what is $\dfrac1{b-a}+\dfrac1{b-c}$ equal to?
1. $\dfrac2b$
2. $\dfrac1a+\dfrac1c$
3. $\dfrac12\left(\dfrac1a+\dfrac1b+\dfrac1c\right)$
Select the correct answer using the code given below:""",
  ["1 only", "2 only", "3 only", "1, 2 and 3"], "A", "Algebra > Sequences and Series > Special Series and Means", 30,
  r"""Step 1: For $a, b, c$ in HP, $\dfrac1{b-a}+\dfrac1{b-c}=\dfrac2b=\dfrac1a+\dfrac1c$ (check: $a=1$, $c=3$, $b=\tfrac32$ gives $\tfrac43$ for both).
Step 2: Expression 3 equals $\dfrac3{2b}$, which differs.
Step 3: So 1 and 2 are both correct, a combination not offered.
Answer: none of the options""", pattern=S3, theme="Harmonic progression identity")
W(106, "Expressions 1 and 2 are both equal to the given sum (2/b = 1/a + 1/c in HP); the code offers no '1 and 2 only' option.")

Q(107, r"""An edible oil is sold at the rates 150, 200, 250, 300 rupees per litre in four consecutive years. Assuming that an equal amount of money is spent on oil by a family in every year during these years, what is the average price of oil in rupees (approximately) per litre?""",
  ["210", "220", "230", "240"], "A", "Statistics > Measures of Central Tendency > Mean", 25,
  r"""Step 1: Equal spending calls for the harmonic mean.
Step 2: $\dfrac4{1/150+1/200+1/250+1/300}=\dfrac{12000}{57}\approx210.5$.
Answer: (a)""", theme="Harmonic mean of prices")

Q(108, r"""If the letters of the word "TIRUPATI" are written down at random, then what is the probability that both Ts are always consecutive?""",
  [r"$\dfrac12$", r"$\dfrac14$", r"$\dfrac17$", r"$\dfrac1{14}$"], "B", "Probability > Classical Probability > Events and Sample Space", 25,
  r"""Step 1: The two Ts occupy 2 of 8 positions, all $\binom82=28$ pairs equally likely.
Step 2: 7 of these pairs are adjacent, so the probability is $\dfrac7{28}=\dfrac14$.
Answer: (b)""", theme="Adjacent identical letters")

Q(109, r"""Let $m=77^n$. The index $n$ is given a positive integral value at random. What is the probability that the value of $m$ will have 1 in the units place?""",
  [r"$\dfrac12$", r"$\dfrac13$", r"$\dfrac14$", r"$\dfrac1n$"], "C", "Probability > Classical Probability > Events and Sample Space", 15,
  r"""Step 1: The units digit of $7^n$ cycles 7, 9, 3, 1.
Step 2: It is 1 for one value in four, so the probability is $\dfrac14$.
Answer: (c)""", theme="Cyclicity of units digit")

Q(110, r"""Three different numbers are selected at random from the first 15 natural numbers. What is the probability that the product of two of the numbers is equal to third number?""",
  [r"$\dfrac1{91}$", r"$\dfrac2{455}$", r"$\dfrac1{65}$", r"$\dfrac6{455}$"], "C", "Probability > Classical Probability > Events and Sample Space", 35,
  r"""Step 1: Triples $\{a, b, ab\}$ with $2\le a<b$, $ab\le15$: $a=2$, $b=3$ to 7 (5 triples); $a=3$, $b=4, 5$ (2 triples). Total 7.
Step 2: Probability $=\dfrac7{\binom{15}3}=\dfrac7{455}=\dfrac1{65}$.
Answer: (c)""", theme="Product of two equals the third")

P("pab", "Bounds on two events", r"""Let $A$ and $B$ be two events such that $P(A\cup B)\ge0.75$ and $0.125\le P(A\cap B)\le0.375$.""")

Q(111, r"""What is the minimum value of $P(A)+P(B)$?""", ["0.625", "0.750", "0.825", "0.875"], "D", "Probability > Classical Probability > Addition and Multiplication Rules", 25,
  r"""Step 1: $P(A)+P(B)=P(A\cup B)+P(A\cap B)$.
Step 2: Minimum $=0.75+0.125=0.875$.
Answer: (d)""", passage="pab", pattern=LS, theme="Minimum of P(A)+P(B)")

Q(112, r"""What is the maximum value of $P(A)+P(B)$?""", ["0.75", "1.125", "1.375", "1.625"], "C", "Probability > Classical Probability > Addition and Multiplication Rules", 25,
  r"""Step 1: $P(A\cup B)\le1$ and $P(A\cap B)\le0.375$.
Step 2: Maximum $=1+0.375=1.375$.
Answer: (c)""", passage="pab", pattern=LS, theme="Maximum of P(A)+P(B)")

P("pabc", "Bounds for three events", r"""$A$, $B$ and $C$ are three events such that $P(A)=0.6$, $P(B)=0.4$, $P(C)=0.5$, $P(A\cup B)=0.8$, $P(A\cap C)=0.3$ and $P(A\cap B\cap C)=0.2$ and $P(A\cup B\cup C)\ge0.85$.""")

Q(113, r"""What is the minimum value of $P(B\cap C)$?""", ["0.1", "0.2", "0.35", "0.45"], "B", "Probability > Classical Probability > Addition and Multiplication Rules", 30,
  r"""Step 1: $P(A\cap B)=0.6+0.4-0.8=0.2$, so $P(A\cup B\cup C)=1.5-0.2-0.3-x+0.2=1.2-x$ with $x=P(B\cap C)$.
Step 2: $x\ge P(A\cap B\cap C)=0.2$ (and $1.2-x\le1$ also gives $x\ge0.2$).
Answer: (b)""", passage="pabc", pattern=LS, theme="Lower bound on P(B and C)")

Q(114, r"""What is the maximum value of $P(B\cap C)$?""", ["0.1", "0.2", "0.35", "0.45"], "C", "Probability > Classical Probability > Addition and Multiplication Rules", 30,
  r"""Step 1: $1.2-x\ge0.85$ gives $x\le0.35$.
Answer: (c)""", passage="pabc", pattern=LS, theme="Upper bound on P(B and C)")

P("coin", "At least one and at least two tails", r"""An unbiased coin is tossed $n$ times. The probability of getting at least one tail is $p$ and the probability of at least two tails is $q$ and $p-q=\dfrac5{32}$.""")

Q(115, r"""What is the value of $n$?""", ["4", "5", "6", "7"], "B", "Probability > Probability Distributions > Binomial Distribution", 25,
  r"""Step 1: $p-q=P(\text{exactly one tail})=\dfrac n{2^n}$.
Step 2: $\dfrac n{2^n}=\dfrac5{32}$ gives $n=5$.
Answer: (b)""", passage="coin", pattern=LS, theme="Number of tosses")

Q(116, r"""What is the value of $p+q$?""", [r"$\dfrac{57}{32}$", r"$\dfrac{53}{32}$", r"$\dfrac{51}{32}$", "1"], "A", "Probability > Probability Distributions > Binomial Distribution", 25,
  r"""Step 1: $p=1-\dfrac1{32}=\dfrac{31}{32}$ and $q=p-\dfrac5{32}=\dfrac{26}{32}$.
Step 2: $p+q=\dfrac{57}{32}$.
Answer: (a)""", passage="coin", pattern=LS, theme="Sum of the two probabilities")

P("freq", "Geometric frequencies", r"""| $x_i$ | 1 | 2 | 3 | ... | $n$ |
|---|---|---|---|---|---|
| $f_i$ | 1 | $2^{-1}$ | $2^{-2}$ | ... | $2^{-(n-1)}$ |""")

Q(117, r"""What is $\sum_i^n x_if_i$ equal to?""",
  [r"$\dfrac{2^{n+1}-n+2}{2^{n-1}}$", r"$\dfrac{2^{n+1}-n-2}{2^{n-1}}$", r"$\dfrac{2^{n+1}+n+2}{2^{n-1}}$", r"$\dfrac{2^{n+1}-n-2}{2^n}$"], "B", "Algebra > Sequences and Series > Special Series and Means", 35,
  r"""Step 1: $\displaystyle\sum_{k=1}^n k\,2^{-(k-1)}=4-\frac{n+2}{2^{n-1}}$ (arithmetico-geometric series).
Step 2: This is $\dfrac{2^{n+1}-n-2}{2^{n-1}}$.
Answer: (b)""", passage="freq", pattern=LS, theme="Arithmetico-geometric sum")

Q(118, r"""What is the mean of the distribution?""",
  [r"$\dfrac{2^{n+1}-n+2}{2^n-1}$", r"$\dfrac{2^{n+1}-n-2}{2^{n-1}}$", r"$\dfrac{2^{n+1}-n-2}{2^n-1}$", r"$\dfrac{2^{n+1}-n+2}{2^n}$"], "C", "Statistics > Measures of Central Tendency > Mean", 35,
  r"""Step 1: $\sum f_i=2-2^{-(n-1)}=\dfrac{2^n-1}{2^{n-1}}$.
Step 2: Mean $=\dfrac{2^{n+1}-n-2}{2^{n-1}}\div\dfrac{2^n-1}{2^{n-1}}=\dfrac{2^{n+1}-n-2}{2^n-1}$.
Answer: (c)""", passage="freq", pattern=LS, theme="Mean with geometric frequencies")

P("marks", "Marks of 10 students", r"""The marks obtained by 10 students in a Statistics test are 24, 47, 18, 32, 19, 15, 21, 35, 50 and 41.""")

Q(119, r"""What is the mean deviation of the largest five observations?""", ["4.8", "5.5", "6", "7.5"], "C", "Statistics > Measures of Dispersion > Range and Mean Deviation", 20,
  r"""Step 1: The largest five are 32, 35, 41, 47, 50 with mean 41.
Step 2: Deviations 9, 6, 0, 6, 9 average to 6.
Answer: (c)""", passage="marks", pattern=LS, theme="Mean deviation about the mean")

Q(120, r"""What is the variance of the largest five observations?""", ["14.6", "21.8", "25.2", "46.8"], "D", "Statistics > Measures of Dispersion > Variance and Standard Deviation", 20,
  r"""Step 1: Squared deviations 81, 36, 0, 36, 81 total 234.
Step 2: Variance $=\dfrac{234}5=46.8$.
Answer: (d)""", passage="marks", pattern=LS, theme="Variance of five observations")
