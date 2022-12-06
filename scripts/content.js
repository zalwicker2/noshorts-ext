function RunCode(event) {
    let shittyVideoIcons = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"], ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    shittyVideoIcons.forEach(item => {
        item.closest('ytd-grid-video-renderer').remove();
    })
};

document.addEventListener('DOMNodeInserted', RunCode);