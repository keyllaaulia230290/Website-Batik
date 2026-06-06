import {
db,
collection,
getDocs
}
from "./firebase.js";
/* ==========================
GET PRODUCT ID
========================== */
const params =
new URLSearchParams(
window.location.search
);
const productId =
params.get("id");
/* ==========================
GLOBAL PRODUCT
========================== */
let currentProduct = null;
/* ==========================
LOAD PRODUCT
========================== */
async function loadProduct(){
const querySnapshot =
await getDocs(
collection(
db,
"products"
)
);
querySnapshot.forEach(doc=>{
if(doc.id === productId){
currentProduct = {
id:doc.id,
...doc.data()
};
}
});
/* NOT FOUND */
if(!currentProduct){
document.body.innerHTML = `
<div style="
height:100vh;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
font-family:Poppins;
">
<h1>
Produk tidak ditemukan
</h1>
<a href="index.html">
Kembali ke Beranda
</a>
</div>
`;
return;
}
/* RENDER DATA */
document.getElementById(
"detailName"
).textContent =
currentProduct.name;
document.getElementById(
"detailCategory"
).textContent =
currentProduct.category;
document.getElementById(
"detailPrice"
).textContent =
"Rp " +
currentProduct.price.toLocaleString(
"id-ID"
);
document.getElementById(
"detailStock"
).textContent =
"Stok : " +
currentProduct.stock;
document.getElementById(
"detailDescription"
).innerHTML =

(currentProduct.description ||

"Belum ada deskripsi")

.replace(/\n/g,"<br>");
/* MAIN IMAGE */
const mainImage =
document.getElementById(
"mainImage"
);
mainImage.src =
currentProduct.images?.[0] ||
"https://via.placeholder.com/500";
/* THUMBNAIL */
const thumbnailContainer =
document.getElementById(
"thumbnailContainer"
);
thumbnailContainer.innerHTML =
"";
currentProduct.images?.forEach(
(image)=>{
const img =
document.createElement(
"img"
);
img.src =
image;
img.className =
"thumbnail";
img.addEventListener(
"click",
()=>{
mainImage.src =
image;
}
);
thumbnailContainer
.appendChild(img);
});
}
/* ==========================
ADD CART
========================== */
window.addDetailToCart =
function(){

if(!currentProduct){
return;
}

/* GET CART */

let cart =
JSON.parse(
localStorage.getItem(
"cart"
)
) || [];

/* PUSH PRODUCT */

cart.push(currentProduct);

/* SAVE */

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

/* UPDATE UI */

updateCart();

/* SUCCESS */

showToast(
`${currentProduct.name}
berhasil ditambahkan`
);

};
/* ==========================
BUY NOW
========================== */
window.buyNow =
function(){
if(!currentProduct)
return;
let message =
`Halo Ajra Batik,
Saya ingin membeli:
${currentProduct.name}
Harga:
Rp ${currentProduct.price.toLocaleString("id-ID")}
`;
const nomorAdmin =
"6285864478882";
window.location.href =
`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(message)}`;
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
loadProduct();

/* ==========================
CART
========================== */

let cart =
JSON.parse(
localStorage.getItem(
"cart"
)
) || [];

window.toggleCart =
function(){

document
.getElementById(
"cartSidebar"
)
.classList
.toggle(
"active"
);

document
.getElementById(
"overlay"
)
.classList
.toggle(
"active"
);

updateCart();

};

function updateCart(){

/* GET FRESH CART */

cart =
JSON.parse(
localStorage.getItem(
"cart"
)
) || [];

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

cart.forEach(
(item,index)=>{

total += Number(
item.price
);

cartItems.innerHTML += `

<div class="cart-item">

<div>

<strong>
${item.name}
</strong>

<br>

Rp
${Number(item.price)
.toLocaleString("id-ID")}

</div>

<button
class="remove-btn"
onclick="removeCart(${index})">

Hapus

</button>

</div>

`;

});

/* UPDATE BADGE */

if(cartCount){

cartCount.textContent =
cart.length;

}

/* TOTAL */

if(totalPrice){

totalPrice.textContent =
total.toLocaleString(
"id-ID"
);

}

}