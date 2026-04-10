const timeline = document.getElementById('timeline');
const timelineContainer = document.getElementById('timeline-container');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalText = document.getElementById('modal-text');
const closeModal = document.getElementById('close-modal');
const tooltipCard = document.getElementById('tooltip-card');
const tooltipCardTitle = document.getElementById('tooltip-card-title');
const tooltipCardText = document.getElementById('tooltip-card-text');
const resetViewButton = document.getElementById('reset-view');
const backButton = document.getElementById('back-button');

const DEFAULT_ZOOM = 1;
const POINT_FOCUS_ZOOM = 2.6;
const MIN_PERIOD_ZOOM = 1.35;
const MAX_PERIOD_ZOOM = 2.4;
const ANIMATION_DURATION = 340;

const HIGHLIGHTED_START_YEAR = -53;
const HIGHLIGHTED_HIJRA_YEAR = 1;
const PRIORITY_GRADUATION_YEARS = new Set([-53, 1, 11]);

const SIDE_PADDING_PERCENT = 6;
const BASE_TIMELINE_HEIGHT = 440;
const ROOT_EVENT_TOP = 138;
const LEVEL_GAP = 92;
const LANE_GAP = 52;
const COLLISION_THRESHOLD_PERCENT = 10;
const GRADUATION_LABEL_COLLISION_PADDING = 4;
const PERIOD_SAME_LANE_GAP_PERCENT = 1.4;
const PERIOD_MIN_YEAR_GAP_FOR_SAME_LANE = 1;
const TIMELINE_BOTTOM_PADDING = 96;
const PARENT_CHILD_MIN_VERTICAL_GAP = 78;

let currentZoom = DEFAULT_ZOOM;
let activeEventId = null;
let isAnimating = false;
let baseTimelineWidth = 0;

const eventsMap = {};
const eventElements = {};
const eventLayoutMap = {};

eventsData.forEach(event => {
    eventsMap[event.id] = event;
});

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

const { start: TIMELINE_START_YEAR, end: TIMELINE_END_YEAR } = getTimelineBoundaryYears();

function formatTimelineYear(year) {
    if (year < 0) {
        return `${Math.abs(year)} av. H`;
    }
    return `${year} H`;
}

function getTimelineOrdinalYear(year) {
    if (year > 0) {
        return year - 1;
    }
    return year;
}

function hideTooltipCard() {
    tooltipCard.classList.add('hidden');
}

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

function showTooltipCard(termKey, x, y) {
    const entry = glossaryData[termKey];
    if (!entry) return;

    tooltipCardTitle.textContent = entry.title;
    tooltipCardText.innerHTML = "";

    if (entry.text) {
        const paragraphs = entry.text
            .split(/\n\s*\n/)
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0);

        paragraphs.forEach(paragraphText => {
            const textElement = document.createElement('p');
            textElement.textContent = paragraphText;
            tooltipCardText.appendChild(textElement);
        });
    }

    if (entry.list && Array.isArray(entry.list)) {
        const ul = document.createElement('ul');

        entry.list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });

        tooltipCardText.appendChild(ul);
    }

    tooltipCard.classList.remove('hidden');
    positionTooltipCard(x, y);
}

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

function appendRichText(paragraphElement, text) {
    const regex = /\[term:([^|\]]+)\|([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const fullMatch = match[0];
        const termKey = match[1];
        const label = match[2];
        const matchIndex = match.index;

        const textBefore = text.slice(lastIndex, matchIndex);
        if (textBefore) {
            paragraphElement.appendChild(document.createTextNode(textBefore));
        }

        paragraphElement.appendChild(createInlineTermButton(termKey, label));
        lastIndex = matchIndex + fullMatch.length;
    }

    const remainingText = text.slice(lastIndex);
    if (remainingText) {
        paragraphElement.appendChild(document.createTextNode(remainingText));
    }
}

function renderTextContent(container, text) {
    const paragraphs = text
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0);

    paragraphs.forEach(paragraphText => {
        const paragraph = document.createElement('p');
        appendRichText(paragraph, paragraphText);
        container.appendChild(paragraph);
    });
}

function openModal(eventData) {
    modalTitle.textContent = eventData.title || "";

    const hasStructuredContent =
        eventData.content &&
        typeof eventData.content === 'object' &&
        !Array.isArray(eventData.content);

    const subtitle = hasStructuredContent ? eventData.content.subtitle : "";
    const text = hasStructuredContent ? eventData.content.text : "";

    if (subtitle) {
        modalSubtitle.textContent = subtitle;
        modalSubtitle.classList.remove('hidden');
    } else {
        modalSubtitle.textContent = "";
        modalSubtitle.classList.add('hidden');
    }

    modalText.innerHTML = "";

    if (text && text.trim()) {
        renderTextContent(modalText, text);
    } else if (eventData.description) {
        const paragraph = document.createElement('p');
        appendRichText(paragraph, eventData.description);
        modalText.appendChild(paragraph);
    } else {
        const paragraph = document.createElement('p');
        paragraph.textContent = "Aucun contenu n'a encore été ajouté pour cet événement.";
        modalText.appendChild(paragraph);
    }

    hideTooltipCard();
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeModalWindow() {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    hideTooltipCard();
}

function getChildren(parentId) {
    return eventsData.filter(event => event.parent === parentId);
}

function hasChildren(eventId) {
    return getChildren(eventId).length > 0;
}

function getLevel(event) {
    let level = 0;
    let currentEvent = event;

    while (currentEvent.parent) {
        level++;
        currentEvent = eventsMap[currentEvent.parent];
    }

    return level;
}

function getFamilyRootId(event) {
    let currentEvent = event;

    while (currentEvent.parent) {
        currentEvent = eventsMap[currentEvent.parent];
    }

    return currentEvent.id;
}

function yearToPercent(year) {
    const totalDuration =
        getTimelineOrdinalYear(TIMELINE_END_YEAR) - getTimelineOrdinalYear(TIMELINE_START_YEAR);

    const elapsed =
        getTimelineOrdinalYear(year) - getTimelineOrdinalYear(TIMELINE_START_YEAR);

    const rawPercent = (elapsed / totalDuration) * 100;
    const usableWidth = 100 - (SIDE_PADDING_PERCENT * 2);

    return SIDE_PADDING_PERCENT + ((rawPercent / 100) * usableWidth);
}

function getEventType(event) {
    return event.type || "point";
}

function getEventStartYear(event) {
    if (typeof event.start === 'number') return event.start;
    if (typeof event.year === 'number') return event.year;
    return TIMELINE_START_YEAR;
}

function getEventEndYear(event) {
    if (typeof event.end === 'number') return event.end;
    if (typeof event.year === 'number') return event.year;
    return getEventStartYear(event);
}

function getEventCenterYear(event) {
    const start = getEventStartYear(event);
    const end = getEventEndYear(event);
    return (start + end) / 2;
}

function getEventStartPercent(event) {
    return yearToPercent(getEventStartYear(event));
}

function getEventEndPercent(event) {
    return yearToPercent(getEventEndYear(event));
}

function getEventCenterPercent(event) {
    return yearToPercent(getEventCenterYear(event));
}

function getEventSpanPercent(event) {
    const startPercent = getEventStartPercent(event);
    const endPercent = getEventEndPercent(event);
    return Math.max(endPercent - startPercent, 0);
}

function getGapAfterEventInYears(previousEvent, nextEvent) {
    return getEventStartYear(nextEvent) - getEventEndYear(previousEvent);
}

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

function computeEventLayout() {
    const levelsMap = {};

    Object.keys(eventLayoutMap).forEach(eventId => {
        delete eventLayoutMap[eventId];
    });

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

        levelsMap[level].forEach(event => {
            const familyRootId = getFamilyRootId(event);

            if (!familyMap[familyRootId]) {
                familyMap[familyRootId] = [];
            }

            familyMap[familyRootId].push(event);
        });

        Object.values(familyMap).forEach(familyEvents => {
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

            sortedEvents.forEach(event => {
                const startPercent = getEventStartPercent(event);
                const endPercent = getEventEndPercent(event);
                const centerPercent = getEventCenterPercent(event);

                const occupiedEndPercent =
                    getEventType(event) === 'period'
                        ? endPercent + PERIOD_SAME_LANE_GAP_PERCENT
                        : endPercent;

                let lane = 0;

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

function updateTimelineHeight() {
    const tops = Object.values(eventLayoutMap).map(layout => layout.top);
    const requiredHeight = tops.length
        ? Math.max(...tops) + TIMELINE_BOTTOM_PADDING
        : BASE_TIMELINE_HEIGHT;

    timeline.style.height = `${Math.max(BASE_TIMELINE_HEIGHT, requiredHeight)}px`;
}

function getGraduationStepForZoom(zoomLevel) {
    if (zoomLevel >= 2.8) return 1;
    if (zoomLevel >= 1.8) return 2;
    if (zoomLevel >= 1.3) return 5;
    return 10;
}

function getFirstGraduationYear(step) {
    return Math.ceil(TIMELINE_START_YEAR / step) * step;
}

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

function hideOverlappingGraduationLabels() {
    const labels = Array.from(timeline.querySelectorAll('.graduation:not(.minor) .graduation-label'));

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

function shouldShowInlineYear(eventData) {
    return getLevel(eventData) === 0;
}

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

function renderEvents() {
    eventsData.forEach(event => {
        createEventElement(event);
    });
}

function renderTimeline() {
    timeline.innerHTML = '';
    computeEventLayout();
    updateTimelineHeight();
    renderGraduations();
    renderEvents();
}

function refreshGraduations() {
    const existingGraduations = timeline.querySelectorAll('.graduation');
    existingGraduations.forEach(graduation => graduation.remove());
    renderGraduations();
}

function updateBaseTimelineWidth() {
    baseTimelineWidth = Math.max(timelineContainer.clientWidth, 640);
}

function applyZoom(zoomLevel) {
    const previousStep = getGraduationStepForZoom(currentZoom);
    currentZoom = zoomLevel;
    timeline.style.width = `${baseTimelineWidth * zoomLevel}px`;

    const newStep = getGraduationStepForZoom(currentZoom);
    if (previousStep !== newStep) {
        refreshGraduations();
        return;
    }

    hideOverlappingGraduationLabels();
}

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

function getAncestors(eventId) {
    const ancestors = [];
    let currentEvent = eventsMap[eventId];

    while (currentEvent && currentEvent.parent) {
        ancestors.unshift(currentEvent.parent);
        currentEvent = eventsMap[currentEvent.parent];
    }

    return ancestors;
}

function isRootEvent(event) {
    return !event.parent;
}

function shouldBeVisible(event) {
    if (isRootEvent(event)) {
        return true;
    }

    if (!activeEventId) {
        return false;
    }

    const path = [...getAncestors(activeEventId), activeEventId];
    return path.includes(event.parent);
}

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
}

function updateEventsState() {
    const activePath = activeEventId ? [...getAncestors(activeEventId), activeEventId] : [];

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

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateZoomAndScroll(targetZoom, targetScrollLeft, duration = ANIMATION_DURATION) {
    const startZoom = currentZoom;
    const startScrollLeft = timelineContainer.scrollLeft;
    const startTime = performance.now();

    isAnimating = true;

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

function goBackOneLevel() {
    if (isAnimating || !activeEventId) return;

    const currentEvent = eventsMap[activeEventId];
    if (!currentEvent.parent) return;

    const parentEvent = eventsMap[currentEvent.parent];
    focusOnEvent(parentEvent.id);
}

function resetView() {
    if (isAnimating) return;

    activeEventId = null;
    updateEventsVisibility();
    updateEventsState();
    updateButtons();

    animateZoomAndScroll(DEFAULT_ZOOM, 0);
}

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

function handleViewportResize() {
    if (isAnimating) return;

    updateBaseTimelineWidth();
    applyZoom(currentZoom);

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

backButton.addEventListener('click', goBackOneLevel);
resetViewButton.addEventListener('click', resetView);
closeModal.addEventListener('click', closeModalWindow);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalWindow();
    }
});

document.addEventListener('click', (e) => {
    const clickedInlineTerm = e.target.closest('.inline-term');

    if (!clickedInlineTerm && !e.target.closest('#tooltip-card')) {
        hideTooltipCard();
    }

    handleBackgroundNavigationClick(e.target);
});

window.addEventListener('scroll', hideTooltipCard);
window.addEventListener('resize', hideTooltipCard);
window.addEventListener('resize', handleViewportResize);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalWindow();
    }
});

updateBaseTimelineWidth();
renderTimeline();
applyZoom(DEFAULT_ZOOM);
updateEventsVisibility();
updateEventsState();
updateButtons();
