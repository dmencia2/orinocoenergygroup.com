'use strict';
// Keep navigation and action icons independent of emoji fonts on mobile devices.
(()=>{
 const NS='http://www.w3.org/2000/svg';
 function icon(character){const svg=document.createElementNS(NS,'svg');for(const[k,v]of Object.entries({class:'ui-icon arrow-icon',width:'18',height:'18',style:'width:18px;height:18px;max-width:18px;max-height:18px;flex-shrink:0',viewBox:'0 0 24 24','aria-hidden':'true',focusable:'false',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round'}))svg.setAttribute(k,v);const path=document.createElementNS(NS,'path');path.setAttribute('d',character==='↓'?'M12 4v16M5 13l7 7 7-7':'M6 18 18 6M6 6h12v12');svg.append(path);return svg;}
 function normalize(root){if(root.nodeType===3){const parent=root.parentElement;if(!parent||parent.closest('svg,script,style,textarea')||!parent.closest('a,button')||!/[↗↓]/.test(root.nodeValue))return;const fragment=document.createDocumentFragment();for(const part of root.nodeValue.split(/([↗↓])/)){if(part==='↗'||part==='↓')fragment.append(icon(part));else if(part)fragment.append(document.createTextNode(part));}root.replaceWith(fragment);return;}if(root.nodeType!==1||root.matches('svg,script,style,textarea'))return;for(const child of [...root.childNodes])normalize(child);}
 normalize(document.body);
 new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')normalize(record.target);else record.addedNodes.forEach(normalize);}}).observe(document.body,{childList:true,characterData:true,subtree:true});
})();
