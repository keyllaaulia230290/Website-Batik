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
let detailQty = 1;
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
currentProduct.stock + " pcs";

document.getElementById(
"detailMaterial"
).textContent =
currentProduct.material || "-";

document.getElementById(
"detailShipping"
).textContent =
currentProduct.shipping || "-";
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
DETAIL QTY
========================== */

window.increaseDetailQty = function(){

    detailQty++;

    document.getElementById(
        "detailQty"
    ).textContent = detailQty;

};

window.decreaseDetailQty = function(){

    if(detailQty > 1){

        detailQty--;

        document.getElementById(
            "detailQty"
        ).textContent = detailQty;

    }

};

/* ==========================
ADD CART
========================== */

window.addDetailToCart = function(){

    if(!currentProduct) return;

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existing =
    cart.find(
        item => item.id === currentProduct.id
    );

    if(existing){

        existing.qty =
        (existing.qty || 1) + detailQty;

    }else{

        cart.push({

            ...currentProduct,

            qty:detailQty

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    showToast(
        detailQty +
        " pcs ditambahkan"
    );

};
/* ==========================
BUY NOW
========================== */
window.buyNow =
function(){

if(!currentProduct)
return;

const subtotal =

currentProduct.price
* detailQty;

let message =

`Halo Ajra Batik,

Saya ingin membeli:

${currentProduct.name}

Jumlah:
${detailQty} pcs

Total:
Rp ${subtotal.toLocaleString("id-ID")}
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

    cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const cartItems =
    document.getElementById("cartItems");

    const cartCount =
    document.getElementById("cartCount");

    const totalPrice =
    document.getElementById("totalPrice");

    if(!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item,index)=>{

        total += Number(item.price) * (item.qty || 1);

        cartItems.innerHTML += `

        <div class="cart-item">

            <img
            class="cart-image"
            src="${item.images?.[0] || 'https://via.placeholder.com/90'}">

            <div class="cart-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    Rp ${Number(item.price).toLocaleString("id-ID")}
                </span>

                <div class="qty-box">

                    <button onclick="changeQty(${index},-1)">
                        -
                    </button>

                    <span>
                        ${item.qty || 1}
                    </span>

                    <button onclick="changeQty(${index},1)">
                        +
                    </button>

                </div>

                <div class="cart-bottom">

    <button
    class="remove-btn"
    onclick="removeCart(${index})">

        <i class="fas fa-trash"></i>

        Hapus

    </button>

</div>

            </div>

        </div>

        `;

    });

    if(cartCount){

        const totalQty = cart.reduce((sum,item)=>{

            return sum + (item.qty || 1);

        },0);

        cartCount.textContent = totalQty;

    }

    if(totalPrice){

        let finalTotal = total;

if(discount > 0){

    finalTotal =
    total - (total * discount / 100);

}

totalPrice.textContent =
Math.round(finalTotal)
.toLocaleString("id-ID");

    }

}

let discount = 0;

window.applyPromo = function(){

    const code =
    document.getElementById("promoCode")
    .value
    .trim()
    .toUpperCase();

    const promoMessage =
    document.getElementById("promoMessage");

    if(code === "JUNEJULY"){

        discount = 16;

        promoMessage.innerHTML =
        "✅ Promo berhasil! Diskon 16%";

        promoMessage.style.color = "#16a34a";

    }else{

        discount = 0;

        promoMessage.innerHTML =
        "❌ Kode promo tidak valid";

        promoMessage.style.color = "#dc2626";

    }

    updateCart();

}

window.changeQty = function(index,change){

    cart[index].qty += change;

    if(cart[index].qty <= 0){

        cart.splice(index,1);

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

}

window.removeCart = function(index){

    cart.splice(index,1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

}

/* ==========================
CHECKOUT WHATSAPP
========================== */

window.checkoutWhatsapp = function(){

    cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    if(cart.length === 0){

        alert("Keranjang masih kosong!");

        return;

    }

    let total = 0;

    let message =
`Halo Admin Ajra Batik,

Saya ingin memesan produk berikut:

`;

    cart.forEach(item=>{

        const qty = item.qty || 1;

        const subtotal =
        Number(item.price) * qty;

        total += subtotal;

        message +=
`• ${item.name}
  Harga : Rp ${Number(item.price).toLocaleString("id-ID")}
  Jumlah : ${qty} pcs
  Subtotal : Rp ${subtotal.toLocaleString("id-ID")}

`;

    });

    /* PROMO */

    let discount = 0;

    const promoInput =
    document.getElementById("promoCode");

    if(
        promoInput &&
        promoInput.value.trim().toUpperCase() ===
        "JUNEJULY"
    ){

        discount = 16;

    }

    let finalTotal = total;

    if(discount > 0){

        finalTotal =
        total -
        (total * discount / 100);

    }

    message +=
`----------------------------

Total Belanja :
Rp ${total.toLocaleString("id-ID")}

`;

    if(discount > 0){

        message +=
`Diskon :
${discount}%

`;

    }

    message +=
`Total Bayar :
Rp ${Math.round(finalTotal).toLocaleString("id-ID")}

Terima kasih.`;

    const nomorAdmin =
    "6285864478882";

    window.open(

`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(message)}`,

"_blank"

    );

}