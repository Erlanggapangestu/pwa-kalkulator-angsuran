document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calcForm");
  const resultDiv = document.getElementById("result");
  const tableDiv = document.getElementById("simulationTable");
  const toggle = document.getElementById("darkModeToggle");

  // Dark Mode toggle
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", toggle.checked);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const harga = parseFloat(document.getElementById("harga").value);
    const dp = parseFloat(document.getElementById("dp").value);
    const tenor = parseInt(document.getElementById("tenor").value);
    const bunga = parseFloat(document.getElementById("bunga").value);

    if (dp >= harga) {
      resultDiv.textContent = "❌ DP tidak boleh lebih besar atau sama dengan Harga OTR";
      resultDiv.classList.add("error");
      tableDiv.innerHTML = "";
      return;
    }

    const pinjaman = harga - dp;
    const bungaTotal = pinjaman * (bunga / 100) * tenor;
    const totalBayar = pinjaman + bungaTotal;
    const angsuran = totalBayar / tenor;

    resultDiv.classList.remove("error");
    resultDiv.textContent = `Angsuran per bulan: Rp ${angsuran.toLocaleString()}`;

    // Buat tabel simulasi
    let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Bulan</th>
            <th>Angsuran (Rp)</th>
            <th>Sisa Pinjaman (Rp)</th>
          </tr>
        </thead>
        <tbody>
    `;

    let sisa = totalBayar;
    for (let i = 1; i <= tenor; i++) {
      sisa -= angsuran;
      tableHTML += `
        <tr>
          <td>${i}</td>
          <td>${angsuran.toLocaleString()}</td>
          <td>${sisa > 0 ? sisa.toLocaleString() : 0}</td>
        </tr>
      `;
    }

    tableHTML += `</tbody></table>`;
    tableDiv.innerHTML = tableHTML;
  });
});
