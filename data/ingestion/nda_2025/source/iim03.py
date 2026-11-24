from qfmt import Q, P, F, W

# NDA II 2025 Mathematics, Set A, booklet pages 31-43, Q81-120
SI = ["Both Statement-I and Statement-II are correct and Statement-II explains Statement-I",
      "Both Statement-I and Statement-II are correct but Statement-II does not explain Statement-I",
      "Statement-I is correct but Statement-II is not correct",
      "Statement-I is not correct but Statement-II is correct"]

P("cuberoot", "Function with a cube root", r"""Consider the function $f(x)=1-\sqrt[3]{(x-1)^{2}}$.""")

Q(81, r"""What is the domain of the function?""",
  [r"$(1,\infty)$", r"$(-\infty,\infty)$", r"$(0,\infty)$", r"$(-\infty,\infty)\setminus\{1\}$"], "B",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 15,
  r"""Step 1: A cube root is defined for every real number, and $(x-1)^2$ is defined everywhere.
Step 2: So the domain is $(-\infty,\infty)$.
Answer: (b)""", passage="cuberoot", pattern="Linked Item Set", theme="Domain with a cube root")

Q(82, r"""The function has""",
  ["a minimum at $x=1$", "a maximum at $x=1$", "neither maximum nor minimum at $x=1$", "no extremum"], "B",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 35,
  r"""Step 1: $(x-1)^{2/3}\ge0$ with equality only at $x=1$.
Step 2: So $f(x)\le1=f(1)$ for all $x$: a maximum at $x=1$ (even though $f$ is not differentiable there).
Answer: (b)""", passage="cuberoot", pattern="Linked Item Set", theme="Extremum at a cusp")

P("exp5", "Piecewise exponential function",
  r"""Consider the function
$$f(x)=\begin{cases}4(5^{x}), & x<0\\ 8k+x, & x\ge0\end{cases}$$""")

Q(83, r"""If the function is continuous, then what is the value of $k$?""",
  ["0.5", "1", "1.5", "2"], "A",
  "Differential Calculus > Limits and Continuity > Continuity", 15,
  r"""Step 1: Left limit at 0: $4\cdot5^0=4$. Value at 0: $8k$.
Step 2: $8k=4$ gives $k=0.5$.
Answer: (a)""", passage="exp5", pattern="Linked Item Set", theme="Continuity of a piecewise function")

Q(84, r"""What is $f'(-1)$ equal to?""",
  [r"$\dfrac25\ln5$", r"$\dfrac35\ln5$", r"$\dfrac45\ln5$", r"$20\ln5$"], "C",
  "Differential Calculus > Differentiation > Standard Derivatives and Rules", 20,
  r"""Step 1: For $x<0$, $f'(x)=4\cdot5^x\ln5$.
Step 2: $f'(-1)=\dfrac45\ln5$.
Answer: (c)""", passage="exp5", pattern="Linked Item Set", theme="Derivative of an exponential")

P("uv", "Integrals of e^x cos x and e^x sin x",
  r"""Let $u=\displaystyle\int e^{x}\cos x\,dx$ and $v=\displaystyle\int e^{x}\sin x\,dx$.""")

Q(85, r"""What is $u+v$ equal to?""",
  [r"$-\dfrac{du}{dx}$", r"$-\dfrac{dv}{dx}$", r"$\dfrac{du}{dx}$", r"$\dfrac{dv}{dx}$"], "D",
  "Integral Calculus and Differential Equations > Indefinite Integration > Integration by Parts", 40,
  r"""Step 1: $u+v=\displaystyle\int e^x(\sin x+\cos x)\,dx=e^x\sin x$ (up to a constant), using $\int e^x(f+f')\,dx=e^xf$.
Step 2: $\dfrac{dv}{dx}=e^x\sin x$.
Answer: (d)""", passage="uv", pattern="Linked Item Set", theme="Sum of two related integrals")

Q(86, r"""Consider the following:

I. $\dfrac{du}{dx}=-v$
II. $\dfrac{dv}{dx}=-u$

Which of the above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Integral Calculus and Differential Equations > Indefinite Integration > Integration by Parts", 35,
  r"""Step 1: $\dfrac{du}{dx}=e^x\cos x$ and $\dfrac{dv}{dx}=e^x\sin x$.
Step 2: $u=\dfrac{e^x(\sin x+\cos x)}2$ and $v=\dfrac{e^x(\sin x-\cos x)}2$, so $-v\ne e^x\cos x$ and $-u\ne e^x\sin x$.
Answer: (d)""", passage="uv", pattern="2-Statement Combination", theme="Derivatives of the integrals")

P("absf", "Sum of two absolute values", r"""Let the function $f(x)=|x-3|+|x-4|$ be defined on the interval $[0,5]$.""")

Q(87, r"""What is $\dfrac{dy}{dx}$ at $x=3.5$ equal to?""",
  ["0", "1", "2", "3.5"], "A",
  "Differential Calculus > Differentiation > Standard Derivatives and Rules", 20,
  r"""Step 1: For $3<x<4$, $f(x)=(x-3)+(4-x)=1$.
Step 2: The derivative of a constant is 0.
Answer: (a)""", passage="absf", pattern="Linked Item Set", theme="Derivative of a modulus sum")

Q(88, r"""Consider the following statements:

I. The function is differentiable at $x=3$.
II. The function is differentiable at $x=4$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Differential Calculus > Limits and Continuity > Continuity", 30,
  r"""Step 1: At $x=3$ the left derivative is $-2$ and the right derivative is $0$.
Step 2: At $x=4$ the left derivative is $0$ and the right derivative is $2$.
Step 3: $f$ is not differentiable at either point.
Answer: (d)""", passage="absf", pattern="2-Statement Combination", theme="Corners of a modulus function")

P("tanh10", "A ratio of exponentials", r"""Consider the function
$$f(x)=\dfrac{10^{x}-10^{-x}}{10^{x}+10^{-x}}$$""")

Q(89, r"""What is $f\circ f\circ f\circ f\circ f(0)$ equal to?""",
  ["0", "1", "5", "10"], "A",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 15,
  r"""Step 1: $f(0)=\dfrac{1-1}{1+1}=0$.
Step 2: Applying $f$ again keeps giving 0.
Answer: (a)""", passage="tanh10", pattern="Linked Item Set", theme="Repeated composition at a fixed point")

Q(90, r"""What is the inverse of the function?""",
  [r"$\log_{10}(2x-1)$", r"$\dfrac12\log_{10}(2x-1)$", r"$\dfrac14\log_{10}\left(\dfrac{2x}{2-x}\right)$", r"$\dfrac12\log_{10}\left(\dfrac{1+x}{1-x}\right)$"], "D",
  "Algebra > Sets, Relations and Functions > Functions: Domain, Range, Composition and Inverse", 40,
  r"""Step 1: $y=\dfrac{10^{2x}-1}{10^{2x}+1}$, so $10^{2x}=\dfrac{1+y}{1-y}$.
Step 2: $x=\dfrac12\log_{10}\dfrac{1+y}{1-y}$. Swapping variables, $f^{-1}(x)=\dfrac12\log_{10}\dfrac{1+x}{1-x}$.
Answer: (d)""", passage="tanh10", pattern="Linked Item Set", theme="Inverse of a ratio of exponentials")

Q(91, r"""What is the degree of the differential equation
$$\left(\dfrac{d^{2}y}{dx^{2}}\right)^{\frac32}=\left(\dfrac{dy}{dx}\right)^{\frac52}?$$""",
  ["3", "2", r"$\dfrac52$", r"$\dfrac32$"], "A",
  "Integral Calculus and Differential Equations > Differential Equations > Order and Degree", 30,
  r"""Step 1: Square both sides to clear fractional powers: $\left(\dfrac{d^2y}{dx^2}\right)^3=\left(\dfrac{dy}{dx}\right)^5$.
Step 2: The highest derivative appears with power 3, so the degree is 3.
Answer: (a)""", theme="Degree after clearing fractional powers")

Q(92, r"""What is $\displaystyle\int_{n}^{n+1}(x-[x])\,dx$, where $[\cdot]$ is the greatest integer function and $n$ is natural number?""",
  [r"$\dfrac{4n+1}2$", r"$\dfrac{2n+1}2$", r"$\dfrac12$", "1"], "C",
  "Integral Calculus and Differential Equations > Definite Integrals > Properties of Definite Integrals", 25,
  r"""Step 1: On $[n,n+1)$, $[x]=n$, so the integrand is $x-n$.
Step 2: $\displaystyle\int_n^{n+1}(x-n)\,dx=\dfrac12$.
Answer: (c)""", theme="Integral of the fractional part")

Q(93, r"""Consider the following statements:

I. $y=xe^{2x}$ is the solution of $\dfrac{dy}{dx}=y\left(2+\dfrac1x\right)$.
II. $y=x\ln|x|+cx$ is the solution of $\dfrac{dy}{dx}=\dfrac{x+y}x$.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "C",
  "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 40,
  r"""Step 1: For I, $y'=e^{2x}(1+2x)$ and $y\left(2+\dfrac1x\right)=e^{2x}(2x+1)$. They match.
Step 2: For II, $y'=\ln|x|+1+c$ and $\dfrac{x+y}{x}=1+\ln|x|+c$. They match.
Answer: (c)""", pattern="2-Statement Combination", theme="Verifying solutions of differential equations")

Q(94, r"""If $k$ is an arbitrary constant, then what is the general solution of the equation $(x+y)^{2}\dfrac{dy}{dx}=k^{2}$?""",
  [r"$y+x=\tan(x+c)+k$", r"$x+y=k\tan\left(\dfrac{y-c}k\right)$", r"$x-y=k\tan\left(\dfrac{y-c}k\right)$", r"$y-x=\tan(x+c)+k$"], "B",
  "Integral Calculus and Differential Equations > Differential Equations > First-order Solutions", 60,
  r"""Step 1: Put $v=x+y$: $v^2(v'-1)=k^2$, so $\dfrac{v^2}{v^2+k^2}\,dv=dx$.
Step 2: Integrate: $v-k\tan^{-1}\dfrac vk=x+c$, i.e. $y-c=k\tan^{-1}\dfrac{x+y}k$.
Step 3: So $x+y=k\tan\left(\dfrac{y-c}k\right)$.
Answer: (b)""", theme="Substitution v = x + y")

Q(95, r"""What is $\displaystyle\int\dfrac{dx}{10^{x}+10^{-x}}$ equal to?""",
  [r"$\tan^{-1}(10^{x})+c$", r"$(\ln10)\tan^{-1}(10^{x})+c$", r"$\dfrac1{\ln10}\tan^{-1}(10^{x})+c$", r"$\ln(10^{x}+10^{-x})+c$"], "C",
  "Integral Calculus and Differential Equations > Indefinite Integration > Substitution", 35,
  r"""Step 1: $\dfrac1{10^x+10^{-x}}=\dfrac{10^x}{10^{2x}+1}$.
Step 2: Put $t=10^x$, $dt=10^x\ln10\,dx$: the integral is $\dfrac1{\ln10}\displaystyle\int\dfrac{dt}{1+t^2}=\dfrac1{\ln10}\tan^{-1}(10^x)+c$.
Answer: (c)""", theme="Integral reducing to arctan")

Q(96, r"""A wire of length 20 cm is to be bent into a rectangle. Which of the following statements is/are correct?

I. The rectangle of the largest area is the square.
II. It is possible to form a rectangle of an area of 27 cm$^{2}$.

Select the answer using the code given below.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "A",
  "Differential Calculus > Applications of Derivatives > Maxima and Minima", 25,
  r"""Step 1: With sides $x$ and $10-x$, the area $x(10-x)$ is greatest at $x=5$, a square of area 25.
Step 2: So no rectangle can have area 27.
Answer: (a)""", pattern="2-Statement Combination", theme="Largest rectangle with fixed perimeter")

Q(97, r"""If $I_1=\displaystyle\int_e^{e^{2}}\dfrac{dx}{\ln x}$ and $I_2=\displaystyle\int_1^{2}\dfrac{e^{x}}x\,dx$, then which one of the following is correct?""",
  ["$I_1-I_2=0$", "$I_1+I_2=0$", "$I_1-2I_2=0$", "$2I_1-I_2=0$"], "A",
  "Integral Calculus and Differential Equations > Definite Integrals > Evaluation", 35,
  r"""Step 1: In $I_1$ put $x=e^t$, $dx=e^t\,dt$; the limits become $1$ to $2$.
Step 2: $I_1=\displaystyle\int_1^2\dfrac{e^t}t\,dt=I_2$.
Answer: (a)""", theme="Substitution in a definite integral")

Q(98, r"""What is the area of the region bounded by $|x|\le2k$ and $|y|\le k$, where $k$ is a positive real number?""",
  ["$2k^{2}$", "$4k^{2}$", "$5k^{2}$", "$8k^{2}$"], "D",
  "Integral Calculus and Differential Equations > Area under Curves > Area between Curves", 15,
  r"""Step 1: The region is a rectangle of width $4k$ and height $2k$.
Step 2: Area $=8k^2$.
Answer: (d)""", theme="Area of a rectangular region")

Q(99, r"""Consider the following statements regarding the function $f(x)=\dfrac1{x-5}$:

Statement-I: $f(x)$ is decreasing on the intervals $x<5$ and $x>5$.

Statement-II: $f'(x)>0$ for all $x\ne5$.

Which one of the following is correct in respect of the above statements?""",
  SI, "C", "Differential Calculus > Applications of Derivatives > Increasing and Decreasing Functions", 25,
  r"""Step 1: $f'(x)=-\dfrac1{(x-5)^2}<0$ for all $x\ne5$.
Step 2: So $f$ decreases on each interval (Statement-I correct) and Statement-II is wrong.
Answer: (c)""", pattern="Assertion-Reason", theme="Monotonicity of 1/(x-5)")

Q(100, r"""Consider the following statements:

Statement-I: The function $f(x)=\dfrac{x^{3}+128}x$ has a minimum value 48 at $x=4$.

Statement-II: As $x$ increases through 4, $f'(x)$ changes sign from positive to negative.

Which one of the following is correct in respect of the above statements?""",
  SI, "C", "Differential Calculus > Applications of Derivatives > Maxima and Minima", 40,
  r"""Step 1: $f(x)=x^2+\dfrac{128}x$, so $f'(x)=2x-\dfrac{128}{x^2}=0$ at $x=4$, and $f(4)=16+32=48$.
Step 2: $f'$ is negative just before 4 and positive just after, so $x=4$ is a (local) minimum. Statement-I is correct.
Step 3: Statement-II describes a sign change from positive to negative, which would give a maximum. It is wrong.
Answer: (c)""", pattern="Assertion-Reason", theme="First-derivative test for a minimum")

Q(101, r"""What is the harmonic mean of the numbers $C(10,3)$, $C(10,4)$, $C(10,5)$, $C(10,6)$ and $C(10,7)$?""",
  ["3150/19", "4000/19", "252", "225"], "A",
  "Statistics > Measures of Central Tendency > Mean", 40,
  r"""Step 1: The numbers are $120, 210, 252, 210, 120$.
Step 2: $\sum\dfrac1x=\dfrac2{120}+\dfrac2{210}+\dfrac1{252}=\dfrac{19}{630}$.
Step 3: HM $=\dfrac5{19/630}=\dfrac{3150}{19}$.
Answer: (a)""", theme="Harmonic mean of binomial coefficients")

Q(102, r"""In a sample survey of a village, the probability that a farmer is in debt is 0.60. What is the probability that three randomly selected farmers are all in debt (assume independence of events)?""",
  ["0.000216", "0.064", "0.216", "0.512"], "C",
  "Probability > Classical Probability > Addition and Multiplication Rules", 10,
  r"""Step 1: For independent events, multiply: $0.6^3=0.216$.
Answer: (c)""", theme="Product of independent probabilities")

Q(103, r"""The probability that a family owns a laptop is 0.68; that it also owns a desktop is 0.56. If the probability that it owns both is 0.48, then what is the probability that a randomly selected family owns a laptop or a desktop?""",
  ["0.80", "0.76", "0.36", "0.28"], "B",
  "Probability > Classical Probability > Addition and Multiplication Rules", 10,
  r"""Step 1: $P(L\cup D)=0.68+0.56-0.48=0.76$.
Answer: (b)""", theme="Addition rule")

Q(104, r"""An urn contains 10 white and 5 red balls. If two balls are drawn at random, then what is the probability that both the balls are red?""",
  ["2/21", "1/7", "4/21", "3/7"], "A",
  "Probability > Classical Probability > Events and Sample Space", 15,
  r"""Step 1: $\dfrac{\binom52}{\binom{15}2}=\dfrac{10}{105}=\dfrac2{21}$.
Answer: (a)""", theme="Drawing two balls")

Q(105, r"""An urn contains 5 white, 6 red and 4 blue balls. Three balls are drawn at random. What is the probability that a white ball, a red ball and a blue ball are drawn?""",
  ["28/91", "2/7", "24/91", "23/91"], "C",
  "Probability > Classical Probability > Events and Sample Space", 20,
  r"""Step 1: Favourable: $5\times6\times4=120$. Total: $\binom{15}3=455$.
Step 2: $\dfrac{120}{455}=\dfrac{24}{91}$.
Answer: (c)""", theme="One ball of each colour")

Q(106, r"""Under which of the following conditions may binomial distribution be used?

I. The number of trials is infinite and not fixed.
II. The trials are independent.
III. Each trial has two possible outcomes.

Select the correct answer using the code given below.""",
  ["II only", "III only", "I and II", "II and III"], "D",
  "Probability > Probability Distributions > Binomial Distribution", 15,
  r"""Concept: a binomial model needs a fixed finite number of independent trials, each with two outcomes and constant success probability.
Step 1: I is wrong (the number of trials must be fixed). II and III are required conditions.
Answer: (d)""", pattern="3-Statement Combination", theme="Conditions for a binomial model")

Q(107, r"""A person $X$ speaks the truth 4 out of 5 times and person $Y$ speaks the truth 5 out of 6 times. What is the probability that they will contradict each other in stating the fact?""",
  ["3/10", "1/15", "1/6", "7/10"], "A",
  "Probability > Conditional Probability > Conditional Probability and Independence", 30,
  r"""Step 1: They contradict when exactly one tells the truth.
Step 2: $\dfrac45\cdot\dfrac16+\dfrac15\cdot\dfrac56=\dfrac4{30}+\dfrac5{30}=\dfrac3{10}$.
Answer: (a)""", theme="Probability of contradiction")

Q(108, r"""The probability that a student passes Physics test is $2/3$ and the probability that he passes both Physics test and English test is $11/15$. The probability that he passes at least one test is $4/5$. What is the probability that he passes English test?""",
  ["11/15", "13/15", "14/15", "1"], "B",
  "Probability > Classical Probability > Addition and Multiplication Rules", 30,
  r"""Step 1: $P(P\cup E)=P(P)+P(E)-P(P\cap E)$, so $P(E)=\dfrac45-\dfrac23+\dfrac{11}{15}=\dfrac{12-10+11}{15}=\dfrac{13}{15}$.
Note: as printed, $P(\text{both})=\dfrac{11}{15}$ exceeds $P(\text{Physics})=\dfrac23$, which cannot happen; the addition rule still gives the intended answer.
Answer: (b)""", theme="Addition rule to find one probability")
F(108, "Printed data inconsistent: P(both)=11/15 > P(Physics)=2/3. Formula answer 13/15.")

Q(109, r"""An event $X$ can happen with probability $p$ and event $Y$ can happen with probability $q$. Further, $X$ and $Y$ are independent events. Which of the following statements is/are correct?

I. The probability that exactly one of the events happens is $p+q-pq$.
II. The probability that at least one of the events happens is $p+q-2pq$.

Select the answer using the code given below.""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "D",
  "Probability > Conditional Probability > Conditional Probability and Independence", 30,
  r"""Step 1: Exactly one: $p(1-q)+q(1-p)=p+q-2pq$.
Step 2: At least one: $1-(1-p)(1-q)=p+q-pq$.
Step 3: The two statements have the formulas swapped, so neither is correct.
Answer: (d)""", pattern="2-Statement Combination", theme="Exactly one versus at least one")

Q(110, r"""Three faces of a die are black, two faces are white and one face is red. The die is tossed three times. What is the probability that the colours black, white and red appear in the first, second and third tosses respectively?""",
  ["1/36", "1/6", "7/36", "5/36"], "A",
  "Probability > Classical Probability > Addition and Multiplication Rules", 15,
  r"""Step 1: $\dfrac36\cdot\dfrac26\cdot\dfrac16=\dfrac1{36}$.
Answer: (a)""", theme="Sequence of independent tosses")

Q(111, r"""A fair coin is tossed 4 times. What is the probability that two heads do not occur consecutively?""",
  ["1/8", "3/8", "7/16", "1/2"], "D",
  "Probability > Classical Probability > Events and Sample Space", 40,
  r"""Step 1: Count strings of length 4 with no HH. With $a_n$ such strings, $a_n=a_{n-1}+a_{n-2}$, $a_1=2$, $a_2=3$, so $a_3=5$, $a_4=8$.
Step 2: Probability $=\dfrac8{16}=\dfrac12$.
Answer: (d)""", theme="No two consecutive heads")

Q(112, r"""In a throw of three dice, what is the probability of getting one prime number, one composite number and one number which is neither prime nor composite?""",
  ["1/2", "1/3", "1/4", "1/6"], "D",
  "Probability > Classical Probability > Events and Sample Space", 35,
  r"""Step 1: Primes $\{2,3,5\}$, composites $\{4,6\}$, neither $\{1\}$.
Step 2: Favourable outcomes: $3!\times3\times2\times1=36$ out of $216$.
Step 3: Probability $=\dfrac{36}{216}=\dfrac16$.
Answer: (d)""", theme="Prime, composite and neither on three dice")

Q(113, r"""An integer is chosen at random from the first 50 integers. What is the probability that the integer is neither divisible by 5 nor 9?""",
  ["7/10", "18/25", "37/50", "19/25"], "B",
  "Probability > Classical Probability > Events and Sample Space", 25,
  r"""Step 1: Divisible by 5: 10; by 9: 5; by both (45): 1. So 14 are divisible by 5 or 9.
Step 2: $\dfrac{50-14}{50}=\dfrac{36}{50}=\dfrac{18}{25}$.
Answer: (b)""", theme="Neither divisible by 5 nor 9")

Q(114, r"""Out of 50 consecutive natural numbers, two integers are chosen at random. What is the probability that their sum is odd?""",
  ["1/2", "24/49", "1/4", "25/49"], "D",
  "Probability > Classical Probability > Events and Sample Space", 30,
  r"""Step 1: There are 25 odd and 25 even numbers. An odd sum needs one of each: $25\times25=625$ ways.
Step 2: Total $\binom{50}2=1225$, so the probability is $\dfrac{625}{1225}=\dfrac{25}{49}$.
Answer: (d)""", theme="Odd sum of two chosen numbers")

Q(115, r"""The standard deviation of 100 observations is 10. If 20 is added to each observation, then what will be the new standard deviation?""",
  ["10", "15", "20", "25"], "A",
  "Statistics > Measures of Dispersion > Variance and Standard Deviation", 10,
  r"""Concept: adding a constant shifts every value equally and does not change spread.
Answer: (a)""", theme="Effect of shifting data on SD")

Q(116, r"""Let $X$ be a random variable following binomial distribution with parameters $n=5$ and $p=k$. Further, $P(X=1)=0.4096$ and $P(X=2)=0.2048$. What is the value of $k$?""",
  ["0.2", "0.25", "0.3", "0.35"], "A",
  "Probability > Probability Distributions > Binomial Distribution", 35,
  r"""Step 1: $\dfrac{P(X=1)}{P(X=2)}=\dfrac{5k(1-k)^4}{10k^2(1-k)^3}=\dfrac{1-k}{2k}=2$.
Step 2: $1-k=4k$ gives $k=0.2$. Check: $5(0.2)(0.8)^4=0.4096$.
Answer: (a)""", theme="Binomial parameter from two probabilities")

Q(117, r"""The frequency distribution of the marks obtained by students in a Science examination is given below:

| Marks | 5-15 | 15-25 | 25-35 | 35-45 |
|---|---|---|---|---|
| Number of students | 20 | 30 | 30 | 20 |

What is the arithmetic mean?""",
  ["20", "25", "30", "35"], "B",
  "Statistics > Measures of Central Tendency > Mean", 15,
  r"""Step 1: Class marks: 10, 20, 30, 40.
Step 2: Mean $=\dfrac{200+600+900+800}{100}=25$.
Answer: (b)""", theme="Mean of grouped data")

Q(118, r"""If $P(A)=0.3$, $P(B)=0.4$ and $P(A|B)=0.5$, then what is the value of $P(B|A)$?""",
  ["0.325", "0.333", "0.375", "0.667"], "D",
  "Probability > Conditional Probability > Conditional Probability and Independence", 20,
  r"""Step 1: $P(A\cap B)=P(A|B)P(B)=0.2$.
Step 2: $P(B|A)=\dfrac{0.2}{0.3}\approx0.667$.
Answer: (d)""", theme="Reversing a conditional probability")

Q(119, r"""If $P(A)=1/3$, $P(B)=1/2$ and $P(A\cap B)=1/4$, then what is the value of $P(\bar A\cup B)$?""",
  ["7/12", "2/3", "3/4", "11/12"], "D",
  "Probability > Classical Probability > Addition and Multiplication Rules", 30,
  r"""Step 1: $\bar A\cup B$ is the complement of $A\cap\bar B$.
Step 2: $P(A\cap\bar B)=\dfrac13-\dfrac14=\dfrac1{12}$, so $P(\bar A\cup B)=\dfrac{11}{12}$.
Answer: (d)""", theme="Complement of A and not B")

Q(120, r"""Consider the following statements:

I. Mean and variance have the same unit of measurement.
II. Mean deviation and standard deviation have the same unit of measurement.

Which of the statements given above is/are correct?""",
  ["I only", "II only", "Both I and II", "Neither I nor II"], "B",
  "Statistics > Measures of Dispersion > Variance and Standard Deviation", 15,
  r"""Step 1: Variance is in squared units, so I is wrong.
Step 2: Mean deviation and standard deviation are both in the original units, so II is correct.
Answer: (b)""", pattern="2-Statement Combination", theme="Units of statistical measures")
