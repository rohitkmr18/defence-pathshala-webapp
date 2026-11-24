from qfmt import Q, P

# NDA I 2026 Mathematics, Set D, booklet pages 7 to 21 (Q13-58)
L = "Linked Item Set"

Q(13, r"""Consider the following statements:

I. $\sqrt{x}+x+1=0$ has two irrational roots.
II. $5\sqrt{x}-x-4=0$ has two rational roots.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "B",
  "Algebra > Quadratic Equations and Inequalities > Nature of Roots", 35,
  r"""Step 1: For real $x\ge0$, $\sqrt x+x+1\ge1>0$, so equation I has no real roots. I is false.
Step 2: Put $t=\sqrt x$ in II: $t^2-5t+4=0$, so $t=1$ or $4$, giving $x=1$ or $16$. Both are rational. II is true.
Answer: (b)""", pattern="2-Statement Combination", theme="Equations reducible to quadratics in root x")

Q(14, r"""How many numbers greater than 1000 can be formed using the digits 0, 1, 2 and 3 (repetition of digits is not allowed)?""",
  ["24", "18", "15", "12"], "B",
  "Algebra > Permutations and Combinations > Permutations", 20,
  r"""Step 1: Only 4-digit numbers can exceed 1000, and all four digits must be used once.
Step 2: The first digit cannot be 0: $3$ choices, then $3\times2\times1$ for the rest, giving $18$. The smallest such number, 1023, exceeds 1000.
Answer: (b)""", theme="Four-digit numbers without repetition")

Q(15, r"""If $p^{\text{th}}$ term of an AP is $k$, then what is the sum of $p^{\text{th}}$ term, $(p+q)^{\text{th}}$ term and $(p-q)^{\text{th}}$ term of the AP?""",
  ["2k", "3k", "4k", "5k"], "B",
  "Algebra > Sequences and Series > Arithmetic Progression", 15,
  r"""Step 1: $T_{p+q}=T_p+qd$ and $T_{p-q}=T_p-qd$, so $T_{p+q}+T_{p-q}=2k$.
Step 2: Adding $T_p=k$ gives $3k$.
Answer: (b)""", theme="Terms equidistant from the pth term")

P("u", "Questions 16-20", r"""For the next five (05) items that follow: Let $u$ be a positive integer and $f$ be a real number lying between 0 and 1. Further, $(\sqrt{2}+1)^{10}=u+f$ and $(\sqrt{2}-1)^{10}=v$.""")

Q(16, r"""Consider the following statements:

I. $(u+v+f)$ is an integer.
II. $(f+v)$ is an integer.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Algebra > Binomial Theorem > Expansion and General Term", 45,
  r"""Step 1: In $(\sqrt2+1)^{10}+(\sqrt2-1)^{10}$ the odd powers of $\sqrt2$ cancel, so $u+f+v=N$ is an integer. I is true.
Step 2: $u$ is an integer, so $f+v=N-u$ is an integer. As $0<f<1$ and $0<v<1$, $f+v=1$. II is true.
Answer: (c)""", pattern="2-Statement Combination", passage="u", theme="Integral and fractional parts of (root 2 + 1)^10")

Q(17, r"""What is the multiplicative inverse of $(\sqrt{2}+1)^{20}$?""",
  ["v", r"$v^{2}-1$", r"$v^{2}$", r"$v^{2}+1$"], "C",
  "Algebra > Binomial Theorem > Expansion and General Term", 25,
  r"""Step 1: $(\sqrt2+1)(\sqrt2-1)=1$, so $(\sqrt2+1)^{-20}=(\sqrt2-1)^{20}$.
Step 2: $(\sqrt2-1)^{20}=\big((\sqrt2-1)^{10}\big)^2=v^2$.
Answer: (c)""", pattern=L, passage="u", theme="Inverse of (root 2 + 1)^20")

Q(18, r"""What is the value of $(v+f)$?""",
  ["2", "1", "0.5", "0.25"], "B",
  "Algebra > Binomial Theorem > Expansion and General Term", 35,
  r"""Step 1: $u+f+v$ is an integer and $u$ is an integer, so $f+v$ is an integer.
Step 2: Since $0<f<1$ and $0<v<1$, $0<f+v<2$, so $f+v=1$.
Answer: (b)""", pattern=L, passage="u", theme="Sum of fractional part and conjugate power")

Q(19, r"""What is the value of $u$?""",
  ["9725", "6971", "6726", "6725"], "D",
  "Algebra > Binomial Theorem > Expansion and General Term", 55,
  r"""Concept: $T_k=x^{2k}+x^{-2k}$ with $x=\sqrt2+1$ satisfies $T_{k+1}=6T_k-T_{k-1}$, since $x^2+x^{-2}=6$.
Step 1: $T_0=2$, $T_1=6$, $T_2=34$, $T_3=198$, $T_4=1154$, $T_5=6726$.
Step 2: $u+f+v=6726$ and $f+v=1$, so $u=6725$.
Answer: (d)""", pattern=L, passage="u", theme="Integral part of (root 2 + 1)^10")

Q(20, r"""What is the value of $uv$?""",
  ["1", "2", r"$0<uv<1$", r"$1<uv<2$"], "C",
  "Algebra > Binomial Theorem > Expansion and General Term", 55,
  r"""Step 1: $(u+f)v=(\sqrt2+1)^{10}(\sqrt2-1)^{10}=1$.
Step 2: So $uv=1-fv=1-(1-v)v=1-v+v^2$.
Step 3: Since $0<v<1$, $v-v^2>0$, so $0<uv<1$.
Answer: (c)""", pattern=L, passage="u", theme="Product of integral part and conjugate power")

P("conic", "Questions 21-22", r"""For the next two (02) items that follow: The foci of the ellipse $px^{2}+16y^{2}=16p$ and the foci of the hyperbola $25(81x^{2}-144y^{2})=11664$ coincide (assume $p<16$).""")

Q(21, r"""What is the value of $p$?""",
  [r"$\sqrt{7}$", "3", "7", "9"], "C",
  "Analytical Geometry > Conic Sections > Ellipse", 40,
  r"""Step 1: Hyperbola: $\dfrac{x^2}{5.76}-\dfrac{y^2}{3.24}=1$, so $c^2=5.76+3.24=9$ and the foci are $(\pm3,0)$.
Step 2: Ellipse: $\dfrac{x^2}{16}+\dfrac{y^2}{p}=1$ with $p<16$, so its foci are $(\pm\sqrt{16-p},0)$.
Step 3: $16-p=9$ gives $p=7$.
Answer: (c)""", pattern=L, passage="conic", theme="Ellipse and hyperbola with common foci")

Q(22, r"""What is the difference between the eccentricities of the hyperbola and the ellipse?""",
  ["0.5", "0.75", "1.0", "1.25"], "A",
  "Analytical Geometry > Conic Sections > Hyperbola", 40,
  r"""Step 1: Hyperbola: $a=2.4$, $c=3$, so $e=1.25$.
Step 2: Ellipse: $a=4$, $c=3$, so $e=0.75$.
Step 3: Difference $=1.25-0.75=0.5$.
Answer: (a)""", pattern=L, passage="conic", theme="Eccentricities of a confocal ellipse and hyperbola")

P("sphere", "Questions 23-24", r"""For the next two (02) items that follow: The equation of the sphere S is $x^{2}+y^{2}+z^{2}-4x-6y-12z+k=0$.""")

Q(23, r"""What is the radius of the sphere passing through origin and concentric with the sphere S?""",
  [r"$\frac{7}{2}$", "5", "7", "Cannot be determined due to insufficient data"], "C",
  "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 20,
  r"""Step 1: The centre of S is $(2,3,6)$.
Step 2: The concentric sphere through the origin has radius $\sqrt{4+9+36}=7$.
Answer: (c)""", pattern=L, passage="sphere", theme="Concentric sphere through the origin")

Q(24, r"""If the radius of the sphere S is 8 units, what is the value of $k$?""",
  ["$-15$", "7", "10", "15"], "A",
  "Analytical Geometry > Three-dimensional Geometry > Distance and Angle in Space", 20,
  r"""Step 1: Radius$^2=2^2+3^2+6^2-k=49-k$.
Step 2: $49-k=64$ gives $k=-15$.
Answer: (a)""", pattern=L, passage="sphere", theme="Radius of a sphere from its general equation")

P("unitv", "Questions 25-26", r"""For the next two (02) items that follow: Let $\vec{a}$, $\vec{b}$, $\vec{c}$, $\vec{a}+\vec{b}$, $\vec{b}+\vec{c}$, $\vec{a}+\vec{b}+\vec{c}$ be unit vectors.""")

Q(25, r"""What is the angle between $\vec{a}$ and $\vec{b}$?""",
  [r"$\frac{\pi}{6}$", r"$\frac{\pi}{4}$", r"$\frac{\pi}{2}$", r"$\frac{2\pi}{3}$"], "D",
  "Vector Algebra > Vectors > Scalar (Dot) Product", 30,
  r"""Step 1: $|\vec a+\vec b|^2=1+1+2\vec a\cdot\vec b=1$, so $\vec a\cdot\vec b=-\dfrac12$.
Step 2: $\cos\theta=-\dfrac12$, so $\theta=\dfrac{2\pi}{3}$.
Answer: (d)""", pattern=L, passage="unitv", theme="Angle between unit vectors whose sum is a unit vector")

Q(26, r"""What is the angle between $\vec{a}$ and $\vec{c}$?""",
  [r"$\frac{\pi}{6}$", r"$\frac{\pi}{4}$", r"$\frac{\pi}{2}$", r"$\frac{2\pi}{3}$"], "C",
  "Vector Algebra > Vectors > Scalar (Dot) Product", 40,
  r"""Step 1: As in the previous item, $\vec a\cdot\vec b=\vec b\cdot\vec c=-\dfrac12$.
Step 2: $|\vec a+\vec b+\vec c|^2=3+2(\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a)=1$, so $3+2(-1+\vec c\cdot\vec a)=1$ and $\vec c\cdot\vec a=0$.
Step 3: The angle is $\dfrac{\pi}{2}$.
Answer: (c)""", pattern=L, passage="unitv", theme="Angle from the magnitude of a three-vector sum")

P("cross", "Questions 27-28", r"""For the next two (02) items that follow: Let $\vec{a}\times\vec{b}=\vec{c}$ and $\vec{b}\times\vec{c}=\vec{a}$.""")

Q(27, r"""Consider the following statements:

I. $\vec{a}$, $\vec{b}$, $\vec{c}$ are orthogonal in pairs.
II. $\vec{a}$, $\vec{b}$, $\vec{c}$ are unit vectors.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "A",
  "Vector Algebra > Vectors > Vector (Cross) Product", 50,
  r"""Step 1: $\vec c=\vec a\times\vec b$ is perpendicular to $\vec a$ and $\vec b$; $\vec a=\vec b\times\vec c$ is perpendicular to $\vec b$. So the three are pairwise orthogonal. I is true.
Step 2: Then $|\vec c|=|\vec a||\vec b|$ and $|\vec a|=|\vec b||\vec c|$, which give $|\vec b|=1$ and $|\vec a|=|\vec c|$, but $|\vec a|$ can be any positive value. So II need not hold.
Answer: (a)""", pattern="2-Statement Combination", passage="cross", theme="Vectors with cyclic cross products")

Q(28, r"""Consider the following statements:

I. $(\vec{a}\times\vec{b})\cdot\vec{c}+(\vec{b}\times\vec{c})\cdot\vec{a}=(\vec{c}\times\vec{a})\cdot\vec{b}$
II. $\{(\vec{a}\times\vec{b})\times(\vec{b}\times\vec{c})\}\cdot\vec{b}=1$

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Vector Algebra > Vectors > Scalar Triple Product", 65,
  r"""Step 1: Each scalar triple product equals $[\vec a\,\vec b\,\vec c]=\vec c\cdot\vec c=|\vec c|^2\neq0$. Statement I reads $2[\vec a\,\vec b\,\vec c]=[\vec a\,\vec b\,\vec c]$, which is false.
Step 2: $(\vec a\times\vec b)\times(\vec b\times\vec c)=\vec c\times\vec a=\vec c\times(\vec b\times\vec c)=|\vec c|^2\vec b$ (using $\vec b\perp\vec c$). Dotting with $\vec b$ gives $|\vec c|^2|\vec b|^2=|\vec c|^2$.
Step 3: The previous item shows $|\vec c|$ need not be 1, so II does not hold in general.
Answer: (d)""", pattern="2-Statement Combination", passage="cross", theme="Triple products for cyclic cross-product vectors")

P("pqr", "Questions 29-30", r"""For the next two (02) items that follow: Let $\vec{a}$, $\vec{b}$, $\vec{c}$ be unit vectors. Further, $\vec{a}$ is perpendicular to $\vec{b}$; $\vec{c}$ makes an angle $\frac{\pi}{3}$ with both $\vec{a}$ and $\vec{b}$; and $\vec{c}=p\vec{a}+q\vec{b}+r(\vec{a}\times\vec{b})$.""")

Q(29, r"""What is the value of $(p+q)$?""",
  [r"$\frac{1}{2}$", "1", r"$\frac{3}{2}$", "2"], "B",
  "Vector Algebra > Vectors > Scalar (Dot) Product", 30,
  r"""Step 1: Dot both sides with $\vec a$: $\vec c\cdot\vec a=p$, so $p=\cos\dfrac{\pi}{3}=\dfrac12$.
Step 2: Dot with $\vec b$: $q=\dfrac12$.
Step 3: $p+q=1$.
Answer: (b)""", pattern=L, passage="pqr", theme="Components of a vector along an orthonormal frame")

Q(30, r"""What is the value of $r^{2}$?""",
  ["4", "2", "1", r"$\frac{1}{2}$"], "D",
  "Vector Algebra > Vectors > Vector (Cross) Product", 35,
  r"""Step 1: $\vec a$, $\vec b$, $\vec a\times\vec b$ are mutually perpendicular unit vectors.
Step 2: $|\vec c|^2=p^2+q^2+r^2=1$, so $r^2=1-\dfrac14-\dfrac14=\dfrac12$.
Answer: (d)""", pattern=L, passage="pqr", theme="Component along a x b")

Q(31, r"""Let $p$, $q$ and $r$ be three unequal numbers such that $p$, $q$ and $r$ are in AP. If $(q-p)$, $(r-q)$ and $p$ are in GP, then $(p+q):(q+r):(r+p)$ equals""",
  ["1 : 2 : 3", "3 : 4 : 5", "3 : 5 : 4", "1 : 3 : 2"], "C",
  "Algebra > Sequences and Series > Geometric Progression", 35,
  r"""Step 1: Let the common difference be $d\neq0$, so $q-p=r-q=d$.
Step 2: $d$, $d$, $p$ in GP gives $d^2=dp$, so $p=d$, $q=2d$, $r=3d$.
Step 3: $(p+q):(q+r):(r+p)=3d:5d:4d=3:5:4$.
Answer: (c)""", theme="AP whose differences form a GP")

Q(32, r"""If $p$, $g_{1}$, $g_{2}$ and $q$ are in GP and $m$ is the arithmetic mean of $p$ and $q$, then $\frac{g_{1}^{2}}{g_{2}}+\frac{g_{2}^{2}}{g_{1}}$ is equal to""",
  ["m", "2m", "1", r"$\frac{1}{2}$"], "B",
  "Algebra > Sequences and Series > Special Series and Means", 30,
  r"""Step 1: With ratio $R$: $g_1=pR$, $g_2=pR^2$, $q=pR^3$.
Step 2: $\dfrac{g_1^2}{g_2}=p$ and $\dfrac{g_2^2}{g_1}=pR^3=q$.
Step 3: The sum is $p+q=2m$.
Answer: (b)""", theme="Geometric means and arithmetic mean")

Q(33, r"""Consider the following inequalities:

I. $1+4i>3+2i$
II. $2+3i<3+4i$
III. $4+3i>3+4i$

where $i=\sqrt{-1}$. How many of the above are valid?""",
  ["None", "One", "Two", "All the three"], "A",
  "Algebra > Complex Numbers > Algebra of Complex Numbers", 25,
  r"""Concept: the complex numbers are not an ordered field; $a>b$ is defined only when both are real.
Step 1: Each pair here has non-zero imaginary parts, so none of these inequalities is meaningful.
Answer: (a)""", pattern="Statement Count", theme="Order relation on complex numbers")

Q(34, r"""Let $Z_{1}$ and $Z_{2}$ be complex numbers such that $\frac{3Z_{1}}{4Z_{2}}$ is purely imaginary. What is $\left|\frac{Z_{1}+Z_{2}}{Z_{1}-Z_{2}}\right|$ equal to?""",
  ["2", r"$\frac{3}{2}$", r"$\frac{5}{4}$", "1"], "D",
  "Algebra > Complex Numbers > Modulus, Argument and Polar Form", 35,
  r"""Step 1: $\dfrac{Z_1}{Z_2}=it$ for some real $t$.
Step 2: $\left|\dfrac{Z_1+Z_2}{Z_1-Z_2}\right|=\dfrac{|it+1|}{|it-1|}=\dfrac{\sqrt{t^2+1}}{\sqrt{t^2+1}}=1$.
Answer: (d)""", theme="Modulus when Z1/Z2 is purely imaginary")

Q(35, r"""If $\alpha$, $\beta$, $\gamma$ are cube roots of $-8$, then what is $\frac{\alpha^{2}p^{2}+\beta^{2}q^{2}+\gamma^{2}r^{2}}{\beta^{2}p^{2}+\gamma^{2}q^{2}+\alpha^{2}r^{2}}$ equal to?""",
  [r"$\frac{\gamma}{\alpha}$", r"$\frac{\gamma}{\beta}$", r"$\frac{2\gamma}{\alpha}$", r"$\frac{2\gamma}{\beta}$"], "B",
  "Algebra > Complex Numbers > Cube Roots of Unity", 60,
  r"""Step 1: Take $\alpha=-2$, $\beta=-2\omega$, $\gamma=-2\omega^2$, so $\alpha^2=4$, $\beta^2=4\omega^2$, $\gamma^2=4\omega$.
Step 2: Numerator $=4(p^2+\omega^2q^2+\omega r^2)$; denominator $=4(\omega^2p^2+\omega q^2+r^2)=4\omega^2(p^2+\omega^2q^2+\omega r^2)$.
Step 3: The ratio is $\dfrac{1}{\omega^2}=\omega=\dfrac{\gamma}{\beta}$. The same result holds if $\beta$ and $\gamma$ are interchanged.
Answer: (b)""", theme="Cube roots of -8 and omega")

Q(36, r"""The sum of the first $n$ terms of an AP is $3n^{2}+5n$. If the $m^{\text{th}}$ term of the AP is 68, then what is the value of $m$?""",
  ["9", "10", "11", "12"], "C",
  "Algebra > Sequences and Series > Arithmetic Progression", 15,
  r"""Step 1: $T_m=S_m-S_{m-1}=6m+2$.
Step 2: $6m+2=68$ gives $m=11$.
Answer: (c)""", theme="nth term from the sum formula")

Q(37, r"""A set $S$ contains $(2n+1)$ elements. If the number of subsets of $S$ which contain at most $n$ elements is 1024, then what is the value of $n$?""",
  ["10", "8", "6", "5"], "D",
  "Algebra > Permutations and Combinations > Combinations", 35,
  r"""Step 1: $\binom{2n+1}{k}=\binom{2n+1}{2n+1-k}$, so subsets with at most $n$ elements are exactly half of all $2^{2n+1}$ subsets.
Step 2: $2^{2n}=1024=2^{10}$, so $n=5$.
Answer: (d)""", theme="Counting subsets of bounded size")

Q(38, r"""What is the maximum number of points of intersection of 5 circles?""",
  ["10", "15", "20", "25"], "C",
  "Algebra > Permutations and Combinations > Combinations", 20,
  r"""Step 1: Two circles meet in at most 2 points.
Step 2: Number of pairs $=\binom52=10$, so the maximum is $2\times10=20$.
Answer: (c)""", theme="Maximum intersections of circles")

Q(39, r"""What is the greatest value of $r$ satisfying the inequality ${}^{15}C_{r+1}>2\times{}^{15}C_{r}$?""",
  ["2", "3", "4", "5"], "C",
  "Algebra > Permutations and Combinations > Combinations", 30,
  r"""Step 1: $\dfrac{{}^{15}C_{r+1}}{{}^{15}C_r}=\dfrac{15-r}{r+1}>2$.
Step 2: $15-r>2r+2$ gives $r<\dfrac{13}{3}$, so the greatest integer is $r=4$.
Answer: (c)""", theme="Ratio of consecutive binomial coefficients")

Q(40, r"""If $n={}^{m}C_{2}$, then what is ${}^{n}C_{2}$ equal to?""",
  [r"${}^{m+1}C_{4}$", r"$2\times{}^{m+1}C_{4}$", r"$3\times{}^{m+1}C_{4}$", r"${}^{m+2}C_{4}$"], "C",
  "Algebra > Permutations and Combinations > Combinations", 50,
  r"""Step 1: $n=\dfrac{m(m-1)}{2}$, so ${}^nC_2=\dfrac{n(n-1)}{2}=\dfrac{m(m-1)(m-2)(m+1)}{8}$.
Step 2: ${}^{m+1}C_4=\dfrac{(m+1)m(m-1)(m-2)}{24}$, so ${}^nC_2=3\times{}^{m+1}C_4$.
Check: $m=4$ gives $n=6$, ${}^6C_2=15=3\times{}^5C_4$.
Answer: (c)""", theme="Nested combinations")

Q(41, r"""If $\theta$ lies in the fourth quadrant and $3\cot\theta+4=0$, then what is the value of $\sin2\theta+\cos2\theta$?""",
  [r"$-\frac{31}{25}$", r"$-\frac{17}{25}$", "0", "1"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 25,
  r"""Step 1: $\cot\theta=-\dfrac43$ in the fourth quadrant gives $\sin\theta=-\dfrac35$, $\cos\theta=\dfrac45$.
Step 2: $\sin2\theta=-\dfrac{24}{25}$ and $\cos2\theta=\dfrac{16-9}{25}=\dfrac{7}{25}$.
Step 3: Sum $=-\dfrac{17}{25}$.
Answer: (b)""", theme="Double angles from cot in the fourth quadrant")

Q(42, r"""If $\cos\alpha+\cos\beta=0=\sin\alpha+\sin\beta$, $\alpha\neq\beta$, then what is a value of $\cos2\alpha+\cos2\beta+2\cos(\alpha+\beta)$?""",
  ["0", "1", "2", "4"], "A",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 40,
  r"""Step 1: The expression is the real part of $(e^{i\alpha}+e^{i\beta})^2=e^{2i\alpha}+e^{2i\beta}+2e^{i(\alpha+\beta)}$.
Step 2: The given conditions say $e^{i\alpha}+e^{i\beta}=0$, so the value is $0$.
Answer: (a)""", theme="Sum of cosines and sines both zero")

Q(43, r"""In a triangle $ABC$, $\sin A=\cos B+\cos C$, then what is $\tan\left(\frac{B}{2}\right)+\cot\left(\frac{B}{2}\right)$ equal to?""",
  ["1", r"$\sqrt{2}$", r"$\sqrt{3}$", "2"], "D",
  "Trigonometry > Properties of Triangles > Ratios of Sides and Angles", 60,
  r"""Step 1: $\cos B+\cos C=2\sin\dfrac A2\cos\dfrac{B-C}{2}$ and $\sin A=2\sin\dfrac A2\cos\dfrac A2$, so $\cos\dfrac A2=\cos\dfrac{B-C}{2}$ and $A=|B-C|$.
Step 2: With $A=B-C$, $B=A+C=\pi-B$, so $B=\dfrac{\pi}{2}$ (the intended right angle at $B$).
Step 3: $\tan\dfrac B2+\cot\dfrac B2=\dfrac{2}{\sin B}=2$.
Answer: (d)""", theme="Right-angled triangle from sin A = cos B + cos C")

Q(44, r"""Consider the following in respect of inverse circular functions:

I. $\sin^{-1}(-x)=-\sin^{-1}x$
II. $\cos^{-1}(-x)=\cos^{-1}x$
III. $\tan^{-1}(-x)=\pi-\tan^{-1}x$
IV. $\cot^{-1}(-x)=\pi-\cot^{-1}x$

How many of the above are correct?""",
  ["One", "Two", "Three", "All the four"], "B",
  "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 20,
  r"""Step 1: I is correct ($\sin^{-1}$ is odd). IV is correct.
Step 2: II is wrong: $\cos^{-1}(-x)=\pi-\cos^{-1}x$. III is wrong: $\tan^{-1}(-x)=-\tan^{-1}x$.
Step 3: Two are correct.
Answer: (b)""", pattern="Statement Count", theme="Inverse trigonometric functions of -x")

Q(45, r"""What is $\tan\left[2\tan^{-1}\frac{1}{2}-\frac{\pi}{4}\right]$ equal to?""",
  ["$-7$", "0", r"$\frac{1}{5}$", r"$\frac{1}{7}$"], "D",
  "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 30,
  r"""Step 1: $\tan\left(2\tan^{-1}\dfrac12\right)=\dfrac{2\cdot\frac12}{1-\frac14}=\dfrac43$.
Step 2: $\tan\left(\theta-\dfrac{\pi}{4}\right)=\dfrac{\frac43-1}{1+\frac43}=\dfrac17$.
Answer: (d)""", theme="tan of a combination of inverse tangents")

Q(46, r"""The angles $A$, $B$ and $C$ of a triangle are in the ratio $1:1:4$. If the longest side of the triangle is 3 units, then what is the perimeter of the triangle?""",
  [r"$3+\sqrt{3}$ units", r"$3+2\sqrt{3}$ units", r"$3+3\sqrt{3}$ units", r"$6+\sqrt{3}$ units"], "B",
  "Trigonometry > Properties of Triangles > Sine and Cosine Rules", 30,
  r"""Step 1: The angles are $30^\circ$, $30^\circ$, $120^\circ$.
Step 2: Sine rule: $\dfrac{a}{\sin30^\circ}=\dfrac{3}{\sin120^\circ}=2\sqrt3$, so each shorter side is $\sqrt3$.
Step 3: Perimeter $=3+2\sqrt3$.
Answer: (b)""", theme="Perimeter from angle ratio and longest side")

Q(47, r"""In a triangle $ABC$, if $a$, $b$ and $c$ are the lengths of the sides opposite to the angles $A$, $B$ and $C$ respectively, then what is $\frac{\sin(A-B)}{\sin(A+B)}$ equal to?""",
  [r"$\frac{a^{2}}{a^{2}-b^{2}}$", r"$\frac{a^{2}}{a^{2}+b^{2}}$", r"$\frac{a^{2}-b^{2}}{c^{2}}$", r"$\frac{a^{2}-b^{2}}{b^{2}}$"], "C",
  "Trigonometry > Properties of Triangles > Sine and Cosine Rules", 40,
  r"""Step 1: $\sin(A-B)\sin(A+B)=\sin^2A-\sin^2B$ and $\sin(A+B)=\sin C$.
Step 2: $\dfrac{\sin(A-B)}{\sin(A+B)}=\dfrac{\sin^2A-\sin^2B}{\sin^2C}=\dfrac{a^2-b^2}{c^2}$ by the sine rule.
Answer: (c)""", theme="sin(A - B)/sin(A + B) in terms of sides")

Q(48, r"""What is the smallest positive $x$ satisfying $\log_{\sin x}\cos x+\log_{\cos x}\sin x=2$?""",
  [r"$\frac{\pi}{2}$", r"$\frac{\pi}{3}$", r"$\frac{\pi}{4}$", r"$\frac{\pi}{6}$"], "C",
  "Trigonometry > Trigonometric Equations > General Solutions", 30,
  r"""Step 1: Let $t=\log_{\sin x}\cos x$; then $t+\dfrac1t=2$, so $t=1$ and $\sin x=\cos x$.
Step 2: Both bases must be positive and not 1; the smallest positive solution is $x=\dfrac{\pi}{4}$.
Answer: (c)""", theme="Logarithmic trigonometric equation")

Q(49, r"""A plane is observed to be approaching the airport. It is at a distance of 10 km from the point of observation and makes an angle of elevation of $67.5^{\circ}$. What is the height of the plane above the ground?""",
  [r"$10\sqrt{2+\sqrt{2}}$ km", r"$10\sqrt{2-\sqrt{2}}$ km", r"$5\sqrt{2+\sqrt{2}}$ km", r"$5\sqrt{2-\sqrt{2}}$ km"], "C",
  "Trigonometry > Heights and Distances > Angles of Elevation and Depression", 40,
  r"""Step 1: The 10 km is the line-of-sight distance, so height $=10\sin67.5^\circ=10\cos22.5^\circ$.
Step 2: $\cos22.5^\circ=\dfrac{\sqrt{2+\sqrt2}}{2}$, so height $=5\sqrt{2+\sqrt2}$ km.
Answer: (c)""", theme="Height from line-of-sight distance at 67.5 degrees")

Q(50, r"""What is the length of the chord of a unit circle which subtends at the centre of the circle an angle of $45^{\circ}$?""",
  [r"$2\sqrt{2+\sqrt{2}}$ units", r"$2\sqrt{2-\sqrt{2}}$ units", r"$\sqrt{2+\sqrt{2}}$ units", r"$\sqrt{2-\sqrt{2}}$ units"], "D",
  "Analytical Geometry > Circles > Chords and Intersections", 30,
  r"""Step 1: Chord $=2r\sin\dfrac{\theta}{2}=2\sin22.5^\circ$.
Step 2: $\sin22.5^\circ=\dfrac{\sqrt{2-\sqrt2}}{2}$, so the chord is $\sqrt{2-\sqrt2}$ units.
Answer: (d)""", theme="Chord length subtending 45 degrees")

P("digits", "Questions 51-55", r"""For the next five (05) items that follow: A 4-digit number is selected at random formed by using the digits 0, 1, 2, 3 and 4 (where repetition of digits is not allowed).""")

_T = r"Total 4-digit numbers: $4\times4\times3\times2=96$ (first digit non-zero)."

Q(51, r"""What is the probability that the number selected is divisible by 2?""",
  [r"$\frac{5}{8}$", r"$\frac{3}{8}$", r"$\frac{1}{8}$", r"$\frac{5}{24}$"], "A",
  "Probability > Classical Probability > Events and Sample Space", 35,
  _T + r"""
Step 1: Last digit 0: $4\times3\times2=24$.
Step 2: Last digit 2 or 4: first digit has 3 choices, then $3\times2$: $18$ each, $36$ in all.
Step 3: $\dfrac{60}{96}=\dfrac58$.
Answer: (a)""", pattern=L, passage="digits", theme="Even 4-digit numbers from 0-4")

Q(52, r"""What is the probability that the number selected is divisible by 3?""",
  [r"$\frac{9}{28}$", r"$\frac{3}{8}$", r"$\frac{3}{16}$", r"$\frac{8}{25}$"], "B",
  "Probability > Classical Probability > Events and Sample Space", 40,
  _T + r"""
Step 1: The digits used must sum to a multiple of 3. The five digits sum to 10, so the omitted digit is 1 or 4.
Step 2: Digits $\{0,2,3,4\}$ or $\{0,1,2,3\}$: each gives $3\times3!=18$ numbers, $36$ in all.
Step 3: $\dfrac{36}{96}=\dfrac38$.
Answer: (b)""", pattern=L, passage="digits", theme="4-digit numbers divisible by 3 from 0-4")

Q(53, r"""What is the probability that the number selected is divisible by 4?""",
  [r"$\frac{1}{2}$", r"$\frac{7}{16}$", r"$\frac{9}{16}$", r"$\frac{5}{16}$"], "D",
  "Probability > Classical Probability > Events and Sample Space", 50,
  _T + r"""
Step 1: The last two digits must form 04, 12, 20, 24, 32 or 40.
Step 2: Endings 04, 20, 40 leave three non-zero digits: $3\times2=6$ each. Endings 12, 24, 32 leave a 0 among the remaining digits: $2\times2=4$ each. Total $18+12=30$.
Step 3: $\dfrac{30}{96}=\dfrac{5}{16}$.
Answer: (d)""", pattern=L, passage="digits", theme="4-digit numbers divisible by 4 from 0-4")

Q(54, r"""What is the probability that the number selected is divisible by 6?""",
  [r"$\frac{7}{48}$", r"$\frac{2}{3}$", r"$\frac{1}{4}$", r"$\frac{3}{8}$"], "C",
  "Probability > Classical Probability > Events and Sample Space", 50,
  _T + r"""
Step 1: Divisible by 6 means digit set $\{0,2,3,4\}$ or $\{0,1,2,3\}$ with an even last digit.
Step 2: $\{0,2,3,4\}$: last digit 0 gives 6; last 2 gives 4; last 4 gives 4; total 14. $\{0,1,2,3\}$: last 0 gives 6; last 2 gives 4; total 10.
Step 3: $\dfrac{24}{96}=\dfrac14$.
Answer: (c)""", pattern=L, passage="digits", theme="4-digit numbers divisible by 6 from 0-4")

Q(55, r"""What is the probability that the number selected does not contain zero at any position?""",
  ["0.12", "0.25", "0.375", "0.45"], "B",
  "Probability > Classical Probability > Events and Sample Space", 20,
  _T + r"""
Step 1: Without 0, the digits are 1, 2, 3, 4 in any order: $4!=24$.
Step 2: $\dfrac{24}{96}=0.25$.
Answer: (b)""", pattern=L, passage="digits", theme="4-digit numbers without zero")

P("events", "Questions 56-58", r"""For the next three (03) items that follow: Let $A$, $B$, $C$ and $D$ be mutually exclusive and exhaustive events and $\frac{P(A)}{2}=\frac{P(B)}{3}=\frac{P(C)}{5}=\frac{P(D)}{8}$.""")

_K = r"Since the events are mutually exclusive and exhaustive, $2k+3k+5k+8k=1$, so $k=\dfrac{1}{18}$."

Q(56, r"""What is $P(A)+P(B)+P(C)$ equal to?""",
  [r"$\frac{5}{9}$", r"$\frac{1}{18}$", r"$\frac{2}{21}$", r"$\frac{7}{13}$"], "A",
  "Probability > Classical Probability > Addition and Multiplication Rules", 20,
  _K + r"""
Step 1: $P(A)+P(B)+P(C)=10k=\dfrac{10}{18}=\dfrac59$.
Answer: (a)""", pattern=L, passage="events", theme="Probabilities in a given ratio")

Q(57, r"""What is $\frac{[2P(A)+3P(B)]}{[4P(C)+5P(D)]}$ equal to?""",
  [r"$\frac{13}{18}$", r"$\frac{13}{60}$", r"$\frac{4}{21}$", r"$\frac{5}{28}$"], "B",
  "Probability > Classical Probability > Addition and Multiplication Rules", 20,
  _K + r"""
Step 1: Numerator $=4k+9k=13k$; denominator $=20k+40k=60k$.
Step 2: Ratio $=\dfrac{13}{60}$.
Answer: (b)""", pattern=L, passage="events", theme="Ratio of weighted probabilities")

Q(58, r"""If $G$ is the geometric mean of $P(A)$, $P(B)$, $P(C)$ and $P(D)$, then what is $9G$ equal to?""",
  [r"$17^{\frac{1}{4}}$", r"$15^{\frac{1}{4}}$", r"$13^{\frac{1}{4}}$", r"$11^{\frac{1}{4}}$"], "B",
  "Probability > Classical Probability > Addition and Multiplication Rules", 40,
  _K + r"""
Step 1: $G=k(2\cdot3\cdot5\cdot8)^{1/4}=\dfrac{240^{1/4}}{18}$.
Step 2: $9G=\dfrac{240^{1/4}}{2}=\left(\dfrac{240}{16}\right)^{1/4}=15^{1/4}$.
Answer: (b)""", pattern=L, passage="events", theme="Geometric mean of four probabilities")
