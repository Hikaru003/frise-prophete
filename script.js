// References directes vers les elements principaux de l'interface.
const timeline = document.getElementById('timeline');
const timelineContainer = document.getElementById('timeline-container');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalHeader = document.getElementById('modal-header');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalText = document.getElementById('modal-text');
const closeModal = document.getElementById('close-modal');
const tooltipCard = document.getElementById('tooltip-card');
const tooltipCardTitle = document.getElementById('tooltip-card-title');
const tooltipCardText = document.getElementById('tooltip-card-text');
const resetViewButton = document.getElementById('reset-view');
const backButton = document.getElementById('back-button');

// Reglages globaux du zoom et de l'animation de navigation.
const DEFAULT_ZOOM = 1;
const POINT_FOCUS_ZOOM = 2.6;
const MIN_PERIOD_ZOOM = 1.35;
const MAX_PERIOD_ZOOM = 2.4;
const ANIMATION_DURATION = 340;
const MODAL_SIZE_TRANSITION_MS = 620;

// Annees qui recoivent un traitement visuel particulier sur l'axe.
const HIGHLIGHTED_START_YEAR = -53;
const HIGHLIGHTED_HIJRA_YEAR = 1;
const PRIORITY_GRADUATION_YEARS = new Set([-53, 1, 11]);
const HIDDEN_INLINE_YEAR_EVENT_IDS = new Set(['avantRevelation']);

// Constantes de mise en page utilisees pour placer l'axe et les evenements.
const AXIS_LEFT_PADDING_PX = 28;
const DESKTOP_AXIS_RIGHT_PADDING_PX = 88;
const MOBILE_AXIS_RIGHT_PADDING_PX = 124;
const BASE_TIMELINE_HEIGHT = 440;
const ROOT_EVENT_TOP = 138;
const LEVEL_GAP = 92;
const LANE_GAP = 52;
const COLLISION_THRESHOLD_PERCENT = 10;
const GRADUATION_LABEL_COLLISION_PADDING = 4;
const EVENT_LABEL_COLLISION_PADDING_X = 14;
const EVENT_LABEL_COLLISION_PADDING_Y = 10;
const PERIOD_SAME_LANE_GAP_PERCENT = 1.4;
const PERIOD_MIN_YEAR_GAP_FOR_SAME_LANE = 1;
const TIMELINE_BOTTOM_PADDING = 96;
const PARENT_CHILD_MIN_VERTICAL_GAP = 78;

// Etat courant de l'interface: niveau de zoom, evenement actif et largeur de base.
let currentZoom = DEFAULT_ZOOM;
let activeEventId = null;
let isAnimating = false;
let baseTimelineWidth = 0;

// Index internes utilises pour retrouver rapidement les donnees et les elements rendus.
const eventsMap = {};
const childrenByParentId = {};
const eventElements = {};
const eventLayoutMap = {};

// Construction d'index pour acceder rapidement aux evenements par id et par parent.
eventsData.forEach(event => {
    eventsMap[event.id] = event;

    if (!event.parent) return;

    if (!childrenByParentId[event.parent]) {
        childrenByParentId[event.parent] = [];
    }

    childrenByParentId[event.parent].push(event);
});

// Recherche l'annee minimale et maximale presentes dans toutes les donnees.
function getTimelineBoundaryYears() {
    const years = [];

    eventsData.forEach(event => {
        if (typeof event.year === 'number') years.push(event.year);
        if (typeof event.start === 'number') years.push(event.start);
        if (typeof event.end === 'number') years.push(event.end);
    });

    return {
        start: Math.min(...years),
        end: Math.max(...years)
    };
}

// Bornes temporelles globales de la frise, calculees une seule fois au chargement.
const { start: TIMELINE_START_YEAR, end: TIMELINE_END_YEAR } = getTimelineBoundaryYears();

// Formate une annee pour l'affichage sur l'axe ou a cote d'un evenement.
function formatTimelineYear(year) {
    if (year < 0) {
        return `${Math.abs(year)} av. H`;
    }
    return `${year} H`;
}

// Reconvertit l'annee pour supprimer l'annee zero dans les calculs de distance.
function getTimelineOrdinalYear(year) {
    if (year > 0) {
        return year - 1;
    }
    return year;
}

// Decoupe un texte en paragraphes exploitables pour le rendu HTML.
function getTextParagraphs(text) {
    return text
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0);
}

// Cache la mini-fenetre du glossaire.
function hideTooltipCard() {
    tooltipCard.classList.add('hidden');
}

// Place la mini-fenetre du glossaire pres du point clique sans sortir de l'ecran.
function positionTooltipCard(x, y) {
    const cardWidth = tooltipCard.offsetWidth;
    const cardHeight = tooltipCard.offsetHeight;
    const space = 14;

    let left = x + space;
    let top = y + space;

    if (left + cardWidth > window.innerWidth - 12) {
        left = x - cardWidth - space;
    }

    if (top + cardHeight > window.innerHeight - 12) {
        top = y - cardHeight - space;
    }

    if (left < 12) left = 12;
    if (top < 12) top = 12;

    tooltipCard.style.left = left + 'px';
    tooltipCard.style.top = top + 'px';
}

// Affiche le contenu d'un terme du glossaire dans la mini-fenetre contextuelle.
function showTooltipCard(termKey, x, y) {
    const entry = glossaryData[termKey];
    if (!entry) return;

    tooltipCardTitle.textContent = entry.title;
    tooltipCardText.innerHTML = "";

    if (entry.text) {
        const paragraphs = getTextParagraphs(entry.text);

        paragraphs.forEach(paragraphText => {
            const textElement = document.createElement('p');
            appendRichText(textElement, paragraphText);
            tooltipCardText.appendChild(textElement);
        });
    }

    if (entry.list && Array.isArray(entry.list)) {
        const ul = document.createElement('ul');

        entry.list.forEach(item => {
            const li = document.createElement('li');
            appendRichText(li, item);
            ul.appendChild(li);
        });

        tooltipCardText.appendChild(ul);
    }

    tooltipCard.classList.remove('hidden');
    positionTooltipCard(x, y);
}

// Cree un bouton inline pour un terme du glossaire dans les textes.
function createInlineTermButton(termKey, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'inline-term';
    button.textContent = label;
    button.dataset.term = termKey;

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = button.getBoundingClientRect();
        showTooltipCard(
            termKey,
            rect.left + rect.width / 2,
            rect.bottom
        );
    });

    return button;
}

// Injecte le texte normal, le gras et les termes cliquables dans un conteneur inline.
function appendRichInlineContent(container, text) {
    const regex = /(\[term:([^|\]]+)\|([^\]]+)\]|\*\*([^*]+)\*\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const fullMatch = match[0];
        const matchIndex = match.index;

        const textBefore = text.slice(lastIndex, matchIndex);
        if (textBefore) {
            container.appendChild(document.createTextNode(textBefore));
        }

        const termKey = match[2];
        const termLabel = match[3];
        const boldText = match[4];

        if (termKey) {
            if (glossaryData[termKey]) {
                container.appendChild(createInlineTermButton(termKey, termLabel));
            } else {
                container.appendChild(document.createTextNode(termLabel));
            }
        } else if (boldText) {
            const strong = document.createElement('strong');
            appendRichInlineContent(strong, boldText);
            container.appendChild(strong);
        } else {
            container.appendChild(document.createTextNode(fullMatch));
        }

        lastIndex = matchIndex + fullMatch.length;
    }

    const remainingText = text.slice(lastIndex);
    if (remainingText) {
        container.appendChild(document.createTextNode(remainingText));
    }
}

// Transforme un texte enrichi en noeuds HTML melant texte, gras et boutons.
function appendRichText(paragraphElement, text) {
    appendRichInlineContent(paragraphElement, text);
}

// Rend un texte long dans un conteneur en recreant ses paragraphes.
function renderTextContent(container, text) {
    const paragraphs = getTextParagraphs(text);

    paragraphs.forEach(paragraphText => {
        const paragraph = document.createElement('p');
        appendRichText(paragraph, paragraphText);
        container.appendChild(paragraph);
    });
}

// Normalise les champs de contenu de la modale pour supporter resume et details.
function getModalContentParts(eventData) {
    const hasStructuredContent =
        eventData.content &&
        typeof eventData.content === 'object' &&
        !Array.isArray(eventData.content);

    if (hasStructuredContent) {
        return {
            subtitle: eventData.content.subtitle || "",
            summary: eventData.content.summary || eventData.content.text || "",
            details: eventData.content.details || ""
        };
    }

    return {
        subtitle: "",
        summary: eventData.description || "",
        details: ""
    };
}

// Met a jour l'etat visuel du bloc de details dans la modale.
function setModalDetailsExpanded(detailsSection, toggleButton, isExpanded) {
    toggleButton.textContent = isExpanded ? "Moins de détails" : "Plus de détails";
    toggleButton.setAttribute('aria-expanded', String(isExpanded));
    detailsSection.classList.toggle('expanded', isExpanded);
    detailsSection.setAttribute('aria-hidden', String(!isExpanded));
    detailsSection.style.maxHeight = isExpanded
        ? `${detailsSection.scrollHeight}px`
        : '0px';
}

// Ouvre la fenetre modale et y injecte le contenu d'un evenement.
function openModal(eventData) {
    modalTitle.textContent = eventData.title || "";

    const { subtitle, summary, details } = getModalContentParts(eventData);
    const hasDetails = typeof details === 'string' && details.trim().length > 0;

    if (subtitle) {
        modalSubtitle.textContent = subtitle;
        modalSubtitle.classList.remove('hidden');
    } else {
        modalSubtitle.textContent = "";
        modalSubtitle.classList.add('hidden');
    }

    modalText.innerHTML = "";

    if (summary && summary.trim()) {
        const summarySection = document.createElement('div');
        summarySection.className = 'modal-summary';
        renderTextContent(summarySection, summary);
        modalText.appendChild(summarySection);

        if (hasDetails) {
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'modal-details-toggle';
            toggleButton.textContent = 'Plus de détails';
            toggleButton.setAttribute('aria-expanded', 'false');

            const detailsSection = document.createElement('div');
            detailsSection.className = 'modal-details';
            detailsSection.setAttribute('aria-hidden', 'true');
            renderTextContent(detailsSection, details);

            toggleButton.addEventListener('click', () => {
                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                setModalDetailsExpanded(detailsSection, toggleButton, !isExpanded);
            });

            modalText.appendChild(toggleButton);
            modalText.appendChild(detailsSection);
        }
    } else {
        const paragraph = document.createElement('p');
        paragraph.textContent = "Aucun contenu n'a encore été ajouté pour cet événement.";
        modalText.appendChild(paragraph);
    }

    hideTooltipCard();
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

// Redefinit la mise a jour du bouton de details pour piloter un echange de contenu.
function setModalDetailsExpanded(toggleButton, isExpanded) {
    toggleButton.textContent = isExpanded ? "Moins de details" : "Plus de details";
    toggleButton.setAttribute('aria-expanded', String(isExpanded));
}

// Cree un panneau de contenu a afficher dans la zone de lecture de la modale.
function createModalContentPanel(text) {
    const panel = document.createElement('div');
    panel.className = 'modal-text-panel';
    renderTextContent(panel, text);
    return panel;
}

// Calcule la hauteur maximale disponible pour le corps scrollable de la modale.
function getModalBodyMaxHeight() {
    const modalMaxHeight = window.innerHeight * 0.85;
    const headerHeight = modalHeader.getBoundingClientRect().height;
    return Math.max(120, modalMaxHeight - headerHeight);
}

// Calcule la hauteur cible reelle du corps de modale pour un contenu donne.
function getModalBodyTargetHeight(contentHeight) {
    const modalTextStyles = window.getComputedStyle(modalText);
    const verticalPadding =
        parseFloat(modalTextStyles.paddingTop) +
        parseFloat(modalTextStyles.paddingBottom);

    return Math.min(getModalBodyMaxHeight(), contentHeight + verticalPadding);
}

// Echange le contenu affiche dans la modale avec une animation verticale fluide.
function swapModalContent(stage, nextText) {
    const currentPanel = stage.querySelector('.modal-text-panel');
    const nextPanel = createModalContentPanel(nextText);

    nextPanel.classList.add('is-measuring');
    stage.appendChild(nextPanel);
    const nextHeight = nextPanel.offsetHeight;
    nextPanel.remove();

    if (!currentPanel) {
        nextPanel.classList.remove('is-measuring');
        nextPanel.classList.add('is-active');
        stage.appendChild(nextPanel);
        stage.style.height = 'auto';
        return;
    }

    const currentHeight = currentPanel.offsetHeight;
    const currentBodyHeight = modalBody.getBoundingClientRect().height;
    const isGrowing = nextHeight > currentHeight;
    const nextBodyHeight = isGrowing
        ? Math.min(
            getModalBodyMaxHeight(),
            Math.max(0, currentBodyHeight + (nextHeight - currentHeight))
        )
        : getModalBodyTargetHeight(nextHeight);
    const swapDelay = isGrowing ? 320 : 180;
    const resetDelay = MODAL_SIZE_TRANSITION_MS + 80;

    stage.style.height = `${currentHeight}px`;
    modalBody.style.height = `${currentBodyHeight}px`;
    modalBody.style.overflowY = 'hidden';
    void stage.offsetHeight;
    void modalBody.offsetHeight;

    currentPanel.classList.add('is-leaving');

    requestAnimationFrame(() => {
        stage.style.height = `${nextHeight}px`;
        modalBody.style.height = `${nextBodyHeight}px`;
    });

    window.setTimeout(() => {
        if (currentPanel.parentNode === stage) {
            currentPanel.remove();
        }

        nextPanel.classList.remove('is-measuring');
        nextPanel.classList.add('is-entering');
        stage.appendChild(nextPanel);
        void nextPanel.offsetHeight;

        requestAnimationFrame(() => {
            nextPanel.classList.remove('is-entering');
            nextPanel.classList.add('is-active');
        });
    }, swapDelay);

    window.setTimeout(() => {
        stage.style.height = 'auto';
        modalBody.style.height = '';
        modalBody.style.overflowY = 'auto';
    }, resetDelay);
}

// Cree la zone d'actions de l'en-tete de modale si elle n'existe pas encore.
function ensureModalHeaderActions() {
    let actions = modalHeader.querySelector('.modal-header-actions');

    if (!actions) {
        actions = document.createElement('div');
        actions.className = 'modal-header-actions';
        modalHeader.appendChild(actions);
    }

    actions.innerHTML = "";
    return actions;
}

// Redefinit l'ouverture de modale pour remplacer le resume par les details a la demande.
function openModal(eventData) {
    modalTitle.textContent = eventData.title || "";

    const { subtitle, summary, details } = getModalContentParts(eventData);
    const hasDetails = typeof details === 'string' && details.trim().length > 0;

    if (subtitle) {
        modalSubtitle.textContent = subtitle;
        modalSubtitle.classList.remove('hidden');
    } else {
        modalSubtitle.textContent = "";
        modalSubtitle.classList.add('hidden');
    }

    modalText.innerHTML = "";
    modalBody.style.height = '';
    modalBody.style.overflowY = 'auto';
    const headerActions = ensureModalHeaderActions();

    if (summary && summary.trim()) {
        const stage = document.createElement('div');
        stage.className = 'modal-text-stage';
        modalText.appendChild(stage);
        swapModalContent(stage, summary);

        if (hasDetails) {
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'modal-details-toggle';
            setModalDetailsExpanded(toggleButton, false);

            toggleButton.addEventListener('click', () => {
                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                const nextExpandedState = !isExpanded;
                setModalDetailsExpanded(toggleButton, nextExpandedState);
                swapModalContent(stage, nextExpandedState ? details : summary);
            });

            headerActions.appendChild(toggleButton);
        }
    } else {
        const paragraph = document.createElement('p');
        paragraph.textContent = "Aucun contenu n'a encore ete ajoute pour cet evenement.";
        modalText.appendChild(paragraph);
    }

    hideTooltipCard();
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

// Ferme la fenetre modale et nettoie aussi la mini-fenetre du glossaire.
function closeModalWindow() {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    hideTooltipCard();
}

// Retourne tous les enfants directs d'un evenement.
function getChildren(parentId) {
    return childrenByParentId[parentId] || [];
}

// Indique si un evenement possede au moins un enfant.
function hasChildren(eventId) {
    return getChildren(eventId).length > 0;
}

// Calcule la profondeur hierarchique d'un evenement dans l'arbre.
function getLevel(event) {
    let level = 0;
    let currentEvent = event;

    while (currentEvent.parent) {
        level++;
        currentEvent = eventsMap[currentEvent.parent];
    }

    return level;
}

// Retrouve l'evenement racine de la famille a laquelle appartient un evenement.
function getFamilyRootId(event) {
    let currentEvent = event;

    while (currentEvent.parent) {
        currentEvent = eventsMap[currentEvent.parent];
    }

    return currentEvent.id;
}

// Convertit une annee en pourcentage horizontal sur la largeur de la frise.
function yearToPercent(year) {
    const totalDuration =
        getTimelineOrdinalYear(TIMELINE_END_YEAR) - getTimelineOrdinalYear(TIMELINE_START_YEAR);

    const elapsed =
        getTimelineOrdinalYear(year) - getTimelineOrdinalYear(TIMELINE_START_YEAR);

    const rawPercent = (elapsed / totalDuration) * 100;
    const leftPaddingPercent = (AXIS_LEFT_PADDING_PX / baseTimelineWidth) * 100;
    const rightAxisPaddingPx = window.innerWidth <= 640
        ? MOBILE_AXIS_RIGHT_PADDING_PX
        : DESKTOP_AXIS_RIGHT_PADDING_PX;
    const rightPaddingPercent = (rightAxisPaddingPx / baseTimelineWidth) * 100;
    const usableWidth = 100 - leftPaddingPercent - rightPaddingPercent;

    return leftPaddingPercent + ((rawPercent / 100) * usableWidth);
}

// Normalise le type d'un evenement quand il n'est pas explicitement renseigne.
function getEventType(event) {
    return event.type || "point";
}

// Renvoie l'annee de debut d'un evenement, quel que soit son format de donnees.
function getEventStartYear(event) {
    if (typeof event.start === 'number') return event.start;
    if (typeof event.year === 'number') return event.year;
    return TIMELINE_START_YEAR;
}

// Renvoie l'annee de fin d'un evenement, en reutilisant le debut pour un point.
function getEventEndYear(event) {
    if (typeof event.end === 'number') return event.end;
    if (typeof event.year === 'number') return event.year;
    return getEventStartYear(event);
}

// Calcule le centre temporel d'un evenement pour les placements et recentrages.
function getEventCenterYear(event) {
    const start = getEventStartYear(event);
    const end = getEventEndYear(event);
    return (start + end) / 2;
}

// Convertit le debut d'un evenement en position horizontale.
function getEventStartPercent(event) {
    return yearToPercent(getEventStartYear(event));
}

// Convertit la fin d'un evenement en position horizontale.
function getEventEndPercent(event) {
    return yearToPercent(getEventEndYear(event));
}

// Convertit le centre d'un evenement en position horizontale.
function getEventCenterPercent(event) {
    return yearToPercent(getEventCenterYear(event));
}

// Calcule la largeur horizontale occupee par un evenement sur la frise.
function getEventSpanPercent(event) {
    const startPercent = getEventStartPercent(event);
    const endPercent = getEventEndPercent(event);
    return Math.max(endPercent - startPercent, 0);
}

// Mesure l'ecart chronologique entre deux evenements consecutifs.
function getGapAfterEventInYears(previousEvent, nextEvent) {
    return getEventStartYear(nextEvent) - getEventEndYear(previousEvent);
}

// Determine le niveau de zoom le plus adapte pour focaliser un evenement.
function getFocusZoomForEvent(event) {
    if (getEventType(event) === 'point') {
        return POINT_FOCUS_ZOOM;
    }

    const spanPercent = getEventSpanPercent(event);

    if (spanPercent <= 0) {
        return MAX_PERIOD_ZOOM;
    }

    const desiredVisiblePercent = spanPercent + 18;
    const rawZoom = 100 / desiredVisiblePercent;

    return Math.min(
        MAX_PERIOD_ZOOM,
        Math.max(MIN_PERIOD_ZOOM, rawZoom)
    );
}

// Calcule la position de tous les evenements avant leur rendu dans le DOM.
function computeEventLayout() {
    const levelsMap = {};

    // On repart d'un layout vide pour recalculer proprement apres un rerender.
    Object.keys(eventLayoutMap).forEach(eventId => {
        delete eventLayoutMap[eventId];
    });

    // On groupe d'abord les evenements par profondeur dans la hierarchie.
    eventsData.forEach(event => {
        const level = getLevel(event);
        if (!levelsMap[level]) {
            levelsMap[level] = [];
        }
        levelsMap[level].push(event);
    });

    Object.keys(levelsMap).forEach(levelKey => {
        const level = Number(levelKey);
        const familyMap = {};

        // A profondeur egale, on separe les branches pour mieux gerer les collisions.
        levelsMap[level].forEach(event => {
            const familyRootId = getFamilyRootId(event);

            if (!familyMap[familyRootId]) {
                familyMap[familyRootId] = [];
            }

            familyMap[familyRootId].push(event);
        });

        Object.values(familyMap).forEach(familyEvents => {
            // Les evenements sont tries dans l'ordre chronologique avant placement.
            const sortedEvents = familyEvents
                .slice()
                .sort((a, b) => {
                    const startDiff = getEventStartYear(a) - getEventStartYear(b);
                    if (startDiff !== 0) return startDiff;

                    const endDiff = getEventEndYear(a) - getEventEndYear(b);
                    if (endDiff !== 0) return endDiff;

                    return getEventCenterYear(a) - getEventCenterYear(b);
                });

            const laneLastEnd = [];
            const laneLastEvent = [];
            let lastAssignedLane = 0;

            // Chaque evenement est place sur une ligne verticale compatible.
            sortedEvents.forEach(event => {
                const startPercent = getEventStartPercent(event);
                const endPercent = getEventEndPercent(event);
                const centerPercent = getEventCenterPercent(event);

                const occupiedEndPercent =
                    getEventType(event) === 'period'
                        ? endPercent + PERIOD_SAME_LANE_GAP_PERCENT
                        : endPercent;

                let lane = 0;

                // On garde une distance minimale horizontale pour eviter que
                // deux evenements tres proches se retrouvent sur la meme ligne.
                while (
                    laneLastEnd[lane] !== undefined &&
                    startPercent - laneLastEnd[lane] < COLLISION_THRESHOLD_PERCENT
                ) {
                    lane++;
                }

                lane = Math.max(lane, lastAssignedLane);

                while (
                    (
                        laneLastEnd[lane] !== undefined &&
                        startPercent - laneLastEnd[lane] < COLLISION_THRESHOLD_PERCENT
                    ) ||
                    (
                        laneLastEvent[lane] &&
                        getEventType(event) === 'period' &&
                        getEventType(laneLastEvent[lane]) === 'period' &&
                        getGapAfterEventInYears(laneLastEvent[lane], event) <= PERIOD_MIN_YEAR_GAP_FOR_SAME_LANE
                    )
                ) {
                    lane++;
                }

                laneLastEnd[lane] = occupiedEndPercent;
                laneLastEvent[lane] = event;
                lastAssignedLane = lane;

                let top = ROOT_EVENT_TOP + (level * LEVEL_GAP) + (lane * LANE_GAP);

                if (event.parent && eventLayoutMap[event.parent]) {
                    top = Math.max(
                        top,
                        eventLayoutMap[event.parent].top + PARENT_CHILD_MIN_VERTICAL_GAP
                    );
                }

                eventLayoutMap[event.id] = {
                    lane,
                    top,
                    startPercent,
                    endPercent,
                    centerPercent
                };
            });
        });
    });
}

// Ajuste la hauteur totale de la frise a partir du layout theorique ou du rendu reel.
function updateTimelineHeight(useRenderedElements = false) {
    const renderedBottoms = useRenderedElements
        ? Object.values(eventElements)
            .filter(Boolean)
            .map(element => element.offsetTop + element.offsetHeight + TIMELINE_BOTTOM_PADDING)
        : [];

    if (renderedBottoms.length) {
        timeline.style.height = `${Math.max(BASE_TIMELINE_HEIGHT, ...renderedBottoms)}px`;
        return;
    }

    const tops = Object.values(eventLayoutMap).map(layout => layout.top);
    const requiredHeight = tops.length
        ? Math.max(...tops) + TIMELINE_BOTTOM_PADDING
        : BASE_TIMELINE_HEIGHT;

    timeline.style.height = `${Math.max(BASE_TIMELINE_HEIGHT, requiredHeight)}px`;
}

// Choisit l'espacement des graduations selon le niveau de zoom courant.
function getGraduationStepForZoom(zoomLevel) {
    if (zoomLevel >= 2.8) return 1;
    if (zoomLevel >= 1.8) return 2;
    if (zoomLevel >= 1.3) return 5;
    return 10;
}

// Trouve la premiere graduation majeure a afficher dans la plage visible.
function getFirstGraduationYear(step) {
    return Math.ceil(TIMELINE_START_YEAR / step) * step;
}

// Cree une graduation complete avec sa marque et son libelle.
function createGraduation(year, options = {}) {
    if (year === 0) return;

    const {
        isMinor = false,
        isFinal = false,
        isStart = false
    } = options;

    const graduation = document.createElement('div');
    graduation.classList.add('graduation');

    if (isMinor) graduation.classList.add('minor');
    if (isFinal) graduation.classList.add('final');
    if (isStart) graduation.classList.add('start');

    graduation.style.left = yearToPercent(year) + '%';

    const mark = document.createElement('div');
    mark.classList.add('graduation-mark');

    const label = document.createElement('div');
    label.classList.add('graduation-label');
    label.textContent = formatTimelineYear(year);
    label.dataset.year = String(year);

    graduation.appendChild(mark);
    graduation.appendChild(label);
    timeline.appendChild(graduation);
}

// Donne une priorite d'affichage aux annees les plus importantes.
function getGraduationLabelPriority(label) {
    const year = Number(label.dataset.year);

    if (PRIORITY_GRADUATION_YEARS.has(year)) {
        return 3;
    }

    if (year === TIMELINE_END_YEAR || year === HIGHLIGHTED_START_YEAR || year === HIGHLIGHTED_HIJRA_YEAR) {
        return 2;
    }

    return 1;
}

// Masque les libelles de graduations qui se chevauchent visuellement.
function hideOverlappingGraduationLabels() {
    const labels = Array.from(timeline.querySelectorAll('.graduation:not(.minor) .graduation-label'));

    // On reaffiche tout avant de refaire une passe propre de collision.
    labels.forEach(label => {
        label.classList.remove('graduation-label-hidden');
    });

    const measuredLabels = labels.map((label, index) => {
        const rect = label.getBoundingClientRect();

        return {
            label,
            index,
            left: rect.left,
            right: rect.right,
            priority: getGraduationLabelPriority(label)
        };
    });

    const keptLabels = [];

    measuredLabels
        .sort((a, b) => {
            if (b.priority !== a.priority) {
                return b.priority - a.priority;
            }

            return a.index - b.index;
        })
        .forEach(candidate => {
            const overlapsKeptLabel = keptLabels.some(other => !(
                candidate.right + GRADUATION_LABEL_COLLISION_PADDING <= other.left ||
                candidate.left >= other.right + GRADUATION_LABEL_COLLISION_PADDING
            ));

            if (overlapsKeptLabel) {
                candidate.label.classList.add('graduation-label-hidden');
                return;
            }

            keptLabels.push(candidate);
        });
}

// Rend toutes les graduations majeures et mineures de l'axe temporel.
function renderGraduations() {
    const step = getGraduationStepForZoom(currentZoom);
    const firstYear = getFirstGraduationYear(step);
    const minorStep = step === 1 ? 0 : step === 2 ? 1 : step === 5 ? 1 : 2;

    for (let year = firstYear; year <= TIMELINE_END_YEAR; year += step) {
        createGraduation(year, {
            isFinal: year === TIMELINE_END_YEAR,
            isStart: year === HIGHLIGHTED_START_YEAR
        });

        if (!minorStep) continue;

        for (
            let minorYear = year + minorStep;
            minorYear < year + step && minorYear < TIMELINE_END_YEAR;
            minorYear += minorStep
        ) {
            createGraduation(minorYear, { isMinor: true });
        }
    }

    if ((TIMELINE_END_YEAR - firstYear) % step !== 0) {
        createGraduation(TIMELINE_END_YEAR, { isFinal: true });
    }

    if (
        HIGHLIGHTED_START_YEAR >= TIMELINE_START_YEAR &&
        HIGHLIGHTED_START_YEAR <= TIMELINE_END_YEAR &&
        HIGHLIGHTED_START_YEAR !== TIMELINE_START_YEAR &&
        (HIGHLIGHTED_START_YEAR - firstYear) % step !== 0
    ) {
        createGraduation(HIGHLIGHTED_START_YEAR, { isStart: true });
    }

    if (
        HIGHLIGHTED_HIJRA_YEAR >= TIMELINE_START_YEAR &&
        HIGHLIGHTED_HIJRA_YEAR <= TIMELINE_END_YEAR &&
        (HIGHLIGHTED_HIJRA_YEAR - firstYear) % step !== 0
    ) {
        createGraduation(HIGHLIGHTED_HIJRA_YEAR);
    }

    hideOverlappingGraduationLabels();
}

// Decide si l'annee d'un evenement racine doit etre affichee en petit sous son titre.
function shouldShowInlineYear(eventData) {
    return getLevel(eventData) === 0 && !HIDDEN_INLINE_YEAR_EVENT_IDS.has(eventData.id);
}

// Indique si deux blocs d'evenements se chevauchent dans le rendu final.
function doEventRectsOverlap(firstRect, secondRect) {
    return !(
        firstRect.right + EVENT_LABEL_COLLISION_PADDING_X <= secondRect.left ||
        firstRect.left >= secondRect.right + EVENT_LABEL_COLLISION_PADDING_X ||
        firstRect.bottom + EVENT_LABEL_COLLISION_PADDING_Y <= secondRect.top ||
        firstRect.top >= secondRect.bottom + EVENT_LABEL_COLLISION_PADDING_Y
    );
}

// Corrige les collisions encore visibles apres le placement theorique des evenements.
function resolveVisibleEventCollisions() {
    const visibleElements = eventsData
        .map(event => eventElements[event.id])
        .filter(element => element && element.classList.contains('visible'));

    // On reapplique d'abord le top de base calcule par le layout.
    visibleElements.forEach(element => {
        const layout = eventLayoutMap[element.dataset.id];
        if (!layout) return;

        element.style.top = `${layout.top}px`;
    });

    const placedElements = [];

    visibleElements
        .sort((firstElement, secondElement) => {
            const firstLayout = eventLayoutMap[firstElement.dataset.id];
            const secondLayout = eventLayoutMap[secondElement.dataset.id];

            if (firstLayout.top !== secondLayout.top) {
                return firstLayout.top - secondLayout.top;
            }

            return firstLayout.centerPercent - secondLayout.centerPercent;
        })
        .forEach(element => {
            let rect = element.getBoundingClientRect();
            let hasCollision = true;

            // Le layout donne une base stable, puis cette passe ajuste seulement
            // les cas restants qui se chevauchent apres rendu reel du texte.
            while (hasCollision) {
                hasCollision = false;

                for (const placedElement of placedElements) {
                    if (!doEventRectsOverlap(rect, placedElement.rect)) {
                        continue;
                    }

                    element.style.top = `${placedElement.element.offsetTop + LANE_GAP}px`;
                    rect = element.getBoundingClientRect();
                    hasCollision = true;
                    break;
                }
            }

            placedElements.push({ element, rect });
        });

    updateTimelineHeight(true);
}

// Cree le DOM d'un evenement ponctuel.
function createPointEventElement(eventData, layout, level) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('event', 'event-point', `level-${level}`);
    eventElement.style.left = layout.centerPercent + '%';
    eventElement.style.top = layout.top + 'px';
    eventElement.dataset.id = eventData.id;

    if (eventData.parent) {
        eventElement.dataset.parent = eventData.parent;
    }

    const label = document.createElement('span');
    label.classList.add('event-title');
    label.textContent = eventData.title;
    eventElement.appendChild(label);

    if (shouldShowInlineYear(eventData)) {
        const yearLabel = document.createElement('small');
        yearLabel.classList.add('event-year');
        yearLabel.textContent = formatTimelineYear(getEventStartYear(eventData));
        eventElement.appendChild(yearLabel);
    }

    return eventElement;
}

// Cree le DOM d'un evenement de type periode avec sa barre horizontale.
function createPeriodEventElement(eventData, layout, level) {
    const eventElement = document.createElement('div');
    const widthPercent = Math.max(layout.endPercent - layout.startPercent, 1.2);

    eventElement.classList.add('event', 'event-period', `level-${level}`);
    eventElement.style.left = layout.startPercent + '%';
    eventElement.style.top = layout.top + 'px';
    eventElement.style.width = widthPercent + '%';
    eventElement.dataset.id = eventData.id;

    if (eventData.parent) {
        eventElement.dataset.parent = eventData.parent;
    }

    const bar = document.createElement('div');
    bar.classList.add('period-bar');

    const label = document.createElement('span');
    label.classList.add('event-title');
    label.textContent = eventData.title;

    eventElement.appendChild(bar);
    eventElement.appendChild(label);

    return eventElement;
}

// Cree un evenement, l'ajoute dans la frise et lui associe son comportement au clic.
function createEventElement(eventData) {
    const level = getLevel(eventData);
    const layout = eventLayoutMap[eventData.id];
    const eventType = getEventType(eventData);

    let eventElement;

    if (eventType === 'period') {
        eventElement = createPeriodEventElement(eventData, layout, level);
    } else {
        eventElement = createPointEventElement(eventData, layout, level);
    }

    timeline.appendChild(eventElement);

    eventElement.addEventListener('click', () => {
        if (isAnimating) return;

        const clickedEvent = eventsMap[eventData.id];

        if (hasChildren(clickedEvent.id)) {
            if (activeEventId === clickedEvent.id) {
                openModal(clickedEvent);
            } else {
                focusOnEvent(clickedEvent.id);
            }
        } else {
            openModal(clickedEvent);
        }
    });

    eventElements[eventData.id] = eventElement;
}

// Rend tous les evenements a partir des donnees chargees.
function renderEvents() {
    eventsData.forEach(event => {
        createEventElement(event);
    });
}

// Reconstruit la frise complete: layout, hauteur, graduations puis evenements.
function renderTimeline() {
    timeline.innerHTML = '';
    computeEventLayout();
    updateTimelineHeight();
    renderGraduations();
    renderEvents();
}

// Supprime puis regenere uniquement les graduations de l'axe.
function refreshGraduations() {
    const existingGraduations = timeline.querySelectorAll('.graduation');
    existingGraduations.forEach(graduation => graduation.remove());
    renderGraduations();
}

// Mesure la largeur de reference de la frise avant application du zoom.
function updateBaseTimelineWidth() {
    baseTimelineWidth = Math.max(timelineContainer.clientWidth, 640);
}

// Applique un niveau de zoom, ajuste l'axe et relance la correction des collisions.
function applyZoom(zoomLevel) {
    const previousStep = getGraduationStepForZoom(currentZoom);
    currentZoom = zoomLevel;
    timeline.style.width = `${baseTimelineWidth * zoomLevel}px`;

    const newStep = getGraduationStepForZoom(currentZoom);
    if (previousStep !== newStep) {
        refreshGraduations();
    } else {
        hideOverlappingGraduationLabels();
    }

    resolveVisibleEventCollisions();
}

// Calcule le scroll horizontal necessaire pour centrer une position sur la frise.
function getScrollLeftForPosition(positionPercent, zoomLevel) {
    const timelineWidth = baseTimelineWidth * zoomLevel;
    const targetX = (positionPercent / 100) * timelineWidth;
    const containerCenter = timelineContainer.clientWidth / 2;

    let newScrollLeft = targetX - containerCenter;
    const maxScrollLeft = Math.max(0, timelineWidth - timelineContainer.clientWidth);

    if (newScrollLeft < 0) newScrollLeft = 0;
    if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;

    return newScrollLeft;
}

// Remonte tous les ancetres d'un evenement, du plus haut jusqu'au parent direct.
function getAncestors(eventId) {
    const ancestors = [];
    let currentEvent = eventsMap[eventId];

    while (currentEvent && currentEvent.parent) {
        ancestors.unshift(currentEvent.parent);
        currentEvent = eventsMap[currentEvent.parent];
    }

    return ancestors;
}

// Construit le chemin complet de navigation vers un evenement actif.
function getEventPath(eventId) {
    if (!eventId) return [];
    return [...getAncestors(eventId), eventId];
}

// Indique si un evenement est a la racine de la frise.
function isRootEvent(event) {
    return !event.parent;
}

// Determine si un evenement doit etre visible selon le niveau de navigation courant.
function shouldBeVisible(event) {
    if (isRootEvent(event)) {
        return true;
    }

    if (!activeEventId) {
        return false;
    }

    const path = getEventPath(activeEventId);
    return path.includes(event.parent);
}

// Affiche ou masque les evenements en fonction de l'evenement actif.
function updateEventsVisibility() {
    eventsData.forEach(event => {
        const element = eventElements[event.id];
        if (!element) return;

        if (shouldBeVisible(event)) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });

    resolveVisibleEventCollisions();
}

// Marque visuellement le chemin actif dans la hierarchie des evenements.
function updateEventsState() {
    const activePath = getEventPath(activeEventId);

    eventsData.forEach(event => {
        const element = eventElements[event.id];
        if (!element) return;

        if (activePath.includes(event.id)) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

// Met a jour les boutons de navigation selon la profondeur actuelle.
function updateButtons() {
    if (!activeEventId) {
        backButton.classList.add('hidden');
        resetViewButton.classList.add('hidden');
        return;
    }

    resetViewButton.classList.remove('hidden');

    const ancestors = getAncestors(activeEventId);
    if (ancestors.length > 0) {
        backButton.classList.remove('hidden');
    } else {
        backButton.classList.add('hidden');
    }
}

// Fonction d'easing utilisee pour rendre les animations de zoom plus fluides.
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Anime simultanement le zoom de la frise et son deplacement horizontal.
function animateZoomAndScroll(targetZoom, targetScrollLeft, duration = ANIMATION_DURATION) {
    const startZoom = currentZoom;
    const startScrollLeft = timelineContainer.scrollLeft;
    const startTime = performance.now();

    // Le drapeau bloque les interactions pendant toute la duree de l'animation.
    isAnimating = true;

    // Cette sous-fonction est rappelee a chaque frame jusqu'a la fin de l'animation.
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        const zoom = startZoom + (targetZoom - startZoom) * eased;
        const scrollLeft = startScrollLeft + (targetScrollLeft - startScrollLeft) * eased;

        applyZoom(zoom);
        timelineContainer.scrollLeft = scrollLeft;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            applyZoom(targetZoom);
            timelineContainer.scrollLeft = targetScrollLeft;
            isAnimating = false;
        }
    }

    requestAnimationFrame(step);
}

// Focalise la vue sur un evenement en mettant a jour l'etat puis en animant la camera.
function focusOnEvent(eventId) {
    const event = eventsMap[eventId];
    if (!event) return;

    activeEventId = eventId;

    updateEventsVisibility();
    updateEventsState();
    updateButtons();

    const targetPosition = getEventCenterPercent(event);
    const targetZoom = getFocusZoomForEvent(event);
    const targetScrollLeft = getScrollLeftForPosition(targetPosition, targetZoom);

    animateZoomAndScroll(targetZoom, targetScrollLeft);
}

// Remonte d'un niveau dans la hierarchie depuis l'evenement actuellement actif.
function goBackOneLevel() {
    if (isAnimating || !activeEventId) return;

    const currentEvent = eventsMap[activeEventId];
    if (!currentEvent.parent) return;

    const parentEvent = eventsMap[currentEvent.parent];
    focusOnEvent(parentEvent.id);
}

// Revient a la vue generale de la frise.
function resetView() {
    if (isAnimating) return;

    activeEventId = null;
    updateEventsVisibility();
    updateEventsState();
    updateButtons();

    animateZoomAndScroll(DEFAULT_ZOOM, 0);
}

// Gere le clic dans le fond de la page pour revenir en arriere dans la navigation.
function handleBackgroundNavigationClick(target) {
    if (isAnimating || !activeEventId) return;
    if (!modal.classList.contains('hidden')) return;

    const clickedInteractiveElement = target.closest(
        '.event, #controls, #modal, #modal-content, #tooltip-card, .inline-term, button, a'
    );

    if (clickedInteractiveElement) return;

    const currentEvent = eventsMap[activeEventId];
    if (!currentEvent) return;

    if (currentEvent.parent) {
        goBackOneLevel();
    } else {
        resetView();
    }
}

// Recalcule toute la frise lorsqu'un changement de taille d'ecran se produit.
function handleViewportResize() {
    if (isAnimating) return;

    updateBaseTimelineWidth();
    renderTimeline();
    applyZoom(currentZoom);
    updateEventsVisibility();
    updateEventsState();
    updateButtons();

    if (!activeEventId) {
        timelineContainer.scrollLeft = 0;
        return;
    }

    const activeEvent = eventsMap[activeEventId];
    if (!activeEvent) {
        timelineContainer.scrollLeft = 0;
        return;
    }

    timelineContainer.scrollLeft = getScrollLeftForPosition(
        getEventCenterPercent(activeEvent),
        currentZoom
    );
}

// Branche le bouton "retour" sur la navigation d'un niveau vers le haut.
backButton.addEventListener('click', goBackOneLevel);
// Branche le bouton de reinitialisation sur la vue generale.
resetViewButton.addEventListener('click', resetView);
// Branche le bouton de fermeture de la modale.
closeModal.addEventListener('click', closeModalWindow);

// Ferme la modale si l'utilisateur clique sur le fond derriere son contenu.
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalWindow();
    }
});

// Gere les clics globaux pour masquer le glossaire ou naviguer en arriere.
document.addEventListener('click', (e) => {
    const clickedInlineTerm = e.target.closest('.inline-term');

    if (!clickedInlineTerm && !e.target.closest('#tooltip-card')) {
        hideTooltipCard();
    }

    handleBackgroundNavigationClick(e.target);
});

// Cache le glossaire lors d'un scroll de page.
window.addEventListener('scroll', hideTooltipCard);
// Cache le glossaire lors d'un redimensionnement.
window.addEventListener('resize', hideTooltipCard);
// Recalcule le layout complet lors d'un redimensionnement.
window.addEventListener('resize', handleViewportResize);

// Permet de fermer la modale avec la touche Echap.
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalWindow();
    }
});

// Initialise la frise au chargement avec sa largeur, son rendu et son etat par defaut.
updateBaseTimelineWidth();
renderTimeline();
applyZoom(DEFAULT_ZOOM);
updateEventsVisibility();
updateEventsState();
updateButtons();
