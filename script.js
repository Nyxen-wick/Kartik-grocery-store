document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function handleQuantity(element, change) {
  const product = element.closest(".product");
  const input = product.querySelector("input");
  let currentQty = parseInt(input.value) || 1;
  let newQty = Math.max(currentQty + change, 1);
  input.value = newQty;

  const basePrice = parseFloat(product.getAttribute("data-base-price")) || 0;
  const total = basePrice * newQty;
  product.querySelector(".price-tag").textContent = `₹${basePrice} × ${newQty} = ₹${total}`;

  updateWhatsAppLink(product);
}

function updateWhatsAppLink(product) {
  const nameText = product.querySelector("h2").textContent;
  const name = nameText.split(" (")[0];
  const unit = nameText.split("(")[1]?.replace(")", "") || "";
  const price = parseFloat(product.getAttribute("data-base-price")) || 0;
  const qty = parseInt(product.querySelector("input").value) || 1;
  const total = price * qty;
  const message = `Hi, I want to order ${qty} ${unit} ${name} for ₹${price} × ${qty} = ₹${total}`;
  const encoded = encodeURIComponent(message);
  const waLink = `https://wa.me/918449062522?text=${encoded}`;

  product.querySelector("a").setAttribute("href", waLink);
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
        const price = parseFloat(row.c[1]?.v || "0");
        const unit = row.c[2]?.v || "";
        const message = row.c[3]?.v || "";

        html += `
          <div class="product" data-base-price="${price}">
            <h2>${name} (${unit})</h2>
            <div class="price-tag">₹${price} × 1 = ₹${price}</div>
            <div class="quantity-section">
              <button onclick="handleQuantity(this, -1)">➖</button>
              <input type="number" value="1" min="1" readonly />
              <button onclick="handleQuantity(this, 1)">➕</button>
            </div>
            <a href="https://wa.me/918449062522" target="_blank">
              <img src="https://img.icons8.com/color/48/whatsapp--v1.png" />
              Order on WhatsApp
            </a>
          </div>
        `;
      });

      document.getElementById("catalog").innerHTML = html;

      // Update WhatsApp link and price tag on page load
      document.querySelectorAll(".product").forEach(updateWhatsAppLink);

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
