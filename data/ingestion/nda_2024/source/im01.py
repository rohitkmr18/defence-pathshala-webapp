from qfmt import Q, P, F, W

# NDA I 2024 Mathematics, Set A (RRAN-B-MTH), booklet pages 3-19, Q1-50
S2 = "2-Statement Combination"
S3 = "3-Statement Combination"
SC = "Statement Count"

Q(1, r"""Let $A$ and $B$ be matrices of order $3\times3$. If $|A|=\dfrac1{2\sqrt2}$ and $|B|=\dfrac1{729}$, then what is the value of $|2B(\operatorname{adj}(3A))|$?""",
  ["27", r"$\dfrac{27}{2\sqrt2}$", r"$\dfrac{27}2$", "1"], "D", "Matrices and Determinants > Matrices > Adjoint and Inverse", 30,
  r"""Step 1: $|3A|=27|A|=\dfrac{27}{2\sqrt2}$ and $|\operatorname{adj}(3A)|=|3A|^2=\dfrac{729}8$.
Step 2: $|2B\,\operatorname{adj}(3A)|=2^3\cdot\dfrac1{729}\cdot\dfrac{729}8=1$.
Answer: (d)""", theme="Determinant of a product with an adjoint")

Q(2, r"""If $z$ is any complex number and $iz^3+z^2-z+i=0$, where $i=\sqrt{-1}$, then what is the value of $(|z|+1)^2$?""",
  ["1", "4", "81", "121"], "B", "Algebra > Complex Numbers > Modulus, Argument and Polar Form", 30,
  r"""Step 1: $iz^3+z^2-z+i=(z-i)(iz^2-1)$, so $z=i$ or $z^2=-i$.
Step 2: Every root has $|z|=1$, so $(|z|+1)^2=4$.
Answer: (b)""", theme="Modulus of roots of a cubic")

Q(3, r"""What is the sum of all four digit numbers formed by using all digits 0, 1, 4, 5 without repetition of digits?""",
  ["44440", "46460", "46440", "64440"], "D", "Algebra > Permutations and Combinations > Permutations", 30,
  r"""Step 1: All 24 arrangements sum to $6\times(0+1+4+5)\times1111=66660$.
Step 2: Arrangements starting with 0 are 3-digit numbers from 1, 4, 5, summing to $2\times10\times111=2220$.
Step 3: $66660-2220=64440$.
Answer: (d)""", theme="Sum of numbers with a zero digit")

Q(4, r"""If $x$, $y$ and $z$ are the cube roots of unity, then what is the value of $xy+yz+zx$?""",
  ["0", "1", "2", "3"], "A", "Algebra > Complex Numbers > Cube Roots of Unity", 10,
  r"""Step 1: $xy+yz+zx=\omega+\omega^3+\omega^2=1+\omega+\omega^2$.
Step 2: This is 0.
Answer: (a)""", theme="Symmetric sum of cube roots")

Q(5, r"""A man has 7 relatives (4 women and 3 men). His wife also has 7 relatives (3 women and 4 men). In how many ways can they invite 3 women and 3 men so that 3 of them are man's relatives and 3 of them are his wife's relatives?""",
  ["340", "484", "485", "469"], "C", "Algebra > Permutations and Combinations > Combinations", 35,
  r"""Step 1: If the man invites $r$ women and $3-r$ men, the wife invites $3-r$ women and $r$ men.
Step 2: $r=0$: $1$; $r=1$: $4\cdot3\cdot3\cdot4=144$; $r=2$: $6\cdot3\cdot3\cdot6=324$; $r=3$: $4\cdot4=16$.
Step 3: Total $=485$.
Answer: (c)""", theme="Split selection from two groups")

Q(6, r"""A triangle $PQR$ is such that 3 points lie on the side $PQ$, 4 points on $QR$ and 5 points on $RP$ respectively. Triangles are constructed using these points as vertices. What is the number of triangles so formed?""",
  ["205", "206", "215", "220"], "A", "Algebra > Permutations and Combinations > Combinations", 25,
  r"""Step 1: $\binom{12}3=220$ choices of three points.
Step 2: Remove collinear triples: $\binom33+\binom43+\binom53=15$.
Step 3: $220-15=205$.
Answer: (a)""", theme="Triangles from points on sides")

Q(7, r"""If $\log_ba=p$, $\log_dc=2p$ and $\log_fe=3p$, then what is $(ace)^{1/p}$ equal to?""",
  [r"$bd^2f^3$", r"$bdf$", r"$b^3d^2f$", r"$b^2d^2f^2$"], "A", "Algebra > Logarithms and Indices > Laws of Logarithms", 20,
  r"""Step 1: $a=b^p$, $c=d^{2p}$, $e=f^{3p}$.
Step 2: $(ace)^{1/p}=bd^2f^3$.
Answer: (a)""", theme="Converting logs to powers")

Q(8, r"""If $-\sqrt2$ and $\sqrt3$ are roots of the equation $a_0+a_1x+a_2x^2+a_3x^3+x^4=0$ where $a_0, a_1, a_2, a_3$ are integers, then which one of the following is correct?""",
  [r"$a_2=a_3=0$", r"$a_2=0$ and $a_3=-5$", r"$a_0=6$, $a_3=0$", r"$a_1=0$ and $a_2=5$"], "C", "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 25,
  r"""Step 1: With integer coefficients, irrational roots come with conjugates, so the roots are $\pm\sqrt2, \pm\sqrt3$.
Step 2: The polynomial is $(x^2-2)(x^2-3)=x^4-5x^2+6$: $a_0=6$, $a_3=0$.
Answer: (c)""", theme="Conjugate surd roots")

Q(9, r"""Let $z_1$ and $z_2$ be two complex numbers such that $\left|\dfrac{z_1+z_2}{z_1-z_2}\right|=1$, then what is $\operatorname{Re}\left(\dfrac{z_1}{z_2}\right)+1$ equal to?""",
  ["$-1$", "0", "1", "5"], "C", "Algebra > Complex Numbers > Algebra of Complex Numbers", 25,
  r"""Step 1: $|z_1+z_2|=|z_1-z_2|$ gives $\operatorname{Re}(z_1\bar z_2)=0$, so $\dfrac{z_1}{z_2}$ is purely imaginary.
Step 2: $\operatorname{Re}\left(\dfrac{z_1}{z_2}\right)+1=1$.
Answer: (c)""", theme="Equal modulus of sum and difference")

Q(10, r"""If $26!=n8^k$, where $k$ and $n$ are positive integers, then what is the maximum value of $k$?""",
  ["6", "7", "8", "9"], "B", "Algebra > Number Systems > Divisibility and Remainders", 25,
  r"""Step 1: The power of 2 in $26!$ is $13+6+3+1=23$.
Step 2: $8^k=2^{3k}$, so $k\le\left\lfloor\dfrac{23}3\right\rfloor=7$.
Answer: (b)""", theme="Highest power in a factorial")

Q(11, r"""Consider the following statements in respect of two non-singular matrices $A$ and $B$ of the same order $n$:
1. $\operatorname{adj}(AB)=(\operatorname{adj}A)(\operatorname{adj}B)$
2. $\operatorname{adj}(AB)=\operatorname{adj}(BA)$
3. $(AB)\operatorname{adj}(AB)-|AB|I_n$ is a null matrix of order $n$
How many of the above statements are correct?""",
  ["None", "Only one statement", "Only two statements", "All three statements"], "B", "Matrices and Determinants > Matrices > Adjoint and Inverse", 30,
  r"""Step 1: $\operatorname{adj}(AB)=(\operatorname{adj}B)(\operatorname{adj}A)$, which in general differs from both $(\operatorname{adj}A)(\operatorname{adj}B)$ and $\operatorname{adj}(BA)$. Statements 1 and 2 fail.
Step 2: $M\operatorname{adj}M=|M|I$ for any square $M$. Statement 3 holds.
Answer: (b)""", pattern=SC, theme="Adjoint of a product")

Q(12, r"""Consider the following statements in respect of a non-singular matrix $A$ of order $n$:
1. $A(\operatorname{adj}A^T)=A(\operatorname{adj}A)^T$
2. If $A^2=A$, then $A$ is identity matrix of order $n$
3. If $A^3=A$, then $A$ is identity matrix of order $n$
Which of the statements given above are correct?""",
  ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "A", "Matrices and Determinants > Matrices > Adjoint and Inverse", 30,
  r"""Step 1: $\operatorname{adj}(A^T)=(\operatorname{adj}A)^T$, so statement 1 holds.
Step 2: $A^2=A$ with $A$ invertible gives $A=I$. Statement 2 holds.
Step 3: $A^3=A$ only gives $A^2=I$ (e.g. $A=-I$). Statement 3 fails.
Answer: (a)""", pattern=S3, theme="Idempotent and involutory matrices")

Q(13, r"""How many four-digit natural numbers are there such that all of the digits are even?""",
  ["625", "500", "400", "256"], "B", "Algebra > Permutations and Combinations > Counting Principles", 15,
  r"""Step 1: First digit: 2, 4, 6, 8 (4 ways); each other digit: 0, 2, 4, 6, 8 (5 ways).
Step 2: $4\times5^3=500$.
Answer: (b)""", theme="Digits restricted to even values")

Q(14, r"""If $\omega\ne1$ is a cube root of unity, then what are the solutions of $(z-100)^3+1000=0$?""",
  [r"$10(1-\omega)$, $10(10-\omega^2)$, 100", r"$10(10-\omega)$, $10(10-\omega^2)$, 90", r"$10(1-\omega)$, $10(10-\omega^2)$, 1000", r"$(1+\omega)$, $(10+\omega^2)$, $-1$"], "B", "Algebra > Complex Numbers > Cube Roots of Unity", 25,
  r"""Step 1: $z-100=-10, -10\omega, -10\omega^2$.
Step 2: $z=90$, $10(10-\omega)$, $10(10-\omega^2)$.
Answer: (b)""", theme="Cube roots of a negative number")

Q(15, r"""What is $(1+i)^4+(1-i)^4$ equal to, where $i=\sqrt{-1}$?""",
  ["4", "0", "$-4$", "$-8$"], "D", "Algebra > Complex Numbers > Algebra of Complex Numbers", 10,
  r"""Step 1: $(1+i)^2=2i$, so $(1+i)^4=-4$; likewise $(1-i)^4=-4$.
Step 2: Sum $=-8$.
Answer: (d)""", theme="Powers of 1 plus or minus i")

Q(16, r"""Consider the following statements in respect of a skew-symmetric matrix $A$ of order 3:
1. All diagonal elements are zero.
2. The sum of all the diagonal elements of the matrix is zero.
3. $A$ is orthogonal matrix.
Which of the statements given above are correct?""",
  ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "A", "Matrices and Determinants > Matrices > Transpose, Symmetric and Skew-symmetric", 20,
  r"""Step 1: $a_{ii}=-a_{ii}$ forces every diagonal entry to be 0, so the trace is 0. Statements 1 and 2 hold.
Step 2: A skew-symmetric matrix of odd order has determinant 0, so it cannot be orthogonal. Statement 3 fails.
Answer: (a)""", pattern=S3, theme="Properties of skew-symmetric matrices")

Q(17, r"""Four digit numbers are formed by using the digits 1, 2, 3, 5 without repetition of digits. How many of them are divisible by 4?""",
  ["120", "24", "12", "6"], "D", "Algebra > Permutations and Combinations > Permutations", 20,
  r"""Step 1: The last two digits must form a multiple of 4: only 12, 32, 52.
Step 2: Each leaves 2 ways for the first two digits, giving $3\times2=6$.
Answer: (d)""", theme="Divisibility by 4")

Q(18, r"""What is the remainder when $2^{120}$ is divided by 7?""",
  ["1", "3", "5", "6"], "A", "Algebra > Number Systems > Divisibility and Remainders", 10,
  r"""Step 1: $2^3=8\equiv1\pmod7$.
Step 2: $2^{120}=(2^3)^{40}\equiv1$.
Answer: (a)""", theme="Remainder by cyclicity")

Q(19, r"""For what value of $n$ is the determinant $\begin{vmatrix}C(9,4) & C(9,3) & C(10,n-2)\\ C(11,6) & C(11,5) & C(12,n)\\ C(m,7) & C(m,6) & C(m+1,n+1)\end{vmatrix}=0$ for every $m>n$?""",
  ["4", "5", "6", "7"], "C", "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Step 1: $C_1+C_2$ gives $C(10,4)$, $C(12,6)$, $C(m+1,7)$ by Pascal's rule.
Step 2: The determinant vanishes for all $m$ when column 3 equals this column: $n-2=4$, $n=6$, $n+1=7$.
Answer: (c)""", theme="Pascal's rule inside a determinant")

Q(20, r"""If $ABC$ is a triangle, then what is the value of the determinant $\begin{vmatrix}\cos C & \sin B & 0\\ \tan A & 0 & \sin B\\ 0 & \tan(B+C) & \cos C\end{vmatrix}$?""",
  ["$-1$", "0", "1", "3"], "B", "Matrices and Determinants > Determinants > Evaluation and Properties", 25,
  r"""Step 1: Expanding: $\cos C(0-\sin B\tan(B+C))-\sin B(\tan A\cos C-0)$.
Step 2: $\tan(B+C)=-\tan A$, so the value is $\sin B\cos C\tan A-\sin B\cos C\tan A=0$.
Answer: (b)""", theme="Trigonometric determinant in a triangle")

Q(21, r"""What is the number of different matrices, each having 4 entries that can be formed using 1, 2, 3, 4 (repetition is allowed)?""",
  ["72", "216", "254", "768"], "D", "Matrices and Determinants > Matrices > Types and Operations", 25,
  r"""Step 1: A 4-entry matrix can be $1\times4$, $4\times1$ or $2\times2$.
Step 2: Each has $4^4=256$ fillings, so $3\times256=768$.
Answer: (d)""", theme="Counting matrices of all shapes")

Q(22, r"""Let $A=\{x\in\mathbb R: -1<x<1\}$. Which of the following is/are bijective functions from $A$ to itself?
1. $f(x)=x|x|$
2. $g(x)=\cos(\pi x)$""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 25,
  r"""Step 1: $x|x|$ is strictly increasing and maps $(-1,1)$ onto $(-1,1)$: bijective.
Step 2: $\cos(\pi x)$ is even, so not one-one.
Answer: (a)""", pattern=S2, theme="Bijections on (-1, 1)")

Q(23, r"""Let $R$ be a relation on the open interval $(-1, 1)$ and is given by $R=\{(x, y): |x+y|<2\}$. Then which one of the following is correct?""",
  ["$R$ is reflexive but neither symmetric nor transitive", "$R$ is reflexive and symmetric but not transitive", "$R$ is reflexive and transitive but not symmetric", "$R$ is an equivalence relation"], "D", "Algebra > Sets, Relations and Functions > Relations", 25,
  r"""Step 1: For $x, y\in(-1,1)$, always $|x+y|<2$.
Step 2: So $R$ is the universal relation, which is an equivalence relation.
Answer: (d)""", theme="Universal relation")

Q(24, r"""For any three non-empty sets $A$, $B$, $C$, what is $(A\cup B)-\{(A-B)\cup(B-A)\cup(A\cap B)\}$ equal to?""",
  ["Null set", "$A$", "$B$", r"$(A\cup B)-(A\cap B)$"], "A", "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 15,
  r"""Step 1: $(A-B)\cup(B-A)\cup(A\cap B)=A\cup B$.
Step 2: $(A\cup B)-(A\cup B)=\varnothing$.
Answer: (a)""", theme="Partition of a union")

Q(25, r"""If $a$, $b$, $c$ are the sides of triangle $ABC$, then what is $\begin{vmatrix}a^2 & b\sin A & c\sin A\\ b\sin A & 1 & \cos A\\ c\sin A & \cos A & 1\end{vmatrix}$ equal to?""",
  ["Zero", "Area of triangle", "Perimeter of triangle", "$a^2+b^2+c^2$"], "A", "Matrices and Determinants > Determinants > Evaluation and Properties", 35,
  r"""Step 1: Expanding: $a^2\sin^2A-b\sin A(b\sin A-c\sin A\cos A)+c\sin A(b\sin A\cos A-c\sin A)$.
Step 2: $=\sin^2A(a^2-b^2-c^2+2bc\cos A)=0$ by the cosine rule.
Answer: (a)""", theme="Cosine rule inside a determinant")

Q(26, r"""If $a, b, c$ are in AP; $b, c, d$ are in GP; $c, d, e$ are in HP, then which of the following is/are correct?
1. $a$, $c$ and $e$ are in GP
2. $\dfrac1a, \dfrac1c, \dfrac1e$ are in GP""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Algebra > Sequences and Series > Special Series and Means", 30,
  r"""Step 1: $c=\dfrac{d^2}{b}$ with $b=\dfrac{a+c}2$ and $d=\dfrac{2ce}{c+e}$; eliminating gives $c^2=ae$.
Step 2: So $a, c, e$ are in GP, and their reciprocals are too.
Answer: (c)""", pattern=S2, theme="Linked AP, GP and HP")

Q(27, r"""What is the number of solutions of $\log_4(x-1)=\log_2(x-3)$?""",
  ["Zero", "One", "Two", "Three"], "B", "Algebra > Logarithms and Indices > Laws of Logarithms", 20,
  r"""Step 1: $\log_4(x-1)=\tfrac12\log_2(x-1)$, so $x-1=(x-3)^2$, i.e. $x^2-7x+10=0$, $x=2$ or 5.
Step 2: Only $x=5$ satisfies $x>3$.
Answer: (b)""", theme="Logs with different bases")

Q(28, r"""For $x\ge y>1$, let $\log_x\left(\dfrac xy\right)+\log_y\left(\dfrac yx\right)=k$, then the value of $k$ can never be equal to""",
  ["$-1$", r"$-\dfrac12$", "0", "1"], "D", "Algebra > Logarithms and Indices > Laws of Logarithms", 25,
  r"""Step 1: $k=2-\left(t+\dfrac1t\right)$ with $t=\log_xy>0$.
Step 2: $t+\dfrac1t\ge2$, so $k\le0$; it can never be 1.
Answer: (d)""", theme="Range of a log expression")

Q(29, r"""If $A=\begin{bmatrix}\sin2\theta & 2\sin^2\theta-1 & 0\\ \cos2\theta & 2\sin\theta\cos\theta & 0\\ 0 & 0 & 1\end{bmatrix}$, then which of the following statements is/are correct?
1. $A^{-1}=\operatorname{adj}A$
2. $A$ is skew-symmetric matrix
3. $A^{-1}=A^T$
Select the correct answer using the code given below:""",
  ["1 only", "1 and 2", "1 and 3", "2 and 3"], "C", "Matrices and Determinants > Matrices > Adjoint and Inverse", 30,
  r"""Step 1: $A=\begin{bmatrix}\sin2\theta & -\cos2\theta & 0\\ \cos2\theta & \sin2\theta & 0\\ 0&0&1\end{bmatrix}$ is a rotation: $AA^T=I$, $|A|=1$.
Step 2: So $A^{-1}=A^T$ and $A^{-1}=\dfrac{\operatorname{adj}A}{|A|}=\operatorname{adj}A$. Its diagonal is not zero, so it is not skew-symmetric.
Answer: (c)""", pattern=S3, theme="Rotation matrix")

Q(30, r"""What is the coefficient of $x^{10}$ in the expansion of $(1-x^2)^{20}\left(2-x^2-\dfrac1{x^2}\right)^{-5}$?""",
  ["$-1$", "1", "10", "Coefficient of $x^{10}$ does not exist"], "A", "Algebra > Binomial Theorem > Expansion and General Term", 35,
  r"""Step 1: $2-x^2-\dfrac1{x^2}=-\dfrac{(1-x^2)^2}{x^2}$, so the expression is $-x^{10}(1-x^2)^{10}$.
Step 2: The coefficient of $x^{10}$ is $-1$.
Answer: (a)""", theme="Simplifying before expanding")

Q(31, r"""If the 4th term in the expansion of $\left(mx+\dfrac1x\right)^n$ is $\dfrac52$, then what is the value of $mn$?""",
  ["$-3$", "3", "6", "12"], "B", "Algebra > Binomial Theorem > Expansion and General Term", 30,
  r"""Step 1: $T_4=\binom n3m^{n-3}x^{n-6}$ is a constant, so $n=6$.
Step 2: $20m^3=\dfrac52$ gives $m=\dfrac12$, so $mn=3$.
Answer: (b)""", theme="Constant fourth term")

Q(32, r"""If $a$, $b$ and $c$ $(a>0, c>0)$ are in GP, then consider the following in respect of the equation $ax^2+bx+c=0$:
1. The equation has imaginary roots.
2. The ratio of the roots of the equation is $1:\omega$ where $\omega$ is a cube root of unity.
3. The product of roots of the equation is $\left(\dfrac{b^2}{a^2}\right)$.
Which of the statements given above are correct?""",
  ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], "D", "Algebra > Quadratic Equations and Inequalities > Nature of Roots", 30,
  r"""Step 1: $b^2=ac$, so the discriminant is $ac-4ac=-3ac<0$: imaginary roots.
Step 2: Putting $x=t\sqrt{c/a}$ reduces the equation to $t^2\pm t+1=0$, whose roots are in ratio $1:\omega$.
Step 3: Product $=\dfrac ca=\dfrac{b^2}{a^2}$.
Answer: (d)""", pattern=S3, theme="Quadratic with GP coefficients")

Q(33, r"""If $x^2+mx+n$ is an integer for all integral values of $x$, then which of the following is/are correct?
1. $m$ must be an integer
2. $n$ must be an integer""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "C", "Algebra > Quadratic Equations and Inequalities > Roots and Coefficients", 20,
  r"""Step 1: $x=0$ gives $n$ an integer.
Step 2: $x=1$ gives $1+m+n$ an integer, so $m$ is an integer.
Answer: (c)""", pattern=S2, theme="Integer-valued quadratic")

Q(34, r"""In a binomial expansion of $(x+y)^{2n+1}(x-y)^{2n+1}$, the sum of middle terms is zero. What is the value of $\left(\dfrac{x^2}{y^2}\right)$?""",
  ["1", "2", "4", "8"], "A", "Algebra > Binomial Theorem > Coefficients and Middle Terms", 30,
  r"""Step 1: The product is $(x^2-y^2)^{2n+1}$, with middle terms $T_{n+1}$ and $T_{n+2}$.
Step 2: Their sum is $\binom{2n+1}n(x^2)^n(-y^2)^n(x^2-y^2)=0$, so $x^2=y^2$.
Answer: (a)""", theme="Middle terms of an odd power")

Q(35, r"""Let $A=\{1, 2, 3, 4, 5\}$ and $B=\{6, 7\}$. What is the number of onto functions from $A$ to $B$?""",
  ["10", "20", "30", "32"], "C", "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 15,
  r"""Step 1: All functions: $2^5=32$.
Step 2: Remove the 2 constant functions: 30.
Answer: (c)""", theme="Counting onto functions")

Q(36, r"""What is $\dfrac{\sqrt3\cos10^\circ-\sin10^\circ}{\sin25^\circ\cos25^\circ}$ equal to?""",
  ["1", r"$\sqrt3$", "2", "4"], "D", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 25,
  r"""Step 1: Numerator $=2\cos40^\circ$; denominator $=\dfrac12\sin50^\circ=\dfrac12\cos40^\circ$.
Step 2: The ratio is 4.
Answer: (d)""", theme="Auxiliary-angle simplification")

Q(37, r"""What is $(\sin9^\circ-\cos9^\circ)$ equal to?""",
  [r"$-\dfrac{\sqrt{5-\sqrt5}}2$", r"$-\dfrac{\sqrt{5-\sqrt3}}2$", r"$\dfrac{\sqrt{5-\sqrt5}}2$", r"$\dfrac{\sqrt{5-\sqrt5}}4$"], "A", "Trigonometry > Trigonometric Ratios and Identities > Standard Angles and Allied Angles", 30,
  r"""Step 1: $\sin9^\circ-\cos9^\circ=-\sqrt2\sin36^\circ$ (negative, since $\cos9^\circ>\sin9^\circ$).
Step 2: $\sin36^\circ=\dfrac{\sqrt{10-2\sqrt5}}4$, so the value is $-\dfrac{\sqrt{20-4\sqrt5}}4=-\dfrac{\sqrt{5-\sqrt5}}2$.
Answer: (a)""", theme="Value at 9 degrees")

Q(38, r"""If in a triangle $ABC$, $\sin^3A+\sin^3B+\sin^3C=3\sin A\sin B\sin C$, then what is the value of the determinant $\begin{vmatrix}a&b&c\\b&c&a\\c&a&b\end{vmatrix}$; where $a, b, c$ are sides of the triangle?""",
  ["$a+b+c$", "$ab+bc+ca$", "$(a+b)(b+c)(c+a)$", "0"], "D", "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Step 1: By the sine rule the condition is $a^3+b^3+c^3=3abc$, which (with $a+b+c>0$) forces $a=b=c$.
Step 2: The determinant equals $-(a^3+b^3+c^3-3abc)=0$.
Answer: (d)""", theme="Circulant determinant of an equilateral triangle")

Q(39, r"""If $\cos^{-1}x=\sin^{-1}x$, then which one of the following is correct?""",
  ["$x=1$", r"$x=\dfrac12$", r"$x=\dfrac1{\sqrt2}$", r"$x=\dfrac1{\sqrt3}$"], "C", "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 10,
  r"""Step 1: $\sin^{-1}x+\cos^{-1}x=\dfrac\pi2$, so each equals $\dfrac\pi4$.
Step 2: $x=\sin\dfrac\pi4=\dfrac1{\sqrt2}$.
Answer: (c)""", theme="Equal inverse sine and cosine")

Q(40, r"""What is the number of solutions of $(\sin\theta-\cos\theta)^2=2$ where $-\pi<\theta<\pi$?""",
  ["Only one", "Only two", "Four", "No solution"], "B", "Trigonometry > Trigonometric Equations > Number of Solutions in an Interval", 20,
  r"""Step 1: $1-\sin2\theta=2$, so $\sin2\theta=-1$.
Step 2: $2\theta\in(-2\pi,2\pi)$ gives $2\theta=-\dfrac\pi2, \dfrac{3\pi}2$, i.e. $\theta=-\dfrac\pi4, \dfrac{3\pi}4$.
Answer: (b)""", theme="Counting solutions in an interval")

Q(41, r"""$ABC$ is a triangle such that angle $C=60^\circ$, then what is $\dfrac{\cos A+\cos B}{\cos\left(\dfrac{A-B}2\right)}$ equal to?""",
  ["2", r"$\sqrt2$", "1", r"$\dfrac1{\sqrt2}$"], "C", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 20,
  r"""Step 1: $\cos A+\cos B=2\cos\dfrac{A+B}2\cos\dfrac{A-B}2$ with $\dfrac{A+B}2=60^\circ$.
Step 2: The ratio is $2\cos60^\circ=1$.
Answer: (c)""", theme="Sum-to-product in a triangle")

Q(42, r"""What is $\sqrt{15+\cot^2\left(\dfrac\pi4-2\cot^{-1}3\right)}$ equal to?""",
  ["1", "7", "8", "16"], "C", "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 30,
  r"""Step 1: With $\tan\phi=\dfrac13$, $\tan2\phi=\dfrac34$.
Step 2: $\cot\left(\dfrac\pi4-2\phi\right)=\tan\left(\dfrac\pi4+2\phi\right)=\dfrac{1+3/4}{1-3/4}=7$.
Step 3: $\sqrt{15+49}=8$.
Answer: (c)""", theme="Inverse cotangent inside a cotangent")

Q(43, r"""What is the value of $\sin10^\circ\cdot\sin50^\circ+\sin50^\circ\cdot\sin250^\circ+\sin250^\circ\cdot\sin10^\circ$ equal to?""",
  [r"$-\dfrac14$", r"$-\dfrac34$", r"$\dfrac{3\sin10^\circ}4$", r"$-\dfrac{3\cos10^\circ}4$"], "B", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 30,
  r"""Step 1: The angles $10^\circ, 130^\circ, 250^\circ$ share sines with the given terms after $\sin50^\circ=\sin130^\circ$: they are $\theta, \theta+120^\circ, \theta+240^\circ$.
Step 2: For such angles $\sum\sin\alpha\sin\beta=-\dfrac34$.
Answer: (b)""", theme="Angles 120 degrees apart")

Q(44, r"""What is $\tan^{-1}\left(\dfrac ab\right)-\tan^{-1}\left(\dfrac{a-b}{a+b}\right)$ equal to?""",
  [r"$-\dfrac\pi4$", r"$\dfrac\pi4$", r"$\tan^{-1}\left(\dfrac{a^2-b^2}{a^2+b^2}\right)$", r"$\tan^{-1}\left(\dfrac{2ab}{a^2+b^2}\right)$"], "B", "Trigonometry > Inverse Trigonometric Functions > Identities and Simplification", 20,
  r"""Step 1: $\dfrac{a-b}{a+b}=\dfrac{a/b-1}{1+a/b}=\tan\left(\tan^{-1}\dfrac ab-\dfrac\pi4\right)$.
Step 2: The difference is $\dfrac\pi4$.
Answer: (b)""", theme="Difference of inverse tangents")

Q(45, r"""Under which one of the following conditions does the equation $(\cos\beta-1)x^2+(\cos\beta)x+\sin\beta=0$ in $x$ have a real root for $\beta\in[0, \pi]$?""",
  [r"$1-\cos\beta<0$", r"$1-\cos\beta\le0$", r"$1-\cos\beta>0$", r"$1-\cos\beta\ge0$"], "D", "Algebra > Quadratic Equations and Inequalities > Nature of Roots", 30,
  r"""Step 1: Discriminant $=\cos^2\beta+4(1-\cos\beta)\sin\beta$, which is $\ge0$ since $\sin\beta\ge0$ and $1-\cos\beta\ge0$ on $[0,\pi]$.
Step 2: At $\beta=0$ the equation is $x=0$, still a real root. So a real root exists whenever $1-\cos\beta\ge0$, which always holds.
Answer: (d)""", theme="Real roots with trigonometric coefficients")

Q(46, r"""In a triangle $ABC$, $AB=16$ cm, $BC=63$ cm and $AC=65$ cm. What is the value of $\cos2A+\cos2B+\cos2C$?""",
  ["$-1$", "0", "1", r"$\dfrac{76}{65}$"], "A", "Trigonometry > Properties of Triangles > Ratios of Sides and Angles", 25,
  r"""Step 1: $16^2+63^2=4225=65^2$, so $B=90^\circ$.
Step 2: $\cos2A+\cos2B+\cos2C=-1-4\cos A\cos B\cos C=-1$.
Answer: (a)""", theme="Right triangle identity")

Q(47, r"""If $f(\theta)=\dfrac1{1+\tan\theta}$ and $\alpha+\beta=\dfrac{5\pi}4$, then what is the value of $f(\alpha)f(\beta)$?""",
  [r"$-\dfrac12$", r"$\dfrac12$", "1", "2"], "B", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 20,
  r"""Step 1: $\tan(\alpha+\beta)=1$ gives $(1+\tan\alpha)(1+\tan\beta)=2$.
Step 2: $f(\alpha)f(\beta)=\dfrac12$.
Answer: (b)""", theme="Product (1 + tan a)(1 + tan b)")

Q(48, r"""If $\tan\alpha$ and $\tan\beta$ are the roots of the equation $x^2-6x+8=0$, then what is the value of $\cos(2\alpha+2\beta)$?""",
  [r"$\dfrac{13}{75}$", r"$\dfrac{13}{85}$", r"$\dfrac{17}{85}$", r"$\dfrac{19}{85}$"], "B", "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 25,
  r"""Step 1: $\tan(\alpha+\beta)=\dfrac6{1-8}=-\dfrac67$.
Step 2: $\cos2(\alpha+\beta)=\dfrac{1-36/49}{1+36/49}=\dfrac{13}{85}$.
Answer: (b)""", theme="Double angle from roots")

Q(49, r"""What is the value of $\tan65^\circ+2\tan45^\circ-2\tan40^\circ-\tan25^\circ$?""",
  ["0", "1", "2", "4"], "C", "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 25,
  r"""Step 1: $\tan65^\circ-\tan25^\circ=\dfrac{\sin40^\circ}{\cos65^\circ\cos25^\circ}=\dfrac{\sin40^\circ}{\frac12\cos40^\circ}=2\tan40^\circ$.
Step 2: The expression is $2\tan40^\circ+2-2\tan40^\circ=2$.
Answer: (c)""", theme="Difference of complementary tangents")

Q(50, r"""Consider the following statements:
1. In a triangle $ABC$, if $\cot A\cdot\cot B\cdot\cot C>0$, then the triangle is an acute angled triangle.
2. In a triangle $ABC$, if $\tan A\cdot\tan B\cdot\tan C>0$, then the triangle is an obtuse angled triangle.
Which of the statements given above is/are correct?""",
  ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], "A", "Trigonometry > Properties of Triangles > Ratios of Sides and Angles", 20,
  r"""Step 1: At most one angle can be obtuse, so a positive product of cotangents (or tangents) means no angle is obtuse: the triangle is acute.
Step 2: Statement 1 is correct; statement 2 is not.
Answer: (a)""", pattern=S2, theme="Sign of tan and cot products")
