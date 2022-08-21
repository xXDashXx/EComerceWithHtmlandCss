import json from "./items.json" assert {type: "json"};

//Variable Bade de Datos que contiene el arreglo proveniente del JSON
let DB = json;

//Variable para el total de las facturas
let TOTAL = 0;

//Constantes de elementos del HTML
const loyoutItems = document.getElementById('LoyoutItems');
const listaCarrito = document.getElementById('items');
const msjEmptyCart = document.getElementById('footer-carrito');
const cartCant = document.getElementById('CartCant');
const totalCart = document.getElementById('TotalCart');
const btnEmptyCart = document.getElementById('vaciar-carrito');
const btnPaid = document.getElementById('BtnPaid');

//Elementos del modal
const btnModal = document.getElementById('BtnModal');
const btnPaidFactura = document.getElementById('BtnModalPaidFactura');
const modalBodyDetail = document.getElementById('ModalBodyDetail');
const modalTotal = document.getElementById('ModalTotal');





//Evento se ejecuta al cargar el docuemento
document.addEventListener('DOMContentLoaded', () => {
    FillLayoutWidthItems();
});



btnEmptyCart.addEventListener('click', () => {
    ClearAll();
});

btnPaid.addEventListener('click', () => {
    PaidCart();
});

btnPaidFactura.addEventListener('click', () => {
    PaidFactura();
});



function AddItemToCar(buttom) {
    let item = DB.find(item => {
        if (item.Id === buttom.id) return item;
    });
    let count = listaCarrito.childElementCount;
    const card = buttom.parentElement.parentElement.parentElement;

    msjEmptyCart.classList.add('hide');

    if (item.Stock > 0) {

        let rowCar = [...listaCarrito.children].filter(tr => tr.id == item.Id);
        if (rowCar.length > 0) {
            AddSameItemToCar(rowCar);

        } else {
            AddNewItemToCar();
        }

        ReduceItemFromStock(item, card);
        SumTotalItems();

    }


    function AddNewItemToCar() {
        const tr = document.createElement('tr');
        tr.id = item.Id;

        const number = document.createElement('td');
        number.innerText = count + 1;
        tr.appendChild(number);

        const name = document.createElement('td');
        name.innerText = item.Name;
        tr.appendChild(name);

        const cant = document.createElement('td');
        cant.innerText = 1;
        tr.appendChild(cant);

        const buttons = document.createElement('td');

        const plus = document.createElement('button');
        plus.className = 'btn btn-info btn-sm';
        plus.innerText = '+';
        plus.id = item.Id;
        plus.addEventListener('click', (e) => {
            AddItem(tr);
        });
        buttons.appendChild(plus);

        const minus = document.createElement('button');
        minus.className = 'btn btn-danger btn-sm';
        minus.innerText = '-';
        minus.addEventListener('click', (e) => {
            RemoveItem(tr);
        });
        buttons.appendChild(minus);
        tr.appendChild(buttons);

        const price = document.createElement('td');
        price.innerText = item.Price;
        tr.appendChild(price);

        const total = document.createElement('td');
        total.innerText = item.Price;
        tr.appendChild(total);

        listaCarrito.appendChild(tr);


    }

    function AddSameItemToCar(tr) {
        let cant = parseInt(tr[0].children[2].innerText) + 1;
        let price = parseFloat(tr[0].children[4].innerText);

        tr[0].children[2].innerText = cant;
        tr[0].children[5].innerText = price * cant;
    }

}

function ReduceItemFromStock(item, card) {
    item.Stock--;
    card.children[0].firstElementChild.innerText = item.Stock;
    card.children[2].firstElementChild.children[1].innerText = `- stock ${item.Stock}`;
}


function AddItem(tr) {
    const item = DB.find(item => {
        if (item.Id == tr.id) return item;
    });

    if (item.Stock > 0) {
        item.Stock--;
        let qty = parseInt(tr.children[2].innerText) + 1;
        tr.children[2].innerText = qty;
        tr.children[5].innerText = qty * item.Price;
        SumTotalItems();
        FillLayoutWidthItems();
    }
}
function RemoveItem(tr) {
    const item = DB.find(item => {
        if (item.Id == tr.id) return item;
    });

    item.Stock++;

    let qty = parseInt(tr.children[2].innerText) - 1;
    tr.children[2].innerText = qty;
    tr.children[5].innerText = qty * item.Price;
    SumTotalItems();
    FillLayoutWidthItems();

    if (qty == 0) {
        tr.remove();
        if (listaCarrito.childElementCount == 0) msjEmptyCart.classList.remove('hide');
    }


}


function FillLayoutWidthItems() {

    loyoutItems.innerHTML = '';

    DB.forEach(item => {

        //Cuerpo principal, diseño HTML donde contiene toda la información del item
        const col = document.createElement('div');
        col.className = 'col mb-5';

        //Cuerpo interno del item
        const card = document.createElement('div');
        card.className = 'card h-100 seleccion';

        //Circulo donde se muestra la cantidad de stock del item
        const divCir = document.createElement('div');
        divCir.className = 'circulo-stock';
        const divCant = document.createElement('div');
        divCant.className = 'item-cant';
        divCant.innerText = item.Stock;
        divCir.appendChild(divCant);
        card.appendChild(divCir);

        //Imagen del item
        const imagen = document.createElement('img');
        imagen.src = item.ImgRoot;
        imagen.className = 'card-img-top';
        imagen.alt = 'Logo';
        card.appendChild(imagen);

        //Cuerpo del item
        const divCardBody = document.createElement('div');
        divCardBody.className = 'card-body p-4 card-b-margin';
        const divText = document.createElement('div');
        divText.className = 'text-center';

        //Precio del item
        const h4 = document.createElement('h4');
        h4.innerText = item.Price;
        divText.appendChild(h4);

        //Se muestra candidad en stock --INFORMACION REDUNDANTE
        const p = document.createElement('p');
        p.innerText = `- stock ${item.Stock}`;
        divText.appendChild(p);

        //Nombre del item
        const h5 = document.createElement('h5');
        h5.className = 'fw-bolder';
        h5.innerText = item.Name;
        divText.appendChild(h5);
        divCardBody.appendChild(divText);
        card.appendChild(divCardBody);

        //Diseño inferior del item donde está el botón add
        const footer = document.createElement('div');
        footer.className = 'card-footer p-4 pt-0 border-top-0 bg-transparent card-f-ocultar';
        const divTextCenter = document.createElement('div');
        divTextCenter.className = 'text-center';

        //Botón add
        const tag = document.createElement('a');
        tag.className = 'btn btn-outline-dark mt-auto';
        tag.id = item.Id;
        tag.innerHTML = '<i class="bx bxs-cart-add" ></i> add';
        tag.addEventListener('click', () => {
            AddItemToCar(tag);
        })

        divTextCenter.appendChild(tag);
        footer.appendChild(divTextCenter);
        card.appendChild(footer);
        col.appendChild(card);
        loyoutItems.appendChild(col);

    });

}

function SumTotalItems() {
    let cant = 0;
    TOTAL = 0;

    [...listaCarrito.children].map(item => {
        cant += parseInt(item.children[2].innerText);
        TOTAL += parseFloat(item.children[5].innerText);
    });

    cartCant.innerText = cant;
    totalCart.innerText = TOTAL;
}


function ClearAll() {
    cartCant.innerText = 0;
    totalCart.innerText = '0.00';
    msjEmptyCart.classList.remove('hide');
    [...listaCarrito.children].forEach(row => {
        let item = DB.find(item => item.Id == row.id)
        item.Stock += parseInt(row.children[2].innerText);
    });
    listaCarrito.innerHTML = '';
    FillLayoutWidthItems();
}

function PaidCart() {
    let count = listaCarrito.childElementCount;
    if (count > 0) {
        modalBodyDetail.innerHTML = '';

        [...listaCarrito.children].forEach(row => {
            console.log(row);
            const tr = document.createElement('tr');

            const item = document.createElement('td');
            item.innerText = row.children[1].innerText;
            tr.appendChild(item);

            const qty = document.createElement('td');
            qty.innerText = row.children[2].innerText;
            tr.appendChild(qty);

            const price = document.createElement('td');
            price.innerText = row.children[4].innerText;
            tr.appendChild(price);

            const subtotal = document.createElement('td');
            subtotal.innerText = row.children[5].innerText;
            tr.appendChild(subtotal);

            modalBodyDetail.appendChild(tr);
        });

        modalTotal.innerText = totalCart.innerText;

        btnModal.click();
    }

}

function PaidFactura() {
    cartCant.innerText = 0;
    modalBodyDetail.innerHTML = listaCarrito.innerHTML = '';
    modalTotal.innerText = totalCart.innerText = '0.00';
    msjEmptyCart.classList.remove('hide');

}



// CAMBIOS POR SAMUEL APARTIR DE AQUI SOLO SHOPPING CART

document.getElementById("demo").addEventListener("click", ShowMyShoppingCart);

function ShowMyShoppingCart() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    var y = document.getElementById("CLOSE_CART");
    if (y.style.display === "none") {
        y.style.display = "block";
    } else {
        y.style.display = "none";
    }

    var z = document.getElementById("open_CART");
    if (y.style.display === "none") {
        z.style.display = "block";
    } else {
        z.style.display = "none";
    }

    /* ESTA ES LA PARTE DE LA FUNCION QUE DESPLIEGA EL CARRITO DE COMPRAS */
    var c = document.getElementById("cart-shop");

    if (c.style.width === "150px") {
        c.style.width = "100%";
    } else {
        c.style.width = "150px";
    }


}

