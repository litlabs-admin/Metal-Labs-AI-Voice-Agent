// @ts-nocheck
export function initSite(root: HTMLElement) {
const $=s=>root.querySelector(s), $$=s=>[...root.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const ic={
 phone:'<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>',
 cal:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 doc:'<svg viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 13h6M10 17h6"/></svg>',
 chk:'<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>'};
const wave=(n=5)=>'<span class="wv">'+Array.from({length:n},(_,i)=>`<i style="animation-delay:${i*.12}s"></i>`).join("")+'</span>';
const tick=t=>`<span class="tk">${ic.chk}</span>${t}`;

/* ---------- hero journey ---------- */
const steps=[
 {r:"Lead in",t:"0:00",c:"A new lead hits your CRM",s:()=>`<div class="crm"><div class="crm-h mono"><span>Lead</span><span>Source</span><span>Type</span><span>Age</span></div>
  <div class="crm-r old"><span>Marcus T.</span><span>Referral</span><span>Refi</span><span>3d</span></div>
  <div class="crm-r old"><span>Gary L.</span><span>Web form</span><span>Purchase</span><span>9d</span></div>
  <div class="crm-r new"><span><b>Dana R.</b></span><span>Zillow</span><span>Purchase</span><span class="live">now</span></div></div>`},
 {r:"Dialed",t:"0:02",c:"Dialed in 2 seconds",s:()=>`<div class="call"><div class="av">D</div><b>Dana R.</b><span class="mono" id="ctime">0.0s</span><div class="cstat" id="cstat">Calling</div>${wave(9)}</div>`,after:()=>{const e=$("#ctime"),st=$("#cstat");if(!e)return;const t0=performance.now();const f=t=>{if(!$("#ctime"))return;const k=Math.min(2,(t-t0)/450);e.textContent=k.toFixed(1)+"s";if(k<2)requestAnimationFrame(f);else{st.textContent="Connected";st.classList.add("ok")}};requestAnimationFrame(f)}},
 {r:"Pre-qualify",t:"0:40",c:"Checks pass. Right questions asked.",s:()=>`<div class="pq"><div class="chk">${["Consent on file","Not on Do-Not-Call","State rules (TX)","Calling hours"].map((x,i)=>`<div style="--d:${i*.28}s">${tick(x)}</div>`).join("")}</div>
  <div class="qa">${[["Buying or refinancing?","Buying"],["Price range?","About $450k"],["Timeline?","60 days"],["Working with another LO?","No"]].map((x,i)=>`<div style="--d:${1.2+i*.5}s"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("")}</div></div>`},
 {r:"Qualified",t:"2:10",c:"Lead qualified",s:()=>`<div class="qual"><div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42"/><circle class="arc" cx="50" cy="50" r="42"/></svg><span>${ic.chk}</span></div><b>Qualified</b><div class="chips"><span>Purchase</span><span>~$450k</span><span>60 days</span><span>Consent valid</span></div></div>`},
 {r:"Booked",t:"2:30",c:"Booked. Invite lands on your calendar.",s:()=>`<div class="cal"><div class="cal-h mono"><span>Tomorrow</span><span>Google Calendar</span></div>${["8 AM","9 AM","10 AM","11 AM"].map(x=>`<div class="slot"><small>${x}</small></div>`).join("")}<div class="evt"><b>Call: Dana R.</b><small>9:30 AM · purchase</small></div><div class="sent">${tick("Invite sent to you")}</div></div>`},
 {r:"You pick up",t:"Next day",c:"You take the call, fully briefed",s:()=>`<div class="pick"><div class="brief"><b>Dana R.</b><p>Purchase, ~$450k, 60 days. Consent valid. No other LO.</p></div><div class="you"><div class="av lo">You</div><span class="ringp"></span>${wave(7)}<small>Connected</small></div></div>`},
 {r:"Prequal",t:"9:45",c:"Compliance-based pre-qual continues",s:()=>`<div class="form">${[["Income","W-2, salaried"],["Assets","Savings verified"],["Employment","2 years"],["Credit pull","Consent captured"]].map((x,i)=>`<div style="--d:${i*.55}s"><small>${x[0]}</small><b>${x[1]}</b><i>${ic.chk}</i></div>`).join("")}<p class="mono note">Never quotes rates. Hands off advice to you.</p></div>`},
 {r:"Docs",t:"Day 2",c:"Documents collected",s:()=>`<div class="dl">${[["Pay stub",1],["W-2",1],["Bank statement",.6],["ID",1]].map((x,i)=>`<div style="--d:${i*.4}s"><span>${ic.doc}${x[0]}</span><div class="pb"><i style="--w:${x[1]*100}%"></i></div></div>`).join("")}<p class="mono note">Asked by text via your CRM</p></div>`},
 {r:"Conditions",t:"Day 5",c:"Conditions chased until cleared",s:()=>`<div class="cond">${[["Letter of explanation","chasing"],["Updated bank statement","chasing"],["Appraisal ordered","done"]].map((x,i)=>`<div class="${x[1]}" style="--d:${i*.5}s"><span>${x[0]}</span><em>${x[1]=="done"?tick("Cleared"):"Chasing"}</em></div>`).join("")}<div class="ctc" style="--d:2.2s">${tick("Clear to close")}</div></div>`}
];
$("#rail").innerHTML=steps.map((s,i)=>`<button data-i="${i}"><i>${i+1}</i><span>${s.r}</span><u></u></button>`).join("");
let cur=-1,hold=false,timer=null,DUR=3600;
function show(i){cur=i;$$("#rail button").forEach((b,j)=>{b.classList.toggle("on",j===i);b.classList.toggle("done",j<i);const u=b.querySelector("u");u.style.animation="none";u.offsetWidth;if(j===i)u.style.animation=`fill ${DUR}ms linear forwards`});
 const s=steps[i];$("#scene").innerHTML=`<div class="cap"><b>${s.c}</b></div><div class="body" key="${i}">${s.s()}</div>`;
 $("#stclock").textContent=s.t;
 $("#side").innerHTML=`<div class="mini">${steps.map((x,j)=>`<div class="${j<i?"d":j==i?"n":""}"><i></i>${x.r}</div>`).join("")}</div>`;
 s.after&&s.after();}
function next(){show((cur+1)%steps.length)}
function loop(){clearTimeout(timer);timer=setTimeout(()=>{if(!hold)next();loop()},DUR)}
$("#rail").onclick=e=>{const b=e.target.closest("button");if(!b)return;show(+b.dataset.i);loop()};
$("#stage").onmouseenter=()=>hold=true;$("#stage").onmouseleave=()=>hold=false;
show(0);loop();

/* ---------- speed race ---------- */
const lanes=[["You + MetaLab","0:02",.04,"v"],["Lender B","19h avg",1,""],["Lender C","19h avg",1,""]];
$("#race").innerHTML=`<div class="rh mono"><span>Borrower submits a form</span><span>First call</span></div>`+lanes.map(l=>`<div class="lane ${l[3]}"><span class="ln">${l[0]}</span><div class="track"><i style="--w:${l[2]*100}%"></i><b class="dot"></b></div><span class="lt mono">${l[1]}</span></div>`).join("");

/* ---------- stats count ---------- */
function count(el){const to=+el.dataset.to,t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1300);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}

/* ---------- old leads dots ---------- */
const N=480,dots=$("#dots");dots.innerHTML=Array.from({length:N},()=>"<i></i>").join("");
const D=[...dots.children];let dcount=0;
function sweep(){D.forEach(d=>d.className="");const byHand=new Set();while(byHand.size<Math.round(N*.05))byHand.add(Math.floor(Math.random()*N));byHand.forEach(i=>D[i].className="k1");
 let i=0;const dc=$("#dcnt");const step=()=>{for(let n=0;n<6&&i<N;n++,i++){if(!byHand.has(i))D[i].className="k2"}dc.textContent=Math.round(i/N*100);if(i<N)requestAnimationFrame(step);else setTimeout(sweep,4000)};
 setTimeout(()=>requestAnimationFrame(step),900)}
let swept=false;

/* ---------- why they stalled ---------- */
const why=[["Went quiet after a quote","M4 30l8-8 6 6 14-16","\"Rates dropped today. Want me to rerun your numbers?\""],["Never sent docs","M8 6h18l6 6v20H8zM26 6v6h6","\"Just the pay stub for now. A photo is fine.\""],["Said maybe later","M20 6a14 14 0 100 28 14 14 0 000-28zM20 12v9l6 3","\"You mentioned spring. Still on track?\""],["Went elsewhere","M6 20h28M24 10l10 10-10 10","\"No worries. I'm here if anything changes.\""]];
$("#why").innerHTML=why.map(w=>`<div class="w"><svg viewBox="0 0 40 40" fill="none" stroke="#7c6cff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${w[1]}"/></svg><h3>${w[0]}</h3><div class="bubble">${w[2]}</div></div>`).join("");

/* ---------- rules ---------- */
const rules=[["consent","Only leads who said yes"],["quiet","Calls inside your hours"],["mine","Skips leads you own"],["rate","Hands off rate questions"]];
const L=[["Dana R.","new lead 9:41 PM"],["Priya S.","no AI consent"],["Gary L.","you are on his file"],["Marcus T.","asks about rates"]];
const st={};rules.forEach(r=>st[r[0]]=true);
function sim(){const rows=L.map((l,i)=>{let a,c;
 if(i==0){if(st.quiet){a="Waits till 8 AM";c="hold"}else{a="Calls now";c="call"}}
 else if(i==1){if(st.consent){a="Skipped";c="skip"}else{a="Calls anyway";c="bad"}}
 else if(i==2){if(st.mine){a="Stays away";c="hold"}else{a="Calls anyway";c="bad"}}
 else{if(st.rate){a="Hands off to you";c="hand"}else{a="Answers rates";c="bad"}}
 return `<div class="row"><span><b>${l[0]}</b><small>${l[1]}</small></span><span class="act ${c}">${a}</span></div>`}).join("");
 const risky=!st.consent||!st.mine||!st.rate;
 $("#sim").innerHTML=rows+`<div class="mono verdict ${risky?"bad":"ok"}">${risky?"Risky setup":"Safe setup"}</div>`}
$("#tgs").innerHTML=rules.map(r=>`<div class="tg on" data-k="${r[0]}"><b>${r[1]}</b><div class="sw"></div></div>`).join("");
$$(".tg").forEach(e=>e.onclick=()=>{e.classList.toggle("on");st[e.dataset.k]=e.classList.contains("on");sim()});sim();

/* ---------- docs phone ---------- */
const msgs=[["Today 6:15 AM","t"],["Hi Gary, Alex's assistant. 3 items to keep your file moving: pay stub, bank statement, ID.","a"],["[photo of pay stub]","b"],["Got it, thanks. 2 of 3 in. Bank statement next.","a"],["Quick note: the stub is cut off. Can you retake it?","a"],["[new photo]","b"],["All set. You're clear on docs.","a"]];
const tlS=[["Checklist sent","Via your CRM"],["Doc arrives","Matched to the file"],["Error flagged","Borrower told right away"],["Ready for you","Nothing to chase"]];
$("#tl").innerHTML=tlS.map((s,i)=>`<div class="st" data-i="${i}"><i>${i+1}</i><div><b>${s[0]}</b><span>${s[1]}</span></div></div>`).join("");
let mk=0;function dstep(){const ph=$("#ph");if(mk===0)ph.innerHTML="";const m=msgs[mk];const d=document.createElement("div");d.className="m "+m[1];d.textContent=m[0];ph.appendChild(d);ph.scrollTop=ph.scrollHeight;const ai=mk<2?0:mk<4?1:mk<5?2:3;$$(".st").forEach((e,i)=>e.classList.toggle("on",i<=ai));mk=(mk+1)%msgs.length}
dstep();setInterval(dstep,2300);

/* ---------- pipeline board ---------- */
const cols=["New lead","Docs needed","In processing","Clear to close"];const deals=[["Dana R.","Purchase"],["Marcus T.","Refi"],["Gary L.","Purchase"],["Priya S.","Refi"],["Tom H.","Purchase"],["Lena W.","Purchase"]];
const lbl=["First touch queued","Chasing pay stub","All docs in","Ready for you"];
const pos=[3,2,1,1,0,0];let bt;
function board(){clearInterval(bt);const b=$("#board");b.innerHTML=cols.map(c=>`<div class="col"><h4>${c}</h4></div>`).join("");
 const cs=deals.map(d=>{const e=document.createElement("div");e.className="c";e.innerHTML=`<b>${d[0]}</b><small>${d[1]}</small><div class="bar"><i></i></div>`;return e});
 const put=(c,p)=>{c.querySelector("small").textContent=lbl[p];c.classList.toggle("chasing",p===1);c.querySelector(".bar i").style.width=(p*33+1)+"%";b.children[p].appendChild(c)};
 cs.forEach((c,i)=>put(c,pos[i]));
 bt=setInterval(()=>{cs.forEach((c,i)=>{pos[i]=(pos[i]+1)%4;put(c,pos[i])})},2600)}
board();

/* ---------- use cases ---------- */
const ucs=[["Origination","Live","g","M6 28l8-10 6 6 14-16","New leads, old leads, booked calls, docs."],["Processing","Coming","","M8 6h18l6 6v20H8zM26 6v6h6","Document collection only."]];
$("#uc").innerHTML=ucs.map(u=>`<div class="u ${u[1]=="Live"?"live":""}"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${u[3]}"/></svg><h3>${u[0]}</h3><p>${u[4]}</p><span class="tag ${u[2]}">${u[1]}</span></div>`).join("");

/* ---------- pricing chips ---------- */
const pc=[["Voice agent","3,000 minutes a month",ic.phone],["Texts and email","Sent via your CRM, on its credits",ic.cal.replace('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>','<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 9l9 6 9-6"/>')],["Compliance","TCPA and state Do-Not-Call",ic.chk],["Connects","CRM, calendar, Zapier, API",ic.doc.replace('<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 13h6M10 17h6"/>','<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 11l6-4M9 13l6 4"/>')],["Origination tools","Pipeline, docs, rules, reports",ic.doc],["Support","Slack or Teams channel",ic.phone.replace('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>','<path d="M4 5h16v11H9l-5 4z"/>')]];
$("#pchips").innerHTML=pc.map(c=>`<div class="pf rv"><span class="pi">${c[2]}</span><b>${c[0]}</b><small>${c[1]}</small></div>`).join("");

/* ---------- faq ---------- */
const fq=[["Will it replace me?","No. It makes the first call and does the chasing. You do the advice and the close."],["Is it legal to call my leads?","Only with the right consent. It checks consent and Do-Not-Call before every contact. [Have counsel review before publishing.]"],["What does it say?","You edit the script. It says it is your assistant and never quotes a rate."],["Do I switch CRM?","No. It plugs into yours. [List only live integrations.]"],["What does it cost?","$695 a month, monthly. 3,000 voice minutes included. Texts and email go through your CRM, on its credits."]];
$("#fq").innerHTML=fq.map(q=>`<div class="q"><b>${q[0]}</b><p>${q[1]}</p></div>`).join("");$$(".q").forEach(e=>e.onclick=()=>e.classList.toggle("open"));$(".q").classList.add("open");

/* ---------- scroll + reveal ---------- */
const prog=$("#progress");const onScroll=()=>{const h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?scrollY/h*100:0)+"%"};
addEventListener("scroll",onScroll,{passive:true});onScroll();
const rv=$$("h2,.eyebrow,.pf,.price,.tc,.ph,.w,.u,.q,.tg,.sim,.docs>*,.col,.stat,.race,.dots-wrap,.strip .wrap,.final .cta");
rv.forEach((e,i)=>{e.classList.add("rv");e.style.setProperty("--d",(i%4)*80+"ms")});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add("in");io.unobserve(t);
 if(t.classList.contains("race"))t.classList.add("go");
 if(t.classList.contains("stat"))count(t.querySelector("b"));
 if(t.classList.contains("dots-wrap")&&!swept){swept=true;sweep()}
 if(t.classList.contains("price")){const c=$("#cnt"),t0=performance.now();const f=x=>{const k=Math.min(1,(x-t0)/1300);c.textContent=Math.round(695*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f);t.classList.add("go")}}),{threshold:.2});
rv.forEach(e=>io.observe(e));
$$(".btn").forEach(b=>{b.addEventListener("pointermove",e=>{const q=b.getBoundingClientRect();b.style.transform="translate("+((e.clientX-q.left-q.width/2)*.12)+"px,"+((e.clientY-q.top-q.height/2)*.18)+"px)"});b.addEventListener("pointerleave",()=>{b.style.transform=""})});
}
