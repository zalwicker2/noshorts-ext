chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({"yts-r_filter": JSON.stringify(['shorts'])})
    console.log('installed');
})