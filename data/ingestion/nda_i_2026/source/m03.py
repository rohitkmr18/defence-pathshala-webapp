from qfmt import Q, P, F

# NDA I 2026 Mathematics, Set D, booklet pages 23 to 43 (Q59-120)
L = "Linked Item Set"
S2 = "2-Statement Combination"
F(28, "Statement II holds only if |c| = 1, which the data do not force; DP key (d)")
F(43, "Condition gives A = |B - C|; the intended right angle is at B")
F(83, "With the printed points neither statement holds; DP key (d)")
F(112, "e^y = y has no real root, so the item is formally defective; DP key follows the intended substitution")
F(115, "Open vs closed intervals: DP uses strict monotonicity (open intervals)")
F(116, "Open vs closed intervals: DP uses strict monotonicity (open intervals)")

P("dice", "Questions 59-60", r"""For the next two (02) items that follow: Four dice are rolled.""")

Q(59, r"""What is the probability that getting a total of the numbers on the dice is 6?""",
  [r"$\frac{1}{216}$", r"$\frac{1}{324}$", r"$\frac{5}{648}$", r"$\frac{7}{648}$"], "C",
  "Probability > Classical Probability > Events and Sample Space", 45,
  r"""Step 1: Total outcomes $=6^4=1296$.
Step 2: Solutions of $a+b+c+d=6$ with each value at least 1: $\binom{5}{3}=10$.
Step 3: $\dfrac{10}{1296}=\dfrac{5}{648}$.
Answer: (c)""", pattern=L, passage="dice", theme="Sum of four dice equal to 6")

Q(60, r"""What is the probability that getting a total of the numbers on the dice is at least 23?""",
  [r"$\frac{1}{1296}$", r"$\frac{1}{432}$", r"$\frac{1}{324}$", r"$\frac{5}{1296}$"], "D",
  "Probability > Classical Probability > Events and Sample Space", 35,
  r"""Step 1: Total 24 needs all sixes: 1 way. Total 23 needs three sixes and one five: 4 ways.
Step 2: $\dfrac{5}{1296}$.
Answer: (d)""", pattern=L, passage="dice", theme="Sum of four dice at least 23")

Q(61, r"""Let two lines of regression be $x+y+11=0$ and $2x+3y+4=0$ for some data. What is the value of correlation coefficient between $x$ and $y$?""",
  [r"$-\sqrt{\frac{2}{3}}$", r"$-\sqrt{\frac{1}{6}}$", r"$\sqrt{\frac{2}{3}}$", r"$\sqrt{\frac{1}{6}}$"], "A",
  "Statistics > Correlation > Correlation Coefficient", 45,
  r"""Step 1: Taking $x+y+11=0$ as $y$ on $x$ gives $b_{yx}=-1$ and $2x+3y+4=0$ as $x$ on $y$ gives $b_{xy}=-\dfrac32$; the product $\dfrac32>1$ is impossible.
Step 2: So $x+y+11=0$ is $x$ on $y$ ($b_{xy}=-1$) and $2x+3y+4=0$ is $y$ on $x$ ($b_{yx}=-\dfrac23$).
Step 3: $r^2=\dfrac23$; both coefficients are negative, so $r=-\sqrt{\dfrac23}$.
Answer: (a)""", theme="Correlation from two regression lines")

Q(62, r"""If the mean of 20 observations, namely $x_{1},x_{2},x_{3},\ldots,x_{20}$ is 1.414, then what is the value of $\sum_{i=1}^{20}100(2x_{i}+4)$?""",
  ["24168", "20828", "15248", "13656"], "D",
  "Statistics > Measures of Central Tendency > Mean", 15,
  r"""Step 1: $\sum x_i=20\times1.414=28.28$.
Step 2: $\sum100(2x_i+4)=100(2\times28.28+80)=100\times136.56=13656$.
Answer: (d)""", theme="Sum of a linear transform of observations")

Q(63, r"""In an entrance test there are multiple choice questions. There are four options for each question, of which only one is correct. The probability that a student knows the answer to a question is 90%. If he gets the correct answer to a question, then what is the probability that he was guessing?""",
  [r"$\frac{37}{40}$", r"$\frac{36}{37}$", r"$\frac{1}{37}$", r"$\frac{1}{40}$"], "C",
  "Probability > Conditional Probability > Bayes' Theorem", 35,
  r"""Step 1: $P(\text{correct})=0.9\times1+0.1\times\dfrac14=0.925$.
Step 2: $P(\text{guess}\mid\text{correct})=\dfrac{0.025}{0.925}=\dfrac{1}{37}$.
Answer: (c)""", theme="Bayes' theorem for guessing in an MCQ test")

Q(64, r"""Consider the following statements in respect of the events $A$, $B$, $C$:

I. $(A\cup B\cup C)\cap(\bar{A}\cap\bar{B}\cap\bar{C})$ is an impossible event.
II. $(A\cap B\cap C)\cap(\bar{A}\cup\bar{B}\cup\bar{C})$ is a possible event.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "A",
  "Probability > Classical Probability > Events and Sample Space", 30,
  r"""Step 1: $\bar A\cap\bar B\cap\bar C$ is the complement of $A\cup B\cup C$, so I is the intersection of an event with its complement: impossible. I is correct.
Step 2: $\bar A\cup\bar B\cup\bar C$ is the complement of $A\cap B\cap C$, so II is also the empty event, not a possible one. II is wrong.
Answer: (a)""", pattern=S2, theme="Events intersected with their complements")

Q(65, r"""The standard deviation of 100 observations is 10. If 5 is multiplied to each of the observations, then what is the new standard deviation?""",
  ["20", "25", "40", "50"], "D",
  "Statistics > Measures of Dispersion > Variance and Standard Deviation", 10,
  r"""Step 1: Multiplying every observation by $k$ multiplies the standard deviation by $|k|$.
Step 2: $5\times10=50$.
Answer: (d)""", theme="Effect of scaling on standard deviation")

Q(66, r"""For a Binomial distribution with mean 6 and standard deviation $\sqrt{2}$, what is the value of $P(X=0)$?""",
  [r"$\left(\frac{1}{3}\right)^{9}$", r"$\left(\frac{2}{3}\right)^{9}$", r"$\frac{1}{3}\left(\frac{2}{3}\right)^{8}$", r"$\frac{2}{3}\left(\frac{1}{3}\right)^{8}$"], "A",
  "Probability > Probability Distributions > Binomial Distribution", 30,
  r"""Step 1: $np=6$ and $npq=2$ give $q=\dfrac13$, $p=\dfrac23$, $n=9$.
Step 2: $P(X=0)=q^n=\left(\dfrac13\right)^9$.
Answer: (a)""", theme="Binomial parameters from mean and SD")

Q(67, r"""If the random variable $X$ has mean 3 and standard deviation 5, then what is the variance of the random variable $Y=2X-5$?""",
  ["15", "40", "45", "100"], "D",
  "Probability > Probability Distributions > Random Variable and Expectation", 15,
  r"""Step 1: $\mathrm{Var}(aX+b)=a^2\mathrm{Var}(X)$.
Step 2: $\mathrm{Var}(Y)=4\times25=100$.
Answer: (d)""", theme="Variance of a linear function of a random variable")

Q(68, r"""Three events $A$, $B$ and $C$ are such that $A$ and $B$ are disjoint, $A$ and $C$ are independent, $B$ and $C$ are independent. If $4P(A)=2P(B)=P(C)$ and $P(A\cup B\cup C)=5P(A)$, then what is the value of $P(C)$?""",
  [r"$\frac{5}{6}$", r"$\frac{1}{3}$", r"$\frac{1}{6}$", r"$\frac{2}{3}$"], "D",
  "Probability > Conditional Probability > Conditional Probability and Independence", 55,
  r"""Step 1: Let $P(C)=x$, so $P(A)=\dfrac x4$, $P(B)=\dfrac x2$; $P(A\cap B)=P(A\cap B\cap C)=0$.
Step 2: $P(A\cup B\cup C)=\dfrac x4+\dfrac x2+x-\dfrac{x^2}{4}-\dfrac{x^2}{2}=\dfrac{7x}{4}-\dfrac{3x^2}{4}$.
Step 3: Setting this equal to $\dfrac{5x}{4}$ gives $\dfrac{x}{2}=\dfrac{3x^2}{4}$, so $x=\dfrac23$.
Answer: (d)""", theme="Union of disjoint and independent events")

P("freq", "Questions 69-70", r"""For the next two (02) items that follow: The frequency distribution of marks obtained by 100 students in a certain subject is given below:

| Marks | 0-10 | 10-20 | 20-30 | 30-40 |
|---|---|---|---|---|
| No. of students | 10 | 20 | f | 40 |""")

_FR = r"Since the total is 100, $f=30$. Mid-values 5, 15, 25, 35 give mean $=\dfrac{50+300+750+1400}{100}=25$."

Q(69, r"""What is the mean deviation about the arithmetic mean?""",
  ["5.5", "6", "6.5", "8"], "D",
  "Statistics > Measures of Dispersion > Range and Mean Deviation", 35,
  _FR + r"""
Step 1: $\sum f|x-25|=10(20)+20(10)+30(0)+40(10)=800$.
Step 2: Mean deviation $=\dfrac{800}{100}=8$.
Answer: (d)""", pattern=L, passage="freq", theme="Mean deviation of a grouped distribution")

Q(70, r"""What is the standard deviation?""",
  ["8.5", "9", "9.5", "10"], "D",
  "Statistics > Measures of Dispersion > Variance and Standard Deviation", 35,
  _FR + r"""
Step 1: $\sum f(x-25)^2=10(400)+20(100)+0+40(100)=10000$.
Step 2: Variance $=100$, so SD $=10$.
Answer: (d)""", pattern=L, passage="freq", theme="Standard deviation of a grouped distribution")

Q(71, r"""If the highest degree coefficient is equal to 1, then what is the total number of quadratic equations which are unchanged on squaring their roots?""",
  ["6", "4", "2", "None"], "B",
  "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 55,
  r"""Step 1: Either $\alpha^2=\alpha$ and $\beta^2=\beta$, giving root pairs $(0,0)$, $(1,1)$, $(0,1)$: equations $x^2=0$, $(x-1)^2=0$, $x^2-x=0$.
Step 2: Or $\alpha^2=\beta$, $\beta^2=\alpha$ with $\alpha\neq\beta$: $\alpha^3=1$, so $\{\alpha,\beta\}=\{\omega,\omega^2\}$, giving $x^2+x+1=0$.
Step 3: Total 4.
Answer: (b)""", theme="Monic quadratics invariant under squaring roots")

Q(72, r"""Let $\alpha$ and $\beta$ be the roots of the quadratic equation $x^{2}-2bx+c^{2}=0$ where $b$, $c$ are positive real numbers. Let $A$ be the arithmetic mean of $\alpha$ and $\beta$; and $G$ be the geometric mean of $\alpha$ and $\beta$. What are the roots of the quadratic equation $x^{2}-(b+c)x+bc=0$?""",
  ["A, G", "2A, G", "A, 2G", "2A, 2G"], "A",
  "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 25,
  r"""Step 1: $\alpha+\beta=2b$ and $\alpha\beta=c^2$, so $A=b$ and $G=c$.
Step 2: $x^2-(b+c)x+bc=(x-b)(x-c)$ has roots $b=A$ and $c=G$.
Answer: (a)""", theme="AM and GM of roots")

Q(73, r"""If $1-\log_{10}2=\log_{10}(5^{x}+4^{x}+3^{x}+2^{x}+1)$, then what is a value of $x$?""",
  ["10", "5", "1", "0"], "D",
  "Algebra > Logarithms and Indices > Laws of Logarithms", 20,
  r"""Step 1: $1-\log_{10}2=\log_{10}5$, so $5^x+4^x+3^x+2^x+1=5$.
Step 2: $x=0$ gives $1+1+1+1+1=5$.
Answer: (d)""", theme="Logarithmic equation with a sum of powers")

Q(74, r"""Let $f(x)=\begin{vmatrix} 3x^{2} & \cos x & -\sin x\\ 6 & -1 & 0\\ q & q^{2} & q^{3}\end{vmatrix}$ where $q$ is any constant, then what is $\frac{d^{2}}{dx^{2}}(f(x))$ at $x=0$ equal to?""",
  ["$-1$", "0", "1", "q"], "B",
  "Differential Calculus > Differentiation > Higher-order Derivatives", 45,
  r"""Step 1: Only the first row depends on $x$, so $f''(x)$ is the determinant with first row $(6,-\cos x,\sin x)$.
Step 2: At $x=0$ this row is $(6,-1,0)$, identical to the second row, so the determinant is $0$.
Answer: (b)""", theme="Second derivative of a determinant function")

Q(75, r"""If $\begin{vmatrix} a-b & p-q & x-y\\ b-c & q-r & y-z\\ c-a & r-p & z-x\end{vmatrix}=k\begin{vmatrix} a & b & c\\ p & q & r\\ x & y & z\end{vmatrix}$, then what is the value of $k$?""",
  ["$-1$", "0", r"$\frac{1}{2}$", "1"], "B",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Step 1: Adding all three rows of the left determinant gives a zero row, so it equals $0$.
Step 2: For this to hold for all entries, $k=0$.
Answer: (b)""", theme="Determinant with cyclic differences")

Q(76, r"""If $p$, $q$, $r$ are the cube roots of unity, then what is $\begin{vmatrix} p^{2}+q^{2} & r^{2} & r^{2}\\ p^{2} & q^{2}+r^{2} & p^{2}\\ q^{2} & q^{2} & r^{2}+p^{2}\end{vmatrix}$ equal to?""",
  ["$-1$", "0", "1", "4"], "D",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 50,
  r"""Concept: $\begin{vmatrix} b+c & a & a\\ b & c+a & b\\ c & c & a+b\end{vmatrix}=4abc$.
Step 1: Here $a=r^2$, $b=p^2$, $c=q^2$, so the value is $4p^2q^2r^2=4(pqr)^2$.
Step 2: The product of the cube roots of unity is $1$, so the value is $4$.
Answer: (d)""", theme="Standard 4abc determinant with cube roots of unity")

Q(77, r"""If $A$ is a square matrix such that $|A|=-2$, then $|AA^{T}|$, where $A^{T}$ is the transpose of $A$, is equal to""",
  ["$-4$", "1", "2", "4"], "D",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 10,
  r"""Step 1: $|AA^T|=|A||A^T|=|A|^2$.
Step 2: $(-2)^2=4$.
Answer: (d)""", theme="Determinant of A times its transpose")

Q(78, r"""Consider the following statements:

I. If $n\times n$ $(n>1)$ matrix is symmetric, then its inverse is also a symmetric matrix.
II. If $n\times n$ $(n>1)$ matrix is singular, then its adjoint is also a singular matrix.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 30,
  r"""Step 1: $(A^{-1})^T=(A^T)^{-1}=A^{-1}$ for symmetric invertible $A$, so I is correct.
Step 2: $|\operatorname{adj}A|=|A|^{n-1}=0$ when $|A|=0$ and $n>1$, so II is correct.
Answer: (c)""", pattern=S2, theme="Inverse of symmetric and adjoint of singular matrices")

Q(79, r"""If $M=\begin{bmatrix}2&0&0\\0&2&0\\0&0&2\end{bmatrix}$, then what is the value of $|M|\,|\operatorname{adj}M|$?""",
  ["8", "64", "256", "512"], "D",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 20,
  r"""Step 1: $|M|=8$ and $|\operatorname{adj}M|=|M|^{2}=64$.
Step 2: Product $=512$.
Answer: (d)""", theme="Determinant of an adjoint")

Q(80, r"""If $M_{k}=\begin{bmatrix}k & k-1\\ k-1 & k\end{bmatrix}$ where $k$ is a natural number, then what is $|M_{1}|+|M_{2}|+|M_{3}|+\ldots+|M_{50}|$ equal to?""",
  ["50", "1250", "2500", "5000"], "C",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 25,
  r"""Step 1: $|M_k|=k^2-(k-1)^2=2k-1$.
Step 2: $\sum_{k=1}^{50}(2k-1)=50^2=2500$.
Answer: (c)""", theme="Sum of determinants forming odd numbers")

P("lines", "Questions 81-82", r"""For the next two (02) items that follow: The equation of a straight line which passes through the origin and makes an angle $\alpha$ $(0\leq\alpha\leq90^{\circ})$ with the line $L: x+\sqrt{3}y+3\sqrt{3}=0$ is $x-\sqrt{3}y=0$.""")

Q(81, r"""What is the value of $\alpha$?""",
  [r"$30^{\circ}$", r"$45^{\circ}$", r"$60^{\circ}$", r"$90^{\circ}$"], "C",
  "Analytical Geometry > Straight Lines > Angle between Lines", 25,
  r"""Step 1: Slopes are $-\dfrac{1}{\sqrt3}$ and $\dfrac{1}{\sqrt3}$.
Step 2: $\tan\alpha=\left|\dfrac{\frac{1}{\sqrt3}+\frac{1}{\sqrt3}}{1-\frac13}\right|=\sqrt3$, so $\alpha=60^\circ$.
Answer: (c)""", pattern=L, passage="lines", theme="Angle between two lines")

Q(82, r"""What is the angle made by the line $L$ with positive direction of y-axis?""",
  [r"$30^{\circ}$", r"$45^{\circ}$", r"$60^{\circ}$", r"$90^{\circ}$"], "C",
  "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 30,
  r"""Step 1: $L$ has slope $-\dfrac{1}{\sqrt3}$, so its inclination with the x-axis is $150^\circ$.
Step 2: The direction $(-\sqrt3,1)$ of $L$ makes $\cos^{-1}\dfrac12=60^\circ$ with the positive y-axis.
Answer: (c)""", pattern=L, passage="lines", theme="Angle of a line with the y-axis")

P("pqrs", "Questions 83-84", r"""For the next two (02) items that follow: $P(-2,-3,5)$, $Q(4,-1,5)$, $R(6,-4,8)$ and $S(2,-6,10)$ are four points.""")

Q(83, r"""Consider the following statements:

I. $PQ$ is parallel to $RS$.
II. $PR$ is perpendicular to $QS$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Analytical Geometry > Three-dimensional Geometry > Direction Cosines and Direction Ratios", 40,
  r"""Step 1: $\overrightarrow{PQ}=(6,2,0)$ and $\overrightarrow{RS}=(-4,-2,2)$ are not proportional, so I is false.
Step 2: $\overrightarrow{PR}=(8,-1,3)$, $\overrightarrow{QS}=(-2,-5,5)$; dot product $=-16+5+15=4\neq0$, so II is false.
Answer: (d)""", pattern=S2, passage="pqrs", theme="Parallel and perpendicular segments in space")

Q(84, r"""What is $(PQ^{2}+2QS^{2}-2PR^{2})$ equal to?""",
  ["$-1$", "0", "1", "2"], "B",
  "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 25,
  r"""Step 1: $PQ^2=36+4+0=40$, $QS^2=4+25+25=54$, $PR^2=64+1+9=74$.
Step 2: $40+108-148=0$.
Answer: (b)""", pattern=L, passage="pqrs", theme="Distances between points in space")

P("plane", "Questions 85-86", r"""For the next two (02) items that follow: A line $L$ passing through the point $(-1,2,-3)$ is perpendicular to the plane $P$ given by $2x+3y+z+5=0$.""")

Q(85, r"""What is the equation of the line $L$?""",
  [r"$1-x=y+2=3-z$", r"$-(x+1)=y-2=z+3$", r"$3x+3=2y-4=6z+18$", r"$3x-3=2y+4=6z-18$"], "C",
  "Analytical Geometry > Three-dimensional Geometry > Line in Space", 30,
  r"""Step 1: The direction of $L$ is the plane's normal $(2,3,1)$: $\dfrac{x+1}{2}=\dfrac{y-2}{3}=\dfrac{z+3}{1}$.
Step 2: Multiplying through by 6 gives $3x+3=2y-4=6z+18$.
Answer: (c)""", pattern=L, passage="plane", theme="Line through a point perpendicular to a plane")

Q(86, r"""What are the direction ratios of a line $M$ parallel to the plane $P$?""",
  [r"$\langle -3,2,1\rangle$", r"$\langle 3,2,-6\rangle$", r"$\langle 1,3,2\rangle$", r"$\langle 2,2,-10\rangle$"], "D",
  "Analytical Geometry > Three-dimensional Geometry > Equation of a Plane", 20,
  r"""Step 1: A line parallel to the plane is perpendicular to its normal $(2,3,1)$.
Step 2: $(2,2,-10)\cdot(2,3,1)=4+6-10=0$; the other options give non-zero dot products.
Answer: (d)""", pattern=L, passage="plane", theme="Line parallel to a plane")

P("xyz", "Questions 87-88", r"""For the next two (02) items that follow: Let $X(a,p)$, $Y(b,q)$ and $Z(c,r)$ be the points such that $a$, $b$ and $c$ are in AP.""")

Q(87, r"""If $p$, $q$ and $r$ are in AP, then the points $X$, $Y$ and $Z$ are""",
  ["on a straight line", "on a circle", "on a parabola", "the vertices of a triangle"], "A",
  "Analytical Geometry > Coordinate Geometry Basics > Distance and Section Formula", 20,
  r"""Step 1: $2b=a+c$ and $2q=p+r$, so $Y$ is the midpoint of $XZ$.
Step 2: The three points are collinear.
Answer: (a)""", pattern=L, passage="xyz", theme="Collinearity from AP coordinates")

Q(88, r"""If $p$, $q$ and $r$ are not in AP and $b=c$, then the line joining the points $X$, $Y$ and $Z$ is parallel to""",
  ["y-axis", "x-axis", "y = x", "y = $-x$"], "A",
  "Analytical Geometry > Straight Lines > Slope and Equations of a Line", 30,
  r"""Step 1: $a$, $b$, $c$ in AP with $b=c$ forces common difference $0$, so $a=b=c$.
Step 2: All three points have the same x-coordinate and lie on the line $x=a$, which is parallel to the y-axis.
Answer: (a)""", pattern=L, passage="xyz", theme="Points with equal abscissae")

P("circle", "Questions 89-90", r"""For the next two (02) items that follow: Consider the points $A(0,2)$, $B(2,3)$, $C(4,5)$ and $D(0,k)$.""")

_C = r"Circle through $A$, $B$, $C$: $x^2+y^2+2gx+2fy+c=0$ gives $g=\dfrac52$, $f=-\dfrac{19}{2}$, $c=34$, i.e. $x^2+y^2+5x-19y+34=0$."

Q(89, r"""If the points lie on a circle, then what is/are the possible value(s) of $k$?""",
  ["2 only", "5 only", "2, 17", "5, 17"], "C",
  "Analytical Geometry > Circles > Equation and Parameters", 45,
  _C + r"""
Step 1: Put $D(0,k)$: $k^2-19k+34=0$, so $k=2$ or $k=17$.
Answer: (c)""", pattern=L, passage="circle", theme="Concyclic points")

Q(90, r"""If a circle is drawn through $A$, $B$ and $D$, then what is the diameter of the circle?""",
  [r"$3\sqrt{10}$", r"$5\sqrt{10}$", r"$3\sqrt{12}$", r"$5\sqrt{12}$"], "B",
  "Analytical Geometry > Circles > Equation and Parameters", 45,
  _C + r"""
Step 1: $D$ is on this circle (previous item), so the circle through $A$, $B$, $D$ is the same circle.
Step 2: $r^2=g^2+f^2-c=\dfrac{25}{4}+\dfrac{361}{4}-34=62.5$, so the diameter is $2\sqrt{62.5}=\sqrt{250}=5\sqrt{10}$.
Answer: (b)""", pattern=L, passage="circle", theme="Diameter of the circle through three points")

Q(91, r"""If $f(x)$ is differentiable at $x=a$, then consider the following statements:

I. $f(x)$ is continuous at $x=a$
II. $\lim_{x\to a}f(x)=f(a)$

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Differential Calculus > Limits and Continuity > Continuity", 10,
  r"""Step 1: Differentiability at $a$ implies continuity at $a$.
Step 2: Continuity at $a$ means exactly $\lim_{x\to a}f(x)=f(a)$. Both statements hold.
Answer: (c)""", pattern=S2, theme="Differentiability implies continuity")

Q(92, r"""What is $\lim_{x\to1}\frac{x^{(n^{2}-1)}-1}{x^{(n+1)}-1}$ equal to, where $n>1$ is a natural number?""",
  ["0", "1", "$n-1$", "$n+1$"], "C",
  "Differential Calculus > Limits and Continuity > Limits", 20,
  r"""Step 1: $\lim_{x\to1}\dfrac{x^m-1}{x^k-1}=\dfrac mk$.
Step 2: $\dfrac{n^2-1}{n+1}=n-1$.
Answer: (c)""", theme="Limit of a ratio of power differences")

Q(93, r"""What is $\lim_{x\to0}\frac{10^{\sin x}-1}{\tan x}$ equal to?""",
  ["0", "1", r"$\ln 10$", r"$\log_{10}e$"], "C",
  "Differential Calculus > Limits and Continuity > Limits", 20,
  r"""Step 1: $\dfrac{10^{\sin x}-1}{\tan x}=\dfrac{10^{\sin x}-1}{\sin x}\cdot\cos x$.
Step 2: As $x\to0$, this tends to $\ln10\times1=\ln10$.
Answer: (c)""", theme="Exponential limit")

Q(94, r"""What is the derivative of $\frac{x}{|x|}$ with respect to $x$, where $x<0$?""",
  ["$-1$", "0", "1", "x"], "B",
  "Differential Calculus > Differentiation > Standard Derivatives and Rules", 10,
  r"""Step 1: For $x<0$, $\dfrac{x}{|x|}=-1$, a constant.
Step 2: Its derivative is $0$.
Answer: (b)""", theme="Derivative of x/|x|")

Q(95, r"""Consider the following statements in respect of the function $f(x)=x$ in the interval $(-1,1)$:

I. The function attains maximum value.
II. The function attains minimum value.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 20,
  r"""Step 1: On the open interval $(-1,1)$, $f(x)=x$ approaches $1$ and $-1$ but never reaches them.
Step 2: So it has neither a maximum nor a minimum value there.
Answer: (d)""", pattern=S2, theme="Extrema on an open interval")

Q(96, r"""If $\sqrt[4]{y}=x+\sqrt{x^{2}+4}$, then what is $\sqrt{x^{2}+4}\,\frac{dy}{dx}$ equal to?""",
  [r"$\frac{y}{4}$", "y", "2y", "4y"], "D",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 40,
  r"""Step 1: Let $u=x+\sqrt{x^2+4}$; then $\dfrac{du}{dx}=1+\dfrac{x}{\sqrt{x^2+4}}=\dfrac{u}{\sqrt{x^2+4}}$.
Step 2: $y=u^4$, so $\dfrac{dy}{dx}=4u^3\dfrac{du}{dx}=\dfrac{4u^4}{\sqrt{x^2+4}}=\dfrac{4y}{\sqrt{x^2+4}}$.
Step 3: $\sqrt{x^2+4}\,\dfrac{dy}{dx}=4y$.
Answer: (d)""", theme="Derivative of a power of x + sqrt(x^2 + 4)")

Q(97, r"""What is the length of the longest interval in which the function $f(x)=2\cos^{2}x-1$ is decreasing?""",
  [r"$2\pi$", r"$\pi$", r"$\frac{\pi}{2}$", r"$\frac{\pi}{4}$"], "C",
  "Differential Calculus > Applications of Derivatives > Increasing and Decreasing Functions", 25,
  r"""Step 1: $f(x)=\cos2x$ and $f'(x)=-2\sin2x<0$ when $\sin2x>0$, i.e. on $\left(k\pi,k\pi+\dfrac{\pi}{2}\right)$.
Step 2: The longest such interval has length $\dfrac{\pi}{2}$.
Answer: (c)""", theme="Interval of decrease of cos 2x")

Q(98, r"""If $A$ and $B$ are acute angles such that $2A+2B=\pi$, then what is the maximum value of $\sin A\cdot\sin B$?""",
  [r"$\frac{1}{2}$", r"$\frac{1}{4}$", r"$\frac{\sqrt{3}}{4}$", "1"], "A",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 20,
  r"""Step 1: $A+B=\dfrac{\pi}{2}$, so $\sin B=\cos A$.
Step 2: $\sin A\sin B=\dfrac{\sin2A}{2}\le\dfrac12$, with equality at $A=B=\dfrac{\pi}{4}$.
Answer: (a)""", theme="Maximum of sin A sin B with A + B = pi/2")

Q(99, r"""What is the solution of the differential equation $\cos\left(\frac{dy}{dx}\right)=p$ when $y(0)=q$?""",
  [r"$\cos\left(\frac{y-q}{x}\right)=p$", r"$\cos\left(\frac{y-p}{x}\right)=q$", r"$\cos^{-1}\left(\frac{y-q}{x}\right)=p$", r"$\cos^{-1}\left(\frac{y-p}{x}\right)=q$"], "A",
  "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 25,
  r"""Step 1: $\dfrac{dy}{dx}=\cos^{-1}p$, a constant, so $y=x\cos^{-1}p+q$ using $y(0)=q$.
Step 2: $\dfrac{y-q}{x}=\cos^{-1}p$, i.e. $\cos\left(\dfrac{y-q}{x}\right)=p$.
Answer: (a)""", theme="Differential equation with a constant slope")

Q(100, r"""If $2f(x)+f(1-x)=x$, then what is $f(x)$ equal to?""",
  ["$x-1$", r"$x-\left(\frac{1}{3}\right)$", "2x", "$2x-1$"], "B",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 25,
  r"""Step 1: Replacing $x$ by $1-x$: $2f(1-x)+f(x)=1-x$.
Step 2: Twice the original minus this: $3f(x)=2x-(1-x)=3x-1$, so $f(x)=x-\dfrac13$.
Answer: (b)""", theme="Functional equation in f(x) and f(1 - x)")

P("pf", "Questions 101-102", r"""For the next two (02) items that follow: Let $\int\frac{\sin\theta\,d\theta}{(2+\cos\theta)(3+4\cos\theta)}=A\ln|2+\cos\theta|+B\ln|3+4\cos\theta|$""")

_PF = r"""Step 1: Put $t=\cos\theta$: the integral is $-\displaystyle\int\frac{dt}{(2+t)(3+4t)}$.
Step 2: $\dfrac{1}{(2+t)(3+4t)}=\dfrac{-1/5}{2+t}+\dfrac{4/5}{3+4t}$.
Step 3: Integrating: $\dfrac15\ln|2+\cos\theta|-\dfrac15\ln|3+4\cos\theta|$, so $A=\dfrac15$ and $B=-\dfrac15$."""

Q(101, r"""What is the value of $A$?""",
  [r"$-\frac{2}{5}$", r"$-\frac{1}{5}$", r"$\frac{1}{5}$", r"$\frac{2}{5}$"], "C",
  "Integral Calculus and Differential Equations > Indefinite Integration > Substitution", 45,
  _PF + "\nAnswer: (c)", pattern=L, passage="pf", theme="Partial fractions after substitution t = cos theta")

Q(102, r"""What is the value of $B$?""",
  [r"$-\frac{2}{5}$", r"$-\frac{1}{5}$", r"$\frac{1}{5}$", r"$\frac{2}{5}$"], "B",
  "Integral Calculus and Differential Equations > Indefinite Integration > Substitution", 45,
  _PF + "\nAnswer: (b)", pattern=L, passage="pf", theme="Partial fractions after substitution t = cos theta")

P("fg", "Questions 103-104", r"""For the next two (02) items that follow: Let $f(x)=\sin x$ and $g(x)-f(x)=f(4-x)$.""")

_FG = r"""Step 1: $g(x)=f(x)+f(4-x)$ and $g(4-x)=g(x)$.
Step 2: Let $I=\displaystyle\int_0^4\frac{f(x)}{g(x)}dx$ and $J=\displaystyle\int_0^4\frac{f(4-x)}{g(x)}dx$. Then $I+J=\displaystyle\int_0^4 1\,dx=4$, and the substitution $x\to4-x$ shows $I=J$, so $I=J=2$."""

Q(103, r"""What is $\int_{0}^{4}\frac{f(x)}{g(x)}dx$ equal to?""",
  ["0", "1", "2", "4"], "C",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 40,
  _FG + "\nAnswer: (c)", pattern=L, passage="fg", theme="King's property of definite integrals")

Q(104, r"""What is $\int_{0}^{4}\frac{f(4-x)}{g(4-x)}dx$ equal to?""",
  ["0", "1", "2", "4"], "C",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 40,
  _FG + r"""
Step 3: Since $g(4-x)=g(x)$, this integral is $J=2$.
Answer: (c)""", pattern=L, passage="fg", theme="King's property of definite integrals")

P("pw", "Questions 105-106", r"""For the next two (02) items that follow: Let $f(x)=\begin{cases} ax(x-1), & x<1\\ x-1, & 1\leq x\leq 3\\ px^{2}+qx+2, & x>3\end{cases}$

Given that $f(x)$ is continuous for all $x$ but not differentiable at $x=1$. Further $f'(x)$ is continuous at $x=3$.""")

_PW = r"""Step 1: Continuity at $x=3$: $9p+3q+2=2$, so $q=-3p$.
Step 2: Equal derivatives at $x=3$: $6p+q=1$, so $3p=1$, $p=\dfrac13$ and $q=-1$."""

Q(105, r"""What is the value of $p$?""",
  ["$-1$", r"$-\frac{1}{3}$", r"$\frac{1}{3}$", "1"], "C",
  "Differential Calculus > Limits and Continuity > Continuity", 35,
  _PW + "\nAnswer: (c)", pattern=L, passage="pw", theme="Piecewise function continuous with continuous derivative")

Q(106, r"""What is the value of $q$?""",
  ["$-1$", r"$-\frac{1}{3}$", r"$\frac{1}{3}$", "1"], "A",
  "Differential Calculus > Limits and Continuity > Continuity", 35,
  _PW + "\nAnswer: (a)", pattern=L, passage="pw", theme="Piecewise function continuous with continuous derivative")

P("de", "Questions 107-108", r"""For the next two (02) items that follow: Consider the differential equation $e^{x+y}\frac{dy}{dx}=e^{x-y}$:""")

Q(107, r"""What is $\frac{d^{2}y}{dx^{2}}\left(\frac{dx}{dy}\right)^{2}$ equal to?""",
  ["$-2$", "$-1$", "0", "2"], "A",
  "Differential Calculus > Differentiation > Higher-order Derivatives", 40,
  r"""Step 1: $\dfrac{dy}{dx}=e^{-2y}$.
Step 2: $\dfrac{d^2y}{dx^2}=-2e^{-2y}\dfrac{dy}{dx}=-2e^{-4y}$, and $\left(\dfrac{dx}{dy}\right)^2=e^{4y}$.
Step 3: Product $=-2$.
Answer: (a)""", pattern=L, passage="de", theme="Second derivative from a separable equation")

Q(108, r"""What is the solution of the differential equation with $y(0)=0$?""",
  [r"$y=\ln(2x+1)$", r"$y=\ln(2x-1)$", r"$2y=\ln(2x+1)$", r"$2y=\ln(2x-1)$"], "C",
  "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 30,
  r"""Step 1: $e^{2y}dy=dx$, so $\dfrac{e^{2y}}{2}=x+C$.
Step 2: $y(0)=0$ gives $C=\dfrac12$, so $e^{2y}=2x+1$ and $2y=\ln(2x+1)$.
Answer: (c)""", pattern=L, passage="de", theme="Separable differential equation with an initial condition")

P("fgp", "Questions 109-110", r"""For the next two (02) items that follow: Let $f(x)=\tan(x^{2})$ and $g(x)=x|x|$ for $|x|<\sqrt{\frac{\pi}{2}}$.""")

Q(109, r"""If $p(x)=f(x)g(x)$, then which of the following statements is/are correct?

I. $p(x)$ is continuous at $x=0$.
II. $p(x)$ is differentiable at $x=0$.

Select the answer using the code given below:""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Differential Calculus > Limits and Continuity > Continuity", 40,
  r"""Step 1: $f$ and $g$ are continuous at $0$, so $p$ is continuous there.
Step 2: $\dfrac{p(h)-p(0)}{h}=\dfrac{\tan(h^2)\,h|h|}{h}=\tan(h^2)|h|\to0$, so $p$ is differentiable at $0$ with $p'(0)=0$.
Answer: (c)""", pattern=S2, passage="fgp", theme="Product of tan(x^2) and x|x| at 0")

Q(110, r"""If $q(x)=f\circ g(x)$, then which of the following statements is/are correct?

I. $q(x)$ is continuous at $x=0$.
II. $q(x)$ is differentiable at $x=0$.

Select the answer using the code given below:""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Differential Calculus > Limits and Continuity > Continuity", 40,
  r"""Step 1: $q(x)=\tan\big((x|x|)^2\big)=\tan(x^4)$.
Step 2: $\tan(x^4)$ is continuous and differentiable at $0$ (derivative $4x^3\sec^2(x^4)=0$ there).
Answer: (c)""", pattern=S2, passage="fgp", theme="Composite of tan(x^2) and x|x| at 0")

P("exy", "Questions 111-112", r"""For the next two (02) items that follow: Let $(e^{y})^{x}-y=0$, where $y$ is a function of $x$ whose domain is $(0,10]$.""")

Q(111, r"""What is $\frac{dy}{dx}$ equal to?""",
  [r"$\frac{y}{1-xy}$", r"$\frac{y}{1+xy}$", r"$\frac{y^{2}}{1-xy}$", r"$\frac{y^{2}}{1+xy}$"], "C",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 40,
  r"""Step 1: $e^{xy}=y$, so $xy=\ln y$.
Step 2: Differentiating: $y+x\dfrac{dy}{dx}=\dfrac1y\dfrac{dy}{dx}$, so $\dfrac{dy}{dx}\left(\dfrac1y-x\right)=y$.
Step 3: $\dfrac{dy}{dx}=\dfrac{y^2}{1-xy}$.
Answer: (c)""", pattern=L, passage="exy", theme="Implicit differentiation of e^(xy) = y")

Q(112, r"""What is $\frac{dy}{dx}$ equal to, given that $y=y_{0}$ when $x=1$?""",
  [r"$-\frac{y_{0}}{1+e^{y_{0}}}$", r"$-\frac{y_{0}e^{y_{0}}}{1+e^{y_{0}}}$", r"$\frac{y_{0}e^{y_{0}}}{1+e^{y_{0}}}$", r"$\frac{y_{0}e^{y_{0}}}{1-e^{y_{0}}}$"], "D",
  "Differential Calculus > Differentiation > Chain, Implicit and Parametric Differentiation", 50,
  r"""Step 1: From the previous item, at $x=1$: $\dfrac{dy}{dx}=\dfrac{y_0^2}{1-y_0}$.
Step 2: At $x=1$ the relation reads $e^{y_0}=y_0$, so $y_0^2=y_0e^{y_0}$ and $1-y_0=1-e^{y_0}$.
Step 3: $\dfrac{dy}{dx}=\dfrac{y_0e^{y_0}}{1-e^{y_0}}$.
Note: $e^{y}=y$ has no real root, so this item is formally defective; the answer follows the intended substitution.
Answer: (d)""", pattern=L, passage="exy", theme="Derivative value at x = 1")

P("sym", "Questions 113-114", r"""For the next two (02) items that follow: Let $\int_{0}^{\frac{\pi}{2}}\frac{a\sin x+b\cos x}{(a+b)(\sin x+\cos x)}dx=k$""")

_SY = r"Concept: by $x\to\dfrac{\pi}{2}-x$, $\displaystyle\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}dx=\int_0^{\pi/2}\frac{\cos x}{\sin x+\cos x}dx=\frac{\pi}{4}$."

Q(113, r"""What is the value of $k$?""",
  [r"$\frac{\pi}{4}$", r"$\frac{\pi}{2}$", r"$\pi$", r"$2\pi$"], "A",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 35,
  _SY + r"""
Step 1: $k=\dfrac{1}{a+b}\left(a\cdot\dfrac{\pi}{4}+b\cdot\dfrac{\pi}{4}\right)=\dfrac{\pi}{4}$.
Answer: (a)""", pattern=L, passage="sym", theme="Symmetric integral of sin/(sin + cos)")

Q(114, r"""What is $\int_{0}^{\frac{\pi}{2}}\frac{a\cos x+b\sin x}{\sin x+\cos x}dx$ equal to?""",
  ["k", "2k", "k(a + b)", r"$\frac{k}{a+b}$"], "C",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 35,
  _SY + r"""
Step 1: The integral is $(a+b)\dfrac{\pi}{4}=k(a+b)$.
Answer: (c)""", pattern=L, passage="sym", theme="Symmetric integral of sin/(sin + cos)")

P("mono", "Questions 115-116", r"""For the next two (02) items that follow: Let $S$ and $T$ be the sets where $f(x)=\frac{x^{3}}{3}-\frac{5x^{2}}{2}+6x+7$ decreases and increases respectively.""")

_MO = r"Step 1: $f'(x)=x^2-5x+6=(x-2)(x-3)$: positive for $x<2$ or $x>3$, negative for $2<x<3$."

Q(115, r"""What is $T$ equal to?""",
  [r"$\{x\leq2\}\cup\{x\geq3\}$", r"$\{x<2\}\cup\{x>3\}$", "(2, 3)", "[2, 3]"], "B",
  "Differential Calculus > Applications of Derivatives > Increasing and Decreasing Functions", 35,
  _MO + r"""
Step 2: $f$ increases where $f'>0$: $T=\{x<2\}\cup\{x>3\}$.
Answer: (b)""", pattern=L, passage="mono", theme="Intervals of increase of a cubic")

Q(116, r"""What is $S$ equal to?""",
  [r"$\{x\leq2\}\cup\{x\geq3\}$", r"$\{x<2\}\cup\{x>3\}$", "(2, 3)", "[2, 3]"], "C",
  "Differential Calculus > Applications of Derivatives > Increasing and Decreasing Functions", 35,
  _MO + r"""
Step 2: $f$ decreases where $f'<0$: $S=(2,3)$.
Answer: (c)""", pattern=L, passage="mono", theme="Interval of decrease of a cubic")

P("area", "Questions 117-118", r"""For the next two (02) items that follow: Let $k$ be the area between the curve $y=\sin x$ and x-axis in the interval $\left[0,\frac{\pi}{4}\right]$""")

_AR = r"Step 1: $k=\displaystyle\int_0^{\pi/4}\sin x\,dx=1-\frac{1}{\sqrt2}$."

Q(117, r"""What is the area between the curve $y=\sin x$ and the x-axis in the interval $\left[\frac{\pi}{4},\frac{\pi}{2}\right]$?""",
  ["k", "1 $-$ k", r"$\frac{(\pi-k)}{2}$", r"$\frac{(\pi-2k)}{2}$"], "B",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curve and Axis", 30,
  _AR + r"""
Step 2: $\displaystyle\int_{\pi/4}^{\pi/2}\sin x\,dx=\frac{1}{\sqrt2}=1-k$.
Answer: (b)""", pattern=L, passage="area", theme="Area under sin x")

Q(118, r"""What is the area between the curve $y=\cos x$ and the x-axis in the interval $\left[\frac{\pi}{4},\frac{\pi}{2}\right]$?""",
  ["k", "1 $-$ k", r"$\frac{(\pi-k)}{2}$", r"$\frac{(\pi-2k)}{2}$"], "A",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curve and Axis", 30,
  _AR + r"""
Step 2: $\displaystyle\int_{\pi/4}^{\pi/2}\cos x\,dx=1-\frac{1}{\sqrt2}=k$.
Answer: (a)""", pattern=L, passage="area", theme="Area under cos x")

P("par", "Questions 119-120", r"""For the next two (02) items that follow: Consider the curves $y=x^{2}$ and $y=2|x|$.""")

Q(119, r"""What is the number of points of intersection of the curves?""",
  ["4", "3", "2", "None"], "B",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 20,
  r"""Step 1: $x^2=2|x|$ gives $x=0$ or $|x|=2$.
Step 2: Points $(0,0)$, $(2,4)$, $(-2,4)$: three.
Answer: (b)""", pattern=L, passage="par", theme="Intersections of a parabola and y = 2|x|")

Q(120, r"""What is the area bounded by the curves, the lines $x=0$ and $x=1$?""",
  ["1 square unit", r"$\frac{2}{3}$ square unit", r"$\frac{1}{2}$ square unit", r"$\frac{1}{3}$ square unit"], "B",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 30,
  r"""Step 1: On $[0,1]$, $2x\ge x^2$.
Step 2: Area $=\displaystyle\int_0^1(2x-x^2)dx=1-\frac13=\frac23$ square unit.
Answer: (b)""", pattern=L, passage="par", theme="Area between y = x^2 and y = 2x")
