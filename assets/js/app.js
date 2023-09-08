// Constantes para almacenar los endpoints de los JSONs
const apiEndpointProcessors = "https://javascript.cesararacena.com/json/processors.json";
const apiEndpointMotherboards = "https://javascript.cesararacena.com/json/motherboards.json";
const apiEndpointRam = "https://javascript.cesararacena.com/json/ram.json";
const apiEndpointDiscs = "https://javascript.cesararacena.com/json/discs.json";
const apiEndpointVideo = "https://javascript.cesararacena.com/json/gpu.json";
const apiEndpointPsu = "https://javascript.cesararacena.com/json/psu.json";

// Constantes que almacenan las direcciones del DOM a actualizar
const selectionBoxProcessors = document.getElementById("processor_select");
const selectionBoxMotherboards = document.getElementById("motherboard_select");
const selectionBoxRam = document.getElementById("ram_select");
const selectionBoxRamQty = document.getElementById("ram_select_qty");
const selectionBoxM2 = document.getElementById("m2_select");
const selectionBoxM2Qty = document.getElementById("m2_select_qty");
const selectionBoxSsd = document.getElementById("ssd_select");
const selectionBoxSsdQty = document.getElementById("ssd_select_qty");
const selectionBoxCountry = document.getElementById("select_pais");
const selectionBoxVideo = document.getElementById("video_select");
const selectionBoxPsu = document.getElementById("psu_select");

const infoBoxProcessors = document.getElementById("processor_select_info");
const infoBoxMotherboards = document.getElementById("motherboard_select_info");
const infoBoxRam = document.getElementById("ram_select_info");
const infoBoxDiscsM2 = document.getElementById("discs_m2_select_info");
const infoBoxDiscsSsd = document.getElementById("discs_ssd_select_info");
const infoBoxVideo = document.getElementById("video_select_info");
const infoBoxPsu = document.getElementById("psu_select_info");
const infoBoxPrice = document.getElementById("total_price");
const infoBox = document.getElementById("information_box");

// Variables para almacenar los productos seleccionados en cada opcion
let dataSelectedProcessor = [];
let dataSelectedMotherboard = [];
let dataFilteredMotherboards = [];
let dataSelectedRam = [];
let dataFilteredRam = [];
let dataSelectedM2 = [];
let dataFilteredM2 = [];
let dataSelectedSsd = [];
let dataFilteredSsd = [];
let dataSelectedVideo = [];
let dataFilteredVideo = [];
let dataSelectedPsu = [];
let dataFilteredPsu = [];
let memoryAllowed = [];

// Variables para almacenar valores que cambian con cada cambio de seleccion
// Seleccion de cada opcion
let selectedProcessor = 0;
let selectedMotherboard = 0;
let selectedRam = 0;
let selectedRamQty = 0;
let selectedM2 = 0;
let selectedM2Qty = 0;
let selectedSsd = 0;
let selectedSsdQty = 0;
let selectedVideo = 0;
let selectedPsu = 0;
let selectedCountry = "";
// Informacion a mostrar de cada elemento
let processorInfoBox = "";
let motherboardInfoBox = "";
let ramInfoBox = "";
let discsM2InfoBox = "";
let discsSsdInfoBox = "";
let cant_discos_m2;
let cant_discos_ssd;
let videoInfoBox = "";
let psuInfoBox = "";
// Precio de cada componente seleccionado y precios/impuestos
let processorPrice = 0;
let motherboardPrice = 0;
let ramPrice = 0;
let discsM2Price = 0;
let discsSsdPrice = 0;
let videoPrice = 0;
let psuPrice = 0;
let totalPrice = 0;
let taxPct = 1;
let taxAlone = 0;
let total = 0;
// Potencia y calculos de RAM
let cpuWattage = 0;
let motherboardWattage = 0;
let ramWattage = 0;
let videoWattage = 0;
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

        updateInfoBox();
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

        updateInfoBox();
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
        ramInfoBox = "";

        if (!selectionBoxRam.disabled) {
            // RAM
            selectionBoxRam.setAttribute("disabled", "");
        }

        if (!selectionBoxRamQty.disabled) {
            // RAM QTY
            selectionBoxRamQty.setAttribute("disabled", "");
        }

        selectionBoxRamQty.innerHTML = '<option value="0" selected>Cantidad</option>';

        updateInfoBox();
    }

    if (parte == null || parte == "discs") {
        infoBoxDiscsM2.style.display = "none";
        infoBoxDiscsM2.style.visibility = "hidden";
        infoBoxDiscsSsd.style.display = "none";
        infoBoxDiscsSsd.style.visibility = "hidden";
        selectionBoxM2.value = 0;
        selectionBoxSsd.value = 0;
        selectedM2 = 0;
        selectedM2Qty = 0;
        selectedSsd = 0;
        selectedSsdQty = 0;
        discsM2Price = 0;
        discsSsdPrice = 0;
        discsM2InfoBox = "";
        discsSsdInfoBox = "";

        if (!selectionBoxM2.disabled) {
            // RAM
            selectionBoxM2.setAttribute("disabled", "");
        }

        if (!selectionBoxSsd.disabled) {
            // RAM
            selectionBoxSsd.setAttribute("disabled", "");
        }

        if (!selectionBoxM2Qty.disabled) {
            // RAM
            selectionBoxM2Qty.setAttribute("disabled", "");
        }

        if (!selectionBoxSsdQty.disabled) {
            // RAM
            selectionBoxSsdQty.setAttribute("disabled", "");
        }

        updateInfoBox();
    }

    if (parte == null || parte == "discs_m2") {
        selectionBoxM2Qty.innerHTML = '<option value="0" selected>Cantidad de unidades M.2</option>';
        selectionBoxM2Qty.value = 0;
        selectionBoxM2Qty.setAttribute("disabled", "");
        discsM2InfoBox = "";
        discsM2Price = 0;

        updateInfoBox();
    }

    if (parte == null || parte == "discs_ssd") {
        selectionBoxSsdQty.innerHTML = '<option value="0" selected>Cantidad de unidades SSD</option>';
        selectionBoxSsdQty.value = 0;
        selectionBoxSsdQty.setAttribute("disabled", "");
        discsSsdInfoBox = "";
        discsSsdPrice = 0;

        updateInfoBox();
    }

    if (parte == null || parte == "video") {
        infoBoxVideo.style.display = "none";
        infoBoxVideo.style.visibility = "hidden";
        selectionBoxVideo.value = 0;
        // dataSelectedMotherboard = [];
        // dataFilteredVideo = [];
        selectedVideo = 0;
        videoInfoBox = "";
        videoPrice = 0;
        videoWattage = 0;

        updateInfoBox();
    }

    if (parte == null || parte == "psu") {
        infoBoxPsu.style.display = "none";
        infoBoxPsu.style.visibility = "hidden";
        selectionBoxPsu.value = 0;
        selectedPsu = 0;
        psuInfoBox = "";
        psuPrice = 0;
        psuWattage = 0;

        updateInfoBox();
    }

    selectedCountry = "";

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
    totalWattage = cpuWattage + motherboardWattage + ramWattage + videoWattage;

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
    infoBox.innerHTML =
        processorInfoBox + motherboardInfoBox + ramInfoBox + discsM2InfoBox + discsSsdInfoBox + videoInfoBox + psuInfoBox + show_wattage();
}

// Funcion para actualizar los valores en el detalle
function updateTotalPrice() {
    totalPrice = processorPrice + motherboardPrice + ramPrice + discsM2Price + discsSsdPrice + videoPrice + psuPrice;

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

function capacidad_m2_total(seleccion, cantidad) {
    let capacidad_m2 = seleccion * cantidad;
    return capacidad_m2 >= 1000 ? capacidad_m2 / 1000 + " TB" : capacidad_m2 + " GB";
}

function capacidad_ssd_total(seleccion, cantidad) {
    let capacidad_ssd = seleccion * cantidad;
    return capacidad_ssd >= 1000 ? capacidad_ssd / 1000 + " TB" : capacidad_ssd + " GB";
};

function filter_psu(dataObject, wattage = totalWattage) {
    let key = "wattage";
    let correctedWattage = wattage * 1.15;
    let filteredPsu = Object.values(dataObject).reduce((acc, curr) => {
        if (curr[key] >= correctedWattage) {
            acc.push(curr);
        }
        return acc;
    }, []);
    return filteredPsu;
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

// Preparamo la funcion para alimentar el dropdown de los memorias
function fetch_data_discs() {
    fetch_data(apiEndpointDiscs)
        .then((data) => {
            dataSelectedM2 = [];
            dataSelectedSsd = [];

            Object.keys(data).forEach((key) => {
                if (data[key]["type"] == "m2") {
                    dataSelectedM2.push(data[key]);
                } else {
                    dataSelectedSsd.push(data[key]);
                }
            });

            selectionBoxM2.innerHTML = '<option value="0" selected>Unidades de Disco M.2</option>';
            selectionBoxSsd.innerHTML = '<option value="0" selected>Unidades de Disco SSD</option>';

            dataFilteredM2 = [];

            for (let i = 0; i < dataSelectedM2.length; i += 1) {
                if (dataSelectedMotherboard[selectedMotherboard - 1]["storage"]["m2_slots"] > 0) {
                    dataFilteredM2.push(dataSelectedM2[i]);
                    selectionBoxM2.innerHTML =
                        selectionBoxM2.innerHTML +
                        '<option value="' +
                        dataSelectedM2[i]["disc_id"] +
                        '">' +
                        dataSelectedM2[i]["manufacturer"] +
                        " " +
                        dataSelectedM2[i]["commercial_name"] +
                        "</option>";
                }
            }

            if (selectionBoxM2.disabled && dataFilteredM2.length > 0) {
                selectionBoxM2.removeAttribute("disabled");
            }

            dataFilteredSsd = [];

            for (let i = 0; i < dataSelectedSsd.length; i += 1) {
                if (dataSelectedMotherboard[selectedMotherboard - 1]["storage"]["sata_6gbs_ports"] > 0) {
                    dataFilteredSsd.push(dataSelectedSsd[i]);
                    selectionBoxSsd.innerHTML =
                        selectionBoxSsd.innerHTML +
                        '<option value="' +
                        dataSelectedSsd[i]["disc_id"] +
                        '">' +
                        dataSelectedSsd[i]["manufacturer"] +
                        " " +
                        dataSelectedSsd[i]["commercial_name"] +
                        "</option>";
                }
            }

            if (selectionBoxSsd.disabled && dataFilteredSsd.length > 0) {
                selectionBoxSsd.removeAttribute("disabled");
            }
        })
        .catch((reason) => console.log("Msg: " + reason));
}

// Preparamo la funcion para alimentar el dropdown de los memorias
function fetch_data_video() {
    fetch_data(apiEndpointVideo)
        .then((data) => {
            dataSelectedVideo = data;
            selectionBoxVideo.innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';

            // Habilitamos el selector del dropdown del proximo componente
            if (selectionBoxVideo.disabled) {
                selectionBoxVideo.removeAttribute("disabled");
            }

            dataFilteredVideo = [];
            for (let i = 0; i < dataSelectedVideo.length; i += 1) {
                // Solo ponemos en el dropdown las memorias que son compatibles
                // con el mother seleccionado
                if (dataFilteredMotherboards[selectedMotherboard - 1]["platform"] == dataSelectedVideo[i]["platform"]) {
                    dataFilteredVideo.push(dataSelectedVideo[i]);
                    selectionBoxVideo.innerHTML =
                        selectionBoxVideo.innerHTML +
                        '<option value="' +
                        dataSelectedVideo[i]["gpu_id"] +
                        '">' +
                        dataSelectedVideo[i]["manufacturer"] +
                        " " +
                        dataSelectedVideo[i]["commercial_name"] +
                        "</option>";
                }
            }
        })
        .catch((reason) => console.log("Msg: " + reason));
}

// Preparamo la funcion para alimentar el dropdown de los memorias
function fetch_data_psu() {
    fetch_data(apiEndpointPsu)
        .then((data) => {
            dataSelectedPsu = data;
            selectionBoxPsu.innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';

            // Habilitamos el selector del dropdown del proximo componente
            if (selectionBoxPsu.disabled &&
                !selectionBoxMotherboards.disabled &&
                !selectionBoxRam.disabled &&
                !selectedM2.disabled &&
                !selectedVideo.disabled) {
                selectionBoxPsu.removeAttribute("disabled");
            };

            dataFilteredPsu = [];
            dataFilteredPsu = filter_psu(data);
            // console.log(dataFilteredPsu);

            for (let i = 0; i < dataFilteredPsu.length; i += 1) {
                // console.log(i);
                selectionBoxPsu.innerHTML =
                    selectionBoxPsu.innerHTML +
                    '<option value="' +
                    dataFilteredPsu[i]["psu_id"] +
                    '">' +
                    dataFilteredPsu[i]["manufacturer"] +
                    " " +
                    dataFilteredPsu[i]["model"] +
                    "</option>";
            };
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
        reset_all("ram");
        reset_all("discs");
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
        reset_all("ram");
        reset_all("discs");
        reset_all("video");
    } else {
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
        // reset_all("ram");
        reset_all("discs");
        selectionBoxRamQty.innerHTML = '<option value="0" selected>Cantidad</option>';

        if (!selectionBoxRamQty.disabled) {
            // RAM QTY
            selectionBoxRamQty.setAttribute("disabled", "");
        }
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

                infoBoxRam.innerHTML =
                    '<div class="col-xs-12 col-md-6" id="motherboard_platform">Modelo: ' +
                    dataFilteredRam[selectedRam - 1]["model"] +
                    "</div>" +
                    '<div class="col-xs-12 col-md-6" id="motherboard_platform">Total: ' +
                    totalRam +
                    " GB</div>";

                updateInfoBox();
                updateTotalPrice();
            }
        };

        infoBoxRam.style.display = "flex";
        infoBoxRam.style.visibility = "visible";

        infoBoxRam.innerHTML =
            '<div class="col-xs-12 col-md-6" id="motherboard_platform">Modelo: ' +
            dataFilteredRam[selectedRam - 1]["model"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="motherboard_platform">Total: ' +
            totalRam +
            " GB";
        ("</div>");

        fetch_data_discs();
        fetch_data_video();
    }

    updateInfoBox();
    updateTotalPrice();
};

selectionBoxM2.onchange = function (e) {
    selectedM2 = this.selectedIndex;

    if (selectedM2 == 0) {
        reset_all("discs_m2");

        if (selectedSsd == 0) {
            reset_all("video");
        }
    } else {
        if (selectionBoxVideo.disabled) {
            selectionBoxVideo.removeAttribute("disabled");
        }

        // selectionBoxM2Qty.innerHTML = '<option value="0" selected>Cantidad de unidades M.2</option>';
        selectionBoxM2Qty.removeAttribute("disabled");

        selectionBoxVideo.removeAttribute("disabled");

        cant_discos_m2 = [...Array(dataFilteredMotherboards[selectedMotherboard - 1]["storage"]["m2_slots"] + 1).keys()];

        selectionBoxM2Qty.innerHTML = "";

        for (let i of cant_discos_m2) {
            if (i > 0) {
                selectionBoxM2Qty.innerHTML =
                    selectionBoxM2Qty.innerHTML + '<option value="' + i + '"' + (i == 1 ? " selected" : "") + ">" + i + "</option>";
            }
        }

        discsM2InfoBox = "";

        discsM2InfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "Dico M.2: " +
            selectionBoxM2Qty.value +
            " x " +
            dataFilteredM2[selectedM2 - 1]["manufacturer"] +
            " " +
            dataFilteredM2[selectedM2 - 1]["commercial_name"] +
            " " +
            '<a href="dataFilteredM2[selectedM2 - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataFilteredM2[selectedM2 - 1]["price"].toFixed(2) * selectionBoxM2Qty.value +
            "</div>" +
            "</div>";

        discsM2Price = dataFilteredM2[selectedM2 - 1]["price"] * selectionBoxM2Qty.value;

        selectionBoxM2Qty.onchange = function (e) {
            discsM2InfoBox =
                '<div class="d-flex">' +
                '<div class="p-2 flex-fill">' +
                "Dico M.2: " +
                selectionBoxM2Qty.value +
                " x " +
                dataFilteredM2[selectedM2 - 1]["manufacturer"] +
                " " +
                dataFilteredM2[selectedM2 - 1]["commercial_name"] +
                " " +
                '<a href="dataFilteredM2[selectedM2 - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
                "</div>" +
                '<div class="p-2 flex-fill text-end">$' +
                dataFilteredM2[selectedM2 - 1]["price"].toFixed(2) * selectionBoxM2Qty.value +
                "</div>" +
                "</div>";

            discsM2Price = dataFilteredM2[selectedM2 - 1]["price"] * selectionBoxM2Qty.value;

            infoBoxDiscsM2.innerHTML = "";

            infoBoxDiscsM2.innerHTML =
                '<div class="col-xs-12 col-md-6" id="memory_m2_platform">M.2 Plataforma: ' +
                dataFilteredM2[selectedM2 - 1]["platform"] +
                "</div>" +
                '<div class="col-xs-12 col-md-6" id="memory_m2_capacity">Capacidad: ' +
                capacidad_m2_total(dataFilteredM2[selectedM2 - 1]["capacity"], selectionBoxM2Qty.value) +
                "</div>";

            updateInfoBox();
            updateTotalPrice();
        };

        infoBoxDiscsM2.style.display = "flex";
        infoBoxDiscsM2.style.visibility = "visible";

        infoBoxDiscsM2.innerHTML = "";

        infoBoxDiscsM2.innerHTML =
            '<div class="col-xs-12 col-md-6" id="memory_m2_platform">M.2 Plataforma: ' +
            dataFilteredM2[selectedM2 - 1]["platform"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="memory_m2_capacity">Capacidad: ' +
            capacidad_m2_total(dataFilteredM2[selectedM2 - 1]["capacity"], selectionBoxM2Qty.value) +
            "</div>";
    }

    updateInfoBox();
    updateTotalPrice();
};

selectionBoxSsd.onchange = function (e) {
    selectedSsd = this.selectedIndex;

    if (selectedSsd == 0) {
        reset_all("discs_ssd");

        if (selectedM2 == 0) {
            reset_all("video");
        }
    } else {
        if (selectionBoxVideo.disabled) {
            selectionBoxVideo.removeAttribute("disabled");
        }

        // selectionBoxSsdQty.innerHTML = '<option value="0" selected>Cantidad de unidades SSD</option>';
        selectionBoxSsdQty.removeAttribute("disabled");

        cant_discos_ssd = [...Array(dataFilteredMotherboards[selectedMotherboard - 1]["storage"]["sata_6gbs_ports"] + 1).keys()];

        selectionBoxSsdQty.innerHTML = "";

        for (let i of cant_discos_ssd) {
            if (i > 0) {
                selectionBoxSsdQty.innerHTML =
                    selectionBoxSsdQty.innerHTML + '<option value="' + i + '"' + (i == 1 ? " selected" : "") + ">" + i + "</option>";
            }
        }

        discsSsdInfoBox = "";

        discsSsdInfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "Dico SSD: " +
            selectionBoxSsdQty.value +
            " x " +
            dataFilteredSsd[selectedSsd - 1]["manufacturer"] +
            " " +
            dataFilteredSsd[selectedSsd - 1]["commercial_name"] +
            " " +
            '<a href="dataFilteredSsd[selectedSsd - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataFilteredSsd[selectedSsd - 1]["price"].toFixed(2) * selectionBoxSsdQty.value +
            "</div>" +
            "</div>";

        discsSsdPrice = dataFilteredSsd[selectedSsd - 1]["price"] * selectionBoxSsdQty.value;

        selectionBoxSsdQty.onchange = function (e) {
            discsSsdInfoBox =
                '<div class="d-flex">' +
                '<div class="p-2 flex-fill">' +
                "Dico SSD: " +
                selectionBoxSsdQty.value +
                " x " +
                dataFilteredSsd[selectedSsd - 1]["manufacturer"] +
                " " +
                dataFilteredSsd[selectedSsd - 1]["commercial_name"] +
                " " +
                '<a href="dataFilteredSsd[selectedSsd - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
                "</div>" +
                '<div class="p-2 flex-fill text-end">$' +
                dataFilteredSsd[selectedSsd - 1]["price"].toFixed(2) * selectionBoxSsdQty.value +
                "</div>" +
                "</div>";

            discsSsdPrice = dataFilteredSsd[selectedSsd - 1]["price"] * selectionBoxSsdQty.value;

            infoBoxDiscsSsd.innerHTML = "";

            infoBoxDiscsSsd.innerHTML =
                infoBoxDiscsSsd.innerHTML +
                '<div class="col-xs-12 col-md-6" id="memory_ssd_platform">SSD Plataforma: ' +
                dataFilteredSsd[selectedSsd - 1]["platform"] +
                "</div>" +
                '<div class="col-xs-12 col-md-6" id="memory_ssd_capacity">Capacidad: ' +
                capacidad_ssd_total(dataFilteredSsd[selectedSsd - 1]["capacity"], selectionBoxSsdQty.value) +
                "</div>";

            updateInfoBox();
            updateTotalPrice();
        };

        infoBoxDiscsSsd.style.display = "flex";
        infoBoxDiscsSsd.style.visibility = "visible";

        infoBoxDiscsSsd.innerHTML = "";

        infoBoxDiscsSsd.innerHTML =
            infoBoxDiscsSsd.innerHTML +
            '<div class="col-xs-12 col-md-6" id="memory_ssd_platform">SSD Plataforma: ' +
            dataFilteredSsd[selectedSsd - 1]["platform"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="memory_ssd_capacity">Capacidad: ' +
            capacidad_ssd_total(dataFilteredSsd[selectedSsd - 1]["capacity"], selectionBoxSsdQty.value) +
            "</div>";
    }

    updateInfoBox();
    updateTotalPrice();
};

// Escuchamos el evento de cambio de seleccion del dropdown de procesadores
selectionBoxVideo.onchange = function (e) {
    selectedVideo = this.selectedIndex;

    // reset_all('video');

    // Si el usuario vuelve a la opcion 0, procedemos a limpiar
    // toda la info insertada en el DOM anteriormente
    if (selectedVideo == 0) {
        reset_all("video");
    } else {
        videoInfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "Video: " +
            dataFilteredVideo[selectedVideo - 1]["manufacturer"] +
            " " +
            dataFilteredVideo[selectedVideo - 1]["commercial_name"] +
            " " +
            '<a href="dataFilteredVideo[selectedVideo - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataFilteredVideo[selectedVideo - 1]["price"].toFixed(2) +
            "</div>" +
            "</div>";

        videoPrice = dataFilteredVideo[selectedVideo - 1]["price"];

        // Agregamos el consumo de potencia maximo al total de consumo
        videoWattage = dataFilteredVideo[selectedVideo - 1]["power_consumption"];

        infoBoxVideo.style.display = "flex";
        infoBoxVideo.style.visibility = "visible";

        infoBoxVideo.innerHTML =
            '<div class="col-xs-12 col-md-6" id="motherboard_select_socket">Fabricante: ' +
            dataFilteredVideo[selectedVideo - 1]["manufacturer"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="Video_platform">Plataforma: ' +
            dataFilteredVideo[selectedVideo - 1]["platform"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="Video_form_factor">Series: ' +
            dataFilteredVideo[selectedVideo - 1]["series"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="Video_storage_m2">Memoria: ' +
            dataFilteredVideo[selectedVideo - 1]["memory"] +
            " GB" +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="Video_storage_m2">Consumo: ' +
            dataFilteredVideo[selectedVideo - 1]["power_consumption"] +
            " W" +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="Video_storage_m2">Res. Max.: ' +
            dataFilteredVideo[selectedVideo - 1]["max_res"] +
            "</div>";

        // Habilitamos la seleccion del proximo componente
        // fetch_data_video();
        fetch_data_psu();
    }

    updateInfoBox();
    updateTotalPrice();
};

// Escuchamos el evento de cambio de seleccion del dropdown de procesadores
selectionBoxPsu.onchange = function (e) {
    selectedPsu = this.selectedIndex;

    // reset_all('video');

    // Si el usuario vuelve a la opcion 0, procedemos a limpiar
    // toda la info insertada en el DOM anteriormente
    if (selectedVideo == 0) {
        reset_all("psu");
    } else {
        psuInfoBox =
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            "Fuente: " +
            dataFilteredPsu[selectedPsu - 1]["manufacturer"] +
            " " +
            dataFilteredPsu[selectedPsu - 1]["model"] +
            " " +
            '<a href="dataFilteredPsu[selectedPsu - 1]["link"]" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            "</div>" +
            '<div class="p-2 flex-fill text-end">$' +
            dataFilteredPsu[selectedPsu - 1]["price"].toFixed(2) +
            "</div>" +
            "</div>";

        psuPrice = dataFilteredPsu[selectedPsu - 1]["price"];

        infoBoxPsu.style.display = "flex";
        infoBoxPsu.style.visibility = "visible";

        infoBoxPsu.innerHTML =
            '<div class="col-xs-12 col-md-6" id="psu_manufacturer">Fabricante: ' +
            dataFilteredPsu[selectedPsu - 1]["manufacturer"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="psu_series">Series: ' +
            dataFilteredPsu[selectedPsu - 1]["series"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="psu_form_factor">Formato: ' +
            dataFilteredPsu[selectedPsu - 1]["form_factor"] +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="psu_modular">Modular: ' +
            (dataFilteredPsu[selectedPsu - 1]["modular"] ? "Si" : "No") +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="psu_wattage">Potencia: ' +
            dataFilteredPsu[selectedPsu - 1]["wattage"] +
            " W" +
            "</div>" +
            '<div class="col-xs-12 col-md-6" id="psu_80_plus">80 Plus: ' +
            dataFilteredPsu[selectedPsu - 1]["cat_80_plus_efficiency"] +
            "</div>";

        // Habilitamos la seleccion del proximo componente
        // fetch_data_video();
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
