"use strict";
/* Google Drive sync. Stores one JSON file in your hidden Drive app folder (scope drive.appdata).
   Needs window.DATA.googleClientId (see README). */
window.Sync=(function(){
  const SC="https://www.googleapis.com/auth/drive.appdata",F="study-progress.json";
  let tok=null,exp=0,tc=null,pt=null,busy=false;
  const cid=()=>window.DATA.googleClientId;
  const M=()=>{try{return JSON.parse(localStorage.getItem("studyapp.sync"))||{}}catch(e){return{}}};
  const setM=o=>{try{localStorage.setItem("studyapp.sync",JSON.stringify(Object.assign(M(),o)))}catch(e){}};
  const st=(t,bad)=>window.onSyncStatus&&window.onSyncStatus(t,bad);
  const clock=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  const tmo=(p,ms,m)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(new Error(m)),ms))]);
  function gis(){return new Promise(res=>{if(window.google&&google.accounts)return res(true);const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.onload=()=>res(true);s.onerror=()=>res(false);document.head.appendChild(s)})}
  async function auth(interactive){
    if(!(await gis()))throw new Error("Google script blocked or offline");
    return tmo(new Promise((ok,no)=>{
      tc=tc||google.accounts.oauth2.initTokenClient({client_id:cid(),scope:SC,
        callback:r=>{if(r.error)return no(new Error(r.error));tok=r.access_token;exp=Date.now()+(r.expires_in-60)*1000;setM({ok:1});ok()},
        error_callback:e=>no(new Error(e&&e.type||"sign-in needed"))});
      tc.requestAccessToken({prompt:interactive?"":"none"});
    }),interactive?90000:15000,interactive?"sign-in window timed out. Allow popups for this site and try again":"needs you to sign in again");
  }
  async function api(u,o){
    if(!tok||Date.now()>exp)await auth(false);
    o=o||{};const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),30000);let r;try{r=await fetch(u,Object.assign({},o,{signal:ac.signal,headers:Object.assign({Authorization:"Bearer "+tok},o.headers||{})}))}catch(e){throw new Error(e.name=="AbortError"?"Drive did not respond (30 s). Check your connection":e.message)}finally{clearTimeout(tm)}
    if(!r.ok){let m="";try{m=(await r.json()).error.message}catch(e){}throw new Error("Drive error "+r.status+(m?": "+m.slice(0,90):""))}return r;
  }
  async function find(){const r=await(await api("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id)&q="+encodeURIComponent("name='"+F+"'"))).json();return r.files&&r.files[0]&&r.files[0].id}
  async function pull(id){return(await api("https://www.googleapis.com/drive/v3/files/"+id+"?alt=media")).json()}
  async function put(id){
    const body=JSON.stringify(window.getState());
    if(id){await api("https://www.googleapis.com/upload/drive/v3/files/"+id+"?uploadType=media",{method:"PATCH",headers:{"Content-Type":"application/json"},body});return id}
    const b="studysep",meta=JSON.stringify({name:F,parents:["appDataFolder"]});
    const r=await(await api("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{"Content-Type":"multipart/related; boundary="+b},body:"--"+b+"\r\nContent-Type: application/json\r\n\r\n"+meta+"\r\n--"+b+"\r\nContent-Type: application/json\r\n\r\n"+body+"\r\n--"+b+"--"})).json();
    return r.id;
  }
  const done=msg=>st("☁ "+(msg||"synced")+" "+clock());
  async function sync(interactive){
    if(!cid()||busy)return;busy=true;
    try{
      st("☁ syncing...");
      if(interactive||!tok||Date.now()>exp)await auth(!!interactive);
      const m=M(),L=window.getState();let fid=m.fid||await find();
      if(!fid){fid=await put(null);setM({fid,up:L.upd});return done()}
      let R;try{R=await pull(fid)}catch(e){fid=await find();if(!fid){fid=await put(null);setM({fid,up:L.upd});return done()}R=await pull(fid)}
      if(!L.upd||(L.upd==m.up&&R.upd>L.upd)){window.setState(R);setM({fid,up:R.upd});return done("loaded from Drive")}
      if(R.upd==m.up||R.upd==L.upd){if(L.upd>(m.up||0))await put(fid);setM({fid,up:L.upd});return done()}
      const f=t=>t?new Date(t).toLocaleString():"never";
      window.ask("<b>Your Drive copy and this device both changed.</b><br>Cloud copy: "+f(R.upd)+"<br>This device: "+f(L.upd)+"<br>Which one should win?",
        [["Use cloud copy",()=>{window.setState(R);setM({fid,up:R.upd});done("loaded from Drive")},"pri"],["Keep this device",async()=>{try{await put(fid);setM({fid,up:L.upd});done()}catch(e){st("☁ reconnect",1)}}]]);
      st("☁ choose which copy to keep",1);
    }catch(e){st("☁ reconnect ("+e.message+")",1)}
    finally{busy=false}
  }
  function push(){if(!cid()||!M().ok)return;clearTimeout(pt);pt=setTimeout(()=>sync(false),4000)}
  function signOut(){try{if(tok&&window.google)google.accounts.oauth2.revoke(tok)}catch(e){}tok=null;setM({ok:0,fid:null,up:0});st("☁ disconnected")}
  if(cid()){
    st(M().ok?"☁ reconnecting...":"☁ not connected");
    if(M().ok)setTimeout(()=>sync(false),1500);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden&&M().ok)sync(false)});
  }else st("☁ sync off");
  return{connect:()=>sync(true),now:()=>sync(!tok),push,signOut};
})();
