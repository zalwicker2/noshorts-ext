function DeleteShit(identifier, parentSelector = '') {
    let shittyVideos = document.querySelectorAll(identifier);
    if (parentSelector == '' || parentSelector == null) {
        shittyVideos.forEach(item => {
            item.remove();
        })
    } else {
        shittyVideos.forEach(item => {
            const parentToRemove = item.closest(parentSelector);
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
        { identifier: 'yt-multi-page-menu-section-renderer:nth-child(2)' },
        { identifier: 'yt-multi-page-menu-section-renderer:nth-child(2)' },
    ]
}

const shittyDynamicIndex = {
    "shorts": [
        { identifier: 'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]', parentSelector: 'ytd-grid-video-renderer,ytd-shelf-renderer' },
    ],
    "upcoming": [
        { identifier: 'ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]', parentSelector: 'ytd-grid-video-renderer,ytd-shelf-renderer' }
    ],
    "mix": [
        { identifier: 'a[href$="&start_radio=1"]', parentSelector: 'ytd-rich-item-renderer' }
    ],
    "watched": [
        { identifier: '#progress[style*="width: 100%"]', parentSelector: 'ytd-grid-video-renderer,ytd-shelf-renderer,ytd-rich-item-renderer' }
    ]
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

const observer = new MutationObserver((mutations, observer) => {
    ClearShittyIndex(shittyInitialIndex); // TODO: setup so this executes only at the beginning;
    ClearShittyIndex(shittyDynamicIndex);
});

const start = new MutationObserver((mutations, obs) => {
    const baseNode = document.querySelector('ytd-app #content ytd-page-manager ytd-browse[role="main"]')
    if (baseNode != null) {
        obs.disconnect();
        chrome.storage.local.get("yts-r_filter").then(values => {
            filter = JSON.parse(values["yts-r_filter"]);
            observer.observe(baseNode, { childList: true, subtree: true })
        })

    }
})

start.observe(document, { childList: true, subtree: true })