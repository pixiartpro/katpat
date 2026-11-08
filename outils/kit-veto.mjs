// Kit de relecture vétérinaire : fabrique le PDF des fiches santé à partir de data/donnees.js.
// Lancer depuis le dossier du projet : node outils/kit-veto.mjs <dossier_de_sortie>
// Le PDF reprend toujours les fiches telles qu'elles sont dans l'appli, plus les questions précises au véto.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import vm from "node:vm";

const ROOT = resolve(".");
const OUT = resolve(process.argv[2] || ".");
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(readFileSync(join(ROOT, "data/donnees.js"), "utf8"), ctx);
const KP = ctx.window.KP;
const [j, m, a] = KP.maj.split("/");
const iso = `${a}-${m}-${j}`;
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Questions précises : ce que la recherche du 06/11/2026 n'a pas pu trancher seule.
const QUESTIONS = [
  ["Crapaud", "Le chat est-il aussi exposé au venin du crapaud guttural ? Faut-il écrire « chien surtout » ou « chien et chat » ?"],
  ["Crapaud", "Le geste « rincer la gueule à l'eau claire, de l'arrière vers l'avant, sans faire avaler » est-il celui que vous conseillez ?"],
  ["Coup de chaleur", "Nous suivons la consigne « refroidir d'abord, transporter ensuite » (eau du robinet + courant d'air, pas de serviette mouillée). Est-ce adapté à notre climat ?"],
  ["Poison", "Combien de temps après avoir avalé un raticide les saignements peuvent-ils apparaître ? Nous écrivons seulement « plusieurs jours après »."],
  ["Poison", "Quels empoisonnements voyez-vous le plus souvent à La Réunion (raticides, produits agricoles, plantes, antipuces pour chien chez le chat) ?"],
  ["Leptospirose", "Le rappel du vaccin du chien est-il bien annuel ? Le chat est-il concerné en pratique ?"],
  ["Tiques", "Faut-il conseiller de traiter aussi la niche et le couchage (tique brune du chien) ?"],
  ["Ver du cœur", "Une étude à La Réunion l'a trouvé chez plusieurs chiens testés sur 100. Conseillez-vous un dépistage systématique ou au cas par cas ?"],
  ["Antipoison", "Orientez-vous vos clients vers le CNITV ou le CAPAE-Ouest, malgré le décalage horaire (ouverts de 11 h 30 à 3 h du matin, heure de La Réunion) ? Y a-t-il une garde vétérinaire à citer à la place ?"],
];

const fiche = (f, i) => {
  const bl = (t, l, cls = "") => l?.length ? `<h4 class="${cls}">${t}</h4><ul>${l.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  const src = (f.sources || []).length ? f.sources.map(s => `${esc(s.nom)} (${esc(s.url)})`).join(" · ") : "aucune source citée";
  return `<section class="fiche"><p class="num">Fiche ${i + 1}/${KP.fiches.length}</p><h2>${esc(f.titre)}</h2>
  <p class="pour">${esc(f.pour)}${f.urgence ? " · urgence" : ""}</p><p class="res">${esc(f.resume)}</p>
  ${bl("Ce qu'il faut savoir", f.savoir)}${bl("Les signes qui doivent alerter", f.signes)}${bl("Ce que le propriétaire peut faire tout de suite", f.faire, "faire")}${bl("À éviter", f.eviter)}
  <p class="src">Sources citées : ${src}</p>
  <div class="avis"><p><b>☐ Juste, à garder</b><b>☐ À corriger</b><b>☐ À retirer</b></p><p class="rq">Remarques du vétérinaire :</p><i></i><i></i><i></i></div></section>`;
};

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Kat'Pat' — fiches santé à relire (${KP.maj})</title><style>
@font-face{font-family:Fraunces;src:url("${ROOT}/assets/fonts/fraunces-latin.woff2") format("woff2");font-weight:500 700}
@font-face{font-family:Inter;src:url("${ROOT}/assets/fonts/inter-latin.woff2") format("woff2");font-weight:400 600}
@page{size:A4;margin:18mm 16mm}
body{font-family:Inter,sans-serif;color:#231c17;font-size:10.5pt;line-height:1.5;margin:0}
h1,h2{font-family:Fraunces,serif;letter-spacing:-.01em;margin:0}
h1{font-size:28pt;margin:4mm 0 5mm}h1 span{color:#b5562f}
.k{color:#127a70;font-weight:600;font-size:8pt;letter-spacing:.2em;text-transform:uppercase;margin-top:20mm}
.box{background:#faf1ea;border:1px solid #ead8c8;border-radius:10px;padding:4mm 5mm;margin:5mm 0}.box b{color:#b5562f}
.nouv{border-left:3px solid #127a70;padding-left:4mm}
.pied{color:#6b5b4c;margin-top:16mm}
.fiche{break-before:page;border-top:2px solid #231c17;padding-top:3mm}
.num{font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:#6b5b4c;margin:0}
h2{font-size:17pt}.pour{color:#6b5b4c;font-size:9pt;margin:1mm 0 3mm}.res{font-weight:600}
h4{font-size:7.5pt;letter-spacing:.16em;text-transform:uppercase;color:#127a70;margin:4mm 0 1mm}h4.faire{color:#b5562f}
ul{margin:0;padding-left:5mm}li{margin:.6mm 0}
.src{font-size:8pt;color:#6b5b4c;margin-top:4mm;overflow-wrap:anywhere}
.avis{border:1px dashed #c9a98f;border-radius:8px;padding:3mm 4mm;margin-top:4mm}.avis b{margin-right:8mm}
.rq{font-size:8.5pt;color:#6b5b4c;margin:2mm 0 0}.avis i{display:block;border-bottom:1px solid #ead8c8;height:8mm}
.q{break-before:page}.q table{width:100%;border-collapse:collapse}.q td{border-bottom:1px solid #ead8c8;padding:2mm 2mm;vertical-align:top}.q td:first-child{width:28mm;font-weight:600;color:#127a70}
.q .rep{height:7mm}.q tr{break-inside:avoid}.tel{white-space:nowrap}
</style></head><body>
<p class="k">Kat'Pat' · un Monde Pixie · La Réunion</p>
<h1>Fiches santé <span>à relire</span></h1>
<p>Kat'Pat' est une petite appli gratuite pour les propriétaires de chiens et de chats de La Réunion. Elle donne les bons réflexes pour notre climat, aide à retrouver un animal perdu et met en avant les associations de l'île.</p>
<p>Avant de la faire connaître, nous voulons qu'un vétérinaire relise ses ${KP.fiches.length} fiches santé. Pour chaque fiche, il suffit de cocher une case et, si besoin, d'écrire une remarque. La dernière page pose ${QUESTIONS.length} questions précises.</p>
<div class="box"><p><b>Notre règle :</b> Kat'Pat' oriente, elle ne diagnostique jamais. Aucune dose, aucun nom de médicament, sauf ceux qu'il ne faut pas donner (paracétamol, anti-inflammatoires pour humains) ; pour un vaccin ou un traitement préventif, la fiche renvoie au vétérinaire. Chaque fiche renvoie vers le vétérinaire. Merci de regarder surtout les gestes déconseillés et les cas où il faut appeler tout de suite.</p>
<p>Centres antipoison cités dans l'appli : ${KP.antipoison.map(x => `${esc(x.nom)} <span class="tel">${esc(x.tel)}</span>`).join(" · ")}.</p></div>
<p class="nouv">Cette version du ${KP.maj} remplace celle du 05/11/2026. Les fiches ont été revues à partir de sources publiques : Royal Veterinary College, ARS La Réunion, une étude sur les maladies transmises au chien à La Réunion, CNITV. Elles restent à valider par vous.</p>
<p>Par défaut, votre relecture reste anonyme : l'appli affichera seulement « Relue par un vétérinaire le [date] ». Si vous le souhaitez, votre nom peut s'ajouter entre parenthèses. Cette mention vaut pour l'ensemble des fiches : elle ne s'affiche qu'une fois toutes relues, et elle est retirée si une fiche change ensuite, jusqu'à une nouvelle relecture.</p>
<p class="pied">Appli en ligne : pixiartpro.github.io/katpat/app.html · Contact : PIX-I-ART, contact@pix-i-art.re · Version du ${KP.maj}</p>
${KP.fiches.map(fiche).join("")}
<section class="q"><p class="num">Dernière page</p><h2>Questions précises</h2><p class="pour">Une réponse courte suffit.</p>
<table>${QUESTIONS.map(([t, q]) => `<tr><td>${t}</td><td>${esc(q)}<div class="rep"></div></td></tr>`).join("")}</table></section>
</body></html>`;

// 3e argument facultatif : date du PDF (AAAA-MM-JJ), quand le texte d'accompagnement change sans que les fiches changent.
const h = join(OUT, `KatPat-fiches-sante-a-relire-${process.argv[3] || iso}.html`);
const pdf = h.replace(/\.html$/, ".pdf");
writeFileSync(h, html);
execFileSync("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--no-pdf-header-footer", "--allow-file-access-from-files", `--print-to-pdf=${pdf}`, "file://" + h], { stdio: "ignore" });
console.log(pdf);
