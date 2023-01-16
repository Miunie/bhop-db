import Records from './records.json' assert {type: 'json'};
import Players from './players.json' assert {type: 'json'};

function compareFull(a, b) {
    return toMs(a.time.toString()) - toMs(b.time.toString());
}

// HSW W SW AD
let colors = ["amber","emerald","indigo","rose"]

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("select-all").addEventListener("click", selectAll);

    document.getElementById("select-hsw").addEventListener("click", selectHSW);
    document.getElementById("select-hsw").classList.add(`text-${colors[0]}-300`, `outline-${colors[0]}-400/[.4]`, `hover:bg-${colors[0]}-400/[0.1]`);

    document.getElementById("select-w").addEventListener("click", selectW);
    document.getElementById("select-w").classList.add(`text-${colors[1]}-300`,`outline-${colors[1]}-400/[.4]`,`hover:bg-${colors[1]}-400/[0.1]`);

    document.getElementById("select-sw").addEventListener("click", selectSW);
    document.getElementById("select-sw").classList.add(`text-${colors[2]}-300`,`outline-${colors[2]}-400/[.4]`,`hover:bg-${colors[2]}-400/[0.1]`);

    document.getElementById("select-ad").addEventListener("click", selectAD);
    document.getElementById("select-ad").classList.add(`text-${colors[3]}-300`,`outline-${colors[3]}-400/[.4]`,`hover:bg-${colors[3]}-400/[0.1]`);

    render();
}, false);

let mapf = document.getElementById("mapfilter");
mapf.addEventListener("input", updateMapFilter);
let filters = ["", ""];
const records = JSON.parse(JSON.stringify(Records.records));
const players = JSON.parse(JSON.stringify(Players.players));

function render() {
    let filteredrecords = [];
    let recordstable = document.getElementById("recordstable");  
    removeChildren(recordstable);
    let i=0;
    let limit=100;
    for (var record of records) {
        let push = false;
        if (filters[0] == "") {
            if (filters[1] == "")
                push = true;
            else if (record['style'] == filters[1]) {
                push = true;
            }
        }
        else if (record['map'].includes(filters[0]))
            if (filters[1]=="")
                push = true;
            else {
                if (record['style'] == filters[1])
                    push = true;
            }
        if (push) {
            filteredrecords.push(record);
        }
    }
    filteredrecords.sort(compareFull);
    for (var record of filteredrecords) {
        let color;
        switch (record.style) {
            case "HSW":
                color = colors[0];
                break;
            case "W":
                color = colors[1];
                break;
            case "SW":
                color = colors[2];
                break;
            case "A/D":
                color = colors[3];
                break;
        }
        let intpart = record.time.split(".")[0];
        let decpart = record.time.split(".")[1];
        if (decpart.length == 1) decpart+="00";
        if (decpart.length == 2) decpart+="0";

        const row = document.createElement("tr");
        row.setAttribute("id", record.map);
        row.className=`table-row cursor-pointer odd:bg-slate-700 hover:bg-slate-800 even:bg-slate-700/[0.7] transition ease-in-out duration-300`;
        row.innerHTML = `
                <td class="rank text-white/[.5] text-sm px-2">${i+1}</td>
                <td class="map-text text-center">${record.map}</td>
                <td class="text-right">${intpart}<span class="text-white/[.5] text-sm">.${decpart}</span></td>
                <td class="text-${color}-300">${record.style}</td>
                <td class="text-left">
                <img alt="${players.find(x=>x.name===record.player).country}" src="./assets/flags/${players.find(x=>x.name===record.player).country}.svg"class="inline shadow-md" width="28" height="21"/>
                <p id="name" class="inline">${record.player}</p></td>
                <td>${record.server}</td>`;
        (function(){
            row.addEventListener("click", function() {
                mapf.value = row.id;
                filters[0] = row.id;
                render();
            })
        })(i)
        i++;
        recordstable.appendChild(row);
        if (i >= limit) break;
    };
}

function toMs(time) {
    let intpart = time.split(".")[0];
    let decpart = time.split(".")[1];
    if (decpart.length == 1) decpart+="00";
    if (decpart.length == 2) decpart+="0";

    let secs=0, mins=0, hours=0;

    if (intpart.split(":").length - 1 > 0) {
        switch (intpart.split(":").length - 1) {
            case 1: mins = intpart.split(":")[0]; secs = intpart.split(":")[1]; break;
            case 2: hours = intpart.split(":")[0]; mins = intpart.split(":")[1]; secs = intpart.split(":")[2]; break;
        }
    } else secs = intpart;
    
    decpart = parseInt(decpart);
    secs = parseInt(secs);
    mins = parseInt(mins);
    hours = parseInt(hours);

    return hours * 3600000 + mins * 60000 + secs * 1000 + decpart;
}

function selectAll() {
    console.log('bip');
    filters[1]="";
    render();
}
function selectHSW() {
    console.log('bip');
    filters[1]="HSW";
    render();
}
function selectW() {
    console.log('bip');
    filters[1]="W";
    render();
}
function selectSW() {
    console.log('bip');
    filters[1]="SW";
    render();
}
function selectAD() {
    console.log('bip');
    filters[1]="A/D";
    render();
}

function removeChildren(e) {
    e.innerHTML = '';
    while (e.hasChildNodes()) e.removeChild(e.lastChild);
}

function updateMapFilter(e) {
    filters[0] = e.target.value;
    console.log(e.target.value)
    render();
}