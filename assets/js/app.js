// Constantes para almacenar los endpoints de los JSONs
const apiEndpointProcessors = "https://javascript.cesararacena.com/json/processors.json";
const apiEndpointMotherboards = "https://javascript.cesararacena.com/json/motherboards.json";
const apiEndpointRam = "https://javascript.cesararacena.com/json/ram.json";

// Constantes que almacenan las direcciones del DOM a actualizar
const selectionBoxProcessors = document.getElementById("processor_select");
const selectionBoxMotherboards = document.getElementById("motherboard_select");
const selectionBoxRam = document.getElementById("ram_select");
const selectionBoxRamQty = document.getElementById("ram_select_qty");
const selectionBoxCountry = document.getElementById("select_pais");
const infoBoxProcessors = document.getElementById("processor_select_info");
const infoBoxMotherboards = document.getElementById("motherboard_select_info");
const infoBoxRam = document.getElementById("ram_select_info");
const infoBoxPrice = document.getElementById("total_price");
const infoBox = document.getElementById("information_box");

// Variables para almacenar el array de los productos seleccionados en cada opcion
let dataSelectedProcessor = {};
let dataSelectedMotherboard = {};
let dataFilteredMotherboards = [];
let dataSelectedRam = {};
let dataFilteredRam = [];
let memoryAllowed = [];

// Variables para almacenar valores que cambian con cada cambio de seleccion
let selectedProcessor = 0;
let selectedMotherboard = 0;
let selectedRam = 0;
let selectedRamQty = 0;
let processorInfoBox = "";
let motherboardInfoBox = "";
let ramInfoBox = "";
let processorPrice = 0;
let motherboardPrice = 0;
let ramPrice = 0;
let totalPrice = 0;
let selectedCountry = "";
let taxPct = 1;
let taxAlone = 0;
let total = 0;
let cpuWattage = 0;
let motherboardWattage = 0;
let ramWattage = 0;
let totalWattage = 0;
let totalRam = 0;
let totalRamKits = 0;

// Reset de visualizaciones al cargar la pagina por primera vez
window.onload = function () {
    infoBoxProcessors.style.display = "none";
    infoBoxMotherboards.style.display = "none";
    infoBoxRam.style.display = "none";
    infoBoxPrice.innerHTML =
        '<div class="d-flex">' +
        '<div class="p-2 flex-fill">' +
        "Sub-Total" +
        "</div>" +
        '<div class="p-2 flex-fill text-end">' +
        "$" +
        (0.0).toFixed(2) +
        "</div>" +
        "</div>";
};

// Funcion para formatear el HTML para mostrar el total de consumo
function showWattage() {
    totalWattage = 0;
    totalWattage = cpuWattage + motherboardWattage + ramWattage;
    return (
        "<hr>" +
        '<div class="d-flex">' +
        '<div class="p-2 flex-fill">' +
        "Consumo total (m&aacute;ximo)" +
        "</div>" +
        '<div class="p-2 flex-fill text-end">' +
        totalWattage +
        " W" +
        "</div>" +
        "</div>"
    );
}

// Funcion para actualizar el detalle de los productos seleccionados
function updateInfoBox() {
    infoBox.innerHTML = "";
    infoBox.innerHTML = processorInfoBox + motherboardInfoBox + ramInfoBox + showWattage();
}

// Funcion para actualizar los valores en el detalle
function updateTotalPrice() {
    totalPrice = processorPrice + motherboardPrice + ramPrice;

    if (totalPrice <= 0) {
        taxAlone = 0;
        total = totalPrice;
    } else {
        taxAlone = totalPrice * taxPct - totalPrice;
        total = totalPrice * taxPct;
    }

    infoBoxPrice.innerHTML =
        "<hr>" +
        '<div class="d-flex">' +
        '<div class="p-2 flex-fill">Sub-Total</div>' +
        '<div class="p-2 flex-fill text-end">' +
        "$" +
        totalPrice.toFixed(2) +
        "</div>" +
        "</div>" +
        '<div class="d-flex">' +
        // '<div class="p-2 flex-fill">IVA (' + parseFloat((taxPct * 100) - 100).toFixed(2) + '%)</div>' +
        '<div class="p-2 flex-fill">IVA</div>' +
        '<div class="p-2 flex-fill text-end">' +
        "$" +
        taxAlone.toFixed(2) +
        "</div>" +
        "</div>" +
        '<div class="d-flex">' +
        '<div class="p-2 flex-fill">TOTAL (estimado en U$D' +
        (taxAlone > 0 ? " en su pa&iacute;s" : "") +
        ")</div>" +
        '<div class="p-2 flex-fill text-end">' +
        "$" +
        total.toFixed(2) +
        "</div>" +
        "</div>" +
        "<hr>";
}

// Funcion general para traer datos de un endpoint
async function fetchData(endpoint) {
    let response = await fetch(endpoint);
    let data = await response.json();
    return data;
}

function resetAll() {
    infoBox.innerHTML = "";
    selectionBoxProcessors.value = 0;
    let event = new Event("change");
    selectionBoxProcessors.dispatchEvent(event);
    selectionBoxMotherboards.dispatchEvent(event);
    selectionBoxRam.dispatchEvent(event);
    selectionBoxRamQty.dispatchEvent(event);
    selectionBoxCountry.dispatchEvent(event);

    processorInfoBox = '';
    motherboardInfoBox = '';
    ramInfoBox = '';
}

// Usamos la funcion fetchData() para cargar la lista de procesadores
// cuando se carga la pagina
fetchData(apiEndpointProcessors)
    .then((data) => {
        dataSelectedProcessor = data;
        // Habilitamos el dropdown de los procesadores una vez que
        // la info esta cargada
        selectionBoxProcessors.removeAttribute("disabled");
        // Generamos el HTML para llenar el dropdown con los procesadores
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

// Escuchamos el evento de cambio de seleccion del dropdown de procesadores
selectionBoxProcessors.onchange = function (e) {
    selectedProcessor = this.selectedIndex;

    // Si no el usuario vuelve a la opcion 0, procedemos a limpiar
    // toda la info insertada en el DOM anteriormente
    if (selectedProcessor == 0) {
        infoBoxProcessors.style.visibility = "hidden";
        infoBoxProcessors.style.display = "none";
        // processorInfoBox = "";
        processorPrice = 0;
        cpuWattage = 0;

        infoBoxMotherboards.style.visibility = "hidden";
        infoBoxMotherboards.style.display = "none";
        // motherboardInfoBox = "";
        motherboardPrice = 0;
        motherboardWattage = 0;

        // Al volver a la opcion de procesador 0, reseteamos el dropdown
        // de los otros componentes tambien. El usuario debe
        // voler a comenzar desde el paso 1
        if (!selectionBoxMotherboards.disabled) {
            // Motherboards
            selectionBoxMotherboards.setAttribute("disabled", "");
        }

        if (!selectionBoxRam.disabled) {
            // RAM
            selectionBoxRam.setAttribute("disabled", "");
        }

        if (!selectionBoxRamQty.disabled) {
            // RAM QTY
            selectionBoxRamQty.setAttribute("disabled", "");
        }
        
        selectionBoxRam.value = 0;
        selectionBoxRamQty.innerHTML = '<option value="0" selected>Cantidad</option>';
        selectionBoxRamQty.value = 0;
        selectionBoxMotherboards.value = 0;

        motherboardPrice = 0;
        ramPrice = 0;
        ramWattage = 0;
        totalRam = 0;
        totalRamKits = 0;
        
        processorInfoBox = '';
        motherboardInfoBox = '';
        ramInfoBox = '';

        // Actualizamos el DOM con las propiedades en blanco y
        // el precio en $0.00
        updateInfoBox();
        updateTotalPrice();
    } else {
        infoBoxMotherboards.style.visibility = "hidden";
        infoBoxMotherboards.style.display = "none";
        motherboardInfoBox = "";
        motherboardPrice = 0;

        // Si por el contrario el usuario selecciono un procesador,
        // traemos la info de los otros componentes
        fetchData(apiEndpointMotherboards)
            .then((data) => {
                dataSelectedMotherboard = data;
                selectionBoxMotherboards.innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';

                // Habilitamos el selector del dropdown del proximo componente
                if (selectionBoxMotherboards.disabled) {
                    selectionBoxMotherboards.removeAttribute("disabled");
                }
                dataFilteredMotherboards = [];
                for (let i = 0; i < dataSelectedMotherboard.length; i += 1) {
                    // Solo ponemos en el dropdown los motherboards que son compatibles
                    // con el procesador seleccionado
                    if (dataSelectedProcessor[selectedProcessor - 1]["socket_standard"] == dataSelectedMotherboard[i]["socket_standard"]) {
                        dataFilteredMotherboards.push(dataSelectedMotherboard[i]);
                        selectionBoxMotherboards.innerHTML =
                            selectionBoxMotherboards.innerHTML +
                            '<option value="' +
                            dataSelectedMotherboard[i]["motherboard_id"] +
                            '">' +
                            dataSelectedMotherboard[i]["manufacturer"] +
                            " " +
                            dataSelectedMotherboard[i]["commercial_name"] +
                            " " +
                            dataSelectedMotherboard[i]["chipset"] +
                            " " +
                            dataSelectedMotherboard[i]["socket_standard"] +
                            "</option>";
                    }
                }
            })
            .catch((reason) => console.log("Msg: " + reason));

        // Y habilitamos las partes del DOM que muestran info sobre el procesador seleccionado
        infoBoxProcessors.style.display = "flex";
        infoBoxProcessors.style.visibility = "visible";
        // Preparamos la info que se mostrara del procesador seleccionado en
        // la parte de "detalle"
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
            " " +
            '<a href="dataSelectedProcessor[selectedProcessor - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataSelectedProcessor[selectedProcessor - 1]["price"].toFixed(2) +
            "</div>" +
            "</div>";

        // Pasamos el precio del procesador seleccionado para la suma del
        // total en la parte del "detalle"
        processorPrice = dataSelectedProcessor[selectedProcessor - 1]["price"];

        // Agregamos el consumo de potencia maximo al total de consumo
        cpuWattage = dataSelectedProcessor[selectedProcessor - 1]["power_consumption"]["max_power"];

        // Mostramos info basica sobre el procesador seleccionado
        // debajo del dropdown
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

        // Llamamos las funciones para actualizar la info en detalle
        // (precio y descripcion)
        updateInfoBox();
        updateTotalPrice();
    }
};

// Escuchamos el evento de cambio de seleccion del dropdown de motherboards
selectionBoxMotherboards.onchange = function (e) {
    selectedMotherboard = this.selectedIndex;
    if (selectedMotherboard == 0 || selectedProcessor == 0) {
        infoBoxMotherboards.style.visibility = "hidden";
        infoBoxMotherboards.style.display = "none";
        motherboardInfoBox = "";
        motherboardPrice = 0;
        motherboardWattage - 0;

        infoBoxRam.style.visibility = "hidden";
        infoBoxRam.style.display = "none";
        ramInfoBox = "";
        ramPrice = 0;
        ramWattage = 0;
        totalRam = 0;
        totalRamKits = 0;

        if (selectedMotherboard == 0 || (selectionBoxMotherboards.disabled && selectedProcessor == 0)) {
            // selectionBoxMotherboards.setAttribute("disabled", "");
            // selectionBoxMotherboards.value = 0;
            // motherboardPrice = 0;

            selectionBoxRam.setAttribute("disabled", "");
            selectionBoxRam.value = 0;
            ramPrice = 0;
            ramWattage = 0;

            selectionBoxRamQty.setAttribute("disabled", "");
            selectionBoxRamQty.innerHTML = '<option value="0" selected>Cantidad</option>';
            selectionBoxRamQty.value = 0;
        }

        updateInfoBox();
        updateTotalPrice();
    } else {
        // infoBoxRam.style.visibility = "hidden";
        // infoBoxRam.style.display = "none";
        // ramInfoBox = "";
        // ramPrice = 0;

        fetchData(apiEndpointRam)
            .then((data) => {
                dataSelectedRam = data;
                selectionBoxRam.innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';

                if (selectionBoxRam.disabled) {
                    selectionBoxRam.removeAttribute("disabled");
                }
                dataFilteredRam = [];
                for (let i = 0; i < dataSelectedRam.length; i += 1) {
                    if (
                        (dataSelectedMotherboard[selectedMotherboard - 1]["compatibility"]["memory_type"]["ddr3_capable"] == true &&
                            dataSelectedRam[i]["compatibility"]["memory_type"]["ddr3"] == true) ||
                        (dataSelectedMotherboard[selectedMotherboard - 1]["compatibility"]["memory_type"]["ddr4_capable"] == true &&
                            dataSelectedRam[i]["compatibility"]["memory_type"]["ddr4"] == true) ||
                        (dataSelectedMotherboard[selectedMotherboard - 1]["compatibility"]["memory_type"]["ddr5_capable"] == true &&
                            dataSelectedRam[i]["compatibility"]["memory_type"]["ddr5"] == true)
                    ) {
                        dataFilteredRam.push(dataSelectedRam[i]);
                        selectionBoxRam.innerHTML =
                            selectionBoxRam.innerHTML +
                            '<option value="' +
                            dataSelectedRam[i]["memory_id"] +
                            '">' +
                            dataSelectedRam[i]["manufacturer"] +
                            " " +
                            dataSelectedRam[i]["commercial_name"] +
                            " " +
                            dataSelectedRam[i]["total_capacity"] +
                            " GB (" +
                            dataSelectedRam[i]["sticks"] +
                            "x" +
                            dataSelectedRam[i]["capacity_per_stick"] +
                            " GB)" +
                            "</option>";
                    }
                }
            })
            .catch((reason) => console.log("Msg: " + reason));

        infoBoxMotherboards.style.display = "flex";
        infoBoxMotherboards.style.visibility = "visible";

        motherboardInfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "Motherboard: " +
            dataFilteredMotherboards[selectedMotherboard - 1]["manufacturer"] +
            " " +
            dataFilteredMotherboards[selectedMotherboard - 1]["commercial_name"] +
            " " +
            dataFilteredMotherboards[selectedMotherboard - 1]["chipset"] +
            " " +
            '<a href="dataFilteredMotherboards[selectedMotherboard - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataFilteredMotherboards[selectedMotherboard - 1]["price"].toFixed(2) +
            "</div>" +
            "</div>";
        motherboardPrice = dataFilteredMotherboards[selectedMotherboard - 1]["price"];

        // Agregamos el consumo de potencia maximo al total de consumo
        motherboardWattage = dataFilteredMotherboards[selectedMotherboard - 1]["power_consumption"]["max_power"];

        // Armamos la frase con los tipos de memoria
        memoryAllowed = [];
        if (dataFilteredMotherboards[selectedMotherboard - 1]["compatibility"]["memory_type"]["ddr3_capable"] == true) {
            memoryAllowed.push("DDR3(" + dataFilteredMotherboards[selectedMotherboard - 1]["compatibility"]["memory_max"]["ddr3_max_memory"] + ") ");
        }
        if (dataFilteredMotherboards[selectedMotherboard - 1]["compatibility"]["memory_type"]["ddr4_capable"] == true) {
            memoryAllowed.push("DDR4(" + dataFilteredMotherboards[selectedMotherboard - 1]["compatibility"]["memory_max"]["ddr4_max_memory"] + ") ");
        }
        if (dataFilteredMotherboards[selectedMotherboard - 1]["compatibility"]["memory_type"]["ddr5_capable"] == true) {
            memoryAllowed.push("DDR5(" + dataFilteredMotherboards[selectedMotherboard - 1]["compatibility"]["memory_max"]["ddr5_max_memory"] + ") ");
        }

        infoBoxMotherboards.innerHTML =
            '<div class="col-xs-12 col-md-6" id="motherboard_select_socket">Socket: ' +
            dataFilteredMotherboards[selectedMotherboard - 1]["socket_standard"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_platform">Plataforma: ' +
            dataFilteredMotherboards[selectedMotherboard - 1]["platform"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_form_factor">Form Factor: ' +
            dataFilteredMotherboards[selectedMotherboard - 1]["form_factor"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_storage_m2">Soporta M.2: ' +
            (dataFilteredMotherboards[selectedMotherboard - 1]["storage"]["m2_slots"] > 0
                ? "Si (" + dataFilteredMotherboards[selectedMotherboard - 1]["storage"]["m2_slots"] + ")"
                : "No") +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_storage_m2">Red: ' +
            (dataFilteredMotherboards[selectedMotherboard - 1]["network"]["ports"] > 0
                ? dataFilteredMotherboards[selectedMotherboard - 1]["network"]["ports"] +
                  " x " +
                  dataFilteredMotherboards[selectedMotherboard - 1]["network"]["speed"]
                : "No") +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_storage_m2">Memoria: ' +
            memoryAllowed +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_storage_m2">WiFi: ' +
            (dataFilteredMotherboards[selectedMotherboard - 1]["network"]["wireless"] > true ? "Si" : "No") +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_storage_m2">Audio: ' +
            (dataFilteredMotherboards[selectedMotherboard - 1]["audio"]["has_audio"] = true
                ? "Si (" + dataFilteredMotherboards[selectedMotherboard - 1]["audio"]["channels"] + ")"
                : "No") +
            "</div>";

        updateInfoBox();
        updateTotalPrice();
    }
};

selectionBoxRam.onchange = function (e) {
    selectedRam = this.selectedIndex;
    if (selectedRam == 0 || selectedMotherboard == 0 || selectedProcessor == 0) {
        infoBoxRam.style.visibility = "hidden";
        infoBoxRam.style.display = "none";
        selectionBoxRamQty.setAttribute("disabled", "");
        selectionBoxRamQty.innerHTML = '<option value="0" selected>Cantidad</option>';
        selectionBoxRamQty.value = 0;
        ramInfoBox = "";
        ramPrice = 0;
        ramWattage = 0;
        totalRam = 0;
        totalRamKits = 0;

        if (!selectionBoxRam.disabled && selectedMotherboard == 0 && selectedProcessor == 0) {
            selectionBoxRam.setAttribute("disabled", "");
            selectionBoxRam.value = 0;
            ramPrice = 0;
        }

        updateInfoBox();
        updateTotalPrice();
    } else {
        infoBoxRam.style.display = "flex";
        infoBoxRam.style.visibility = "visible";

        selectionBoxRamQty.innerHTML = '<option value="0" selected>Cantidad</option>';

        if (dataFilteredRam[selectedRam - 1]["sticks"] == 1) {
            selectionBoxRamQty.innerHTML = '<option value="2" selected>2</option>' + '<option value="4">4</option>';
            totalRam = dataFilteredRam[selectedRam - 1]["total_capacity"] * 2;
            totalRamKits = 2;
        } else {
            selectionBoxRamQty.innerHTML = '<option value="1" selected>1</option>' + '<option value="2">2</option>';
            totalRam = dataFilteredRam[selectedRam - 1]["total_capacity"];
            totalRamKits = 1;
        }

        ramInfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "RAM: " +
            totalRamKits +
            " x " +
            dataFilteredRam[selectedRam - 1]["commercial_name"] +
            " " +
            dataFilteredRam[selectedRam - 1]["total_capacity"] +
            " GB (" +
            dataFilteredRam[selectedRam - 1]["sticks"] +
            "x" +
            dataFilteredRam[selectedRam - 1]["capacity_per_stick"] +
            " GB) " +
            '<a href="dataFilteredRam[selectedRam - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataFilteredRam[selectedRam - 1]["price"].toFixed(2) +
            "</div>" +
            "</div>";

        ramPrice = dataFilteredRam[selectedRam - 1]["price"] * selectionBoxRamQty.value;
        totalRam = dataFilteredRam[selectedRam - 1]["total_capacity"] * totalRamKits;
        ramWattage = totalRam / 8;

        selectionBoxRamQty.removeAttribute("disabled");

        selectionBoxRamQty.onchange = function (e) {
            selectedRamQty = this.value;
            if (selectedRamQty != 0) {
                totalRam = dataFilteredRam[selectedRam - 1]["total_capacity"] * selectedRamQty;
                ramWattage = totalRam / 8;
                ramPrice = dataFilteredRam[selectedRam - 1]["price"] * selectedRamQty;

                ramInfoBox =
                    '<div class="d-flex">' +
                    '<div class="p-2 flex-fill">' +
                    "RAM: " +
                    selectedRamQty +
                    " x " +
                    dataFilteredRam[selectedRam - 1]["commercial_name"] +
                    " " +
                    dataFilteredRam[selectedRam - 1]["total_capacity"] +
                    " GB (" +
                    dataFilteredRam[selectedRam - 1]["sticks"] +
                    "x" +
                    dataFilteredRam[selectedRam - 1]["capacity_per_stick"] +
                    " GB) " +
                    '<a href="dataFilteredRam[selectedRam - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
                    "</div>" +
                    '<div class="p-2 flex-fill text-end">$' +
                    ramPrice.toFixed(2) +
                    "</div>" +
                    "</div>";

                updateInfoBox();
                updateTotalPrice();
            }
        };

        infoBoxRam.innerHTML =
            '<div class="col-xs-12 col-md-6" id="motherboard_select_socket">Velocidad: ' +
            dataFilteredRam[selectedRam - 1]["speed"] +
            " Mhz</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_platform">Modelo: ' +
            dataFilteredRam[selectedRam - 1]["model"] +
            "</div>";

        updateInfoBox();
        updateTotalPrice();
    }
};

// Escuchamos el cambio de seleccion de pais para ajustar el IVA
selectionBoxCountry.onchange = function (e) {
    selectedCountry = this.value;

    if (selectedCountry != "") {
        switch (selectedCountry) {
            case "Argentina":
                taxPct = 1.21;
                break;
            case "Bolivia":
                taxPct = 1.13;
                break;
            case "Chile":
                taxPct = 1.19;
                break;
            case "Colombia":
                taxPct = 1.19;
                break;
            case "Ecuador":
                taxPct = 1.12;
                break;
            case "Mexico":
                taxPct = 1.16;
                break;
            case "Paraguay":
                taxPct = 1.05;
                break;
            case "Uruguay":
                taxPct = 1.1;
                break;
            default:
                taxPct = 1.15;
        }
    } else {
        taxPct = 1;
    }

    updateTotalPrice();
};
