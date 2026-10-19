'use strict';
(()=>{
 const es=document.documentElement.lang==='es',cfg=window.OEG_LEGAL||{},key='oeg-privacy-choice-v1',ttl=180*86400000;
 const say=(en,spanish)=>es?spanish:en,id=()=>globalThis.crypto?.randomUUID?.()||('oeg-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
 let memory=null,pending=null,returnFocus=null;
 function choice(){try{const c=JSON.parse(localStorage.getItem(key)||'null');if(c&&c.version===cfg.version&&typeof c.videos==='boolean'&&c.expires>Date.now())return c;}catch{}return memory&&memory.expires>Date.now()?memory:null;}
 const dialog=document.createElement('dialog');dialog.className='privacy-dialog';dialog.setAttribute('aria-labelledby','privacy-choice-title');
 dialog.innerHTML='<h2 id="privacy-choice-title">'+say('Optional videos','Videos opcionales')+'</h2><p>'+say('The site works without video cookies. Allowing YouTube videos connects to Google, which may process device data and use cookies. You can change this choice in the footer.','La web funciona sin cookies de video. Permitir YouTube conecta con Google, que puede tratar datos del dispositivo y usar cookies. Puedes cambiar esta decisión en el pie de página.')+'</p><a href="cookies.html">'+say('Read the cookie policy','Leer la política de cookies')+'</a><div class="privacy-actions"><button type="button" data-choice="no">'+say('Essential only','Solo esenciales')+'</button><button type="button" data-choice="yes">'+say('Allow videos','Permitir videos')+'</button></div>';
 document.body.append(dialog);
 function finish(allowed,remember){if(remember){memory={version:cfg.version,videos:allowed,at:new Date().toISOString(),expires:Date.now()+ttl,id:id()};try{localStorage.setItem(key,JSON.stringify(memory));}catch{}if(!allowed)document.querySelectorAll('.media-frame.is-playing iframe').forEach(frame=>frame.closest('figure')?.querySelector('.media-close')?.click());window.dispatchEvent(new CustomEvent('oeg-video-preference',{detail:{allowed}}));}if(dialog.open)dialog.close();const resolve=pending;pending=null;resolve?.(allowed);returnFocus?.focus();}
 dialog.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>finish(b.dataset.choice==='yes',true)));
 dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false,false);});
 function preferences(){returnFocus=document.activeElement;dialog.showModal();dialog.querySelector('[data-choice="no"]').focus();}
 document.querySelectorAll('[data-cookie-preferences]').forEach(b=>b.addEventListener('click',preferences));
 async function permitVideo(){if(choice()?.videos===true)return true;return new Promise(resolve=>{pending=resolve;preferences();});}
 function record(form,channel){if(!form?.elements.terms_acceptance?.checked||!form.elements.privacy_acceptance.checked)return '';
  const set=(name,value)=>{if(form.elements[name])form.elements[name].value=value;};
  if(!form.elements.enquiry_id.value)set('enquiry_id',id());
  set('enquiry_prepared_at_utc_browser',new Date().toISOString());set('legal_version',cfg.version);set('interface_language',es?'es':'en');set('submission_channel',channel);set('acceptance_method','Two separate required, initially unchecked checkboxes; no marketing consent');
  const base=new URL(es?'../':'./',location.href);set('terms_document',new URL((es?'es/':'')+'terms.html',base).href);set('privacy_document',new URL((es?'es/':'')+'privacy.html',base).href);set('legal_archive',new URL(cfg.archive,base).href);set('legal_manifest_sha256',cfg.manifestSHA256);
  set('terms_statement',say('I accept the Terms and conditions.','Acepto los Términos y condiciones.'));set('privacy_statement',say('Use my data to reply, under the Privacy policy.','Autorizo responder mi consulta conforme a la Política de privacidad.'));
  return '\n\n'+say('Acceptance record (browser-reported times)','Registro de aceptación (horas declaradas por el navegador)')+'\n'+['enquiry_id','terms_acceptance','terms_accepted_at_utc_browser','privacy_acceptance','privacy_accepted_at_utc_browser','enquiry_prepared_at_utc_browser','legal_version','interface_language','submission_channel','terms_document','privacy_document','legal_archive','legal_manifest_sha256','acceptance_method','terms_statement','privacy_statement'].map(n=>n+': '+form.elements[n].value).join('\n');
 }
 document.querySelectorAll('form').forEach(form=>{for(const kind of ['terms','privacy']){const cb=form.elements[kind+'_acceptance'];if(!cb)continue;cb.autocomplete='off';cb.addEventListener('invalid',()=>cb.setCustomValidity(cb.checked?'':say('Please make this separate choice before sending.','Marca esta casilla por separado antes de enviar.')));cb.addEventListener('change',()=>cb.setCustomValidity(''));cb.addEventListener('change',()=>{form.elements[kind+'_accepted_at_utc_browser'].value=cb.checked?new Date().toISOString():'';});}
  form.addEventListener('submit',()=>record(form,'website_formsubmit'),{capture:true});
 });
 window.OEGPrivacy={permitVideo,preferences,record,videoAllowed:()=>choice()?.videos===true};
 // This local enquiry builder only opens the contact form; it sends no data to a provider.
 document.querySelectorAll('[data-rfq-builder]').forEach(builder=>{function open(){const inputs=[...builder.querySelectorAll('input,select')];if(inputs.some(i=>!i.reportValidity()))return;const query=new URLSearchParams(inputs.filter(i=>i.name).map(i=>[i.name,i.value]));location.href=builder.dataset.rfqBuilder+'?'+query;}
 builder.querySelector('button')?.addEventListener('click',open);builder.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();open();}});});
 // Continuous logo row; pause, keyboard focus, reduced motion and offscreen state are respected.
 document.querySelectorAll('.alliance-strip .logo-strip').forEach(strip=>{
  const cells=[...strip.children];if(!cells.length)return;strip.classList.add('logo-carousel');strip.removeAttribute('tabindex');
  const track=document.createElement('div');track.className='logo-track';const first=document.createElement('div');first.className='logo-set';cells.forEach(c=>first.append(c));const second=first.cloneNode(true);second.setAttribute('aria-hidden','true');second.querySelectorAll('img').forEach(i=>i.alt='');track.append(first,second);strip.append(track);
  const pause=document.createElement('button');pause.type='button';pause.className='carousel-pause';pause.setAttribute('aria-pressed','false');pause.textContent=say('Pause','Pausar');strip.append(pause);let paused=false;
  pause.addEventListener('click',()=>{paused=!paused;strip.classList.toggle('manually-paused',paused);pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?say('Resume','Continuar'):say('Pause','Pausar');});
  function measure(){const gap=parseFloat(getComputedStyle(first).gap)||30;strip.style.setProperty('--logo-cell-width',(innerWidth<=720?140:Math.max(130,(strip.clientWidth-gap*4)/5))+'px');strip.style.setProperty('--logo-distance',(first.getBoundingClientRect().width+gap)+'px');}
  measure();new ResizeObserver(measure).observe(strip);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>strip.classList.toggle('in-view',entries[0].isIntersecting)).observe(strip);else strip.classList.add('in-view');
 });
})();
