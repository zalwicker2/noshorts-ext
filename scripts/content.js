function RunCode(event) {
    //console.log(event.relatedNode.nodeName + " " + event.relatedNode.matches('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]'))
    /*if(event.relatedNode.matches('ytd-grid-video-renderer')) {
        console.log(event.relatedNode.querySelector('a').href.match(/\/shorts\//));
    }*/
    let shittyVideoIcons = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"], ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    shittyVideoIcons.forEach(item => {
        const parentToRemove = item.closest('ytd-grid-video-renderer')
        if(parentToRemove != null) {
            parentToRemove.remove();
        }
    })
    let shittyVideoSection = document.querySelectorAll('.yt-simple-endpoint[title="Shorts"]')
    shittyVideoSection.forEach(item => {
        item.parentElement.remove();
    })
    let shittyMixSection = document.querySelectorAll('a[href$="&start_radio=1"]')
    shittyMixSection.forEach(item => {
        const parentToRemove = item.closest('ytd-rich-item-renderer');
        if(parentToRemove != null) {
            parentToRemove.remove();
        }
    })
};

document.addEventListener('DOMNodeInserted', RunCode);