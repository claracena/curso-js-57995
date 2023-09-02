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

// Variables para almacenar los productos seleccionados en cada opcion
let dataSelectedProcessor = [];
let dataSelectedMotherboard = [];
let dataFilteredMotherboards = [];
let dataSelectedRam = [];
let dataFilteredRam = [];
let memoryAllowed = [];

// Variables para almacenar valores que cambian con cada cambio de seleccion
// Seleccion de cada opcion
let selectedProcessor = 0;
let selectedMotherboard = 0;
let selectedRam = 0;
let selectedRamQty = 0;
let selectedCountry = "";
// Informacion a mostrar de cada elemento
let processorInfoBox = "";
let motherboardInfoBox = "";
let ramInfoBox = "";
// Precio de cada componente seleccionado y precios/impuestos
let processorPrice = 0;
let motherboardPrice = 0;
let ramPrice = 0;
let totalPrice = 0;
let taxPct = 1;
let taxAlone = 0;
let total = 0;
// Potencia y calculos de RAM
let cpuWattage = 0;
let motherboardWattage = 0;
let ramWattage = 0;
let totalWattage = 0;
let totalRam = 0;
let totalRamKits = 0;

// Funcion para resetear/limpiar todo
function reset_all(parte = null) {
    if (parte == null) {
        infoBoxProcessors.style.display = "none";
        infoBoxProcessors.style.visibility = "hidden";
        selectionBoxProcessors.value = 0;
        selectedProcessor = 0;
        processorInfoBox = "";
        processorPrice = 0;
        cpuWattage = 0;
        infoBoxPrice.style.display = "none";
        infoBoxPrice.style.visibility = "hidden";
        totalPrice = 0;
        taxPct = 1;
        taxAlone = 0;
        total = 0;
        totalWattage = 0;

        

        
    }

    if (parte == null || parte == "motherboards") {
        infoBoxMotherboards.style.display = "none";
        infoBoxMotherboards.style.visibility = "hidden";
        selectionBoxMotherboards.value = 0;
        // dataSelectedMotherboard = [];
        // dataFilteredMotherboards = [];
        selectedMotherboard = 0;
        motherboardInfoBox = "";
        motherboardPrice = 0;
        motherboardWattage = 0;

        // Al volver a la opcion de procesador 0, reseteamos el dropdown
        // de los otros componentes tambien. El usuario debe
        // voler a comenzar desde el paso 1
        if (!selectionBoxMotherboards.disabled) {
            // Motherboards
            selectionBoxMotherboards.setAttribute("disabled", "");
        }
    }

    if (parte == null || parte == "ram") {
        infoBoxRam.style.display = "none";
        infoBoxRam.style.visibility = "hidden";
        selectionBoxRam.value = 0;
        // dataSelectedRam = [];
        // dataFilteredRam = [];
        memoryAllowed = [];
        selectedRam = 0;
        selectedRamQty = 0;
        ramPrice = 0;
        ramWattage = 0;
        totalRam = 0;
        totalRamKits = 0;

        if (!selectionBoxRam.disabled) {
            // RAM
            selectionBoxRam.setAttribute("disabled", "");
        }

        if (!selectionBoxRamQty.disabled) {
            // RAM QTY
            selectionBoxRamQty.setAttribute("disabled", "");
        }

        selectionBoxRamQty.innerHTML = '<option value="0" selected>Cantidad</option>';
    }

    // let event = new Event("change");
    // selectionBoxProcessors.dispatchEvent(event);
    // selectionBoxMotherboards.dispatchEvent(event);
    // selectionBoxRam.dispatchEvent(event);
    // selectionBoxRamQty.dispatchEvent(event);
    // selectionBoxCountry.dispatchEvent(event);

    selectionBoxRamQty.value = 0;

    selectedCountry = "";

    ramInfoBox = "";

    updateInfoBox();
}

// Funcion general para traer datos de un endpoint
async function fetch_data(endpoint) {
    let response = await fetch(endpoint);
    let data = await response.json();
    return data;
}

// Funcion para formatear el HTML para mostrar el total de consumo
function show_wattage() {
    totalWattage = 0;
    totalWattage = cpuWattage + motherboardWattage + ramWattage;

    if (totalWattage > 0) {
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
    } else {
        return "";
    }
}

// Funcion para actualizar el detalle de los productos seleccionados
function updateInfoBox() {
    infoBox.innerHTML = "";
    infoBox.innerHTML = processorInfoBox + motherboardInfoBox + ramInfoBox + show_wattage();
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

        infoBoxPrice.style.display = "block";
        infoBoxPrice.style.visibility = "visible";
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

// Usamos la funcion fetchData() para cargar la lista de procesadores
// cuando se carga la pagina
fetch_data(apiEndpointProcessors)
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

// Preparamo la funcion para alimentar el dropdown de los motherboards
function fetch_data_motherboards() {
    fetch_data(apiEndpointMotherboards)
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
}

// Preparamo la funcion para alimentar el dropdown de los memorias
function fetch_data_ram() {
    fetch_data(apiEndpointRam)
        .then((data) => {
            dataSelectedRam = data;
            selectionBoxRam.innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';

            // Habilitamos el selector del dropdown del proximo componente
            if (selectionBoxRam.disabled) {
                selectionBoxRam.removeAttribute("disabled");
            }

            dataFilteredRam = [];
            for (let i = 0; i < dataSelectedRam.length; i += 1) {
                // Solo ponemos en el dropdown las memorias que son compatibles
                // con el mother seleccionado
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
}

// Escuchamos el evento de cambio de seleccion del dropdown de procesadores
selectionBoxProcessors.onchange = function (e) {
    selectedProcessor = this.selectedIndex;

    // Si el usuario vuelve a la opcion 0, procedemos a limpiar
    // toda la info insertada en el DOM anteriormente
    if (selectedProcessor == 0) {
        reset_all();
    } else {
        reset_all("motherboards");
        // Preparamos la info que se mostrara del procesador seleccionado en la parte de "detalle"
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

        // Pasamos el precio del procesador seleccionado para la suma del total en la parte del "detalle"
        processorPrice = dataSelectedProcessor[selectedProcessor - 1]["price"];

        // Agregamos el consumo de potencia maximo al total de consumo
        cpuWattage = dataSelectedProcessor[selectedProcessor - 1]["power_consumption"]["max_power"];

        // Habilitamos las partes del DOM que muestran info sobre el procesador seleccionado
        infoBoxProcessors.style.display = "flex";
        infoBoxProcessors.style.visibility = "visible";

        // Mostramos info basica sobre el procesador seleccionado debajo del dropdown
        infoBoxProcessors.innerHTML =
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

        // Habilitamos la seleccion del proximo componente
        fetch_data_motherboards();
    }

    updateInfoBox();
    updateTotalPrice();
};

// Escuchamos el evento de cambio de seleccion del dropdown de procesadores
selectionBoxMotherboards.onchange = function (e) {
    selectedMotherboard = this.selectedIndex;

    // Si el usuario vuelve a la opcion 0, procedemos a limpiar
    // toda la info insertada en el DOM anteriormente
    if (selectedMotherboard == 0) {
        reset_all("motherboards");
        reset_all("ram");
    } else {
        reset_all("ram");
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

        infoBoxMotherboards.style.display = "flex";
        infoBoxMotherboards.style.visibility = "visible";

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

        // Habilitamos la seleccion del proximo componente
        fetch_data_ram();
    }

    updateInfoBox();
    updateTotalPrice();
};

selectionBoxRam.onchange = function (e) {
    selectedRam = this.selectedIndex;

    if (selectedRam == 0) {
        reset_all("ram");
    } else {
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

        infoBoxRam.style.display = "flex";
        infoBoxRam.style.visibility = "visible";

        infoBoxRam.innerHTML =
            '<div class="col-xs-12 col-md-6" id="motherboard_select_socket">Velocidad: ' +
            dataFilteredRam[selectedRam - 1]["speed"] +
            " Mhz</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_platform">Modelo: ' +
            dataFilteredRam[selectedRam - 1]["model"] +
            "</div>";
    }

    updateInfoBox();
    updateTotalPrice();
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
