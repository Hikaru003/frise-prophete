const glossaryData = {
    lundi12: {
        title: "Divergence",
        text: "Il y a divergence sur le jour précis :",
        list: [
            "le 2",
            "le 8",
            "le 10",
            "le 12 (avis le plus répandu)"
        ]
    },
    anneElephant: {
        title: "Pourquoi l'Année de l'Éléphant ?",
        text: "À cette époque, Abraha, un roi du Yémen, avait fait construire une grande église.\n\nCependant, les gens continuaient à se rendre à la Ka‘ba, à La Mecque. Il décida alors de la détruire.\n\nIl partit avec une armée accompagnée d’éléphants. Mais Allâh lui infligea un châtiment : des oiseaux lancèrent des pierres sur l’armée.\n\nCet événement est mentionné dans le Qurʾān, dans la sourate al-Fīl."
    },
    RabiAwwal: {
        title: "Rabi^ al-Awwal",
        text: "Rabi^ al-Awwal est le troisième mois du calendrier lunaire."
    },
    mecque: {
        title: "La Mecque",
        text: "Il est né dans une maison située dans la ruelle Zuqâq al-Mudakkak (زقاق المدقّق), proche de la Ka^ba."
    },
    thuwayba: {
        title: "Thuwayba",
        text: "Thuwayba était une esclave affranchie d’Abû Lahab. Elle fut la première mère de lait du Prophète ﷺ bien que moins connu que sa seconde."
    },
    halima: {
        title: "Ḥalīma as-Sa‘diyya",
        text: "Ḥalīma as-Sa‘diyya appartenait à la tribu des Banū Sa‘d. Elle fut la seconde mère de lait du Prophète ﷺ."
    },
    jibril: {
        title: "Jibrīl",
        text: "Jibrīl est un ange. Une de ses mission est de transmettre la révélation aux prophètes."
    },
    oncles: {
        title: "Oncles",
        text: "Le Prophète ﷺ avait douze oncles paternels et six tantes paternelles, selon certains savants."
    },
    medine: {
        title: "Médine",
        text: "À l’époque, Médine s’appelait Yathrib. Après l’Hégire du Prophète ﷺ, elle fut appelée Médine."
    },
    abwa: {
        title: "Al-Abwā’",
        text: "Al-Abwā’ est un lieu situé entre La Mecque et Médine. C’est là que se trouve la tombe de ^Amina bint Wahb, qu’il est possible de visiter."
    },
    abdulmuttalib: {
        title: "^Abd al-Muṭṭalib",
        text: "Grand-père du Prophète ﷺ qui était le chef de la tribu."
    },
    abutalib: {
        title: "Abū Ṭālib",
        text: "Oncle paternel du Prophète ﷺ et père de ^ʿAlī. Il s’occupa de lui après la mort de ^Abd al-Muṭṭalib et le protégea jusqu'à sa mort alors qu'il ne se converti jamais à l'islam."
    },
    sham: {
        title: "Shâm",
        text: "Le Shâm désigne une région comprenant notamment la Syrie, la Palestine, la Jordanie et le Liban."
    },
    bahira: {
        title: "Baḥīrā",
        text: "Baḥīrā était un moine qui avait lu dans les anciens livres et connaissait les signes du dernier Prophète."
    },
    khadija: {
        title: "Khadīja bint Khuwaylid",
        text: "Khadīja était la femme la plus noble de La Mecque, elle était très riche. Elle avait déjà été mariée mais avait divorcer avant d’épouser le Prophète ﷺ."
    },
    maysara: {
        title: "Maysara",
        text: "Maysara était le serviteur de Khadīja."
    },
    revelation: {
        title: "Révélation",
        text: "Tu pourras écrire ici une explication sur la révélation, son sens, son contexte, et sa place dans la chronologie."
    },
    hegire: {
        title: "Hégire",
        text: "Tu pourras écrire ici une définition de la Hégire et expliquer pourquoi cet événement est central dans la frise."
    },
    prophete: {
        title: "Prophète ﷺ",
        text: "Tu pourras écrire ici une note courte sur le sens du mot Prophète dans ce contexte."
    }
};

const eventsData = [
    {
        id: "naissance",
        type: "point",
        year: -53,
        title: "Naissance",
        content: {
            subtitle: "Naissance du Prophète ﷺ",
            text: "La naissance du Prophète ﷺ a eu lieu un [term:lundi12|lundi 12]. Elle eut lieu durant [term:anneElephant|l'Année de l'Éléphant]. Son mois de naissance est [term:RabiAwwal|Rabi^ al-Awwal]. Il est né à [term:mecque|La Mecque]."
        }
    },
    {
        id: "decesPere",
        parent: "naissance",
        type: "point",
        year: -54,
        title: "Décès de son père",
        content: {
            subtitle: "Avant sa naissance",
            text: "Avant sa naissance, son père, ^Abdullah, décéda alors qu’il était encore dans le ventre de sa mère, ^Amina bint Wahb. Durant la grossesse de ^Amina, ^Abdullah était parti vers le Shâm avec sa tribu pour commercer. Sur le chemin du retour, il tomba malade à proximité de Médine et décida d’y rester, laissant ses compagnons poursuivre leur route. Son père, ^Abd al-Muttalib, fut surpris qu’il ait été laissé derrière. Il envoya alors l’un de ses fils pour prendre de ses nouvelles, mais celui-ci découvrit qu’il était déjà décédé."
        }
    },
    {
        id: "allaitement",
        parent: "naissance",
        type: "period",
        start: -53,
        end: -49,
        title: "Allaitement",
        content: {
            subtitle: "Période de l’enfance",
            text: "Après sa naissance, il resta d’abord avec sa mère, ^Amina bint Wahb. Selon une coutume de l’époque, des femmes des tribus voisines prenaient en charge les nourrissons afin qu’ils grandissent dans un environnement plus sain. Il eut ainsi deux mères de lait : [term:thuwayba|Thuwayba], puis [term:halima|Ḥalīma as-Sa‘diyya], de la tribu des Banū Sa‘d. La durée habituelle de l’allaitement était de deux ans. Cependant, Ḥalīma, ayant constaté une bénédiction particulière, demanda à le garder plus longtemps. Il resta ainsi auprès d’elle jusqu’à l’âge de quatre ans. Durant cette période, un événement marquant eut lieu : l’ange [term:jibril|Jibrīl] ouvrit sa poitrine et purifia son cœur. Lorsque cela fut rapporté à Ḥalīma, elle prit peur et décida de le ramener à sa mère."
        }
    },
    {
        id: "decesMere",
        parent: "naissance",
        type: "period",
        start: -49,
        end: -47,
        title: "Chez sa mère",
        content: {
            subtitle: "A 6 ans",
            text: "Il resta avec sa mère, ^Amina bint Wahb, de 4 ans jusqu’à l’âge de six ans. Elle entreprit un voyage vers [term:medine|Médine] afin de rendre visite aux [term:oncles|oncles] maternels de son père. Sur le chemin du retour, elle tomba malade. Elle décéda à un endroit appelé [term:abwa|Al-Abwā’], situé entre La Mecque et Médine."
        }
    },
    {
        id: "grandPereOncle",
        parent: "naissance",
        type: "period",
        start: -47,
        end: -45,
        title: "Chez son grand-père",
        content: {
            subtitle: "De 6 à 8 ans",
            text: "Après le décès de sa mère, son grand-père, [term:abdulmuttalib|^Abd al-Muṭṭalib], prit sa charge et s’occupa de lui. Il resta auprès de lui jusqu’à l’âge de huit ans. À la mort de son grand-père, sa prise en charge fut confiée à son oncle paternel, [term:abutalib|Abū Ṭālib]."
        }
    },
    {
        id: "chezOncle",
        parent: "naissance",
        type: "period",
        start: -45,
        end: -28,
        title: "Chez son oncle",
        content: {
            subtitle: "Jeunesse sous la protection de Abū Ṭālib",
            text: "Après le décès de son grand-père, il fut pris en charge par son oncle paternel, [term:abutalib|Abū Ṭālib]. Il grandit sous sa protection durant de nombreuses années."
        }
    },
    {
        id: "voyageSham",
        parent: "chezOncle",
        type: "point",
        year: -41,
        title: "Voyage au Shâm",
        content: {
            subtitle: "Rencontre avec Baḥīrā",
            text: "À l’âge de douze ans, il accompagna son oncle [term:abutalib|Abū Ṭālib] lors d’un voyage vers le [term:sham|Shâm]. Durant ce voyage, ils rencontrèrent un moine nommé [term:bahira|Baḥīrā], qui reconnut en lui des signes annonçant le dernier Prophète. Lorsque Abū Ṭālib affirma qu’il s’agissait de son fils, Baḥīrā répondit que le dernier Prophète devait être orphelin de père. Il confirma alors qu’il était son neveu. Baḥīrā lui conseilla de le ramener rapidement, avertissant que certains, notamment parmi les juifs, pourraient chercher à lui nuire s’ils reconnaissaient ces signes. Ils ont suivi son conseil et sont rentrés."
        }
    },
    {
        id: "mariageKhadija",
        type: "point",
        year: -28,
        title: "Mariage avec Khadīja",
        content: {
            subtitle: "À l’âge de 25 ans",
            text: "À l’âge de vingt-cinq ans, il fut chargé par [term:khadija|Khadīja bint Khuwaylid] de mener une expédition commerciale vers le [term:sham|Shâm], accompagné de son serviteur [term:maysara|Maysara]. Durant ce voyage, Maysara observa chez lui une grande bénédiction ainsi qu’un comportement exemplaire. À leur retour, il rapporta cela à Khadīja. Ayant déjà entendu parler de sa véracité et de son honnêteté, Khadīja exprima le souhait de se marier avec lui. Le mariage fut alors conclu. Le Prophète ﷺ avait vingt-cinq ans, tandis que Khadīja en avait quarante."
        }
    },
    {
        id: "revelation",
        type: "point",
        year: -13,
        title: "Révélation",
        content: {
            subtitle: "Début du message prophétique",
            text: "Ici tu pourras expliquer le début de la [term:revelation|révélation]. On peut aussi enrichir des termes liés au [term:prophete|Prophète ﷺ]."
        }
    },
    {
        id: "premiers-musulmans",
        parent: "revelation",
        type: "period",
        start: -13,
        end: -10,
        title: "Premiers musulmans",
        content: {
            subtitle: "Début des conversions",
            text: "Ici tu pourras écrire les informations sur les premiers convertis."
        }
    },
    {
        id: "hegire",
        type: "point",
        year: 1,
        title: "Hégire",
        content: {
            subtitle: "Moment clé de la chronologie",
            text: "Tu peux expliquer ici la [term:hegire|Hégire] en détail. Et faire un lien avec [term:medine|Médine]."
        }
    },
    {
        id: "construction-mosquee",
        parent: "hegire",
        type: "period",
        start: 1,
        end: 2,
        title: "Construction de la mosquée",
        content: {
            subtitle: "Installation à Médine",
            text: "Ici tu pourras écrire les informations sur la mosquée de Médine."
        }
    },
    {
        id: "mort",
        type: "point",
        year: 11,
        title: "Mort",
        content: {
            subtitle: "Dernière grande étape visible sur la frise principale",
            text: "Ici tu pourras écrire les derniers événements de sa vie ﷺ. Le panneau peut accueillir un texte assez long sans casser la mise en page. Plus tard, on pourra encore ajouter des mots enrichis, des notes, ou même des sections internes."
        }
    }
];