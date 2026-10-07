import React, {useEffect, useMemo, useState} from 'react';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  registerRoot,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BG='#06101B', PANEL='#0B1D2C', CYAN='#31C5FF', YELLOW='#FFD45A', WHITE='#F7FBFF', MUTED='#9AB0C2';
const FONT='Arial, Helvetica, sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};

type P=[number,number];
type G={type:'Polygon'|'MultiPolygon';coordinates:any};
type F={geometry:G};
type Geo={features:F[]};
const W=810,H=1030,LON0=67,LON1=98.5,LAT0=6,LAT1=38;
const proj=([lon,lat]:P):P=>[((lon-LON0)/(LON1-LON0))*W,H-((lat-LAT0)/(LAT1-LAT0))*H];
const ring=(r:P[])=>r.length?`M ${r.map(proj).map(([x,y])=>`${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`:'';
const geom=(g:G)=>g.type==='Polygon'?(g.coordinates as P[][]).map(ring).join(' '):(g.coordinates as P[][][]).flatMap(p=>p.map(ring)).join(' ');
const route=(pts:P[])=>`M ${pts.map(proj).map(([x,y])=>`${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')}`;

const Bg=()=> <AbsoluteFill style={{background:'radial-gradient(circle at 50% 28%,rgba(49,197,255,.12),transparent 32%),linear-gradient(180deg,#071827,#06101B 72%,#040A11)'}}/>;
const Grain=()=> <AbsoluteFill style={{opacity:.09,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.32) 0 1px,transparent 1.4px)',backgroundSize:'24px 24px',mixBlendMode:'soft-light'}}/>;
const Pill=({children,color=CYAN}:{children:React.ReactNode;color?:string})=><div style={{padding:'12px 20px',borderRadius:999,border:`1px solid ${color}66`,background:`${color}12`,color,fontFamily:FONT,fontWeight:900,fontSize:25,letterSpacing:2}}>{children}</div>;
const Big=({children,size=76}:{children:React.ReactNode;size?:number})=><div style={{fontFamily:FONT,fontWeight:950,fontSize:size,lineHeight:1.02,letterSpacing:-2,color:WHITE,textAlign:'center'}}>{children}</div>;

const CloudField=()=>{
  const f=useCurrentFrame();
  const clouds=Array.from({length:14},(_,i)=>({x:(i*97)%1080,y:160+((i*131)%1050),s:80+(i%5)*32,sp:.25+(i%4)*.12,o:.06+(i%3)*.025}));
  return <AbsoluteFill>{clouds.map((c,i)=><div key={i} style={{position:'absolute',left:((c.x+f*c.sp)%1280)-100,top:c.y,width:c.s*2.1,height:c.s,borderRadius:'50%',background:'radial-gradient(ellipse at center,rgba(255,255,255,.9),rgba(170,200,220,.38) 48%,transparent 72%)',opacity:c.o,filter:'blur(7px)'}}/>)}</AbsoluteFill>;
};

const Hook=()=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const s=spring({frame:f,fps,config:{damping:14,stiffness:110}});
  const split=interpolate(f,[32,82],[0,1],clamp);
  return <AbsoluteFill><Bg/><CloudField/><Grain/><AbsoluteFill style={{alignItems:'center',justifyContent:'center',padding:'120px 78px'}}>
    <div style={{transform:`translateY(${(1-s)*55}px)`,opacity:s,display:'flex',flexDirection:'column',alignItems:'center'}}>
      <Pill color={YELLOW}>INDIAN MONSOON</Pill><div style={{height:34}}/>
      <Big size={82}>The monsoon does not enter India as one single stream.</Big>
      <div style={{marginTop:84,width:760,height:160,position:'relative'}}>
        <div style={{position:'absolute',left:320,top:74,width:120,height:8,borderRadius:8,background:WHITE,opacity:.7}}/>
        <div style={{position:'absolute',left:156,top:44,width:220*split,height:8,borderRadius:8,background:YELLOW,transform:'rotate(-17deg)',transformOrigin:'right center'}}/>
        <div style={{position:'absolute',right:156,top:44,width:220*split,height:8,borderRadius:8,background:CYAN,transform:'rotate(17deg)',transformOrigin:'left center'}}/>
        <div style={{position:'absolute',left:28,top:0,color:YELLOW,fontFamily:FONT,fontWeight:900,fontSize:30,opacity:split}}>ARABIAN SEA</div>
        <div style={{position:'absolute',right:0,top:0,color:CYAN,fontFamily:FONT,fontWeight:900,fontSize:30,opacity:split}}>BAY OF BENGAL</div>
      </div>
    </div>
  </AbsoluteFill></AbsoluteFill>;
};

const Path=({pts,color,p,width=12}:{pts:P[];color:string;p:number;width?:number})=><><path d={route(pts)} fill="none" stroke={color} strokeWidth={width+20} opacity=.1 strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/><path d={route(pts)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/></>;

const MapScene=()=>{
  const f=useCurrentFrame();
  const [h]=useState(()=>delayRender('map')); const [geo,setGeo]=useState<Geo|null>(null);
  useEffect(()=>{fetch(staticFile('maps/india.geojson')).then(r=>r.json()).then(setGeo).finally(()=>continueRender(h));},[h]);
  const shapes=useMemo(()=>geo?.features.map(x=>geom(x.geometry))??[],[geo]);
  const mapIn=interpolate(f,[0,22],[0,1],clamp), ar=interpolate(f,[22,110],[0,1],clamp), bay=interpolate(f,[58,156],[0,1],clamp), west=interpolate(f,[138,220],[0,1],clamp);
  const arabian:P[]=[[66,7.5],[69,9],[72,10.6],[74.4,12],[75.1,15],[73.8,18.7],[72.9,21.5],[73.8,25.5],[76,29.5]];
  const bengal:P[]=[[94.7,9.5],[92.4,13],[90.6,17],[90,21.5],[91,24.8],[92.2,26.6]];
  const ganga:P[]=[[92.2,26.4],[89,25.8],[86,25.5],[83,25.7],[80,26.1],[77.6,27.3],[74.8,29.2]];
  return <AbsoluteFill><Bg/><Grain/><AbsoluteFill style={{padding:'94px 70px 100px',alignItems:'center'}}>
    <Pill>HOW IT SPLITS</Pill><div style={{height:24}}/><Big size={62}>Two major branches shape India’s rainfall.</Big>
    <div style={{marginTop:34,width:880,height:1110,borderRadius:42,border:'1px solid rgba(255,255,255,.08)',background:'linear-gradient(180deg,rgba(11,29,44,.9),rgba(6,16,27,.7))',boxShadow:'0 30px 80px rgba(0,0,0,.25)',padding:'42px 34px'}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{overflow:'visible',opacity:mapIn}}>
        <g>{shapes.map((d,i)=><path key={i} d={d} fill={PANEL} stroke="#294154" strokeWidth={1.5}/>)}</g>
        <Path pts={arabian} color={YELLOW} p={ar}/><Path pts={bengal} color={CYAN} p={bay}/><Path pts={ganga} color={CYAN} p={west} width={10}/>
        {[[76,11,'Kerala',YELLOW],[73.7,19,'Western Ghats',YELLOW],[92.2,26.4,'Northeast',CYAN],[81,26,'Ganga Plains',CYAN]].map(([lon,lat,t,c],i)=>{const [x,y]=proj([lon as number,lat as number]);return <text key={i} x={x} y={y} fill={c as string} textAnchor="middle" fontFamily={FONT} fontSize={25} fontWeight={900} paintOrder="stroke" stroke={BG} strokeWidth={7}>{t}</text>})}
      </svg>
    </div>
  </AbsoluteFill></AbsoluteFill>;
};

const Rain=({count=34,color=CYAN}:{count?:number;color?:string})=>{const f=useCurrentFrame();return <>{Array.from({length:count},(_,i)=>{const x=(i*83)%760,y=((i*137+f*18)%720)-120;return <div key={i} style={{position:'absolute',left:x,top:y,width:4,height:34,borderRadius:3,background:color,opacity:.18+(i%4)*.08,transform:'rotate(12deg)'}}/>})}</>};

const ReliefScene=()=>{
  const f=useCurrentFrame(), lift=interpolate(f,[12,75],[0,1],clamp), rain=interpolate(f,[54,102],[0,1],clamp);
  return <AbsoluteFill><Bg/><Grain/><AbsoluteFill style={{padding:'100px 70px'}}>
    <div style={{display:'flex',justifyContent:'center'}}><Pill color={YELLOW}>WHY WESTERN GHATS MATTER</Pill></div><div style={{height:24}}/><Big size={61}>Moist air rises against relief — and rainfall intensifies.</Big>
    <div style={{marginTop:85,position:'relative',height:890,borderRadius:44,background:'linear-gradient(180deg,#0A2235,#081521)',border:'1px solid rgba(255,255,255,.08)',overflow:'hidden'}}>
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:330,background:'linear-gradient(180deg,#173647,#0C2230)'}}/>
      <div style={{position:'absolute',left:395,bottom:175,width:310,height:470,clipPath:'polygon(50% 0,100% 100%,0 100%)',background:'linear-gradient(135deg,#59707F,#243949)'}}/>
      <div style={{position:'absolute',left:445,bottom:205,width:210,height:390,clipPath:'polygon(50% 0,100% 100%,0 100%)',background:'linear-gradient(135deg,#8395A2,#344B5B)',opacity:.7}}/>
      <div style={{position:'absolute',left:70,bottom:410,width:350*lift,height:16,borderRadius:20,background:YELLOW,boxShadow:`0 0 35px ${YELLOW}55`}}/>
      <div style={{position:'absolute',left:340,bottom:405,width:18,height:260*lift,borderRadius:20,background:YELLOW,transform:'rotate(-27deg)',transformOrigin:'bottom center'}}/>
      <div style={{position:'absolute',right:70,top:180,width:390,height:610,opacity:rain}}><Rain count={28}/></div>
      <div style={{position:'absolute',left:68,bottom:480,color:YELLOW,fontFamily:FONT,fontSize:28,fontWeight:900}}>MOIST AIR</div>
      <div style={{position:'absolute',right:76,top:130,color:CYAN,fontFamily:FONT,fontSize:28,fontWeight:900}}>HEAVY RAINFALL</div>
      <div style={{position:'absolute',left:385,bottom:90,color:WHITE,fontFamily:FONT,fontSize:28,fontWeight:900}}>WESTERN GHATS</div>
    </div>
  </AbsoluteFill></AbsoluteFill>;
};

const FlowScene=()=>{
  const f=useCurrentFrame(); const p=interpolate(f,[20,120],[0,1],clamp); const q=interpolate(f,[110,205],[0,1],clamp);
  return <AbsoluteFill><Bg/><Grain/><AbsoluteFill style={{padding:'100px 72px',alignItems:'center'}}><Pill>BAY OF BENGAL BRANCH</Pill><div style={{height:26}}/><Big size={61}>Northeast first. Then westward across the Ganga plains.</Big>
    <div style={{marginTop:120,width:890,height:760,position:'relative'}}>
      <svg viewBox="0 0 890 760" width="100%" height="100%"><defs><filter id="g"><feGaussianBlur stdDeviation="8"/></filter></defs>
        <path d="M760 590 C 790 430 770 270 650 190" fill="none" stroke={CYAN} strokeWidth={42} opacity=.08 filter="url(#g)"/><path d="M760 590 C 790 430 770 270 650 190" fill="none" stroke={CYAN} strokeWidth={15} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/>
        <path d="M650 190 C 540 210 430 250 320 300 C 240 335 180 380 120 440" fill="none" stroke={CYAN} strokeWidth={15} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-q}/>
      </svg>
      <div style={{position:'absolute',right:38,bottom:110,color:CYAN,fontFamily:FONT,fontWeight:900,fontSize:30}}>BAY OF BENGAL</div>
      <div style={{position:'absolute',right:125,top:65,color:WHITE,fontFamily:FONT,fontWeight:900,fontSize:30}}>NORTHEAST</div>
      <div style={{position:'absolute',left:120,top:290,color:WHITE,fontFamily:FONT,fontWeight:900,fontSize:30}}>GANGA PLAINS</div>
    </div>
  </AbsoluteFill></AbsoluteFill>;
};

const Takeaway=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig();const a=[0,1,2].map(i=>spring({frame:f-i*13,fps,config:{damping:15}}));const cards=[['DIRECTION','Where does the branch move?'],['RELIEF','What forces the air upward?'],['BRANCH','Arabian Sea or Bay of Bengal?']];return <AbsoluteFill><Bg/><Grain/><AbsoluteFill style={{padding:'120px 70px',alignItems:'center'}}><Pill color={YELLOW}>EXAM LENS</Pill><div style={{height:28}}/><Big size={67}>Don’t memorise monsoon facts. Decode the mechanism.</Big><div style={{marginTop:86,width:'100%',display:'flex',flexDirection:'column',gap:24}}>{cards.map((c,i)=><div key={c[0]} style={{transform:`translateX(${(1-a[i])*120}px)`,opacity:a[i],padding:'30px 34px',borderRadius:28,background:PANEL,border:'1px solid rgba(255,255,255,.08)'}}><div style={{color:i===1?YELLOW:CYAN,fontFamily:FONT,fontWeight:950,fontSize:36}}>{c[0]}</div><div style={{marginTop:8,color:WHITE,fontFamily:FONT,fontWeight:700,fontSize:29}}>{c[1]}</div></div>)}</div><div style={{marginTop:72,color:MUTED,fontFamily:FONT,fontSize:28,fontWeight:700,textAlign:'center'}}>Direction × Relief × Branch Movement</div></AbsoluteFill></AbsoluteFill>};

const End=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig();const s=spring({frame:f,fps,config:{damping:13,stiffness:110}});return <AbsoluteFill><Bg/><CloudField/><Grain/><AbsoluteFill style={{alignItems:'center',justifyContent:'center',padding:90}}><div style={{transform:`scale(${.9+.1*s})`,opacity:s,textAlign:'center'}}><div style={{fontFamily:FONT,fontSize:32,fontWeight:950,letterSpacing:5,color:CYAN}}>DEFENCE PATHSHALA</div><div style={{height:32}}/><Big size={78}>PYQs solve mat karo.<br/><span style={{color:YELLOW}}>Decode karo.</span></Big><div style={{marginTop:44,color:MUTED,fontFamily:FONT,fontSize:28,fontWeight:700}}>CDS • CAPF • NDA • AFCAT</div></div></AbsoluteFill></AbsoluteFill>};

const Reel=()=> <AbsoluteFill style={{background:BG}}>
  <Sequence from={0} durationInFrames={105}><Hook/></Sequence>
  <Sequence from={105} durationInFrames={255}><MapScene/></Sequence>
  <Sequence from={360} durationInFrames={210}><ReliefScene/></Sequence>
  <Sequence from={570} durationInFrames={220}><FlowScene/></Sequence>
  <Sequence from={790} durationInFrames={220}><Takeaway/></Sequence>
  <Sequence from={1010} durationInFrames={160}><End/></Sequence>
</AbsoluteFill>;

const Root=()=> <Composition id="MonsoonReel" component={Reel} durationInFrames={1170} fps={30} width={1080} height={1920}/>;
registerRoot(Root);
