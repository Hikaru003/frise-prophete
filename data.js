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
        id: "avantRevelation",
        type: "point",
        year: -33,
        title: "Avant la Révélation",
    },
    {
        id: "mariageKhadija",
                parent: "avantRevelation",
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
        subtitle: "Début de la mission prophétique",
        text: `
Avant de recevoir la Révélation, le Prophète ﷺ se retirait régulièrement dans la grotte de [term:hira|Ḥirāʾ], située sur la montagne [term:nur|An-Nūr], pour adorer Dieu et méditer.

À l’âge de quarante ans, il reçut la Révélation : les premiers versets de la sourate [term:alaq|Al-‘Alaq].
        `
    }
    },
    {
    id: "premiersMusulmans",
    parent: "revelation",
    type: "point",
    year: -13,
    title: "Premiers musulmans",
    content: {
        subtitle: "Les premières conversions",
        text: `
Après la Révélation, il rentra chez lui où [term:khadija|Khadīja] fut la première à croire en lui.

Puis vinrent les premiers croyants :

• [term:abubakr|Abū Bakr] (premier homme)

• [term:ali|ʿAlī] (premier enfant)

• [term:zayd|Zayd ibn Ḥāritha] (premier affranchi)
        `
    }
    },
    {
    id: "persecutions",
    parent: "revelation",
    type: "period",
    start: -13,
    end: -1,
    title: "Persécutions à La Mecque",
    content: {
        subtitle: "Épreuves des premiers musulmans",
        text: `
Les musulmans subirent de nombreuses persécutions de la part des Quraysh.

Parmi leurs opposants se trouvaient [term:abulahab|Abū Lahab] et son épouse [term:ummjamil|Umm Jamīl].

Certains compagnons furent durement éprouvés, comme [term:bilal|Bilāl]. D’autres, comme [term:sumayya|Sumayya], furent tués pour leur foi.
        `
    }
    },
    {
    id: "abyssinie",
    parent: "revelation",
    type: "point",
    year: -8,
    title: "Émigration en Abyssinie",
    content: {
        subtitle: "Première migration des musulmans",
        text: `
Face aux persécutions, certains musulmans émigrèrent vers [term:habasha|Al-Ḥabasha].

Deux groupes partirent successivement. Le premier revint après une fausse information, tandis que le second s’y installa durablement.
        `
    }
    },
    {
    id: "anneeTristesse",
    parent: "revelation",
    type: "point",
    year: -3,
    title: "Année de tristesse",
    content: {
        subtitle: "Période difficile",
        text: `
Vers l’âge de cinquante ans, il perdit deux soutiens majeurs : son oncle [term:abutalib|Abū Ṭālib] et son épouse [term:khadija|Khadīja].

Cette période est connue comme l’Année de la tristesse.
        `
    }
    },
    {
    id: "isra",
    parent: "revelation",
    type: "point",
    year: -2,
    title: "Voyage nocturne",
    content: {
        subtitle: "Al-Isrāʾ wa-l-Miʿrāj",
        text: `
Le Prophète ﷺ fut transporté de la Ka‘ba jusqu’à [term:aqsa|Al-Aqṣā], puis élevé dans les cieux.

C’est lors de cette nuit que les cinq prières furent rendues obligatoires.
        `
    }
    },
    {
    id: "bayatAqaba",
    parent: "revelation",
    type: "period",
    start: -2,
    end: -1,
    title: "Serments d’allégeance",
    content: {
        subtitle: "Avant l’Hégire",
        text: `
Avant l’Hégire, des habitants de [term:yathrib|Yathrib] vinrent rencontrer le Prophète ﷺ à La Mecque.

Ils acceptèrent l’Islām et conclurent avec lui des serments d’allégeance, connus sous le nom de Bayʿat al-ʿAqaba.

Ces engagements marquèrent le début du soutien des habitants de Yathrib et préparèrent l’Hégire.
        `
    }
    },
    {
    id: "premierSerment",
    parent: "bayatAqaba",
    type: "point",
    year: -2,
    title: "Premier serment d’al-ʿAqaba",
    content: {
        subtitle: "Première rencontre",
        text: `
Un groupe d’habitants de Yathrib accepta l’Islām et prêta un premier serment d’allégeance au Prophète ﷺ.

Après cela, il envoya [term:musab|Muṣʿab ibn ʿUmayr] pour enseigner l’Islām dans leur ville.
        `
    }
    },
    {
    id: "deuxiemeSerment",
    parent: "bayatAqaba",
    type: "point",
    year: -1,
    title: "Deuxième serment d’al-ʿAqaba",
    content: {
        subtitle: "Engagement et protection",
        text: `
L’année suivante, un groupe plus important revint rencontrer le Prophète ﷺ.

Ils lui promirent soutien et protection, et l’invitèrent à s’installer à Yathrib.

Cet engagement ouvrit la voie à l’Hégire.
        `
    }
    },
    {
    id: "hegire",
    type: "point",
    year: 1,
    title: "Hégire",
    content: {
        subtitle: "Migration vers Médine",
        text: `
Lorsque l’Islām se propagea à [term:medine|Médine] et que ses habitants furent prêts à accueillir le Prophète ﷺ, il reçut la permission d’émigrer.

Les musulmans de La Mecque reçurent alors l’ordre de quitter leur ville pour rejoindre Médine.

Cette migration marque le début d’une nouvelle étape dans l’histoire de l’Islām.
        `
    }
    },
    {
    id: "departMecque",
    parent: "hegire",
    type: "point",
    year: 1,
    title: "Départ de La Mecque",
    content: {
        subtitle: "Début du voyage",
        text: `
Le Prophète ﷺ fut informé par révélation du complot préparé contre lui par les mécréants de Quraysh.

Il demanda à [term:ali|ʿAlī ibn Abī Ṭālib] de prendre sa place dans son lit, puis quitta discrètement sa maison.

Il partit alors en compagnie de [term:abubakr|Abū Bakr], avec lequel il devait accomplir l’Hégire.
        `
    }
    },
    {
    id: "grotteThawr",
    parent: "hegire",
    type: "point",
    year: 1,
    title: "Grotte de Thawr",
    content: {
        subtitle: "Temps de refuge",
        text: `
Au lieu de prendre directement la route du nord vers Médine, le Prophète ﷺ et Abū Bakr se dirigèrent vers [term:thawr|Thawr] afin de se cacher dans une grotte.

Les mécréants arrivèrent jusqu’à son entrée, mais Allâh les préserva et ils ne furent pas découverts.

Après cela, ils purent reprendre leur route vers Médine.
        `
    }
    },
    {
    id: "arriveeQuba",
    parent: "hegire",
    type: "point",
    year: 1,
    title: "Arrivée à Qubâ’",
    content: {
        subtitle: "Première étape près de Médine",
        text: `
Le Prophète ﷺ arriva d’abord à [term:quba|Qubâ’], aux environs de Médine.

Il y resta plusieurs jours et y fit construire la première mosquée de l’Islām.
        `
    }
    },
    {
    id: "entreeMedine",
    parent: "hegire",
    type: "point",
    year: 1,
    title: "Entrée à Médine",
    content: {
        subtitle: "Installation dans la nouvelle ville",
        text: `
Après son passage par Qubâ’, le Prophète ﷺ entra à Médine.

Sa chamelle s’arrêta à un endroit précis, où fut ensuite construite [term:mosqueeProphete|la Mosquée du Prophète].

Il fut accueilli chez [term:abuayyub|Abū Ayyūb al-Anṣārī], le temps de s’installer.
        `
    }
    },
    {
    id: "periodeMedinoise",
    parent: "hegire",
    type: "period",
    start: 1,
    end: 11,
    title: "Période médinoise",
    content: {
        subtitle: "De l’Hégire jusqu’à la fin de sa vie",
        text: `
Après l’Hégire, commença la période médinoise, marquée par l’organisation de la communauté musulmane, les révélations de nouvelles obligations, les expéditions, les traités et les grands événements des dernières années de sa vie ﷺ.
        `
    }
    },
    {
    id: "organisationMedine",
    parent: "periodeMedinoise",
    type: "point",
    year: 1,
    title: "Organisation de Médine",
    content: {
        subtitle: "Début de la communauté",
        text: `
Après l’Hégire, le Prophète ﷺ organisa la vie à Médine.

Il fit construire la mosquée, établit la fraternité entre les musulmans et conclut des accords avec les habitants de la ville.
        `
    }
    },
    {
        id: "fraternisation",
        parent: "periodeMedinoise",
        type: "point",
        year: 1,
        title: "Fraternisation",
        content: {
            subtitle: "Entre Muhājirūn et Anṣār",
            text: `
    Le Prophète ﷺ établit un lien de fraternité entre les émigrés de La Mecque et les habitants de Médine.

    Ils partagèrent leurs biens et s’entraidèrent pour construire la nouvelle communauté.
            `
        }
    },
    {
        id: "badr",
        parent: "periodeMedinoise",
        type: "point",
        year: 2,
        title: "Bataille de Badr",
        content: {
            subtitle: "Première grande victoire",
            text: `
    La bataille de Badr fut la première grande confrontation entre les musulmans et les Quraysh.

    Malgré leur faible nombre, les musulmans remportèrent la victoire.
            `
        }
    },
    {
        id: "uhud",
        parent: "periodeMedinoise",
        type: "point",
        year: 3,
        title: "Bataille de Uhud",
        content: {
            subtitle: "Une épreuve difficile",
            text: `
    Lors de la bataille de Uhud, les musulmans subirent une épreuve après avoir désobéi à certaines consignes.

    Cet événement fut une leçon importante pour la communauté.
            `
        }
    },
    {
        id: "khandaq",
        parent: "periodeMedinoise",
        type: "point",
        year: 5,
        title: "Bataille du Fossé",
        content: {
            subtitle: "Défense de Médine",
            text: `
    Face à une coalition ennemie, les musulmans creusèrent un fossé autour de Médine pour se défendre.

    Cette stratégie permit de protéger la ville.
            `
        }
    },
    {
        id: "hudaybiya",
        parent: "periodeMedinoise",
        type: "point",
        year: 6,
        title: "Traité de Hudaybiya",
        content: {
            subtitle: "Accord avec Quraysh",
            text: `
    Un traité de paix fut conclu entre les musulmans et les Quraysh.

    Bien qu’il semble désavantageux au départ, il permit une grande expansion de l’Islām.
            `
        }
    },
    {
        id: "conqueteMecque",
        parent: "periodeMedinoise",
        type: "point",
        year: 8,
        title: "Conquête de La Mecque",
        content: {
            subtitle: "Retour dans la ville natale",
            text: `
    Le Prophète ﷺ entra à La Mecque avec une armée importante.

    La ville fut conquise sans grande résistance, et de nombreuses personnes embrassèrent l’Islām.
            `
        }
    },
    {
        id: "hajjAdieu",
        parent: "periodeMedinoise",
        type: "point",
        year: 10,
        title: "Pèlerinage d’adieu",
        content: {
            subtitle: "Dernier grand événement",
            text: `
    Le Prophète ﷺ accomplit son dernier pèlerinage.

    Il y prononça un discours important résumant les principes de l’Islām.
            `
        }
    },
    {
        id: "deces",
        parent: "periodeMedinoise",
        type: "point",
        year: 11,
        title: "Décès",
        content: {
            subtitle: "Fin de sa mission",
            text: `
    Le Prophète ﷺ tomba malade puis décéda à Médine.

    Il fut enterré dans la maison de [term:aisha|ʿĀʾisha].
            `
        }
    },
    {
        id: "mort",
        type: "point",
        year: 11,
        title: "Mort",
        content: {
            subtitle: "Sa mort",
            text: "Info sur sa Mort"
        }
    }
];