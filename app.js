import {

db,
collection,
getDocs

}

from "./firebase.js";

/* ==========================
DATA
========================== */

let products = [];

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

let discount = 0;

const productsPerPage = 10;

let currentPage = 1;

/* ==========================
LOAD PRODUK FIREBASE
========================== */

async function loadProducts(){

products = [];

const querySnapshot =
await getDocs(
collection(
db,
"products"
)
);

querySnapshot.forEach(doc=>{

products.push({

id:doc.id,

...doc.data()

});

});

renderProducts();

}

/* ==========================
RENDER PRODUK
========================== */

function renderProducts(
data = products
){

const productList =
document.getElementById(
"productList"
);

const pagination =
document.getElementById(
"pagination"
);

if(!productList) return;

productList.innerHTML =
"";

const start =
(currentPage - 1)
* productsPerPage;

const end =
start + productsPerPage;

const paginatedProducts =
data.slice(start,end);

paginatedProducts.forEach(product=>{

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
src="${
product.images?.[0]
}"
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

function renderPagination(data){

const pagination =
document.getElementById(
"pagination"
);

if(!pagination) return;

pagination.innerHTML =
"";

const totalPages =
Math.ceil(
data.length /
productsPerPage
);

for(let i=1;i<=totalPages;i++){

pagination.innerHTML += `

<button
class="${
i === currentPage
? "active"
: ""
}"

onclick="
changePage(${i})
">

${i}

</button>

`;

}

}

window.changePage =
function(page){

currentPage = page;

renderProducts();

window.scrollTo({

top:600,
behavior:"smooth"

});

};

/* ==========================
ADD TO CART
========================== */

window.addToCart =
function(id){

const product =
products.find(
p => p.id === id
);

if(!product) return;

cart.push(product);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

showToast(
product.name +
" berhasil ditambahkan"
);

updateCart();

};

/* ==========================
UPDATE CART
========================== */

function updateCart(){

const cartItems =
document.getElementById(
"cartItems"
);

const cartCount =
document.getElementById(
"cartCount"
);

const totalPrice =
document.getElementById(
"totalPrice"
);

if(!cartItems) return;

cartItems.innerHTML =
"";

let total = 0;

if(cart.length === 0){

cartItems.innerHTML = `

<div class="empty-cart">

🛒

<p>
Keranjang masih kosong
</p>

</div>

`;

}

cart.forEach((item,index)=>{

total += item.price;

cartItems.innerHTML += `

<div class="cart-item">

<div>

<strong>
${item.name}
</strong>

<br>

Rp
${item.price.toLocaleString("id-ID")}

</div>

<button
class="remove-btn"
onclick="
removeCart(${index})
">

Hapus

</button>

</div>

`;

});

total -= discount;

if(total < 0){
total = 0;
}

if(cartCount){

cartCount.textContent =
cart.length;

}

if(totalPrice){

totalPrice.textContent =
total.toLocaleString(
"id-ID"
);

}

}

/* ==========================
REMOVE CART
========================== */

window.removeCart =
function(index){

cart.splice(index,1);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCart();

};

/* ==========================
SEARCH
========================== */

window.searchProduct =
function(){

const keyword =
document
.getElementById(
"searchInput"
)
.value
.toLowerCase();

const filtered =
products.filter(product=>

product.name
.toLowerCase()
.includes(keyword)

);

renderProducts(filtered);

};

/* ==========================
FILTER CATEGORY
========================== */

window.filterCategory =
function(category){

document
.querySelectorAll(
".category-card"
)
.forEach(card=>{

card.classList.remove(
"active"
);

});

event.target.classList.add(
"active"
);

if(category === "all"){

renderProducts(products);

return;

}

const filtered =
products.filter(product=>

product.category ===
category

);

renderProducts(filtered);

};

/* ==========================
TOAST
========================== */

function showToast(message){

const toast =
document.getElementById(
"toast"
);

const toastText =
document.getElementById(
"toastText"
);

if(!toast) return;

toastText.textContent =
message;

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2500);

}

/* ==========================
LOAD
========================== */

loadProducts();

updateCart();