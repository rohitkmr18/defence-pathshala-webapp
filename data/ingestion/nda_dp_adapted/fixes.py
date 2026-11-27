# DP adaptations of withheld NDA items (approved 2026-11-27)
P_BODY = r"""Let $\alpha$ and $\beta$ be the roots of the quadratic equation
$$x^{2}+(\log_{0.5}(a^{2}))x-2(\log_{0.5}(a^{2}))^{2}=0$$
where $a^{2}\neq1$ and $\log_{0.5}(a^{2})>0$. Further, $\beta>0$."""
def note(fault): return "\n\nAdapted by DP: the original printed question had " + fault + "; the wording was corrected so it has exactly one correct answer."
FIX = {
 "NDA_II_2026_MATHS_106": dict(stem_sub=("P(A\\cap B)=1/2", "P(A\\cap B)=1/4"), key="B",
   expl=r"""Step 1: $P(A\cup B)=1-P(\bar A\cap\bar B)=\tfrac12$.
Step 2: $P(A)+P(B)-P(A\cap B)=\tfrac k2+k-\tfrac14=\tfrac12$, so $\tfrac{3k}2=\tfrac34$ and $k=\tfrac12$.
Check: $P(A)=\tfrac14=P(A\cap B)$, so $A\subset B$, which is consistent.
Answer: (b)""" + note(r"$P(A\cap B)=1/2$, which contradicts $2P(A)=P(B)$")),
 "NDA_II_2025_GK_085": dict(opts={"opt_b": "a Chera king"}, key="B",
   expl="Senguttuvan (the 'Red Chera') was a Chera ruler of the Sangam age, celebrated in the Silappadikaram for building a memorial to Kannagi.\nAnswer: (b)" + note("option (b) as 'a Chola king', so no option was correct")),
 "NDA_II_2025_MATHS_021": dict(passage=True, key="B",
   expl=r"""Step 1: Let $L=\log_{0.5}(a^2)>0$. Then $x^2+Lx-2L^2=(x-L)(x+2L)$, so the roots are $L$ and $-2L$.
Step 2: $\beta>0$, so $\beta=L=\log_{0.5}(a^2)$.
Answer: (b)""" + note("a constant term and an extra condition that contradicted each other")),
 "NDA_II_2025_MATHS_022": dict(passage=True, key="C",
   expl=r"""Step 1: From the previous item, $\beta=L$ and the other root is $\alpha=-2L$.
Step 2: So $\alpha=-2\beta$. Check: $\alpha+\beta=-L$ and $\alpha\beta=-2L^2$, as the equation requires.
Answer: (c)""" + note("a constant term and an extra condition that contradicted each other")),
 "NDA_I_2024_MATHS_066": dict(stem_sub=("\\alpha\\hat i-\\beta\\hat j+\\gamma\\hat k", "\\alpha\\hat i+\\beta\\hat j+\\gamma\\hat k"), key="A",
   expl=r"""Step 1: $\vec a\times(\vec b\times\vec a)=(\vec a\cdot\vec a)\vec b-(\vec a\cdot\vec b)\vec a=3\vec b+2\vec a=5\hat i+4\hat j-\hat k$.
Step 2: $\alpha=5$, $\beta=4$, $\gamma=-1$, so $\alpha+\beta+\gamma=8$.
Answer: (a)""" + note(r"$-\beta\hat j$, which made the sum 0 (not an option)")),
 "NDA_I_2024_MATHS_106": dict(opts={"opt_b": "1 and 2 only"}, key="B",
   expl=r"""Step 1: For $a, b, c$ in HP, $b=\dfrac{2ac}{a+c}$ and $\dfrac1{b-a}+\dfrac1{b-c}=\dfrac2b=\dfrac1a+\dfrac1c$ (check: $a=1$, $c=3$, $b=\tfrac32$ gives $\tfrac43$ for each).
Step 2: Expression 3 equals $\dfrac3{2b}$, which differs.
Answer: (b)""" + note("option (b) as '2 only', so the correct combination (1 and 2) was not offered")),
 "NDA_II_2024_GK_123": dict(stem_sub=("travelling a distance of 20 m", "travelling a distance of 10 m"), key="A",
   expl=r"""$v^2=2as$: $100=2a\times10$, so $a=5$ m/s$^2$ and $F=ma=2\times5=10$ N.
Answer: (a)""" + note("a distance of 20 m, which gives 5 N (not an option)")),
 "NDA_II_2024_MATHS_026": dict(opts={"opt_b": "Only four"}, key="B",
   expl=r"""Step 1: The equation gives $\cos2x\cos3x-\sin2x\sin3x=0$, i.e. $\cos5x=0$, so $x=\dfrac\pi{10},\dfrac{3\pi}{10},\dfrac\pi2,\dfrac{7\pi}{10},\dfrac{9\pi}{10}$.
Step 2: At $x=\dfrac\pi2$, $\cot2x=\cot\pi$ is undefined, so that value must be rejected. Exactly 4 solutions remain. (Counting all five roots of $\cos5x=0$ is the trap.)
Answer: (b)""" + note("option (b) as 'Only two', so the correct count of 4 was not offered")),
}
