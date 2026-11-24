from qfmt import Q, P, F, W

# NDA I 2025 Mathematics, Set A, booklet pages 17-35, Q51-120
S2 = "2-Statement Combination"
LS = "Linked Item Set"

Q(51, r"""Under what condition will the lines $m^{2}x+ny-1=0$ and $n^{2}x-my+2=0$ be perpendicular?""",
  ["$mn-1=0$", "$mn+1=0$", "$m+n=0$", "$m-n=0$"], "A", "Analytical Geometry > Straight Lines > Angle between Lines", 25,
  r"""Step 1: Perpendicular when $a_1a_2+b_1b_2=0$: $m^2n^2-mn=0$.
Step 2: For non-degenerate lines $mn\ne0$, so $mn=1$.
Answer: (a)""", theme="Perpendicularity condition")

Q(52, r"""If $p$ and $q$ are real numbers between 0 and 1 such that the points $(p,1)$, $(1,q)$ and $(0,0)$ form an equilateral triangle, then what is $(p+q)$ equal to?""",
  [r"$\sqrt2$", r"$\sqrt2-1$", r"$2-\sqrt3$", r"$4-2\sqrt3$"], "D", "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 40,
  r"""Step 1: Equal distances from the origin give $p^2+1=1+q^2$, so $p=q$.
Step 2: $(1-p)^2+(q-1)^2=p^2+1$ gives $p^2-4p+1=0$, so $p=2-\sqrt3$ (between 0 and 1).
Step 3: $p+q=4-2\sqrt3$.
Answer: (d)""", theme="Equilateral triangle with a vertex at the origin")

Q(53, r"""The vertices of a triangle are $A(1,1)$, $B(0,0)$ and $C(2,0)$. The angular bisectors of the triangle meet at $P$. What are the coordinates of $P$?""",
  [r"$(1,\sqrt2-1)$", r"$(1,\sqrt3-1)$", r"$(1,1/2)$", r"$(1/2,\sqrt2-1)$"], "A", "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 35,
  r"""Step 1: $AB=AC=\sqrt2$ and $BC=2$, so the triangle is right-angled isosceles at $A$ and the incentre lies on $x=1$.
Step 2: Inradius $r=\dfrac{\sqrt2+\sqrt2-2}2=\sqrt2-1$, so $P=(1,\sqrt2-1)$.
Answer: (a)""", theme="Incentre")

Q(54, r"""Let $A(3,-1)$ and $B(1,1)$ be the end points of line segment $AB$. Let $P$ be the middle point of the line segment $AB$. Let $Q$ be the point situated at a distance $\sqrt2$ units from $P$ on the perpendicular bisector line of $AB$. What are the possible coordinates of $Q$?""",
  ["$(2,1)$", "$(3,1)$", "$(2,2)$", "$(1,3)$"], "B", "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 30,
  r"""Step 1: $P=(2,0)$ and $AB$ has direction $(-2,2)$, so the bisector has direction $(1,1)$.
Step 2: $Q=(2,0)\pm(1,1)=(3,1)$ or $(1,-1)$.
Answer: (b)""", theme="Point on a perpendicular bisector")

Q(55, r"""$ABC$ is an equilateral triangle and $AD$ is the altitude on $BC$. If the coordinates of $A$ are $(1,2)$ and that of $D$ are $(-2,6)$, then what is the equation of $BC$?""",
  ["$3x+4y-18=0$", "$4x+3y-1=0$", "$4x-3y+26=0$", "$3x-4y+30=0$"], "D", "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 25,
  r"""Step 1: $BC$ passes through $D$ and is perpendicular to $AD=(-3,4)$: $-3x+4y=-3(-2)+4(6)=30$.
Step 2: That is $3x-4y+30=0$.
Answer: (d)""", theme="Line perpendicular to an altitude")

Q(56, r"""What is the equation of the circle whose diameter is 10 cm and the equations of two of its diameters are $x+y=0$ and $x-y=0$?""",
  ["$x^{2}+y^{2}=1$", "$x^{2}+y^{2}=25$", "$x^{2}+y^{2}=100$", "$x^{2}+y^{2}-2x-2y-23=0$"], "B", "Analytical Geometry > Circles > Equation and Parameters", 10,
  r"""Step 1: The diameters meet at the centre $(0,0)$; the radius is 5.
Answer: (b)""", theme="Circle from diameters")

Q(57, r"""A square is inscribed in a circle $x^{2}+y^{2}+2x+2y+1=0$ and its sides are parallel to coordinate axes. Which one of the following is a vertex of the square?""",
  ["$(-2,2)$", "$(-2,-2)$", r"$\left(-1+\dfrac1{\sqrt2},\,-1-\dfrac1{\sqrt2}\right)$", "None of the above"], "C", "Analytical Geometry > Circles > Equation and Parameters", 30,
  r"""Step 1: Centre $(-1,-1)$, radius 1.
Step 2: The vertices are at $(-1\pm\tfrac1{\sqrt2},\,-1\pm\tfrac1{\sqrt2})$.
Answer: (c)""", theme="Square inscribed in a circle")

Q(58, r"""A tangent to the parabola $y^{2}=4x$ is inclined at an angle $45^\circ$ with the positive direction of $x$-axis. What is the point of contact of the tangent and the parabola?""",
  ["$(1,1)$", r"$(2,2\sqrt2)$", r"$\left(\dfrac12,\dfrac1{\sqrt2}\right)$", "$(1,2)$"], "D", "Analytical Geometry > Conic Sections > Parabola", 20,
  r"""Step 1: For $y^2=4ax$ the tangent of slope $m$ touches at $\left(\dfrac a{m^2},\dfrac{2a}m\right)$.
Step 2: With $a=1$, $m=1$: $(1,2)$.
Answer: (d)""", theme="Point of contact of a tangent")

Q(59, r"""What is the distance between the two foci of the hyperbola $25x^{2}-75y^{2}=225$?""",
  [r"$2\sqrt3$ units", r"$4\sqrt3$ units", r"$\sqrt6$ units", r"$2\sqrt6$ units"], "B", "Analytical Geometry > Conic Sections > Hyperbola", 25,
  r"""Step 1: $\dfrac{x^2}9-\dfrac{y^2}3=1$, so $c^2=9+3=12$.
Step 2: $2c=4\sqrt3$.
Answer: (b)""", theme="Foci of a hyperbola")

Q(60, r"""If any point on an ellipse is $(3\sin\alpha,\,5\cos\alpha)$, then what is the eccentricity of the ellipse?""",
  ["4/3", "4/5", "3/4", "1/2"], "B", "Analytical Geometry > Conic Sections > Ellipse", 25,
  r"""Step 1: $\dfrac{x^2}9+\dfrac{y^2}{25}=1$, major axis along $y$.
Step 2: $e=\sqrt{1-\dfrac9{25}}=\dfrac45$.
Answer: (b)""", theme="Eccentricity from parametric form")

Q(61, r"""If a line in 3 dimensions makes angles $\alpha$, $\beta$ and $\gamma$ with the positive directions of the coordinate axes, then what is $\cos(\alpha+\beta)\cos(\alpha-\beta)$ equal to?""",
  [r"$\cos^{2}\gamma$", r"$-\cos^{2}\gamma$", r"$\sin^{2}\gamma$", r"$-\sin^{2}\gamma$"], "B", "Analytical Geometry > Three-dimensional Geometry > Direction Cosines and Direction Ratios", 30,
  r"""Step 1: $\cos(\alpha+\beta)\cos(\alpha-\beta)=\cos^2\alpha-\sin^2\beta=\cos^2\alpha+\cos^2\beta-1$.
Step 2: Since $\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$, this is $-\cos^2\gamma$.
Answer: (b)""", theme="Direction cosine identity")

Q(62, r"""$A(1,2,-1)$, $B(2,5,-2)$ and $C(4,4,-3)$ are three vertices of a rectangle. What is the area of the rectangle?""",
  ["8 square units", "9 square units", r"$\sqrt{66}$ square units", r"$\sqrt{68}$ square units"], "C", "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 30,
  r"""Step 1: $\vec{AB}=(1,3,-1)$, $\vec{BC}=(2,-1,-1)$, and $\vec{AB}\cdot\vec{BC}=0$, so $B$ is the right angle.
Step 2: Area $=|AB|\,|BC|=\sqrt{11}\sqrt6=\sqrt{66}$.
Answer: (c)""", theme="Rectangle in space")

Q(63, r"""$ABC$ is a triangle right-angled at $B$. If $A(k,1,-1)$, $B(2k,0,2)$ and $C(2+2k,k,1)$ are the vertices of the triangle, then what is the value of $k$?""",
  ["$-3$", "$-1$", "1", "3"], "D", "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 30,
  r"""Step 1: $\vec{BA}=(-k,1,-3)$ and $\vec{BC}=(2,k,-1)$.
Step 2: $\vec{BA}\cdot\vec{BC}=-2k+k+3=0$ gives $k=3$.
Answer: (d)""", theme="Right angle condition in space")

Q(64, r"""If a line
$$\dfrac{x+1}p=\dfrac{y-1}q=\dfrac{z-2}r$$
where $p=2q=3r$, makes an angle $\theta$ with the positive direction of $y$-axis, then what is $\cos2\theta$ equal to?""",
  ["$-31/49$", "$-37/49$", "31/49", "37/49"], "A", "Analytical Geometry > Three-dimensional Geometry > Direction Cosines and Direction Ratios", 35,
  r"""Step 1: Direction ratios $6:3:2$ (taking $p=6$), with magnitude 7, so $\cos\theta=\dfrac37$.
Step 2: $\cos2\theta=2\cdot\dfrac9{49}-1=-\dfrac{31}{49}$.
Answer: (a)""", theme="Angle with the y-axis")

Q(65, r"""What is the equation of the plane passing through the point $(1,1,1)$ and perpendicular to the line whose direction ratios are $\langle3,2,1\rangle$?""",
  ["$x+2y+3z=6$", "$3x+2y+z=6$", "$x+y+z=3$", "$3x+2y+z=0$"], "B", "Analytical Geometry > Three-dimensional Geometry > Equation of a Plane", 15,
  r"""Step 1: Normal $(3,2,1)$: $3x+2y+z=3+2+1=6$.
Answer: (b)""", theme="Plane from a normal and a point")

Q(66, r"""A line makes angles $\alpha$, $\beta$ and $\gamma$ with the positive directions of the coordinate axes. If $\vec a=(\sin^{2}\alpha)\hat i+(\sin^{2}\beta)\hat j+(\sin^{2}\gamma)\hat k$ and $\vec b=\hat i+\hat j+\hat k$, then what is $\vec a\cdot\vec b$ equal to?""",
  ["$-2$", "$-1$", "1", "2"], "D", "Vector Algebra > Vectors > Scalar (Dot) Product", 20,
  r"""Step 1: $\vec a\cdot\vec b=\sin^2\alpha+\sin^2\beta+\sin^2\gamma=3-(\cos^2\alpha+\cos^2\beta+\cos^2\gamma)=2$.
Answer: (d)""", theme="Sum of squared sines of direction angles")

Q(67, r"""Consider the following statements in respect of a vector $\vec d=(\vec a\times\vec b)\times\vec c$:

I. $\vec d$ is coplanar with $\vec a$ and $\vec b$.
II. $\vec d$ is perpendicular to $\vec c$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C", "Vector Algebra > Vectors > Vector (Cross) Product", 30,
  r"""Step 1: $(\vec a\times\vec b)\times\vec c=(\vec a\cdot\vec c)\vec b-(\vec b\cdot\vec c)\vec a$, a combination of $\vec a$ and $\vec b$ (I).
Step 2: A cross product with $\vec c$ is perpendicular to $\vec c$ (II).
Answer: (c)""", pattern=S2, theme="Vector triple product")

Q(68, r"""The position vectors of three points $A$, $B$ and $C$ are $\vec a$, $\vec b$ and $\vec c$ respectively such that $3\vec a-4\vec b+\vec c=\vec0$. What is $AB:BC$ equal to?""",
  ["3 : 1", "1 : 3", "3 : 4", "1 : 4"], "B", "Vector Algebra > Vectors > Basics and Position Vectors", 30,
  r"""Step 1: $\vec b=\dfrac{3\vec a+1\cdot\vec c}4$, so $B$ divides $AC$ internally in the ratio $1:3$.
Step 2: $AB:BC=1:3$.
Answer: (b)""", theme="Section formula with vectors")

Q(69, r"""The position vectors of three points $A$, $B$ and $C$ are $\vec a$, $\vec b$ and $\vec c$ respectively, where $\vec c=(\cos^{2}\theta)\vec a+(\sin^{2}\theta)\vec b$. What is $(\vec a\times\vec b)+(\vec b\times\vec c)+(\vec c\times\vec a)$ equal to?""",
  [r"$\vec0$", r"$2\vec c$", r"$3\vec c$", "Unit vector"], "A", "Vector Algebra > Vectors > Vector (Cross) Product", 35,
  r"""Step 1: The coefficients add to 1, so $C$ lies on line $AB$ (collinear points).
Step 2: $\vec a\times\vec b+\vec b\times\vec c+\vec c\times\vec a=(\vec b-\vec a)\times(\vec c-\vec a)=\vec0$ for collinear points.
Answer: (a)""", theme="Collinearity and cross products")

Q(70, r"""Let $\vec a$, $\vec b$, $(\vec a\times\vec b)$ be unit vectors. What is $(\vec a\cdot\vec b)$ equal to?""",
  ["0", "1/2", "1", "3"], "A", "Vector Algebra > Vectors > Scalar (Dot) Product", 15,
  r"""Step 1: $|\vec a\times\vec b|=\sin\theta=1$, so $\theta=90^\circ$.
Step 2: $\vec a\cdot\vec b=0$.
Answer: (a)""", theme="Unit cross product")

P("secx", "Parametric sec and cos", r"""Let $x=\sec\theta-\cos\theta$ and $y=\sec^{4}\theta-\cos^{4}\theta$.""")

Q(71, r"""What is $\left(\dfrac{dy}{dx}\right)^{2}$ equal to?""",
  [r"$\dfrac{4(y^{2}+4)}{(x^{2}+4)}$", r"$\dfrac{4(y^{2}-4)}{(x^{2}-4)}$", r"$\dfrac{16(y^{2}+4)}{(x^{2}+4)}$", r"$\dfrac{16(y^{2}-4)}{(x^{2}-4)}$"], "C",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 55,
  r"""Step 1: Let $u=\sec\theta$, $v=\cos\theta$, so $uv=1$, $x=u-v$, $y=u^4-v^4$.
Step 2: $\dfrac{du}{d\theta}=u\tan\theta$ and $\dfrac{dv}{d\theta}=-v\tan\theta$, so $\dfrac{dx}{d\theta}=(u+v)\tan\theta$ and $\dfrac{dy}{d\theta}=4(u^4+v^4)\tan\theta$. Hence $\dfrac{dy}{dx}=\dfrac{4(u^4+v^4)}{u+v}$.
Step 3: Since $uv=1$: $(u+v)^2=x^2+4$ and $(u^4+v^4)^2=y^2+4$. So $\left(\dfrac{dy}{dx}\right)^2=\dfrac{16(y^2+4)}{x^2+4}$.
Answer: (c)""", passage="secx", pattern=LS, theme="Squared derivative in x and y")

Q(72, r"""What is
$$\left(\dfrac{x^{2}+4}{y^{2}+4}\right)\dfrac{dy}{dx}\left[(x^{2}+4)\dfrac{d^{2}y}{dx^{2}}-16y\right]$$
equal to?""",
  ["$16x$", "$16y$", "$-16x$", "$-16y$"], "C", "Differential Calculus > Differentiation > Higher-order Derivatives", 60,
  r"""Step 1: Differentiate $(x^2+4)\left(\dfrac{dy}{dx}\right)^2=16(y^2+4)$: $2x y'^2+2(x^2+4)y'y''=32yy'$.
Step 2: Divide by $2y'$: $(x^2+4)y''-16y=-xy'$.
Step 3: The expression becomes $\dfrac{x^2+4}{y^2+4}\cdot y'\cdot(-xy')=-x\cdot\dfrac{(x^2+4)y'^2}{y^2+4}=-16x$.
Answer: (c)""", passage="secx", pattern=LS, theme="Second-order relation")

P("rtABC", "Right triangle with AB + AC fixed", r"""Let $ABC$ be a triangle right-angled at $B$ and $AB+AC=3$ units.""")

Q(73, r"""What is $\angle A$ equal to if the area of the triangle is maximum?""", [r"$\pi/6$", r"$\pi/4$", r"$\pi/3$", r"$5\pi/12$"], "C",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 45,
  r"""Step 1: With $AB=b$, $AC=3-b$, $BC=\sqrt{9-6b}$ and area $=\dfrac b2\sqrt{9-6b}$.
Step 2: Maximising $b^2(9-6b)$ gives $b=1$, $AC=2$, so $\cos A=\dfrac12$ and $A=\dfrac\pi3$.
Answer: (c)""", passage="rtABC", pattern=LS, theme="Angle at maximum area")

Q(74, r"""What is the maximum area of the triangle?""", [r"$\sqrt3/2$ square unit", r"$\sqrt3$ square units", r"$\sqrt6/2$ square units", r"$\sqrt6$ square units"], "A",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 40,
  r"""Step 1: At $b=1$: $BC=\sqrt3$, area $=\dfrac12\cdot1\cdot\sqrt3=\dfrac{\sqrt3}2$.
Answer: (a)""", passage="rtABC", pattern=LS, theme="Maximum area")

P("xpyq", "Implicit power relation", r"""Let $(x+y)^{p+q}=x^{p}y^{q}$, where $p$, $q$ are positive integers.""")

Q(75, r"""The derivative of $y$ with respect to $x$""", ["depends on $p$ only", "depends on $q$ only", "depends on both $p$ and $q$", "is independent of both $p$ and $q$"], "D",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 40,
  r"""Step 1: Take logs: $(p+q)\ln(x+y)=p\ln x+q\ln y$. Differentiating, $\dfrac{p+q}{x+y}(1+y')=\dfrac px+\dfrac qy y'$.
Step 2: Solving gives $\dfrac{dy}{dx}=\dfrac yx$, which does not involve $p$ or $q$.
Answer: (d)""", passage="xpyq", pattern=LS, theme="Derivative independent of exponents")

Q(76, r"""If $p+q=10$, then what is $\dfrac{dy}{dx}$ equal to?""", [r"$\dfrac yx$", "$xy$", "$x^{10}y^{10}$", r"$\left(\dfrac yx\right)^{10}$"], "A",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 25,
  r"""Step 1: From the previous item, $\dfrac{dy}{dx}=\dfrac yx$ for any $p,q$.
Answer: (a)""", passage="xpyq", pattern=LS, theme="dy/dx = y/x")

P("slope4", "Curve of constant slope",
  r"""The slope of the tangent to the curve $y=f(x)$ at $(x,f(x))$ is 4 for every real number $x$ and the curve passes through the origin.""")

Q(77, r"""What is the nature of the curve?""", ["A straight line passing through $(1,4)$", "A straight line passing through $(-1,4)$", "A parabola with vertex at origin and focus at $(2,0)$", "A parabola with vertex at origin and focus at $(1,0)$"], "A",
  "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 10,
  r"""Step 1: $y'=4$ and $y(0)=0$ give $y=4x$, a line through $(1,4)$.
Answer: (a)""", passage="slope4", pattern=LS, theme="Line from constant slope")

Q(78, r"""What is the area bounded by the curve, the $x$-axis and the line $x=4$?""", ["8 square units", "16 square units", "32 square units", "64 square units"], "C",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curve and Axis", 15,
  r"""Step 1: $\displaystyle\int_0^4 4x\,dx=32$.
Answer: (c)""", passage="slope4", pattern=LS, theme="Area of a triangle under y = 4x")

P("fpw2", "Piecewise cubic and square", r"""Let
$$f(x)=\begin{cases}x^{3}, & x^{2}<1\\ x^{2}, & x^{2}\ge1\end{cases}$$""")

Q(79, r"""What is $\displaystyle\lim_{x\to0}f'(x)$ equal to?""", ["2", "1", "0", "Limit does not exist"], "C",
  "Differential Calculus > Limits and Continuity > Limits", 15,
  r"""Step 1: Near 0, $f(x)=x^3$ and $f'(x)=3x^2\to0$.
Answer: (c)""", passage="fpw2", pattern=LS, theme="Limit of a derivative")

Q(80, r"""Consider the following statements:

I. The function is continuous at $x=-1$.
II. The function is differentiable at $x=1$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D", "Differential Calculus > Limits and Continuity > Continuity", 35,
  r"""Step 1: At $x=-1$: $f(-1)=1$ but the right-hand limit is $(-1)^3=-1$. Not continuous.
Step 2: At $x=1$: continuous (both sides give 1), but the left derivative is 3 and the right derivative is 2. Not differentiable.
Answer: (d)""", passage="fpw2", pattern=S2, theme="Continuity and differentiability at the joins")

P("cosinv", "Reciprocal of 1 - cos x", r"""Let the function $y=(1-\cos x)^{-1}$, where $x\ne2n\pi$ and $n$ is an integer.""")

Q(81, r"""What is the range of the function?""", [r"$[0,\infty)$", r"$[0.5,\infty)$", r"$[1,\infty)$", r"$(-\infty,0.5]$"], "B",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 20,
  r"""Step 1: $0<1-\cos x\le2$, so $y\ge\dfrac12$.
Answer: (b)""", passage="cosinv", pattern=LS, theme="Range of 1/(1 - cos x)")

Q(82, r"""What is $\displaystyle\int y\,dx$ equal to?""", [r"$-\tan(x/2)+c$", r"$-\cot(x/2)+c$", r"$\tan(x/2)+c$", r"$\cot(x/2)+c$"], "B",
  "Integral Calculus and Differential Equations > Indefinite Integration > Standard Forms", 25,
  r"""Step 1: $\dfrac1{1-\cos x}=\dfrac12\operatorname{cosec}^2\dfrac x2$.
Step 2: Integrating gives $-\cot\dfrac x2+c$.
Answer: (b)""", passage="cosinv", pattern=LS, theme="Integral of 1/(1 - cos x)")

P("sinfloor", "sin of the floor of x", r"""Let the function $f(x)=\sin[x]$, where $[\cdot]$ is the greatest integer function and $g(x)=|x|$.""")

Q(83, r"""What is $\displaystyle\lim_{x\to0}\{f(x)g(x)\}$ equal to?""", ["$-1$", "0", "1", "Limit does not exist"], "B",
  "Differential Calculus > Limits and Continuity > Limits", 30,
  r"""Step 1: For $-1<x<0$, $f(x)g(x)=\sin(-1)\,|x|\to0$; for $0<x<1$, it is $0$.
Step 2: Both sides give 0.
Answer: (b)""", passage="sinfloor", pattern=LS, theme="Product limit with greatest integer")

Q(84, r"""What is $\displaystyle\lim_{x\to0}\dfrac{f(x)}{g(x)}$ equal to?""", [r"$-\sin1$", r"$\sin1$", "0", "Limit does not exist"], "D",
  "Differential Calculus > Limits and Continuity > Limits", 35,
  r"""Step 1: For $0<x<1$ the ratio is 0. For $-1<x<0$ it is $\dfrac{-\sin1}{|x|}\to-\infty$.
Step 2: The one-sided limits differ, so the limit does not exist.
Answer: (d)""", passage="sinfloor", pattern=LS, theme="Quotient limit with greatest integer")

P("absx3", "The curve |x - 3|", r"""Let the curve $f(x)=|x-3|$.""")

Q(85, r"""What is the domain of the function $f(x)$?""", [r"$(0,\infty)$", r"$(3,\infty)$", r"$(-\infty,\infty)$", r"$(-\infty,\infty)\setminus\{3\}$"], "C",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 5,
  r"""Step 1: $|x-3|$ is defined for every real $x$.
Answer: (c)""", passage="absx3", pattern=LS, theme="Domain of a modulus function")

Q(86, r"""What is the area bounded by the curve $f(x)$ and $y=3$?""", ["3 square units", "4.5 square units", "7.5 square units", "9 square units"], "D",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 20,
  r"""Step 1: $|x-3|=3$ at $x=0$ and $x=6$. The region is a triangle with base 6 and height 3.
Step 2: Area $=\dfrac12\cdot6\cdot3=9$.
Answer: (d)""", passage="absx3", pattern=LS, theme="Area between |x - 3| and y = 3")

P("fset", "Function given as ordered pairs", r"""Let $f=\{(1,1),(2,4),(3,7),(4,10)\}$.""")

Q(87, r"""If $f(x)=px+q$, then what is the value of $(p+q)$?""", ["$-1$", "0", "1", "5"], "C",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 15,
  r"""Step 1: The values rise by 3 each step, so $p=3$, and $3+q=1$ gives $q=-2$.
Step 2: $p+q=1$.
Answer: (c)""", passage="fset", pattern=LS, theme="Linear rule from pairs")

Q(88, r"""Consider the following statements:

I. $f$ is one-one function.
II. $f$ is onto function if the codomain is the set of natural numbers.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "A", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 15,
  r"""Step 1: The images 1, 4, 7, 10 are distinct, so $f$ is one-one.
Step 2: Its range is not all of $\mathbb N$, so it is not onto.
Answer: (a)""", passage="fset", pattern=S2, theme="One-one and onto")

P("x2m1", "The function x^2 - 1", r"""Let the function $f(x)=x^{2}-1$.""")

Q(89, r"""What is $\displaystyle\lim_{x\to1}\{f\circ f(x)\}$ equal to?""", ["$-1$", "0", "1", "2"], "A",
  "Differential Calculus > Limits and Continuity > Limits", 15,
  r"""Step 1: $f(1)=0$ and $f(0)=-1$; $f\circ f$ is continuous.
Answer: (a)""", passage="x2m1", pattern=LS, theme="Limit of a composition")

Q(90, r"""What is the area bounded by the function $f(x)$ and the $x$-axis?""", ["1/3 square unit", "2/3 square unit", "4/3 square units", "2 square units"], "C",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curve and Axis", 15,
  r"""Step 1: $\displaystyle\int_{-1}^1(1-x^2)\,dx=2-\dfrac23=\dfrac43$.
Answer: (c)""", passage="x2m1", pattern=LS, theme="Area under a parabola")

P("arcsin3", "Triple-angle inverse sine", r"""Let $y=\sin^{-1}\left(x-\dfrac{4x^{3}}{27}\right)$.""")

Q(91, r"""What is $y$ equal to?""", [r"$\sin^{-1}x$", r"$\sin^{-1}\left(\dfrac x3\right)$", r"$3\sin^{-1}x$", r"$3\sin^{-1}\left(\dfrac x3\right)$"], "D",
  "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 30,
  r"""Step 1: Put $x=3\sin\theta$: $x-\dfrac{4x^3}{27}=3\sin\theta-4\sin^3\theta=\sin3\theta$.
Step 2: $y=3\theta=3\sin^{-1}\dfrac x3$ (in the principal range).
Answer: (d)""", passage="arcsin3", pattern=LS, theme="Triple angle substitution")

Q(92, r"""What is $\dfrac{dy}{dx}$ equal to?""", [r"$\dfrac1{\sqrt{9-x^{2}}}$", r"$\dfrac1{\sqrt{3-x^{2}}}$", r"$\dfrac3{\sqrt{9-x^{2}}}$", r"$\dfrac9{\sqrt{9-x^{2}}}$"], "C",
  "Differential Calculus > Differentiation > Standard Derivatives and Rules", 20,
  r"""Step 1: $\dfrac d{dx}3\sin^{-1}\dfrac x3=\dfrac{3\cdot\frac13}{\sqrt{1-x^2/9}}=\dfrac3{\sqrt{9-x^2}}$.
Answer: (c)""", passage="arcsin3", pattern=LS, theme="Derivative of 3 arcsin(x/3)")

P("x2p9", "The function x^2 + 9", r"""Let the function $f(x)=x^{2}+9$.""")

Q(93, r"""What is
$$\lim_{x\to0}\dfrac{\sqrt{f(x)}-3}{\sqrt{f(x)+7}-4}$$
equal to?""", ["2/3", "1", "4/3", "2"], "C",
  "Differential Calculus > Limits and Continuity > Limits", 30,
  r"""Step 1: Rationalise: $\dfrac{\sqrt{x^2+9}-3}{\sqrt{x^2+16}-4}=\dfrac{\sqrt{x^2+16}+4}{\sqrt{x^2+9}+3}$.
Step 2: At $x=0$: $\dfrac86=\dfrac43$.
Answer: (c)""", passage="x2p9", pattern=LS, theme="Limit by rationalising")

Q(94, r"""Consider the following statements:

I. $f(x)$ is an increasing function.
II. $f(x)$ has local maximum at $x=0$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D", "Differential Calculus > Applications of Derivatives > Increasing and Decreasing Functions", 15,
  r"""Step 1: $f'(x)=2x$ changes sign at 0: $f$ decreases then increases, so it is not increasing on $\mathbb R$.
Step 2: $x=0$ is a local minimum, not a maximum.
Answer: (d)""", passage="x2p9", pattern=S2, theme="Monotonicity of x^2 + 9")

P("fmult", "Multiplicative functional equation",
  r"""The function $f(x)$ satisfies $f\left(\dfrac xy\right)=\dfrac{f(x)}{f(y)}$ for all positive real values of $x$ and $y$, and $f(2)=3$.""")

Q(95, r"""What is $f(16)$ equal to?""", ["18", "27", "54", "81"], "D",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 35,
  r"""Step 1: $f(1)=1$ and $f(1/y)=1/f(y)$, so $f(xy)=f(x)f(y)$.
Step 2: $f(16)=f(2)^4=81$.
Answer: (d)""", passage="fmult", pattern=LS, theme="Multiplicative function")

Q(96, r"""What is $f(1)f(4)$ equal to?""", ["4", "8", "9", "18"], "C",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 25,
  r"""Step 1: $f(1)=1$ and $f(4)=f(2)^2=9$.
Answer: (c)""", passage="fmult", pattern=LS, theme="Values of a multiplicative function")

P("fconst", "f(xy) = f(x + y)", r"""A function $f$ is such that $f(xy)=f(x+y)$ for all real values of $x$ and $y$, and $f(5)=10$.""")

Q(97, r"""What is $f(0)$ equal to?""", ["0", "1", "5", "10"], "D",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 30,
  r"""Step 1: Put $y=0$: $f(0)=f(x)$ for every $x$, so $f$ is constant.
Step 2: $f(0)=f(5)=10$.
Answer: (d)""", passage="fconst", pattern=LS, theme="Constant function from a functional equation")

Q(98, r"""What is $f(20)+f(-20)$ equal to?""", ["0", "10", "20", "40"], "C",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 20,
  r"""Step 1: $f\equiv10$, so the sum is 20.
Answer: (c)""", passage="fconst", pattern=LS, theme="Values of a constant function")

P("floorx2", "Greatest integer of x squared", r"""Let $f(x)=[x^{2}]$, where $[\cdot]$ is the greatest integer function.""")

Q(99, r"""What is $\displaystyle\int_{\sqrt2}^{\sqrt3}f(x)\,dx$ equal to?""", [r"$\sqrt3-\sqrt2$", r"$2(\sqrt3-\sqrt2)$", r"$3-\sqrt2$", "1"], "B",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 25,
  r"""Step 1: For $\sqrt2\le x<\sqrt3$, $2\le x^2<3$, so $[x^2]=2$.
Step 2: The integral is $2(\sqrt3-\sqrt2)$.
Answer: (b)""", passage="floorx2", pattern=LS, theme="Integral of [x^2]")

Q(100, r"""What is $\displaystyle\int_{\sqrt2}^{2}f(x)\,dx$ equal to?""", [r"$6-\sqrt3-2\sqrt2$", r"$6-\sqrt3-\sqrt2$", r"$6-\sqrt3+2\sqrt2$", r"$6+\sqrt3-2\sqrt2$"], "A",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 30,
  r"""Step 1: $[x^2]=2$ on $[\sqrt2,\sqrt3)$ and $3$ on $[\sqrt3,2)$.
Step 2: $2(\sqrt3-\sqrt2)+3(2-\sqrt3)=6-\sqrt3-2\sqrt2$.
Answer: (a)""", passage="floorx2", pattern=LS, theme="Piecewise integral of [x^2]")

P("heights", "Heights of students",
  r"""The frequency distribution of height of students of a class is given below:

| Height (in cm) | Number of Students |
|---|---|
| 160-162 | 12 |
| 162-164 | 15 |
| 164-166 | 24 |
| 166-168 | 13 |""")

Q(101, r"""What is the total number of students whose height is less than or equal to 165 cm?""", ["15", "39", "51", "None of the above"], "B",
  "Statistics > Data and Graphical Representation > Frequency Distribution", 30,
  r"""Step 1: Up to 164 cm: $12+15=27$.
Step 2: Assuming even spread in 164-166, half of 24 (that is 12) are at most 165 cm. Total $27+12=39$.
Answer: (b)""", passage="heights", pattern=LS, theme="Cumulative count with interpolation")
F(101, "Exact count cannot be known from grouped data; 39 assumes uniform spread. 'None of the above' arguable")

Q(102, r"""What is the median height of the class?""", ["162.41 cm", "163.41 cm", "164.41 cm", "165.41 cm"], "C",
  "Statistics > Measures of Central Tendency > Median", 30,
  r"""Step 1: $N=64$, $N/2=32$; median class 164-166 with $cf=27$, $f=24$, $h=2$.
Step 2: Median $=164+\dfrac{32-27}{24}\times2\approx164.42$, listed as 164.41.
Answer: (c)""", passage="heights", pattern=LS, theme="Median of grouped data")

Q(103, r"""The height which occurs most frequently in the class is""", ["163.5 cm", "163.9 cm", "164.5 cm", "164.9 cm"], "D",
  "Statistics > Measures of Central Tendency > Mode", 30,
  r"""Step 1: Modal class 164-166, $f_1=24$, $f_0=15$, $f_2=13$.
Step 2: Mode $=164+\dfrac{24-15}{48-15-13}\times2=164+0.9=164.9$.
Answer: (d)""", passage="heights", pattern=LS, theme="Mode of grouped data")

Q(104, r"""The most appropriate graphical representation of the given frequency distribution is""", ["bar chart", "percentage bar chart", "histogram", "pie chart"], "C",
  "Statistics > Data and Graphical Representation > Histogram and Cumulative Frequency", 10,
  r"""Step 1: Continuous class intervals are shown with a histogram.
Answer: (c)""", passage="heights", pattern=LS, theme="Choosing a histogram")

P("tubers", "Length and weight of tubers",
  r"""The sum and the sum of squares of the observations corresponding to length $X$ (in cm) and weight $Y$ (in gm) of 50 tropical tubers are given as $\Sigma X=200$, $\Sigma Y=250$, $\Sigma X^{2}=900$ and $\Sigma Y^{2}=1400$.""")

Q(105, r"""Which one of the following is correct?""", ["Variance ($X$) > Variance ($Y$)", "Variance ($X$) < Variance ($Y$)", "Variance ($X$) = Variance ($Y$)", "Cannot be determined from the given data"], "B",
  "Statistics > Measures of Dispersion > Variance and Standard Deviation", 25,
  r"""Step 1: $\operatorname{Var}X=\dfrac{900}{50}-4^2=2$ and $\operatorname{Var}Y=\dfrac{1400}{50}-5^2=3$.
Answer: (b)""", passage="tubers", pattern=LS, theme="Comparing variances")

Q(106, r"""Which one of the following statements is correct?""",
  ["Coefficient of variation of $X$ is strictly more than coefficient of variation of $Y$.", "Coefficient of variation of $X$ is strictly less than coefficient of variation of $Y$.",
   "Coefficient of variation of $X$ is same as coefficient of variation of $Y$.", "Coefficient of variation cannot be determined from the given data."], "A",
  "Statistics > Measures of Dispersion > Variance and Standard Deviation", 35,
  r"""Step 1: $CV_X=\dfrac{\sqrt2}4\approx0.354$ and $CV_Y=\dfrac{\sqrt3}5\approx0.346$.
Answer: (a)""", passage="tubers", pattern=LS, theme="Comparing coefficients of variation")

P("bin6", "Binomial with n = 6",
  r"""Let $X$ be a random variable following binomial distribution with parameters $n=6$ and $p=k$. Further, $9P(X=4)=P(X=2)$.""")

Q(107, r"""What is the value of $k$?""", ["1/2", "1/3", "1/4", "1/5"], "C",
  "Probability > Probability Distributions > Binomial Distribution", 30,
  r"""Step 1: $9\binom64k^4(1-k)^2=\binom62k^2(1-k)^4$ gives $9k^2=(1-k)^2$.
Step 2: $3k=1-k$, so $k=\dfrac14$.
Answer: (c)""", passage="bin6", pattern=LS, theme="Binomial parameter")

Q(108, r"""What is the value of $P(X=3)$?""", ["135/1024", "5/128", "45/1024", "70/1024"], "A",
  "Probability > Probability Distributions > Binomial Distribution", 25,
  r"""Step 1: $\binom63\left(\dfrac14\right)^3\left(\dfrac34\right)^3=\dfrac{20\cdot27}{4096}=\dfrac{135}{1024}$.
Answer: (a)""", passage="bin6", pattern=LS, theme="Binomial probability")

P("committee", "Committee of six", r"""A committee of 6 members is formed from a group of 7 gentlemen and 4 ladies.""")

Q(109, r"""What is the probability that the committee includes exactly 3 gentlemen?""", ["10/33", "30/77", "100/231", "5/11"], "A",
  "Probability > Classical Probability > Events and Sample Space", 25,
  r"""Step 1: $\dfrac{\binom73\binom43}{\binom{11}6}=\dfrac{35\cdot4}{462}=\dfrac{10}{33}$.
Answer: (a)""", passage="committee", pattern=LS, theme="Exactly three gentlemen")

Q(110, r"""What is the probability that the committee includes at least 2 ladies?""", ["41/66", "47/66", "49/66", "53/66"], "D",
  "Probability > Classical Probability > Events and Sample Space", 30,
  r"""Step 1: Favourable: $\binom42\binom74+\binom43\binom73+\binom44\binom72=210+140+21=371$ out of 462.
Step 2: $\dfrac{371}{462}=\dfrac{53}{66}$.
Answer: (d)""", passage="committee", pattern=LS, theme="At least two ladies")

P("bonus", "Managers and a bonus scheme",
  r"""The probabilities that $A$, $B$ and $C$ become managers are $3/10$, $1/2$ and $4/5$ respectively. The probabilities that bonus scheme will be introduced if $A$, $B$ and $C$ become managers are $4/9$, $2/9$ and $1/3$ respectively.""")

Q(111, r"""What is the probability that the bonus scheme will be introduced?""", ["17/45", "19/45", "23/45", "26/45"], "C",
  "Probability > Conditional Probability > Bayes' Theorem", 35,
  r"""Step 1: By the total probability rule: $\dfrac3{10}\cdot\dfrac49+\dfrac12\cdot\dfrac29+\dfrac45\cdot\dfrac13=\dfrac{2}{15}+\dfrac19+\dfrac4{15}=\dfrac{23}{45}$.
Note: as printed the three manager probabilities add to more than 1; the intended total-probability formula gives 23/45.
Answer: (c)""", passage="bonus", pattern=LS, theme="Total probability")
F(111, "Printed prior probabilities sum to 8/5; formula answer 23/45")

Q(112, r"""If the bonus scheme has been introduced, then what is the probability that the manager appointed was $B$?""", ["5/23", "6/23", "7/23", "8/23"], "A",
  "Probability > Conditional Probability > Bayes' Theorem", 35,
  r"""Step 1: By Bayes' theorem: $\dfrac{\frac12\cdot\frac29}{23/45}=\dfrac{1/9}{23/45}=\dfrac5{23}$.
Answer: (a)""", passage="bonus", pattern=LS, theme="Bayes' theorem")

Q(113, r"""The arithmetic mean of 100 observations is 50. If 5 is subtracted from each observation and then divided by 20, then what is the new arithmetic mean?""",
  ["2.25", "3.5", "4.25", "5.5"], "A", "Statistics > Measures of Central Tendency > Mean", 10,
  r"""Step 1: $\dfrac{50-5}{20}=2.25$.
Answer: (a)""", theme="Mean under a linear change")

Q(114, r"""The standard deviation of 100 observations is 10. If 5 is added to each observation and then divided by 20, then what will be the new standard deviation?""",
  ["0.25", "0.5", "0.75", "1.00"], "B", "Statistics > Measures of Dispersion > Variance and Standard Deviation", 10,
  r"""Step 1: Adding 5 does not change the SD; dividing by 20 divides it by 20: $\dfrac{10}{20}=0.5$.
Answer: (b)""", theme="SD under a linear change")

Q(115, r"""If $P(A)=1/3$, $P(B)=1/2$ and $P(A\cap B)=1/4$, then what is the value of $P(B|A^{c})$?""", ["1/8", "3/8", "5/8", "7/8"], "B",
  "Probability > Conditional Probability > Conditional Probability and Independence", 25,
  r"""Step 1: $P(B\cap A^c)=\dfrac12-\dfrac14=\dfrac14$ and $P(A^c)=\dfrac23$.
Step 2: $P(B|A^c)=\dfrac{1/4}{2/3}=\dfrac38$.
Answer: (b)""", theme="Conditional on a complement")

Q(116, r"""If $P(A)=1/3$, $P(B)=1/2$ and $P(A\cap B)=1/4$, then what is the value of $P(A^{c}\cap B^{c})$?""", ["1/4", "5/12", "7/12", "11/12"], "B",
  "Probability > Classical Probability > Addition and Multiplication Rules", 20,
  r"""Step 1: $P(A\cup B)=\dfrac13+\dfrac12-\dfrac14=\dfrac7{12}$.
Step 2: $P(A^c\cap B^c)=1-\dfrac7{12}=\dfrac5{12}$.
Answer: (b)""", theme="Neither A nor B")

Q(117, r"""If two fair dice are tossed, then what is the probability that the sum of the numbers on the faces of the dice is strictly greater than 7?""", ["1/3", "5/12", "7/12", "3/4"], "B",
  "Probability > Classical Probability > Events and Sample Space", 15,
  r"""Step 1: Sums 8 to 12 occur in $5+4+3+2+1=15$ ways.
Step 2: $\dfrac{15}{36}=\dfrac5{12}$.
Answer: (b)""", theme="Sum of two dice above 7")

Q(118, r"""The probability of a man hitting a target is 1/5. If the man fires 7 times, then what is the probability that he hits the target at least twice?""",
  [r"$1-\left(\dfrac35\right)\left(\dfrac45\right)^{6}$", r"$1-\left(\dfrac35\right)\left(\dfrac45\right)^{7}$", r"$1-\left(\dfrac{11}5\right)\left(\dfrac45\right)^{6}$", r"$1-\left(\dfrac{11}5\right)\left(\dfrac45\right)^{7}$"], "C",
  "Probability > Probability Distributions > Binomial Distribution", 30,
  r"""Step 1: $P(0)+P(1)=\left(\dfrac45\right)^7+7\cdot\dfrac15\left(\dfrac45\right)^6=\left(\dfrac45\right)^6\left(\dfrac45+\dfrac75\right)=\dfrac{11}5\left(\dfrac45\right)^6$.
Step 2: The required probability is $1-\dfrac{11}5\left(\dfrac45\right)^6$.
Answer: (c)""", theme="At least two successes")

Q(119, r"""Let $X$ be a random variable following binomial distribution whose mean and variance are 200 and 160 respectively. What is the value of the number of trials ($n$)?""",
  ["500", "1000", "1500", "2000"], "B", "Probability > Probability Distributions > Binomial Distribution", 15,
  r"""Step 1: $q=\dfrac{160}{200}=0.8$, so $p=0.2$.
Step 2: $n=\dfrac{200}{0.2}=1000$.
Answer: (b)""", theme="n from mean and variance")

Q(120, r"""What is the arithmetic mean of $8^{2}, 9^{2}, 10^{2}, \dots, 15^{2}$?""", ["133.5", "135.5", "137.5", "139.5"], "C",
  "Statistics > Measures of Central Tendency > Mean", 15,
  r"""Step 1: $\sum_{k=8}^{15}k^2=1240-140=1100$.
Step 2: Mean $=\dfrac{1100}8=137.5$.
Answer: (c)""", theme="Mean of consecutive squares")
