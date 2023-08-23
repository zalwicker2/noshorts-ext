let defaultValues = [
    'shorts'
]

function setDefaultValues() {
    return chrome.storage.local.set({"yts-r_filter": JSON.stringify(defaultValues)})
}

function UpdateCheckmarks(filters) {
    chrome.storage.local.get("yts-r_filter").then(values => {
        let filters = [];
        let savedFilters = values["yts-r_filter"]
        if(savedFilters == null) {
            setDefaultValues();
            filters = defaultValues;
        } else {
            filters = JSON.parse(savedFilters)
        }
        document.querySelectorAll('input').forEach(input => {
            input.checked = filters.indexOf(input.getAttribute('name')) != -1;
        })
    })
}

function Change(category) {
    chrome.storage.local.get("yts-r_filter").then(async values => {
        return new Promise(async resolve => {
            let savedFilters = values["yts-r_filter"]
            if(savedFilters == null) {
                await setDefaultValues();
            }
            let filters = JSON.parse(values["yts-r_filter"]);
            let pos = filters.indexOf(category)
            if (pos != -1) {
                filters.splice(pos, 1)
            } else {
                filters.push(category)
            }
            resolve(filters);
        })
    }).then(filters => {
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