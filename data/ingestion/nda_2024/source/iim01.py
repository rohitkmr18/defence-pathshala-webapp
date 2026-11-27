from qfmt import Q, P, F, W

# NDA II 2024 Mathematics, Set A (SURN-B-MTH/81A), booklet pages 3-19, Q1-50
S2 = "2-Statement Combination"
LS = "Linked Item Set"

Q(1, r"""Let $X$ be a matrix of order $3\times3$, $Y$ be a matrix of order $2\times3$ and $Z$ be a matrix of order $3\times2$. Which of the following statements are correct?

I. $(ZY)X$ is defined and is a square matrix of order 3.
II. $Y(XZ)$ is defined and is a square matrix of order 2.
III. $X(YZ)$ is not defined.

Select the answer using the code given below.""",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "D", "Matrices and Determinants > Matrices > Types and Operations", 25,
  r"""Step 1: $ZY$ is $3\times3$, so $(ZY)X$ is $3\times3$ (I).
Step 2: $XZ$ is $3\times2$, so $Y(XZ)$ is $2\times2$ (II).
Step 3: $YZ$ is $2\times2$, and a $3\times3$ matrix cannot multiply a $2\times2$ one, so $X(YZ)$ is not defined (III).
Answer: (d)""", pattern="3-Statement Combination", theme="Orders of matrix products")

Q(2, r"""Consider the following statements:

I. The set of all irrational numbers between $\sqrt{12}$ and $\sqrt{15}$ is an infinite set.
II. The set of all odd integers less than 1000 is a finite set.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "A", "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 20,
  r"""Step 1: Any interval of real numbers contains infinitely many irrationals, so I is correct.
Step 2: Odd integers less than 1000 include all negative odd integers, so the set is infinite. II is wrong.
Answer: (a)""", pattern=S2, theme="Finite and infinite sets")

Q(3, r"""How many 4-digit numbers are there having all digits as odd?""", ["625", "400", "196", "120"], "A",
  "Algebra > Permutations and Combinations > Counting Principles", 10,
  r"""Step 1: Each of the 4 places can be 1, 3, 5, 7 or 9: $5^4=625$.
Answer: (a)""", theme="Numbers with odd digits")

Q(4, r"""If $\omega\ne1$ is a cube root of unity, then what is $(1+\omega-\omega^{2})^{100}+(1-\omega+\omega^{2})^{100}$ equal to?""",
  [r"$2^{100}\omega^{2}$", r"$2^{100}\omega$", r"$2^{100}$", r"$-2^{100}$"], "D", "Algebra > Complex Numbers > Cube Roots of Unity", 35,
  r"""Step 1: $1+\omega-\omega^2=-2\omega^2$ and $1-\omega+\omega^2=-2\omega$.
Step 2: $(-2\omega^2)^{100}=2^{100}\omega^{200}=2^{100}\omega^2$ and $(-2\omega)^{100}=2^{100}\omega$.
Step 3: The sum is $2^{100}(\omega+\omega^2)=-2^{100}$.
Answer: (d)""", theme="Powers with omega")

Q(5, r"""Let $A$ and $B$ be two square matrices of same order. If $AB$ is a null matrix, then which one of the following is correct?""",
  ["Both $A$ and $B$ are null matrices", "Either $A$ or $B$ is a null matrix", "$B$ is a null matrix if $A$ is a non-singular matrix", "Both $A$ and $B$ are singular matrices"], "C",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 25,
  r"""Step 1: If $A$ is non-singular, multiply $AB=O$ on the left by $A^{-1}$: $B=O$.
Step 2: The other options fail in general (for example two non-zero singular matrices can have product $O$).
Answer: (c)""", theme="Zero product of matrices")

Q(6, r"""In the expansion of $(1+x)^{p}(1+x)^{q}$, if the coefficient of $x^{3}$ is 35, then what is the value of $(p+q)$?""",
  ["5", "6", "7", "8"], "C", "Algebra > Binomial Theorem > Coefficients and Middle Terms", 20,
  r"""Step 1: The product is $(1+x)^{p+q}$, so $\binom{p+q}{3}=35$.
Step 2: $\binom73=35$, so $p+q=7$.
Answer: (c)""", theme="Coefficient of x cubed")

Q(7, r"""If $p$ times the $p$th term of an AP is equal to $q$ times the $q$th term $(p\ne q)$, then what is the $(p+q)$th term equal to?""",
  ["0", "$p+q$", "$pq$", "$pq(p+q)$"], "A", "Algebra > Sequences and Series > Arithmetic Progression", 25,
  r"""Step 1: $p[a+(p-1)d]=q[a+(q-1)d]$ gives $(p-q)[a+(p+q-1)d]=0$.
Step 2: Since $p\ne q$, $a+(p+q-1)d=0$, which is the $(p+q)$th term.
Answer: (a)""", theme="Term from a product condition")

Q(8, r"""Let $p=\ln(x)$, $q=\ln(x^{3})$ and $r=\ln(x^{5})$, where $x>1$. Which of the following statements is/are correct?

I. $p$, $q$ and $r$ are in AP.
II. $p$, $q$ and $r$ can never be in GP.

Select the answer using the code given below.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C", "Algebra > Sequences and Series > Arithmetic Progression", 25,
  r"""Step 1: $p=L$, $q=3L$, $r=5L$ with $L=\ln x>0$: an AP with difference $2L$.
Step 2: A GP would need $9L^2=5L^2$, impossible as $L\ne0$.
Answer: (c)""", pattern=S2, theme="Logarithms in AP")

Q(9, r"""If
$$Z=\dfrac13\begin{vmatrix}i&2i&1\\2i&3i&2\\3&1&3\end{vmatrix}=x+iy;\quad i=\sqrt{-1}$$
then what is modulus of $Z$ equal to?""",
  ["1", r"$\sqrt2$", "2", r"$\sqrt3$"], "B", "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Step 1: Expanding, the determinant is $3+3i$.
Step 2: $Z=1+i$, so $|Z|=\sqrt2$.
Answer: (b)""", theme="Determinant with complex entries")

Q(10, r"""What is the value of the sum
$$\sum_{n=1}^{20}(i^{n-1}+i^{n}+i^{n+1})$$
where $i=\sqrt{-1}$?""",
  ["$-2i$", "0", "1", "$2i$"], "B", "Algebra > Complex Numbers > Algebra of Complex Numbers", 20,
  r"""Step 1: Any 4 consecutive powers of $i$ add to 0.
Step 2: Each of the three sums runs over 20 consecutive powers (a multiple of 4), so each is 0.
Answer: (b)""", theme="Sum of powers of i")

Q(11, r"""Let $x>1$, $y>1$, $z>1$ be in GP. Then
$$\dfrac1{1+\ln x},\ \dfrac1{1+\ln y},\ \dfrac1{1+\ln z}$$
are""",
  ["in AP", "in GP", "in HP", "neither in AP nor in GP nor in HP"], "C", "Algebra > Sequences and Series > Special Series and Means", 25,
  r"""Step 1: $x,y,z$ in GP means $\ln x,\ln y,\ln z$ are in AP, so $1+\ln x,1+\ln y,1+\ln z$ are in AP.
Step 2: Reciprocals of an AP are in HP.
Answer: (c)""", theme="Reciprocals of an AP")

Q(12, r"""If $\omega=-\dfrac12+i\dfrac{\sqrt3}2$, then what is
$$\begin{vmatrix}1+\omega&1+\omega^{2}&\omega+\omega^{2}\\1&\omega&\omega^{2}\\\dfrac1\omega&\dfrac1{\omega^{2}}&1\end{vmatrix}$$
equal to?""",
  ["0", r"$\omega$", r"$\omega^{2}$", r"$1-\omega^{2}$"], "A", "Algebra > Complex Numbers > Cube Roots of Unity", 30,
  r"""Step 1: Row 1 is $(-\omega^2,-\omega,-1)$ and row 3 is $(\omega^2,\omega,1)$.
Step 2: Row 1 $=-$Row 3, so the determinant is 0.
Answer: (a)""", theme="Proportional rows")

Q(13, r"""If the sum of the first $n$ terms of a series is $n(2n+1)$, then what is the $n$th term?""",
  ["$4n-1$", "$4n$", "$4n+1$", "$4n+3$"], "A", "Algebra > Sequences and Series > Arithmetic Progression", 15,
  r"""Step 1: $a_n=S_n-S_{n-1}=(2n^2+n)-(2n^2-3n+1)=4n-1$.
Answer: (a)""", theme="nth term from the sum")

Q(14, r"""In how many ways can the letters of the word INDIA be permuted such that in each combination, vowels should occupy odd positions?""",
  ["3", "6", "9", "12"], "B", "Algebra > Permutations and Combinations > Permutations", 25,
  r"""Step 1: The vowels I, I, A fill the 3 odd positions in $\dfrac{3!}{2!}=3$ ways.
Step 2: N and D fill the two even positions in $2$ ways. Total 6.
Answer: (b)""", theme="Vowels in odd positions")

Q(15, r"""The letters of the word EQUATION are arranged in such a way that all vowels as well as consonants are together. How many such arrangements are there?""",
  ["240", "720", "1440", "1620"], "C", "Algebra > Permutations and Combinations > Permutations", 20,
  r"""Step 1: Vowels E, U, A, I, O (block of 5) and consonants Q, T, N (block of 3).
Step 2: $2!\times5!\times3!=2\times120\times6=1440$.
Answer: (c)""", theme="Two blocks of letters")

Q(16, r"""If $n$ is a root of the equation $x^{2}+px+m=0$ and $m$ is a root of the equation $x^{2}+px+n=0$, where $m\ne n$, then what is the value of $p+m+n$?""",
  ["$-1$", "0", "1", "2"], "C", "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 30,
  r"""Step 1: $n^2+pn+m=0$ and $m^2+pm+n=0$. Subtract: $(n-m)(n+m+p-1)=0$.
Step 2: As $m\ne n$, $p+m+n=1$.
Answer: (c)""", theme="Cross-related roots")

Q(17, r"""In how many ways can a student choose $(n-2)$ courses out of $n$ courses if 2 courses are compulsory $(n>4)$?""",
  ["$(n-3)(n-4)$", "$(n-1)(n-2)$", "$(n-3)(n-4)/2$", "$(n-2)(n-3)/2$"], "D", "Algebra > Permutations and Combinations > Combinations", 20,
  r"""Step 1: After the 2 compulsory courses, choose $n-4$ from the other $n-2$.
Step 2: $\binom{n-2}{n-4}=\binom{n-2}2=\dfrac{(n-2)(n-3)}2$.
Answer: (d)""", theme="Selection with compulsory items")

Q(18, r"""If
$$D_n=\begin{vmatrix}n&20&30\\n^{2}&40&50\\n^{3}&60&70\end{vmatrix}$$
then what is the value of $\displaystyle\sum_{n=1}^{4}D_n$?""",
  ["$-10000$", "$-10$", "10", "10000"], "A", "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Step 1: Summing $D_n$ adds the first columns: $\sum n=10$, $\sum n^2=30$, $\sum n^3=100$.
Step 2: $\begin{vmatrix}10&20&30\\30&40&50\\100&60&70\end{vmatrix}=-10000$.
Answer: (a)""", theme="Sum of determinants")

Q(19, r"""Consider the following in respect of the matrices
$$P=\begin{bmatrix}0&c&-b\\-c&0&a\\b&-a&0\end{bmatrix}\ \text{and}\ Q=\begin{bmatrix}a^{2}&ab&ac\\ab&b^{2}&bc\\ac&bc&c^{2}\end{bmatrix}$$

I. $PQ$ is a null matrix.
II. $QP$ is an identity matrix of order 3.
III. $PQ=QP$

Which of the above is/are correct?""",
  ["I only", "II only", "I and III", "II and III"], "C", "Matrices and Determinants > Matrices > Types and Operations", 35,
  r"""Step 1: $Q=vv^T$ with $v=(a,b,c)^T$, and $Pv=0$ (it is the cross product $v\times v$ in matrix form). So $PQ=O$.
Step 2: Also $v^TP=0$, so $QP=O$ too. Then $PQ=QP$, but $QP$ is not the identity.
Answer: (c)""", pattern="3-Statement Combination", theme="Skew-symmetric times rank-one")

Q(20, r"""If $P$ is a skew-symmetric matrix of order 3, then what is $\det(P)$ equal to?""", ["$-1$", "0", "1", "3"], "B",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 15,
  r"""Step 1: $\det P=\det P^T=\det(-P)=(-1)^3\det P$, so $\det P=0$.
Answer: (b)""", theme="Odd-order skew-symmetric determinant")

Q(21, r"""If $4\sin^{-1}x+\cos^{-1}x=\pi$, then what is $\sin^{-1}x+4\cos^{-1}x$ equal to?""",
  [r"$\pi/2$", r"$\pi$", r"$3\pi/2$", r"$2\pi$"], "C", "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 20,
  r"""Step 1: With $\sin^{-1}x+\cos^{-1}x=\dfrac\pi2$: $3\sin^{-1}x=\dfrac\pi2$, so $\sin^{-1}x=\dfrac\pi6$ and $\cos^{-1}x=\dfrac\pi3$.
Step 2: $\dfrac\pi6+\dfrac{4\pi}3=\dfrac{3\pi}2$.
Answer: (c)""", theme="Complementary inverse functions")

Q(22, r"""What is $\cot^{2}(\sec^{-1}2)+\tan^{2}(\operatorname{cosec}^{-1}3)$ equal to?""",
  ["11/12", "11/24", "7/24", "1/24"], "B", "Trigonometry > Inverse Trigonometric Functions > Principal Values", 25,
  r"""Step 1: $\sec^{-1}2=\dfrac\pi3$, so $\cot^2=\dfrac13$.
Step 2: If $\sin\phi=\dfrac13$, then $\tan^2\phi=\dfrac{1/9}{8/9}=\dfrac18$.
Step 3: $\dfrac13+\dfrac18=\dfrac{11}{24}$.
Answer: (b)""", theme="Squares of trig values of inverse functions")

Q(23, r"""In a triangle $ABC$
$$\dfrac a{\cos A}=\dfrac b{\cos B}=\dfrac c{\cos C}$$
What is the area of the triangle if $a=6$ cm?""",
  [r"$9\sqrt3$ square cm", "12 square cm", r"$18\sqrt3$ square cm", "24 square cm"], "A", "Trigonometry > Properties of Triangles > Sine and Cosine Rules", 25,
  r"""Step 1: With the sine rule, $\tan A=\tan B=\tan C$, so the triangle is equilateral.
Step 2: Area $=\dfrac{\sqrt3}4\cdot36=9\sqrt3$.
Answer: (a)""", theme="Equilateral from a ratio condition")

Q(24, r"""The roots of the equation $7x^{2}-6x+1=0$ are $\tan\alpha$ and $\tan\beta$, where $2\alpha$ and $2\beta$ are the angles of a triangle. Which one of the following is correct?""",
  ["The triangle is equilateral", "The triangle is isosceles but not right-angled", "The triangle is right-angled", "The triangle is right-angled isosceles"], "C",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 35,
  r"""Step 1: $\tan(\alpha+\beta)=\dfrac{6/7}{1-1/7}=1$, so $\alpha+\beta=45^\circ$ and $2\alpha+2\beta=90^\circ$.
Step 2: The third angle is $90^\circ$. The roots $\dfrac{3\pm\sqrt2}7$ are different, so $2\alpha\ne2\beta$: right-angled but not isosceles.
Answer: (c)""", theme="Triangle from tangent roots")

Q(25, r"""In a triangle $ABC$, $\angle A=75^\circ$ and $\angle B=45^\circ$. What is $2a-b$ equal to?""",
  ["$c$", r"$\sqrt2c$", "$2c$", r"$2\sqrt2c$"], "B", "Trigonometry > Properties of Triangles > Sine and Cosine Rules", 30,
  r"""Step 1: $C=60^\circ$. By the sine rule, $2a-b=k(2\sin75^\circ-\sin45^\circ)=k\cdot\dfrac{\sqrt6}2$ and $c=k\cdot\dfrac{\sqrt3}2$.
Step 2: $\dfrac{2a-b}c=\sqrt2$.
Answer: (b)""", theme="Sine rule combination")

Q(26, r"""What is the number of solutions of the equation $\cot2x\cdot\cot3x=1$ for $0<x<\pi$?""",
  ["Only one", "Only two", "Only five", "More than five"], "C", "Trigonometry > Trigonometric Equations > Number of Solutions in an Interval", 50,
  r"""Step 1: The equation gives $\cos2x\cos3x-\sin2x\sin3x=0$, i.e. $\cos5x=0$, so $x=\dfrac\pi{10},\dfrac{3\pi}{10},\dfrac\pi2,\dfrac{7\pi}{10},\dfrac{9\pi}{10}$.
Step 2: At $x=\dfrac\pi2$, $\cot2x=\cot\pi$ is undefined, so that value must be rejected. Only 4 solutions remain, which is none of the options. (Counting all roots of $\cos5x=0$ gives five.)
Answer: no option is correct (item withheld)""", theme="Solutions of cot 2x cot 3x = 1")
W(26, "True count is 4 (x = pi/2 makes cot 2x undefined); options offer 1, 2, 5, more than 5.")

Q(27, r"""What is the general solution of $\cos^{100}x-\sin^{100}x=1$?""",
  [r"$n\pi$", r"$(2n+1)\pi$", r"$2n\pi$", r"$(2n+1)\pi/2$"], "A", "Trigonometry > Trigonometric Equations > General Solutions", 25,
  r"""Step 1: $\cos^{100}x\le1$ and $\sin^{100}x\ge0$, so equality needs $\cos^{100}x=1$ and $\sin x=0$.
Step 2: $x=n\pi$.
Answer: (a)""", theme="High powers of sine and cosine")

Q(28, r"""In a triangle $ABC$, $\tan A+\tan B+\tan C=k$. What is the value of $\cot A\cot B\cot C$?""",
  ["$0.5k$", "$1/k$", "$3/k$", "$1/k^{3}$"], "B", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 20,
  r"""Step 1: In a triangle $\tan A+\tan B+\tan C=\tan A\tan B\tan C=k$.
Step 2: So $\cot A\cot B\cot C=\dfrac1k$.
Answer: (b)""", theme="Tangent identity in a triangle")

Q(29, r"""What is $\sin12^\circ\sin48^\circ$ equal to?""",
  [r"$\dfrac{\sqrt5-1}4$", r"$\dfrac{\sqrt5+1}4$", r"$\dfrac{\sqrt5-1}8$", r"$\dfrac{\sqrt5+1}8$"], "C", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 30,
  r"""Step 1: $\sin12^\circ\sin48^\circ=\dfrac{\cos36^\circ-\cos60^\circ}2$.
Step 2: $\cos36^\circ=\dfrac{\sqrt5+1}4$, so the value is $\dfrac12\left(\dfrac{\sqrt5+1}4-\dfrac12\right)=\dfrac{\sqrt5-1}8$.
Answer: (c)""", theme="Product of sines")

Q(30, r"""What is $\dfrac{\cos17^\circ-\sin17^\circ}{\cos17^\circ+\sin17^\circ}$ equal to?""",
  [r"$\tan34^\circ$", r"$\cot34^\circ$", r"$\tan62^\circ$", r"$\cot62^\circ$"], "D", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 15,
  r"""Step 1: Divide by $\cos17^\circ$: $\dfrac{1-\tan17^\circ}{1+\tan17^\circ}=\tan28^\circ=\cot62^\circ$.
Answer: (d)""", theme="tan(45 - A)")

Q(31, r"""Consider the following numbers:

I. $\tan22.5^\circ$
II. $\cot22.5^\circ$
III. $\tan22.5^\circ-\cot22.5^\circ$

How many of the above are irrational numbers?""",
  ["None", "Only one", "Only two", "All three"], "C", "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 25,
  r"""Step 1: $\tan22.5^\circ=\sqrt2-1$ and $\cot22.5^\circ=\sqrt2+1$, both irrational.
Step 2: Their difference is $-2$, rational.
Answer: (c)""", pattern="Statement Count", theme="tan and cot of 22.5 degrees")

Q(32, r"""If
$$\dfrac x{\cos\theta}=\dfrac y{\cos\left(\frac{2\pi}3-\theta\right)}=\dfrac z{\cos\left(\frac{2\pi}3+\theta\right)}$$
then what is $x+y+z$ equal to?""",
  ["$-1$", "0", "1", "3"], "B", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 25,
  r"""Step 1: $x+y+z=k[\cos\theta+\cos(120^\circ-\theta)+\cos(120^\circ+\theta)]=k[\cos\theta+2\cos120^\circ\cos\theta]=0$.
Answer: (b)""", theme="Sum of cosines 120 degrees apart")

Q(33, r"""If $p\tan(\theta-30^\circ)=q\tan(\theta+120^\circ)$, then what is $(p+q)/(p-q)$ equal to?""",
  [r"$\sin2\theta$", r"$\cos2\theta$", r"$2\sin2\theta$", r"$2\cos2\theta$"], "D", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 45,
  r"""Step 1: By componendo-dividendo, $\dfrac{p+q}{p-q}=\dfrac{\tan(\theta+120^\circ)+\tan(\theta-30^\circ)}{\tan(\theta+120^\circ)-\tan(\theta-30^\circ)}=\dfrac{\sin(2\theta+90^\circ)}{\sin150^\circ}$.
Step 2: This is $\dfrac{\cos2\theta}{1/2}=2\cos2\theta$.
Answer: (d)""", theme="Componendo-dividendo with tangents")

Q(34, r"""Let $P$ and $Q$ be two non-void relations on a set $A$. Which of the following statements are correct?

I. $P$ and $Q$ are reflexive $\Rightarrow P\cap Q$ is reflexive.
II. $P$ and $Q$ are symmetric $\Rightarrow P\cup Q$ is symmetric.
III. $P$ and $Q$ are transitive $\Rightarrow P\cap Q$ is transitive.

Select the answer using the code given below.""",
  ["I and II only", "II and III only", "I and III only", "I, II and III"], "D", "Algebra > Sets, Relations and Functions > Relations", 30,
  r"""Step 1: Every $(a,a)$ lies in both, so in $P\cap Q$ (I).
Step 2: If $(a,b)\in P\cup Q$, then $(b,a)$ is in the same relation (II).
Step 3: If $(a,b),(b,c)\in P\cap Q$, then $(a,c)$ is in both $P$ and $Q$ (III).
Answer: (d)""", pattern="3-Statement Combination", theme="Properties of combined relations")

Q(35, r"""If $A$ and $B$ are two non-empty sets having 10 elements in common, then how many elements do $A\times B$ and $B\times A$ have in common?""",
  ["10", "20", "40", "100"], "D", "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 20,
  r"""Step 1: $(A\times B)\cap(B\times A)=(A\cap B)\times(A\cap B)$.
Step 2: $10\times10=100$.
Answer: (d)""", theme="Common elements of Cartesian products")

Q(36, r"""What is the remainder when $7^{n}-6n$ is divided by 36 for $n=100$?""", ["0", "1", "2", "6"], "B",
  "Algebra > Binomial Theorem > Expansion and General Term", 30,
  r"""Step 1: $7^n=(1+6)^n=1+6n+36\left[\binom n2+6\binom n3+\dots\right]$.
Step 2: So $7^n-6n\equiv1\pmod{36}$ for every $n$.
Answer: (b)""", theme="Binomial remainder")

Q(37, r"""What is the maximum number of possible points of intersection of four straight lines and a circle (intersection is between lines as well as circle and lines)?""",
  ["6", "10", "14", "16"], "C", "Algebra > Permutations and Combinations > Combinations", 25,
  r"""Step 1: Pairs of lines: $\binom42=6$ points.
Step 2: Each line can cut the circle twice: $4\times2=8$. Total 14.
Answer: (c)""", theme="Intersections of lines and a circle")

Q(38, r"""In an AP, the ratio of the sum of the first $p$ terms to the sum of the first $q$ terms is $p^{2}:q^{2}$. Which one of the following is correct?""",
  ["The first term is equal to the common difference", "The first term is equal to twice the common difference", "The common difference is equal to twice the first term", "The first term is equal to square of the common difference"], "C",
  "Algebra > Sequences and Series > Arithmetic Progression", 30,
  r"""Step 1: $S_n\propto n^2$ for all $n$ means $S_n=kn^2$, so $a_n=k(2n-1)$: $a=k$, $d=2k$.
Step 2: $d=2a$.
Answer: (c)""", theme="Sums proportional to squares")

Q(39, r"""What is the number of real roots of the equation $(x-1)^{2}+(x-3)^{2}+(x-5)^{2}=0$?""",
  ["None", "Only one", "Only two", "Three"], "A", "Algebra > Quadratic Equations and Inequalities > Nature of Roots", 15,
  r"""Step 1: A sum of squares is 0 only if each term is 0, which would need $x=1,3,5$ at once.
Answer: (a)""", theme="Sum of squares equal to zero")

Q(40, r"""In a class of 240 students, 180 passed in English, 130 passed in Hindi and 150 passed in Sanskrit. Further, 60 passed in only one subject, 110 passed in only two subjects and 10 passed in none of the subjects. How many passed in all three subjects?""",
  ["60", "55", "40", "35"], "A", "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 30,
  r"""Step 1: 230 passed at least one subject, so all three: $230-60-110=60$.
Step 2: Check: $60+2(110)+3(60)=460=180+130+150$.
Answer: (a)""", theme="Three-set counting")

P("z1z2", "Ratio of two complex numbers", r"""Let $Z_1$ and $Z_2$ be any two complex numbers such that $Z_1^{2}+Z_2^{2}+Z_1Z_2=0$.""")

Q(41, r"""What is the value of $\left|\dfrac{Z_1}{Z_2}\right|$?""", ["1", "2", "3", "4"], "A", "Algebra > Complex Numbers > Cube Roots of Unity", 25,
  r"""Step 1: With $t=Z_1/Z_2$: $t^2+t+1=0$, so $t=\omega$ or $\omega^2$.
Step 2: $|t|=1$.
Answer: (a)""", passage="z1z2", pattern=LS, theme="Modulus of the ratio")

Q(42, r"""What is the value of $\dfrac12+\operatorname{Re}\left(\dfrac{Z_1}{Z_2}\right)$?""", ["$-1$", "0", "1", "2"], "B", "Algebra > Complex Numbers > Cube Roots of Unity", 20,
  r"""Step 1: $\operatorname{Re}\omega=-\dfrac12$.
Answer: (b)""", passage="z1z2", pattern=LS, theme="Real part of omega")

P("ap5", "Five terms of an AP", r"""The product of 5 consecutive terms of an AP is 229635. The first, second and fifth terms are in GP.""")

Q(43, r"""What is the common difference?""", ["3", "4", "5", "6"], "D", "Algebra > Sequences and Series > Arithmetic Progression", 40,
  r"""Step 1: $(a+d)^2=a(a+4d)$ gives $d=2a$, so the terms are $a,3a,5a,7a,9a$.
Step 2: $945a^5=229635$ gives $a^5=243$, $a=3$, $d=6$.
Answer: (d)""", passage="ap5", pattern=LS, theme="AP terms in GP")

Q(44, r"""What is the sum of all five terms?""", ["60", "65", "75", "80"], "C", "Algebra > Sequences and Series > Arithmetic Progression", 20,
  r"""Step 1: $3+9+15+21+27=75$.
Answer: (c)""", passage="ap5", pattern=LS, theme="Sum of the five terms")

P("conj", "Conjugate surd powers",
  r"""Let $(8+3\sqrt7)^{20}=U+V$ and $(8-3\sqrt7)^{20}=W$, where $U$ is an integer and $0<V<1$.""")

Q(45, r"""What is $V+W$ equal to?""", ["8", "4", "2", "1"], "D", "Algebra > Binomial Theorem > Expansion and General Term", 40,
  r"""Step 1: $(8+3\sqrt7)^{20}+(8-3\sqrt7)^{20}$ is an integer (odd powers of $\sqrt7$ cancel).
Step 2: So $V+W$ is an integer; $0<V<1$ and $0<W<1$, hence $V+W=1$.
Answer: (d)""", passage="conj", pattern=LS, theme="Fractional part with conjugates")

Q(46, r"""What is the value of $(U+V)W$?""", ["1/2", "1", "3/2", "2"], "B", "Algebra > Binomial Theorem > Expansion and General Term", 20,
  r"""Step 1: $(U+V)W=[(8+3\sqrt7)(8-3\sqrt7)]^{20}=(64-63)^{20}=1$.
Answer: (b)""", passage="conj", pattern=LS, theme="Product of conjugate powers")

P("eqr", "Quadratic with equal roots",
  r"""The roots of the quadratic equation
$$a^{2}(b^{2}-c^{2})x^{2}+b^{2}(c^{2}-a^{2})x+c^{2}(a^{2}-b^{2})=0$$
are equal $(a^{2}\ne b^{2}\ne c^{2})$.""")

Q(47, r"""Which one of the following statements is correct?""",
  [r"$a^{2}$, $b^{2}$, $c^{2}$ are in AP.", r"$a^{2}$, $b^{2}$, $c^{2}$ are in GP.", r"$a^{2}$, $b^{2}$, $c^{2}$ are in HP.", r"$a^{2}$, $b^{2}$, $c^{2}$ are neither in AP nor in GP nor in HP."], "C",
  "Algebra > Quadratic Equations and Inequalities > Nature of Roots", 45,
  r"""Step 1: The coefficients add to 0, so $x=1$ is a root, and equal roots means both are 1.
Step 2: Product $=1$: $c^2(a^2-b^2)=a^2(b^2-c^2)$, i.e. $2a^2c^2=b^2(a^2+c^2)$, so $\dfrac2{b^2}=\dfrac1{a^2}+\dfrac1{c^2}$.
Answer: (c)""", passage="eqr", pattern=LS, theme="Condition for equal roots")

Q(48, r"""Which one of the following is a root of the equation?""",
  [r"$\dfrac{b^{2}(c^{2}-a^{2})}{a^{2}(c^{2}-b^{2})}$", r"$\dfrac{b^{2}(c^{2}-a^{2})}{a^{2}(b^{2}-c^{2})}$", r"$\dfrac{b^{2}(c^{2}-a^{2})}{2a^{2}(c^{2}-b^{2})}$", r"$\dfrac{b^{2}(c^{2}-a^{2})}{2a^{2}(b^{2}-c^{2})}$"], "C",
  "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 50,
  r"""Step 1: The (repeated) root is 1.
Step 2: Using $2a^2c^2=a^2b^2+b^2c^2$: $b^2(c^2-a^2)=b^2c^2-a^2b^2=2a^2c^2-2a^2b^2=2a^2(c^2-b^2)$.
Step 3: So option (c) equals 1.
Answer: (c)""", passage="eqr", pattern=LS, theme="Identifying the repeated root")

P("A3", "A 3x3 matrix", r"""Let
$$A=\begin{bmatrix}3&-3&4\\2&-3&4\\0&-1&1\end{bmatrix}$$""")

Q(49, r"""What is $A(\operatorname{adj}A)$ equal to?""",
  [r"$\begin{bmatrix}5&0&0\\0&5&0\\0&0&5\end{bmatrix}$", r"$\begin{bmatrix}2&0&0\\0&2&0\\0&0&2\end{bmatrix}$", r"$\begin{bmatrix}1/2&0&0\\0&1/2&0\\0&0&1/2\end{bmatrix}$", r"$\begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix}$"], "D",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 20,
  r"""Step 1: $|A|=3(-3+4)+3(2)+4(-2)=1$.
Step 2: $A\,\operatorname{adj}A=|A|I=I$.
Answer: (d)""", passage="A3", pattern=LS, theme="A times adj A")

Q(50, r"""What is $A^{-1}$ equal to?""",
  [r"$\begin{bmatrix}1&-1&0\\-2&3&-4\\-2&3&-3\end{bmatrix}$", r"$\begin{bmatrix}1/2&-1/2&0\\-1&3/2&-2\\-1&3/2&-3/2\end{bmatrix}$", r"$\begin{bmatrix}2&-2&0\\-4&6&-8\\-4&6&-6\end{bmatrix}$", r"$\begin{bmatrix}1/5&-1/5&0\\-2/5&3/5&-4/5\\-2/5&3/5&-3/5\end{bmatrix}$"], "A",
  "Matrices and Determinants > Matrices > Adjoint and Inverse", 30,
  r"""Step 1: With $|A|=1$, $A^{-1}=\operatorname{adj}A$.
Step 2: Computing cofactors gives $\begin{bmatrix}1&-1&0\\-2&3&-4\\-2&3&-3\end{bmatrix}$ (check: $A\cdot A^{-1}=I$).
Answer: (a)""", passage="A3", pattern=LS, theme="Inverse via adjoint")
