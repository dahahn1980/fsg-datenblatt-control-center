import {mergeProducts, normalizeReport} from './report-data.mjs';

const labels={nicht_geprueft:'Nicht geprüft',geprueft:'Geprüft',freigegeben:'Änderung erkannt',pruefung_erforderlich:'Freigabe erforderlich',vorschau_erstellt:'Vorschau erstellt',veroeffentlicht:'Veröffentlicht',fehler:'Fehler'};
const actionLabels={bericht:'Bericht',vorschau:'Vorschau',rendern:'Rendern',upload_wix:'Upload Wix'};
const storageKey='fsg-control-center-imports-v1';
let products=[];
let baseline=[];
let snapshotAt='';
let sourceRun='';
let importedAt='';
const $=id=>document.getElementById(id);
const identity=p=>`${p.productGroup}:${p.productKey}`;
const filters={search:$('search'),group:$('groupFilter'),status:$('statusFilter'),changed:$('changedOnly')};

async function loadInitial(){
  const response=await fetch('data/snapshot.json?at='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw new Error('Der aktuelle Prüfstand konnte nicht geladen werden.');
  const snapshot=await response.json();
  if(!Array.isArray(snapshot.products))throw new Error('Der Prüfstand enthält keine Produktliste.');
  baseline=snapshot.products;
  snapshotAt=snapshot.generatedAt||'';
  sourceRun=snapshot.sourceRun||'';
  importedAt='';
  products=baseline;
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    // A newer central snapshot takes precedence over old browser imports.
    if(saved&&Array.isArray(saved.products)&&Date.parse(saved.importedAt)>Date.parse(snapshotAt)){
      products=mergeProducts(baseline,saved.products);
      importedAt=saved.importedAt;
    }
  } catch { /* Private browsing may block local storage. */ }
  hydrate();render();
}
function hydrate(){products=products.map(p=>({...p,selected:Boolean(p.selected),errors:Array.isArray(p.errors)?p.errors:[]}));fillSelect(filters.group,[...new Set(products.map(p=>p.productGroup))]);fillSelect(filters.status,[...new Set(products.map(p=>p.status))],v=>labels[v]||v);}
function fillSelect(select,values,label=x=>x){const value=select.value;select.innerHTML='<option value="">Alle</option>'+values.sort().map(v=>`<option value="${esc(v)}">${esc(label(v))}</option>`).join('');select.value=value;}
function visible(){const q=filters.search.value.trim().toLowerCase();return products.filter(p=>(!q||`${p.title} ${p.productKey}`.toLowerCase().includes(q))&&(!filters.group.value||p.productGroup===filters.group.value)&&(!filters.status.value||p.status===filters.status.value)&&(!filters.changed.checked||p.changed));}
function selected(){return products.filter(p=>p.selected);}
function render(){const rows=visible();$('productRows').innerHTML=rows.map(row).join('');$('emptyState').hidden=rows.length>0;document.querySelectorAll('[data-select]').forEach(el=>el.addEventListener('change',e=>toggle(e.target.dataset.select,e.target.checked)));document.querySelectorAll('[data-detail]').forEach(el=>el.addEventListener('click',()=>showDetail(el.dataset.detail)));updateSummary(rows);}
function row(p){const check=p.errors.length?`<span class="error">${esc(p.errors.join(', '))}</span>`:'<span class="ok">Vollständig</span>';return `<tr><td><input type="checkbox" data-select="${esc(identity(p))}" ${p.selected?'checked':''} ${p.errors.length?'disabled':''}></td><td><div class="productTitle">${esc(p.title)}</div><div class="productKey">${esc(p.productKey)}</div></td><td>${esc(p.productGroup)}</td><td><span class="badge status-${esc(p.status)}">${esc(labels[p.status]||p.status)}</span></td><td>${p.changed?'<span class="changed">Geändert</span>':'–'}</td><td>${check}</td><td>${esc(p.templateVersion||'–')}</td><td><button data-detail="${esc(identity(p))}">Details</button></td></tr>`;}
function updateSummary(rows){
  const selection=selected();
  const mixedGroups=new Set(selection.map(p=>p.productGroup)).size>1;
  const unknownGroup=selection.some(p=>p.productGroup==='unbekannt');
  $('selectionCount').textContent=selection.length;
  $('selectionHint').textContent=mixedGroups?'Bitte nur Produkte einer Gruppe auswählen.':unknownGroup?'Produktgruppe im Bericht nicht erkennbar.':'';
  document.querySelectorAll('.processAction').forEach(button=>button.disabled=selection.length===0||selection.some(p=>p.errors.length)||selection.length>20||mixedGroups||unknownGroup);
  $('selectAll').checked=rows.length>0&&rows.filter(p=>!p.errors.length).every(p=>p.selected);
  const count=s=>products.filter(p=>p.status===s).length;
  $('stats').innerHTML=stat(products.length,'Produkte')+stat(products.filter(p=>p.changed).length,'Geändert')+stat(count('fehler'),'Fehler')+stat(selection.length,'Ausgewählt');
  const date=snapshotAt?new Date(snapshotAt).toLocaleString('de-DE'):'unbekannt';
  const link=sourceRun?` · GitHub-Lauf ${sourceRun}`:'';
  $('sourceInfo').textContent=`Zentraler Wix-Prüfstand vom ${date}${link}. ${importedAt?'Lokale Berichte ergänzt am '+new Date(importedAt).toLocaleString('de-DE')+'. ':''}Für neuere Wix-Daten einen Prüfbericht hinzufügen oder den zentralen Prüfstand aktualisieren.`;
  $('resetReports').hidden=!importedAt;
}
function stat(n,t){return `<div class="stat"><strong>${n}</strong><span>${t}</span></div>`;}
function toggle(key,on){const p=products.find(x=>identity(x)===key);if(p&&!p.errors.length)p.selected=on;render();}
function showDetail(key){const p=products.find(x=>identity(x)===key);$('detailContent').innerHTML=`<h2>${esc(p.title)}</h2><dl class="detailGrid"><dt>Product Key</dt><dd>${esc(p.productKey)}</dd><dt>Produktgruppe</dt><dd>${esc(p.productGroup)}</dd><dt>Status</dt><dd>${esc(labels[p.status]||p.status)}</dd><dt>Vorlage</dt><dd>${esc(p.templateVersion||'–')}</dd><dt>Source Hash</dt><dd>${esc(p.sourceHash||'–')}</dd><dt>Prüffehler</dt><dd>${p.errors.length?esc(p.errors.join(', ')):'Keine'}</dd><dt>PDF-Vorschau</dt><dd>${p.pdf?esc(p.pdf.split('/').pop()):'Nicht vorhanden'}</dd></dl>`;$('detailDialog').showModal();}
function prepareAction(action){const selection=selected();if(!selection.length||selection.length>20||selection.some(p=>p.errors.length)||new Set(selection.map(p=>p.productGroup)).size!==1||selection[0].productGroup==='unbekannt')return;$('planTitle').textContent=`${actionLabels[action]||action} für ${selection.length} Produkte (${selection[0].productGroup})`;$('productKeys').value=selection.map(p=>p.productKey).join(',');$('planDialog').dataset.action=action;$('planDialog').showModal();}
async function copyKeys(){await navigator.clipboard.writeText($('productKeys').value);$('copyKeys').textContent='Kopiert';setTimeout(()=>$('copyKeys').textContent='Product Keys kopieren',1200);}
async function importReports(files){
  try {
    let merged=products;
    for(const file of files){
      const data=JSON.parse(await file.text());
      merged=mergeProducts(merged,normalizeReport(data));
    }
    if(!merged.length)throw new Error('Die Berichte enthalten keine Produkte.');
    const timestamp=new Date().toISOString();
    localStorage.setItem(storageKey,JSON.stringify({products:merged,importedAt:timestamp}));
    products=merged;importedAt=timestamp;hydrate();render();
  }catch(e){alert(`Berichte konnten nicht hinzugefügt werden: ${e.message}`)}
}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
Object.values(filters).forEach(el=>el.addEventListener(el.type==='checkbox'?'change':'input',render));
$('selectVisible').onclick=()=>{visible().filter(p=>!p.errors.length).slice(0,20).forEach(p=>p.selected=true);render();};
$('clearSelection').onclick=()=>{products.forEach(p=>p.selected=false);render();};
$('selectAll').onchange=e=>{visible().filter(p=>!p.errors.length).slice(0,20).forEach(p=>p.selected=e.target.checked);render();};
document.querySelectorAll('.processAction').forEach(button=>button.onclick=()=>prepareAction(button.dataset.action));
$('copyKeys').onclick=copyKeys;
$('closeDialog').onclick=()=>$('detailDialog').close();
$('closePlan').onclick=()=>$('planDialog').close();
$('reportFile').onchange=e=>{if(e.target.files.length)importReports([...e.target.files]);e.target.value='';};
$('resetReports').onclick=()=>{if(!confirm('Lokal hinzugefügte Berichte löschen und den zentralen Prüfstand anzeigen?'))return;localStorage.removeItem(storageKey);importedAt='';products=baseline;hydrate();render();};
loadInitial();
