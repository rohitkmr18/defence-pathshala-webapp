from qfmt import Q, P, F, W

# NDA II 2025 Mathematics, Set A (TODC-O-MTH/44A), booklet pages 3-15, Q1-40
Q(1, r"""If $p^{x}=q^{y}=r^{z}$, where $x$, $y$ and $z$ are in GP, then consider the following statements:

I. $p$, $q$ and $r$ are in AP.
II. $\ln p$, $\ln q$ and $\ln r$ are in GP.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "B",
  "Algebra > Sequences and Series > Geometric Progression", 40,
  r"""Concept: write each exponent through a common value $k$.
Step 1: Let $p^x=q^y=r^z=k$. Then $x=\dfrac{\ln k}{\ln p}$, $y=\dfrac{\ln k}{\ln q}$, $z=\dfrac{\ln k}{\ln r}$.
Step 2: $x,y,z$ in GP means $y^2=xz$, so $\dfrac{1}{(\ln q)^2}=\dfrac{1}{\ln p\,\ln r}$, i.e. $(\ln q)^2=\ln p\cdot\ln r$. So $\ln p,\ln q,\ln r$ are in GP and II is correct.
Step 3: This makes $p,q,r$ satisfy $q^{\ln q}=p^{\ln r}$, not $2q=p+r$; for example $p=e,\ q=e^2,\ r=e^4$ fits but is not an AP. I is not correct.
Answer: (b)""", pattern="2-Statement Combination", theme="Exponents with exponents in GP")

Q(2, r"""If $A$ and $B$ are non-empty subsets of a set, and $A^{c}$ and $B^{c}$ represent their complements, then which of the following is/are correct?

I. $A-B=B^{c}-A^{c}$
II. $A-B^{c}=A^{c}-B$

Select the answer using the code given below.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "A",
  "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 30,
  r"""Concept: $X-Y=X\cap Y^{c}$.
Step 1: $B^{c}-A^{c}=B^{c}\cap A=A-B$, so I is correct.
Step 2: $A-B^{c}=A\cap B$, while $A^{c}-B=A^{c}\cap B^{c}$. These are different in general, so II is not correct.
Answer: (a)""", pattern="2-Statement Combination", theme="Set difference with complements")

Q(3, r"""Let $y=x!$ and $z=(2x)!$. If $(z/y)=120$, then what is the value of $(3x)!$?""",
  ["362880", "181440", "90720", "45360"], "A",
  "Algebra > Permutations and Combinations > Counting Principles", 20,
  r"""Step 1: $\dfrac{(2x)!}{x!}=120$. Try $x=3$: $\dfrac{6!}{3!}=\dfrac{720}{6}=120$. So $x=3$.
Step 2: $(3x)!=9!=362880$.
Answer: (a)""", theme="Factorial equations")

Q(4, r"""Let $n$ be a natural number. The number of consecutive zeros at the end of the expansion of $n!$ is exactly 2. How many values of $n$ are possible?""",
  ["3", "4", "5", "More than 5"], "C",
  "Algebra > Number Systems > Divisibility and Remainders", 30,
  r"""Concept: trailing zeros of $n!$ equal $\lfloor n/5\rfloor+\lfloor n/25\rfloor+\dots$
Step 1: For $n=10,11,12,13,14$ the count is 2.
Step 2: For $n\le 9$ it is at most 1 and for $n=15$ it becomes 3.
Step 3: So there are 5 values.
Answer: (c)""", theme="Trailing zeros of a factorial")

Q(5, r"""If $(10+\log_{10}x)$, $(10+\log_{10}y)$ and $(10+\log_{10}z)$ are in AP, then consider the following statements:

I. The GM of $x$ and $z$ is $y^{2}$.
II. The AM of $\log_{10}x$ and $\log_{10}z$ is $\log_{10}y$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "B",
  "Algebra > Sequences and Series > Special Series and Means", 30,
  r"""Step 1: Subtracting 10 from each term keeps an AP, so $\log_{10}x,\log_{10}y,\log_{10}z$ are in AP. That is statement II.
Step 2: Then $2\log y=\log x+\log z$, so $y^2=xz$ and the GM of $x$ and $z$ is $\sqrt{xz}=y$, not $y^2$. I is not correct.
Answer: (b)""", pattern="2-Statement Combination", theme="Logarithms of terms in AP")

Q(6, r"""How many terms of the series $1+3+5+7+\dots$ amount to a sum equal to $12345678987654321$?""",
  ["11111111", "110000011", "111101111", "111111111"], "D",
  "Algebra > Sequences and Series > Arithmetic Progression", 25,
  r"""Concept: the sum of the first $n$ odd numbers is $n^2$.
Step 1: $111111111^2=12345678987654321$.
Step 2: So $n=111111111$.
Answer: (d)""", theme="Sum of first n odd numbers")

Q(7, r"""How many terms are identical in the two APs $19, 21, 23, \dots$ up to 110 terms and $19, 22, 25, 28, \dots$ up to 75 terms?""",
  ["35", "36", "37", "38"], "C",
  "Algebra > Sequences and Series > Arithmetic Progression", 40,
  r"""Step 1: Last terms: $19+109\times2=237$ and $19+74\times3=241$.
Step 2: Common terms form an AP starting at 19 with difference $\mathrm{lcm}(2,3)=6$, and they cannot exceed 237.
Step 3: $19+6(k-1)\le 237$ gives $k\le 37.3$, so there are 37 common terms.
Answer: (c)""", theme="Common terms of two APs")

Q(8, r"""If
$$\alpha=\dfrac{-1+\sqrt{-3}}{2}$$
then what is the value of $(1+\alpha^{19}-\alpha^{35})^{100}-(1-3\alpha^{25}+\alpha^{38})^{50}$?""",
  ["$-2$", "$-1$", "0", "2"], "C",
  "Algebra > Complex Numbers > Cube Roots of Unity", 45,
  r"""Concept: $\alpha=\omega$, with $\omega^3=1$ and $1+\omega+\omega^2=0$.
Step 1: $\omega^{19}=\omega$, $\omega^{35}=\omega^2$, so $1+\omega-\omega^2=-2\omega^2$. Its 100th power is $2^{100}\omega^{200}=2^{100}\omega^2$.
Step 2: $\omega^{25}=\omega$, $\omega^{38}=\omega^2$, so $1-3\omega+\omega^2=-4\omega$. Its 50th power is $4^{50}\omega^{50}=2^{100}\omega^2$.
Step 3: The difference is $0$.
Answer: (c)""", theme="Powers of omega")

Q(9, r"""What is the remainder when $5^{99}$ is divided by 13?""",
  ["10", "9", "8", "6"], "C",
  "Algebra > Number Systems > Divisibility and Remainders", 30,
  r"""Step 1: $5^2=25\equiv -1 \pmod{13}$, so $5^4\equiv 1$.
Step 2: $99=4\times24+3$, so $5^{99}\equiv 5^3=125\equiv 125-117=8$.
Answer: (c)""", theme="Remainder of a large power")

Q(10, r"""What is the value of the determinant of the inverse of the matrix $\begin{bmatrix}-4 & -5\\ 2 & 2\end{bmatrix}$?""",
  [r"$\dfrac{1}{2}$", "1", "2", "4"], "A",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 15,
  r"""Step 1: $|A|=(-4)(2)-(-5)(2)=-8+10=2$.
Step 2: $|A^{-1}|=\dfrac{1}{|A|}=\dfrac12$.
Answer: (a)""", theme="Determinant of an inverse")

Q(11, r"""In a class of 45 students, 34 like to play cricket and 26 like to play football. Further, each student likes to play at least one of the two games. How many students like to play exactly one game?""",
  ["45", "30", "25", "15"], "B",
  "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 15,
  r"""Step 1: Both games: $34+26-45=15$.
Step 2: Exactly one game: $45-15=30$.
Answer: (b)""", theme="Two-set Venn counting")

Q(12, r"""The system of equations
$$2x-3y-5=0,\quad 15y-10x+50=0$$""",
  ["has a unique solution", "has infinitely many solutions", "is inconsistent", "is consistent and has exactly two solutions"], "C",
  "Matrices and Determinants > Determinants > Linear Systems and Consistency", 20,
  r"""Step 1: Divide the second equation by $-5$: $2x-3y-10=0$.
Step 2: The lines $2x-3y=5$ and $2x-3y=10$ are parallel and distinct, so there is no solution.
Answer: (c)""", theme="Parallel lines and consistency")

Q(13, r"""If
$$\left(\dfrac{1-i}{1+i}\right)^{2m}\left(\dfrac{1+i}{1-i}\right)^{2n}=1$$
where $i=\sqrt{-1}$, then what is the smallest positive value of $(m-n)$?""",
  ["1", "2", "4", "8"], "B",
  "Algebra > Complex Numbers > Algebra of Complex Numbers", 35,
  r"""Step 1: $\dfrac{1-i}{1+i}=-i$ and $\dfrac{1+i}{1-i}=i$.
Step 2: $(-i)^{2m}=(-1)^m$ and $i^{2n}=(-1)^n$, so the product is $(-1)^{m+n}=1$.
Step 3: $m+n$ must be even, so $m-n$ is even. The smallest positive value is 2.
Answer: (b)""", theme="Powers of (1-i)/(1+i)")

Q(14, r"""In obtaining the solution of the system of equations $x+y+z=7$, $x+2y+3z=16$ and $x+3y+4z=22$ by Cramer's rule, the value of $y$ is obtained by dividing $D$ by $D_{2}$, where
$$D=\begin{vmatrix}1&1&1\\1&2&3\\1&3&4\end{vmatrix}$$
What is the value of the determinant $D_{2}$?""",
  ["$-13$", "$-3$", "3", "13"], "B",
  "Matrices and Determinants > Determinants > Linear Systems and Consistency", 35,
  r"""Concept: in Cramer's rule $D_2$ replaces the second column of $D$ by the constants, and $y=D_2/D$.
Step 1: $D_2=\begin{vmatrix}1&7&1\\1&16&3\\1&22&4\end{vmatrix}=1(64-66)-7(4-3)+1(22-16)=-2-7+6=-3$.
Step 2: Check: $D=-1$, so $y=3$, which satisfies all three equations with $x=2,\ z=2$.
Answer: (b)""", theme="Cramer's rule determinant")

Q(15, r"""Consider the following in respect of non-singular matrices $A$ and $B$:

I. $(AB)^{-1}=A^{-1}B^{-1}$
II. $(BA)(AB)^{-1}=I$, where $I$ is the identity matrix
III. $(AB)^{T}=A^{T}B^{T}$

How many of the above are correct?""",
  ["None", "One", "Two", "All three"], "A",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 30,
  r"""Step 1: $(AB)^{-1}=B^{-1}A^{-1}$, so I is wrong in general.
Step 2: $(BA)(AB)^{-1}=BAB^{-1}A^{-1}$, which is $I$ only when $A$ and $B$ commute. II is wrong in general.
Step 3: $(AB)^T=B^TA^T$, so III is wrong in general.
Answer: (a)""", pattern="Statement Count", theme="Reversal law for inverse and transpose")

Q(16, r"""The value of the determinant
$$\begin{vmatrix}a&b&c\\l&m&n\\p&q&r\end{vmatrix}$$
is equal to""",
  [r"$\begin{vmatrix}a&b&c\\p&q&r\\l&m&n\end{vmatrix}$", r"$\begin{vmatrix}l&m&n\\a&b&c\\p&q&r\end{vmatrix}$",
   r"$\begin{vmatrix}p&q&r\\a&b&c\\l&m&n\end{vmatrix}$", r"$\begin{vmatrix}a&p&l\\b&q&m\\c&r&n\end{vmatrix}$"], "C",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 40,
  r"""Concept: one row swap changes the sign; a cyclic shift of three rows is two swaps and keeps the sign.
Step 1: (a) and (b) are each one swap away, so they equal the negative.
Step 2: (c) has rows in the order $R_3,R_1,R_2$, a cyclic shift, so it is equal.
Step 3: (d) is the transpose of (a), so it also equals the negative.
Answer: (c)""", theme="Row interchanges in a determinant")

Q(17, r"""Let $1,\omega,\omega^{2}$ be three cube roots of unity. If $x=a+b$, $y=a\omega+b\omega^{2}$, $z=a\omega^{2}+b\omega$, then what is $x^{2}+y^{2}+z^{2}$ equal to?""",
  ["$6ab$", "$3ab$", "$a^{2}+b^{2}$", "1"], "A",
  "Algebra > Complex Numbers > Cube Roots of Unity", 40,
  r"""Step 1: Expand: $x^2+y^2+z^2=a^2(1+\omega^2+\omega^4)+b^2(1+\omega^4+\omega^2)+2ab(1+\omega^3+\omega^3)$.
Step 2: $1+\omega+\omega^2=0$ and $\omega^3=1$, so this is $0+0+2ab\cdot3=6ab$.
Answer: (a)""", theme="Sum of squares with omega")

Q(18, r"""How many 4-digit numbers that are divisible by 4 can be formed using the digits 1, 2, 3 and 4 (repetition of digits is not allowed)?""",
  ["3", "6", "9", "12"], "B",
  "Algebra > Permutations and Combinations > Permutations", 25,
  r"""Concept: a number is divisible by 4 when its last two digits are.
Step 1: Possible endings from distinct digits: 12, 24, 32.
Step 2: Each leaves two digits for the first two places in $2!$ ways, giving $3\times2=6$.
Answer: (b)""", theme="Divisibility by 4 with distinct digits")

Q(19, r"""If $a$, $b$, $c$ are the sides of a triangle $ABC$ and $p$ is the perimeter of the triangle, then what is
$$\begin{vmatrix}p+c&a&b\\c&p+a&b\\c&a&p+b\end{vmatrix}$$
equal to?""",
  ["$p^{3}$", "$2p^{3}$", "$3p^{3}$", "$4p^{3}$"], "B",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 45,
  r"""Step 1: $C_1\to C_1+C_2+C_3$: every entry becomes $p+a+b+c=2p$. Take $2p$ out.
Step 2: The determinant becomes $2p\begin{vmatrix}1&a&b\\1&p+a&b\\1&a&p+b\end{vmatrix}$.
Step 3: $R_2-R_1$ and $R_3-R_1$ give $2p\begin{vmatrix}1&a&b\\0&p&0\\0&0&p\end{vmatrix}=2p\cdot p^2=2p^3$.
Answer: (b)""", theme="Determinant with row-sum factor")

Q(20, r"""Which one of the following is the greatest coefficient in the expansion of $(1+x)^{100}$?""",
  ["The coefficient of $x^{100}$", "The coefficient of $x^{99}$", "The coefficient of $x^{51}$", "The coefficient of $x^{50}$"], "D",
  "Algebra > Binomial Theorem > Coefficients and Middle Terms", 15,
  r"""Concept: $\binom{n}{r}$ is largest at the middle, $r=n/2$ for even $n$.
Step 1: For $n=100$ the largest coefficient is $\binom{100}{50}$, the coefficient of $x^{50}$.
Answer: (d)""", theme="Greatest binomial coefficient")

P("loga", "Quadratic with logarithmic coefficients",
  r"""Let $\alpha$ and $\beta$ be the roots of the quadratic equation
$$x^{2}+(\log_{0.5}(a^{2}))x+(\log_{0.5}(a^{2}))^{4}=0$$
where $a^{2}\neq1$ and $\log_{0.5}(a^{2})>0$. Further, $\beta^{2}=\alpha(\log_{a^{2}}(0.5))$.""")

Q(21, r"""What is $\beta$ equal to?""",
  [r"$\log_{a^{2}}(0.5)$", r"$\log_{0.5}(a^{2})$", r"$2(\log_{a^{2}}(0.5))$", r"$2\log_{0.5}(a^{2})$"], "B",
  "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 55,
  r"""Concept: $\log_{a^2}(0.5)=\dfrac{1}{\log_{0.5}(a^2)}$.
Step 1: Let $L=\log_{0.5}(a^2)>0$. The product of roots gives $\alpha\beta=L^4$, and the given relation is $\beta^2=\alpha/L$.
Step 2: Multiply the relation by $\beta$: $\beta^3=\alpha\beta/L=L^3$, so $\beta=L=\log_{0.5}(a^2)$.
Note: the data of this item set are not fully consistent (the sum of roots cannot also hold for real $L$), but $\beta$ follows from the product of roots and the given relation.
Answer: (b)""", passage="loga", pattern="Linked Item Set", theme="Root from product of roots and a given relation")

Q(22, r"""What is the relation between $\alpha$ and $\beta$?""",
  [r"$\alpha=2\beta$", r"$2\alpha=\beta$", r"$\alpha=-2\beta$", r"$2\alpha=-\beta$"], "C",
  "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 60,
  r"""Step 1: From the previous item, $\beta=L$. The sum of roots gives $\alpha+\beta=-L$, so $\alpha=-2L=-2\beta$.
Step 2: However, the product of roots then gives $\alpha=L^4/\beta=L^3$, and $L^3=-2L$ has no positive real solution. The printed data contradict each other.
Answer: (c), using the sum of roots (the item is withheld because the data are inconsistent)""", passage="loga", pattern="Linked Item Set", theme="Relation between roots")
W(22, "Printed data are inconsistent: product of roots gives alpha = L^3 while sum of roots gives alpha = -2L; no real L > 0 satisfies both.")
F(21, "Item set data are inconsistent; beta = L follows from product of roots. Check UPSC final key.")

P("logsum", "Sums of logarithms",
  r"""Let $p=\sum_{j=1}^{n}\log_{10}2^{j}$ and $q=\sum_{j=1}^{n}\log_{10}5^{j}$.""")

Q(23, r"""If $p+q=66$, then which one of the following is correct?""",
  ["$n<7$", "$7<n<9$", "$9<n<12$", "$n>12$"], "C",
  "Algebra > Logarithms and Indices > Laws of Logarithms", 30,
  r"""Step 1: $p=\log_{10}2\cdot\dfrac{n(n+1)}{2}$ and $q=\log_{10}5\cdot\dfrac{n(n+1)}{2}$.
Step 2: $p+q=\log_{10}10\cdot\dfrac{n(n+1)}{2}=\dfrac{n(n+1)}{2}=66$, so $n=11$.
Answer: (c)""", passage="logsum", pattern="Linked Item Set", theme="Sum of logarithms of powers")

Q(24, r"""If $p+q=15$, then what is $q-p$ equal to?""",
  [r"$\log_{10}2.5$", r"$5\log_{10}2.5$", r"$10\log_{10}2.5$", r"$15\log_{10}2.5$"], "D",
  "Algebra > Logarithms and Indices > Laws of Logarithms", 30,
  r"""Step 1: $p+q=\dfrac{n(n+1)}{2}=15$.
Step 2: $q-p=(\log_{10}5-\log_{10}2)\cdot\dfrac{n(n+1)}{2}=15\log_{10}2.5$.
Answer: (d)""", passage="logsum", pattern="Linked Item Set", theme="Difference of logarithmic sums")

P("sincos", "Sum of sines and cosines", r"""Let $\sin A+\sin B=p$ and $\cos A+\cos B=q$.""")

Q(25, r"""What is $\dfrac{p}{q}$ equal to?""",
  [r"$\tan\left(\dfrac{A-B}{2}\right)$", r"$\cot\left(\dfrac{A-B}{2}\right)$", r"$\tan\left(\dfrac{A+B}{2}\right)$", r"$\cot\left(\dfrac{A+B}{2}\right)$"], "C",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 25,
  r"""Step 1: $p=2\sin\dfrac{A+B}{2}\cos\dfrac{A-B}{2}$ and $q=2\cos\dfrac{A+B}{2}\cos\dfrac{A-B}{2}$.
Step 2: $\dfrac pq=\tan\dfrac{A+B}{2}$.
Answer: (c)""", passage="sincos", pattern="Linked Item Set", theme="Sum-to-product ratio")

Q(26, r"""What is $\dfrac{p^{2}-q^{2}}{p^{2}+q^{2}}$ equal to?""",
  [r"$\cos(A+B)$", r"$\cos(A-B)$", r"$\cos\left(\dfrac{\pi}{2}-A-B\right)$", r"$\cos(\pi-A-B)$"], "D",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 45,
  r"""Step 1: $p^2+q^2=2+2\cos(A-B)$.
Step 2: $q^2-p^2=\cos2A+\cos2B+2\cos(A+B)=2\cos(A+B)\,[\cos(A-B)+1]$.
Step 3: So $\dfrac{p^2-q^2}{p^2+q^2}=-\cos(A+B)=\cos(\pi-A-B)$.
Answer: (d)""", passage="sincos", pattern="Linked Item Set", theme="Ratio of p squared minus q squared")

P("cosec", "Cosecants of complementary angles", r"""Let $p=\operatorname{cosec}20^\circ$ and $q=\operatorname{cosec}70^\circ$.""")

Q(27, r"""What is $\left(\dfrac{\sqrt3\,p}{4}-\dfrac{q}{4}\right)$ equal to?""",
  ["$-1$", "0", "1", "2"], "C",
  "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 45,
  r"""Step 1: $q=\operatorname{cosec}70^\circ=\sec20^\circ$.
Step 2: $\dfrac{\sqrt3}{4\sin20^\circ}-\dfrac{1}{4\cos20^\circ}=\dfrac{\sqrt3\cos20^\circ-\sin20^\circ}{4\sin20^\circ\cos20^\circ}=\dfrac{2\sin40^\circ}{2\sin40^\circ}=1$.
Answer: (c)""", passage="cosec", pattern="Linked Item Set", theme="Combining cosec 20 and sec 20")

Q(28, r"""What is $\dfrac{p^{2}+q^{2}}{p^{2}q^{2}}$ equal to?""",
  [r"$\dfrac12$", "1", r"$\dfrac32$", "2"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 20,
  r"""Step 1: $\dfrac{p^2+q^2}{p^2q^2}=\dfrac{1}{q^2}+\dfrac{1}{p^2}=\cos^220^\circ+\sin^220^\circ=1$.
Answer: (b)""", passage="cosec", pattern="Linked Item Set", theme="Pythagorean identity")

P("coseq", "Simultaneous cosine equations",
  r"""Let $\cos(2x+3y)=\dfrac12$ and $\cos(3x+2y)=\dfrac{\sqrt3}{2}$, where $-\pi<(2x+3y)<\pi$ and $-\pi<(3x+2y)<\pi$.""")

Q(29, r"""How many values does $(x+y)$ have?""",
  ["Two", "Three", "Four", "More than four"], "C",
  "Trigonometry > Trigonometric Equations > Number of Solutions in an Interval", 45,
  r"""Step 1: $2x+3y=\pm\dfrac\pi3$ and $3x+2y=\pm\dfrac\pi6$.
Step 2: $5(x+y)$ is the sum, which can be $\dfrac\pi2,\dfrac\pi6,-\dfrac\pi6,-\dfrac\pi2$, four different values.
Answer: (c)""", passage="coseq", pattern="Linked Item Set", theme="Values of x + y")

Q(30, r"""How many values does $(y-x)$ have?""",
  ["Two", "Three", "Four", "More than four"], "C",
  "Trigonometry > Trigonometric Equations > Number of Solutions in an Interval", 45,
  r"""Step 1: $y-x=(2x+3y)-(3x+2y)$.
Step 2: The possible values are $\pm\dfrac\pi3\mp\dfrac\pi6$ in all sign choices: $\dfrac\pi6,\dfrac\pi2,-\dfrac\pi2,-\dfrac\pi6$, four values.
Answer: (c)""", passage="coseq", pattern="Linked Item Set", theme="Values of y - x")

P("eqroots", "Quadratic with equal roots", r"""Consider the equation
$$abx^{2}+bcx+ca=cax^{2}+abx+bc$$""")

Q(31, r"""If the roots of the equation are equal, then which one of the following is correct?""",
  ["$ac=b^{2}$", "$a+c=2b$", r"$\dfrac1a+\dfrac1c=\dfrac{1}{2b}$", r"$\dfrac1a+\dfrac1c=\dfrac2b$"], "D",
  "Algebra > Quadratic Equations and Inequalities > Nature of Roots", 50,
  r"""Step 1: Rearranged: $a(b-c)x^2+b(c-a)x+c(a-b)=0$. The coefficients add to 0, so $x=1$ is a root.
Step 2: Equal roots means both are 1, so the product $\dfrac{c(a-b)}{a(b-c)}=1$, giving $ca-cb=ab-ac$, i.e. $2ac=b(a+c)$.
Step 3: Divide by $abc$: $\dfrac2b=\dfrac1a+\dfrac1c$.
Answer: (d)""", passage="eqroots", pattern="Linked Item Set", theme="Condition for equal roots")

Q(32, r"""If the roots of the equation are equal, then $a$, $b$, $c$ are in""",
  ["AP", "GP", "HP", "None of the above"], "C",
  "Algebra > Sequences and Series > Special Series and Means", 30,
  r"""Step 1: From the previous item, $\dfrac2b=\dfrac1a+\dfrac1c$.
Step 2: So $\dfrac1a,\dfrac1b,\dfrac1c$ are in AP, which means $a,b,c$ are in HP.
Answer: (c)""", passage="eqroots", pattern="Linked Item Set", theme="Harmonic progression from equal roots")

P("apodd", "Equal sums of two series",
  r"""Let $(6+10+14+\dots$ up to $m$ terms$)=(1+3+5+7+\dots$ up to $n$ terms$)$, where $m<25$ and $n<25$.""")

Q(33, r"""What is the relation between $m$ and $n$?""",
  ["$n^{2}=m(m+1)$", "$n^{2}=m(m+2)$", "$n^{2}=2m(m+1)$", "$n^{2}=2m(m+2)$"], "D",
  "Algebra > Sequences and Series > Arithmetic Progression", 25,
  r"""Step 1: $6+10+14+\dots$ ($m$ terms) $=\dfrac m2[12+4(m-1)]=2m(m+2)$.
Step 2: The sum of the first $n$ odd numbers is $n^2$.
Step 3: So $n^2=2m(m+2)$.
Answer: (d)""", passage="apodd", pattern="Linked Item Set", theme="Equating two AP sums")

Q(34, r"""How many values of $m$ are possible?""",
  ["None", "One", "Two", "More than two"], "C",
  "Algebra > Sequences and Series > Arithmetic Progression", 50,
  r"""Step 1: $n<25$ means $2m(m+2)<625$, so $m\le16$.
Step 2: Checking $m=1$ to $16$, $2m(m+2)$ is a perfect square only for $m=2$ ($16=4^2$) and $m=16$ ($576=24^2$).
Answer: (c)""", passage="apodd", pattern="Linked Item Set", theme="Perfect square condition")

P("pts8", "Eight points with four collinear", r"""There are 8 points on a plane out of which 4 points are collinear.""")

Q(35, r"""How many triangles can be formed by joining these points?""",
  ["56", "54", "53", "52"], "D",
  "Algebra > Permutations and Combinations > Combinations", 20,
  r"""Step 1: All choices of 3 points: $\binom83=56$.
Step 2: Remove collinear triples: $\binom43=4$.
Step 3: Triangles: $56-4=52$.
Answer: (d)""", passage="pts8", pattern="Linked Item Set", theme="Triangles with collinear points")

Q(36, r"""How many quadrilaterals can be formed by joining these points?""",
  ["70", "69", "53", "None of the above"], "C",
  "Algebra > Permutations and Combinations > Combinations", 50,
  r"""Concept: a quadrilateral needs 4 points with no 3 collinear.
Step 1: All choices of 4 points: $\binom84=70$.
Step 2: Remove sets with 3 of the collinear points and 1 other: $\binom43\times4=16$; and the set of all 4 collinear points: 1.
Step 3: $70-16-1=53$.
Answer: (c)""", passage="pts8", pattern="Linked Item Set", theme="Quadrilaterals with collinear points")
F(36, "Some keys may treat 3-collinear sets differently (69 vs 53). DP key 53.")

P("fquad", "Quadratic through given values",
  r"""Let $f(x)=ax^{2}+bx+c$ be a quadratic polynomial such that $f(1)=f(4)=2$. Further, 2 is a root of $f(x)=0$.""")

Q(37, r"""What is the other root of $f(x)=0$?""",
  ["1", "2", "3", "Cannot be determined"], "C",
  "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 25,
  r"""Step 1: $f(1)=f(4)$ means the axis of symmetry is $x=\dfrac{1+4}{2}=2.5$.
Step 2: The roots are symmetric about 2.5, so the other root is $5-2=3$.
Answer: (c)""", passage="fquad", pattern="Linked Item Set", theme="Symmetry of a parabola")

Q(38, r"""What is $(a+b+c)$ equal to?""",
  ["0", "1", "2", "Cannot be determined"], "C",
  "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 15,
  r"""Step 1: $a+b+c=f(1)$.
Step 2: $f(1)=2$ is given.
Answer: (c)""", passage="fquad", pattern="Linked Item Set", theme="Sum of coefficients")

P("rotA", "Rotation matrix",
  r"""Let
$$A=\begin{bmatrix}\cos\theta&\sin\theta\\-\sin\theta&\cos\theta\end{bmatrix}$$""")

Q(39, r"""What is the value of the determinant of the matrix $A^{4}$?""",
  ["0", "1", r"$\cos4\theta-\sin4\theta$", r"$\cos^{2}4\theta-\sin^{2}4\theta$"], "B",
  "Matrices and Determinants > Matrices > Matrix Equations and Powers", 15,
  r"""Step 1: $|A|=\cos^2\theta+\sin^2\theta=1$.
Step 2: $|A^4|=|A|^4=1$.
Answer: (b)""", passage="rotA", pattern="Linked Item Set", theme="Determinant of a power")

Q(40, r"""What is $[\operatorname{adj}A]^{-1}$ equal to?""",
  ["$-A$", "$-A^{T}$", "$A$", "$A^{T}$"], "C",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 35,
  r"""Step 1: $\operatorname{adj}A=|A|A^{-1}=A^{-1}$ because $|A|=1$.
Step 2: $(\operatorname{adj}A)^{-1}=(A^{-1})^{-1}=A$.
Answer: (c)""", passage="rotA", pattern="Linked Item Set", theme="Inverse of the adjoint")
