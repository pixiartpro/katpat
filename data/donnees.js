/* Kat'Pat' — données de l'appli (v1, jeudi 05/11/2026).
   Pour corriger un texte, un numéro ou une asso : c'est ICI, rien d'autre à toucher.
   ⚠️ Les fiches santé sont des brouillons à faire relire par un vétérinaire avant la sortie publique.
   Règle Kat'Pat' : on oriente, on ne diagnostique jamais. Pas de dose, pas de médicament. */

window.KP = {
  maj: "05/11/2026",

  /* Numéros d'urgence animale (centres antipoison vétérinaires, ouverts de 8 h 30 à minuit, heure de métropole) */
  antipoison: [
    { nom: "CNITV (Lyon)", tel: "04 78 87 10 40" },
    { nom: "CAPAE-Ouest (Nantes)", tel: "02 40 68 77 40" }
  ],

  /* Contacts officiels des 5 intercommunalités (fourrière, errance, stérilisation aidée).
     Source : stoperrance.re, « Informations et contacts utiles », lu le 05/11/2026. */
  intercos: {
    CINOR:  { de: "de la CINOR", nom: "CINOR (Nord)",  tels: ["0800 315 316", "0262 289 884"], mail: "environnement@cinor.org", site: "https://www.cinor.re" },
    CIREST: { de: "de la CIREST", nom: "CIREST (Est)",  tels: ["0262 460 649"], mail: "fourriere@cirest.fr", site: "https://www.cirest.fr" },
    TCO:    { de: "du TCO", nom: "TCO (Ouest)",   tels: ["0800 605 605"], mail: "courrier@tco.re", site: "https://www.tco.re" },
    CIVIS:  { de: "de la CIVIS", nom: "CIVIS (Sud-Ouest)", tels: ["0800 501 501", "0262 352 558"], mail: "accueil@civis.re", site: "https://www.civis.re" },
    CASUD:  { de: "de la CASUD", nom: "CASUD (Sud)",   tels: ["0800 327 327", "0262 384 607"], mail: "contact@casud.re", site: "https://www.casud.re" }
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
        "Le mouiller à l'eau fraîche, pas glacée, et lui proposer à boire sans forcer.",
        "Appeler ton vétérinaire pendant que tu le refroidis : c'est une urgence."
      ],
      eviter: ["Le promener aux heures chaudes", "Le laisser dans la voiture, même 5 minutes"],
      sources: []
    },
    {
      id: "crapaud", emoji: "🐸", titre: "Le crapaud dans la gueule", pour: "chien surtout", urgence: true,
      resume: "Le crapaud guttural, très présent à La Réunion, libère un venin quand le chien le mord ou le lèche.",
      savoir: [
        "Le crapaud guttural a été introduit à La Réunion en 1927. On le croise le soir, dans les jardins et près des points d'eau.",
        "Le danger vient du venin avalé, quand le chien mord, lèche ou garde le crapaud en gueule.",
        "Les petits chiens sont les plus à risque."
      ],
      signes: ["Bave abondante, mousse", "Se frotte la gueule", "Vomit, tremble, ou son cœur s'emballe"],
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
      resume: "Une maladie très présente sur l'île, transmise par l'urine des rats, dans l'eau et la boue.",
      savoir: [
        "La leptospirose est installée à La Réunion : le climat chaud et humide l'aide à survivre dans l'eau et la terre.",
        "Le chien l'attrape en buvant ou en se baignant dans une eau stagnante, une ravine, une flaque après la pluie.",
        "Elle peut aussi toucher les humains : on se lave les mains après avoir manipulé un animal malade.",
        "Il existe un vaccin pour le chien. Parles-en à ton vétérinaire."
      ],
      signes: ["Fatigue, ne mange plus", "Fièvre, vomissements", "Urine foncée, yeux ou gencives jaunes"],
      faire: [
        "Appeler ton vétérinaire dès les premiers signes.",
        "Après la saison des pluies, éviter les flaques et les bassins d'eau qui stagne."
      ],
      eviter: ["Laisser traîner les croquettes dehors (ça attire les rats)"],
      sources: [
        { nom: "Santé publique France — leptospirose à La Réunion", url: "https://santepubliquefrance.fr/content/download/182981/2308567?version=1" },
        { nom: "Réponse ministérielle (Assemblée nationale)", url: "https://questions.assemblee-nationale.fr/dyn/13/questions/QANR5L13QE22433.pdf" }
      ]
    },
    {
      id: "tiques", emoji: "🕷️", titre: "Tiques et puces toute l'année", pour: "chien et chat", urgence: false,
      resume: "Ici, il n'y a pas d'hiver pour les tiques : la protection se fait les 12 mois.",
      savoir: [
        "Les tiques transmettent au chien des maladies du sang (comme l'ehrlichiose). Elles sont étudiées sur l'île par le Cirad.",
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
      sources: [{ nom: "Mémoire Cirad sur les maladies transmises au chien à La Réunion", url: "https://dumas.ccsd.cnrs.fr/dumas-04471467v1/document" }]
    },
    {
      id: "diro", emoji: "🦟", titre: "Le ver du cœur (dirofilariose)", pour: "chien surtout", urgence: false,
      resume: "Un ver transmis par les moustiques, qui s'installe dans le cœur et les poumons du chien.",
      savoir: [
        "La dirofilariose fait partie des maladies transmises par les insectes étudiées chez le chien à La Réunion.",
        "Le moustique pique un chien porteur, puis un autre chien : c'est comme ça qu'elle circule.",
        "Elle se prévient : ton vétérinaire te dit si ton chien a besoin d'un traitement préventif."
      ],
      signes: ["Toux qui dure", "S'essouffle vite, fatigue à l'effort"],
      faire: [
        "En parler à ton vétérinaire à la prochaine visite.",
        "Limiter les eaux stagnantes autour de la maison (soucoupes, pneus) : c'est bon pour toi aussi, contre la dengue."
      ],
      eviter: [],
      sources: [{ nom: "Mémoire Cirad sur les maladies transmises au chien à La Réunion", url: "https://dumas.ccsd.cnrs.fr/dumas-04471467v1/document" }]
    },
    {
      id: "poison", emoji: "☠️", titre: "Poisons de la maison et du jardin", pour: "chien et chat", urgence: true,
      resume: "Raticide, chocolat, antigel, certains médicaments humains : des gestes simples évitent le pire.",
      savoir: [
        "Les produits contre les rats sont courants dans les maisons et les champs. Un animal qui en avale peut saigner de l'intérieur plusieurs jours après.",
        "Chocolat, raisin, oignon, médicaments pour humains (paracétamol, anti-inflammatoires) sont dangereux pour le chien et le chat.",
        "Deux centres antipoison vétérinaires répondent au téléphone : leurs numéros sont plus bas."
      ],
      signes: ["Vomit, tremble, bave", "Gencives pâles, sang dans les selles ou les urines", "Comportement anormal soudain"],
      faire: [
        "Appeler ton vétérinaire ou un centre antipoison tout de suite, avec l'emballage du produit sous la main.",
        "Ne pas le faire vomir sans qu'on te le dise.",
        "Ne rien lui donner (ni lait, ni huile) sans avis."
      ],
      eviter: ["Poser des appâts à rats là où ton animal passe", "Donner un médicament humain « pour le soulager »"],
      sources: [],
      antipoison: true
    },
    {
      id: "cyclone", emoji: "🌀", titre: "Le cyclone, avec ton animal", pour: "chien et chat", urgence: false,
      resume: "À chaque alerte, la consigne officielle est la même : on rentre ses animaux.",
      savoir: [
        "Dès l'alerte orange, Météo-France et les communes demandent de rentrer les animaux.",
        "Après un cyclone, beaucoup d'animaux se perdent : une puce à jour change tout pour le retrouver.",
        "Pense aussi aux animaux du quartier qui n'ont personne."
      ],
      signes: [],
      faire: [
        "Préparer un sac : 3 jours d'eau et de croquettes, ses médicaments, une laisse, une caisse de transport.",
        "Vérifier que ses coordonnées sont à jour sur I-CAD.",
        "Garder une photo récente de ton animal dans ton téléphone."
      ],
      eviter: ["Le laisser attaché dehors", "Attendre l'alerte rouge pour le rentrer"],
      sources: [{ nom: "Météo-France — vigilance La Réunion", url: "https://vigilance.meteofrance.fr/fr/la-reunion" }]
    },
    {
      id: "puce", emoji: "🔖", titre: "Puce et stérilisation", pour: "chien et chat", urgence: false,
      resume: "La puce est obligatoire dès 4 mois. La stérilisation peut être gratuite selon tes revenus.",
      savoir: [
        "Tout chien ou chat doit être identifié (puce ou tatouage) avant 4 mois ou avant d'être donné ou vendu.",
        "Sans puce, un animal perdu a très peu de chances de revenir chez toi.",
        "Les intercommunalités stérilisent gratuitement si tu n'es pas imposable (parfois aussi en première tranche). Un petit dossier suffit.",
        "La stérilisation est le geste qui fait le plus baisser l'errance sur l'île."
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

  /* Associations : coordonnées publiques, à vérifier avec chaque asso avant la sortie */
  assos: [
    { nom: "SPA de La Réunion", zone: "Nord et Sud", type: "Refuge", fait: "Deux refuges (Grand Prado à Sainte-Marie, et Le Tampon) et un dispensaire de stérilisation. Adoptions sur l'île et vers la métropole.", lien: "https://www.helloasso.com/associations/spa-refuge-de-la-reunion-sainte-marie" },
    { nom: "APPAR", zone: "Ouest (La Possession)", type: "Protection", fait: "Agir Pour Protéger les Animaux Réunionnais : lutte contre la souffrance animale sur l'île.", lien: "" },
    { nom: "Sauvade", zone: "Toute l'île", type: "Sauvetage", fait: "Soigne des chiens errants ou abandonnés, avec un réseau de familles d'accueil, puis les fait adopter, surtout en métropole.", lien: "https://www.jeveuxaider.gouv.fr/organisations/14416-sauvade" },
    { nom: "A L'Ouest L'Eden", zone: "Ouest", type: "Sauvetage", fait: "Recueille des chiens menacés d'euthanasie en refuge et des chiens abandonnés, puis les place à l'adoption.", lien: "https://www.teaming.net/associationalouestleden" },
    { nom: "A'V Refuge", zone: "Réunion", type: "Refuge", fait: "Protège les animaux et mène des campagnes de stérilisation. Cherche des bénévoles.", lien: "https://www.jeveuxaider.gouv.fr/missions-benevolat/66312/benevolat-av-refuge" },
    { nom: "REVEZ", zone: "Réunion", type: "Sensibilisation", fait: "Sensibilise à la bientraitance animale et dialogue avec les élus.", lien: "https://www.helloasso.com/associations/revez" },
    { nom: "Les Coussinets du Cœur", zone: "Réunion, Guyane, métropole", type: "Sauvetage", fait: "Prend en charge des animaux à La Réunion et les accompagne vers l'adoption.", lien: "https://www.helloasso.com/associations/les-coussinets-du-c-ur" },
    { nom: "Les Oubliés de la Run", zone: "Réunion", type: "Sauvetage", fait: "Association de protection des chiens de l'île.", lien: "" }
  ],

  /* Refuges publics des intercommunalités (source : stoperrance.re) */
  refugesPublics: "Les intercommunalités CASUD, CINOR et CIVIS ont chacune un refuge. Les 5 fourrières de l'île ont 296 places pour les chiens et 99 pour les chats."
};
