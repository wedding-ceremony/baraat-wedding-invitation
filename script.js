const screens=[...document.querySelectorAll('.screen')];
function go(id){screens.forEach(s=>s.classList.toggle('active',s.id===id));window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
document.getElementById('tapOpen').addEventListener('click',()=>{go('scratchScreen');initScratch();});
const canvas=document.getElementById('scratchCanvas'),ctx=canvas.getContext('2d',{willReadFrequently:true}),card=document.getElementById('scratchCard');
let drawing=false,cleared=false,last=null,checkCounter=0;
function foil(){const r=card.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
 const w=r.width,h=r.height,g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#9c743d');g.addColorStop(.18,'#f5e4b9');g.addColorStop(.36,'#c49b58');g.addColorStop(.52,'#f8e9c4');g.addColorStop(.72,'#b88c4c');g.addColorStop(1,'#f1d9a2');ctx.globalCompositeOperation='source-over';ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 for(let i=0;i<150;i++){let x=Math.random()*w,y=Math.random()*h;ctx.fillStyle=i%2?'rgba(255,255,255,.12)':'rgba(105,65,24,.09)';ctx.beginPath();ctx.arc(x,y,Math.random()*1.2+.2,0,Math.PI*2);ctx.fill();}
 ctx.strokeStyle='rgba(255,248,222,.85)';ctx.lineWidth=1;ctx.strokeRect(9,9,w-18,h-18);
 ctx.fillStyle='#fff0d9';ctx.font='700 9px DM Sans, sans-serif';ctx.textAlign='center';ctx.fillText('SCRATCH TO REVEAL',w/2,h/2+4);
 ctx.globalCompositeOperation='destination-out';cleared=false;document.getElementById('toInvitation').disabled=true;document.getElementById('scratchProgress').textContent='Gently scratch the golden surface with your finger';
}
function initScratch(){requestAnimationFrame(foil);}
function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function scratch(e){if(!drawing||cleared)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=42;if(last){ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();}else{ctx.beginPath();ctx.arc(p.x,p.y,21,0,Math.PI*2);ctx.fill();}last=p;if(++checkCounter%7===0)checkScratch();}
function checkScratch(){const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<data.length;i+=4)if(data[i]<40)clear++;let pct=clear/(data.length/4);document.getElementById('scratchProgress').textContent=Math.min(100,Math.round(pct*100))+'% revealed — keep going!';if(pct>=.60)finishScratch();}
function finishScratch(){if(cleared)return;cleared=true;ctx.clearRect(0,0,canvas.width,canvas.height);document.getElementById('scratchProgress').textContent='Beautiful! Your special date is revealed.';document.getElementById('toInvitation').disabled=false;document.getElementById('toInvitation').classList.add('ready');}
canvas.addEventListener('pointerdown',e=>{drawing=true;last=null;canvas.setPointerCapture(e.pointerId);scratch(e);});
canvas.addEventListener('pointermove',scratch);
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>canvas.addEventListener(ev,()=>{drawing=false;last=null;}));
document.getElementById('replayScratch').addEventListener('click',()=>{foil();});
document.getElementById('toInvitation').addEventListener('click',()=>go('invitation'));
const flipWrap=document.getElementById('flipWrap'),cardEl=document.getElementById('invitationCard');
function flip(){cardEl.classList.toggle('flipped');}
document.getElementById('cardTurn').addEventListener('click',flip);document.getElementById('backToFront').addEventListener('click',flip);
document.getElementById('toDetails').addEventListener('click',()=>go('details'));
document.getElementById('replayInvitation').addEventListener('click',()=>{cardEl.classList.remove('flipped');go('opening');});
const target=new Date('2026-12-11T18:00:00+05:00').getTime();
function tick(){let n=Math.max(0,target-Date.now());const vals=[Math.floor(n/86400000),Math.floor(n%86400000/3600000),Math.floor(n%3600000/60000),Math.floor(n%60000/1000)];['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=String(vals[i]).padStart(2,'0'));}
tick();setInterval(tick,1000);
window.addEventListener('resize',()=>{if(document.getElementById('scratchScreen').classList.contains('active'))foil();});
