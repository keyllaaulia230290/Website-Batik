import {

db,
collection,
getDocs

}

from "./firebase.js";

/* ==========================
GET ID URL
========================== */

const params =
new URLSearchParams(
window.location.search
);

const productId =
params.get("id");

/* ==========================
LOAD PRODUCT
========================== */

async function loadProduct(){

let product = null;

const querySnapshot =
await getDocs(
collection(
db,
"products"
)
);

querySnapshot.forEach(doc=>{

if(doc.id === productId){

product = {

id:doc.id,

...doc.data()

};

}

});

/* NOT FOUND */

if(!product){

document.body.innerHTML = `

<div
style="
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

Kembali

</a>

</div>

`;

return;

}

/* RENDER */

document.getElementById(
"detailName"
).textContent =
product.name;

document.getElementById(
"detailCategory"
).textContent =
"Kategori : " +
product.category;

document.getElementById(
"detailPrice"
).textContent =
"Rp " +
product.price.toLocaleString(
"id-ID"
);

document.getElementById(
"detailStock"
).textContent =
"Stok tersedia : " +
product.stock;

document.getElementById(
"detailDescription"
).textContent =
product.description ||
"Tidak ada deskripsi";

/* IMAGE */

const mainImage =
document.getElementById(
"mainImage"
);

const thumbnailContainer =
document.getElementById(
"thumbnailContainer"
);

mainImage.src =
product.images?.[0];

thumbnailContainer.innerHTML =
"";

product.images?.forEach(image=>{

thumbnailContainer.innerHTML += `

<img
src="${image}"
class="thumbnail"
onclick="
changeImage(
'${image}'
)
">

`;

});

/* CART */

window.addDetailToCart =
function(){

let cart =
JSON.parse(
localStorage.getItem(
"cart"
)
) || [];

cart.push(product);

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

showToast(
"Berhasil ditambahkan"
);

};

/* BUY NOW */

window.buyNow =
function(){

let message =

`Halo Ajra Batik,

Saya ingin membeli:

${product.name}

Harga:
Rp ${product.price.toLocaleString("id-ID")}

`;

const nomorAdmin =
"6285864478882";

window.open(

`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(message)}`,

"_blank"

);

};

}

/* ==========================
CHANGE IMAGE
========================== */

window.changeImage =
function(image){

document.getElementById(
"mainImage"
).src =
image;

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