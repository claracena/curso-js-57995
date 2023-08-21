const apiEndpointProcessors = "https://javascript.cesararacena.com/json/processors.json";
const apiEndpointMotherboards = "https://javascript.cesararacena.com/json/motherboards.json";

let dataSelectedProcessor = {};
let dataSelectedMotherboard = {};

const selectionBoxProcessors = document.getElementById("processor_select");
const selectionBoxMotherboards = document.getElementById("motherboard_select");

const infoBoxProcessors = document.getElementById("processor_select_info");
const infoBoxMotherboards = document.getElementById("motherboard_select_info");

const infoBoxPrice = document.getElementById("total_price");
const infoBox = document.getElementById("information_box");

let processorInfoBox = "";
let motherboardInfoBox = "";
let processorPrice = 0;
let motherboardPrice = 0;
let totalPrice = 0;

let selectedProcessor = 0;
let selectedMotherboard = 0;

window.onload = function () {
    infoBoxProcessors.style.display = "none";
    infoBoxMotherboards.style.display = "none";
    infoBoxPrice.innerHTML = "$" + totalPrice.toFixed(2);
};

function updateInfoBox() {
    infoBox.innerHTML = processorInfoBox + motherboardInfoBox;
}

function updateTotalPrice() {
    totalPrice = processorPrice + motherboardPrice;
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

// if (selectedProcessor != 0) {
//     fetchData(apiEndpointMotherboards)
//         .then((data) => {
//             dataSelectedMotherboard = data;
//             selectionBoxMotherboards.removeAttribute("disabled");
//             for (let i = 0; i < data.length; i += 1) {
//                 selectionBoxMotherboards.innerHTML =
//                     selectionBoxMotherboards.innerHTML +
//                     '<option value="' +
//                     data[i]["motherboard_id"] +
//                     '">' +
//                     data[i]["platform"] +
//                     " " +
//                     // data[i]["manufacturer_category"] +
//                     // " " +
//                     data[i]["commercial_name"] +
//                     " " +
//                     data[i]["chipset"] +
//                     "</option>";
//             }
//         })
//         .catch((reason) => console.log("Msg: " + reason));
// }

selectionBoxProcessors.onchange = function (e) {
    selectedProcessor = this.selectedIndex;

    if (selectedProcessor == 0) {
        infoBoxProcessors.style.visibility = "hidden";
        infoBoxProcessors.style.display = "none";
        processorInfoBox = "";
        processorPrice = 0;

        if (!selectionBoxMotherboards.disabled) {
            selectionBoxMotherboards.setAttribute("disabled", "");
            selectionBoxMotherboards.value = 0;
            motherboardPrice = 0;
        }

        updateInfoBox();
        updateTotalPrice();
    } else {
        fetchData(apiEndpointMotherboards)
            .then((data) => {
                dataSelectedMotherboard = data;
                selectionBoxMotherboards.innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';
                if (selectionBoxMotherboards.disabled) {
                    selectionBoxMotherboards.removeAttribute("disabled");
                }
                for (let i = 0; i < data.length; i += 1) {
                    console.log(dataSelectedProcessor[selectedProcessor - 1]["socket_standard"]);
                    if (dataSelectedProcessor[selectedProcessor - 1]["socket_standard"] == data[i]["socket_standard"]) {
                        selectionBoxMotherboards.innerHTML =
                            selectionBoxMotherboards.innerHTML +
                            '<option value="' +
                            data[i]["motherboard_id"] +
                            '">' +
                            data[i]["manufacturer"] +
                            " " +
                            data[i]["commercial_name"] +
                            " " +
                            data[i]["chipset"] +
                            "</option>";
                    }
                }
            })
            .catch((reason) => console.log("Msg: " + reason));

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
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataSelectedProcessor[selectedProcessor - 1]["price"].toFixed(2) +
            "</div>" +
            "</div>";
        processorPrice = dataSelectedProcessor[selectedProcessor - 1]["price"];
        document.getElementById("processor_select_info").innerHTML =
            '<div class="col-xs-12 col-md-6" id="processor_select_socket">Socket: ' +
            dataSelectedProcessor[selectedProcessor - 1]["socket_standard"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="processor_select_series">Serie: ' +
            dataSelectedProcessor[selectedProcessor - 1]["series_name"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="processor_select_cores">Cores: ' +
            dataSelectedProcessor[selectedProcessor - 1]["cores"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="processor_select_threads">Threads: ' +
            dataSelectedProcessor[selectedProcessor - 1]["total_threads"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="processor_select_ddr_01">DDR4: ' +
            (dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_type"]["ddr4_capable"]
                ? "Si - " + dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_speed"]["max_speed_dd4"]
                : "No") +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="processor_select_ddr_01">DDR5: ' +
            (dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_type"]["ddr5_capable"]
                ? "Si - " + dataSelectedProcessor[selectedProcessor - 1]["compatibility"]["memory_speed"]["max_speed_dd5"]
                : "No") +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="processor_select_graphics">Gr&aacute;ficos: ' +
            (dataSelectedProcessor[selectedProcessor - 1]["included_graphics"] ? "Si" : "No") +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="processor_select_price">Precio: $' +
            dataSelectedProcessor[selectedProcessor - 1]["price"].toFixed(2) +
            "</div>";
        updateInfoBox();
        updateTotalPrice();
    }
};

selectionBoxMotherboards.onchange = function (e) {
    selectedMotherboard = this.selectedIndex;
    if (selectedMotherboard == 0) {
        infoBoxMotherboards.style.visibility = "hidden";
        infoBoxMotherboards.style.display = "none";
        motherboardInfoBox = "";
        motherboardPrice = 0;

        if (!selectionBoxMotherboards.disabled && selectedProcessor == 0) {
            selectionBoxMotherboards.setAttribute("disabled", "");
            selectionBoxMotherboards.value = 0;
            motherboardPrice = 0;
        }

        updateInfoBox();
        updateTotalPrice();
    } else {
        infoBoxMotherboards.style.display = "flex";
        infoBoxMotherboards.style.visibility = "visible";
        motherboardInfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "Motherboard: " +
            dataSelectedMotherboard[selectedMotherboard - 1]["manufacturer"] +
            " " +
            dataSelectedMotherboard[selectedMotherboard - 1]["commercial_name"] +
            " " +
            dataSelectedMotherboard[selectedMotherboard - 1]["chipset"] +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataSelectedMotherboard[selectedMotherboard - 1]["price"].toFixed(2) +
            "</div>" +
            "</div>";
        motherboardPrice = dataSelectedMotherboard[selectedMotherboard - 1]["price"];
        document.getElementById("motherboard_select_info").innerHTML =
            '<div class="col-xs-12 col-md-6" id="motherboard_select_socket">Socket: ' +
            dataSelectedMotherboard[selectedMotherboard - 1]["socket_standard"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_platform">Plataforma: ' +
            dataSelectedMotherboard[selectedMotherboard - 1]["platform"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_form_factor">Form Factor: ' +
            dataSelectedMotherboard[selectedMotherboard - 1]["form_factor"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_storage_m2">Soporta M.2: ' +
            (dataSelectedMotherboard[selectedMotherboard - 1]["storage"]["m2_slots"] > 0
                ? "Si (" + dataSelectedMotherboard[selectedMotherboard - 1]["storage"]["m2_slots"] + ")"
                : "No") +
            "</div>";

        updateInfoBox();
        updateTotalPrice();
    }
};
