from qfmt import Q, P, F, W

# NDA I 2025 Mathematics, Set A (AEBC-B-MTH/55A), booklet pages 3-15, Q1-50
S2 = "2-Statement Combination"
LS = "Linked Item Set"

Q(1, r"""The sum of the first $k$ terms of a series $S$ is $3k^{2}+5k$. Which one of the following is correct?""",
  ["The terms of $S$ form an arithmetic progression with common difference 14.", "The terms of $S$ form an arithmetic progression with common difference 6.",
   "The terms of $S$ form a geometric progression with common ratio 10/7.", "The terms of $S$ form a geometric progression with common ratio 11/4."], "B",
  "Algebra > Sequences and Series > Arithmetic Progression", 20,
  r"""Step 1: $a_k=S_k-S_{k-1}=3k^2+5k-3(k-1)^2-5(k-1)=6k+2$.
Step 2: The terms 8, 14, 20, ... form an AP with common difference 6.
Answer: (b)""", theme="nth term from the sum")

Q(2, r"""The sum of the first 8 terms of a GP is five times the sum of its first 4 terms. If $r\neq1$ is the common ratio, then what is the number of possible real values of $r$?""",
  ["One", "Two", "Three", "More than three"], "B", "Algebra > Sequences and Series > Geometric Progression", 30,
  r"""Step 1: $\dfrac{a(r^8-1)}{r-1}=5\dfrac{a(r^4-1)}{r-1}$, so $r^4+1=5$ (as $r^4\ne1$).
Step 2: $r^4=4$ gives $r=\pm\sqrt2$: two real values.
Answer: (b)""", theme="Ratio of GP sums")

Q(3, r"""If one root of the equation $x^{2}-kx+k=0$ exceeds the other by $2\sqrt3$, then which one of the following is a value of $k$?""",
  ["3", "6", "9", "12"], "B", "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 25,
  r"""Step 1: $(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=k^2-4k=12$.
Step 2: $k^2-4k-12=0$ gives $k=6$ or $-2$.
Answer: (b)""", theme="Difference of roots")

Q(4, r"""If $x+\dfrac5y=4$ and $y+\dfrac5x=-4$, then what is $(x+y)$ equal to?""",
  ["0", "1", "4", "5"], "A", "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 30,
  r"""Step 1: From the first equation $xy+5=4y$; from the second $xy+5=-4x$.
Step 2: So $4y=-4x$, i.e. $x+y=0$. (Check: $x=5,\ y=-5$ satisfies both.)
Answer: (a)""", theme="Symmetric pair of equations")

Q(5, r"""If 5th, 7th and 13th terms of an AP are in GP, then what is the ratio of its first term to its common difference?""",
  ["$-3$", "$-2$", "2", "3"], "A", "Algebra > Sequences and Series > Arithmetic Progression", 30,
  r"""Step 1: $(a+6d)^2=(a+4d)(a+12d)$.
Step 2: $a^2+12ad+36d^2=a^2+16ad+48d^2$, so $-4ad=12d^2$ and $a=-3d$.
Answer: (a)""", theme="AP terms in GP")

Q(6, r"""If $p$, 1, $q$ are in AP and $p$, 2, $q$ are in GP, then which of the following statements is/are correct?

I. $p$, 4, $q$ are in HP.
II. $(1/p)$, $1/4$, $(1/q)$ are in AP.

Select the answer using the code given below.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C", "Algebra > Sequences and Series > Special Series and Means", 30,
  r"""Step 1: $p+q=2$ and $pq=4$.
Step 2: The HM of $p$ and $q$ is $\dfrac{2pq}{p+q}=\dfrac82=4$, so $p,4,q$ are in HP (I).
Step 3: That is the same as $\dfrac1p,\dfrac14,\dfrac1q$ being in AP: $\dfrac1p+\dfrac1q=\dfrac{p+q}{pq}=\dfrac12=2\cdot\dfrac14$ (II).
Answer: (c)""", pattern=S2, theme="AP, GP and HP of two numbers")

Q(7, r"""If $x=(1111)_2$, $y=(1001)_2$ and $z=(110)_2$, then what is $x^{3}-y^{3}-z^{3}-3xyz$ equal to?""",
  [r"$(1111001)_2$", r"$(1001111)_2$", r"$(1)_2$", r"$(0)_2$"], "D", "Algebra > Number Systems > Binary and Decimal Systems", 30,
  r"""Step 1: $x=15$, $y=9$, $z=6$, so $x=y+z$.
Step 2: Put $a=x$, $b=-y$, $c=-z$: $a+b+c=0$, so $a^3+b^3+c^3=3abc$, i.e. $x^3-y^3-z^3=3xyz$.
Step 3: The expression is 0.
Answer: (d)""", theme="Binary numbers and a cubic identity")

Q(8, r"""If
$$\Delta=\begin{vmatrix}a&b&c\\d&e&f\\g&h&i\end{vmatrix}$$
and $A, B, C, D, G$ are the cofactors of the elements $a, b, c, d, g$ respectively, then what is $bB+cC-dD-gG$ equal to?""",
  ["0", "1", r"$\Delta$", r"$-\Delta$"], "A", "Matrices and Determinants > Determinants > Minors and Cofactors", 30,
  r"""Step 1: Expanding along row 1: $aA+bB+cC=\Delta$. Along column 1: $aA+dD+gG=\Delta$.
Step 2: Subtract: $bB+cC-dD-gG=0$.
Answer: (a)""", theme="Row and column cofactor expansion")

Q(9, r"""Consider the following statements in respect of the determinant
$$\Delta=\begin{vmatrix}k(k+2)&2k+1&1\\2k+1&k+2&1\\3&3&1\end{vmatrix}$$

I. $\Delta$ is positive if $k>0$.
II. $\Delta$ is negative if $k<0$.
III. $\Delta$ is zero if $k=0$.

How many of the statements given above are correct?""",
  ["None", "One", "Two", "All three"], "B", "Matrices and Determinants > Determinants > Evaluation and Properties", 45,
  r"""Step 1: Expanding (or using row operations) gives $\Delta=(k-1)^3$.
Step 2: I fails for $0<k<1$; II is true since $k-1<0$; III fails because $\Delta(0)=-1$.
Answer: (b)""", pattern="Statement Count", theme="Determinant equal to (k-1)^3")

Q(10, r"""If
$$\begin{vmatrix}2&3+i&-1\\3-i&0&i-1\\-1&-1-i&1\end{vmatrix}=A+iB$$
where $i=\sqrt{-1}$, then what is $A+B$ equal to?""",
  ["$-10$", "$-6$", "0", "6"], "B", "Matrices and Determinants > Determinants > Evaluation and Properties", 35,
  r"""Concept: the matrix is Hermitian, so its determinant is real.
Step 1: Expanding: $2(0-(i-1)(-1-i))-(3+i)((3-i)-(i-1))-1((3-i)(-1-i)-0)=-6$.
Step 2: $A=-6$, $B=0$, so $A+B=-6$.
Answer: (b)""", theme="Determinant with complex entries")

Q(11, r"""If $A^{2}+B^{2}+C^{2}=0$, then what is the value of the following?
$$\begin{vmatrix}1&\cos C&\cos B\\\cos C&1&\cos A\\\cos B&\cos A&1\end{vmatrix}$$""",
  ["$-1$", "0", "1", "2"], "B", "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Step 1: For real angles, $A^2+B^2+C^2=0$ forces $A=B=C=0$, so every cosine is 1.
Step 2: All entries are 1 and the determinant has identical rows: value 0.
Answer: (b)""", theme="Determinant with all entries one")

Q(12, r"""If $\omega$ is a non-real cube root of unity, then what is a root of the following equation?
$$\begin{vmatrix}x+1&\omega&\omega^{2}\\\omega&x+\omega^{2}&1\\\omega^{2}&1&x+\omega\end{vmatrix}=0$$""",
  ["$x=0$", "$x=1$", r"$x=\omega$", r"$x=\omega^{2}$"], "A", "Algebra > Complex Numbers > Cube Roots of Unity", 30,
  r"""Step 1: $C_1\to C_1+C_2+C_3$: the first column becomes $x+1+\omega+\omega^2=x$ in every row.
Step 2: So $x$ is a factor of the determinant and $x=0$ is a root.
Answer: (a)""", theme="Determinant with omega")

Q(13, r"""What is $\left(\dfrac{\sqrt3+i}{\sqrt3-i}\right)^{3}$ equal to?""",
  ["$-1$", "0", "1", "3"], "A", "Algebra > Complex Numbers > Modulus, Argument and Polar Form", 25,
  r"""Step 1: $\sqrt3+i=2e^{i\pi/6}$ and $\sqrt3-i=2e^{-i\pi/6}$, so the ratio is $e^{i\pi/3}$.
Step 2: Its cube is $e^{i\pi}=-1$.
Answer: (a)""", theme="Power of a complex ratio")

Q(14, r"""If $x^{2}-x+1=0$, then what is
$$\left(x-\dfrac1x\right)^{2}+\left(x-\dfrac1x\right)^{4}+\left(x-\dfrac1x\right)^{8}$$
equal to?""",
  ["81", "85", "87", "90"], "C", "Algebra > Complex Numbers > Cube Roots of Unity", 40,
  r"""Step 1: $x+\dfrac1x=1$, so $\left(x-\dfrac1x\right)^2=1-4=-3$.
Step 2: The sum is $-3+9+81=87$.
Answer: (c)""", theme="Powers of x - 1/x")

Q(15, r"""How many 7-letter words (with or without meaning) can be constructed using all the letters of the word CAPITAL so that all consonants come together in each word?""",
  ["360", "300", "288", "240"], "C", "Algebra > Permutations and Combinations > Permutations", 30,
  r"""Step 1: Consonants C, P, T, L form one block; with A, I, A there are 4 units: $\dfrac{4!}{2!}=12$ arrangements.
Step 2: The block itself can be arranged in $4!=24$ ways. Total $12\times24=288$.
Answer: (c)""", theme="Arrangements with a block")

Q(16, r"""If $z\ne0$ is a complex number, then what is $\operatorname{amp}(z)+\operatorname{amp}(\bar z)$ equal to?""",
  ["0", r"$\pi/2$", r"$\pi$", r"$2\pi$"], "A", "Algebra > Complex Numbers > Modulus, Argument and Polar Form", 15,
  r"""Step 1: $\arg\bar z=-\arg z$ (principal values, $z$ not a negative real).
Step 2: The sum is 0.
Answer: (a)""", theme="Argument of a conjugate")
F(16, "For negative real z, principal args give 2π; standard key 0")

Q(17, r"""How many sides are there in a polygon which has 20 diagonals?""",
  ["6", "7", "8", "10"], "C", "Algebra > Permutations and Combinations > Combinations", 15,
  r"""Step 1: $\dfrac{n(n-3)}2=20$ gives $n^2-3n-40=0$, so $n=8$.
Answer: (c)""", theme="Diagonals of a polygon")

Q(18, r"""In how many ways can the letters of the word DELHI be arranged keeping the positions of vowels and consonants unchanged?""",
  ["6", "9", "12", "24"], "C", "Algebra > Permutations and Combinations > Permutations", 15,
  r"""Step 1: Vowels E, I swap among their 2 places: $2!$; consonants D, L, H among 3 places: $3!$.
Step 2: Total $2\times6=12$.
Answer: (c)""", theme="Fixed vowel positions")

Q(19, r"""What is the number of positive integer solutions of $x+y+z=5$?""",
  ["3", "5", "6", "9"], "C", "Algebra > Permutations and Combinations > Combinations", 20,
  r"""Concept: positive solutions of $x_1+\dots+x_r=n$ number $\binom{n-1}{r-1}$.
Step 1: $\binom42=6$.
Answer: (c)""", theme="Stars and bars")

Q(20, r"""What is the number of rational terms in the expansion of $\left(3^{\frac12}+5^{\frac14}\right)^{12}$?""",
  ["2", "3", "4", "6"], "C", "Algebra > Binomial Theorem > Expansion and General Term", 30,
  r"""Step 1: $T_{r+1}=\binom{12}r3^{(12-r)/2}5^{r/4}$ is rational when $r$ is a multiple of 4 and $12-r$ is even.
Step 2: $r=0,4,8,12$: four terms.
Answer: (c)""", theme="Rational terms in a binomial expansion")

Q(21, r"""If the sum of binomial coefficients in the expansion of $(x+y)^{n}$ is 256, then the greatest binomial coefficient occurs in which one of the following terms?""",
  ["Third", "Fourth", "Fifth", "Ninth"], "C", "Algebra > Binomial Theorem > Coefficients and Middle Terms", 15,
  r"""Step 1: $2^n=256$ gives $n=8$.
Step 2: The greatest coefficient $\binom84$ is in the $(4+1)$th, i.e. fifth, term.
Answer: (c)""", theme="Middle term")

Q(22, r"""If $k<(\sqrt2+1)^{3}<k+2$, where $k$ is a natural number, then what is the value of $k$?""",
  ["11", "13", "15", "17"], "B", "Algebra > Logarithms and Indices > Laws of Indices and Surds", 25,
  r"""Step 1: $(\sqrt2+1)^3=2\sqrt2+6+3\sqrt2+1=7+5\sqrt2\approx14.07$.
Step 2: Among the options only $k=13$ gives $13<14.07<15$.
Answer: (b)""", theme="Estimating a surd power")

Q(23, r"""If
$$\begin{bmatrix}x&1&1\end{bmatrix}\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}\begin{bmatrix}1\\1\\x\end{bmatrix}=[45]$$
then which one of the following is a value of $x$?""",
  ["$-2$", "$-1$", "0", "1"], "D", "Matrices and Determinants > Matrices > Types and Operations", 25,
  r"""Step 1: The product is $[x\ 1\ 1]\,(3+3x,\ 9+6x,\ 15+9x)^T=3x^2+18x+24$.
Step 2: $3x^2+18x+24=45$ gives $x^2+6x-7=0$, so $x=1$ or $-7$.
Answer: (d)""", theme="Matrix product equation")

Q(24, r"""If
$$A=\begin{bmatrix}y&z&x\\z&x&y\\x&y&z\end{bmatrix}$$
where $x$, $y$, $z$ are integers, is an orthogonal matrix, then what is the value of $x^{2}+y^{2}+z^{2}$?""",
  ["0", "1", "4", "14"], "B", "Matrices and Determinants > Matrices > Types and Operations", 30,
  r"""Step 1: For an orthogonal matrix every row is a unit vector.
Step 2: So $x^2+y^2+z^2=1$.
Answer: (b)""", theme="Orthogonal circulant matrix")

Q(25, r"""Consider the following in respect of a non-singular matrix $M$:

I. $|M^{2}|=|M|^{2}$
II. $|M|=|M^{-1}|$
III. $|M|=|M^{T}|$

How many of the above are correct?""",
  ["None", "One", "Two", "All three"], "C", "Matrices and Determinants > Determinants > Evaluation and Properties", 20,
  r"""Step 1: $|M^2|=|M|^2$ and $|M^T|=|M|$ always hold.
Step 2: $|M^{-1}|=1/|M|$, which equals $|M|$ only when $|M|=\pm1$. II is not true in general.
Answer: (c)""", pattern="Statement Count", theme="Determinant properties")

Q(26, r"""If
$$f(\theta)=\begin{bmatrix}\cos\theta&\sin\theta\\-\sin\theta&\cos\theta\end{bmatrix}$$
then what is $\{f(\pi)\}^{2}$ equal to?""",
  [r"$\begin{bmatrix}-1&0\\0&-1\end{bmatrix}$", r"$\begin{bmatrix}1&1\\1&1\end{bmatrix}$", r"$\begin{bmatrix}-1&0\\0&1\end{bmatrix}$", r"$\begin{bmatrix}1&0\\0&1\end{bmatrix}$"], "D",
  "Matrices and Determinants > Matrices > Matrix Equations and Powers", 15,
  r"""Step 1: $f(\pi)=-I$.
Step 2: $(-I)^2=I$.
Answer: (d)""", theme="Square of a rotation by pi")

Q(27, r"""If
$$A=\begin{bmatrix}1&2&2\\2&1&2\\2&2&1\end{bmatrix}$$
then what is $A^{2}-4A$ equal to?""",
  [r"$-5I_3$", r"$-I_3$", r"$I_3$", r"$5I_3$"], "D", "Matrices and Determinants > Matrices > Matrix Equations and Powers", 25,
  r"""Step 1: $A^2=\begin{bmatrix}9&8&8\\8&9&8\\8&8&9\end{bmatrix}$ and $4A=\begin{bmatrix}4&8&8\\8&4&8\\8&8&4\end{bmatrix}$.
Step 2: $A^2-4A=5I_3$.
Answer: (d)""", theme="Matrix polynomial")

Q(28, r"""If the number of selections of $r$ as well as $(n+r)$ things from $5n$ different things are equal, then what is the value of $r$?""",
  ["$n$", "$2n$", "$3n$", "$4n$"], "B", "Algebra > Permutations and Combinations > Combinations", 20,
  r"""Step 1: $\binom{5n}r=\binom{5n}{n+r}$ with $r\ne n+r$ needs $r+(n+r)=5n$.
Step 2: So $r=2n$.
Answer: (b)""", theme="Equal binomial coefficients")

Q(29, r"""What is the number of selections of at most 3 things from 6 different things?""",
  ["20", "22", "41", "42"], "D", "Algebra > Permutations and Combinations > Combinations", 20,
  r"""Step 1: $\binom60+\binom61+\binom62+\binom63=1+6+15+20=42$.
Answer: (d)""", theme="Selections of at most three")
F(29, "If the empty selection is excluded the count is 41; DP key includes it (42)")

Q(30, r"""If
$$A=\begin{bmatrix}x&y&z\\y&z&x\\z&x&y\end{bmatrix}$$
where $x$, $y$, $z$ are integers, is an orthogonal matrix, then what is $A^{2}$ equal to?""",
  ["Null matrix", "Identity matrix", "$A$", "$-A$"], "B", "Matrices and Determinants > Matrices > Matrix Equations and Powers", 25,
  r"""Step 1: $A$ is symmetric, so $A^T=A$.
Step 2: Orthogonal means $AA^T=I$, hence $A^2=I$.
Answer: (b)""", theme="Symmetric orthogonal matrix")

P("sin3", "Three sines", r"""Let $p=\sin35^\circ$, $q=\sin25^\circ$ and $r=\sin(-95^\circ)$.""")

Q(31, r"""What is $(p+q+r)$ equal to?""", ["$-1$", "0", r"$2\sin5^\circ$", r"$2\cos5^\circ$"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 25,
  r"""Step 1: $\sin35^\circ+\sin25^\circ=2\sin30^\circ\cos5^\circ=\cos5^\circ$.
Step 2: $\sin(-95^\circ)=-\cos5^\circ$. The sum is 0.
Answer: (b)""", passage="sin3", pattern=LS, theme="Sum of three sines")

Q(32, r"""What is $(pq+qr+rp)$ equal to?""", ["$-3/4$", "0", "$1/4$", "$3/4$"], "A",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 45,
  r"""Step 1: $q=\sin25^\circ=\sin155^\circ$ and $r=\sin(-95^\circ)=\sin275^\circ$, so $p,q,r$ are the sines of $35^\circ,155^\circ,275^\circ$, which differ by $120^\circ$. Hence $p+q+r=0$ and $p^2+q^2+r^2=\dfrac32$ (next item).
Step 2: $pq+qr+rp=\dfrac{(p+q+r)^2-(p^2+q^2+r^2)}2=-\dfrac34$.
Answer: (a)""", passage="sin3", pattern=LS, theme="Pairwise products of sines")

Q(33, r"""What is $(p^{2}+q^{2}+r^{2})$ equal to?""", ["$1/2$", "1", "$3/2$", "2"], "C",
  "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 45,
  r"""Step 1: As $p,q,r$ are the sines of $35^\circ,155^\circ,275^\circ$, $\sum\sin^2\theta=\dfrac32-\dfrac12\sum\cos2\theta$.
Step 2: $\cos70^\circ+\cos310^\circ+\cos550^\circ=0$ (the angles $70^\circ,310^\circ,550^\circ$ are $240^\circ$ apart), so the sum is $\dfrac32$.
Answer: (c)""", passage="sin3", pattern=LS, theme="Sum of squares of sines")

P("pabs", "Absolute value of a trig difference", r"""Let $p=|\sin\alpha-\sin(\alpha-90^\circ)|$.""")

Q(34, r"""What is the minimum value of $p$?""", ["0", "1/2", r"$1/\sqrt2$", "1"], "A",
  "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 25,
  r"""Step 1: $\sin(\alpha-90^\circ)=-\cos\alpha$, so $p=|\sin\alpha+\cos\alpha|=\sqrt2\left|\sin(\alpha+45^\circ)\right|$.
Step 2: The minimum is 0 (at $\alpha=135^\circ$).
Answer: (a)""", passage="pabs", pattern=LS, theme="Minimum of |sin + cos|")

Q(35, r"""What is the maximum value of $p$?""", ["1", r"$\sqrt2$", r"$\sqrt3$", "2"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 20,
  r"""Step 1: $p=\sqrt2|\sin(\alpha+45^\circ)|\le\sqrt2$.
Answer: (b)""", passage="pabs", pattern=LS, theme="Maximum of |sin + cos|")

P("tri357", "Triangle with sides 3, 5, 7", r"""The sides of a triangle $ABC$ are $AB=3$ cm, $BC=5$ cm and $CA=7$ cm.""")

Q(36, r"""Consider the following statements:

I. The triangle is obtuse-angled triangle.
II. The sum of acute angles of the triangle is also acute.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C", "Trigonometry > Properties of Triangles > Sine and Cosine Rules", 30,
  r"""Step 1: The angle opposite 7: $\cos B=\dfrac{9+25-49}{30}=-\dfrac12$, so $B=120^\circ$ (obtuse).
Step 2: The other two angles add to $60^\circ$, which is acute.
Answer: (c)""", passage="tri357", pattern=S2, theme="Obtuse triangle check")

Q(37, r"""What is $\angle B$ equal to?""", [r"$60^\circ$", r"$105^\circ$", r"$120^\circ$", r"$150^\circ$"], "C",
  "Trigonometry > Properties of Triangles > Sine and Cosine Rules", 20,
  r"""Step 1: $\cos B=\dfrac{AB^2+BC^2-CA^2}{2\cdot AB\cdot BC}=\dfrac{9+25-49}{30}=-\dfrac12$.
Step 2: $B=120^\circ$.
Answer: (c)""", passage="tri357", pattern=LS, theme="Cosine rule")

Q(38, r"""What is the area of the triangle?""", [r"$15\sqrt3/4$ square cm", r"$15\sqrt3/2$ square cm", r"$15\sqrt3$ square cm", r"$30\sqrt3$ square cm"], "A",
  "Trigonometry > Properties of Triangles > Sine and Cosine Rules", 20,
  r"""Step 1: Area $=\dfrac12\cdot3\cdot5\sin120^\circ=\dfrac{15\sqrt3}4$.
Answer: (a)""", passage="tri357", pattern=LS, theme="Area from two sides and the included angle")

P("tower", "Tower seen from three collinear points",
  r"""The top ($M$) of a tower is observed from three points $P$, $Q$ and $R$ lying in a horizontal straight line which passes directly along the foot ($N$) of the tower. The angles of elevations of $M$ from $P$, $Q$ and $R$ are $30^\circ$, $45^\circ$ and $60^\circ$ respectively. Let $PQ=a$ and $QR=b$.""")

Q(39, r"""What is $PN$ equal to?""", [r"$\left(\dfrac{3-\sqrt3}2\right)a$", r"$\left(\dfrac{3+\sqrt3}2\right)a$", r"$\left(\dfrac{3-\sqrt3}4\right)a$", r"$\left(\dfrac{3+\sqrt3}4\right)a$"], "B",
  "Trigonometry > Heights and Distances > Angles of Elevation and Depression", 40,
  r"""Step 1: With height $h$: $PN=\sqrt3h$, $QN=h$, so $a=(\sqrt3-1)h$ and $h=\dfrac{(\sqrt3+1)a}2$.
Step 2: $PN=\sqrt3h=\dfrac{(3+\sqrt3)a}2$.
Answer: (b)""", passage="tower", pattern=LS, theme="Distance from the first point")

Q(40, r"""What is $MN$ equal to?""", [r"$\left(\dfrac{3+\sqrt3}2\right)b$", r"$\left(\dfrac{3-\sqrt3}2\right)b$", r"$\left(\dfrac{3-\sqrt3}4\right)b$", r"$\left(\dfrac{3+\sqrt3}4\right)b$"], "A",
  "Trigonometry > Heights and Distances > Angles of Elevation and Depression", 40,
  r"""Step 1: $QN=h$ and $RN=\dfrac h{\sqrt3}$, so $b=h\left(1-\dfrac1{\sqrt3}\right)$.
Step 2: $h=\dfrac{\sqrt3b}{\sqrt3-1}=\dfrac{(3+\sqrt3)b}2$.
Answer: (a)""", passage="tower", pattern=LS, theme="Height of the tower")

P("pq2a", "tan 2a - tan a and cot a - cot 2a", r"""Let $p=\tan2\alpha-\tan\alpha$ and $q=\cot\alpha-\cot2\alpha$.""")

Q(41, r"""What is $(p/q)$ equal to?""", [r"$-\tan\alpha\cdot\tan2\alpha$", r"$-\cot\alpha\cdot\cot2\alpha$", r"$\tan\alpha\cdot\tan2\alpha$", r"$\cot\alpha\cdot\cot2\alpha$"], "C",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 35,
  r"""Step 1: $q=\dfrac1{\tan\alpha}-\dfrac1{\tan2\alpha}=\dfrac{\tan2\alpha-\tan\alpha}{\tan\alpha\tan2\alpha}=\dfrac p{\tan\alpha\tan2\alpha}$.
Step 2: So $\dfrac pq=\tan\alpha\tan2\alpha$.
Answer: (c)""", passage="pq2a", pattern=LS, theme="Ratio p/q")

Q(42, r"""What is $(p+q)$ equal to?""", [r"$\sec4\alpha$", r"$\operatorname{cosec}4\alpha$", r"$2\sec4\alpha$", r"$2\operatorname{cosec}4\alpha$"], "D",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 50,
  r"""Step 1: $p=\dfrac{\sin(2\alpha-\alpha)}{\cos2\alpha\cos\alpha}=\dfrac{\sin\alpha}{\cos\alpha\cos2\alpha}$ and $q=\dfrac{\sin(2\alpha-\alpha)}{\sin\alpha\sin2\alpha}=\dfrac1{\sin2\alpha}$.
Step 2: $p+q=\dfrac{2\sin^2\alpha+\cos2\alpha}{\sin2\alpha\cos2\alpha}=\dfrac1{\sin2\alpha\cos2\alpha}=\dfrac2{\sin4\alpha}$.
Answer: (d)""", passage="pq2a", pattern=LS, theme="Sum p + q")

Q(43, r"""What is $\tan^{2}\alpha$ equal to?""", [r"$(pq)/(p+q)$", r"$(p+2q)/p$", r"$p/(p+2q)$", r"$p/(2p+q)$"], "C",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 55,
  r"""Step 1: Let $t=\tan\alpha$, $T=\tan2\alpha=\dfrac{2t}{1-t^2}$. Then $p=T-t=\dfrac{t(1+t^2)}{1-t^2}$ and $q=\dfrac{p}{tT}=\dfrac{1+t^2}{2t}$.
Step 2: $p+2q=\dfrac{1+t^2}{t}\left(\dfrac{t^2}{1-t^2}+1\right)=\dfrac{1+t^2}{t(1-t^2)}$, so $\dfrac p{p+2q}=t^2$.
Answer: (c)""", passage="pq2a", pattern=LS, theme="tan squared in terms of p and q")

P("2s1c", "Linear trig equation", r"""Let $2\sin\alpha+\cos\alpha=2$, where $0<\alpha<90^\circ$.""")

Q(44, r"""What is $\tan\alpha$ equal to?""", ["1/2", "1", "3/4", "2"], "C",
  "Trigonometry > Trigonometric Equations > General Solutions", 30,
  r"""Step 1: With $t=\tan\dfrac\alpha2$: $\dfrac{4t+1-t^2}{1+t^2}=2$, so $3t^2-4t+1=0$ and $t=\dfrac13$ ($t=1$ gives $\alpha=90^\circ$).
Step 2: $\tan\alpha=\dfrac{2t}{1-t^2}=\dfrac{2/3}{8/9}=\dfrac34$.
Answer: (c)""", passage="2s1c", pattern=LS, theme="Solving 2 sin + cos = 2")

Q(45, r"""What is $2\sin2\alpha+\cos2\alpha$ equal to?""", ["11/10", "11/5", "12/5", "13/5"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 25,
  r"""Step 1: $\tan\alpha=\dfrac34$ gives $\sin2\alpha=\dfrac{24}{25}$ and $\cos2\alpha=\dfrac7{25}$.
Step 2: $\dfrac{48+7}{25}=\dfrac{11}5$.
Answer: (b)""", passage="2s1c", pattern=LS, theme="Double angle values")

P("ratio31", "Triangle with sides in ratio 2:1",
  r"""In a triangle $ABC$, two sides $BC$ and $CA$ are in the ratio $2:1$ and their opposite corresponding angles are in the ratio $3:1$.""")

Q(46, r"""One of the angles of the triangle is""", [r"$15^\circ$", r"$30^\circ$", r"$45^\circ$", r"$75^\circ$"], "B",
  "Trigonometry > Properties of Triangles > Ratios of Sides and Angles", 35,
  r"""Step 1: $A=3B$ and $\dfrac{\sin3B}{\sin B}=3-4\sin^2B=2$, so $\sin B=\dfrac12$ and $B=30^\circ$.
Step 2: Then $A=90^\circ$ and $C=60^\circ$.
Answer: (b)""", passage="ratio31", pattern=LS, theme="Angles from side and angle ratios")

Q(47, r"""Consider the following statements:

I. The triangle is right-angled.
II. One of the sides of the triangle is 3 times the other.
III. The angles $A$, $C$ and $B$ of the triangle are in AP.

Which of the statements given above is/are correct?""",
  ["I only", "II and III only", "I and III only", "I, II and III"], "C", "Trigonometry > Properties of Triangles > Ratios of Sides and Angles", 40,
  r"""Step 1: $A=90^\circ$, $B=30^\circ$, $C=60^\circ$: right-angled (I).
Step 2: Sides are in the ratio $\sin90^\circ:\sin30^\circ:\sin60^\circ=2:1:\sqrt3$; no side is 3 times another (II fails).
Step 3: $A, C, B=90^\circ, 60^\circ, 30^\circ$ are in AP (III).
Answer: (c)""", passage="ratio31", pattern="3-Statement Combination", theme="Properties of a 30-60-90 triangle")

Q(48, r"""A man at $M$, standing 100 m away from the base ($P$) of a chimney of height 50 m, observes the angle of elevation of the highest point ($Q$) of the smoke to be $45^\circ$. The highest point of the chimney is at $R$. Further $P$, $R$ and $Q$ are in a straight line and the straight line is perpendicular to $PM$. What is the angle $RMQ$ equal to?""",
  [r"$\tan^{-1}\left(\dfrac12\right)$", r"$\tan^{-1}\left(\dfrac13\right)$", r"$\tan^{-1}\left(\dfrac23\right)$", r"$\tan^{-1}\left(\dfrac34\right)$"], "B",
  "Trigonometry > Heights and Distances > Angles of Elevation and Depression", 35,
  r"""Step 1: $\angle PMQ=45^\circ$ and $\angle PMR=\tan^{-1}\dfrac{50}{100}=\tan^{-1}\dfrac12$.
Step 2: $\angle RMQ=\tan^{-1}\dfrac{1-1/2}{1+1/2}=\tan^{-1}\dfrac13$.
Answer: (b)""", theme="Difference of two elevation angles")

Q(49, r"""If $k$ is a root of $x^{2}-4x+1=0$, then what is $\tan^{-1}k+\tan^{-1}\dfrac1k$ equal to?""",
  [r"$-\pi/2$", "0", r"$\pi/4$", r"$\pi/2$"], "D", "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 20,
  r"""Step 1: The roots $2\pm\sqrt3$ are positive.
Step 2: For $k>0$, $\tan^{-1}k+\tan^{-1}\dfrac1k=\dfrac\pi2$.
Answer: (d)""", theme="arctan k + arctan 1/k")

Q(50, r"""If $\tan^{-1}k+\tan^{-1}\dfrac12=\dfrac\pi4$, then what is the value of $k$?""",
  ["1", "1/2", "1/3", "1/4"], "C", "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 20,
  r"""Step 1: $\dfrac{k+1/2}{1-k/2}=1$ gives $2k+1=2-k$, so $k=\dfrac13$.
Answer: (c)""", theme="Solving an arctan equation")
