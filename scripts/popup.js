
function UpdateCheckmarks(filters) {
    chrome.storage.local.get("yts-r_filter").then(values => {
        filters = JSON.parse(values["yts-r_filter"]);
        document.querySelectorAll('input').forEach(input => {
            input.checked = filters.indexOf(input.getAttribute('name')) != -1;
        })
    })
}

function Change(category) {
    chrome.storage.local.get("yts-r_filter").then(values => {
        let filters = JSON.parse(values["yts-r_filter"]);
        let pos = filters.indexOf(category)
        if (pos != -1) {
            filters.splice(pos, 1)
        } else {
            filters.push(category)
        }
        console.log(filters)
        return chrome.storage.local.set({ "yts-r_filter": JSON.stringify(filters) });
    }).then(() => {
        document.getElementById('notice').style.display = 'block';
        UpdateCheckmarks();
    }
    )
    //let value = localStorage.getItem("yts-r_" + category);
    //localStorage.setItem("yts-r_" + category, !value)
}

document.querySelectorAll('input').forEach(item => {
    const category = item.getAttribute('name')
    item.addEventListener('change', event => {
        Change(category)
    })
})

UpdateCheckmarks();

document.querySelector('img').setAttribute('src', chrome.runtime.getURL('images/noshorts48.png'))

console.log("Loaded");