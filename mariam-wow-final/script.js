
const env=document.getElementById('env');
const s1=document.getElementById('s1');
const s2=document.getElementById('s2');
const s3=document.getElementById('s3');

setInterval(()=>{
let f=document.createElement('div');
f.className='flower';
f.innerHTML=Math.random()>.5?'🌼':'🌸';
f.style.left=Math.random()*100+'vw';
f.style.animationDuration=(4+Math.random()*5)+'s';
document.body.appendChild(f);
setTimeout(()=>f.remove(),9000);
},250);

env.onclick=()=>{
env.classList.add('open');
setTimeout(()=>{
s1.classList.remove('active'); s2.classList.add('active');
typeText();
gsap.fromTo('.l3',{y:-150,opacity:0},{y:0,opacity:1,duration:.8});
gsap.fromTo('.l2',{y:-150,opacity:0},{y:0,opacity:1,duration:.8,delay:.7});
gsap.fromTo('.l1',{y:-150,opacity:0},{y:0,opacity:1,duration:.8,delay:1.4});
setTimeout(makeCandles,2400);
},1000);
}

function typeText(){
let t='Hey Mariam 🌼 Before your birthday celebration starts...';
let i=0;
let el=document.getElementById('type');
let x=setInterval(()=>{
el.innerHTML+=t[i++];
if(i>=t.length) clearInterval(x);
},45);
}

let left=5;
function makeCandles(){
let box=document.getElementById('candles');
for(let i=0;i<5;i++){
let c=document.createElement('div');
c.className='candle';
c.onclick=()=>{
if(c.classList.contains('off')) return;
c.classList.add('off');
left--;
document.getElementById('count').innerText='Candles Left: '+left;
if(left===0){
confetti({particleCount:300,spread:180});
setTimeout(()=>{
s2.classList.remove('active');
s3.classList.add('active');
},2500);
}
};
box.appendChild(c);
}
}
const quotes=[
'Keep smiling and shining ✨',
'Hope your coffee is always perfect ☕',
'Have the happiest birthday ever 🌼',
'Today is all about you 🎂'
];
function newQuote(){
quote.innerText=quotes[Math.floor(Math.random()*quotes.length)];
}
