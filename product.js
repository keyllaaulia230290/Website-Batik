/* ==========================
   AMBIL ID PRODUK
========================== */

const params =
new URLSearchParams(
window.location.search
);

const productId =
Number(params.get("id"));

/* ==========================
   DATA PRODUK
========================== */

let products =
JSON.parse(
localStorage.getItem("products")
);

/* fallback kalau localStorage kosong */

if(
!Array.isArray(products)
||
products.length === 0
){

products = [

{
    id:1,
    name:"Batik Premium Sogan",
    category:"premium",
    price:150000,
    stock:10,
    image:"images/batik1.jpg",
    description:
    "Kain batik premium kualitas terbaik."
},

{
    id:2,
    name:"Batik Katun Mega Mendung",
    category:"katun",
    price:175000,
    stock:8,
    image:"images/batik2.jpg",
    description:
    "Batik katun adem dan nyaman."
},

{
    id:3,
    name:"Batik Rayon Floral",
    category:"rayon",
    price:200000,
    stock:5,
    image:"images/batik3.jpg",
    description:
    "Kain rayon lembut dan jatuh."
}

];

}

/* ==========================
   CARI PRODUK
========================== */

const product =
products.find(
p => p.id === productId
);

/* ==========================
   JIKA PRODUK TIDAK ADA
========================== */

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

Kembali ke Beranda

</a>

</div>

`;

}

/* ==========================
   FORMAT RUPIAH
========================== */

function rupiah(number){

return number
.toLocaleString("id-ID");

}

/* ==========================
   TAMPILKAN PRODUK
========================== */

function loadProduct(){

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
rupiah(product.price);

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

const mainImage =
document.getElementById(
"mainImage"
);

const thumbnailContainer =
document.getElementById(
"thumbnailContainer"
);

/* SUPPORT 1 ATAU BANYAK FOTO */

const images =
product.images ||
[product.image];

mainImage.src =
images[0];

thumbnailContainer.innerHTML =
"";

images.forEach(image=>{

thumbnailContainer.innerHTML += `

<img
src="${image}"
class="thumbnail"
onclick="changeImage('${image}')">

`;

});

}

/* ==========================
   GANTI FOTO
========================== */

function changeImage(image){

document.getElementById(
"mainImage"
).src =
image;

}

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
   TAMBAH KERANJANG
========================== */

function addDetailToCart(){

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

cart.push(product);

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

showToast(
product.name +
" berhasil ditambahkan"
);

}

/* ==========================
   BELI SEKARANG
========================== */

function buyNow(){

let message =

`Halo Ajra Batik,

Saya ingin membeli:

${product.name}

Harga:
Rp ${rupiah(product.price)}

`;

const nomorAdmin =
"6285864478882";

window.open(

`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(message)}`,

"_blank"

);

}

/* ==========================
   LOAD
========================== */

loadProduct();