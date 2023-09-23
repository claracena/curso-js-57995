const endpoints = [
    "https://javascript.cesararacena.com/json/processors.json",
    "https://javascript.cesararacena.com/json/motherboards.json",
    "https://javascript.cesararacena.com/json/ram.json",
    "https://javascript.cesararacena.com/json/discs.json",
    "https://javascript.cesararacena.com/json/gpu.json",
    "https://javascript.cesararacena.com/json/psu.json",
    // "./json/processors.json",
    // "./json/motherboards.json",
    // "./json/ram.json",
    // "./json/discs.json",
    // "./json/gpu.json",
    // "./json/psu.json",
];

let cpu_raw_data = [];
let motherboard_raw_data = [];
let ram_raw_data = [];
let discs_raw_data = [];
let gpu_raw_data = [];
let psu_raw_data = [];

const selection_processors = document.getElementById("processor_select");
const selection_motherboard = document.getElementById("motherboard_select");
const selection_ram = document.getElementById("ram_select");
const selection_ram_qty = document.getElementById("ram_select_qty");
const selection_m2 = document.getElementById("m2_select");
const selection_m2_qty = document.getElementById("m2_select_qty");
const selection_ssd = document.getElementById("ssd_select");
const selection_ssd_qty = document.getElementById("ssd_select_qty");
const selection_gpu = document.getElementById("video_select");
const selection_psu = document.getElementById("psu_select");
const selection_country = document.getElementById("select_pais");

const info_processors = document.getElementById("processor_select_info");
const info_motherboard = document.getElementById("motherboard_select_info");
const info_ram = document.getElementById("ram_select_info");
const info_discs_m2 = document.getElementById("discs_m2_select_info");
const info_discs_ssd = document.getElementById("discs_ssd_select_info");
const info_gpu = document.getElementById("video_select_info");
const info_psu = document.getElementById("psu_select_info");
const info_price = document.getElementById("total_price");
const info_box = document.getElementById("information_box");

let selected_processor = [];
let selected_motherboard = [];
let selected_ram = [];
let selected_ram_qty = 0;
let selected_m2 = [];
let selected_m2_qty = 0;
let selected_ssd = [];
let selected_ssd_qty = 0;
let selected_gpu = [];
let selected_psu = [];
let selected_country = "";

let filtered_processor = [];
let filtered_motherboard = [];
let filtered_ram = [];
let filtered_m2 = [];
let filtered_ssd = [];
let filtered_gpu = [];
let filtered_psu = [];

let info_content;
let opcion = 0;
let min_wattage = 0;
let max_wattage = 0;
let total_wattage = [];
let total_price = 0;

let motherboard_section_enabled = 0;
let ram_section_enabled = 0;
let m2_section_enabled = 0;
let ssd_section_enabled = 0;
let gpu_section_enabled = 0;
let psu_section_enabled = 0;