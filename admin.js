import {

db,
collection,
addDoc,
getDocs,
doc,
deleteDoc,
updateDoc

}

from "./firebase.js";

/* ==========================
LOGIN ADMIN
========================== */

const adminUser =
"admin";

const adminPass =
"admin123";

let products = [];

/* ==========================
LOGIN
========================== */

window.loginAdmin =
function(){

const username =
document.getElementById(
"username"
).value;

const password =
document.getElementById(
"password"
).value;

if(
username === adminUser &&
password === adminPass
){

localStorage.setItem(
"adminLogin",
"true"
);

showAdmin();

}
else{

alert(
"Username / password salah"
);

}

};

function showAdmin(){

document.getElementById(
"loginPage"
).style.display =
"none";

document.getElementById(
"adminPanel"
).style.display =
"block";

loadProducts();

}

window.logoutAdmin =
function(){

localStorage.removeItem(
"adminLogin"
);

location.reload();

};

if(
localStorage.getItem(
"adminLogin"
) === "true"
){

showAdmin();

}

/* ==========================
COMPRESS IMAGE
========================== */

function convertToBase64(file){

return new Promise(resolve=>{

const reader =
new FileReader();

reader.readAsDataURL(file);

reader.onload = ()=>{

const img =
new Image();

img.src =
reader.result;

img.onload = ()=>{

const canvas =
document.createElement(
"canvas"
);

const ctx =
canvas.getContext(
"2d"
);

const maxWidth =
800;

let width =
img.width;

let height =
img.height;

if(width > maxWidth){

height *=
maxWidth / width;

width =
maxWidth;

}

canvas.width =
width;

canvas.height =
height;

ctx.drawImage(
img,
0,
0,
width,
height
);

const compressed =
canvas.toDataURL(
"image/jpeg",
0.5
);

resolve(compressed);

};

};

});

}

/* ==========================
LOAD PRODUK
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

querySnapshot.forEach(docu=>{

products.push({

firebaseId:
docu.id,

...docu.data()

});

});

renderProducts();

}

/* ==========================
RENDER PRODUK
========================== */

function renderProducts(){

const productList =
document.getElementById(
"adminProductList"
);

if(!productList) return;

productList.innerHTML =
"";

products.forEach(product=>{

productList.innerHTML += `

<div class="admin-product-card">

<img
src="${product.images?.[0]}"
alt="${product.name}">

<div class="product-info">

<h4>
${product.name}
</h4>

<p>
Kategori :
${product.category}
</p>

<p>
Harga :
Rp ${product.price.toLocaleString("id-ID")}
</p>

<p>
Stok :
${product.stock}
</p>

<div class="product-actions">

<button
class="edit-btn"
onclick="
editProduct(
'${product.firebaseId}'
)
">

Edit

</button>

<button
class="delete-btn"
onclick="
deleteProduct(
'${product.firebaseId}'
)
">

Hapus

</button>

</div>

</div>

</div>

`;

});

}

/* ==========================
SAVE PRODUCT
========================== */

window.saveProduct =
async function(){

const productId =
document.getElementById(
"productId"
).value;

const name =
document.getElementById(
"productName"
).value;

const category =
document.getElementById(
"productCategory"
).value;

const price =
document.getElementById(
"productPrice"
).value;

const stock =
document.getElementById(
"productStock"
).value;

const description =
document.getElementById(
"productDescription"
).value;

const files =
document.getElementById(
"productImages"
).files;

if(
!name ||
!category ||
!price ||
!stock
){

alert(
"Isi semua data"
);

return;

}

/* UPLOAD GAMBAR */

let images = [];

for(let file of files){

const image =
await convertToBase64(
file
);

images.push(
image
);

}

/* EDIT */

if(productId){

await updateDoc(

doc(
db,
"products",
productId
),

{

name,
category,

price:
Number(price),

stock:
Number(stock),

description,

images

}

);

alert(
"Produk berhasil diupdate"
);

}

/* TAMBAH */

else{

await addDoc(

collection(
db,
"products"
),

{

name,
category,

price:
Number(price),

stock:
Number(stock),

description,

images,

createdAt:
Date.now()

}

);

alert(
"Produk berhasil ditambah"
);

}

resetForm();

loadProducts();

};

/* ==========================
EDIT PRODUK
========================== */

window.editProduct =
function(firebaseId){

const product =
products.find(
p =>
p.firebaseId ===
firebaseId
);

document.getElementById(
"productId"
).value =
firebaseId;

document.getElementById(
"productName"
).value =
product.name;

document.getElementById(
"productCategory"
).value =
product.category;

document.getElementById(
"productPrice"
).value =
product.price;

document.getElementById(
"productStock"
).value =
product.stock;

document.getElementById(
"productDescription"
).value =
product.description;

window.scrollTo({

top:0,
behavior:"smooth"

});

};

/* ==========================
DELETE PRODUK
========================== */

window.deleteProduct =
async function(firebaseId){

const confirmDelete =
confirm(
"Hapus produk?"
);

if(!confirmDelete)
return;

await deleteDoc(

doc(
db,
"products",
firebaseId
)

);

loadProducts();

};

/* ==========================
RESET FORM
========================== */

function resetForm(){

document.getElementById(
"productId"
).value = "";

document.getElementById(
"productName"
).value = "";

document.getElementById(
"productCategory"
).value = "";

document.getElementById(
"productPrice"
).value = "";

document.getElementById(
"productStock"
).value = "";

document.getElementById(
"productDescription"
).value = "";

document.getElementById(
"productImages"
).value = "";

}