from qfmt import Q, P

# NDA I 2026 Mathematics, Set D (D - NPSS-A-HMT), booklet pages 3 and 5
Q(1, r"""If $M^{T}$ is the transpose of a $2\times 2$ matrix $M$, then which of the following is/are correct?

I. $|M+M^{T}|=|M|+|M^{T}|$ if $M$ is symmetric.
II. $|M+M^{T}|=0$ if $M$ is anti-symmetric.

Select the answer using the code given below:""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "B",
  "Matrices and Determinants > Matrices > Transpose, Symmetric and Skew-symmetric", 40,
  r"""Concept: for a $2\times2$ matrix, $|kM|=k^2|M|$.
Step 1: If $M$ is symmetric, $M+M^T=2M$, so $|M+M^T|=4|M|$, while $|M|+|M^T|=2|M|$. These are equal only when $|M|=0$, so I is not true in general.
Step 2: If $M$ is anti-symmetric, $M^T=-M$, so $M+M^T=O$ and its determinant is $0$. II is true.
Answer: (b)""", pattern="2-Statement Combination", theme="Determinant of M + M transpose")

Q(2, r"""If $M$ is a square matrix such that $M^{3}=M$, then how many values of $|M|$ are possible?""",
  ["One", "Two", "Three", "Four"], "C",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 30,
  r"""Concept: $|M^3|=|M|^3$.
Step 1: $|M|^3=|M|$ gives $|M|(|M|^2-1)=0$.
Step 2: So $|M|\in\{0,1,-1\}$, and each occurs (for example $O$, $I$ and $\mathrm{diag}(-1,1,\dots,1)$).
Answer: (c)""", theme="Determinant of a matrix with M cubed equal to M")

Q(3, r"""Let $p=(x+y+z)$ and $q=xyz$. If $\begin{vmatrix} x & 1 & 1\\ 1 & y & 1\\ 1 & 1 & z\end{vmatrix}$ is positive, then which one of the following is correct?""",
  [r"$q>p$", r"$q+1>p$", r"$q+2>p$", r"$q+2\geq p$"], "C",
  "Matrices and Determinants > Determinants > Evaluation and Properties", 35,
  r"""Step 1: Expand along the first row: $x(yz-1)-1(z-1)+1(1-y)=xyz-x-y-z+2$.
Step 2: This equals $q-p+2$. It is positive exactly when $q+2>p$.
Answer: (c)""", theme="Expanding a 3x3 determinant in x, y, z")

Q(4, r"""What is $\big(((A\cap B)\cup(A-B))-((A\cap B)\cup(B-A))\big)\cup A$ equal to?""",
  [r"$\varphi$", r"$A$", r"$B$", r"$A\cup B$"], "B",
  "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 20,
  r"""Step 1: $(A\cap B)\cup(A-B)=A$ and $(A\cap B)\cup(B-A)=B$.
Step 2: The expression becomes $(A-B)\cup A=A$.
Answer: (b)""", theme="Simplifying set expressions")

Q(5, r"""Let $A$ and $B$ be two sets. For some set $C$, both $A\cap C$ and $B\cap C$ are empty sets and $A\cup C=B\cup C$. Which of the following is/are true?

I. $C=\varphi$
II. $A=B$
III. $A\cup B=C$

Select the answer using the code given below:""",
  ["I only", "II only", "I and II only", "I, II and III"], "B",
  "Algebra > Sets, Relations and Functions > Sets and Venn Diagrams", 35,
  r"""Step 1: Since $A$ and $C$ are disjoint, $A=(A\cup C)-C$. Likewise $B=(B\cup C)-C$.
Step 2: $A\cup C=B\cup C$ therefore gives $A=B$, so II is true.
Step 3: $C$ need not be empty (take $A=B=\{1\}$, $C=\{2\}$), so I is false; and $A\cup B=A$ is disjoint from $C$, so III fails unless all are empty.
Answer: (b)""", pattern="3-Statement Combination", theme="Cancellation law for disjoint unions")

Q(6, r"""If $2\sec 4\beta=\tan 2\alpha+\cot 2\alpha$, then which one of the following is a possible value of $(\alpha+\beta)$?""",
  [r"$\frac{\pi}{2}$", r"$\frac{\pi}{4}$", r"$\frac{\pi}{6}$", r"$\frac{\pi}{8}$"], "D",
  "Trigonometry > Trigonometric Equations > General Solutions", 55,
  r"""Step 1: $\tan2\alpha+\cot2\alpha=\dfrac{1}{\sin2\alpha\cos2\alpha}=\dfrac{2}{\sin4\alpha}$.
Step 2: So $\dfrac{2}{\cos4\beta}=\dfrac{2}{\sin4\alpha}$, i.e. $\cos4\beta=\sin4\alpha=\cos\left(\dfrac{\pi}{2}-4\alpha\right)$.
Step 3: One family of solutions is $4\beta=\dfrac{\pi}{2}-4\alpha+2k\pi$, so $\alpha+\beta=\dfrac{\pi}{8}+\dfrac{k\pi}{2}$. With $k=0$, $\alpha+\beta=\dfrac{\pi}{8}$.
Answer: (d)""", theme="Equation with sec 4 beta and tan 2 alpha + cot 2 alpha")

Q(7, r"""If $\alpha$ and $\beta$ are complementary angles such that $\alpha-\beta=\frac{\pi}{6}$ and $m\tan\beta=n\tan\alpha$, then what is $\left(\frac{m+n}{m-n}\right)$ equal to?""",
  ["2", r"$\frac{2}{\sqrt{3}}$", "1", r"$\frac{1}{\sqrt{3}}$"], "A",
  "Trigonometry > Trigonometric Ratios and Identities > Standard Angles and Allied Angles", 25,
  r"""Step 1: $\alpha+\beta=\dfrac{\pi}{2}$ and $\alpha-\beta=\dfrac{\pi}{6}$ give $\alpha=\dfrac{\pi}{3}$, $\beta=\dfrac{\pi}{6}$.
Step 2: $m\cdot\dfrac{1}{\sqrt3}=n\sqrt3$, so $m=3n$.
Step 3: $\dfrac{m+n}{m-n}=\dfrac{4n}{2n}=2$.
Answer: (a)""", theme="Complementary angles with a tan relation")

Q(8, r"""If $x=\sec\theta-\tan\theta$ and $y=\operatorname{cosec}\theta+\cot\theta$, then which one of the following is correct?""",
  [r"$x+y-xy-1=0$", r"$x-y+xy+1=0$", r"$x+y+xy-1=0$", r"$x-y+xy-1=0$"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Identities and Simplification", 50,
  r"""Concept: write both in terms of $t=\tan\frac{\theta}{2}$.
Step 1: $y=\dfrac{1+\cos\theta}{\sin\theta}=\cot\dfrac{\theta}{2}=\dfrac1t$.
Step 2: $x=\dfrac{1-\sin\theta}{\cos\theta}=\dfrac{(1-t)^2}{1-t^2}=\dfrac{1-t}{1+t}$.
Step 3: With $t=\dfrac1y$: $x=\dfrac{y-1}{y+1}$, so $xy+x=y-1$, i.e. $x-y+xy+1=0$.
Answer: (b)""", theme="Eliminating theta between sec - tan and cosec + cot")

Q(9, r"""If $\cos\theta=\frac{1}{3}$, then what is the value of $\sin\left(\frac{\theta}{2}\right)\sin\left(\frac{3\theta}{2}\right)$?""",
  [r"$\frac{5}{9}$", r"$\frac{7}{9}$", r"$\frac{10}{9}$", r"$\frac{11}{9}$"], "A",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 30,
  r"""Step 1: $2\sin A\sin B=\cos(A-B)-\cos(A+B)$, so the product is $\dfrac{\cos\theta-\cos2\theta}{2}$.
Step 2: $\cos2\theta=2\cdot\dfrac19-1=-\dfrac79$.
Step 3: $\dfrac{\frac13+\frac79}{2}=\dfrac{10/9}{2}=\dfrac59$.
Answer: (a)""", theme="Product of sines using cos theta")

Q(10, r"""$\cos x+\sqrt{3}\sin x$ is maximum when $x$ is equal to""",
  [r"$\frac{\pi}{2}$", r"$\frac{\pi}{3}$", r"$\frac{\pi}{4}$", r"$\frac{\pi}{6}$"], "B",
  "Trigonometry > Trigonometric Ratios and Identities > Compound and Multiple Angles", 20,
  r"""Step 1: $\cos x+\sqrt3\sin x=2\cos\left(x-\dfrac{\pi}{3}\right)$.
Step 2: This is maximum (value 2) when $x=\dfrac{\pi}{3}$.
Answer: (b)""", theme="Maximum of a cos x + b sin x")

Q(11, r"""Let $R$ be a relation on the set $N$ of natural numbers defined by $R=\{(x,y): x,y\in N \text{ and } x=y^{3}\}$. Which of the following statements is/are correct?

I. $R$ is symmetric relation
II. $R$ is transitive relation

Select the answer using the code given below:""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Algebra > Sets, Relations and Functions > Relations", 30,
  r"""Step 1: $(8,2)\in R$ since $8=2^3$, but $(2,8)\notin R$. So $R$ is not symmetric.
Step 2: $(512,8)\in R$ and $(8,2)\in R$, but $512\neq2^3$, so $(512,2)\notin R$. $R$ is not transitive.
Answer: (d)""", pattern="2-Statement Combination", theme="Relation x = y cubed on natural numbers")

Q(12, r"""For a given $k$, what is the minimum value of $x^{2}+kx+k^{2}$?""",
  ["0", r"$\frac{k^{2}}{4}$", r"$\frac{3k^{2}}{4}$", r"$\frac{k^{2}}{2}$"], "C",
  "Algebra > Quadratic Equations and Inequalities > Inequalities", 15,
  r"""Step 1: $x^2+kx+k^2=\left(x+\dfrac k2\right)^2+\dfrac{3k^2}{4}$.
Step 2: The minimum, at $x=-\dfrac k2$, is $\dfrac{3k^2}{4}$.
Answer: (c)""", theme="Minimum value of a quadratic by completing the square")
