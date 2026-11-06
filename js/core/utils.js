/* ---------- UTIL ---------- */
function $(sel){return document.querySelector(sel);}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pick(arr){return arr[rand(0,arr.length-1)];}
function shuffle(arr){const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=rand(0,i); [a[i],a[j]]=[a[j],a[i]];} return a;}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}

