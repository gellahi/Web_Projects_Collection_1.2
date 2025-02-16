const products = [
    { name: "Laptop", price: 80000, image: "productImages/laptop.webp" },
    { name: "Smartphone", price: 40000, image: "productImages/smartphones.webp" },
    { name: "Headphones", price: 6000, image: "productImages/headphones.webp" },
    { name: "Smartwatch", price: 12000, image: "productImages/smartwatch.webp" },
    { name: "Camera", price: 50000, image: "productImages/camera.webp" },
    { name: "Gaming Console", price: 75000, image: "productImages/gamingConsole.webp" },
    { name: "Tablet", price: 25000, image: "productImages/tablet.webp" },
    { name: "Wireless Mouse", price: 1500, image: "productImages/wirelessMouse.webp" }
];

const promoCodes = [
    { code: "BONUS10", description: "Extra 10% discount on your purchase" },
    { code: "SAVE5", description: "Extra 5% discount on your purchase" }
];

const productsGrid = document.getElementById("productsGrid");
const promoCodesGrid = document.getElementById("promoCodesGrid");
const rollNumber = document.getElementById("rollNumber");
const promoCode = document.getElementById("promoCode");
const sortSelect = document.getElementById("sortSelect");
const discountText = document.getElementById("discountText");
const finalPriceEl = document.getElementById("finalPrice");
const clearSelectionBtn = document.getElementById("clearSelectionBtn");
const resetBtn = document.getElementById("resetBtn");

let selectedProducts = [];

const renderProducts = (prodArray) => {
    productsGrid.innerHTML = "";
    prodArray.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "productCard";

        const imgEl = document.createElement("img");
        imgEl.src = product.image;
        imgEl.alt = product.name;
        imgEl.className = "productImage";

        const nameEl = document.createElement("div");
        nameEl.className = "productName";
        nameEl.textContent = product.name;

        const priceEl = document.createElement("div");
        priceEl.className = "productPrice";
        priceEl.textContent = `Price: PKR ${product.price}`;

        const selectEl = document.createElement("div");
        selectEl.className = "productSelect";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.index = index;
        checkbox.checked = selectedProducts.some(p => p.index === index);
        checkbox.addEventListener("change", (e) => {
            const idx = parseInt(e.target.dataset.index);
            const qtyInput = card.querySelector(".quantityInput");
            if (e.target.checked) {
                selectedProducts.push({ index: idx, product, quantity: parseInt(qtyInput.value) });
            } else {
                selectedProducts = selectedProducts.filter(p => p.index !== idx);
            }
            calculateFinalPrice();
        });

        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = 1;
        qtyInput.value = 1;
        qtyInput.className = "quantityInput";
        qtyInput.style.width = "60px";
        qtyInput.addEventListener("input", (e) => {
            const idx = parseInt(checkbox.dataset.index);
            if (checkbox.checked) {
                selectedProducts = selectedProducts.map(p => {
                    if (p.index === idx) {
                        return { ...p, quantity: parseInt(e.target.value) };
                    }
                    return p;
                });
                calculateFinalPrice();
            }
        });

        const label = document.createElement("label");
        label.textContent = "Select";

        selectEl.appendChild(checkbox);
        selectEl.appendChild(label);
        selectEl.appendChild(qtyInput);

        card.appendChild(imgEl);
        card.appendChild(nameEl);
        card.appendChild(priceEl);
        card.appendChild(selectEl);

        productsGrid.appendChild(card);
    });
};

const sortProducts = () => {
    let sortedProducts = [...products];
    const sortVal = sortSelect.value;
    if (sortVal === "lowToHigh") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortVal === "highToLow") {
        sortedProducts.sort((a, b) => b.price - a.price);
    }
    renderProducts(sortedProducts);
};

sortSelect.addEventListener("change", sortProducts);

const renderPromoCodes = () => {
    promoCodesGrid.innerHTML = "";
    promoCodes.forEach(promo => {
        const promoCard = document.createElement("div");
        promoCard.className = "promoCard";

        const codeEl = document.createElement("div");
        codeEl.className = "promoCode";
        codeEl.textContent = promo.code;

        const descEl = document.createElement("div");
        descEl.className = "promoDesc";
        descEl.textContent = promo.description;

        const copyBtn = document.createElement("button");
        copyBtn.className = "copyBtn";
        copyBtn.textContent = "Copy Code";
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(promo.code);
            promoCode.value = promo.code;
            alert(`Copied ${promo.code} to clipboard`);
        });

        promoCard.appendChild(codeEl);
        promoCard.appendChild(descEl);
        promoCard.appendChild(copyBtn);
        promoCodesGrid.appendChild(promoCard);
    });
};

const getRollDiscount = (roll, count) => {
    const match = roll.match(/\d{4}$/);
    if (!match) return 0;
    const fourDigits = match[0];
    const middleTwo = fourDigits.slice(1, 3);
    let discount = parseInt(middleTwo) || 0;
    const maxDiscount = count > 2 ? 60 : 50;
    return discount > maxDiscount ? maxDiscount : discount;
};

const getPromoDiscount = (code) => {
    const c = code.trim().toUpperCase();
    if (c === "BONUS10") return 10;
    if (c === "SAVE5") return 5;
    return 0;
};

const calculateFinalPrice = () => {
    const baseTotal = selectedProducts.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const rollDisc = getRollDiscount(rollNumber.value, selectedProducts.length);
    const promoDisc = getPromoDiscount(promoCode.value);
    let totalDiscount = rollDisc + promoDisc;
    const maxAllowed = selectedProducts.length > 2 ? 60 : 50;
    if (totalDiscount > maxAllowed) totalDiscount = maxAllowed;
    const discountedPrice = baseTotal * (1 - totalDiscount / 100);
    discountText.textContent = `Discount: ${totalDiscount}%`;
    finalPriceEl.textContent = `Final Price: PKR ${discountedPrice.toFixed(0)}`;
};

clearSelectionBtn.addEventListener("click", () => {
    selectedProducts = [];
    renderProducts(products);
    calculateFinalPrice();
});

resetBtn.addEventListener("click", () => {
    rollNumber.value = "22F3636";
    promoCode.value = "";
    selectedProducts = [];
    sortSelect.value = "default";
    renderProducts(products);
    calculateFinalPrice();
});

rollNumber.addEventListener("input", calculateFinalPrice);
promoCode.addEventListener("input", calculateFinalPrice);

// Initial Render
renderProducts(products);
renderPromoCodes();
calculateFinalPrice();