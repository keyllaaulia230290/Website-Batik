import { db, collection, getDocs } from "./firebase.js";

/* ==========================
DATA
========================== */

let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let discount = 0;
let discountPercent = 0;

const productsPerPage = 10;

let currentPage = 1;

/* ==========================
LOAD PRODUK FIREBASE
========================== */

async function loadProducts() {
  products = [];

  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach((doc) => {
    products.push({
      id: doc.id,

      ...doc.data(),
    });
  });

  renderProducts();
}

/* ==========================
RENDER PRODUK
========================== */

function renderProducts(data = products) {
  const productList = document.getElementById("productList");

  const pagination = document.getElementById("pagination");

  if (!productList) return;

  productList.innerHTML = "";

  const start = (currentPage - 1) * productsPerPage;

  const end = start + productsPerPage;

  const paginatedProducts = data.slice(start, end);

  paginatedProducts.forEach((product) => {
    productList.innerHTML += `

<div
class="product-card"
onclick="
window.location.href=
'product-detail.html?id=${product.id}'
">

<div class="stock-badge">
Stok ${product.stock}
</div>

<img
src="${product.images?.[0]}"
alt="${product.name}">

<div class="product-content">

<h3>
${product.name}
</h3>

<p class="price">
Rp
${product.price.toLocaleString("id-ID")}
</p>

<button
class="add-btn"
onclick="
event.stopPropagation();
addToCart('${product.id}')
">

Tambah Keranjang

</button>

</div>

</div>

`;
  });

  renderPagination(data);
}

/* ==========================
PAGINATION
========================== */

function renderPagination(data) {
  const pagination = document.getElementById("pagination");

  if (!pagination) return;

  pagination.innerHTML = "";

  const totalPages = Math.ceil(data.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `

<button
class="${i === currentPage ? "active" : ""}"

onclick="
changePage(${i})
">

${i}

</button>

`;
  }
}

window.changePage = function (page) {
  currentPage = page;

  renderProducts();

  window.scrollTo({
    top: 600,
    behavior: "smooth",
  });
};

/* ==========================
ADD TO CART
========================== */

window.addToCart = function (id) {
  const product = products.find((p) => p.id === id);

  if (!product) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast(product.name + " ditambahkan");

  updateCart();
};

/* ==========================
UPDATE CART
========================== */

function updateCart() {
  const cartItems = document.getElementById("cartItems");

  const cartCount = document.getElementById("cartCount");

  const totalPrice = document.getElementById("totalPrice");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `

<div class="empty-cart">

🛒

<p>
Keranjang masih kosong
</p>

</div>

`;
  }

  cart.forEach((item, index) => {
    const qty = item.qty || 1;

    total += item.price * qty;

    cartItems.innerHTML += `

<div class="cart-item">

<div>

<strong>
${item.name}
</strong>

<br>

Rp ${item.price.toLocaleString("id-ID")}

<br><br>

<div class="qty-box">

<button
onclick="decreaseQty(${index})">
-
</button>

<span>
${qty}
</span>

<button
onclick="increaseQty(${index})">
+
</button>

</div>

</div>

<button
class="remove-btn"
onclick="removeCart(${index})">

Hapus

</button>

</div>

`;
  });

  /* HITUNG DISKON */

  discount = (total * discountPercent) / 100;

  /* FINAL TOTAL */

  let finalTotal = total - discount;

  if (finalTotal < 0) {
    finalTotal = 0;
  }

  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  if (totalPrice) {
    totalPrice.textContent = finalTotal.toLocaleString("id-ID");
  }
}

/* ==========================
REMOVE CART
========================== */

window.removeCart = function (index) {
  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
};

window.increaseQty = function (index) {
  cart[index].qty = (cart[index].qty || 1) + 1;

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
};

window.decreaseQty = function (index) {
  if ((cart[index].qty || 1) > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
};

/* ==========================
SEARCH
========================== */

window.searchProduct = function () {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(keyword),
  );

  renderProducts(filtered);
};

/* ==========================
FILTER CATEGORY
========================== */

window.filterCategory = function (category) {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.classList.remove("active");
  });

  if (event) {
    event.target.classList.add("active");
  }

  if (category === "all") {
    renderProducts(products);

    return;
  }

  const filtered = products.filter(
    (product) =>
      product.category &&
      product.category.toLowerCase() === category.toLowerCase(),
  );

  renderProducts(filtered);
};

/* ==========================
PROMO CODE
========================== */

window.applyPromo = function () {
  const promoInput = document.getElementById("promoCode");

  const promoMessage = document.getElementById("promoMessage");

  if (!promoInput) return;

  const code = promoInput.value.trim().toUpperCase();

  /* RESET */

  discount = 0;
  discountPercent = 0;

  /* PROMO */

  if (code === "JUNEJULY") {
    discountPercent = 16;

    promoMessage.textContent = "Promo berhasil! Diskon 16%";

    promoMessage.style.color = "green";
  } else if (code === "JUNEJULY") {
    discountPercent = 16;

    promoMessage.textContent = "Promo berhasil! Diskon 16%";

    promoMessage.style.color = "green";
  } else {
    promoMessage.textContent = "Kode promo tidak valid";

    promoMessage.style.color = "red";
  }

  updateCart();
};

/* ==========================
TOAST
========================== */

function showToast(message) {
  const toast = document.getElementById("toast");

  const toastText = document.getElementById("toastText");

  if (!toast) return;

  toastText.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* ==========================
LOAD
========================== */

loadProducts();

updateCart();

window.checkoutWhatsapp = function () {
  if (cart.length === 0) {
    alert("Keranjang masih kosong");

    return;
  }

  let total = 0;

  let message = "Halo Ajra Batik,%0A%0ASaya ingin memesan:%0A%0A";

  cart.forEach((item) => {
    const qty = item.qty || 1;

    message += `• ${item.name}
(${qty} pcs)
Rp ${item.price.toLocaleString("id-ID")}
%0A`;

    total += item.price * qty;
  });

  /* APPLY PROMO */

  discount = (total * discountPercent) / 100;

  total -= discount;

  if (total < 0) {
    total = 0;
  }

  message += `%0A--------------------`;

  message += `%0ADiskon (${discountPercent}%)
: Rp ${discount.toLocaleString("id-ID")}`;

  message += `%0ATotal : Rp ${total.toLocaleString("id-ID")}`;

  const nomorAdmin = "6285864478882";

  window.location.href = `https://wa.me/${nomorAdmin}?text=${message}`;
};
