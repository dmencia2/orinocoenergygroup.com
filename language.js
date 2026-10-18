'use strict';
(()=>{
 const spanish=document.documentElement.lang==='es',dict=window.OEG_ES||{};
 try{if(!spanish&&localStorage.getItem('oeg-language')==='es'){
  const here=new URL(location.href),folder=here.pathname.slice(0,here.pathname.lastIndexOf('/')+1),page=here.pathname.split('/').pop()||'index.html';
  here.pathname=folder+'es/'+page;location.replace(here.href);return;
 }}catch{}
 function tr(value){
  if(!spanish||!value)return value;
  if(dict[value])return dict[value];
  let m=value.match(/^Through (.+)\. Onward to your project\.$/);if(m)return 'Vía '+m[1]+'. Hasta tu proyecto.';
  m=value.match(/^(.+) · Venezuela project connection$/);if(m)return m[1]+' · Conexión con proyectos en Venezuela';
  m=value.match(/^(\d+) matching places\. Select a place to explore its connection\.$/);if(m)return m[1]+' lugares encontrados. Selecciona uno para explorar su conexión.';
  m=value.match(/^Play video: (.+)$/);if(m)return 'Reproducir video: '+tr(m[1]);
  m=value.match(/^Asian supply chains connect through Pacific and Caribbean hubs\. The mainline, transshipment and destination connection are selected for (.+) and the cargo\.$/);if(m)return 'Las cadenas de suministro de Asia utilizan centros del Pacífico y del Caribe. El servicio y los transbordos se seleccionan según la carga y el puerto de '+m[1]+'.';
  m=value.match(/^North European origins connect through Caribbean hubs\. The destination sailing, customs and inland delivery are coordinated around (.+) and the receiving project\.$/);if(m)return 'Los orígenes del norte de Europa se enlazan a través de centros del Caribe. El servicio marítimo, las aduanas y la entrega se coordinan según '+m[1]+' y el proyecto receptor.';
  m=value.match(/^Mediterranean origins connect through Caribbean hubs\. The destination connection is matched to (.+) and the cargo requirements\.$/);if(m)return 'Los orígenes del Mediterráneo se enlazan a través de centros del Caribe. La conexión se selecciona según '+m[1]+' y los requisitos de la carga.';
  m=value.match(/^Brazilian origins connect with the Caribbean network\. A suitable destination connection links that supply chain with (.+) and the receiving project\.$/);if(m)return 'Los orígenes de Brasil se enlazan con la red del Caribe. Se selecciona la conexión adecuada hacia '+m[1]+' y el proyecto receptor.';
  if(value.includes(' Export view shows'))return value.split(' Export view shows').map((part,i)=>i?tr('Export view shows'+part):tr(part)).join(' ');
  if(value.includes(' · '))return value.split(' · ').map(part=>tr(part)).join(' · ');
  return value;
 }
 window.OEG_T=tr;
 document.querySelectorAll('[data-language]').forEach(link=>{link.addEventListener('click',()=>{try{localStorage.setItem('oeg-language',link.dataset.language);}catch{}});const url=new URL(link.href);url.search=location.search;url.hash=location.hash;link.href=url.href;});
 if(!spanish)return;
 function text(node){const raw=node.nodeValue,trimmed=raw.trim(),translated=tr(trimmed);if(trimmed!==translated)node.nodeValue=raw.replace(trimmed,translated);}
 function translate(root){
  if(root.nodeType===3){if(!root.parentElement?.closest('script,style,textarea'))text(root);return;}
  if(root.nodeType!==1||root.matches('script,style,textarea'))return;
  for(const name of ['aria-label','title','placeholder','alt']){const old=root.getAttribute(name);if(old&&tr(old)!==old)root.setAttribute(name,tr(old));}
  for(const child of root.childNodes)translate(child);
 }
 translate(document.body);
 new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')translate(record.target);else if(record.type==='attributes'){const v=record.target.getAttribute(record.attributeName);if(v&&tr(v)!==v)record.target.setAttribute(record.attributeName,tr(v));}else record.addedNodes.forEach(translate);}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
})();
