/* Kat'Pat' — données de l'appli (v1, jeudi 05/11/2026).
   Pour corriger un texte, un numéro ou une asso : c'est ICI, rien d'autre à toucher.
   ⚠️ Les fiches santé sont des brouillons à faire relire par un vétérinaire avant la sortie publique.
   Règle Kat'Pat' : on oriente, on ne diagnostique jamais. Pas de dose, pas de médicament. */

window.KP = {
  maj: "06/11/2026",

  /* Numéros d'urgence animale (centres antipoison vétérinaires, 7 j/7 de 8 h 30 à minuit heure de métropole ;
     à La Réunion : 11 h 30 - 3 h quand la métropole est à l'heure d'hiver, 10 h 30 - 2 h à l'heure d'été).
     Numéros revus le 06/11/2026 (sources concordantes, pas de page officielle lisible : appel test à faire). */
  antipoison: [
    { nom: "CNITV (Lyon)", tel: "04 78 87 10 40" },
    { nom: "CAPAE-Ouest (Nantes)", tel: "02 40 68 77 40" }
  ],

  /* Contacts officiels des 5 intercommunalités (fourrière, errance, stérilisation aidée).
     Sources : sites des intercos lus le 06/11/2026 (casud.re, tco.re, civis.re) ; à défaut stoperrance.re.
     CINOR : aucun numéro sur cinor.re, ceux-ci viennent de stoperrance.re (appel test à faire). */
  intercos: {
    CINOR:  { de: "de la CINOR", nom: "CINOR (Nord)",  tels: ["0800 315 316", "0262 28 98 84"], mail: "environnement@cinor.org", site: "https://www.cinor.re" },
    CIREST: { de: "de la CIREST", nom: "CIREST (Est)",  tels: ["0262 46 06 49"], libs: ["Fourrière"], mail: "fourriere@cirest.fr", site: "https://www.cirest.fr" },
    TCO:    { de: "du TCO", nom: "TCO (Ouest)",   tels: ["0800 605 605", "0262 32 12 12"], libs: ["Numéro gratuit (depuis un fixe)", "Standard"], mail: "sterilisation@tco.re", site: "https://www.tco.re" },
    CIVIS:  { de: "de la CIVIS", nom: "CIVIS (Sud-Ouest)", tels: ["0800 501 501", "0262 35 25 58", "0262 25 98 17"], libs: ["Numéro gratuit (captures)", "Fourrière Espoir", "Refuge Chance"], mail: "accueil@civis.re", site: "https://www.civis.re" },
    CASUD:  { de: "de la CASUD", nom: "CASUD (Sud)",   tels: ["0800 001 601", "0262 57 97 77"], libs: ["Fourrière (numéro gratuit)", "Standard"], note: "Fourrière ouverte du lundi au vendredi, 7 h 30-12 h et 13 h 30-16 h. En dehors : la police municipale de ta commune.", mail: "campagne-sterilisation@casud.re", site: "https://www.casud.re" }
  },

  /* Les 24 communes et leur intercommunalité */
  communes: {
    "Saint-Denis": "CINOR", "Sainte-Marie": "CINOR", "Sainte-Suzanne": "CINOR",
    "Saint-André": "CIREST", "Bras-Panon": "CIREST", "Saint-Benoît": "CIREST",
    "La Plaine-des-Palmistes": "CIREST", "Sainte-Rose": "CIREST", "Salazie": "CIREST",
    "Le Port": "TCO", "La Possession": "TCO", "Saint-Paul": "TCO", "Trois-Bassins": "TCO", "Saint-Leu": "TCO",
    "Saint-Pierre": "CIVIS", "Saint-Louis": "CIVIS", "L'Étang-Salé": "CIVIS", "Les Avirons": "CIVIS",
    "Petite-Île": "CIVIS", "Cilaos": "CIVIS",
    "Le Tampon": "CASUD", "L'Entre-Deux": "CASUD", "Saint-Joseph": "CASUD", "Saint-Philippe": "CASUD"
  },

  /* Contacts utiles, par thème. Règle : un contact n'entre que si sa page officielle (ou celle de l'organisme)
     a été ouverte et le donne. Recherche + 2 contradicteurs le 08/11/2026 (recherche/contacts-utiles-2026-11-08.json) ;
     numéros DAAF et règles de morsure relus à la main le 08/11/2026.
     dyn : "antipoison" = centres antipoison ; "interco" = contacts de l'intercommunalité de la commune choisie. */
  contacts: [
    { id: "urgence", emoji: "🚨", theme: "Un animal en danger, maintenant", dyn: "antipoison", items: [
      { nom: "Police ou gendarmerie", pour: "Un animal est en danger en ce moment (enfermé au soleil, battu, abandonné attaché) : appelle le 17. Le 112 marche aussi, gratuit, jour et nuit.", tels: ["17", "112"] },
      { nom: "Tu ne peux pas parler au téléphone", pour: "Contacte les secours par l'appli ou le site du 114.", site: "https://www.urgence114.fr/", siteNom: "urgence114.fr" },
      { nom: "Ton vétérinaire", pour: "Il doit répondre à une urgence, lui-même ou en t'envoyant chez un confrère. Demande-lui dès maintenant comment ça se passe la nuit et le week-end.", site: "https://www.veterinaire.fr/je-suis-proprietaire-danimaux/fiches-pratiques/la-prise-en-charge-dun-animal-en-urgence", siteNom: "L'urgence vétérinaire, sur veterinaire.fr" }
    ] },
    { id: "perdu", emoji: "🔎", theme: "Perdu, trouvé, errant", dyn: "interco", items: [
      { nom: "I-CAD", pour: "Le fichier des puces. Déclare ton animal perdu, ou retrouvé, dans ton espace.", site: "https://www.i-cad.fr", siteNom: "i-cad.fr" },
      { nom: "StopErrance.re", pour: "Signale un animal errant : ton signalement part vers les services de ta commune.", site: "https://www.stoperrance.re", siteNom: "stoperrance.re" },
      { nom: "Animal mort sur la route", pour: "Si tu connais le propriétaire, c'est à lui de le faire enlever. Sinon, préviens la mairie : elle saura qui gère cette route.", site: "https://www.service-public.gouv.fr/particuliers/vosdroits/F35680", siteNom: "La règle, sur service-public.fr" }
    ] },
    { id: "maltraitance", emoji: "⚠️", theme: "Un animal maltraité", items: [
      { nom: "En danger tout de suite ?", pour: "Appelle le 17.", tels: ["17"] },
      { nom: "Signaler en ligne à la police et à la gendarmerie", pour: "Le formulaire Ma Sécurité, confidentiel. Tu peux aussi parler par tchat avec un policier ou un gendarme, jour et nuit.", site: "https://www.masecurite.interieur.gouv.fr/fr/signaler-une-maltraitance-animale", siteNom: "masecurite.interieur.gouv.fr" },
      { nom: "Vu sur internet ?", pour: "Une vidéo ou un post public qui montre de la cruauté envers un animal : signale-le sur Pharos.", site: "https://internet-signalement.gouv.fr/", siteNom: "internet-signalement.gouv.fr" },
      { nom: "Les associations nationales", pour: "La SPA a un formulaire de signalement. 30 Millions d'Amis explique qui prévenir.", site: "https://www.la-spa.fr/signaler-une-maltraitance/", siteNom: "Formulaire de la SPA", site2: "https://www.30millionsdamis.fr/je-mengage/signaler-maltraitance-animale/", site2Nom: "Conseils de 30 Millions d'Amis" }
    ] },
    { id: "morsure", emoji: "🐕", theme: "Morsure, chien de catégorie, voisinage", items: [
      { nom: "Ton chien a mordu quelqu'un", pour: "Déclare-le à la mairie. Il doit voir 3 fois le même vétérinaire : dans les 24 heures, au plus tard 7 jours après, puis le 15e jour. Sinon, amende de 135 €.", site: "https://www.service-public.gouv.fr/particuliers/vosdroits/F24028", siteNom: "La règle, sur service-public.fr" },
      { nom: "Tu as été mordu", pour: "Va voir un médecin ou les urgences. En cas d'urgence, appelle le 15.", tels: ["15"] },
      { nom: "Évaluer le comportement d'un chien", pour: "L'Ordre des vétérinaires tient la liste à jour des vétérinaires qui peuvent le faire.", site: "https://www.veterinaire.fr/annuaires/veterinaires-evaluateurs-comportementaux", siteNom: "Annuaire de l'Ordre" },
      { nom: "Chien de 1re ou 2e catégorie", pour: "Il te faut un permis de détention, gratuit, donné par le maire.", site: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1839", siteNom: "La règle, sur service-public.fr" },
      { nom: "Aboiements, odeurs, conflit de voisins", pour: "C'est le maire qui est compétent : contacte la police municipale par ta mairie.", site: "https://lannuaire.service-public.gouv.fr/", siteNom: "Trouver ta mairie" }
    ] },
    { id: "steriliser", emoji: "✂️", theme: "Stériliser, identifier", dyn: "interco", items: [
      { nom: "Stérilisation aidée", pour: "Ton intercommunalité aide à stériliser, sous conditions de revenus. Ses contacts sont juste au-dessus : choisis ta commune." },
      { nom: "La puce", pour: "Obligatoire pour un chien dès 4 mois, pour un chat dès 7 mois, et avant toute vente ou tout don. C'est ton vétérinaire qui la pose.", site: "https://www.i-cad.fr", siteNom: "i-cad.fr" }
    ] },
    { id: "voyage", emoji: "✈️", theme: "Voyager ou faire venir un animal", items: [
      { nom: "La DAAF de La Réunion", pour: "Le service de l'État pour les animaux. Tu veux faire venir un chien ou un chat ? Écris-lui avant le voyage et demande une réponse écrite.", mail: "pifsv.daaf974@agriculture.gouv.fr", site: "https://daaf.reunion.agriculture.gouv.fr/animaux-de-compagnie-a3494.html", siteNom: "Sa page animaux de compagnie" },
      { nom: "Poste vétérinaire de l'aéroport Roland-Garros", pour: "Pour un animal qui arrive d'un pays hors Union européenne.", tels: ["0262 30 88 39"], mail: "pif974.aeroport.sivep@agriculture.gouv.fr", horaires: "Du lundi au vendredi, 8 h 30-11 h 30 et 13 h 30-16 h." },
      { nom: "Partir avec ton animal", pour: "Puce, passeport européen, vaccin contre la rage : commence chez ton vétérinaire au moins 3 mois avant. Vérifie aussi les règles de la compagnie aérienne.", site: "https://www.service-public.gouv.fr/particuliers/vosdroits/F21374", siteNom: "La règle, sur service-public.fr", site2: "https://www.douane.gouv.fr/actualites/voyager-avec-son-animal-de-compagnie-4-regles-essentielles-connaitre", site2Nom: "Les 4 règles de la douane" }
    ] },
    { id: "veto", emoji: "🩺", theme: "Trouver un vétérinaire, l'État", items: [
      { nom: "Annuaire des vétérinaires", pour: "L'annuaire officiel de l'Ordre, pour en trouver un près de chez toi.", site: "https://www.veterinaire.fr/annuaires/trouver-un-veterinaire-pour-soigner-mon-animal", siteNom: "veterinaire.fr" },
      { nom: "DAAF de La Réunion (Saint-Denis)", pour: "L'accueil du service de l'État pour la santé et la protection des animaux. Il peut t'orienter.", tels: ["0262 30 89 89"], mail: "daaf974@agriculture.gouv.fr", horaires: "Du lundi au jeudi, 8 h 30-11 h 30 et 13 h 30-16 h ; le vendredi, 8 h 30-11 h 30 et 13 h 30-15 h." }
    ] },
    { id: "deces", emoji: "🕊️", theme: "Quand ton animal meurt", items: [
      { nom: "Que faire", pour: "Tu peux l'enterrer chez toi selon les règles de ta commune, ou le faire incinérer par ton vétérinaire. Ensuite, déclare sa mort sur I-CAD.", site: "https://www.service-public.gouv.fr/particuliers/vosdroits/F33426", siteNom: "La règle, sur service-public.fr" }
    ] }
  ],

  /* Fiches santé : orienteur, jamais de diagnostic */
  fiches: [
    {
      id: "chaleur", emoji: "☀️", titre: "Le coup de chaleur", pour: "chien et chat", urgence: true,
      resume: "Chez nous, la chaleur et l'humidité peuvent tuer un animal en quelques minutes, surtout en voiture.",
      savoir: [
        "Un chien transpire très peu : il se refroidit surtout en haletant. Quand l'air est chaud et humide, ça ne suffit plus.",
        "Les plus fragiles : nez écrasé (bouledogue, carlin), chiens âgés, en surpoids, ou à poil épais.",
        "Une voiture au soleil devient un four, même vitres entrouvertes."
      ],
      signes: ["Halète très fort, langue très rouge", "Bave beaucoup, titube", "Vomit ou s'effondre"],
      faire: [
        "Le mettre à l'ombre, au frais, tout de suite.",
        "Le mouiller tout de suite à l'eau du robinet et le mettre dans un courant d'air (ventilateur, clim). Ne pas poser de serviette mouillée sur lui. Lui proposer à boire sans forcer.",
        "Appeler ton vétérinaire pendant que tu le refroidis, et continuer à le mouiller pendant le trajet : c'est une urgence."
      ],
      eviter: ["Le promener aux heures chaudes", "Le laisser dans la voiture, même 5 minutes"],
      sources: [{ nom: "Royal Veterinary College — refroidir d'abord, transporter ensuite", url: "https://www.rvc.ac.uk/vetcompass/news/the-rvc-urges-owners-of-hot-dogs-to-cool-first-transport-second" }]
    },
    {
      id: "crapaud", emoji: "🐸", titre: "Le crapaud dans la gueule", pour: "chien surtout", urgence: true,
      resume: "Le crapaud guttural, très présent à La Réunion, libère un venin quand le chien le mord ou le lèche.",
      savoir: [
        "Le crapaud guttural a été introduit à La Réunion en 1927. On le croise le soir, dans les jardins et près des points d'eau.",
        "Le danger vient du venin avalé, quand le chien mord, lèche ou garde le crapaud en gueule.",
        "Les petits chiens sont les plus à risque."
      ],
      signes: ["Bave abondante, mousse", "Se frotte la gueule", "Vomit, tremble, a des convulsions, ou son cœur bat bizarrement"],
      faire: [
        "Rincer la gueule à l'eau claire, en faisant couler l'eau de l'arrière vers l'avant, sans le faire avaler.",
        "Ne pas le faire vomir.",
        "Appeler ton vétérinaire sans attendre. Si tu peux, prends le crapaud en photo."
      ],
      eviter: ["Laisser le chien seul au jardin le soir", "Laisser sa gamelle d'eau dehors la nuit (les crapauds s'y installent)"],
      sources: [{ nom: "Liste des espèces exotiques de La Réunion (DEAL)", url: "https://www.reunion.developpement-durable.gouv.fr/IMG/pdf/ListeEspExo_Faune_2012_cle7df646.pdf" }]
    },
    {
      id: "lepto", emoji: "💧", titre: "La leptospirose", pour: "chien surtout", urgence: false,
      resume: "Une maladie très présente sur l'île, transmise par l'urine des rats et d'autres animaux, dans l'eau et la boue.",
      savoir: [
        "La leptospirose est installée à La Réunion : le climat chaud et humide l'aide à survivre dans l'eau et la terre.",
        "Le chien l'attrape en buvant, en se baignant ou en marchant dans une eau stagnante, une ravine, une flaque ou de la boue. La bactérie entre par la bouche et par les petites plaies.",
        "Elle peut aussi toucher les humains : on se lave les mains après avoir manipulé un animal malade.",
        "Il existe un vaccin pour le chien. Parles-en à ton vétérinaire."
      ],
      signes: ["Fatigue, ne mange plus", "Fièvre, vomissements", "Urine foncée, yeux ou gencives jaunes"],
      faire: [
        "Appeler ton vétérinaire dès les premiers signes.",
        "Pendant la saison chaude et des pluies (en gros de décembre à mai), et juste après, éviter les flaques, la boue et les bassins d'eau qui stagne."
      ],
      eviter: ["Laisser traîner les croquettes dehors (ça attire les rats)"],
      sources: [
        { nom: "ARS La Réunion — leptospirose, avril 2026", url: "https://www.lareunion.ars.sante.fr/system/files/2026-04/ARS_Leptospirose_vigilance_21042026_0.pdf" },
        { nom: "Réponse ministérielle (Assemblée nationale)", url: "https://questions.assemblee-nationale.fr/dyn/13/questions/QANR5L13QE22433.pdf" }
      ]
    },
    {
      id: "tiques", emoji: "🕷️", titre: "Tiques et puces toute l'année", pour: "chien et chat", urgence: false,
      resume: "Ici, il n'y a pas d'hiver pour les tiques : la protection se fait les 12 mois.",
      savoir: [
        "Les tiques transmettent au chien des maladies du sang, comme l'ehrlichiose et l'anaplasmose. Une étude menée à La Réunion en a trouvé chez un chien testé sur six environ.",
        "Avec notre climat, tiques et puces sont actives toute l'année, pas seulement l'été.",
        "Ton vétérinaire te conseille le produit adapté à ton animal et au rythme qui lui va."
      ],
      signes: ["Tique accrochée (souvent oreilles, cou, entre les doigts)", "Fatigue, fièvre, saignement du nez quelques jours ou semaines après"],
      faire: [
        "Inspecter ton animal après chaque balade en herbe ou en forêt.",
        "Retirer la tique avec un tire-tique, en tournant, sans l'écraser.",
        "Noter la date dans ton carnet Kat'Pat', et appeler le vétérinaire si ton animal change de comportement."
      ],
      eviter: ["Mettre de l'alcool ou de l'éther sur la tique avant de la retirer", "Utiliser un produit pour chien sur un chat"],
      sources: [{ nom: "Mémoire de master (Cirad/CYROI) sur les maladies transmises au chien à La Réunion", url: "https://dumas.ccsd.cnrs.fr/dumas-04471467v1/document" }]
    },
    {
      id: "diro", emoji: "🦟", titre: "Le ver du cœur (dirofilariose)", pour: "chien surtout", urgence: false,
      resume: "Un ver transmis par les moustiques, qui s'installe dans le cœur et les poumons du chien.",
      savoir: [
        "Le ver du cœur est présent à La Réunion : une étude menée sur l'île l'a trouvé chez plusieurs chiens testés sur 100.",
        "Le moustique pique un chien porteur, puis un autre chien : c'est comme ça qu'elle circule.",
        "Elle se prévient : ton vétérinaire te dit si ton chien a besoin d'un traitement préventif."
      ],
      signes: ["Souvent aucun signe au début : seul un test chez le vétérinaire le dit", "Toux qui dure", "S'essouffle vite, fatigue à l'effort"],
      faire: [
        "En parler à ton vétérinaire à la prochaine visite.",
        "Limiter les eaux stagnantes autour de la maison (soucoupes, pneus) : c'est bon pour toi aussi, contre la dengue."
      ],
      eviter: [],
      sources: [{ nom: "Mémoire Cirad sur les maladies transmises au chien à La Réunion", url: "https://dumas.ccsd.cnrs.fr/dumas-04471467v1/document" }]
    },
    {
      id: "poison", emoji: "☠️", titre: "Poisons de la maison et du jardin", pour: "chien et chat", urgence: true,
      resume: "Raticide, chocolat, médicaments humains, antipuces pour chien chez le chat : des gestes simples évitent le pire.",
      savoir: [
        "Les produits contre les rats sont une des premières causes d'empoisonnement. Un animal qui en avale peut saigner de l'intérieur plusieurs jours après, même s'il a l'air bien.",
        "Chocolat, raisin, oignon, médicaments pour humains (paracétamol, anti-inflammatoires) sont dangereux pour le chien et le chat.",
        "Chez le chat, un antipuces prévu pour chien peut être très grave : n'utilise que le produit prescrit pour lui.",
        "Deux centres antipoison vétérinaires répondent au téléphone : leurs numéros sont plus bas."
      ],
      signes: ["Vomit, tremble, bave", "Gencives pâles, sang dans les selles ou les urines", "Comportement anormal soudain"],
      faire: [
        "Appeler ton vétérinaire ou un centre antipoison tout de suite, avec l'emballage du produit sous la main.",
        "Ne pas le faire vomir sans qu'on te le dise.",
        "Ne rien lui donner (ni lait, ni huile) sans avis."
      ],
      eviter: ["Poser des appâts à rats là où ton animal passe", "Donner un médicament humain « pour le soulager »"],
      sources: [{ nom: "CNITV — centre antipoison vétérinaire", url: "https://www.cnitv.fr/" }],
      antipoison: true
    },
    {
      id: "cyclone", emoji: "🌀", titre: "Le cyclone, avec ton animal", pour: "chien et chat", urgence: false,
      resume: "À chaque alerte, la consigne officielle est la même : on rentre ses animaux.",
      savoir: [
        "Dès l'alerte orange cyclonique, la consigne officielle est de rentrer tes animaux.",
        "Après un cyclone, beaucoup d'animaux se perdent : une puce à jour change tout pour le retrouver.",
        "Pense aussi aux animaux du quartier qui n'ont personne."
      ],
      signes: [],
      faire: [
        "Préparer un sac : 3 jours d'eau et de croquettes, ses médicaments (demande une réserve à ton vétérinaire), une laisse, une caisse de transport.",
        "Vérifier que ses coordonnées sont à jour sur I-CAD.",
        "Garder une photo récente de ton animal dans ton téléphone."
      ],
      eviter: ["Le laisser attaché dehors", "Attendre l'alerte rouge pour le rentrer"],
      sources: [{ nom: "Météo-France — conseils en vigilance orange", url: "https://vigilance.meteofrance.fr/fr/la-reunion/conseils-en-cas-de-vigilance-orange" }]
    },
    {
      id: "puce", emoji: "🔖", titre: "Puce et stérilisation", pour: "chien et chat", urgence: false,
      resume: "La puce est obligatoire : dès 4 mois pour le chien, 7 mois pour le chat. La stérilisation peut être gratuite selon tes revenus.",
      savoir: [
        "Ton chien doit être identifié (puce ou tatouage) après 4 mois, ton chat après 7 mois. Et dans tous les cas avant d'être donné ou vendu. Sinon, c'est jusqu'à 750 € d'amende.",
        "Avec une puce à jour, la fourrière ou le vétérinaire peut te retrouver tout de suite.",
        "Les intercommunalités stérilisent gratuitement si tu n'es pas imposable (parfois aussi en première tranche). Un petit dossier suffit.",
        "Stériliser, c'est un des gestes les plus utiles contre l'errance sur l'île."
      ],
      signes: [],
      faire: [
        "Demander la puce à ton vétérinaire si ce n'est pas fait.",
        "Appeler ton intercommunalité pour la stérilisation aidée (numéro dans l'onglet « Perdu · Trouvé »).",
        "Noter le numéro de puce dans ton carnet Kat'Pat'."
      ],
      eviter: [],
      sources: [{ nom: "StopErrance.re (Préfecture de La Réunion)", url: "https://www.stoperrance.re" }]
    }
  ],

  /* Associations : coordonnées publiques, à vérifier avec chaque asso avant la sortie.
     APPAR (La Possession) retirée le 06/11/2026 : aucun lien officiel ni signe d'activité trouvé. */
  assos: [
    { nom: "SPA de La Réunion", zone: "Nord (Sainte-Marie)", type: "Refuge", fait: "Refuge du Grand Prado à Sainte-Marie et dispensaire de stérilisation. Adoptions sur l'île et vers la métropole.", lien: "https://www.helloasso.com/associations/spa-refuge-de-la-reunion-sainte-marie" },
    { nom: "Sauvade", zone: "Toute l'île", type: "Sauvetage", fait: "Soigne des chiens errants ou abandonnés, avec un réseau de familles d'accueil, puis les fait adopter, surtout en métropole.", lien: "https://asso-sauvade.fr/" },
    { nom: "A L'Ouest L'Eden", zone: "Ouest", type: "Sauvetage", fait: "Recueille des chiens menacés d'euthanasie en refuge et des chiens abandonnés, puis les place à l'adoption.", lien: "https://www.teaming.net/associationalouestleden" },
    { nom: "A'V Refuge", zone: "Ouest (Saint-Gilles)", type: "Refuge", fait: "Protège les animaux et mène des campagnes de stérilisation. Cherche des bénévoles.", lien: "https://sites.google.com/view/av-refuge" },
    { nom: "REVEZ", zone: "Ouest (La Possession)", type: "Sensibilisation", fait: "Sensibilise à la bientraitance animale et dialogue avec les élus.", lien: "https://www.helloasso.com/associations/revez" },
    { nom: "Les Coussinets du Cœur", zone: "Réunion, Guyane, métropole", type: "Sauvetage", fait: "Prend en charge des animaux à La Réunion et les accompagne vers l'adoption.", lien: "https://www.helloasso.com/associations/les-coussinets-du-c-ur" },
    { nom: "Les Oubliés de la Run", zone: "Réunion et métropole", type: "Sauvetage", fait: "Soigne et fait vacciner des chiens errants ou abandonnés de l'île, puis les fait adopter à La Réunion, en métropole, en Suisse ou en Belgique.", lien: "https://www.helloasso.com/associations/les-oublies-de-la-run-association" }
  ],

  /* Refuges publics des intercommunalités (sources : stoperrance.re ; TCO, délibération du 06/10/2025) */
  refugesPublics: "Les intercommunalités CASUD, CINOR et CIVIS ont chacune un refuge. Les 5 fourrières de l'île ont 296 places pour les chiens et 99 pour les chats. Un centre animalier pour l'Ouest (fourrière et refuge, à L'Éperon) est prévu pour 2027."
};
