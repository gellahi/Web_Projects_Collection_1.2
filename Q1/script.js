const products = [
    {
        productName: "Webflee Tipser",
        productPrice: "$129",
        productImage: "McL750S_Track_HeadOn.webp",
        productDescription: "McL750S_Track_HeadOn."
    },
    {
        productName: "Webflee Companion",
        productPrice: "$199",
        productImage: "MCLAREN_ARTURA_SPIDER_HERO.webp",
        productDescription: "MCLAREN_ARTURA_SPIDER_HERO"
    },
    {
        productName: "Webflee Pro",
        productPrice: "$299",
        productImage: "McLaren_GTS_Defiance-009.webp",
        productDescription: "McLaren_GTS_Defiance-009"
    }
];

const cardContainer = document.getElementById("cardContainer");

products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "productCard";

    const productCardInner = document.createElement("div");
    productCardInner.className = "productCardInner";

    const productCardFront = document.createElement("div");
    productCardFront.className = "productCardFront";

    const productImageContainer = document.createElement("div");
    productImageContainer.className = "productImageContainer";

    const productImage = document.createElement("img");
    productImage.src = product.productImage;
    productImage.alt = product.productName;
    productImage.className = "productImage";
    productImageContainer.appendChild(productImage);

    const productInfo = document.createElement("div");
    productInfo.className = "productInfo";

    const productName = document.createElement("div");
    productName.className = "productName";
    productName.textContent = product.productName;

    const productPrice = document.createElement("div");
    productPrice.className = "productPrice";
    productPrice.textContent = product.productPrice;

    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);

    productCardFront.appendChild(productImageContainer);
    productCardFront.appendChild(productInfo);

    const productCardBack = document.createElement("div");
    productCardBack.className = "productCardBack";

    const productDescription = document.createElement("div");
    productDescription.className = "productDescription";
    productDescription.textContent = product.productDescription;

    const buyNowButton = document.createElement("button");
    buyNowButton.className = "buyNowButton";
    buyNowButton.textContent = "Buy Now";
    buyNowButton.addEventListener("click", () => {
        console.log(`Product selected: ${product.productName}`);
    });

    productDescription.appendChild(buyNowButton);
    productCardBack.appendChild(productDescription);

    productCardInner.appendChild(productCardFront);
    productCardInner.appendChild(productCardBack);

    productCard.appendChild(productCardInner);
    cardContainer.appendChild(productCard);
});

const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
});