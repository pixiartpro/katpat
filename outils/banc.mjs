// Banc de test Kat'Pat' — Chrome sans écran piloté par le protocole DevTools (aucune dépendance).
// Lancer : python3 -m http.server 8791 --bind 127.0.0.1 (dans le dossier du projet), puis node outils/banc.mjs http://127.0.0.1:8791/ "$PWD"
// Usage : node banc.mjs <url_base>   (ex. http://127.0.0.1:8791/)
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";

const BASE = process.argv[2] || "http://127.0.0.1:8791/";
const ROOT = process.argv[3];
const res = [];
const ok = (nom, cond, detail = "") => { res.push({ nom, ok: !!cond, detail }); };

// ---------- 0. QR imprimés (garde-fou repris de Pixie Mariage, 08/11/2026) ----------
// Le papier ne se corrige pas : chaque QR imprimé doit toujours mener à une vraie page.
// Un nouveau document imprimé avec un QR = une ligne de plus ici, AVANT l'impression.
// Le jour où un domaine est branché, vérifier aussi que l'ancienne adresse redirige vers la nouvelle.
const IMPRIMES = [
  { url: "https://pixiartpro.github.io/katpat/app.html", page: "app.html", document: "plaquette pour les assos (brouillon du 08/11/2026, QR du recto-verso)" },
  { url: "https://pixiartpro.github.io/katpat/app.html", page: "app.html", document: "cartes QR pour les adoptants (kit démo refuge, brouillon du 08/11/2026)" },
];
for (const { url, page, document } of IMPRIMES) {
  let present = false; try { readFileSync(join(ROOT, page)); present = true; } catch {}
  ok(`QR imprimé « ${document} » : ${page} existe toujours`, present, url);
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/.test(BASE) || BASE === url.slice(0, url.lastIndexOf("/") + 1)) {
    const r = await fetch(BASE + page).then(x => x.status).catch(e => String(e));
    ok(`QR imprimé « ${document} » : ${BASE + page} répond`, r === 200, r);
  }
}

// ---------- 1. Données (sans navigateur) ----------
{
  const src = readFileSync(join(ROOT, "data/donnees.js"), "utf8");
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
  const KP = ctx.window.KP;
  const com = Object.keys(KP.communes);
  ok("24 communes", com.length === 24, com.length);
  const orph = com.filter(c => !KP.intercos[KP.communes[c]]);
  ok("chaque commune a son interco", !orph.length, orph.join(","));
  for (const [k, i] of Object.entries(KP.intercos)) {
    ok(`interco ${k} complète`, i.de && i.nom && i.tels?.length && (!i.libs || i.libs.length === i.tels.length) && /@/.test(i.mail) && /^https:\/\//.test(i.site), JSON.stringify(i));
    ok(`interco ${k} numéros au bon format`, i.tels.every(t => /^(0800 \d{3} \d{3}|0262 \d{2} \d{2} \d{2})$/.test(t)), i.tels.join(" | "));
    ok(`interco ${k} a au moins une commune`, com.some(c => KP.communes[c] === k));
  }
  const ids = KP.fiches.map(f => f.id);
  ok("8 fiches", KP.fiches.length === 8, KP.fiches.length);
  ok("identifiants de fiches uniques", new Set(ids).size === ids.length);
  for (const f of KP.fiches) {
    ok(`fiche ${f.id} complète`, f.titre && f.resume && f.pour && f.savoir?.length && f.faire?.length && (f.signes?.length || ['cyclone','puce'].includes(f.id)), "");
    const txt = JSON.stringify(f).toLowerCase();
    ok(`fiche ${f.id} sans dose ni médicament nommé`, !/\b\d+\s?(mg|ml|g\/kg|mg\/kg|comprim)/.test(txt), "");
    ok(`fiche ${f.id} renvoie vers le véto`, f.id==='cyclone' || /v[ée]t[ée]rinaire|v[ée]to/.test(txt), "");
    ok(`fiche ${f.id} a des sources`, (f.sources || []).length > 0, "sources vides");
  }
  // Garde-fou (09/11/2026) : la mention « relue par un vétérinaire » ne vaut que pour les fiches telles qu'il les a relues.
  const empreinte = createHash("sha256").update(JSON.stringify(KP.fiches)).digest("hex");
  ok(`santé : empreinte des fiches = ${empreinte}`, true);
  ok("santé : mention « relue » seulement si les fiches n'ont pas changé depuis la relecture",
     !KP.relectureVeto || KP.relectureVetoEmpreinte === empreinte,
     KP.relectureVeto ? "les fiches ont changé depuis la relecture : vider relectureVeto ou faire relire" : "");
  ok("7 assos (APPAR retirée)", KP.assos.length === 7, KP.assos.length);
  for (const a of KP.assos) ok(`asso ${a.nom} a un lien`, !!a.lien, a.lien || "aucun");
  globalThis.__KP = KP;
}

// ---------- 2. Calcul des rappels (fonction copiée de app.html) ----------
{
  const app = readFileSync(join(ROOT, "app.html"), "utf8");
  const m = app.match(/function ajouterMois\(iso, m\)\{[^\n]*\}/);
  ok("fonction ajouterMois trouvée", !!m);
  const ajouterMois = new Function("return " + m[0])();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const cas = [["2026-01-31", 1, "2026-02-28"], ["2028-01-31", 1, "2028-02-29"], ["2026-03-31", 1, "2026-04-30"],
    ["2026-11-06", 12, "2027-11-06"], ["2026-08-31", 3, "2026-11-30"], ["2026-12-15", 1, "2027-01-15"], ["2026-02-28", 12, "2027-02-28"], ["2028-02-29", 12, "2029-02-28"]];
  for (const [d, n, att] of cas) { const r = iso(ajouterMois(d, n)); ok(`rappel ${d} + ${n} mois = ${att}`, r === att, r); }
}

// ---------- 3. Navigateur ----------
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const prof = mkdtempSync(join(tmpdir(), "kp-chrome-"));
const port = 9333 + Math.floor(Math.random() * 300);
const ch = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "--no-first-run", "--no-default-browser-check", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ver; for (let i = 0; i < 50; i++) { try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); break; } catch { await sleep(200); } }
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let nid = 0; const wait = new Map(); const erreurs = []; const urlsDemandees = new Map();
const reseau = [];
ws.addEventListener("message", e => {
  const m = JSON.parse(e.data);
  if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") erreurs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") erreurs.push(m.params.args.map(a => a.value || a.description).join(" "));
  if (m.method === "Log.entryAdded" && (m.params.entry.source === "security" || /Content Security Policy/i.test(m.params.entry.text))) erreurs.push("CSP : " + m.params.entry.text);
  if (m.method === "Network.responseReceived") reseau.push({ url: m.params.response.url, status: m.params.response.status });
  if (m.method === "Network.requestWillBeSent") urlsDemandees.set(m.params.requestId, m.params.request.url);
  if (m.method === "Network.loadingFailed" && !m.params.canceled) reseau.push({ url: urlsDemandees.get(m.params.requestId) || m.params.requestId, status: "ÉCHEC " + m.params.errorText });
});
const cdp = (method, params = {}) => new Promise(r => { const id = ++nid; wait.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expr) => { const r = await cdp("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || "eval"); return r.result?.result?.value; };
const aller = async (url) => { await cdp("Page.navigate", { url }); await sleep(1200); };
await cdp("Runtime.enable"); await cdp("Page.enable"); await cdp("Network.enable"); await cdp("Log.enable");

for (const page of ["index.html", "app.html", "mentions.html"]) {
  erreurs.length = 0; reseau.length = 0;
  await aller(BASE + page);
  ok(`${page} : aucune erreur JS`, erreurs.length === 0, erreurs.join(" | "));
  const ko = reseau.filter(r => typeof r.status !== "number" || r.status >= 400);
  ok(`${page} : toutes les ressources chargées`, ko.length === 0, JSON.stringify(ko));
  // Règle de sécurité (14/11/2026) : présente, et elle bloque bien un script venu d'ailleurs.
  const csp = await ev(`(document.querySelector('meta[http-equiv="Content-Security-Policy"]')||{}).content||""`);
  ok(`${page} : règle de sécurité présente (default-src 'self', object-src 'none', base-uri 'none')`, /default-src 'self'/.test(csp) && /object-src 'none'/.test(csp) && /base-uri 'none'/.test(csp), csp);
  const bloque = await ev(`new Promise(r=>{let v=false;document.addEventListener('securitypolicyviolation',e=>{if(/exemple\.invalid/.test(e.blockedURI))v=true},{once:false});const s=document.createElement('script');s.src='https://exemple.invalid/x.js';document.head.appendChild(s);setTimeout(()=>{s.remove();r(v)},400)})`);
  ok(`${page} : un script venu d'un autre site est bloqué`, bloque === true, String(bloque));
  erreurs.splice(0, erreurs.length, ...erreurs.filter(e => !/exemple\.invalid/.test(e)));
  const imgs = await ev(`[...document.images].filter(i=>i.complete && i.naturalWidth===0 && i.loading!=='lazy').map(i=>i.src)`);
  ok(`${page} : images non cassées`, imgs.length === 0, imgs.join(","));
  if (page === "index.html") {
    const t = await ev(`document.body.textContent`);
    ok("vitrine : plus de pastille « Nouveau »", !t.includes("Nouveau :"));
    ok("vitrine : statut « Démo · relecture vétérinaire à venir » affiché", t.includes("Démo · relecture vétérinaire à venir"));
    ok("vitrine : plus de promesse de pros (toiletteurs, pensions)", !/toiletteurs|pensions/.test(t));
  }
  {
    const fav = await ev(`Promise.all([...document.querySelectorAll('link[rel=icon]')].map(l=>fetch(l.href).then(r=>r.ok&&!l.href.startsWith('data:')))).then(a=>a.length>=2&&a.every(Boolean))`);
    ok(`${page} : favicon patte (SVG + PNG 32) chargé`, fav);
  }
}

// App : vues
await cdp("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await aller(BASE + "app.html");
await ev(`localStorage.clear()`); await aller(BASE + "app.html");
const porte = await ev(`(()=>{const d=document.querySelector('#v-accueil .doors').getBoundingClientRect(),i=document.querySelector('#v-accueil .hero-app img').getBoundingClientRect();return {d:Math.round(d.top),i:Math.round(i.top)}})()`);
ok("accueil téléphone : les portes passent avant la photo", porte.d < porte.i, JSON.stringify(porte));
for (const v of ["accueil", "sante", "perdu", "contacts", "assos", "carnet"]) {
  await ev(`location.hash='#${v}'`); await sleep(250);
  const vis = await ev(`[...document.querySelectorAll('.view')].filter(s=>!s.hidden).map(s=>s.id)`);
  ok(`vue #${v} seule visible`, vis.length === 1 && vis[0] === "v-" + v, vis.join(","));
  const deb = await ev(`document.documentElement.scrollWidth - innerWidth`);
  ok(`vue #${v} : pas de défilement horizontal à 375 px`, deb <= 0, deb + " px");
  const pet = await ev(`[...document.querySelectorAll('#v-${v} a, #v-${v} button, #v-${v} summary, #v-${v} select, #v-${v} input, nav a')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return {t:(e.textContent||e.id||e.tagName).trim().slice(0,30),h:Math.round(r.height),w:Math.round(r.width),inline:getComputedStyle(e).display==='inline'}}).filter(x=>!x.inline && (x.h<44))`);
  ok(`vue #${v} : zones tactiles ≥ 44 px`, pet.length === 0, JSON.stringify(pet).slice(0, 400));
  const petitTexte = await ev(`[...document.querySelectorAll('#v-${v} *')].filter(e=>e.offsetParent && e.childNodes.length && [...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).map(e=>({t:e.textContent.trim().slice(0,25),fs:parseFloat(getComputedStyle(e).fontSize),up:getComputedStyle(e).textTransform==='uppercase'})).filter(x=>x.fs<13.5 && !x.up)`);
  ok(`vue #${v} : texte ≥ 13,5 px`, petitTexte.length === 0, JSON.stringify(petitTexte).slice(0, 300));
}
// Santé : filtres
await ev(`location.hash='#sante'`); await sleep(200);
const filtres = await ev(`(()=>{const o={};document.querySelectorAll('.chip').forEach(b=>{b.click();o[b.dataset.f]=document.querySelectorAll('#fiches details').length});return o})()`);
const KP = globalThis.__KP;
ok("filtre tout = 8", filtres.tout === 8, JSON.stringify(filtres));
ok("filtre urgence cohérent", filtres.urgence === KP.fiches.filter(f => f.urgence).length, JSON.stringify(filtres));
ok("filtre chat cohérent", filtres.chat === KP.fiches.filter(f => /chat/.test(f.pour)).length, JSON.stringify(filtres));
ok("filtre chien cohérent", filtres.chien === KP.fiches.filter(f => /chien/.test(f.pour)).length, JSON.stringify(filtres));
ok("au moins une fiche par filtre", Object.values(filtres).every(n => n > 0), JSON.stringify(filtres));
// Perdu : 24 communes
await ev(`location.hash='#perdu'`); await sleep(200);
const coms = await ev(`(()=>{const s=document.querySelector('#commune');const out=[];[...s.options].slice(1).forEach(o=>{s.value=o.value;s.dispatchEvent(new Event('change'));const c=document.querySelector('#contact');out.push({c:o.value,tels:c.querySelectorAll('a.tel-a').length,fmt:[...c.querySelectorAll('a.tel-a')].every(a=>/^tel:\\d{2,10}$/.test(a.getAttribute('href'))),txt:c.textContent.slice(0,60)})});return out})()`);
ok("24 communes dans la liste", coms.length === 24, coms.length);
ok("chaque commune affiche un numéro", coms.every(c => c.tels > 0), JSON.stringify(coms.filter(c => !c.tels)));
ok("Perdu : numéros de la commune cliquables (tel:)", coms.every(c => c.fmt), JSON.stringify(coms.filter(c => !c.fmt)));
const ordre = await ev(`(()=>{const a=document.querySelector('.commune-card'),b=document.querySelector('#steps-card');return !!(a&&b&&(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING))})()`);
ok("Perdu : la commune passe avant les étapes", ordre);
ok("Perdu : plus de « à côté » dans les étapes", !(await ev(`document.querySelector('#steps-card').textContent.includes('à côté')`)));
const stDenis = await ev(`(()=>{const s=document.querySelector('#commune');s.value='Saint-Denis';s.dispatchEvent(new Event('change'));return document.querySelector('#contact').textContent})()`);
ok("Perdu : CINOR signalée « pas encore confirmée »", stDenis.includes("pas encore confirmés"), stDenis.slice(0, 120));
ok("« dépend du TCO » au masculin", coms.find(c => c.c === "Saint-Paul")?.txt.includes("dépend du TCO"), coms.find(c => c.c === "Saint-Paul")?.txt);
// mémoire de la commune
await ev(`(()=>{const s=document.querySelector('#commune');s.value='Cilaos';s.dispatchEvent(new Event('change'))})()`);
await aller(BASE + "app.html#perdu");
ok("commune retenue après rechargement", (await ev(`document.querySelector('#commune').value`)) === "Cilaos");
// Contacts utiles
await ev(`location.hash='#contacts'`); await sleep(250);
const ct = await ev(`({n:document.querySelectorAll('#themes .theme').length, com:document.querySelector('#c-commune').value, civis:document.querySelector('#th-perdu').textContent.includes('CIVIS'), tels:[...document.querySelectorAll('#themes a.tel-a')].map(a=>a.getAttribute('href')), ext:[...document.querySelectorAll('#themes a[target=_blank]')].every(a=>a.rel.includes('noopener')&&a.href.startsWith('https://'))})`);
ok("contacts : 8 thèmes", ct.n === 8 && KP.contacts.length === 8, ct.n);
ok("contacts : commune reprise (Cilaos)", ct.com === "Cilaos", ct.com);
ok("contacts : Cilaos ⇒ CIVIS affichée", ct.civis);
ok("contacts : numéros cliquables au bon format", ct.tels.length >= 10 && ct.tels.every(h => /^tel:\d{2,10}$/.test(h)), JSON.stringify(ct.tels));
ok("contacts : liens externes en https + noopener", ct.ext);
await ev(`(()=>{const s=document.querySelector('#c-commune');s.value='Saint-Denis';s.dispatchEvent(new Event('change'))})()`);
ok("contacts : changer de commune ⇒ CINOR + même commune dans Perdu", (await ev(`document.querySelector('#th-perdu').textContent.includes('CINOR') && document.querySelector('#commune').value==='Saint-Denis'`)));
await ev(`(()=>{const s=document.querySelector('#c-commune');s.value='Cilaos';s.dispatchEvent(new Event('change'))})()`); await ev(`location.hash='#perdu'`); await sleep(200);
for (const t of KP.contacts) for (const x of t.items) ok(`contact « ${x.nom} » : un moyen de joindre ou une consigne`, !!(x.tels || x.site || x.mail || t.dyn), t.id);
// annonce
const ann = await ev(`(()=>{const set=(s,v)=>{const e=document.querySelector(s);e.value=v;e.dispatchEvent(new Event('input'))};set('#a-nom','Tiboy');set('#a-desc','mâle, roux');set('#a-lieu','La Saline');set('#a-date','2026-11-06');set('#a-tel','0692 00 00 00');const p=document.querySelector('#annonce').textContent;document.querySelector('#t-trouve').click();const t=document.querySelector('#annonce').textContent;document.querySelector('#t-adopter').click();const h=document.querySelector('#annonce-card').hidden;return {p,t,h}})()`);
ok("annonce perdu : titre + commune", ann.p.startsWith("🆘 CHIEN PERDU · Cilaos"), ann.p.split("\n")[0]);
ok("annonce perdu : date avec jour juste (vendredi 6 novembre 2026)", ann.p.includes("vendredi 6 novembre 2026"), ann.p);
ok("annonce perdu : nom, description, numéro", ann.p.includes("Tiboy, chien perdu") && ann.p.includes("Mâle, roux.") && ann.p.includes("📞 0692 00 00 00"), ann.p);
ok("annonce trouvé : bascule", ann.t.startsWith("🐾 CHIEN TROUVÉ"), ann.t.split("\n")[0]);
ok("annonce trouvé : ne divulgue pas le nom saisi", !ann.t.includes("Tiboy"), ann.t);
ok("adopter : carte annonce masquée", ann.h === true);
ok("adopter : la grille passe en une colonne", await ev(`document.querySelector('#perdu-panel').classList.contains('solo') && document.querySelector('#annonce-col').hidden`));
await ev(`document.querySelector('#t-perdu').click()`);
// injection
const inj = await ev(`(()=>{document.querySelector('#t-perdu').click();const e=document.querySelector('#a-desc');e.value='<img src=x onerror=window.__pwn=1>';e.dispatchEvent(new Event('input'));return {html:document.querySelector('#annonce').innerHTML.includes('<img'),pwn:!!window.__pwn}})()`);
await sleep(300);
ok("annonce : pas d'injection HTML", !inj.html && !(await ev(`!!window.__pwn`)), JSON.stringify(inj));
// Promesses tenues et statuts honnêtes
ok("accueil appli : plus de « 3 gestes »", !(await ev(`document.body.textContent.includes('3 gestes')`)));
ok("contacts : plus de « Contacts vérifiés »", !(await ev(`document.querySelector('#v-contacts').textContent.includes('Contacts vérifiés')`)));
ok("contacts : antipoison et CINOR à confirmer, dit en clair", await ev(`document.querySelector('#v-contacts').textContent.includes("n'ont pas encore été confirmés par un appel")`));
await ev(`location.hash='#sante'`); await sleep(200);
const stat = await ev(`({b:document.querySelector('#statut-fiches').textContent, t:document.querySelectorAll('#fiches details').length, n:[...document.querySelectorAll('#fiches details')].filter(d=>d.textContent.includes('pas encore relue par un vétérinaire')).length})`);
ok("santé : bandeau « en attente de relecture » tant que relectureVeto est vide", KP.relectureVeto ? stat.b.includes("relues par un vétérinaire") : stat.b.includes("en attente de relecture"), stat.b.slice(0, 80));
ok("santé : chaque fiche dit qu'elle n'est pas encore relue", KP.relectureVeto ? true : (stat.t > 0 && stat.n === stat.t), stat.n + '/' + stat.t);
ok("santé : réserve « pas encore confirmés » près des numéros antipoison", !KP.antipoisonNote || (await ev(`document.querySelector('#antipoison').textContent.includes('pas encore confirmés')`)));
// Carnet
await ev(`location.hash='#carnet'`); await sleep(200);
ok("carnet vide : pas de carte « Garder une copie »", await ev(`document.querySelector('#copie-card').hidden`));
ok("bouton caché = vraiment invisible (attribut hidden respecté)", await ev(`[...document.querySelectorAll('[hidden]')].every(e=>getComputedStyle(e).display==='none')`));
ok("carnet vide au départ", await ev(`!!document.querySelector('#animaux .empty')`));
const today = new Date(); const isoJ = d => d.toISOString().slice(0, 10);
const ilya = n => { const d = new Date(); d.setDate(d.getDate() - n); return isoJ(d); };
await ev(`(()=>{const set=(s,v)=>{document.querySelector(s).value=v};set('#c-nom','Moka');set('#c-puce','250269812345678');set('#c-vaccin','${ilya(400)}');set('#c-tiques','${ilya(20)}');set('#c-verm','${ilya(5)}');document.querySelector('#c-save').click()})()`);
await sleep(200);
let etats = await ev(`[...document.querySelectorAll('#animaux .etat')].map(e=>e.textContent)`);
ok("carnet : vaccin d'il y a 400 j = en retard", etats[0] === "en retard", etats.join(","));
ok("carnet : anti-tiques mensuel d'il y a 20 j = bientôt", /^dans \d+ j$/.test(etats[1]), etats.join(","));
ok("carnet : vermifuge d'il y a 5 j = à jour", etats[2] === "à jour", etats.join(","));
const cop = await ev(`(()=>{document.querySelector('#copie-cop').click();return {vis:!document.querySelector('#copie-card').hidden, t:document.querySelector('#copie-txt').textContent}})()`);
ok("carnet : carte « Garder une copie » visible", cop.vis);
ok("carnet : la copie contient nom, puce, dernières et prochaines dates", cop.t.includes("Moka (chien)") && cop.t.includes("Puce : 250269812345678") && (cop.t.match(/Prochain \(calculé\)/g)||[]).length === 3 && cop.t.includes("dernier le"), cop.t);
ok("carnet : la copie n'affirme jamais « sauvegardé »", !/sauvegard/i.test(cop.t));
await aller(BASE + "app.html#carnet");
ok("carnet : Moka toujours là après rechargement", (await ev(`document.querySelector('#animaux h3')?.textContent||''`)).includes("Moka"));
// modifier
await ev(`document.querySelector('[data-ed="0"]').click()`); await sleep(100);
ok("carnet : formulaire prérempli en modification", (await ev(`document.querySelector('#c-nom').value`)) === "Moka");
await ev(`(()=>{document.querySelector('#c-nom').value='Moka 2';document.querySelector('#c-save').click()})()`); await sleep(100);
ok("carnet : modification enregistrée sans doublon", (await ev(`[...document.querySelectorAll('#animaux h3')].map(h=>h.textContent).join('|')`)) === "🐕 Moka 2");
// champ mois vidé
await ev(`document.querySelector('[data-ed="0"]').click()`); await sleep(100);
await ev(`(()=>{document.querySelector('#c-tiques-m').value='';document.querySelector('#c-save').click()})()`); await sleep(100);
const rapTiques = await ev(`document.querySelectorAll('#animaux .rap')[1].textContent`);
ok("carnet : fréquence anti-tiques vidée ⇒ refusée ou mensuelle (pas 12 mois)", !/en retard|à jour/.test(rapTiques) || (await ev(`JSON.parse(localStorage.kp_carnet)[0].tiquesM`)) !== "", rapTiques);
// retirer : double appui
await ev(`document.querySelector('[data-del="0"]').click()`); await sleep(50);
ok("carnet : premier appui demande confirmation", (await ev(`document.querySelectorAll('#animaux article').length`)) === 1);
await ev(`document.querySelector('[data-del="0"]').click()`); await sleep(50);
ok("carnet : second appui retire", (await ev(`!!document.querySelector('#animaux .empty')`)));
// localStorage bloqué
await aller(BASE + "app.html#carnet");
await ev(`(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('bloqué')}});})()`);
erreurs.length = 0;
await ev(`(()=>{document.querySelector('#c-nom').value='Test';document.querySelector('#c-save').click()})()`); await sleep(200);
ok("carnet : stockage bloqué ⇒ message, pas de plantage", erreurs.length === 0 && (await ev(`document.querySelector('#toast').textContent`)).includes("bloque"), erreurs.join("|") + " / " + (await ev(`document.querySelector('#toast').textContent`)));

// Hors réseau (service worker)
await cdp("Emulation.clearDeviceMetricsOverride");
await aller(BASE + "app.html"); await sleep(2500);
const sw = await ev(`navigator.serviceWorker.getRegistration().then(r=>!!(r&&r.active))`);
ok("service worker actif", sw);
const cache = await ev(`caches.keys().then(async k=>{const c=await caches.open(k[0]);return {k,n:(await c.keys()).length}})`);
ok("copie hors réseau remplie", cache?.n >= 8, JSON.stringify(cache));
await cdp("Network.emulateNetworkConditions", { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
erreurs.length = 0;
await aller(BASE + "app.html#sante"); await sleep(800);
ok("hors réseau : l'appli s'ouvre avec ses fiches", (await ev(`document.querySelectorAll('#fiches details').length`)) === 8);
await aller(BASE + "mentions.html"); await sleep(500);
ok("hors réseau : mentions légales disponibles", (await ev(`document.title`)).includes("mentions"));
await aller(BASE + "index.html"); await sleep(500);
ok("hors réseau : accueil disponible", (await ev(`document.title`)).length > 0, await ev(`document.title`));
await cdp("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });

ws.close(); ch.kill();
const ko = res.filter(r => !r.ok);
for (const r of res) console.log((r.ok ? "✅ " : "❌ ") + r.nom + (r.ok ? "" : "  → " + r.detail));
console.log(`\n${res.length - ko.length}/${res.length} réussis`);
