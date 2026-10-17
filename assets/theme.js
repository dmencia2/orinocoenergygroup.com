// Resolve appearance before first paint; keep the visitor's explicit choice across pages.
(()=>{
 const key='oeg-appearance';const media=window.matchMedia('(prefers-color-scheme: dark)');
 let preference='system';try{const saved=localStorage.getItem(key);if(['light','dark','system'].includes(saved))preference=saved;}catch{}
 function apply(){const theme=preference==='system'?(media.matches?'dark':'light'):preference;document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#07192d':'#013369');const select=document.getElementById('appearance');if(select)select.value=preference;}
 apply();media.addEventListener('change',()=>{if(preference==='system')apply();});
 document.addEventListener('DOMContentLoaded',()=>{const select=document.getElementById('appearance');if(!select)return;select.value=preference;select.addEventListener('change',()=>{preference=select.value;try{localStorage.setItem(key,preference);}catch{}apply();});});
 window.addEventListener('storage',event=>{if(event.key===key){preference=['light','dark','system'].includes(event.newValue)?event.newValue:'system';apply();}});
})();
