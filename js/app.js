const apiEndpointProcessors = "https://javascript.cesararacena.com/json/processors.json";
const apiEndpointMotherboards = "https://javascript.cesararacena.com/json/motherboards.json";

let dataSelectedProcessor = {};

const selectionBoxProcessors = document.getElementById("processor_select");

const infoBoxProcessors = document.getElementById("processor_select_info");
const infoBoxPrice = document.getElementById("total_price");

const infoBox = document.getElementById("information_box");

let processorInfoBox = "";
let totalPrice = 0;
let processorPrice = 0;

window.onload = function () {
    infoBoxProcessors.style.display = "none";
    infoBoxPrice.innerHTML = "$" + totalPrice.toFixed(2);
};

function updateInfoBox() {
    infoBox.innerHTML = processorInfoBox;
}

function updateTotalPrice() {
    totalPrice = processorPrice;
    infoBoxPrice.innerHTML = "$" + totalPrice.toFixed(2);
}

async function fetchData(endpoint) {
    let response = await fetch(endpoint);
    let data = await response.json();
    return data;
}

fetchData(apiEndpointProcessors)
    .then((data) => {
        dataSelectedProcessor = data;
        selectionBoxProcessors.removeAttribute("disabled");
        for (let i = 0; i < data.length; i += 1) {
            selectionBoxProcessors.innerHTML =
                selectionBoxProcessors.innerHTML +
                '<option value="' +
                data[i]["processor_id"] +
                '">' +
                data[i]["manufacturer"] +
                " " +
                data[i]["commercial_name"] +
                " " +
                data[i]["clock_speed"] +
                " Ghz" +
                "</option>";
        }
    })
    .catch((reason) => console.log("Msg: " + reason));

selectionBoxProcessors.onchange = function (e) {
    let selectedProcessor = this.selectedIndex;
    if (selectedProcessor == 0) {
        infoBoxProcessors.style.visibility = "hidden";
        infoBoxProcessors.style.display = "none";
        processorInfoBox = "";
        processorPrice = 0;
        updateInfoBox();
        updateTotalPrice();
    } else {
        infoBoxProcessors.style.display = "flex";
        infoBoxProcessors.style.visibility = "visible";
        processorInfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "Procesador: " +
            dataSelectedProcessor[selectedProcessor - 1]["manufacturer"] +
            " " +
            dataSelectedProcessor[selectedProcessor - 1]["commercial_name"] +
            " " +
            dataSelectedProcessor[selectedProcessor - 1]["clock_speed"] +
            " Ghz" +
            '</div>' +
            '<div class="p-2 flex-fill text-end">$' +
            dataSelectedProcessor[selectedProcessor - 1]["price"] +
            '</div>' +
            '</div>';
        processorPrice = dataSelectedProcessor[selectedProcessor - 1]["price"];
        document.getElementById("processor_select_info").innerHTML =
            '<div class="col-xs-12 col-md-6" id="processor_select_socket">Socket: ' +
            dataSelectedProcessor[selectedProcessor - 1]["socket_standard"] +
            '</div>' +
            '<div class="col-xs-12 col-md-6" id="processor_select_series">Serie: ' +
            dataSelectedProcessor[selectedProcessor - 1]["series_name"] +
            '</div>' +
            '<div class="col-xs-12 col-md-6" id="processor_select_cores">Cores: ' +
            dataSelectedProcessor[selectedProcessor - 1]["cores"] +
            '</div>' +
            '<div class="col-xs-12 col-md-6" id="processor_select_threads">Threads: ' +
            dataSelectedProcessor[selectedProcessor - 1]["total_threads"] +
            '</div>' +
            '<div class="col-xs-12 col-md-6" id="processor_select_ddr_01">DDR4: ' +
            (dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_type"]["ddr4_capable"] ? "Si - " + dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_speed"]["max_speed_dd4"] : 'No') +
            '</div>' +
            '<div class="col-xs-12 col-md-6" id="processor_select_ddr_01">DDR5: ' +
            (dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_type"]["ddr5_capable"] ? "Si - " + dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_speed"]["max_speed_dd5"] : 'No') +
            '</div>' +
            '<div class="col-xs-12 col-md-6" id="processor_select_graphics">Gr&aacute;ficos: ' +
            (dataSelectedProcessor[selectedProcessor - 1]["included_graphics"] ? "Si" : 'No') +
            '</div>' +
            '<div class="col-xs-12 col-md-6" id="processor_select_price">Precio: ' +
            dataSelectedProcessor[selectedProcessor - 1]["price"].toFixed(2) +
            '</div>';
        updateInfoBox();
        updateTotalPrice();
    }
};