function EvenRows() {
    let rows = document.querySelectorAll('ytd-rich-grid-row');
    for (let i = 0; i < rows.length; i++) {
        if (rows[i] == null) {
            continue;
        }
        let root = rows[i].querySelector('div');
        if (root == null) {
            // wtf? how does this happen
            continue;
        }
        if (root.childElementCount < 4 && (i + 1) < rows.length) {
            root.append(rows[i + 1].querySelector('ytd-rich-item-renderer'));
            if (rows[i + 1].querySelector('ytd-rich-item-renderer') == null) {
                rows[i + 1].remove();
                rows[i + 1] = null;
            }
        }
    }
}

function DeleteShit(identifier, parentSelector = '', single = false) {
    let shittyVideos = [document.querySelector(identifier)];
    if (!single) {
        shittyVideos = document.querySelectorAll(identifier);
    }
    if (parentSelector == '' || parentSelector == null) {
        shittyVideos.forEach(item => {
            item.remove();
        });
    } else {
        shittyVideos.forEach(item => {
            const parentToRemove = item.closest(parentSelector);
            console.log(parentToRemove);
            if (parentToRemove != null) {
                parentToRemove.remove();
            }
        })
    }
}

const shittyInitialIndex = {
    "shorts": [{ identifier: '.yt-simple-endpoint[title="Shorts"]', parentSelector: 'ytd-guide-entry-renderer' }],
    "general_garbage": [
        { identifier: '#primary #header' },
        { identifier: 'ytd-guide-section-renderer:nth-child(3)' },
        { identifier: 'ytd-guide-section-renderer:nth-child(3)' },
        { identifier: '#guide-links-primary' },
        { identifier: '#guide-links-secondary' },
    ]
}

const shittyDynamicIndex = {
    "shorts": [
        { identifier: 'a[href*="shorts"]', parentSelector: 'ytd-guide-entry-renderer,ytd-grid-video-renderer,ytd-rich-item-renderer' },
        { identifier: 'ytd-rich-section-renderer' }
    ],
    "upcoming": [
        { identifier: 'ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]', parentSelector: 'ytd-grid-video-renderer,ytd-shelf-renderer' }
    ],
    "mixes": [
        { identifier: 'a[href$="&start_radio=1"]', parentSelector: 'ytd-rich-item-renderer' }
    ],
    "watched": [
        { identifier: '#progress[style*="width: 100%"]', parentSelector: 'ytd-grid-video-renderer,ytd-shelf-renderer,ytd-rich-item-renderer' }
    ],
    "general_garbage": [
        { identifier: '#rich-shelf-header', parentSelector: 'ytd-rich-section-renderer' }
    ]
}

function filterToIndex(filters, index) {
    let output = [];
    for (let filter of filters) {
        if (index[filter] != null) {
            output = output.concat(index[filter]);
        }
    }
    return output;
}

let filter = [];

function ClearShittyIndex(index) {
    for (const [key, settings] of Object.entries(index)) {
        if (filter.indexOf(key) != -1) {
            for (let setting of settings) {
                DeleteShit(setting.identifier, setting.parentSelector)
            }
        }
    }
}

function ClearShit(mutations, filters, once = false) {
    for (let mutation of mutations) {
        if (mutation.target.localName.indexOf('ytd') == -1 || (mutation.target.localName.indexOf('overlay') != -1 || mutation.target.id.indexOf('overlay') != -1 || mutation.target.localName.indexOf('icon') != -1 || mutation.target.localName.indexOf('badge') != -1 || mutation.target.id.indexOf('tooltip') != -1)) {
            continue;
        }
        if (mutation.addedNodes.length > 0) {
            console.log(filters)
            for (let i = 0; i < filters.length; i++) {
                let filter = filters[i];
                if (document.querySelector(filter.identifier)) {
                    console.log('found', filters[i])
                    DeleteShit(filter.identifier, filter.parentSelector)
                    if (once) {
                        filters.splice(i, 1);
                        if (filters.length == 0) {
                            return true;
                        }
                        i--;
                    }
                }
            }
        }
    }
    return false;
}

let initial_filters = [];

const initial_observer = new MutationObserver((mutations, observer) => {
    let all_removed = ClearShit(mutations, initial_filters, document, true)
    if (all_removed) {
        observer.disconnect();
    }
})

let dynamic_filters = [];

const dynamic_observer = new MutationObserver((mutations, observer) => {
    ClearShit(mutations, dynamic_filters, null, false)
    EvenRows();
});

const start = new MutationObserver((mutations, obs) => {
    baseNode = document.querySelector('ytd-app #content')
    if (baseNode != null) {
        obs.disconnect();
        chrome.storage.local.get('yts-r_filter').then(values => console.log(values));
        chrome.storage.local.get("yts-r_filter").then(values => {
            let savedFilters = values["yts-r_filter"];
            let filter = ['shorts'];
            if (savedFilters != null) {
                filter = JSON.parse(savedFilters);
            }

            initial_filters = filterToIndex(filter, shittyInitialIndex)
            initial_observer.observe(document, { childList: true, subtree: true })

            dynamic_filters = filterToIndex(filter, shittyDynamicIndex)
            dynamic_observer.observe(baseNode, { childList: true, subtree: true })
        })
    }
})

start.observe(document, { childList: true, subtree: true })