from qfmt import Q, P, F, W

# NDA II 2025 Mathematics, Set A, booklet pages 15-31, Q41-80
SI = ["Both Statement-I and Statement-II are correct and Statement-II explains Statement-I",
      "Both Statement-I and Statement-II are correct but Statement-II does not explain Statement-I",
      "Statement-I is correct but Statement-II is not correct",
      "Statement-I is not correct but Statement-II is correct"]

Q(41, r"""What is the sum of the binary numbers $(101101101)_2$ and $(100011)_2$?""",
  [r"$(110010000)_2$", r"$(110001000)_2$", r"$(110000100)_2$", r"$(100100000)_2$"], "A",
  "Algebra > Number Systems > Binary and Decimal Systems", 20,
  r"""Step 1: $(101101101)_2=256+64+32+8+4+1=365$ and $(100011)_2=35$.
Step 2: $365+35=400=256+128+16=(110010000)_2$.
Answer: (a)""", theme="Binary addition")

Q(42, r"""Set $X$ contains $3n$ elements and set $Y$ contains $2n$ elements, and they have $n$ elements in common. How many elements does $(X-Y)\times(Y-X)$ have?""",
  ["$5n^{2}$", "$4n^{2}$", "$3n^{2}$", "$2n^{2}$"], "D",
  "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 20,
  r"""Step 1: $|X-Y|=3n-n=2n$ and $|Y-X|=2n-n=n$.
Step 2: $|(X-Y)\times(Y-X)|=2n\cdot n=2n^2$.
Answer: (d)""", theme="Cartesian product of set differences")

Q(43, r"""Let $A=\{-3,-2,-1,0,1,2,3\}$ and $B=\{0,1,4,9\}$. How many elements does the subset of $A\times B$ corresponding to the relation $R=\{(x,y):|x|<y\}$ have, where $x\in A$ and $y\in B$?""",
  ["9", "12", "15", "16"], "C",
  "Algebra > Sets, Relations and Functions > Relations", 25,
  r"""Step 1: $y=0$: no $x$. $y=1$: only $x=0$, 1 pair.
Step 2: $y=4$: all 7 values have $|x|\le3<4$. $y=9$: again 7.
Step 3: Total $1+7+7=15$.
Answer: (c)""", theme="Counting pairs in a relation")

Q(44, r"""Consider the following statements:

Statement-I: If $X$ is an $n\times n$ matrix, then $\det(mX)=m^{n}\det(X)$, where $m$ is a scalar.

Statement-II: If $Y$ is a matrix obtained from $X$ by multiplying any row or column by a scalar $m$, then $\det(Y)=m\det(X)$.

Which one of the following is correct in respect of the above statements?""",
  SI, "A", "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Step 1: Statement-II is the basic row-scaling property of determinants, so it is correct.
Step 2: $mX$ multiplies each of the $n$ rows by $m$. Applying Statement-II $n$ times gives $\det(mX)=m^n\det X$, so Statement-I is correct and follows from Statement-II.
Answer: (a)""", pattern="Assertion-Reason", theme="Scalar multiple of a matrix")
F(44, "Explains-vs-does-not-explain judgement; DP key (a).")

Q(45, r"""Consider the following statements about the matrix
$$M=\begin{bmatrix}71&23&48\\57&28&29\\65&17&48\end{bmatrix}$$

Statement-I: The inverse of $M$ does not exist.

Statement-II: $M$ is non-singular.

Which one of the following is correct in respect of the above statements?""",
  SI, "C", "Matrices and Determinants > Matrices > Adjoint and Inverse", 40,
  r"""Step 1: Note $C_1=C_2+C_3$ in every row ($23+48=71$, $28+29=57$, $17+48=65$).
Step 2: So $|M|=0$: $M$ is singular and has no inverse.
Step 3: Statement-I is correct and Statement-II is not.
Answer: (c)""", pattern="Assertion-Reason", theme="Singular matrix by column relation")

Q(46, r"""What is
$$\cot^{-1}9+\operatorname{cosec}^{-1}\left(\dfrac{\sqrt{41}}{4}\right)$$
equal to?""",
  [r"$\dfrac\pi4$", r"$\dfrac\pi3$", r"$\dfrac\pi2$", r"$\pi$"], "A",
  "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 35,
  r"""Step 1: $\cot^{-1}9=\tan^{-1}\dfrac19$.
Step 2: If $\operatorname{cosec}\phi=\dfrac{\sqrt{41}}{4}$, then $\sin\phi=\dfrac{4}{\sqrt{41}}$, $\cos\phi=\dfrac5{\sqrt{41}}$, so $\phi=\tan^{-1}\dfrac45$.
Step 3: $\tan^{-1}\dfrac19+\tan^{-1}\dfrac45=\tan^{-1}\dfrac{1/9+4/5}{1-4/45}=\tan^{-1}1=\dfrac\pi4$.
Answer: (a)""", theme="Sum of inverse trigonometric values")

Q(47, r"""How many values of $\theta$, where $-\pi<\theta<\pi$, satisfy both the equations $\cot\theta=-\sqrt3$ and $\operatorname{cosec}\theta=-2$ simultaneously?""",
  ["4", "2", "1", "None"], "C",
  "Trigonometry > Trigonometric Equations > Number of Solutions in an Interval", 30,
  r"""Step 1: $\operatorname{cosec}\theta=-2$ gives $\sin\theta=-\dfrac12$: $\theta=-\dfrac\pi6$ or $-\dfrac{5\pi}6$.
Step 2: $\cot(-\pi/6)=-\sqrt3$ but $\cot(-5\pi/6)=\sqrt3$.
Step 3: Only $\theta=-\pi/6$ works.
Answer: (c)""", theme="Common solutions of two equations")

Q(48, r"""If $x+\dfrac1x=2\cos\theta$, then what is $x^{3}+\dfrac1{x^{3}}$ equal to?""",
  [r"$\cos^{3}\theta$", r"$\cos3\theta$", r"$2\cos3\theta$", r"$3\cos3\theta$"], "C",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 30,
  r"""Step 1: $x^3+\dfrac1{x^3}=\left(x+\dfrac1x\right)^3-3\left(x+\dfrac1x\right)=8\cos^3\theta-6\cos\theta$.
Step 2: $8\cos^3\theta-6\cos\theta=2(4\cos^3\theta-3\cos\theta)=2\cos3\theta$.
Answer: (c)""", theme="Cube of x + 1/x")

Q(49, r"""If $0\le x\le\dfrac\pi2$, then what is the number of values of $x$ satisfying the equation
$$\tan x+\sec x=2\cos x?$$""",
  ["0", "1", "2", "3"], "B",
  "Trigonometry > Trigonometric Equations > Number of Solutions in an Interval", 40,
  r"""Step 1: For $x\ne\pi/2$: $\dfrac{\sin x+1}{\cos x}=2\cos x$, so $1+\sin x=2-2\sin^2x$.
Step 2: $2\sin^2x+\sin x-1=0$ gives $\sin x=\dfrac12$ or $-1$.
Step 3: In the interval only $x=\pi/6$ works ($x=\pi/2$ is not allowed since $\tan x$ is undefined).
Answer: (b)""", theme="Equation with tan and sec")

Q(50, r"""What is the value of
$$\tan\left[\dfrac12\sec^{-1}\left(\dfrac2{\sqrt3}\right)\right]?$$""",
  [r"$2-\sqrt3$", r"$2+\sqrt3$", r"$\sqrt3-1$", r"$\sqrt3+1$"], "A",
  "Trigonometry > Inverse Trigonometric Functions > Principal Values", 25,
  r"""Step 1: $\sec^{-1}\dfrac2{\sqrt3}=\cos^{-1}\dfrac{\sqrt3}2=\dfrac\pi6$.
Step 2: $\tan\dfrac\pi{12}=2-\sqrt3$.
Answer: (a)""", theme="Half of a principal value")

P("plane", "Plane through a line of intersection",
  r"""A plane $P$ is parallel to the line having direction ratios $\langle1,3,2\rangle$ and contains the line of intersection of the planes $6x+4y-5z=2$ and $x-2y+3z=0$.""")

Q(51, r"""Which of the following are the direction ratios of the line of intersection of the given planes?""",
  [r"$\langle2,23,16\rangle$", r"$\langle2,-23,-16\rangle$", r"$\langle2,3,2\rangle$", r"$\langle-1,3,-2\rangle$"], "B",
  "Analytical Geometry > Three-dimensional Geometry > Line in Space", 30,
  r"""Concept: the line of intersection is along the cross product of the normals.
Step 1: $(6,4,-5)\times(1,-2,3)=(12-10,\,-5-18,\,-12-4)=(2,-23,-16)$.
Answer: (b)""", passage="plane", pattern="Linked Item Set", theme="Direction of the line of intersection")

Q(52, r"""What is the equation of the plane $P$?""",
  ["$2x-20y+29z+2=0$", "$2x-20y+29z-2=0$", "$2x+3y+2z-4=0$", "$x-3y+2z+5=0$"], "A",
  "Analytical Geometry > Three-dimensional Geometry > Equation of a Plane", 55,
  r"""Step 1: The normal of $P$ is perpendicular to $(2,-23,-16)$ and $(1,3,2)$: $(2,-23,-16)\times(1,3,2)=(2,-20,29)$.
Step 2: A point on the line: put $z=0$: $6x+4y=2$ and $x=2y$ give $y=\dfrac18$, $x=\dfrac14$.
Step 3: $2\cdot\dfrac14-20\cdot\dfrac18+d=0$ gives $d=2$. So $2x-20y+29z+2=0$.
Answer: (a)""", passage="plane", pattern="Linked Item Set", theme="Plane parallel to a line")

P("sphere", "Smallest sphere through three points",
  r"""Suppose $S$ is the sphere with the smallest radius that passes through the points $A(1,0,0)$, $B(0,1,0)$ and $C(0,0,1)$.""")

Q(53, r"""What is the radius of $S$?""",
  [r"$\sqrt{\dfrac13}$", r"$\sqrt{\dfrac23}$", r"$\dfrac13$", "1"], "B",
  "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 45,
  r"""Concept: the smallest sphere through three points has the circle through them as a great circle.
Step 1: $ABC$ is equilateral; its circumcentre is the centroid $\left(\dfrac13,\dfrac13,\dfrac13\right)$.
Step 2: Radius $=\sqrt{\left(\dfrac23\right)^2+\left(\dfrac13\right)^2+\left(\dfrac13\right)^2}=\sqrt{\dfrac69}=\sqrt{\dfrac23}$.
Answer: (b)""", passage="sphere", pattern="Linked Item Set", theme="Radius of the smallest sphere")

Q(54, r"""On which one of the following planes does the centre of $S$ lie?""",
  ["$x+y+z-1=0$", "$x+y+z+1=0$", "$3x+3y+3z-1=0$", "$3x+3y+3z+1=0$"], "A",
  "Analytical Geometry > Three-dimensional Geometry > Equation of a Plane", 25,
  r"""Step 1: The centre is $\left(\dfrac13,\dfrac13,\dfrac13\right)$.
Step 2: $\dfrac13+\dfrac13+\dfrac13-1=0$, so it lies on $x+y+z-1=0$.
Answer: (a)""", passage="sphere", pattern="Linked Item Set", theme="Locating the centre")

P("pgram", "Parallelogram in space",
  r"""Let $A(1,-1,0)$, $B(-2,1,8)$ and $C(-1,2,7)$ are three consecutive vertices of a parallelogram $ABCD$.""")

Q(55, r"""What is the fourth vertex $D$?""",
  ["$(0,-2,1)$", "$(2,0,-1)$", "$(1,0,1)$", "$(1,2,0)$"], "B",
  "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 20,
  r"""Concept: the diagonals of a parallelogram bisect each other, so $D=A+C-B$.
Step 1: $D=(1-1+2,\,-1+2-1,\,0+7-8)=(2,0,-1)$.
Answer: (b)""", passage="pgram", pattern="Linked Item Set", theme="Fourth vertex of a parallelogram")

Q(56, r"""If angle $BCD$ is $\theta$, then what is $\cos^{2}\theta$ equal to?""",
  ["26/77", "27/77", "82/237", "83/237"], "B",
  "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 45,
  r"""Step 1: $\vec{CB}=(-1,-1,1)$ and $\vec{CD}=(3,-2,-8)$.
Step 2: $\vec{CB}\cdot\vec{CD}=-3+2-8=-9$, $|\vec{CB}|^2=3$, $|\vec{CD}|^2=77$.
Step 3: $\cos^2\theta=\dfrac{81}{3\times77}=\dfrac{27}{77}$.
Answer: (b)""", passage="pgram", pattern="Linked Item Set", theme="Angle at a vertex")

Q(57, r"""For different values of $m$, the equation $4y=mx-m+2$ represents""",
  ["parallel lines", "concurrent lines", "lines at a fixed distance from the origin of coordinates", "the same line"], "B",
  "Analytical Geometry > Straight Lines > Concurrency and Families of Lines", 25,
  r"""Step 1: Rewrite as $4y-2=m(x-1)$.
Step 2: Every line passes through $\left(1,\dfrac12\right)$ whatever $m$ is, so the lines are concurrent.
Answer: (b)""", theme="Family of lines through a point")

Q(58, r"""The equation of the locus of a point equidistant from the points $(a,b)$ and $(c,d)$ is $(a-c)x+(b-d)y+k=0$. What is the value of $k$?""",
  ["$a^{2}-c^{2}+b^{2}-d^{2}$", "$c^{2}+d^{2}-a^{2}-b^{2}$", "$(a^{2}-c^{2}+b^{2}-d^{2})/2$", "$(c^{2}+d^{2}-a^{2}-b^{2})/2$"], "D",
  "Analytical Geometry > Coordinate Geometry Basics > Locus", 35,
  r"""Step 1: $(x-a)^2+(y-b)^2=(x-c)^2+(y-d)^2$ simplifies to $2(c-a)x+2(d-b)y+a^2+b^2-c^2-d^2=0$.
Step 2: Divide by $-2$: $(a-c)x+(b-d)y+\dfrac{c^2+d^2-a^2-b^2}{2}=0$.
Answer: (d)""", theme="Perpendicular bisector as a locus")

Q(59, r"""Consider the following statements in respect of the equation $x^{2}+3y=0$:

I. The equation represents the equation to parabola that opens upwards.
II. The axis of the parabola is $x=0$.
III. The equation of the latus rectum is $4y-3=0$.

How many of the statements given above are correct?""",
  ["None", "One", "Two", "All three"], "B",
  "Analytical Geometry > Conic Sections > Parabola", 35,
  r"""Step 1: $x^2=-3y$ is $x^2=-4ay$ with $a=\dfrac34$; it opens downwards. I is wrong.
Step 2: The axis is the $y$-axis, $x=0$. II is correct.
Step 3: The focus is $(0,-3/4)$, so the latus rectum is $y=-3/4$, i.e. $4y+3=0$. III is wrong.
Answer: (b)""", pattern="Statement Count", theme="Downward parabola")

Q(60, r"""What is the sum of the intercepts of the line
$$\dfrac x{a^{2}}+\dfrac y{b^{2}}=\dfrac2{a^{2}+b^{2}}$$
on the coordinate axes?""",
  ["2", "1", r"$\dfrac12$", "$a^{2}+b^{2}$"], "A",
  "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 20,
  r"""Step 1: $x$-intercept $=\dfrac{2a^2}{a^2+b^2}$ and $y$-intercept $=\dfrac{2b^2}{a^2+b^2}$.
Step 2: Their sum is $2$.
Answer: (a)""", theme="Intercepts of a line")

Q(61, r"""Which one of the following is the perpendicular form of the straight line $\sqrt3x+2y=7$?""",
  [r"$y=-\dfrac{\sqrt3}2x+\dfrac72$", r"$\dfrac x{\left(\frac7{\sqrt3}\right)}+\dfrac y{\left(\frac72\right)}=1$",
   r"$\dfrac{\sqrt3}{\sqrt7}x+\dfrac2{\sqrt7}y=\sqrt7$", r"$\dfrac{\sqrt3}{\sqrt7}x+\dfrac2{\sqrt7}y=7$"], "C",
  "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 20,
  r"""Concept: the normal (perpendicular) form is $x\cos\alpha+y\sin\alpha=p$.
Step 1: Divide by $\sqrt{3+4}=\sqrt7$: $\dfrac{\sqrt3}{\sqrt7}x+\dfrac2{\sqrt7}y=\dfrac7{\sqrt7}=\sqrt7$.
Answer: (c)""", theme="Normal form of a line")

Q(62, r"""If the vertices $B$ and $D$ of a square $ABCD$ are $(2,3)$ and $(4,1)$ respectively, then what is the area of the square?""",
  ["2 square units", "3 square units", "4 square units", "8 square units"], "C",
  "Analytical Geometry > Coordinate Geometry Basics > Area of Triangle and Polygon", 20,
  r"""Step 1: $BD$ is a diagonal: $BD^2=4+4=8$.
Step 2: Area of a square $=\dfrac{d^2}2=4$.
Answer: (c)""", theme="Area of a square from a diagonal")

Q(63, r"""What is the value of $\sin\theta$ if $\theta$ is the acute angle between the lines whose equations are $px+qy=p+q$ and $p(x-y)+q(x+y)=2q$?""",
  [r"$\dfrac{\sqrt3}2$", r"$\dfrac34$", r"$\dfrac12$", r"$\dfrac1{\sqrt2}$"], "D",
  "Analytical Geometry > Straight Lines > Angle between Lines", 40,
  r"""Step 1: Normals: $(p,q)$ and $(p+q,\,q-p)$.
Step 2: $\cos\theta=\dfrac{p(p+q)+q(q-p)}{\sqrt{p^2+q^2}\sqrt{2(p^2+q^2)}}=\dfrac1{\sqrt2}$.
Step 3: $\theta=45^\circ$, so $\sin\theta=\dfrac1{\sqrt2}$.
Answer: (d)""", theme="Angle between two lines")

Q(64, r"""The circle $x^{2}+y^{2}-2kx-2ky+k^{2}=0$ touches the $x$-axis at $P$ and $y$-axis at $Q$. What is $PQ$ equal to?""",
  [r"$\sqrt2k$", "$2k$", r"$2\sqrt2k$", "$4k$"], "A",
  "Analytical Geometry > Circles > Tangents and Normals", 20,
  r"""Step 1: Centre $(k,k)$, radius $\sqrt{k^2+k^2-k^2}=k$.
Step 2: It touches the axes at $P(k,0)$ and $Q(0,k)$, so $PQ=\sqrt2\,k$.
Answer: (a)""", theme="Circle touching both axes")

Q(65, r"""What is the distance between the foci of the hyperbola $x^{2}-4y^{2}=1$?""",
  [r"$\sqrt3$", r"$\sqrt5$", r"$2\sqrt3$", r"$2\sqrt5$"], "B",
  "Analytical Geometry > Conic Sections > Hyperbola", 25,
  r"""Step 1: $a^2=1$, $b^2=\dfrac14$, so $c^2=a^2+b^2=\dfrac54$ and $c=\dfrac{\sqrt5}2$.
Step 2: Distance between the foci $=2c=\sqrt5$.
Answer: (b)""", theme="Foci of a hyperbola")

Q(66, r"""Let $\vec p=\vec a-\vec b$, $\vec q=\vec a+\vec b$. If $|\vec a|=|\vec b|=2$ and $\vec a\cdot\vec b=2$, then what is the value of $|\vec p\times\vec q|$?""",
  [r"$\sqrt3$", r"$\sqrt6$", r"$2\sqrt3$", r"$4\sqrt3$"], "D",
  "Vector Algebra > Vectors > Vector (Cross) Product", 40,
  r"""Step 1: $(\vec a-\vec b)\times(\vec a+\vec b)=2\,\vec a\times\vec b$.
Step 2: $|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2-(\vec a\cdot\vec b)^2=16-4=12$, so $|\vec a\times\vec b|=2\sqrt3$.
Step 3: $|\vec p\times\vec q|=4\sqrt3$.
Answer: (d)""", theme="Cross product of sum and difference")

Q(67, r"""How many of the following can be a vector perpendicular to both the vectors $2\hat i-\hat j+\hat k$ and $\hat i+\hat j+3\hat k$?

I. $4\hat i+5\hat j-3\hat k$
II. $-8\hat i-10\hat j+6\hat k$
III. $\dfrac1{50}(-4\hat i-5\hat j+3\hat k)$

Select the correct answer.""",
  ["None", "One", "Two", "All three"], "D",
  "Vector Algebra > Vectors > Vector (Cross) Product", 30,
  r"""Step 1: $(2,-1,1)\times(1,1,3)=(-4,-5,3)$.
Step 2: Each listed vector is a non-zero multiple of $(-4,-5,3)$ (by $-1$, $2$ and $\tfrac1{50}$), so each is perpendicular to both.
Answer: (d)""", pattern="Statement Count", theme="Vectors perpendicular to two vectors")

Q(68, r"""What is the area of the parallelogram whose sides are represented by the vectors $\hat i+2\hat j+3\hat k$ and $2\hat i+\hat j+2\hat k$?""",
  [r"$\dfrac12\sqrt{26}$ square units", r"$\dfrac12\sqrt{27}$ square units", r"$\sqrt{26}$ square units", r"$\sqrt{27}$ square units"], "C",
  "Vector Algebra > Vectors > Vector (Cross) Product", 25,
  r"""Step 1: $(1,2,3)\times(2,1,2)=(4-3,\,6-2,\,1-4)=(1,4,-3)$.
Step 2: Area $=|(1,4,-3)|=\sqrt{1+16+9}=\sqrt{26}$.
Answer: (c)""", theme="Area of a parallelogram")

Q(69, r"""The position vectors of the vertices $A$, $B$, $C$ and $D$ of a quadrilateral $ABCD$ are given by $3\hat i+4\hat j-2\hat k$, $4\hat i-4\hat j-3\hat k$, $2\hat i-3\hat j+2\hat k$ and $6\hat i-2\hat j+\hat k$ respectively. What is the angle between the diagonals $AC$ and $BD$ of the quadrilateral?""",
  [r"$90^\circ$", r"$75^\circ$", r"$60^\circ$", r"$45^\circ$"], "A",
  "Vector Algebra > Vectors > Scalar (Dot) Product", 30,
  r"""Step 1: $\vec{AC}=(-1,-7,4)$ and $\vec{BD}=(2,2,4)$.
Step 2: $\vec{AC}\cdot\vec{BD}=-2-14+16=0$, so the diagonals are perpendicular.
Answer: (a)""", theme="Angle between diagonals")

Q(70, r"""A force $\vec F=2\hat i-\lambda\hat j+5\hat k$ is applied at the point $A(1,2,5)$. If its moment about the point $B(-1,-2,3)$ is $16\hat i-6\hat j+2\lambda\hat k$, then what is the value of $\lambda$?""",
  ["$-2$", "0", "1", "2"], "A",
  "Vector Algebra > Vectors > Vector (Cross) Product", 45,
  r"""Step 1: Moment $=\vec{BA}\times\vec F$ with $\vec{BA}=(2,4,2)$.
Step 2: $(2,4,2)\times(2,-\lambda,5)=(20+2\lambda,\,-6,\,-2\lambda-8)$.
Step 3: $20+2\lambda=16$ gives $\lambda=-2$; check the $k$-component: $-2(-2)-8=-4=2\lambda$.
Answer: (a)""", theme="Moment of a force")

P("fpw", "Piecewise function near 0",
  r"""Let
$$f(x)=\begin{cases}\dfrac{1-\cos2x}{x^{2}}, & x<0\\[4pt] 9, & x=0\\[4pt] \dfrac{\sqrt x}{\sqrt{(16+\sqrt x)}-4}, & x>0\end{cases}$$""")

Q(71, r"""What is $\displaystyle\lim_{x\to0-}f(x)$ equal to?""",
  ["2", "4", "6", "8"], "A",
  "Differential Calculus > Limits and Continuity > Limits", 25,
  r"""Step 1: $1-\cos2x=2\sin^2x$.
Step 2: $\displaystyle\lim_{x\to0}\dfrac{2\sin^2x}{x^2}=2$.
Answer: (a)""", passage="fpw", pattern="Linked Item Set", theme="Left-hand limit")

Q(72, r"""What is $\displaystyle\lim_{x\to0+}f(x)$ equal to?""",
  ["6", "7", "8", "9"], "C",
  "Differential Calculus > Limits and Continuity > Limits", 35,
  r"""Step 1: Rationalise: $\dfrac{\sqrt x}{\sqrt{16+\sqrt x}-4}=\dfrac{\sqrt x(\sqrt{16+\sqrt x}+4)}{\sqrt x}=\sqrt{16+\sqrt x}+4$.
Step 2: As $x\to0^+$ this tends to $4+4=8$.
Answer: (c)""", passage="fpw", pattern="Linked Item Set", theme="Right-hand limit by rationalising")

P("xabsx", "The function x|x|", r"""Consider the function $f(x)=x|x|$.""")

Q(73, r"""What is $\displaystyle\lim_{x\to-1}f(x)$ equal to?""",
  ["$-1$", "0", "1", "Limit does not exist"], "A",
  "Differential Calculus > Limits and Continuity > Limits", 10,
  r"""Step 1: $f$ is continuous, so the limit is $f(-1)=(-1)\cdot1=-1$.
Answer: (a)""", passage="xabsx", pattern="Linked Item Set", theme="Limit of x|x|")

Q(74, r"""What is the area bounded by the curve $f(x)$, the $x$-axis and the lines $x=-2$ and $x=1$?""",
  [r"$\dfrac13$", r"$\dfrac23$", r"$\dfrac52$", "3"], "D",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curve and Axis", 35,
  r"""Step 1: $|f(x)|=x^2$.
Step 2: Area $=\displaystyle\int_{-2}^{1}x^2\,dx=\dfrac{1+8}{3}=3$.
Answer: (d)""", passage="xabsx", pattern="Linked Item Set", theme="Area under x|x|")

Q(75, r"""Consider the following statements:

I. The function is increasing in the interval $(-\infty,\infty)$.
II. The function is differentiable at $x=0$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Differential Calculus > Applications of Derivatives > Increasing and Decreasing Functions", 35,
  r"""Step 1: $f(x)=x^2$ for $x\ge0$ and $-x^2$ for $x<0$, so $f'(x)=2|x|\ge0$, zero only at $x=0$. $f$ is increasing on $\mathbb R$.
Step 2: Both one-sided derivatives at 0 are 0, so $f$ is differentiable there.
Answer: (c)""", passage="xabsx", pattern="2-Statement Combination", theme="Monotonicity and differentiability of x|x|")

P("frac", "The function x/(1-x)", r"""Consider the function
$$f(x)=\dfrac x{1-x}\quad(x>0,\ x\ne1)$$""")

Q(76, r"""What is $\dfrac{f(x)}{f(x+1)}$ equal to?""",
  [r"$-f(x^{2})$", r"$-f(\sqrt x)$", r"$f(x^{2})$", r"$f(x-1)$"], "A",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 35,
  r"""Step 1: $f(x+1)=\dfrac{x+1}{-x}$.
Step 2: $\dfrac{f(x)}{f(x+1)}=\dfrac x{1-x}\cdot\dfrac{-x}{x+1}=\dfrac{-x^2}{1-x^2}=-f(x^2)$.
Answer: (a)""", passage="frac", pattern="Linked Item Set", theme="Functional identity")

Q(77, r"""What is $(1-x)f(\sqrt x)+xf(\sqrt x+1)$ equal to?""",
  [r"$-f(x)$", r"$f(x)$", "$x$", "0"], "D",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 40,
  r"""Step 1: $(1-x)\cdot\dfrac{\sqrt x}{1-\sqrt x}=\sqrt x(1+\sqrt x)$.
Step 2: $x\cdot\dfrac{\sqrt x+1}{-\sqrt x}=-\sqrt x(\sqrt x+1)$.
Step 3: The sum is 0.
Answer: (d)""", passage="frac", pattern="Linked Item Set", theme="Functional expression simplification")

P("ysin", "Function with inverse sine",
  r"""Let $y=f(x)=\dfrac{x\sin^{-1}x}{\sqrt{1-x^{2}}}+\ln\sqrt{1-x^{2}}$.""")

Q(78, r"""What is the slope of the tangent to the curve $y=f(x)$ at $x=0.5$?""",
  [r"$4\pi\sqrt3/27$", r"$8\pi\sqrt3/27$", r"$4\pi$", r"$8\pi$"], "A",
  "Differential Calculus > Applications of Derivatives > Tangents and Normals", 55,
  r"""Step 1: Differentiating, the $\ln$ term cancels part of the first term and $\dfrac{dy}{dx}=\dfrac{\sin^{-1}x}{(1-x^2)^{3/2}}$.
Step 2: At $x=\dfrac12$: $\dfrac{\pi/6}{(3/4)^{3/2}}=\dfrac\pi6\cdot\dfrac8{3\sqrt3}=\dfrac{4\pi}{9\sqrt3}=\dfrac{4\pi\sqrt3}{27}$.
Answer: (a)""", passage="ysin", pattern="Linked Item Set", theme="Slope of tangent")

Q(79, r"""What is $\dfrac{d^{2}y}{dx^{2}}$ at $x=0$ equal to?""",
  ["0", "0.5", "1", "1.5"], "C",
  "Differential Calculus > Differentiation > Higher-order Derivatives", 50,
  r"""Step 1: $y'=\sin^{-1}x\,(1-x^2)^{-3/2}$.
Step 2: $y''=(1-x^2)^{-2}+3x\sin^{-1}x\,(1-x^2)^{-5/2}$.
Step 3: At $x=0$, $y''=1$.
Answer: (c)""", passage="ysin", pattern="Linked Item Set", theme="Second derivative at 0")

Q(80, r"""If $x=\sin\theta$, then what is $\dfrac{dy}{dx}$ equal to?""",
  [r"$\theta\sec\theta$", r"$\theta\sec^{2}\theta$", r"$\theta\sec^{3}\theta$", r"$2\tan\theta+\theta\sec^{2}\theta$"], "C",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 40,
  r"""Step 1: $\dfrac{dy}{dx}=\dfrac{\sin^{-1}x}{(1-x^2)^{3/2}}$.
Step 2: With $x=\sin\theta$ (principal range), $\sin^{-1}x=\theta$ and $(1-x^2)^{3/2}=\cos^3\theta$.
Step 3: $\dfrac{dy}{dx}=\theta\sec^3\theta$.
Answer: (c)""", passage="ysin", pattern="Linked Item Set", theme="Derivative in terms of theta")
