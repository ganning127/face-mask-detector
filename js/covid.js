function init() {
    const endpoint = "https://api.covid19api.com/summary";
    fetch(endpoint)
        .then(resp => resp.json())
        .then(data => {
            const globalCases = addCommas(data.Global.TotalConfirmed) + " cases.";
            const globalDeaths = addCommas(data.Global.TotalDeaths) + " deaths."

            document.getElementById("covid-title").innerHTML = `${globalCases}<br>${globalDeaths}` ;
        })
}

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

init();