"use strict";
const D=window.DATA,K="studyapp.v1";
let S={};try{S=JSON.parse(localStorage.getItem(K))||{}}catch(e){}
const fixS=()=>{["ch","days","pd","wt","rv","cc","tl","tc","ph","sn","dis","exs","exm","ext","exd"].forEach(k=>S[k]=S[k]||{});["bl","er","sc","mx"].forEach(k=>S[k]=S[k]||[]);S.lim=S.lim||D.phoneLimit||40;S.exT=S.exT||D.examTime||"10:15"};fixS();
let onSave=()=>{};
const save=()=>{S.upd=Date.now();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){toast("Could not save in this browser. Use Export.")}onSave()};
window.getState=()=>S;
window.setState=o=>{S=o;fixS();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}render()};
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const addD=(s,n)=>{const d=new Date(s+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const wk=s=>addD(s,-((new Date(s+"T00:00:00Z").getUTCDay()+1)%7));
const fd=s=>new Date(s+"T00:00:00Z").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",timeZone:"UTC"});
const left=d=>Math.ceil((new Date(d+"T00:00:00")-new Date())/864e5);
const mm=t=>{const[a,b]=(t||"0:0").split(":");return+a*60+ +b},hm=m=>{m=(m%1440+1440)%1440;return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0")};
const fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0"),dh=m=>Math.floor(m/60)+"h "+String(m%60).padStart(2,"0")+"m";
const KEYS={};Object.entries(D.ch).forEach(([s,l])=>l.forEach((c,i)=>KEYS[s+":"+c[0]]={s,i,n:c[0]}));
const KEYL=Object.keys(KEYS),ki=k=>KEYL.indexOf(k);
const cs=k=>{if(!S.ch[k]){const c=KEYS[k],t=D.ch[c.s][c.i][1]||0;S.ch[k]=[t>0,t>1,false]}return S.ch[k]};
const cc=k=>S.cc[k]=S.cc[k]||[0,D.classes[k]||0];
let cur=today(),wv=wk(today()),tab="today",mt="bl",sf="P",phd=today();
/* routine */
const defRt=()=>D.blocks.map((b,i)=>({id:"d"+i,t:b[0],e:b[1],l:b[2],s:b[3],m:b[4],k:b[5]}));
const rt=()=>S.rt||defRt();
const TYN={D:"Daily",W:"Weekly",M:"Monthly"};
const EX=()=>D.myExams.map(e=>({id:e[0],date:e[1],name:e[2],ty:e[3],cv:e[4]})).concat(S.mx.map(e=>({id:e.id,date:e.date,name:e.name,ty:e.ty,cv:e.cv||[],cu:1}))).filter(e=>!S.exs[e.id]).sort((a,b)=>a.date.localeCompare(b.date));
const exDur=e=>S.exm[e.ty]||D.examMin[e.ty]||60,exT=e=>S.ext[e.id]||S.exT,exOn=dt=>EX().filter(e=>e.date==dt);
const rtd=dt=>rt().concat(exOn(dt).map(e=>({id:"x"+e.id,t:exT(e),e:hm(mm(exT(e))+exDur(e)),l:"Offline exam: "+e.name+" ("+exDur(e)+" min with commute)",s:"X",m:1,k:"Go and take the exam; Review mistakes and add to Error log"})));
const steps=b=>{const a=(b.k||"").split(";").map(x=>x.trim()).filter(Boolean).map(x=>{const m=x.match(/^(.*?)\s*\[([LPRW])\]$/);return m?{t:m[1],g:m[2]}:{t:x}});return a.length?a:[{t:"Done"}]};
const noPct=s=>s=="N"||s=="Z";
const fix=d=>{d.s=d.s||{};d.f=d.f||{};d.tk=d.tk||[];d.dur=d.dur||195;d.sp=d.sp||1.5;return d};
const dd=(s=cur)=>fix(S.days[s]=S.days[s]||{});
const frac=(b,d)=>{const n=steps(b).length,a=d.s[b.id]||[];let c=0;for(let i=0;i<n;i++)if(a[i])c++;return c/n};
const pctOf=(d,dt)=>{fix(d);const R=rtd(dt).filter(b=>(!d.bad||b.m)&&!noPct(b.s));return R.length?Math.round(R.reduce((a,b)=>a+frac(b,d),0)/R.length*100):0};
const watch=d=>Math.round(d.dur/d.sp);
const endM=(b,d)=>b.s=="R"?mm(b.t)+watch(d):b.e?mm(b.e):mm(b.t)+30;
const ov=(b,d)=>b.s!="X"&&rtd(cur).some(x=>x.s=="X"&&mm(b.t)<mm(x.e)&&endM(b,d)>mm(x.t));
const tl=(b,d)=>b.s=="R"?b.t+"-"+hm(mm(b.t)+watch(d)):b.e?b.t+"-"+b.e:b.t;
const grp=m=>m<720?"Morning":m<1020?"Afternoon":m<1260?"Evening":"Night";
/* ui helpers */
function toast(m){const e=$("#toast");e.textContent=m;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600)}
function ask(html,btns){$("#mdt").innerHTML=html;$("#mdb").innerHTML="";btns.forEach(([l,fn,cls])=>{const b=document.createElement("button");b.textContent=l;if(cls)b.className=cls;b.onclick=()=>{$("#md").hidden=true;fn&&fn()};$("#mdb").appendChild(b)});$("#md").hidden=false}
window.ask=ask;
const ring=(p,l,sz=84)=>`<svg width="${sz}" height="${sz}" viewBox="0 0 100 100" role="img" aria-label="${l} ${p}%"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--acs)" stroke-width="12"/><circle cx="50" cy="50" r="40" fill="none" stroke="var(--ac)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${Math.min(p,100)*2.513} 251.3" transform="rotate(-90 50 50)"/><text x="50" y="57" text-anchor="middle" font-size="24" font-weight="700" fill="var(--ink)">${p}%</text></svg>`;
const CL={P:"#2f80ed",C:"#e2a72e",M:"#8a63d2"};
function bars(days,lim,fv){const H=100,m=Math.max(lim||0,...days.map(d=>d.seg.reduce((a,s)=>a+s[1],0)),1);let g="";
  days.forEach((d,i)=>{let y=118;const x=12+i*44,tot=d.seg.reduce((a,s)=>a+s[1],0);d.seg.forEach(s=>{const h=s[1]/m*H;y-=h;g+=`<rect x="${x}" y="${y}" width="28" height="${h}" rx="3" fill="${s[0]}"/>`});
    g+=`<text x="${x+14}" y="${y-4}" text-anchor="middle" font-size="9" fill="var(--mut)">${tot?fv(tot):""}</text><text x="${x+14}" y="132" text-anchor="middle" font-size="10" fill="var(--mut)">${d.l}</text>`});
  if(lim){const y=118-lim/m*H;g+=`<line x1="4" x2="320" y1="${y}" y2="${y}" stroke="var(--bad)" stroke-dasharray="4 3"/>`}
  return `<svg viewBox="0 0 324 140" width="100%" role="img" aria-label="Chart">${g}</svg>`}
const opt=(k,c)=>`<option value="${esc(k)}" ${k==c?"selected":""}>${esc(KEYS[k].n)}</option>`;
const allOpts=c=>Object.entries(D.ch).map(([s,l])=>`<optgroup label="${D.sub[s]}">`+l.map(x=>opt(s+":"+x[0],c)).join("")+"</optgroup>").join("");
const subOpts=()=>Object.entries(D.sub).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
/* navigation */
const NAV=[["today","📅","Day"],["inb","📥","Inbox"],["hist","🕘","History"],["wk","🎯","Week"],["ch","📚","Chapters"],["more","☰","More"]];
const MT=[["bl","Backlog"],["er","Errors"],["ph","Phone"],["rt","Routine"],["ex","Exams"],["sy","Backup & sync"]];
const go=t=>{tab=t;render();scrollTo(0,0)},setCur=v=>{if(v)cur=v;tab="today";render()};
function render(){
  const bn=inbox().length;$("#nav").innerHTML=NAV.map(n=>`<button class="${n[0]==tab?"on":""}" onclick="go('${n[0]}')"><span>${n[1]}</span>${n[2]}${n[0]=="inb"&&bn?`<i class="bdg">${bn}</i>`:""}</button>`).join("");
  const V={today:vDay,inb:vIn,hist:vHist,wk:vWk,ch:vCh};
  $("#app").innerHTML=tab=="more"?`<div class="seg">${MT.map(x=>`<button class="${x[0]==mt?"on":""}" onclick="mt='${x[0]}';render()">${x[1]}</button>`).join("")}</div>`+{bl:vBl,er:vEr,ph:vPh,rt:vRt,ex:vEx,sy:vSy}[mt]():V[tab]();
}
/* ---------- Day ---------- */
function chSel(b,d){const c=d.f[b.id]||"";let o;
  if(b.s&&"MPC".includes(b.s))o=D.ch[b.s].map(x=>b.s+":"+x[0]).filter(k=>!cs(k)[1]||k==c).map(k=>opt(k,c)).join("");
  else if(b.s=="R"||b.s=="B")o=allOpts(c);else return"";
  return `<select aria-label="Chapter" onchange="pickCh('${b.id}',this.value)"><option value="">Chapter...</option>${o}</select>`}
function pickCh(id,v){dd().f[id]=v;save()}
function tog(id,i,v){const d=dd(),b=rtd(cur).find(x=>x.id==id),a=d.s[id]=d.s[id]||[];a[i]=v;save();render();const g=steps(b)[i].g;if(v&&g)offer(g,d.f[id])}
function offer(g,key){if(!key){toast("Pick a chapter on this block to track it in Chapters.");return}
  const n=KEYS[key].n,tx={L:"as Learned",P:"as Practiced",R:"as Revised",W:"+1 ACS class watched"}[g];
  if(S.auto)return applyG(g,key);
  ask(`Update Chapters: mark <b>${esc(n)}</b> ${tx}?<br><label class="mut"><input type="checkbox" id="mda"> Apply automatically from now on</label>`,[["Yes",()=>{if($("#mda").checked){S.auto=1}applyG(g,key)},"pri"],["No"]])}
function applyQ(g,k){const c=cs(k);if(g=="L")c[0]=true;if(g=="P"){c[0]=c[1]=true;S.pd[k]=S.pd[k]||today()}if(g=="R")c[2]=true;if(g=="W"){const n=cc(k);n[0]++;c[0]=true}}
function applyG(g,k){applyQ(g,k);save();render();toast("Chapters updated")}
function checkAll(v){const d=dd(),R=rtd(cur).filter(b=>!d.bad||b.m),o=[];
  R.forEach(b=>{const a=d.s[b.id]=d.s[b.id]||[];steps(b).forEach((x,i)=>{if(v&&!a[i]&&x.g&&d.f[b.id])o.push([x.g,d.f[b.id]]);a[i]=v})});d.tk.forEach(x=>x.d=v);save();render();
  const u=[...new Map(o.map(x=>[x[0]+x[1],x])).values()];if(!u.length)return;
  const go2=()=>{u.forEach(x=>applyQ(x[0],x[1]));save();render();toast("Chapters updated")};
  if(S.auto)return go2();
  const tx={L:"Learned",P:"Practiced",R:"Revised",W:"+1 class watched"};
  ask("Update Chapters for the items you just checked?<br><span class='mut'>"+u.map(x=>esc(KEYS[x[1]].n)+": "+tx[x[0]]).join("<br>")+"</span>",[["Yes, update",go2,"pri"],["No"]])}
const dueList=()=>KEYL.filter(k=>S.pd[k]&&(S.rv[k]||0)<3&&today()>=addD(S.pd[k],[3,7,14][S.rv[k]||0])&&!(S.sn[k]>today()));
function revDone(i){const k=KEYL[i];S.rv[k]=(S.rv[k]||0)+1;cs(k)[2]=true;save();render()}
function paceHtml(){const left0=KEYL.filter(k=>!cs(k)[1]).length,rec=Object.values(S.pd).filter(x=>x>=addD(today(),-14)).length/2;
  return (D.paceExams||[]).map(nm=>{const e=D.exams.find(x=>x[0]==nm);if(!e||left(e[1])<0)return"";const days=Math.max(1,left(e[1])-14),need=left0/(days/7);
    const ok=rec>=need;return `<div class="mut"><b>${esc(nm)}</b>: ${left0} chapters not yet practiced, ${days} days until 2 weeks before. Need <b>${need.toFixed(1)}/week</b>; you did ${rec.toFixed(1)}/week lately. <span class="${ok?"ok":"warn"}">${ok?"On pace.":rec?"Behind pace.":"No practice logged in 14 days."}</span></div>`}).join("")}
function vDay(){
  const d=dd(),R=rtd(cur).slice().sort((a,b)=>mm(a.t)-mm(b.t)),V=R.filter(b=>!d.bad||b.m),p=pctOf(d,cur),t=today(),h=new Date().getHours();
  const gr=cur!=t?fd(cur)+(cur<t?" (past day)":" (planned)"):"Assalamu alaykum. Good "+(h<12?"morning":h<17?"afternoon":"evening")+".";
  const msg=p==100?"All done. Alhamdulillah, rest well.":p>=50?"More than halfway. One block at a time.":p>0?"Good start. Next block, then a short break.":cur>t?"Pick your chapters now so that day is easy.":"Start with just the first block. That is the hardest part.";
  const nx=D.exams.filter(e=>left(e[1])>=0).slice(0,3).map(e=>`${esc(e[0])} ${left(e[1])}d`).join(" | ");
  const all=V.length>0&&V.every(b=>frac(b,d)==1)&&d.tk.every(x=>x.d);let sch=`<label class="card allck"><input type="checkbox" ${all?"checked":""} onchange="checkAll(this.checked)"><b>Check all tasks for this day</b></label>`,g="";
  V.forEach(b=>{const gg=grp(mm(b.t));if(gg!=g){g=gg;sch+=`<div class="gh">${g}</div>`}
    const st=steps(b),a=d.s[b.id]||[],n=st.length,dn=st.filter((x,i)=>a[i]).length;
    sch+=`<div class="blk ${dn==n?"dn":""}"><div class="bt"><span class="t">${tl(b,d)}</span><span class="bl">${esc(b.l)}</span>${n>1?`<span class="pc">${dn}/${n}</span>`:""}${ov(b,d)?'<span class="pc" style="color:var(--bad)">overlaps exam</span>':""}${b.s=="N"?`<button onclick="startT(25,'Nap over. Wake up!')">⏰ 25 min</button>`:""}${chSel(b,d)}</div><div class="steps">${st.map((x,i)=>`<label ${x.g?'title="Updates Chapters (asks first)"':""}><input type="checkbox" ${a[i]?"checked":""} onchange="tog('${b.id}',${i},this.checked)">${esc(x.t)}${x.g?" ↗":""}</label>`).join("")}</div></div>`});
  const due=dueList();
  return `<div class="day"><div class="sumc card"><div class="top">${ring(p,"Day progress",96)}<div style="flex:1;min-width:190px"><div class="hi">${gr}</div><div class="mut">${msg}</div>
  <div class="f"><button onclick="setCur(addD(cur,-1))" aria-label="Previous day">&lt;</button><input type="date" value="${cur}" onchange="setCur(this.value)"><button onclick="setCur(addD(cur,1))" aria-label="Next day">&gt;</button><button class="ghost" onclick="setCur(today())">Today</button></div>
  <div class="mut">${nx}</div>${exOn(cur).map(e=>`<div class="warn"><b>Exam:</b> ${esc(e.name)} at ${exT(e)} (${exDur(e)} min)</div>`).join("")}</div></div>
  <label class="mut"><input type="checkbox" ${d.bad?"checked":""} onchange="dd().bad=this.checked;save();render()"> Hard day? Show only the must-do blocks</label></div>
  <div class="sch">${sch}</div>
  <div class="side"><div class="card"><h2>ACS class recording</h2><div class="f"><select aria-label="Class length" onchange="dd().dur=+this.value;save();render()">${[[180,"3 h"],[195,"3 h 15"],[210,"3 h 30"],[240,"4 h"]].map(o=>`<option value="${o[0]}" ${o[0]==d.dur?"selected":""}>${o[1]} class</option>`).join("")}</select><select aria-label="Speed" onchange="dd().sp=+this.value;save();render()">${[1,1.25,1.5,1.75,2].map(x=>`<option value="${x}" ${x==d.sp?"selected":""}>${x}x speed</option>`).join("")}</select></div><div class="mut">Watch time about <b>${dh(watch(d))}</b>.</div></div>
  ${due.length?`<div class="card"><h2>Revise today</h2>${due.map(k=>`<div class="bt"><span class="bl">${esc(KEYS[k].n)} <span class="mut">(${D.sub[KEYS[k].s]}, revision ${(S.rv[k]||0)+1}/3)</span></span><button onclick="revDone(${ki(k)})">Done</button></div>`).join("")}</div>`:""}
  <div class="card"><h2>Pace</h2>${paceHtml()||'<div class="mut">Set paceExams in data.js.</div>'}</div>
  <div class="card"><h2>Extra tasks</h2><div class="f"><select id="ks">${subOpts()}</select><input type="text" id="kt" placeholder="e.g. Mock test"><button class="pri" onclick="addTk()">Add</button></div>`+
  (d.tk.map((x,i)=>`<div class="bt"><label class="bl"><input type="checkbox" ${x.d?"checked":""} onchange="dd().tk[${i}].d=this.checked;save();render()"> <b>${D.sub[x.s]}</b> ${esc(x.t)}</label><button class="x" onclick="dd().tk.splice(${i},1);save();render()">Delete</button></div>`).join("")||'<div class="mut">Plan ahead: open a future date and add tasks.</div>')+`</div>
  <div class="card"><h2>Focus timer <span id="tm">${tEnd?fmt(Math.max(0,Math.round((tEnd-Date.now())/1000))):"0:00"}</span></h2><div class="f"><select id="ts" aria-label="Subject">${subOpts()}</select><select id="tk" aria-label="Chapter"><option value="">Chapter (optional)</option>${allOpts("")}</select></div><div class="f"><button onclick="startT(25,0,1)">25 min</button><button onclick="startT(50,0,1)">50 min</button><button onclick="stopT(false)">Stop</button></div><div class="mut">Minutes are logged to the subject and chapter. Phone in another room.</div></div></div></div>`;
}
function addTk(){const t=$("#kt").value.trim();if(!t)return;dd().tk.push({s:$("#ks").value,t,d:false});save();render()}
/* timer */
let tEnd=0,tStart=0,tMsg="",tLog=null,ti;
function startT(m,msg,log){stopT(false);tStart=Date.now();tEnd=tStart+m*6e4;tMsg=msg||"Block done. Take a 5-10 min break, phone still away.";tLog=log&&$("#ts")?{s:$("#ts").value,k:$("#tk").value}:null;ti=setInterval(tick,500);tick()}
function tick(){const r=Math.max(0,Math.round((tEnd-Date.now())/1000)),e=$("#tm");if(e)e.textContent=fmt(r);if(r<=0)stopT(true)}
function stopT(fin){if(!tEnd)return;clearInterval(ti);const el=Math.round((Math.min(Date.now(),tEnd)-tStart)/6e4);
  if(tLog&&el>=1){const dt=today(),x=S.tl[dt]=S.tl[dt]||{};x[tLog.s]=(x[tLog.s]||0)+el;if(tLog.k)S.tc[tLog.k]=(S.tc[tLog.k]||0)+el;save()}
  tEnd=0;const e=$("#tm");if(e)e.textContent="0:00";if(fin){beep();alert(tMsg)}}
function beep(){try{const a=new(window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(t=>{const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.2;o.start(a.currentTime+t);o.stop(a.currentTime+t+.2)})}catch(e){}try{navigator.vibrate&&navigator.vibrate([300,100,300])}catch(e){}}
/* ---------- History ---------- */
function vHist(){
  const ks=Object.keys(S.days).filter(k=>{const d=fix(S.days[k]);return k<=today()&&(Object.values(d.s).some(a=>a.some(Boolean))||d.tk.length)}).sort().reverse().slice(0,30);
  const avg=ks.length?Math.round(ks.reduce((a,k)=>a+pctOf(S.days[k],k),0)/ks.length):0;
  return `<div class="card top">${ring(avg,"Average completion",84)}<div><h2>Previous days</h2><div class="mut">Average over your last ${ks.length} logged days. Open a day to view or fix it.</div></div></div><div class="two">`+
  (ks.map(k=>{const d=S.days[k],p=pctOf(d,k),ch=[...new Set(Object.entries(d.f).filter(([id,v])=>v&&(d.s[id]||[]).some(Boolean)).map(([id,v])=>KEYS[v]?KEYS[v].n:""))].filter(Boolean).join(", "),mi=Object.values(S.tl[k]||{}).reduce((a,b)=>a+b,0),ph=S.ph[k];
    return `<div class="card"><div class="top"><div style="flex:1;min-width:150px"><b>${fd(k)}</b> <span class="mut">${mi?dh(mi)+" timed":""}${ph?" · social "+ph.s+"m":""}</span><div class="bar" style="margin:6px 0"><i style="width:${p}%"></i></div><div class="mut">${ch?esc(ch):"No chapters picked"}</div></div><b>${p}%</b><button onclick="setCur('${k}')">Open</button></div></div>`}).join("")||'<div class="card mut">No days logged yet.</div>')+"</div>";
}
/* ---------- Week ---------- */
function vWk(){
  const w=S.wt[wv]=S.wt[wv]||{P:0,C:0,M:0,note:""},end=addD(wv,6);
  const done=s=>Object.entries(S.pd).filter(([k,d])=>k.startsWith(s+":")&&d>=wv&&d<=end).length;
  let bl=0,tot={P:0,C:0,M:0};const days=[];
  for(let i=0;i<7;i++){const dt=addD(wv,i),d=S.days[dt];if(d)bl+=Object.values(fix(d).s).reduce((a,x)=>a+x.filter(Boolean).length,0);const x=S.tl[dt]||{};Object.keys(tot).forEach(s=>tot[s]+=x[s]||0);days.push({l:fd(dt).slice(0,3),seg:Object.keys(CL).map(s=>[CL[s],x[s]||0])})}
  return `<div class="card"><h2>Week of ${fd(wv)} to ${fd(end)}</h2><div class="f"><button onclick="wv=addD(wv,-7);render()">&lt; Previous</button><button class="ghost" onclick="wv=wk(today());render()">This week</button><button onclick="wv=addD(wv,7);render()">Next &gt;</button></div><div class="mut">Weeks run Saturday to Friday. A chapter counts when it is marked Practiced during the week.</div></div>
  <div class="rings">${Object.entries(D.sub).map(([s,n])=>{const t=+w[s]||0,x=done(s);return `<div class="card" style="flex:1;min-width:140px;text-align:center">${ring(t?Math.round(x/t*100):0,n,84)}<div><b>${n}</b></div><div class="mut">${x} of target</div><input type="number" min="0" max="20" value="${t}" style="width:70px" aria-label="${n} chapters target" onchange="S.wt['${wv}']['${s}']=+this.value;save();render()"><div class="mut">chapters</div></div>`}).join("")}</div>
  <div class="two"><div class="card"><h2>This week's focus</h2><div class="f"><input type="text" value="${esc(w.note||"")}" placeholder="e.g. Finish electrochem + 2 timed mocks" onchange="S.wt['${wv}'].note=this.value;save()"></div><div class="mut">Steps ticked this week: <b>${bl}</b></div></div>
  <div class="card"><h2>Study time (timer)</h2>${bars(days,0,v=>(v/60).toFixed(1)+"h")}<div class="mut"><span style="color:${CL.P}">■</span> Physics ${dh(tot.P)} &nbsp;<span style="color:${CL.C}">■</span> Chemistry ${dh(tot.C)} &nbsp;<span style="color:${CL.M}">■</span> Math ${dh(tot.M)}</div></div></div>
  <div class="card"><h2>Pace</h2>${paceHtml()}</div>`;
}
/* ---------- Chapters ---------- */
const pct=s=>Math.round(Object.keys(KEYS).filter(k=>KEYS[k].s==s&&cs(k)[1]).length/D.ch[s].length*100);
function vCh(){
  const tot=Math.round(Object.keys(D.sub).reduce((a,s)=>a+pct(s),0)/3);
  return `<div class="rings"><button style="cursor:default">${ring(tot,"Overall practiced",70)}<span>Overall</span></button>${Object.entries(D.sub).map(([k,v])=>`<button class="${k==sf?"on":""}" onclick="sf='${k}';render()">${ring(pct(k),v,70)}<span>${v}</span></button>`).join("")}</div>
  <div class="mut" style="margin-top:8px">Rings show the share of chapters practiced. Ticking steps in the Day tab updates these (after you confirm).</div>
  <div class="hdr"><span>${D.sub[sf]}</span><span>Learned</span><span>Practiced</span><span>Revised</span></div><div class="two">`+
  D.ch[sf].map(c=>{const k=sf+":"+c[0],v=cs(k),n=cc(k),m=S.tc[k]||0,i=ki(k);
    return `<div class="chc"><div class="row"><span>${esc(c[0])}${c[2]?`<em>${esc(c[2])}</em>`:""}</span>${[0,1,2].map(j=>`<input type="checkbox" aria-label="${["Learned","Practiced","Revised"][j]}" ${v[j]?"checked":""} onchange="chk(${i},${j},this.checked)">`).join("")}</div>
    <div class="cls">ACS classes <button onclick="ccAdd(${i},-1)" aria-label="One less">−</button><b>${n[0]}</b> of <input type="number" min="0" value="${n[1]}" aria-label="Total classes" onchange="ccTot(${i},+this.value)"><button onclick="ccAdd(${i},1)" aria-label="One more">+</button>${m?`<span class="mut">· ${dh(m)} studied</span>`:""}${S.pd[k]?`<span class="mut">· practiced ${S.pd[k]}</span>`:""}</div></div>`}).join("")+"</div>";
}
function chk(i,j,v){const k=KEYL[i],c=cs(k);c[j]=v;if(j==1){if(v)S.pd[k]=S.pd[k]||today();else{delete S.pd[k];delete S.rv[k]}}save();render()}
function ccAdd(i,x){const n=cc(KEYL[i]);n[0]=Math.max(0,n[0]+x);save();render()}
function ccTot(i,v){cc(KEYL[i])[1]=Math.max(0,v);save();render()}
/* ---------- Backlog / Errors / Exams ---------- */
function vBl(){return `<div class="card"><h2>Missed or partial classes</h2><div class="f"><select id="bs">${subOpts()}</select><input type="text" id="bt" placeholder="Topic, e.g. Organic-03"><button class="pri" onclick="add('bl','bs','bt')">Add</button></div></div>`+
  (S.bl.map((b,i)=>`<div class="blk ${b.d?"dn":""}"><div class="bt"><label class="bl"><input type="checkbox" ${b.d?"checked":""} onchange="S.bl[${i}].d=this.checked;save();render()"> <b>${D.sub[b.s]}</b> ${esc(b.t)}</label><button class="x" onclick="del('bl',${i})">Delete</button></div></div>`).join("")||'<div class="card mut">Nothing in backlog.</div>')}
function vEr(){return `<div class="card"><h2>Error log <span class="mut">${S.er.filter(e=>!e.d).length} to re-attempt</span></h2><div class="f"><select id="es">${subOpts()}</select><input type="text" id="et" placeholder="Question / topic"><select id="ec"><option>Concept</option><option>Formula</option><option>Calculation</option><option>Careless</option></select><button class="pri" onclick="add('er','es','et',{c:$('#ec').value})">Add</button></div><div class="mut">Review on Fridays. Tick when you get it right again.</div></div>`+
  S.er.map((e,i)=>`<div class="blk ${e.d?"dn":""}"><div class="bt"><label class="bl"><input type="checkbox" ${e.d?"checked":""} onchange="S.er[${i}].d=this.checked;save();render()"> <b>${D.sub[e.s]}</b> ${esc(e.t)} <span class="mut">(${e.c})</span></label><button class="x" onclick="del('er',${i})">Delete</button></div></div>`).join("")}
function add(k,sid,tid,x){const t=$("#"+tid).value.trim();if(!t)return;S[k].unshift(Object.assign({s:$("#"+sid).value,t,d:false},x||{}));save();render()}
function del(k,i){S[k].splice(i,1);save();render()}
function vEx(){const ex=EX().filter(e=>e.date>=addD(today(),-14));
  return `<div class="card"><h2>My offline exams</h2><div class="mut">Set your exam batch start time and how long each type takes including commute (minutes). These appear on the Day screen and in the Inbox.</div>
  <div class="f"><label class="mut">Start <input type="time" value="${S.exT}" onchange="S.exT=this.value||'10:15';save();render()"></label>${["D","W","M"].map(t=>`<label class="mut">${TYN[t]} <input type="number" min="15" step="5" style="width:72px" value="${S.exm[t]||D.examMin[t]}" onchange="S.exm['${t}']=+this.value;save();render()"></label>`).join("")}</div>
  <table>${ex.map(e=>`<tr><td>${fd(e.date)}</td><td>${esc(e.name)}<div class="mut">${TYN[e.ty]}${e.cv.length?" · "+e.cv.map(k=>esc(KEYS[k].n)).join(", "):""}</div></td><td><input type="time" value="${exT(e)}" aria-label="Start time" onchange="S.ext['${e.id}']=this.value;save();render()"></td><td><button class="x" onclick="exSkip('${e.id}')">${e.cu?"Delete":"Skip"}</button></td></tr>`).join("")||'<tr><td class="mut">No upcoming exams. Add one below.</td></tr>'}</table>
  <h2 style="margin-top:12px">Add an exam</h2><div class="f"><input type="date" id="xd" aria-label="Date"><input type="text" id="xn" placeholder="e.g. Weekly exam 10"><select id="xt" aria-label="Type"><option value="D">Daily</option><option value="W">Weekly</option><option value="M">Monthly</option></select></div>
  <div class="f"><select id="xc" multiple size="4" aria-label="Chapters covered (optional)">${allOpts("")}</select><button class="pri" onclick="addEx()">Add exam</button></div><div class="mut">Optional: select the chapters it covers (hold Ctrl, or tap several) so the Inbox can warn you what is not practiced yet.</div>
  <div class="f"><button onclick="S.exs={};save();render()">Restore skipped exams</button></div></div>
  <div class="two"><div class="card"><h2>Admission exam countdown</h2><div class="mut">Dates may change; edit them in data.js.</div><table>${D.exams.map(e=>`<tr><td>${esc(e[0])}</td><td class="mut">${e[1]}</td><td style="text-align:right"><b>${left(e[1])}</b> days</td></tr>`).join("")}</table></div>
  <div class="card"><h2>Exam scores</h2><div class="mut">Targets: ${D.targets.map(t=>fd(t[0])+" "+t[1]+"%").join(", ")}</div><div class="f"><input type="text" id="sn" placeholder="Exam name"><input type="number" id="sp" placeholder="%" min="0" max="100" style="width:80px"><button class="pri" onclick="addSc()">Add</button></div>
  <table>${S.sc.map((x,i)=>`<tr><td>${esc(x.n)}</td><td><b>${esc(x.p)}%</b></td><td class="mut">${x.dt}</td><td><button class="x" onclick="del('sc',${i})">Delete</button></td></tr>`).join("")}</table></div></div>`}
function addEx(){const dt=$("#xd").value,n=$("#xn").value.trim();if(!dt||!n)return;S.mx.push({id:"c"+Date.now(),date:dt,name:n,ty:$("#xt").value,cv:[...$("#xc").selectedOptions].map(o=>o.value)});save();render()}
function exSkip(id){const i=S.mx.findIndex(x=>x.id==id);if(i>=0)S.mx.splice(i,1);else S.exs[id]=1;save();render()}
function addSc(){const n=$("#sn").value.trim(),p=$("#sp").value;if(!n||p==="")return;S.sc.unshift({n,p,dt:today()});save();render()}
/* ---------- Inbox ---------- */
function inbox(){const t=today(),L=[],P=(id,ic,ti,su,ac)=>{if(!S.dis[id])L.push({id,ic,ti:esc(ti),su:esc(su),ac})};
  dueList().forEach(k=>L.push({id:"rv"+k,ic:"🔁",ti:"Revise: "+esc(KEYS[k].n),su:D.sub[KEYS[k].s]+" · revision "+((S.rv[k]||0)+1)+" of 3",rv:1,ac:`<button class="pri" onclick="revDone(${ki(k)})">Done</button><button onclick="snz(${ki(k)})">Tomorrow</button>`}));
  EX().forEach(e=>{const dl=left(e.date),np=e.cv.filter(k=>!cs(k)[1]).length;
    if(dl>=0&&dl<=7)P("up"+e.id,"📝",(dl==0?"Today":dl==1?"Tomorrow":fd(e.date))+": "+e.name,TYN[e.ty]+" offline exam at "+exT(e)+", about "+exDur(e)+" min with commute."+(e.cv.length?" Covers "+e.cv.map(k=>KEYS[k].n).join(", ")+". "+(np?np+" of "+e.cv.length+" chapters not practiced yet.":"All covered chapters are practiced."):""),`<button class="pri" onclick="setCur('${e.date}')">Open day</button><button onclick="exSkip('${e.id}')">Not sitting</button>`);
    if(dl<0&&dl>=-14&&!S.exd[e.id])P("sc"+e.id,"📊","Log your score: "+e.name,"Taken on "+fd(e.date)+". Enter your percentage.",`<input type="number" id="sx_${e.id}" min="0" max="100" placeholder="%" style="width:80px"><button class="pri" onclick="logSc('${e.id}')">Save</button>`)});
  if(!S.lastExp||left(addD(S.lastExp,7))<=0)if(!/synced/.test(window.syncText||""))P("bk"+t,"💾","Back up your progress","No export in the last 7 days and Drive sync is not active.",`<button class="pri" onclick="exp()">Export now</button><button onclick="mt='sy';go('more')">Sync settings</button>`);
  const ob=S.bl.filter(b=>!b.d).length;if(ob)P("bl"+t,"📌",ob+" backlog topic"+(ob>1?"s":"")+" waiting","Missed or partial classes to catch up on.",`<button onclick="mt='bl';go('more')">Open backlog</button>`);
  const w=S.wt[wk(t)];if(!w||!(w.P||w.C||w.M))P("wt"+wk(t),"🎯","Set this week's targets","How many chapters to practice in Physics, Chemistry and Math.",`<button class="pri" onclick="wv=wk(today());go('wk')">Set targets</button>`);
  return L}
function vIn(){const L=inbox();
  return `<div class="card"><h2>Inbox ${L.length?`<span class="mut">${L.length} item${L.length>1?"s":""}</span>`:""}</h2><div class="mut">Revision reminders, exam prep, score logging and housekeeping.</div></div>`+
  (L.map(x=>`<div class="blk"><div class="bt"><span style="font-size:1.3rem">${x.ic}</span><span class="bl"><b>${x.ti}</b><em>${x.su}</em></span></div><div class="f">${x.ac}${x.rv?"":`<button class="x" onclick="dis('${x.id}')">Dismiss</button>`}</div></div>`).join("")||'<div class="card mut">All clear. Nothing needs your attention.</div>')}
const dis=id=>{S.dis[id]=1;save();render()},snz=i=>{S.sn[KEYL[i]]=addD(today(),1);save();render()};
function logSc(id){const v=$("#sx_"+id).value;if(v==="")return;const e=EX().find(x=>x.id==id);S.sc.unshift({n:e.name,p:v,dt:e.date});S.exd[id]=1;save();render()}
/* ---------- Routine editor ---------- */
const RS=[["","None"],["M","Math (chapter)"],["P","Physics (chapter)"],["C","Chemistry (chapter)"],["E","Error log"],["R","Class recording"],["B","Practice (any chapter)"],["N","Nap (timer)"],["Z","Sleep"]];
function vRt(){const R=rt().slice().sort((a,b)=>mm(a.t)-mm(b.t));
  return `<div class="card"><h2>Edit your routine</h2><div class="mut">Changes save instantly and apply to every day. Steps are separated by semicolons. End a step with [L] Learned, [P] Practiced, [R] Revised or [W] class watched to update Chapters (the app asks first). The recording block's end time is computed from class length and speed.</div><div class="f"><button class="pri" onclick="rtAdd()">Add block</button><button onclick="rtReset()">Reset to default</button></div></div><div class="two">`+
  R.map(b=>`<div class="card"><div class="f"><input type="time" value="${b.t}" aria-label="Start" onchange="rtE('${b.id}','t',this.value)"><input type="time" value="${b.e||""}" aria-label="End" ${b.s=="R"?"disabled":""} onchange="rtE('${b.id}','e',this.value)"><select aria-label="Type" onchange="rtE('${b.id}','s',this.value)">${RS.map(o=>`<option value="${o[0]}" ${o[0]==b.s?"selected":""}>${o[1]}</option>`).join("")}</select></div>
  <div class="f"><input type="text" value="${esc(b.l)}" aria-label="Label" onchange="rtE('${b.id}','l',this.value)"></div><div class="f"><input type="text" value="${esc(b.k)}" placeholder="Step one; Step two [P]" aria-label="Steps" onchange="rtE('${b.id}','k',this.value)"></div>
  <label class="mut"><input type="checkbox" ${b.m?"checked":""} onchange="rtE('${b.id}','m',this.checked?1:0)"> Must-do on hard days</label> <button class="x" onclick="rtDel('${b.id}')">Delete</button></div>`).join("")+"</div>"}
function rtE(id,f,v){const r=S.rt=S.rt||defRt();r.find(x=>x.id==id)[f]=v;save();render()}
function rtAdd(){const r=S.rt=S.rt||defRt();r.push({id:"u"+Date.now(),t:"12:00",e:"12:30",l:"New block",s:"",m:0,k:""});save();render()}
function rtDel(id){ask("Delete this block?",[["Delete",()=>{S.rt=rt().filter(x=>x.id!=id);save();render()},"pri"],["Cancel"]])}
function rtReset(){ask("Reset the routine to the default? Your ticks stay, but custom blocks are removed.",[["Reset",()=>{S.rt=null;save();render()},"pri"],["Cancel"]])}
/* ---------- Phone ---------- */
const TESS="https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
function setPh(k,v){const d=S.ph[phd]=S.ph[phd]||{p:0,s:0};d[k]=Math.max(0,Math.round(+v)||0);save();render()}
function startPw(){S.phRun=Date.now();save();render()}
function stopPw(){const m=Math.round((Date.now()-S.phRun)/6e4),t=today(),d=S.ph[t]=S.ph[t]||{p:0,s:0};d.s+=m;S.phRun=0;save();render();toast("Added "+m+" min of social media")}
setInterval(()=>{const e=$("#pw");if(e)e.textContent=S.phRun?fmt(Math.floor((Date.now()-S.phRun)/1000)):"0:00"},1000);
const dm=l=>{let m=0,f=0;const h=l.match(/(\d+)\s*(?:h|hr|hrs|hours?)\b/i),n=l.match(/(\d+)\s*(?:m|min|mins|minutes?)\b/i);if(h){m+=h[1]*60;f=1}if(n){m+=+n[1];f=1}return f?m:0};
function loadScript(u){return new Promise((ok,no)=>{if(window.Tesseract)return ok();const s=document.createElement("script");s.src=u;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
async function ocr(f){if(!f)return;const o=$("#ocr");o.innerHTML='<div class="mut">Reading the screenshot (the first time downloads about 10 MB)...</div>';
  try{await loadScript(TESS);const r=await Tesseract.recognize(f,"eng"),L=r.data.text.split("\n").map(x=>x.trim()).filter(x=>x&&dm(x)).slice(0,12);
    o.innerHTML=L.length?'<div class="mut">Tap what each number is. Auto-read can be wrong, so check it.</div>'+L.map(l=>`<div class="bt"><span class="bl">${esc(l)} <b>= ${dm(l)} min</b></span><button onclick="setPh('p',${dm(l)})">Phone total</button><button onclick="setPh('s',${dm(l)})">Social media</button></div>`).join(""):'<div class="mut warn">No times found. Try a clearer screenshot or enter the minutes by hand.</div>'}
  catch(e){o.innerHTML='<div class="mut warn">Could not read it (needs internet). Enter the minutes by hand.</div>'}}
function vPh(){const d=S.ph[phd]||{p:0,s:0},lim=S.lim,t=today(),days=[];
  for(let i=6;i>=0;i--){const x=addD(t,-i),v=S.ph[x];days.push({l:fd(x).slice(0,3),seg:[[v&&v.s>lim?"var(--bad)":"var(--ac)",v?v.s:0]]})}
  let st=0;for(let i=S.ph[t]?0:1;i<90;i++){const v=S.ph[addD(t,-i)];if(v&&v.s<=lim)st++;else break}
  const sp=Math.min(100,Math.round(d.s/lim*100));
  return `<div class="two"><div class="card"><h2>Phone and social media</h2><div class="top">${ring(sp,"Social media vs limit",84)}<div style="flex:1"><div class="mut">Limit ${lim} min/day. Streak under the limit: <b>${st}</b> day${st==1?"":"s"}.</div><div class="mut">${d.s>lim?'<span class="warn">Over the limit.</span>':"Within the limit."}</div></div></div>
  <div class="f"><input type="date" value="${phd}" aria-label="Date" onchange="phd=this.value||today();render()"></div>
  <div class="f"><label>Phone total <input type="number" min="0" value="${d.p}" style="width:80px" onchange="setPh('p',this.value)"> min</label><label>Social media <input type="number" min="0" value="${d.s}" style="width:80px" onchange="setPh('s',this.value)"> min</label></div>
  <div class="f"><label class="mut">Daily limit <input type="number" min="0" value="${lim}" style="width:70px" onchange="S.lim=+this.value||40;save();render()"> min</label></div></div>
  <div class="card"><h2>Social media stopwatch</h2><div class="top"><span class="hi" id="pw">${S.phRun?fmt(Math.floor((Date.now()-S.phRun)/1000)):"0:00"}</span>${S.phRun?'<button class="pri" onclick="stopPw()">Stop and add</button>':'<button class="pri" onclick="startPw()">Start</button>'}</div><div class="mut">Start it when you open social media, stop when you close it. It adds to today's social media total.</div></div>
  <div class="card"><h2>Add from a screenshot</h2><div class="mut">Upload a Screen Time / Digital Wellbeing screenshot and the app reads the times in it.</div><div class="f"><label class="btn ghost">Choose screenshot<input type="file" accept="image/*" hidden onchange="ocr(this.files[0])"></label></div><div id="ocr"></div></div>
  <div class="card"><h2>Last 7 days (social media)</h2>${bars(days,lim,v=>v+"m")}<div class="mut">Dashed line is your limit.</div></div></div>`}
/* ---------- Backup & sync ---------- */
function vSy(){const on=!!D.googleClientId;
  return `<div class="two"><div class="card"><h2>Google Drive sync</h2>${on?`<div class="mut">Saves to a hidden app folder in your Google Drive and loads on your other devices. Status: <b class="sc" onclick="Sync.now()">${esc(window.syncText||"☁ not connected")}</b></div><div class="f"><button class="pri" onclick="Sync.connect()">Sign in / Sync now</button><button onclick="Sync.signOut()">Disconnect</button></div><div class="mut">Use the same Google account on every device. Edits sync a few seconds after you make them.</div>`:'<div class="mut">Sync is off. Paste your Google client ID into <code>googleClientId</code> in data.js (steps are in README.md).</div>'}</div>
  <div class="card"><h2>Manual backup</h2><div class="mut">${S.lastExp?"Last export: "+S.lastExp+". ":""}${!S.lastExp||left(addD(S.lastExp,7))<=0?'<span class="warn">Export a backup now.</span> ':""}Keep the file somewhere safe.</div>
  <div class="f"><button class="pri" onclick="exp()">Export progress</button><label class="btn ghost">Import progress<input type="file" accept=".json" hidden onchange="imp(this.files[0])"></label><button onclick="ask('Erase all progress on this device?',[['Erase',()=>{S={};localStorage.removeItem(K);location.reload()},'pri'],['Cancel']])">Reset</button></div></div></div>`}
function exp(){S.lastExp=today();save();const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:"application/json"}));a.download="study-progress-"+today()+".json";a.click();render()}
function imp(f){if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(typeof o!="object"||!o.ch)throw 0;S=o;fixS();save();location.reload()}catch(e){toast("That file is not a valid progress export.")}};r.readAsText(f)}
/* ---------- Verse bar ---------- */
const VC={R:"Reward",F:"Fear Allah",M:"Motivation",T:"Trust & patience"},VL=[],vseen=new Set();
for(const[c,a]of Object.entries(window.VERSES||{}))a.forEach(r=>{const[s,x]=r.split(":"),[p,q]=x.split("-");for(let i=+p;i<=(+q||+p);i++){const k=s+":"+i;if(!vseen.has(k)){vseen.add(k);VL.push([c,k])}}});
let VK={},VS={},VCur=null;try{VK=JSON.parse(localStorage.getItem("studyapp.verses"))||{}}catch(e){}try{VS=JSON.parse(localStorage.getItem("studyapp.vstate"))||{}}catch(e){}
const vsave=()=>{try{localStorage.setItem("studyapp.vstate",JSON.stringify(VS))}catch(e){}};
function shuffle(){const o=VL.map((_,i)=>i);for(let i=o.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[o[i],o[j]]=[o[j],o[i]]}VS.o=o;VS.p=0;VS.n=VL.length}
async function loadV(ref){if(VK[ref])return VK[ref];const j=await(await fetch("https://api.alquran.cloud/v1/ayah/"+ref+"/editions/quran-uthmani,en.sahih,bn.bengali")).json(),d=j.data;
  const v={a:d[0].text,e:d[1].text,b:d[2].text,n:d[0].surah.englishName+" "+ref};VK[ref]=v;try{localStorage.setItem("studyapp.verses",JSON.stringify(VK))}catch(e){}return v}
function fs(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()}
function minV(){VS.min=!VS.min;vsave();paintV()}
function paintV(){if(!VCur)return;const{c,ref,v}=VCur,l=VS.l||"both",m=VS.min;
  $("#vb").innerHTML=`<div class="vh"><span class="chip">${VC[c]}</span><span class="mut">${esc(v?v.n:ref)}</span><span class="vbtn"><span class="chip sc" onclick="mt='sy';go('more')">${esc(window.syncText||"☁ sync off")}</span>${m?"":`<select aria-label="Translation" onchange="VS.l=this.value;vsave();paintV()">${[["both","EN + BN"],["en","English"],["bn","Bangla"]].map(o=>`<option value="${o[0]}" ${o[0]==l?"selected":""}>${o[1]}</option>`).join("")}</select>`}<button onclick="showV()" aria-label="Next verse">Next</button><button onclick="fs()" aria-label="Toggle fullscreen">⛶</button><button onclick="minV()" aria-label="${m?"Show verse":"Minimize verse"}">${m?"▾ Show":"▴ Hide"}</button></span></div>`+
  (m?"":`<div class="vbody" onclick="this.classList.toggle('open')" title="Tap to expand">`+(v?`<div class="ar" dir="rtl" lang="ar">${esc(v.a)}</div>`+(l!="bn"?`<div class="tr">${esc(v.e)}</div>`:"")+(l!="en"?`<div class="tr" lang="bn">${esc(v.b)}</div>`:""):`<div class="tr">Connect to the internet once to load this verse. <a href="https://quran.com/${ref.replace(":","/")}" target="_blank" rel="noopener">Read it on quran.com</a></div>`)+"</div>");
  $("#vb").classList.remove("fade")}
async function showV(){if(!VL.length)return;if(!VS.o||VS.n!=VL.length||VS.p+1>=VL.length)shuffle();else VS.p++;vsave();
  const[c,ref]=VL[VS.o[VS.p]];$("#vb").classList.add("fade");let v=null;try{v=await loadV(ref)}catch(e){}
  VCur={c,ref,v};setTimeout(paintV,250);for(let k=1;k<=2;k++){const x=VL[VS.o[(VS.p+k)%VL.length]];if(x)loadV(x[1]).catch(()=>{})}}
window.onSyncStatus=(t,bad)=>{window.syncText=t;document.querySelectorAll(".sc").forEach(e=>{e.textContent=t;e.classList.toggle("bad",!!bad)})};
onSave=()=>{window.Sync&&Sync.push()};
if(window.ResizeObserver)new ResizeObserver(()=>document.documentElement.style.setProperty("--vbh",$("#vb").offsetHeight+"px")).observe($("#vb"));
(function again(){setTimeout(()=>{showV();again()},(120+Math.random()*180)*1000)})();
showV();render();
