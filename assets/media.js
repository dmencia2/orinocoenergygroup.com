'use strict';
// Load an approved video only after the visitor explicitly presses play.
(()=>{const videos=window.OEG_VIDEOS||{},localFile=location.protocol==='file:';document.querySelectorAll('[data-media-slot]').forEach(figure=>{
 const item=videos[figure.dataset.mediaSlot];if(!item)return;
 let youtubeId=null,mp4=null;
 if(item.youtube){try{const u=new URL(item.youtube);if(u.protocol!=='https:')return;if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(u.hostname))youtubeId=u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).at(-1);else if(u.hostname==='youtu.be')youtubeId=u.pathname.slice(1);if(!/^[\w-]{11}$/.test(youtubeId||''))return;}catch{return;}}
 else if(typeof item.mp4==='string'&&/^assets\/videos\/[\w./-]+\.mp4$/i.test(item.mp4)&&!item.mp4.includes('..'))mp4=item.mp4;else return;
 const poster=figure.querySelector('img');if(!poster)return;const visual=poster.closest('picture')||poster;const title=item.title||'Orinoco Energy Group operation';const frame=document.createElement('div');frame.className='media-frame';visual.before(frame);frame.append(visual);const play=document.createElement('button');play.type='button';play.className='media-play';play.setAttribute('aria-label','Play video: '+title);play.innerHTML='<span aria-hidden="true">▶</span><b>Watch the operation</b>';frame.append(play);
 let caption=figure.querySelector('figcaption');if(!caption){caption=document.createElement('figcaption');figure.append(caption);}if(item.caption)caption.textContent=item.caption;
 play.addEventListener('click',()=>{
  if(youtubeId&&localFile){let note=caption.querySelector('.media-local-note');if(!note){note=document.createElement('span');note.className='media-local-note';note.setAttribute('role','status');caption.append(note);}note.textContent='Open the web preview to play this video inside the page. Playback is unavailable when this HTML file is opened directly.';return;}
  const active=document.createElement(youtubeId?'iframe':'video');active.className='operation-player';
  if(youtubeId){active.src='https://www.youtube-nocookie.com/embed/'+youtubeId+'?autoplay=1&playsinline=1&origin='+encodeURIComponent(location.origin);active.title=title;active.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';active.allowFullscreen=true;active.referrerPolicy='strict-origin-when-cross-origin';}
  else{active.controls=true;active.playsInline=true;active.preload='none';active.src=mp4;active.setAttribute('aria-label',title);}
  visual.hidden=true;play.hidden=true;frame.classList.add('is-playing');frame.append(active);const close=document.createElement('button');close.type='button';close.className='media-close';close.textContent='Close video ×';caption.append(close);close.addEventListener('click',()=>{if(!youtubeId)active.pause();active.remove();frame.classList.remove('is-playing');visual.hidden=false;play.hidden=false;close.remove();play.focus();});
  if(!youtubeId)active.play().catch(()=>{});close.focus();
 });
});})();
