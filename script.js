document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function handleQuantity(element, change) {
  const input = element.parentElement.querySelector("input");
  let current = parseInt(input.value) || 0;
  input.value = Math.max(current + change, 0);
}

const sheetID = "1a8CKZGu23Ux1Gl8I1ajKNHXJDphaHY2oNdmSKYM9cVo";
const sheetName = "Sheet1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

const loader = document.getElementById("loader");
const searchInput = document.getElementById("search");

function fetchData() {
  if (loader) loader.style.display = "block";

  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const data = JSON.parse(rep.substr(47).slice(0, -2));
      let html = "";
      data.table.rows.forEach(row => {
        const name = row.c[0]?.v || "";
        const price = row.c[1]?.v || "";
        const unit = row.c[2]?.v || "";
        const message = row.c[3]?.v || "";
        const encoded = encodeURIComponent(`Hi, ${message} for ₹${price}`);
        const waLink = `https://wa.me/918449062522?text=${encoded}`;

        html += `
          <div class="product">
            <h2>${name} (${unit})</h2>
            <div class="price-tag">₹${price}</div>
            <div class="quantity-section">
              <button onclick="handleQuantity(this, -1)">➖</button>
              <input type="number" value="1" min="1" readonly />
              <button onclick="handleQuantity(this, 1)">➕</button>
            </div>
            <a href="${waLink}" target="_blank">
              <img src="https://img.icons8.com/color/48/whatsapp--v1.png" />
              Order on WhatsApp
            </a>
          </div>
        `;
      });

      document.getElementById("catalog").innerHTML = html;
      if (loader) loader.style.display = "none";
    });
}

fetchData();
setInterval(fetchData, 10000);

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
      const name = product.querySelector("h2").textContent.toLowerCase();
      product.style.display = name.includes(query) ? "block" : "none";
    });
  });
}

window.addEventListener("offline", () => {
  alert("You're offline. Please check your internet connection.");
});
