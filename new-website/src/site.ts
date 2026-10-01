// @ts-nocheck
export function initSite(root: HTMLElement) {

const $=s=>root.querySelector(s);
const leadsD=[
{n:"Dana R.",s:"Zillow - purchase",c:"ok",ct:"Consent: AI contact",ev:[["Called in 4s. Qualified: $450k, Austin, pre-approved elsewhere.","","6:41 AM"],["Booked rate call with you, 9:30 today.","","6:43 AM"],["Sent doc checklist via your CRM.","","6:44 AM"]],ho:"You: rate call 9:30 AM"},
{n:"Marcus T.",s:"Refi - quote sent Mar 3",c:"ok",ct:"Consent: AI contact",ev:[["Went quiet after rate quote. Sent today's par rate through your CRM.","","6:30 AM"],["Replied: \"what if it drops again?\"","","6:38 AM"],["Rate-watch set. Flagged for you.","h","6:39 AM"]],ho:"You: call Marcus, he asked about rates"},
{n:"Priya S.",s:"Open house - purchase",c:"no",ct:"No AI-contact consent",ev:[["Skipped. No consent on file for automated contact.","x","6:20 AM"],["Added to your manual call list instead.","","6:20 AM"]],ho:"You: 1 manual call"},
{n:"Gary L.",s:"In process - missing 2 docs",c:"wait",ct:"Consent: CRM only",ev:[["Pay stub still missing. CRM message queued (email not allowed).","","6:15 AM"],["Photo received. Matched to file.","","6:31 AM"],["1 doc left: bank statement. Next nudge 12:00.","","6:31 AM"]],ho:"Next nudge 12:00 PM"}];
function showLead(i){root.querySelectorAll(".lead").forEach((e,j)=>e.classList.toggle("on",i===j));const d=leadsD[i];$("#pane").innerHTML=`<h4>${d.n}</h4><div><span class="chip ${d.c}">${d.ct}</span></div><div class="log">${d.ev.map((e,k)=>`<div class="ev ${e[1]}" style="animation-delay:${k*.35}s"><i></i><div>${e[0]}<small>${e[2]}</small></div></div>`).join("")}</div><div class="handoff ${d.c=="no"?"":""}"><span>${d.ho}</span><div class="wave"><i></i><i style="animation-delay:.15s"></i><i style="animation-delay:.3s"></i></div></div>`}
$("#leads").innerHTML=leadsD.map((d,i)=>`<div class="lead" data-i="${i}"><div class="r"><span>${d.n}</span><span class="chip ${d.c}">${d.c=="ok"?"consent":d.c=="no"?"no consent":"crm only"}</span></div><small>${d.s}</small></div>`).join("");
root.querySelectorAll(".lead").forEach((e,i)=>e.onclick=()=>{auto=false;showLead(i)});
let cur=0,auto=true;showLead(0);setInterval(()=>{if(!auto)return;cur=(cur+1)%leadsD.length;showLead(cur)},4200);
const ev=["Lead called in 4s - purchase - TX","Doc received - pay stub","Rate call booked - tomorrow 9:30","Skipped - no consent on file","Reply - bank statement","Aged lead re-engaged via your CRM","Handed to LO - borrower asked about rates","Docs 3 of 3 - ready for LO"];$("#tk").innerHTML=[...ev,...ev].map(e=>"<span>"+e+"</span>").join("");
// rules
const rules=[["consent","Only contact leads with AI-contact consent","If off, it would also try leads without consent (we would never ship this, shown for contrast).",true],["quiet","Quiet hours: 9 PM to 8 AM borrower time","No calls or CRM messages at night.",true],["mine","Never touch my active deals","Anything you're working stays yours.",true],["rate","Hand off when a borrower asks about rates or advice","It books you, it does not quote.",true]];
const L=[["Dana R.","new lead 9:41 PM","Zillow, consent ok"],["Priya S.","new lead 7:10 AM","no AI consent"],["Marcus T.","asked about rates","consent ok"],["Gary L.","you are on a call with him","active deal"]];
const st={};rules.forEach(r=>st[r[0]]=true);
function sim(){const rows=L.map(l=>{let a,c;
 if(l[0]=="Dana R."){if(st.quiet){a="Hold until 8 AM";c="hold"}else{a="Calls now";c="call"}}
 else if(l[0]=="Priya S."){if(st.consent){a="Skip - manual list";c="skip"}else{a="Calls anyway";c="call"}}
 else if(l[0]=="Marcus T."){if(st.rate){a="Hand off to you";c="hand"}else{a="Answers about rates";c="call"}}
 else{if(st.mine){a="Hands off";c="hold"}else{a="Texts him mid-call";c="call"}}
 return `<div class="row"><span><b>${l[0]}</b><br><small style="color:#8b8f90">${l[1]} - ${l[2]}</small></span><span class="act ${c}">${a}</span></div>`}).join("");
 const risky=!st.consent||!st.mine||!st.rate;
 $("#sim").innerHTML=`<div class="mono" style="color:#8b8f90;margin-bottom:8px">What happens next</div>${rows}<div class="mono" style="margin-top:16px;color:${risky?"var(--red)":"var(--lime)"}">${risky?"Risky: this is the setup LOs told us they fear":"Safe setup"}</div>`}
$("#tgs").innerHTML=rules.map(r=>`<div class="tg on" data-k="${r[0]}"><div><b>${r[1]}</b><span>${r[2]}</span></div><div class="sw"></div></div>`).join("");
root.querySelectorAll(".tg").forEach(e=>e.onclick=()=>{e.classList.toggle("on");st[e.dataset.k]=e.classList.contains("on");sim()});sim();
// why
const why=[["Went quiet after a quote","Sends today's rate via your CRM, only when it moved.","M4 30l8-8 6 6 14-16","\"Rates dropped 0.125 today. Want me to rerun your numbers?\""],["Never sent docs","Asks for one doc at a time, not the whole list.","M8 6h18l6 6v20H8zM26 6v6h6","\"Just the pay stub for now. A photo is fine.\""],["Said 'maybe in six months'","Waits, then checks in around the date they gave.","M20 6a14 14 0 100 28 14 14 0 000-28zM20 12v9l6 3","\"You mentioned spring. Still on track?\""],["Went with someone else","Stays polite, asks once, then stops.","M6 20h28M24 10l10 10-10 10","\"Totally fine. I'm here if anything changes.\""]];
$("#why").innerHTML=why.map(w=>`<div class="w"><svg viewBox="0 0 40 40" fill="none" stroke="#7c6cff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${w[2]}"/></svg><h3>${w[0]}</h3><p>${w[1]}</p><div class="bubble">${w[3]}</div></div>`).join("");
// docs
const steps=[["Checklist sent","Text, email, or portal link, by what the borrower uses.","Hi Gary, Alex's assistant. 3 items to keep your file moving: pay stub, bank statement, ID.","a"],["Missing item nudged","One doc at a time, at a time they respond.","Pay stub still needed. A photo works.","a"],["Doc arrives","Photo or PDF, matched to the right file.","[photo of pay stub]","b"],["File ready for you","You get a note. Nothing to chase.","Got it, thanks. 2 of 3 in. Bank statement next.","a"]];
$("#tl").innerHTML=steps.map((s,i)=>`<div class="st" data-i="${i}"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");
let k=0;function dstep(){const ph=$("#ph");if(k===0){ph.innerHTML='<div class="m s">Today 6:15 AM</div>'}root.querySelectorAll(".st").forEach((e,i)=>e.classList.toggle("on",i<=k));const s=steps[k];const d=document.createElement("div");d.className="m "+s[3];d.textContent=s[2];ph.appendChild(d);k=(k+1)%steps.length}
dstep();setInterval(dstep,2600);
// uses
const ucs=[["Origination","Live","g","Answers new leads, works old ones, books your calls, collects docs."],["Processing","Coming","","Chases conditions and keeps the file moving."],["Servicing","Coming","","Borrower questions and reminders after closing."],["Collections","Coming","","Compliant outreach on late payments."]];
$("#uc").innerHTML=ucs.map(u=>`<div class="u ${u[1]=="Live"?"live":""}"><h3>${u[0]}</h3><p>${u[3]}</p><span class="tag ${u[2]}">${u[1]}</span></div>`).join("");root.querySelectorAll(".u").forEach(e=>e.onclick=()=>e.classList.toggle("open"));
// faq
const fq=[["Will it replace me?","No. It handles the first touch and the chasing. You do the advice, the rate talk and the close. If a borrower wants a human, it hands off."],["Is it legal to call my leads?","Only if they gave the right consent. It checks consent before every contact and skips the rest. [Have counsel review this answer before publishing.]"],["What does it say to my borrowers?","You see and edit the scripts. It says it is your assistant, never quotes a rate, and never gives advice."],["Do I have to switch CRM or LOS?","No. It connects to the tools you use. [List only integrations that are live.]"],["Will it step on my own calls?","Not if you don't want it to. Mark any lead or active deal as yours and it stays away."],["What does it cost?","One plan: $695 a month, billed monthly. No annual contract. It includes 3,000 minutes of AI voice calling a month."],["Do you send texts and emails?","The voice agent plugs into your CRM. Notifications, texts and emails go out through your CRM, using its own credits."]];
$("#fq").innerHTML=fq.map(q=>`<div class="q"><b>${q[0]}</b><p>${q[1]}</p></div>`).join("");root.querySelectorAll(".q").forEach(e=>e.onclick=()=>e.classList.toggle("open"));root.querySelector(".q").classList.add("open");

// board
const cols=["New lead","Docs needed","In processing","Clear to close"];const deals=[["Dana R.","Purchase"],["Marcus T.","Refi"],["Gary L.","Purchase"]];
let timers=[];
function board(){timers.forEach(clearTimeout);timers=[];const b=$("#board");b.innerHTML=cols.map(c=>`<div class="col"><h4>${c}</h4></div>`).join("");const col=i=>b.children[i];const cs=deals.map(d=>{const e=document.createElement("div");e.className="c";e.innerHTML=`<b>${d[0]}</b><small>${d[1]}</small><div class="bar"><i></i></div>`;return e});cs.forEach(c=>col(0).appendChild(c));
 const step=(c,to,t,l)=>timers.push(setTimeout(()=>{c.querySelector("small").textContent=l;c.classList.toggle("chasing",to===1);col(to).appendChild(c);c.querySelector(".bar i").style.width=(to*33)+"%"},t));
 cs.forEach((c,i)=>{step(c,1,900+i*500,"Chasing: pay stub via your CRM");step(c,2,3400+i*700,"All docs in");step(c,3,5800+i*700,"Ready for you")})}
let started=false;
// scroll effects
const prog=$("#progress");const hero=$(".hero");
const onScroll=()=>{const h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?scrollY/h*100:0)+"%";if(hero)hero.style.setProperty("--py",(scrollY*-0.15)+"px")};
addEventListener("scroll",onScroll,{passive:true});onScroll();
root.querySelectorAll("#h1 .hw").forEach((w,i)=>w.style.setProperty("--i",i));
const rvEls=root.querySelectorAll("h2,.lede,.eyebrow,.pf,.price,#pricing .fine,.tc,.ph,.w,.u,.q,.tg,.sim,.docs>*,.col,.strip .wrap,.final .cta");
rvEls.forEach((e,i)=>{if(e.closest("#h1"))return;e.classList.add("rv");e.style.setProperty("--d",(i%4)*80+"ms")});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);if(e.target.id==="board"&&!started){started=true;board()}}}),{threshold:.15});
rvEls.forEach(e=>{if(!e.closest("#h1"))io.observe(e)});
const bo=$("#board");board();started=true;
$("#replay").onclick=board;


;(function(){const r=document;const p=document.querySelector("#pricing .price");const cnt=document.getElementById("cnt");
if(p&&"IntersectionObserver" in window){new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){p.classList.add("in");if(cnt){const to=695,t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1400);cnt.textContent=String(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}o.disconnect()}}),{threshold:.3}).observe(p)}
const cu=document.createElement("div");cu.className="cursor";document.body.appendChild(cu);let tx=0,ty=0,cx=0,cy=0;window.addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY},{passive:true});(function lp(){cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;cu.style.transform="translate("+cx+"px,"+cy+"px)";requestAnimationFrame(lp)})();
document.querySelectorAll(".btn").forEach(b=>{b.addEventListener("pointermove",e=>{const q=b.getBoundingClientRect();b.style.transform="translate("+((e.clientX-q.left-q.width/2)*.12)+"px,"+((e.clientY-q.top-q.height/2)*.18)+"px)"});b.addEventListener("pointerleave",()=>{b.style.transform=""})});
const orb=document.querySelector(".orb");window.addEventListener("scroll",()=>{if(orb)orb.style.transform="translateY("+(scrollY*.18)+"px)"},{passive:true});
})();
}
