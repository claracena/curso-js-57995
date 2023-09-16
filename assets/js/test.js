// TODO Limpiar todo
// TODO Comentarios / Documentacion
function uir() {
    window.open('https://www.google.com', '_self');
}

function abrir_modal() {
    const modal_bienvenido = new bootstrap.Modal('#modal-bienvenido', {
        keyboard: true,
    });

    modal_bienvenido.show();
}

function cerrar_modal() {
    let mi_modal = document.getElementById('modal-bienvenido');
    let modal = bootstrap.Modal.getInstance(mi_modal);
    modal.hide();
}

const llamadas = endpoints.map((ruta) => fetch(ruta).then((respuesta) => respuesta.json()));

Promise.all(llamadas)
    .then((data) => {
        data.forEach((element) => {
            if (element[0].type == 'processor') {
                cpu_raw_data = element;
            } else if (element[0].type == 'motherboard') {
                motherboard_raw_data = element;
            } else if (element[0].type == 'ram') {
                ram_raw_data = element;
            } else if (element[0].type == 'disc') {
                discs_raw_data = element;
            } else if (element[0].type == 'gpu') {
                gpu_raw_data = element;
            } else if (element[0].type == 'psu') {
                psu_raw_data = element;
            }
        });
    })
    .catch((reason) => console.log('Msg: ' + reason));

const inicializacion = setInterval(() => {
    cpu_raw_data = cpu_raw_data;
    motherboard_raw_data = motherboard_raw_data;
    ram_raw_data = ram_raw_data;
    discs_raw_data = discs_raw_data;
    gpu_raw_data = gpu_raw_data;
    psu_raw_data = psu_raw_data;

    cpu_raw_data.forEach((item) => {
        selection_processors.innerHTML =
            selection_processors.innerHTML +
            '<option value="' +
            item.id +
            '">' +
            item.manufacturer +
            ' ' +
            item.commercial_name +
            ' ' +
            item.series_name +
            '</option>';
    });

    selection_processors.onchange = function (e) {
        if (this.value != 0) {
            selected_processor = cpu_raw_data.filter((item) => item.id == this.value);
            show_info_box();
            filtered_motherboard = motherboard_raw_data.filter((item) => item.platform == selected_processor[0].manufacturer);
            selection_motherboard.innerHTML = [];
            wattage();
            enable_next_step('motherboard');
        } else {
            show_info_box();
            reset_all();
            reset_all('motherboard');
            reset_all('ram');
            reset_all('ram_qty');
            reset_all('m2');
            reset_all('m2_qty');
            reset_all('ssd');
            reset_all('ssd_qty');
        }
    };

    filtered_gpu = gpu_raw_data;

    if (Object.keys(cpu_raw_data).length > 0) {
        clearInterval(inicializacion);
        selection_processors.removeAttribute('disabled');
    }
}, 100);

function reset_all(parte = null) {
    if (parte == null) {
        info_box.innerHTML = '';
        selected_processor = [];
        filtered_motherboard = [];
        filtered_ram = [];
        filtered_m2 = [];
        filtered_ssd = [];
        selection_processors.value = 0;
        selection_motherboard.value = 0;
        selection_motherboard.setAttribute('disabled', '');
    }

    if (parte == 'motherboard' || parte == null) {
        selection_motherboard.value = 0;
        selected_motherboard = [];
        motherboard_section_enabled = 0;
    }

    if (parte == 'ram' || parte == null) {
        selection_ram.innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';
        selected_ram = [];
        if (!selection_ram.disabled) {
            selection_ram.setAttribute('disabled', '');
        }
        ram_section_enabled = 0;
    }

    if (parte == 'ram_qty' || parte == null) {
        selection_ram_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
        selected_ram_qty = 0;
        if (!selection_ram_qty.disabled) {
            selection_ram_qty.setAttribute('disabled', '');
        }
    }

    if (parte == 'm2' || parte == null) {
        selection_m2.value = 0;
        selected_m2 = [];
        if (selection_ram.disabled) {
            selection_m2.setAttribute('disabled', '');
        }
    }

    if (parte == 'm2_qty' || parte == null) {
        selection_m2_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
        selected_m2_qty = 0;
        if (!selection_m2_qty.disabled) {
            selection_m2_qty.setAttribute('disabled', '');
        }
    }

    if (parte == 'ssd' || parte == null) {
        selection_ssd.value = 0;
        selected_ssd = [];
        if (selection_ram.disabled) {
            selection_ssd.setAttribute('disabled', '');
        }
    }

    if (parte == 'ssd_qty' || parte == null) {
        selection_ssd_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
        selected_ssd_qty = 0;
        if (!selection_ssd_qty.disabled) {
            selection_ssd_qty.setAttribute('disabled', '');
        }
    }

    if (parte == 'gpu' || parte == null) {
        selection_gpu.value = 0;
        selected_gpu = [];
        gpu_section_enabled = 0;
        if (!selection_gpu.disabled) {
            if (selection_m2.value == 0 && selection_ssd.value == 0)
            {
                selection_gpu.setAttribute('disabled', '');
            }
        }
    }
}

function enable_next_step(...component) {
    if (component.length == 0) {
        reset_all();
    }

    for (let i = 0; i < component.length; i += 1) {
        eval('selection_' + component[i]).innerHTML = '<option value="0" selected>Realice una selecci&oacute;n</option>';

        eval('filtered_' + component[i]).forEach((item) => {
            eval('selection_' + component[i]).innerHTML =
                eval('selection_' + component[i]).innerHTML +
                '<option value="' +
                item.id +
                '">' +
                item.manufacturer +
                ' ' +
                item.commercial_name +
                '</option>';
        });

        if (eval('selection_' + component[i]).disabled) {
            eval('selection_' + component[i]).removeAttribute('disabled');
        }

        eval(component[i] + '_section_enabled = ' + 1);
    }
}

function wattage() {
    min_wattage = 0;
    max_wattage = 0;

    if (selected_processor.length > 0) {
        min_wattage = min_wattage + selected_processor[0].power_consumption.base_power;
        max_wattage = max_wattage + selected_processor[0].power_consumption.max_power;
        total_wattage = [Math.ceil(min_wattage), Math.ceil(max_wattage)];
    }

    if (selected_motherboard.length > 0) {
        min_wattage = min_wattage + selected_motherboard[0].power_consumption.base_power;
        max_wattage = max_wattage + selected_motherboard[0].power_consumption.max_power;
        total_wattage = [Math.ceil(min_wattage), Math.ceil(max_wattage)];
    }

    if (selected_gpu.length > 0) {
        min_wattage = min_wattage + selected_gpu[0].power_consumption;
        max_wattage = max_wattage + selected_gpu[0].power_consumption;
        total_wattage = [Math.ceil(min_wattage), Math.ceil(max_wattage)];
    }

    return total_wattage;
}

function show_info_box() {
    info_box.innerHTML = '';
    total_price = 0;

    if (selected_processor.length > 0) {
        info_box.innerHTML =
            info_box.innerHTML +
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            'Procesador: ' +
            selected_processor[0].manufacturer +
            ' ' +
            selected_processor[0].commercial_name +
            ' ' +
            selected_processor[0].clock_speed +
            ' Ghz' +
            ' ' +
            ' <a href="' +
            selected_processor[0].link +
            '" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            '</div>' +
            '<div class="p-2 flex-fill text-end">$' +
            selected_processor[0].price.toFixed(2) +
            '</div>' +
            '</div>';
        total_price = total_price + selected_processor[0].price;
    }

    if (selected_motherboard.length > 0) {
        info_box.innerHTML =
            info_box.innerHTML +
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            'Motherboard: ' +
            selected_motherboard[0].manufacturer +
            ' ' +
            selected_motherboard[0].commercial_name +
            ' ' +
            selected_motherboard[0].chipset +
            ' ' +
            ' <a href="' +
            selected_motherboard[0].link +
            '" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            '</div>' +
            '<div class="p-2 flex-fill text-end">$' +
            selected_motherboard[0].price.toFixed(2) +
            '</div>' +
            '</div>';
        total_price = total_price + selected_motherboard[0].price;
    }

    if (selected_ram.length > 0) {
        info_box.innerHTML =
            info_box.innerHTML +
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            'Memoria: ' +
            (selected_ram_qty > 0 ? selected_ram_qty + ' x ' : '') +
            ' ' +
            selected_ram[0].manufacturer +
            ' ' +
            selected_ram[0].commercial_name +
            ' ' +
            selected_ram[0].total_capacity +
            ' GB ' +
            ' <a href="' +
            selected_ram[0].link +
            '" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            '</div>' +
            '<div class="p-2 flex-fill text-end">$' +
            (selected_ram_qty > 0 ? selected_ram_qty * selected_ram[0].price.toFixed(2) : selected_ram[0].price.toFixed(2)) +
            '</div>' +
            '</div>';
        total_price = total_price + (selected_ram_qty > 0 ? selected_ram_qty * selected_ram[0].price : selected_ram[0].price);
    }

    if (selected_m2.length > 0) {
        let m2_price = selected_m2[0].price * selected_m2_qty;
        info_box.innerHTML =
            info_box.innerHTML +
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            'Disco M.2: ' +
            (selected_m2_qty > 0 ? selected_m2_qty + ' x ' : '') +
            ' ' +
            selected_m2[0].manufacturer +
            ' ' +
            selected_m2[0].commercial_name +
            ' ' +
            selected_m2[0].capacity +
            ' GB ' +
            ' <a href="' +
            selected_m2[0].link +
            '" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            '</div>' +
            '<div class="p-2 flex-fill text-end">$' +
            m2_price.toFixed(2) +
            '</div>' +
            '</div>';
        total_price = total_price + m2_price;
    }

    if (selected_ssd.length > 0) {
        let ssd_price = selected_ssd[0].price * selected_ssd_qty;
        info_box.innerHTML =
            info_box.innerHTML +
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            'Disco SSD: ' +
            (selected_ssd_qty > 0 ? selected_ssd_qty + ' x ' : '') +
            ' ' +
            selected_ssd[0].manufacturer +
            ' ' +
            selected_ssd[0].commercial_name +
            ' ' +
            selected_ssd[0].capacity +
            ' GB ' +
            ' <a href="' +
            selected_ssd[0].link +
            '" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            '</div>' +
            '<div class="p-2 flex-fill text-end">$' +
            ssd_price.toFixed(2) +
            '</div>' +
            '</div>';
        total_price = total_price + ssd_price;
    }

    if (selected_gpu.length > 0) {
        info_box.innerHTML =
            info_box.innerHTML +
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            'Video: ' +
            selected_gpu[0].manufacturer +
            ' ' +
            selected_gpu[0].commercial_name +
            ' <a href="' +
            selected_gpu[0].link +
            '" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 12px;"></i></a>' +
            '</div>' +
            '<div class="p-2 flex-fill text-end">$' +
            selected_gpu[0].price.toFixed(2) +
            '</div>' +
            '</div>';
        total_price = total_price + selected_gpu[0].price;
    }

    if (wattage()[0] > 0) {
        info_box.innerHTML =
            info_box.innerHTML +
            '<hr>' +
            '<div class="d-flex">' +
            '<div class="p-2 flex-fill">' +
            'Consumo min / max: ' +
            '</div>' +
            '<div class="p-2 flex-fill text-end">' +
            wattage()[0] +
            ' W / ' +
            wattage()[1] +
            ' W' +
            '</div>' +
            '</div>';
    }

    info_box.innerHTML =
        info_box.innerHTML +
        '<hr>' +
        '<div class="d-flex">' +
        '<div class="p-2 flex-fill">' +
        'Precio Total: ' +
        '</div>' +
        '<div class="p-2 flex-fill text-end">' +
        '$ ' + total_price.toFixed(2) +
        '</div>' +
        '</div>';
}

selection_motherboard.onchange = function (e) {
    if (this.value != 0) {
        selected_motherboard = filtered_motherboard.filter((item) => item.id == this.value);
        filtered_ram = ram_raw_data.filter((item) => item.compatibility.memory_type == selected_motherboard[0].compatibility.memory_type);

        if (selected_motherboard[0].storage.m2_slots > 0) {
            filtered_m2 = discs_raw_data.filter((item) => item.disc_type == 'm2');
            opcion = 0;
            selection_m2_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
            for (let i = 0; i < selected_motherboard[0].storage.m2_slots; i += 1) {
                opcion = i + 1;
                selection_m2_qty.innerHTML = selection_m2_qty.innerHTML + '<option value="' + opcion + '">' + opcion + '</option>';
            }
        }

        if (selected_motherboard[0].storage.sata_6gbs_ports > 0) {
            filtered_ssd = discs_raw_data.filter((item) => item.disc_type == 'ssd');
            opcion = 0;
            selection_ssd_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
            for (let i = 0; i < selected_motherboard[0].storage.sata_6gbs_ports; i += 1) {
                opcion = i + 1;
                selection_ssd_qty.innerHTML = selection_ssd_qty.innerHTML + '<option value="' + opcion + '">' + opcion + '</option>';
            }
        }

        show_info_box();

        reset_all('ram');
        reset_all('ram_qty');
        reset_all('m2');
        reset_all('m2_qty');
        reset_all('ssd');
        reset_all('ssd_qty');
        reset_all('gpu');

        enable_next_step('ram');
    } else {
        reset_all('motherboard');
        reset_all('ram');
        reset_all('ram_qty');
        reset_all('m2');
        reset_all('m2_qty');
        reset_all('ssd');
        reset_all('ssd_qty');
        reset_all('gpu');
        show_info_box();
    }
};

selection_ram.onchange = function (e) {
    if (this.value != 0) {
        selected_ram = filtered_ram.filter((item) => item.id == this.value);

        selection_ram_qty.innerHTML = '';

        if (selected_ram[0].sticks == 1) {
            selected_ram_qty = 2;
            selection_ram_qty.innerHTML =
                '<option value="0">Cantidad</option>' +
                selection_ram_qty.innerHTML +
                '<option value="2" selected>2</option>' +
                '<option value="4">4</option>';
            show_info_box();
        } else {
            selected_ram_qty = 1;
            selection_ram_qty.innerHTML =
                '<option value="0">Cantidad</option>' +
                selection_ram_qty.innerHTML +
                '<option value="1" selected>1</option>' +
                '<option value="2">2</option>';
            show_info_box();
        }

        if (selection_ram_qty.disabled) {
            selection_ram_qty.removeAttribute('disabled');
        }

        show_info_box();

        reset_all('m2');
        reset_all('m2_qty');
        reset_all('ssd');
        reset_all('ssd_qty');
        reset_all('gpu');

        enable_next_step('m2');
        enable_next_step('ssd');
    } else {
        reset_all('ram_qty');
        reset_all('m2');
        reset_all('m2_qty');
        reset_all('ssd');
        reset_all('ssd_qty');
        reset_all('gpu');
        show_info_box();
    }

    if (selected_motherboard.length > 0) {
        if (selected_motherboard[0].storage.m2_slots > 0) {
            filtered_m2 = discs_raw_data.filter((item) => item.disc_type == 'm2');
            opcion = 0;
            selection_m2_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
            for (let i = 0; i < selected_motherboard[0].storage.m2_slots; i += 1) {
                opcion = i + 1;
                selection_m2_qty.innerHTML = selection_m2_qty.innerHTML + '<option value="' + opcion + '">' + opcion + '</option>';
            }
        }

        if (selected_motherboard[0].storage.sata_6gbs_ports > 0) {
            filtered_ssd = discs_raw_data.filter((item) => item.disc_type == 'ssd');
            opcion = 0;
            selection_ssd_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
            for (let i = 0; i < selected_motherboard[0].storage.sata_6gbs_ports; i += 1) {
                opcion = i + 1;
                selection_ssd_qty.innerHTML = selection_ssd_qty.innerHTML + '<option value="' + opcion + '">' + opcion + '</option>';
            }
        }
    }
};

selection_ram_qty.onchange = function (e) {
    selected_ram_qty = this.value;
    show_info_box();
};

selection_m2.onchange = function (e) {
    if (this.value != 0) {
        selected_m2 = filtered_m2.filter((item) => item.id == this.value);
        selection_m2_qty.value = 1;
        selected_m2_qty = 1;
        show_info_box();

        if (selection_m2_qty.disabled) {
            selection_m2_qty.removeAttribute('disabled');
        }

        if (gpu_section_enabled == 0) {
            enable_next_step('gpu');
            gpu_section_enabled = 1;
        }
    } else {
        reset_all('gpu');
        reset_all('m2');
        reset_all('m2_qty');

        show_info_box();

        if (!selection_m2_qty.disabled) {
            selection_m2_qty.setAttribute('disabled', '');
        }

        opcion = 0;
        selection_m2_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
        for (let i = 0; i < selected_motherboard[0].storage.m2_slots; i += 1) {
            opcion = i + 1;
            selection_m2_qty.innerHTML = selection_m2_qty.innerHTML + '<option value="' + opcion + '">' + opcion + '</option>';
        }
    }
};

selection_m2_qty.onchange = function (e) {
    selected_m2_qty = this.value;
    show_info_box();
};

selection_ssd.onchange = function (e) {
    if (this.value != 0) {
        selected_ssd = filtered_ssd.filter((item) => item.id == this.value);
        selection_ssd_qty.value = 1;
        selected_ssd_qty = 1;
        show_info_box();

        if (selection_ssd_qty.disabled) {
            selection_ssd_qty.removeAttribute('disabled');
        }

        if (gpu_section_enabled == 0) {
            enable_next_step('gpu');
            gpu_section_enabled = 1;
        }
    } else {
        reset_all('gpu');
        reset_all('ssd');
        reset_all('ssd_qty');

        show_info_box();

        if (!selection_ssd_qty.disabled) {
            selection_ssd_qty.setAttribute('disabled', '');
        }

        opcion = 0;
        selection_ssd_qty.innerHTML = '<option value="0" selected>Cantidad</option>';
        for (let i = 0; i < selected_motherboard[0].storage.sata_6gbs_ports; i += 1) {
            opcion = i + 1;
            selection_ssd_qty.innerHTML = selection_ssd_qty.innerHTML + '<option value="' + opcion + '">' + opcion + '</option>';
        }
    }
};

selection_ssd_qty.onchange = function (e) {
    selected_ssd_qty = this.value;
    show_info_box();
};

selection_gpu.onchange = function (e) {
    if (this.value != 0) {
        selected_gpu = filtered_gpu.filter((item) => item.id == this.value);
        show_info_box();
    } else {
        reset_all('gpu');
        show_info_box();
    }
};
