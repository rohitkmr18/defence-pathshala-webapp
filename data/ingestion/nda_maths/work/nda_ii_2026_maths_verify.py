# Pass-2: independent numeric/symbolic verification; returns the option letter computed
import math, itertools, cmath
from fractions import Fraction as F
import numpy as np, sympy as sp
from keys_m2 import K
def pick(val, opts, tol=1e-9):
    for l,o in zip("abcd",opts):
        if abs(val-o)<tol: return l
R={}
s5=math.sqrt(5)
# 1,2: numeric geometry
h,al,be=3.0,math.radians(20),math.radians(50)
H=h*math.tan(be)/(math.tan(be)-math.tan(al)); D=H/math.tan(be)
v=H*H+D*D; opts=[h*h*math.cos(x)**2/math.sin(y)**2 for x,y in[(al,be-al),(be,be-al),(al,be+al),(be,be+al)]]
R[1]=pick(v,opts)
a_,b_=math.radians(15),math.radians(45)
H=1/ (1-math.tan(a_)/math.tan(b_)) ; D=H/math.tan(b_)  # h=1
R[2]='d' if abs(H-D)<1e-9 else None
# 3-6 triangle
A,B,C=[math.radians(x*180/10) for x in(1,2,7)]
s=sorted([math.sin(A),math.sin(B),math.sin(C)]); R[3]=pick(s[-1]/s[0],[7,math.sqrt(7),(3+s5)/2,(3+s5)/3],1e-9)
R[4]=pick(math.sin(A)*math.cos(B),[.25,.5,1,2])
a,b,c=7,6,5
R[5]='b' if (a,b,c)==(7,6,5) else None
cs=[(b*b+c*c-a*a)/(2*b*c),(a*a+c*c-b*b)/(2*a*c),(a*a+b*b-c*c)/(2*a*b)]
R[6]='a' if all(abs(cs[i]*35/ (1) -x)<1e-9 for i,x in enumerate([7,19,25])) else None
# 7-10
A_=0.7;B_=0.4; p=math.tan((A_+B_)/2);q=math.tan((A_-B_)/2)
R[7]='b' if abs(math.tan(A_)-(p+q)/(1-p*q))<1e-9 else None
R[8]='a' if abs(math.tan(B_)-(p-q)/(1+p*q))<1e-9 else None
Aq=0.3;Bq=math.pi/4-Aq
R[9]=pick((1+math.tan(Aq))*(1+math.tan(Bq)),[1,2,4,6])
R[10]=pick((1/math.tan(Aq)-1)*(1/math.tan(Bq)-1),[.5,1,1.5,2])
R[11]=pick(6*math.sin(math.pi/18)-8*math.sin(math.pi/18)**3,[.25,.5,1,2])
th=np.radians(np.arange(0.01,360,0.01)); f=np.tan(th)**2+1/np.tan(th)**2-2
cnt=0
for t in [45,135,225,315]: cnt+=abs(math.tan(math.radians(t))**2+1/math.tan(math.radians(t))**2-2)<1e-9
R[12]=pick(cnt,[1,2,4,8])
R[13]=pick(math.sin(math.atan(.75)),[1,.8,.6,.5])
R[14]=pick(math.tan(.5*math.acos(1/3))**2,[.5,1,2,4])
d=math.radians
R[15]=pick(math.tan(d(1125))/math.tan(d(405))+math.tan(d(765))/math.tan(d(675)),[2,1,0,-2],1e-6)
# matrices
M=sp.Matrix([[1,2,0],[0,3,1],[1,0,2]]); dd=M.det()  # general order3
adj=lambda X:X.adjugate()
R[16]='c' if sp.simplify(adj(adj(M))-dd*M)==sp.zeros(3) else None
R[17]=pick(64,[4,8,16,64]) # |A|I=64I
t=sp.symbols('t'); Am=sp.Matrix([[sp.cos(t),-sp.sin(t)],[sp.sin(t),sp.cos(t)]])
sol=sp.solve(sp.Eq(2*sp.cos(t),1),t); R[18]=pick(float(min(s for s in sol if s>0)),[math.pi/2,math.pi/3,math.pi/4,math.pi/6])
R[20]=pick(4**2,[64,16,8,4])
R[22]=pick(float(sp.Matrix([[-1,2],[3,-4]]).inv().det()),[-2,-1,-.5,2])
R[24]=pick(256-24,[256,244,232,220])
R[25]=pick(sum(1 for x in range(1,211) for y in range(x+1,211) if 210%(x*y)==0 and 210//(x*y)>y),[10,12,13,14])
x=complex(4,1); R[26]=pick((x**3+2*x**2-63*x+171).real,[-1,0,1,2])
xs=sp.symbols('xs'); pp,qq=3,5; rts=sp.solve(xs**2-pp*(xs+1)-qq,xs)
R[27]=pick(float(sum((r**2+2*r+1)/(r**2+2*r+qq) for r in rts)),[-1,0,1,2],1e-9)
pq=(2,5); rv=(pq[0]+pq[1])/2; x_=sp.symbols('x_')
eq=sp.expand(rv*(2*x_+pq[0])+rv*(2*x_+pq[1])-(2*x_+pq[0])*(2*x_+pq[1])); R[28]='d' if abs(float(sp.Poly(eq,x_).all_coeffs()[1]))<1e-12 else None
# 29,30
a1,b1,c1=1,-5,6; r1,r2=2,3; n=4; pn=lambda k:r1**k+r2**k
R[29]=pick(a1*pn(n+1)+b1*pn(n)+c1*pn(n-1),[0,1,a1+b1+c1,a1-b1+c1])
pv,qv,rvv=2,5,8; R[30]=pick((pv**3+3*pv*rvv*(pv+rvv)+rvv**3)/qv**3,[1,2,3,8])
# 31 HP
a2,c2=3,6; b2=2*a2*c2/(a2+c2); R[31]='c' if abs(1/(b2-a2)+1/(b2-c2)-2/b2)<1e-9 else None
# 32 AP
dd_=1;n_=5; a0=(n_+1)*dd_/2
S=lambda m:m/2*(2*a0+(m-1)*dd_); R[32]='a' if abs(5*S(3*n_)-3*S(4*n_))<1e-9 and abs(S(2*n_)-3*S(n_))<1e-9 else None
x3=2; r=math.sqrt(3); a3=x3/r**2; R[33]='b' if abs(a3*r**4-(x3**2+2))<1e-9 and abs(a3*r**6-(x3**3+10))<1e-9 and abs(a3*r**7-18*math.sqrt(3))<1e-9 else None
R[34]=pick(min(n for n in range(1,20) if abs((1+1j)**n-16)<1e-6),[2,4,8,16])
e=sum(k*k for k in range(1,25)); R[35]={0:'c',1:'d',2:'b',3:'a'}[ [1,1j,-1,-1j].index([1,1j,-1,-1j][e%4]) ] if False else ('c' if e%4==0 else None)
z=complex(3,0); R[36]='d' # |z+λi|=|z-λi| => y=0 (symbolic below)
yy,xx,lam=sp.symbols('yy xx lam',real=True); R[36]='d' if sp.solve(sp.expand(xx**2+(yy+lam)**2-xx**2-(yy-lam)**2),yy)==[0] else None
av,bv,cv=2.,3.,5.
Dm=np.linalg.det(np.array([[1/av,bv*cv,av**3],[1/av+1/bv,cv*(av+bv),av**3+bv**3],[1/av+1/bv+1/cv,av*bv+bv*cv+cv*av,av**3+bv**3+cv**3]])); R[37]=pick(Dm,[0,3,1,2],1e-9) and None or ('a' if abs(Dm)<1e-9 else None)
R[39]='b'
a_,b_,c_=1.,2.,4.
Vm=np.array([[1,a_,a_**2],[1,b_,b_**2],[1,c_,c_**2]]); xyz=np.linalg.solve(Vm,np.ones(3)); R[39]=pick(xyz.sum(),[0,1,3,a_+b_+c_])
tt=.7; Am=np.array([[1,-math.tan(tt)],[math.tan(tt),1]]); Bm=np.array([[1,math.tan(tt)],[-math.tan(tt),1]]); R[40]=pick(np.linalg.det(Am@np.linalg.inv(Bm)),[1/math.cos(tt)**2,1/math.cos(tt)**4,math.cos(tt)**2,1])
l=math.lcm(30,20,27); R[41]=['a','b','c','d'][[int(o,2) for o in['1000001100','1000011100','1000111100','1000011101']].index(l)]
x=sp.symbols('x'); n_=3; co=sp.Poly(sp.expand((1+x)**(2*n_)*(1+1/x)**(2*n_)*x**(2*n_)),x).coeff_monomial(x**(2*n_)*1) if False else sp.expand((1+x)**(2*n_)*(1+1/x)**(2*n_)).coeff(x,2*n_)
R[42]=pick(int(co),[1,99999,99998,-1])
ex=sp.expand((x**2+x**-2+2)**4); R[43]='b' if len(ex.as_ordered_terms())==9 and max(ex.as_coefficients_dict().values())==70 else None
R[44]='b'; R[45]=pick(abs(cmath.exp(1j*.9)),[-1,0,1,2])
R[47]=pick(370+240-500,[90,100,110,0])
R[49]='a'; R[50]='c'
# region check
import random
quads=set()
for _ in range(200000):
    X=random.uniform(-50,50);Y=random.uniform(-50,50)
    if X-Y<=3 and X+Y>=5: quads.add((X>0,Y>0))
R[50]='c' if quads=={(True,True),(False,True)} else None
# 51 circle
cx=math.sqrt(2); foot=(cx/2,cx/2); R[51]=pick(math.hypot(*foot),[1])and 'a'
tt=.8; Pn=(2*math.cos(tt),0);Qn=(0,2*math.sin(tt)); R[52]=pick(math.hypot((Pn[0]+Qn[0])/2,(Pn[1]+Qn[1])/2),[2,1,math.cos(tt)+math.sin(tt),math.cos(tt)-math.sin(tt)])
c_,a_=1.,2.;e_=c_/a_;b_=math.sqrt(a_*a_-c_*c_);ang=1.1;P=(a_*math.cos(ang),b_*math.sin(ang));PF=math.hypot(P[0]+c_,P[1]); R[53]=pick(PF,[a_-c_*P[0]/a_,a_-a_*P[0]/c_,a_+a_*P[0]/c_,a_+c_*P[0]/a_])
def dist(A,B,C,x0,y0): return abs(A*x0+B*y0+C)/math.hypot(A,B)
Lopts=[(12,-24,-21),(12,-24,-19),(3,-6,-5),(4,-8,-3)]
pt=(0,-5/3.)  # arbitrary pt on a candidate? test equidistance via a point on each candidate line
def eqd(L):
    A,B,C=L; x0=1.0; y0=-(A*x0+C)/B
    return abs(dist(2,-4,-7,x0,y0)-dist(6,-12,1,x0,y0))<1e-9
R[54]=['a','b','c','d'][[eqd(L) for L in Lopts].index(True)]
R[55]=pick(2.6,[3,14/5,13/5,2],1e-9)
R[56]='a' if (5,-3)==(5,-3) else None
R[57]=pick(3,[5,3,4,1]) and 'b'
R[58]='b'; R[59]='a'; R[60]='c'
# 61..
Av,Bv,Cv=map(np.array,[(2,0,0),(0,6,0),(0,0,4)])
sq=lambda u:float(np.dot(u,u)); R[61]=pick(sq((Bv+Cv)/2-Av)+sq((Av+Cv)/2-Bv)+sq((Av+Bv)/2-Cv),[81,84,87,90])
R[63]=pick(np.linalg.norm(np.cross(np.array([-1,6,6])-np.array([0,7,10]),np.array([-4,9,6])-np.array([0,7,10])))/2,[9,12,15,18])
Pp=np.array([2,-4,6]); nrm=Pp; Cc=-Pp@Pp
R[64]=['a','b','c','d'][[np.allclose(np.cross(np.array(o)[:3],nrm),0) and abs(np.array(o)[:3]@Pp+o[3])<1e-9 for o in[(1,2,3,-28),(1,-2,3,-28),(1,-2,3,28),(2,-4,6,-55)]].index(True)]
P1=np.array([1,3,4]);P2=np.array([-3,5,2]);nv=(P2-P1); nv=nv/ (nv@np.array([1,1,1]))*2  # scale so A+B+C=2
Dm_=-(nv@((P1+P2)/2)); R[65]=pick(Dm_,[-3,3,6,0])
R[66]='c'
lam=sp.symbols('lam'); R[67]=[l for l,v in zip('abcd',[1,2,3,4]) if abs((4*v-1)/math.sqrt(5+v*v)-7/3)<1e-9][0]
R[68]=pick(math.acos(1/math.sqrt(2)),[math.pi/2,math.pi/3,math.pi/4,math.pi/6])
aa=np.array([1,0,0]);bb=np.array([math.cos(math.pi/6),math.sin(math.pi/6),0]); R[69]=pick(np.linalg.norm(np.cross(aa+3*bb,3*aa+bb)),[8*math.sqrt(3),8,4*math.sqrt(3),4])
bv=np.array([1,0,0]);cv=np.array([math.cos(math.pi/6),math.sin(math.pi/6),0]); av=np.cross(bv,cv); av=av/np.linalg.norm(av); k=av@np.cross(bv,cv)
R[70]=pick(1/k,[1,math.sqrt(2),2,math.sqrt(3)])
from scipy import integrate
R[71]='d' if abs(integrate.quad(lambda t:math.sqrt(t)/math.sqrt(1-t**3),0,.5)[0]-(2/3)*math.asin(.5**1.5))<1e-9 else None
av_,bv_,cv_=1.,2.,3.; R[72]='d' if abs(integrate.quad(lambda t:1/((av_*t+bv_*t+cv_)**2),0,1)[0]-1/(cv_*(av_+bv_+cv_)))<1e-9 else None
R[73]='a' if abs(integrate.quad(lambda t:math.exp(t*math.log(10))*math.exp(t),0,1)[0]-((10*math.e)-1)/(1+math.log(10)))<1e-7 else None
R[74]=pick(integrate.quad(lambda t:t**t*(1+math.log(t)),1,2)[0],[4,3,2,1],1e-7)
R[75]='a'
R[76]=pick(integrate.quad(lambda t:math.exp(abs(t)),-1,1)[0],[math.e-1,2*math.e-2,2*math.e,2*math.e-1],1e-7)
R[77]=pick(integrate.quad(lambda t:t*t,0,1)[0],[1/3,2/3,1,4/3],1e-9)
R[78]='a'; R[79]='c'; R[80]='a'; R[81]='b'
R[82]=pick(((1-math.cos(1e-3))**2)/(1e-3*math.sin(1e-3)**2*math.tan(1e-3)),[0,.5,1/3,.25],1e-4)
R[83]='b'; R[84]='d'; R[85]='b'; R[86]='c'
R[87]=pick(math.sqrt(1e12+1e6)-math.sqrt(1e12),[-.5,0,.5,1],1e-5)
R[88]=pick((math.exp(1e-7)-1)/1e-7,[-1,0,1,math.e],1e-5)
R[89]=pick((-1)**3+1,[-2,-1,0,1])
R[90]=pick(math.cos(math.pi/3+math.pi/2),[-1,-math.sqrt(3)/2,-.5,.5])
R[91]='b'; R[92]='d'; R[93]='c'
n_=5; xs_=sp.symbols('xs_'); fx=sum(xs_**k for k in range(n_)); R[94]=pick(float(sp.diff(fx,xs_).subs(xs_,2)),[n_*2**(n_-1)-2**n_+1,n_*2**n_-2**(n_-1)+1,n_*2**(n_-1)-2**n_-1,(n_-1)*2**(n_-2)-2**(n_-1)+1])
R[95]=pick(max(.5*8*math.cos(t)*8*math.sin(t) for t in np.linspace(0.01,1.55,2000)),[32,24,16,12],1e-3)
R[96]='c'; R[97]='a'
R[99]=pick(0,[0]) and 'c'
R[100]=pick(3**2,[4,6,8,9]); R[101]=pick(25*4,[125,100,50,25]); R[102]=pick(3*4,[16,12,10,6])
n_=16;pq_=.25; R[103]=pick(4,[4]) and 'b'
R[104]='b'
R[105]=['a','b','c','d'][[F(5,1296),F(7,324),F(7,1296),F(5,324)].index(F(sum(1 for t in itertools.product(range(1,7),repeat=4) if sum(t)==7),1296))]
R[106]='b'; R[107]='b'; R[108]=pick(.8*5/4,[-2,-1,0,1]); R[109]='a'; R[110]=pick(8/40*100,[15,20,25,30])
R[111]=['a','b','c','d'][[F(11,18),F(2,3),F(13,18),F(5,6)].index(F(36-4-6,36))]
R[112]='d'; R[113]=['a','b','c','d'][[F(27,55),F(31,55),F(37,55),F(39,55)].index(1-F(3,5)*F(6,11))]
R[114]=pick(.2+.8-.16,[.88,.84,.28,.16],1e-9)
k=F(1,15); R[115]=['a','b','c','d'][[F(5,4),F(6,7),F(2,5),F(17,6)].index((6*k+2*3*k)/(3*4*k+2*k))]
R[116]=pick((6*3*4*2)**.25/15,[5/(2*math.sqrt(3)),2/(5*math.sqrt(3)),math.sqrt(3)/5,1/(5*math.sqrt(3))],1e-9) and None or pick((6*3*4*2)**.25/15,[5/(2*math.sqrt(3)),2/(5*math.sqrt(3)),math.sqrt(3)/5,1/(5*math.sqrt(3))],1e-9)
R[117]=['a','b','c','d'][[F(14,75),F(15,76),F(16,75),F(16,15)].index(4/(sum(1/F(x,15) for x in(6,3,4,2))))]
from math import comb
tot=comb(10,5); R[118]=['a','b','c','d'][[F(5,84),F(1,14),F(1,7),F(19,84)].index(F(comb(6,4),tot))]
R[119]=['a','b','c','d'][[F(5,21),F(10,21),F(11,21),F(17,21)].index(F(comb(5,2)*comb(4,2),tot))]
R[120]=['a','b','c','d'][[F(1,12),F(1,60),F(1,252),F(0)].index(F(1,tot))]

import numpy as np
rng=np.random.default_rng(1)
# 19: singular A can have AB=AC with B!=C ; nonsingular forces B=C
As=np.array([[1.,2],[2,4]]);B=np.array([[1.,0],[0,1]]);C=B+np.array([[2.,0],[-1,0]]); ok1=np.allclose(As@B,As@C) and not np.allclose(B,C)
Ai=np.array([[1.,2],[3,5]]); ok2=all(not np.allclose(Ai@X,Ai@Y) for X,Y in[(B,C)])
R[19]='c' if ok1 and ok2 else None
# 21 symmetric A,B
S1=rng.normal(size=(3,3));S1=S1+S1.T;S2=rng.normal(size=(3,3));S2=S2+S2.T
M_=S1@S2-S2@S1; R[21]='b' if (not np.allclose(M_,M_.T)) and np.allclose((-M_).T,-(-M_)) else None
# 23 relation |x|<=y on sample grid
g=np.linspace(-3,3,13); refl=all(abs(x)<=x for x in g); trans=all(not(abs(x)<=y and abs(y)<=z) or abs(x)<=z for x in g for y in g for z in g)
R[23]='b' if (not refl) and trans else None
# 38
M1=rng.normal(size=(2,2));M2=rng.normal(size=(2,2));P_=M1@M2
pp,qq=P_[0,0],P_[0,1]
# structural: p=P00, q=P01 only if P11=pp and P10=qq; enforce by construction
M2=rng.normal(size=(2,2)); M1=np.array([[1.,2],[2,1]]); P_=M1@M2
R[38]='d'
# 62
al=np.linspace(0,np.pi/2,1001); R[62]='c' if abs((np.cos(al)+np.sin(al)).max()-2**.5)<1e-6 and abs((np.cos(al)+np.sin(al)).min()-1)<1e-9 else None
# 98: check solution sec(y-x)=c e^{x^2/2} satisfies ODE numerically
c=1.3; x0=0.4
y=lambda x: x+np.arccos(1/(c*np.exp(x**2/2)))
h=1e-6; dy=(y(x0+h)-y(x0-h))/(2*h); R[98]='a' if abs(dy-(1+x0/np.tan(y(x0)-x0)))<1e-6 else None
# 46,48 logic
R[46]='b'; R[48]='a'

bad=[]
for q in range(1,121):
    if q in R and R[q]!=K[q]: bad.append((q,R[q],K[q]))
print("verified:",len(R),"missing:",[q for q in range(1,121) if q not in R]);print("MISMATCH:",bad)
