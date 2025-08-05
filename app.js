const rateAsuransi = {3:0.2016,6:0.4008,12:0.8040,18:1.1460,24:1.4880,30:1.7892,36:2.0904,48:2.6136,60:8.6640};
const biayaAdmAsuransi = 50000;
const admin1 = 700000;
const admin2 = 350000;

// Format input Rupiah
function formatInputRupiah(input){
    let v = input.value.replace(/[^,\d]/g, "");
    if (!v) { input.value = ""; return; }
    input.value = "Rp " + parseInt(v, 10).toLocaleString("id-ID");
}

// Simpan & format input Persen
function saveRate(input){
    let v = input.value.replace(/[^0-9.]/g, "");
    if (!v) { 
        input.value = ""; 
        localStorage.removeItem('rateBunga'); 
        disableHitung(); 
        return; 
    }
    input.value = v + "%";
    localStorage.setItem('rateBunga', v + "%");
    updateButtonState();
}

// Simpan Skim ke localStorage
function saveSkim(input){
    localStorage.setItem('skim', input.value);
}

// Ambil numeric dari input
function getNumeric(id){
    return parseInt((document.getElementById(id).value || "").replace(/[^,\d]/g, "")) || 0;
}

// Ambil persentase dari input
function getPercent(id){
    return parseFloat((document.getElementById(id).value || "").replace(/[^0-9.]/g, "")) || 0;
}

// Format ke Rupiah
function formatRupiah(n){
    return "Rp " + n.toLocaleString("id-ID");
}

// Hitung cicilan
function hitungCicilan(harga, dp, n, skim){
    const totalAdmin = admin1 + admin2 + skim;
    const tenorNearest = n<=3?3:n<=6?6:n<=12?12:n<=18?18:n<=24?24:n<=30?30:n<=36?36:n<=48?48:60;
    const asuransi = Math.ceil(((harga * (rateAsuransi[tenorNearest] / 100)) + biayaAdmAsuransi) / 1000) * 1000;
    const pinjaman = harga - dp + totalAdmin + asuransi;
    const r = getPercent("rate") / 100 / 12;
    const pmt = (r * pinjaman) / (1 - Math.pow(1 + r, -n));
    return Math.ceil(pmt / 1000) * 1000;
}

// Update semua nilai
function updateAll(){
    const harga = getNumeric('harga');
    const dp = getNumeric('dp');
    const tenor = parseInt(document.getElementById('tenor').value) || 0;
    const skim = getNumeric('admin3');
    const totalAdmin = admin1 + admin2 + skim;

    document.getElementById('admin1').value = formatRupiah(admin1);
    document.getElementById('admin2').value = formatRupiah(admin2);

    const tenorNearest = tenor<=3?3:tenor<=6?6:tenor<=12?12:tenor<=18?18:tenor<=24?24:tenor<=30?30:tenor<=36?36:tenor<=48?48:60;
    const asuransi = Math.ceil(((harga * (rateAsuransi[tenorNearest] / 100)) + biayaAdmAsuransi) / 1000) * 1000;
    const pokok = harga - dp + totalAdmin + asuransi;
    document.getElementById('pokok').value = formatRupiah(pokok);

    if (!harga || !dp) {
        [11, 23, 35, 47].forEach(t => document.getElementById('sim' + t).textContent = "Rp 0");
    } else {
        [11, 23, 35, 47].forEach(t => {
            let skimSim = (t === 11 || t === 23) ? 200000 : skim;
            document.getElementById('sim' + t).textContent = formatRupiah(hitungCicilan(harga, dp, t, skimSim));
        });
    }

    updateButtonState();
}

// Update status tombol
function updateButtonState(){
    const harga = getNumeric('harga');
    const dp = getNumeric('dp');
    const rate = getPercent('rate');
    const btn = document.getElementById('btnHitung');

    if (!harga || !dp || !rate || dp >= harga) {
        btn.disabled = true;
    } else {
        btn.disabled = false;
    }
}

// Hitung utama
function hitung(){
    const harga = getNumeric('harga');
    const dp = getNumeric('dp');
    const tenor = parseInt(document.getElementById('tenor').value) || 0;
    const skim = getNumeric('admin3');
    const hasil = document.getElementById('hasil');

    const cicilan = hitungCicilan(harga, dp, tenor, skim);
    hasil.classList.remove('error');
    hasil.textContent = "Cicilan " + tenor + " bulan: " + formatRupiah(cicilan);
    updateAll();
}

// Mode Gelap + LocalStorage
const toggle = document.getElementById('modeToggle');
toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggle.classList.toggle('active');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    toggle.classList.add('active');
}

// Ambil rate bunga & skim dari localStorage
if (localStorage.getItem('rateBunga')) {
    document.getElementById('rate').value = localStorage.getItem('rateBunga');
}
if (localStorage.getItem('skim')) {
    document.getElementById('admin3').value = localStorage.getItem('skim');
}

updateAll();
