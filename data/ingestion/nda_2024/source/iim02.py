from qfmt import Q, P, F, W

# NDA II 2024 Mathematics, Set A (SURN-B-MTH/81A), booklet pages 21-43, Q51-120
S2 = "2-Statement Combination"
LS = "Linked Item Set"

Q(51, r"""What is $3\alpha+2\beta$ equal to if $(2\hat i+6\hat j+27\hat k)\times(\hat i+\alpha\hat j+\beta\hat k)$ is a null vector?""",
  ["36", "33", "30", "27"], "A", "Vector Algebra > Vectors > Vector (Cross) Product", 20,
  r"""Step 1: A zero cross product means the vectors are parallel: $\dfrac12=\dfrac\alpha6=\dfrac\beta{27}$.
Step 2: $\alpha=3$, $\beta=\dfrac{27}2$, so $3\alpha+2\beta=9+27=36$.
Answer: (a)""", theme="Parallel vectors")

Q(52, r"""For what value of the angle between the vectors $\vec a$ and $\vec b$ is the quantity $|\vec a\times\vec b|+\sqrt3|\vec a\cdot\vec b|$ maximum?""",
  [r"$0^\circ$", r"$30^\circ$", r"$45^\circ$", r"$60^\circ$"], "B", "Vector Algebra > Vectors > Scalar (Dot) Product", 30,
  r"""Step 1: The quantity is $|a||b|(\sin\theta+\sqrt3|\cos\theta|)$. For acute $\theta$ this is $2|a||b|\sin(\theta+60^\circ)$.
Step 2: It is largest when $\theta+60^\circ=90^\circ$, i.e. $\theta=30^\circ$.
Answer: (b)""", theme="Maximising a vector expression")

Q(53, r"""Let $\theta$ be the angle between two unit vectors $\vec a$ and $\vec b$. If $\vec a+2\vec b$ is perpendicular to $5\vec a-4\vec b$, then what is $\cos\theta+\cos2\theta$ equal to?""",
  ["0", "1/2", "1", r"$\dfrac{\sqrt3+1}2$"], "A", "Vector Algebra > Vectors > Scalar (Dot) Product", 25,
  r"""Step 1: $(\vec a+2\vec b)\cdot(5\vec a-4\vec b)=5-8+6\cos\theta=0$, so $\cos\theta=\dfrac12$.
Step 2: $\cos2\theta=-\dfrac12$, so the sum is 0.
Answer: (a)""", theme="Perpendicular combinations of unit vectors")

Q(54, r"""Let $ABCDEF$ be a regular hexagon. If $\overrightarrow{AD}=m\overrightarrow{BC}$ and $\overrightarrow{CF}=n\overrightarrow{AB}$, then what is $mn$ equal to?""",
  ["$-4$", "$-2$", "2", "4"], "A", "Vector Algebra > Vectors > Basics and Position Vectors", 30,
  r"""Step 1: The long diagonal $AD$ is twice $BC$ and parallel to it in the same direction, so $m=2$.
Step 2: $CF$ is parallel to $AB$, twice as long, in the opposite direction, so $n=-2$.
Answer: (a)""", theme="Vectors in a regular hexagon")

Q(55, r"""The vectors $\vec a$, $\vec b$ and $\vec c$ are of the same length. If taken pairwise, they form equal angles. If $\vec a=\hat i+\hat j$ and $\vec b=\hat j+\hat k$, then what can $\vec c$ be equal to?

I. $\hat i+\hat k$
II. $\dfrac{-\hat i+4\hat j-\hat k}3$

Select the correct answer using the code given below.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C", "Vector Algebra > Vectors > Scalar (Dot) Product", 35,
  r"""Step 1: $|\vec a|=|\vec b|=\sqrt2$ and $\vec a\cdot\vec b=1$, so $\vec c$ needs $|\vec c|=\sqrt2$ and $\vec a\cdot\vec c=\vec b\cdot\vec c=1$.
Step 2: I: $|\vec c|=\sqrt2$, dot products 1 and 1. II: $|\vec c|^2=\dfrac{18}9=2$, dot products $\dfrac33$ and $\dfrac33$. Both work.
Answer: (c)""", pattern=S2, theme="Vectors at equal angles")

Q(56, r"""The diagonals of a quadrilateral $ABCD$ are along the lines $x-2y=1$ and $4x+2y=3$. The quadrilateral $ABCD$ may be a""",
  ["rectangle", "cyclic quadrilateral", "parallelogram", "rhombus"], "D", "Analytical Geometry > Straight Lines > Angle between Lines", 25,
  r"""Step 1: The slopes are $\dfrac12$ and $-2$, whose product is $-1$, so the diagonals are perpendicular.
Step 2: A quadrilateral with perpendicular diagonals may be a rhombus.
Answer: (d)""", theme="Perpendicular diagonals")
F(56, "Perpendicular diagonals alone don't fix the type; key 'rhombus' is the intended one")

Q(57, r"""The foci of the ellipse $4x^{2}+9y^{2}=1$ are at $Q$ and $R$. If $P(x,y)$ is any point on the ellipse, then what is $PQ+PR$ equal to?""",
  ["2", "1", "2/3", "1/3"], "B", "Analytical Geometry > Conic Sections > Ellipse", 20,
  r"""Step 1: $\dfrac{x^2}{1/4}+\dfrac{y^2}{1/9}=1$, so $a=\dfrac12$.
Step 2: The sum of focal distances is $2a=1$.
Answer: (b)""", theme="Sum of focal distances")

Q(58, r"""If $P(2,4)$, $Q(8,12)$, $R(10,14)$ and $S(x,y)$ are vertices of a parallelogram, then what is $(x+y)$ equal to?""",
  ["8", "10", "12", "14"], "B", "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 15,
  r"""Step 1: In parallelogram $PQRS$ the diagonals bisect each other: $S=P+R-Q=(4,6)$.
Step 2: $x+y=10$.
Answer: (b)""", theme="Fourth vertex of a parallelogram")

Q(59, r"""The equation of a circle is $(x^{2}-4x+3)+(y^{2}-6y+8)=0$. Which of the following statements are correct?

I. The end points of a diameter of the circle are at $(1,2)$ and $(3,4)$.
II. The end points of a diameter of the circle are at $(1,4)$ and $(3,2)$.
III. The end points of a diameter of the circle are at $(2,4)$ and $(4,2)$.

Select the answer using the code given below.""",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "A", "Analytical Geometry > Circles > Equation and Parameters", 30,
  r"""Step 1: The equation is $(x-1)(x-3)+(y-2)(y-4)=0$, the diameter form with ends $(1,2),(3,4)$; centre $(2,3)$, radius $\sqrt2$.
Step 2: $(1,4),(3,2)$ also have midpoint $(2,3)$ and lie on the circle. $(2,4),(4,2)$ have midpoint $(3,3)$, not the centre.
Answer: (a)""", pattern="3-Statement Combination", theme="Diameter form of a circle")

Q(60, r"""Consider the points $P(4k,4k)$ and $Q(4k,-4k)$ lying on the parabola $y^{2}=4kx$. If the vertex is $A$, then what is $\angle PAQ$ equal to?""",
  [r"$60^\circ$", r"$90^\circ$", r"$120^\circ$", r"$135^\circ$"], "B", "Analytical Geometry > Conic Sections > Parabola", 20,
  r"""Step 1: $A=(0,0)$; $\vec{AP}=(4k,4k)$ and $\vec{AQ}=(4k,-4k)$.
Step 2: Their dot product is 0, so the angle is $90^\circ$.
Answer: (b)""", theme="Angle at the vertex")

P("circ100", "Triangle in a circle", r"""A triangle $ABC$ is inscribed in the circle $x^{2}+y^{2}=100$. $B$ and $C$ have coordinates $(6,8)$ and $(-8,6)$ respectively.""")

Q(61, r"""What is $\angle BAC$ equal to?""", [r"$\pi/2$", r"$\pi/3$ or $2\pi/3$", r"$\pi/4$ or $3\pi/4$", r"$\pi/6$ or $5\pi/6$"], "C",
  "Analytical Geometry > Circles > Equation and Parameters", 30,
  r"""Step 1: $\vec{OB}\cdot\vec{OC}=-48+48=0$, so $\angle BOC=\dfrac\pi2$.
Step 2: The inscribed angle is half of it, $\dfrac\pi4$, if $A$ is on the major arc, or $\dfrac{3\pi}4$ if on the minor arc.
Answer: (c)""", passage="circ100", pattern=LS, theme="Inscribed angle")

Q(62, r"""What are the coordinates of $A$?""", ["$(-6,8)$", "$(-6,-8)$", r"$(5\sqrt2,5\sqrt2)$", "Cannot be determined due to insufficient data"], "D",
  "Analytical Geometry > Circles > Equation and Parameters", 20,
  r"""Step 1: Any point of the circle other than $B$ and $C$ can be $A$.
Answer: (d)""", passage="circ100", pattern=LS, theme="Insufficient data")

P("trap", "Isosceles trapezium", r"""$ABCD$ is an isosceles trapezium and $AB$ is parallel to $DC$. Let $A(2,3)$, $B(4,3)$, $C(5,1)$ be the vertices.""")

Q(63, r"""What are the coordinates of vertex $D$?""", ["$(2,1)$", "$(1,2)$", "$(1,1)$", "$(3,1)$"], "C",
  "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 20,
  r"""Step 1: The axis of symmetry is $x=3$ (midpoint of $AB$) and $DC$ lies on $y=1$.
Step 2: Reflecting $C(5,1)$ in $x=3$ gives $D(1,1)$.
Answer: (c)""", passage="trap", pattern=LS, theme="Fourth vertex by symmetry")

Q(64, r"""What is the point of intersection of the diagonals of the trapezium?""", ["$(3,7/2)$", "$(3,7/3)$", "$(7/2,2)$", "$(5/2,2)$"], "B",
  "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 25,
  r"""Step 1: By symmetry the diagonals meet on $x=3$.
Step 2: $AC$ from $(2,3)$ to $(5,1)$ reaches $x=3$ one-third of the way, at $y=3-\dfrac23=\dfrac73$.
Answer: (b)""", passage="trap", pattern=LS, theme="Intersection of diagonals")

P("sph", "A sphere", r"""Let $2x^{2}+2y^{2}+2z^{2}+3x+3y+3z-6=0$ be a sphere.""")

Q(65, r"""What is the diameter of the sphere?""", [r"$\dfrac{5\sqrt3}4$", r"$\dfrac{5\sqrt3}2$", r"$\dfrac{3\sqrt5}4$", r"$\dfrac{3\sqrt5}2$"], "B",
  "Analytical Geometry > Three-dimensional Geometry > Equation of a Plane", 30,
  r"""Step 1: Divide by 2: centre $\left(-\dfrac34,-\dfrac34,-\dfrac34\right)$, $r^2=3\cdot\dfrac9{16}+3=\dfrac{75}{16}$.
Step 2: $r=\dfrac{5\sqrt3}4$, diameter $\dfrac{5\sqrt3}2$.
Answer: (b)""", passage="sph", pattern=LS, theme="Diameter of a sphere")

Q(66, r"""The centre of the sphere lies on the plane""", ["$2x+2y+2z-3=0$", "$4x+4y+4z-3=0$", "$4x+8y+8z-15=0$", "$4x+8y+8z+15=0$"], "D",
  "Analytical Geometry > Three-dimensional Geometry > Equation of a Plane", 20,
  r"""Step 1: At $\left(-\dfrac34,-\dfrac34,-\dfrac34\right)$: $4x+8y+8z=-3-6-6=-15$, so $4x+8y+8z+15=0$.
Answer: (d)""", passage="sph", pattern=LS, theme="Plane through the centre")

P("lineS", "Line of intersection S", r"""Let $S$ be the line of intersection of two planes $x+y+z=1$ and $2x+3y-4z=8$.""")

Q(67, r"""Which of the following are the direction ratios of $S$?""", [r"$\langle-7,-6,1\rangle$", r"$\langle-7,6,1\rangle$", r"$\langle-6,5,1\rangle$", r"$\langle6,5,1\rangle$"], "B",
  "Analytical Geometry > Three-dimensional Geometry > Line in Space", 25,
  r"""Step 1: $(1,1,1)\times(2,3,-4)=(-4-3,\,2+4,\,3-2)=(-7,6,1)$.
Answer: (b)""", passage="lineS", pattern=LS, theme="Direction of an intersection line")

Q(68, r"""If $\langle l,m,n\rangle$ are direction cosines of $S$, then what is the value of $43(l^{2}-m^{2}-n^{2})$?""", ["6", "5", "4", "1"], "A",
  "Analytical Geometry > Three-dimensional Geometry > Direction Cosines and Direction Ratios", 25,
  r"""Step 1: $|(-7,6,1)|^2=86$, so $l^2=\dfrac{49}{86}$, $m^2=\dfrac{36}{86}$, $n^2=\dfrac1{86}$.
Step 2: $43\cdot\dfrac{49-36-1}{86}=\dfrac{12}2=6$.
Answer: (a)""", passage="lineS", pattern=LS, theme="Direction cosines")

P("lineL", "Line L and plane P", r"""Let $L: x+y+z+4=0=2x-y-z+8$ be a line and $P: x+2y+3z+1=0$ be a plane.""")

Q(69, r"""What are the direction ratios of the line?""", [r"$\langle2,1,-1\rangle$", r"$\langle0,-1,2\rangle$", r"$\langle0,1,-1\rangle$", r"$\langle2,3,-3\rangle$"], "C",
  "Analytical Geometry > Three-dimensional Geometry > Line in Space", 20,
  r"""Step 1: $(1,1,1)\times(2,-1,-1)=(0,3,-3)$, proportional to $(0,1,-1)$.
Answer: (c)""", passage="lineL", pattern=LS, theme="Direction of a line")

Q(70, r"""What is the point of intersection of $L$ and $P$?""", ["$(4,3,-3)$", "$(4,-3,3)$", "$(-4,-3,-3)$", "$(-4,-3,3)$"], "D",
  "Analytical Geometry > Three-dimensional Geometry > Line in Space", 25,
  r"""Step 1: Adding the two plane equations of $L$: $3x+12=0$, so $x=-4$ and $y+z=0$.
Step 2: In $P$: $-4+2y+3z+1=0$ with $z=-y$ gives $y=-3$, $z=3$.
Answer: (d)""", passage="lineL", pattern=LS, theme="Line meets plane")

Q(71, r"""Let $z=[y]$ and $y=[x]-x$, where $[\cdot]$ is the greatest integer function. If $x$ is not an integer but positive, then what is the value of $z$?""",
  ["$-1$", "0", "1", "2"], "A", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 20,
  r"""Step 1: For non-integer $x$, $-1<[x]-x<0$.
Step 2: So $z=[y]=-1$.
Answer: (a)""", theme="Greatest integer of a negative fraction")

Q(72, r"""If $f(x)=4x+1$ and $g(x)=kx+2$ such that $f\circ g(x)=g\circ f(x)$, then what is the value of $k$?""",
  ["7", "5", "4", "3"], "A", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 15,
  r"""Step 1: $f(g(x))=4kx+9$ and $g(f(x))=4kx+k+2$.
Step 2: $k+2=9$, so $k=7$.
Answer: (a)""", theme="Commuting linear functions")

Q(73, r"""What is the minimum value of the function $f(x)=\log_{10}(x^{2}+2x+11)$?""", ["0", "1", "2", "10"], "B",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 15,
  r"""Step 1: $x^2+2x+11=(x+1)^2+10\ge10$.
Step 2: Minimum $\log_{10}10=1$.
Answer: (b)""", theme="Minimum of a logarithm")

Q(74, r"""Which one of the following is correct regarding $\displaystyle\lim_{x\to3}\dfrac{|x-3|}{x-3}$?""",
  ["Limit exists and is equal to 1", "Limit exists and is equal to 0", "Limit exists and is equal to $-1$", "Limit does not exist"], "D",
  "Differential Calculus > Limits and Continuity > Limits", 10,
  r"""Step 1: The right-hand limit is 1 and the left-hand limit is $-1$.
Answer: (d)""", theme="Sign function limit")

Q(75, r"""What is the maximum value of $a\cos x+b\sin x+c$?""",
  [r"$\sqrt{a^{2}+b^{2}+c}$", r"$\sqrt{a^{2}+b^{2}}+c$", r"$\sqrt{a^{2}+b^{2}}-c$", r"$\sqrt{a^{2}+b^{2}}$"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 10,
  r"""Step 1: $a\cos x+b\sin x$ ranges over $\left[-\sqrt{a^2+b^2},\sqrt{a^2+b^2}\right]$.
Answer: (b)""", theme="Maximum of a cos x + b sin x")

Q(76, r"""If $f(2x)=4x^{2}+1$, then for how many real values of $x$ will $f(2x)$ be the GM of $f(x)$ and $f(4x)$?""",
  ["Four", "Two", "One", "None"], "C", "Algebra > Sequences and Series > Geometric Progression", 30,
  r"""Step 1: $f(t)=t^2+1$, so the condition is $(4x^2+1)^2=(x^2+1)(16x^2+1)$.
Step 2: $8x^2=17x^2$, so $x=0$ only.
Answer: (c)""", theme="Geometric mean condition")

Q(77, r"""If $f(x)=[x]^{2}-30[x]+221=0$, where $[x]$ is the greatest integer function, then what is the sum of all integer solutions?""",
  ["13", "17", "27", "30"], "D", "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 25,
  r"""Step 1: $[x]=13$ or $17$.
Step 2: The integer solutions are $x=13$ and $x=17$; the sum is 30.
Answer: (d)""", theme="Quadratic in the greatest integer")

Q(78, r"""If $f(x)=9x-8\sqrt x$ such that $g(x)=f(x)-1$, then which one of the following is correct?""",
  ["$g(x)=0$ has no real roots", "$g(x)=0$ has only one real root which is an integer", "$g(x)=0$ has two real roots which are integers", "$g(x)=0$ has only one real root which is not an integer"], "B",
  "Algebra > Quadratic Equations and Inequalities > Nature of Roots", 25,
  r"""Step 1: With $t=\sqrt x\ge0$: $9t^2-8t-1=0$ gives $t=1$ or $-\dfrac19$ (rejected).
Step 2: So $x=1$ only.
Answer: (b)""", theme="Quadratic in root x")

Q(79, r"""What is $\displaystyle\lim_{\theta\to\frac\pi2}(\sec\theta-\tan\theta)$ equal to?""", ["$-1$", "0", "1/2", "1"], "B",
  "Differential Calculus > Limits and Continuity > Limits", 25,
  r"""Step 1: $\sec\theta-\tan\theta=\dfrac{1-\sin\theta}{\cos\theta}=\dfrac{\cos\theta}{1+\sin\theta}$.
Step 2: At $\theta=\dfrac\pi2$ this is $\dfrac02=0$.
Answer: (b)""", theme="sec minus tan near pi/2")

Q(80, r"""Let $f(x)f(y)=f(xy)$ for all real $x$, $y$. If $f(2)=4$, then what is the value of $f(1/2)$?""", ["1/4", "1/2", "1", "4"], "A",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 25,
  r"""Step 1: $f(2)f(1)=f(2)\ne0$, so $f(1)=1$.
Step 2: $f(2)f(1/2)=f(1)=1$ gives $f(1/2)=\dfrac14$.
Answer: (a)""", theme="Multiplicative function")

P("fg", "Unknown functions from compositions", r"""Let $f\circ g(x)=\cos^{2}\sqrt x$ and $g\circ f(x)=|\cos x|$.""")

Q(81, r"""Which one of the following is $f(x)$?""", [r"$\cos x$", r"$\cos x^{2}$", r"$\cos^{2}x$", r"$\cos|x|$"], "C",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 30,
  r"""Step 1: Try $f(x)=\cos^2x$, $g(x)=\sqrt x$: $f(g(x))=\cos^2\sqrt x$ and $g(f(x))=\sqrt{\cos^2x}=|\cos x|$. Both match.
Answer: (c)""", passage="fg", pattern=LS, theme="Recovering f")

Q(82, r"""Which one of the following is $g(x)$?""", [r"$\sqrt x$", "$|x|$", "$x^{2}$", "$x|x|$"], "A",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 25,
  r"""Step 1: From the previous item, $g(x)=\sqrt x$.
Answer: (a)""", passage="fg", pattern=LS, theme="Recovering g")

P("flr", "Difference of greatest integers", r"""Let $f(x)=[x]^{2}-[x^{2}]$.""")

Q(83, r"""What is $f(0.999)+f(1.001)$ equal to?""", ["$-1$", "0", "1", "2"], "B",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 20,
  r"""Step 1: $f(0.999)=0-[0.998]=0$ and $f(1.001)=1-[1.002]=0$.
Answer: (b)""", passage="flr", pattern=LS, theme="Evaluating near 1")

Q(84, r"""Consider the following statements:

I. $f(x)$ is continuous at $x=0$.
II. $f(x)$ is continuous at $x=1$.

Which of the statements given above is/are correct?""", ["I only", "II only", "Both I and II", "Neither I nor II"], "B",
  "Differential Calculus > Limits and Continuity > Continuity", 35,
  r"""Step 1: As $x\to0^-$, $[x]=-1$ and $[x^2]=0$, so $f\to1$, while $f(0)=0$. Not continuous at 0.
Step 2: Near 1: left side $0-0=0$, right side $1-1=0$, $f(1)=0$. Continuous at 1.
Answer: (b)""", passage="flr", pattern=S2, theme="Continuity with greatest integer")

P("c2x", "cos 2x + x on an interval", r"""Let $f(x)=\cos2x+x$ on $[-\pi/2,\pi/2]$.""")

Q(85, r"""What is the greatest value of $f(x)$?""", [r"$\dfrac{\sqrt3}2-\dfrac\pi{12}$", r"$\dfrac{\sqrt3}2+\dfrac\pi{12}$", r"$\dfrac{\sqrt3}2+\dfrac\pi9$", r"$\dfrac{\sqrt3}2+\dfrac\pi6$"], "B",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 35,
  r"""Step 1: $f'(x)=1-2\sin2x=0$ at $x=\dfrac\pi{12}$ (max) and $\dfrac{5\pi}{12}$ (min).
Step 2: $f(\pi/12)=\dfrac{\sqrt3}2+\dfrac\pi{12}\approx1.13$, larger than the end value $f(\pi/2)=\dfrac\pi2-1$.
Answer: (b)""", passage="c2x", pattern=LS, theme="Greatest value on an interval")

Q(86, r"""What is the least value of $f(x)$?""", [r"$-\left(1+\dfrac\pi2\right)$", r"$-\left(\dfrac12+\dfrac\pi2\right)$", r"$-\left(1+\dfrac\pi4\right)$", r"$-2\left(\dfrac12-\dfrac\pi4\right)$"], "A",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 30,
  r"""Step 1: At $x=-\dfrac\pi2$: $\cos(-\pi)-\dfrac\pi2=-1-\dfrac\pi2$, below the local minimum at $\dfrac{5\pi}{12}$ (about 0.44).
Answer: (a)""", passage="c2x", pattern=LS, theme="Least value on an interval")

P("parab", "Parabola and a vertical line", r"""The area bounded by the parabola $y^{2}=kx$ and the line $x=k$, where $k>0$, is $4/3$ square units.""")

Q(87, r"""What is the value of $k$?""", ["1/2", "1", r"$\sqrt2$", "2"], "B",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 30,
  r"""Step 1: Area $=2\displaystyle\int_0^k\sqrt{kx}\,dx=\dfrac43k^2$.
Step 2: $\dfrac43k^2=\dfrac43$ gives $k=1$.
Answer: (b)""", passage="parab", pattern=LS, theme="Area of a parabolic segment")

Q(88, r"""What is the area of the parabola bounded by the latus rectum?""", ["1/6 square unit", "2/3 square unit", "1 square unit", "4/3 square units"], "A",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 30,
  r"""Step 1: $y^2=x$ has $a=\dfrac14$ and latus rectum $x=\dfrac14$.
Step 2: Area $=2\displaystyle\int_0^{1/4}\sqrt x\,dx=\dfrac43\cdot\dfrac18=\dfrac16$.
Answer: (a)""", passage="parab", pattern=LS, theme="Area cut by the latus rectum")

P("de", "A first-order differential equation", r"""Let $y\,dx+(x-y^{3})\,dy=0$ be a differential equation.""")

Q(89, r"""What are the order and degree respectively of the differential equation?""", ["1 and 1", "1 and 2", "2 and 1", "1 and 3"], "A",
  "Integral Calculus and Differential Equations > Differential Equations > Order and Degree", 15,
  r"""Step 1: It contains only the first derivative, to the first power.
Answer: (a)""", passage="de", pattern=LS, theme="Order and degree")

Q(90, r"""What is the solution of the differential equation?""", ["$y^{4}+2x=c$", "$y^{4}+3x=c$", "$2xy^{4}+x=c$", "$4xy-y^{4}=c$"], "D",
  "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 30,
  r"""Step 1: $y\,dx+x\,dy=y^3\,dy$, i.e. $d(xy)=y^3\,dy$.
Step 2: $xy=\dfrac{y^4}4+c'$, i.e. $4xy-y^4=c$.
Answer: (d)""", passage="de", pattern=LS, theme="Exact differential")

P("absq", "Modulus of a quadratic", r"""Let $f(x)=|x^{2}-x-2|$.""")

Q(91, r"""What is $\displaystyle\int_0^{2}f(x)\,dx$ equal to?""", ["0", "1", "5/3", "10/3"], "D",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 25,
  r"""Step 1: On $[0,2]$, $x^2-x-2=(x-2)(x+1)\le0$, so $f=-x^2+x+2$.
Step 2: $\displaystyle\int_0^2(-x^2+x+2)\,dx=-\dfrac83+2+4=\dfrac{10}3$.
Answer: (d)""", passage="absq", pattern=LS, theme="Integral of a modulus")

Q(92, r"""What is $\displaystyle\int_1^{3}f(x)\,dx$ equal to?""", ["2", "3", "4", "5"], "B",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 30,
  r"""Step 1: $\displaystyle\int_1^2(-x^2+x+2)\,dx=\dfrac76$ and $\displaystyle\int_2^3(x^2-x-2)\,dx=\dfrac{11}6$.
Step 2: Total $3$.
Answer: (b)""", passage="absq", pattern=LS, theme="Split integral of a modulus")

P("asinh", "Log function and its tangent", r"""Let $f(t)=\ln\left(t+\sqrt{1+t^{2}}\right)$ and $g(t)=\tan(f(t))$.""")

Q(93, r"""Consider the following statements:

I. $f(t)$ is an odd function.
II. $g(t)$ is an odd function.

Which of the statements given above is/are correct?""", ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 30,
  r"""Step 1: $f(-t)=\ln\left(\sqrt{1+t^2}-t\right)=-\ln\left(t+\sqrt{1+t^2}\right)=-f(t)$.
Step 2: $\tan$ is odd, so $g(-t)=\tan(-f(t))=-g(t)$.
Answer: (c)""", passage="asinh", pattern=S2, theme="Odd functions")

Q(94, r"""What is $\displaystyle\int_{-\pi}^{\pi}g(t)\,dt$ equal to?""", ["$-1$", "0", "1/2", "1"], "B",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 20,
  r"""Step 1: $g$ is odd, so its integral over a symmetric interval is 0.
Answer: (b)""", passage="asinh", pattern=LS, theme="Integral of an odd function")

P("hfx", "Composite function derivatives",
  r"""Let $f:(-1,1)\to R$ be a differentiable function with $f(0)=-1$ and $f'(0)=1$. Let $h(x)=f(2f(x)+2)$ and $g(x)=(h(x))^{2}$.""")

Q(95, r"""What is $h'(0)$ equal to?""", ["$-2$", "$-1$", "0", "2"], "D",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 30,
  r"""Step 1: $h'(x)=f'(2f(x)+2)\cdot2f'(x)$. At 0, $2f(0)+2=0$.
Step 2: $h'(0)=f'(0)\cdot2\cdot1=2$.
Answer: (d)""", passage="hfx", pattern=LS, theme="Chain rule")

Q(96, r"""What is $g'(0)$ equal to?""", ["$-4$", "$-2$", "0", "4"], "A",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 30,
  r"""Step 1: $h(0)=f(0)=-1$.
Step 2: $g'(0)=2h(0)h'(0)=2(-1)(2)=-4$.
Answer: (a)""", passage="hfx", pattern=LS, theme="Derivative of a square")

P("Ig", "A definite integral pair",
  r"""Let $I=\displaystyle\int_0^{\pi/2}\dfrac{f(x)}{g(x)}\,dx$, where $f(x)=\sin x$ and $g(x)=\sin x+\cos x+1$.""")

Q(97, r"""What is $\displaystyle\int_0^{\pi/2}\dfrac{dx}{g(x)}$ equal to?""", [r"$\dfrac{\ln2}2$", r"$\dfrac{\ln2}4$", r"$\ln2$", r"$2\ln2$"], "C",
  "Integral Calculus and Differential Equations > Definite Integrals > Evaluation", 40,
  r"""Step 1: With $t=\tan\dfrac x2$: $1+\sin x+\cos x=\dfrac{2(1+t)}{1+t^2}$ and $dx=\dfrac{2\,dt}{1+t^2}$.
Step 2: The integral is $\displaystyle\int_0^1\dfrac{dt}{1+t}=\ln2$.
Answer: (c)""", passage="Ig", pattern=LS, theme="Half-angle substitution")

Q(98, r"""What is $I$ equal to?""", [r"$\dfrac\pi4+\ln2$", r"$\dfrac\pi4-\ln2$", r"$\dfrac\pi4-\dfrac{\ln2}2$", r"$\dfrac\pi4+\dfrac{\ln2}2$"], "C",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 45,
  r"""Step 1: Replacing $x$ by $\dfrac\pi2-x$ shows $I=J=\displaystyle\int\dfrac{\cos x}{g}\,dx$.
Step 2: $I+J=\displaystyle\int_0^{\pi/2}\left(1-\dfrac1g\right)dx=\dfrac\pi2-\ln2$, so $I=\dfrac\pi4-\dfrac{\ln2}2$.
Answer: (c)""", passage="Ig", pattern=LS, theme="King's property")

P("UV", "An indefinite integral in two parts",
  r"""Let $2\displaystyle\int\dfrac{x^{2}-1}{\sqrt{x^{2}+1}}\,dx=U(x)V(x)-3\ln\{U(x)+V(x)\}+c$.""")

Q(99, r"""What is $|U^{2}(x)-V^{2}(x)|$ equal to?""", ["0", "1", "2", "3"], "B",
  "Integral Calculus and Differential Equations > Indefinite Integration > Standard Forms", 45,
  r"""Step 1: $\dfrac{x^2-1}{\sqrt{x^2+1}}=\sqrt{x^2+1}-\dfrac2{\sqrt{x^2+1}}$.
Step 2: Twice its integral is $x\sqrt{x^2+1}+\ln\left(x+\sqrt{x^2+1}\right)-4\ln\left(x+\sqrt{x^2+1}\right)=x\sqrt{x^2+1}-3\ln\left(x+\sqrt{x^2+1}\right)$.
Step 3: So $U=x$, $V=\sqrt{x^2+1}$ and $|U^2-V^2|=1$.
Answer: (b)""", passage="UV", pattern=LS, theme="Identifying U and V")

Q(100, r"""What is $U(x)V(x)$ equal to?""", [r"$\sqrt{x^{2}+x^{4}}$", r"$\sqrt{x+x^{3}}$", r"$\dfrac{\sqrt{x^{2}+x^{4}}}2$", r"$2\sqrt{x^{2}+x^{4}}$"], "A",
  "Integral Calculus and Differential Equations > Indefinite Integration > Standard Forms", 30,
  r"""Step 1: $UV=x\sqrt{x^2+1}=\sqrt{x^2+x^4}$ (for $x\ge0$).
Answer: (a)""", passage="UV", pattern=LS, theme="Product U V")

Q(101, r"""Let $x-3y+4=0$ and $2x-7y+8=0$ be two lines of regression computed from some bivariate data. If $b_{yx}$ and $b_{xy}$ are regression coefficients of lines of regression of $y$ on $x$ and $x$ on $y$ respectively, then what is the value of $b_{xy}+7b_{yx}$?""",
  ["$-2$", "1", "2", "5"], "D", "Statistics > Correlation > Correlation Coefficient", 40,
  r"""Step 1: Taking the first as $y$ on $x$ gives $b_{yx}=\dfrac13$, $b_{xy}=\dfrac72$, product $>1$: impossible.
Step 2: So $x=3y-4$ is $x$ on $y$ ($b_{xy}=3$) and $y=\dfrac{2x+8}7$ is $y$ on $x$ ($b_{yx}=\dfrac27$); product $\dfrac67<1$.
Step 3: $3+7\cdot\dfrac27=5$.
Answer: (d)""", theme="Identifying regression lines")

Q(102, r"""The mean of $n$ observations $1, 4, 9, 16, \dots, n^{2}$ is 130. What is the value of $n$?""", ["18", "19", "20", "21"], "B",
  "Statistics > Measures of Central Tendency > Mean", 20,
  r"""Step 1: Mean $=\dfrac{(n+1)(2n+1)}6=130$, so $(n+1)(2n+1)=780=20\times39$.
Step 2: $n=19$.
Answer: (b)""", theme="Mean of squares")

Q(103, r"""Three distinct natural numbers are chosen at random from 1 to 10. What is the probability that they are consecutive?""", ["1/12", "3/40", "1/15", "7/120"], "C",
  "Probability > Classical Probability > Events and Sample Space", 15,
  r"""Step 1: Consecutive triples: 8. Total $\binom{10}3=120$.
Step 2: $\dfrac8{120}=\dfrac1{15}$.
Answer: (c)""", theme="Consecutive numbers")

Q(104, r"""$A$, $B$, $C$ are three mutually exclusive and exhaustive events associated with a random experiment. If $3P(B)=4P(A)$ and $3P(C)=2P(B)$, then what is $P(A)$ equal to?""",
  ["7/29", "8/29", "9/29", "10/29"], "C", "Probability > Classical Probability > Addition and Multiplication Rules", 20,
  r"""Step 1: $P(B)=\dfrac43P(A)$ and $P(C)=\dfrac89P(A)$.
Step 2: $P(A)\left(1+\dfrac43+\dfrac89\right)=1$ gives $P(A)=\dfrac9{29}$.
Answer: (c)""", theme="Exhaustive events")

Q(105, r"""A die has two faces with number 4, three faces with number 5 and one face with number 6. If the die is rolled once, then what is the probability of getting 4 or 5?""",
  ["1/3", "2/3", "5/6", "1/2"], "C", "Probability > Classical Probability > Events and Sample Space", 5,
  r"""Step 1: 5 of the 6 faces show 4 or 5.
Answer: (c)""", theme="Unusual die")

Q(106, r"""A box contains 2 black, 4 yellow and 6 white balls. Three balls are drawn in succession with replacement. What is the probability that all three are of the same colour?""",
  ["1/6", "1/36", "1/12", "5/12"], "A", "Probability > Classical Probability > Addition and Multiplication Rules", 20,
  r"""Step 1: $\left(\dfrac16\right)^3+\left(\dfrac13\right)^3+\left(\dfrac12\right)^3=\dfrac{1+8+27}{216}=\dfrac16$.
Answer: (a)""", theme="Same colour with replacement")

Q(107, r"""$A$ can hit a target 5 times in 6 shots, $B$ can hit 4 times in 5 shots and $C$ can hit 3 times in 4 shots. What is the probability that $A$ and $C$ may hit but $B$ may lose?""",
  ["1/8", "1/6", "1/4", "1/3"], "A", "Probability > Classical Probability > Addition and Multiplication Rules", 15,
  r"""Step 1: $\dfrac56\cdot\dfrac15\cdot\dfrac34=\dfrac18$.
Answer: (a)""", theme="Independent shooters")

Q(108, r"""The letters of the word ZOOLOGY are arranged in all possible ways. What is the probability that the consonants and vowels occur alternatively?""",
  ["6/35", "3/35", "2/35", "1/35"], "D", "Probability > Classical Probability > Events and Sample Space", 30,
  r"""Step 1: Total arrangements $\dfrac{7!}{3!}=840$.
Step 2: Alternating needs C V C V C V C: the 4 consonants in $4!=24$ ways, the three O's in 1 way.
Step 3: $\dfrac{24}{840}=\dfrac1{35}$.
Answer: (d)""", theme="Alternating letters")

Q(109, r"""A natural number $x$ is chosen at random from the first 100 natural numbers. What is the probability that $x^{2}+x>50$?""",
  ["93/100", "47/50", "24/25", "23/25"], "B", "Probability > Classical Probability > Events and Sample Space", 15,
  r"""Step 1: $6^2+6=42$ and $7^2+7=56$, so $x\ge7$: 94 values.
Step 2: $\dfrac{94}{100}=\dfrac{47}{50}$.
Answer: (b)""", theme="Inequality on natural numbers")

Q(110, r"""What is the mean deviation of the first 10 natural numbers?""", ["2", "2.5", "3", "3.5"], "B",
  "Statistics > Measures of Dispersion > Range and Mean Deviation", 15,
  r"""Step 1: Mean 5.5; absolute deviations $4.5,3.5,2.5,1.5,0.5$ each twice, total 25.
Step 2: $\dfrac{25}{10}=2.5$.
Answer: (b)""", theme="Mean deviation about the mean")

Q(111, r"""Let $\sum_{i=1}^{9}x_i^{2}=855$. If $M$ is the mean and $\sigma$ is the standard deviation of $x_1, x_2, \dots, x_9$, then what is the value of $M^{2}+\sigma^{2}$?""",
  ["100", "95", "90", "85"], "B", "Statistics > Measures of Dispersion > Variance and Standard Deviation", 15,
  r"""Step 1: $\sigma^2=\dfrac{\sum x^2}n-M^2$, so $M^2+\sigma^2=\dfrac{855}9=95$.
Answer: (b)""", theme="Mean square identity")

Q(112, r"""The mean of the series $x_1, x_2, \dots, x_n$ is $\bar x$. If $x_n$ is replaced by $k$, then what is the new mean?""",
  [r"$\bar x-x_n+k$", r"$\dfrac{n\bar x-\bar x+k}n$", r"$\dfrac{\bar x-x_n-k}n$", r"$\dfrac{n\bar x-x_n+k}n$"], "D", "Statistics > Measures of Central Tendency > Mean", 10,
  r"""Step 1: The new total is $n\bar x-x_n+k$; divide by $n$.
Answer: (d)""", theme="Replacing one observation")

Q(113, r"""A fair coin is tossed till two heads occur in succession. What is the probability that the number of tosses required is less than 6?""",
  ["5/64", "15/32", "31/64", "19/32"], "D", "Probability > Classical Probability > Events and Sample Space", 40,
  r"""Step 1: First HH ends at toss 2: $\dfrac14$; toss 3 (THH): $\dfrac18$; toss 4 (TTHH, HTHH): $\dfrac2{16}$; toss 5 (TTTHH, HTTHH, THTHH): $\dfrac3{32}$.
Step 2: Sum $=\dfrac{8+4+4+3}{32}=\dfrac{19}{32}$.
Answer: (d)""", theme="Waiting for two heads")

Q(114, r"""Urn $A$ contains 2 white and 2 black balls while urn $B$ contains 3 white and 2 black balls. One ball is transferred from urn $A$ to urn $B$ and then a ball is drawn out of urn $B$. What is the probability that the ball is white?""",
  ["11/20", "7/12", "3/5", "1"], "B", "Probability > Conditional Probability > Bayes' Theorem", 25,
  r"""Step 1: $\dfrac12\cdot\dfrac46+\dfrac12\cdot\dfrac36=\dfrac7{12}$.
Answer: (b)""", theme="Total probability with transfer")

Q(115, r"""For two events $A$ and $B$, $P(A)=P(A|B)=0.25$ and $P(B|A)=0.5$. Which of the following are correct?

I. $A$ and $B$ are independent.
II. $P(A^{c}\cup B^{c})=0.875$
III. $P(A^{c}\cap B^{c})=0.375$

Select the answer using the code given below.""",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "D", "Probability > Conditional Probability > Conditional Probability and Independence", 35,
  r"""Step 1: $P(A|B)=P(A)$ means independence; then $P(B)=P(B|A)=0.5$ and $P(A\cap B)=0.125$.
Step 2: $P(A^c\cup B^c)=1-0.125=0.875$; $P(A\cup B)=0.625$, so $P(A^c\cap B^c)=0.375$.
Answer: (d)""", pattern="3-Statement Combination", theme="Independence checks")

Q(116, r"""Two perfect dice are thrown. What is the probability that the sum of the numbers on the faces is neither 9 nor 10?""",
  ["1/36", "5/36", "7/36", "29/36"], "D", "Probability > Classical Probability > Events and Sample Space", 15,
  r"""Step 1: Sum 9 in 4 ways, sum 10 in 3 ways.
Step 2: $1-\dfrac7{36}=\dfrac{29}{36}$.
Answer: (d)""", theme="Complement of two sums")

Q(117, r"""The occurrence of a disease in an industry is such that the workers have 20% chance of suffering from it. What is the probability that out of 6 workers chosen at random, 4 or more will suffer from the disease?""",
  ["53/3125", "63/3125", "73/3125", "83/3125"], "A", "Probability > Probability Distributions > Binomial Distribution", 30,
  r"""Step 1: $\binom64(0.2)^4(0.8)^2+\binom65(0.2)^5(0.8)+(0.2)^6=\dfrac{240+24+1}{15625}=\dfrac{265}{15625}=\dfrac{53}{3125}$.
Answer: (a)""", theme="Binomial tail")

Q(118, r"""Three perfect dice are rolled. Under the condition that no two show the same face, what is the probability that one of the faces shown is an ace (one)?""",
  ["5/9", "2/3", "1/3", "1/2"], "D", "Probability > Conditional Probability > Conditional Probability and Independence", 30,
  r"""Step 1: With three distinct faces, the set of faces is one of $\binom63=20$ equally likely sets.
Step 2: Sets containing 1: $\binom52=10$. Probability $\dfrac12$.
Answer: (d)""", theme="Conditional probability with distinct faces")

Q(119, r"""Three perfect dice $D_1$, $D_2$ and $D_3$ are rolled. Let $x$, $y$ and $z$ represent the numbers on $D_1$, $D_2$ and $D_3$ respectively. What is the number of possible outcomes such that $x<y<z$?""",
  ["20", "18", "14", "10"], "A", "Algebra > Permutations and Combinations > Combinations", 20,
  r"""Step 1: Each choice of 3 distinct numbers gives exactly one increasing order: $\binom63=20$.
Answer: (a)""", theme="Strictly increasing outcomes")

Q(120, r"""In a binomial distribution, if the mean is 6 and the standard deviation is $\sqrt2$, then what are the values of the parameters $n$ and $p$ respectively?""",
  ["18 and 1/3", "9 and 1/3", "18 and 2/3", "9 and 2/3"], "D", "Probability > Probability Distributions > Binomial Distribution", 15,
  r"""Step 1: $npq=2$ and $np=6$, so $q=\dfrac13$, $p=\dfrac23$ and $n=9$.
Answer: (d)""", theme="Parameters from mean and SD")
