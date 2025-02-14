const products = [
    {
        productName: "McLaren 750S Track Head-On",
        productPrice: "$129",
        productImage: "McL750S_Track_HeadOn.webp",
        productDescription: "Experience the thrill of the track with the McLaren 750S Track Head-On. This high-performance vehicle is designed for speed and agility, featuring cutting-edge technology and a sleek, aerodynamic design. Perfect for racing enthusiasts and those who crave the ultimate driving experience."
    },
    {
        productName: "McLaren Artura Spider Hero",
        productPrice: "$199",
        productImage: "MCLAREN_ARTURA_SPIDER_HERO.webp",
        productDescription: "The McLaren Artura Spider Hero is a marvel of modern engineering. With its hybrid powertrain, this supercar delivers both power and efficiency. The open-top design allows you to feel the wind in your hair as you accelerate down the highway. A true hero on the road, the Artura Spider combines luxury and performance in one stunning package."
    },
    {
        productName: "McLaren GTS Defiance",
        productPrice: "$299",
        productImage: "McLaren_GTS_Defiance-009.webp",
        productDescription: "Defy expectations with the McLaren GTS Defiance. This supercar is built for those who refuse to settle for anything less than the best. Featuring a powerful engine, advanced aerodynamics, and a luxurious interior, the GTS Defiance is the epitome of automotive excellence. Whether you're on the track or the open road, this car delivers an unparalleled driving experience."
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

    const navigationPill = document.createElement("div");
    navigationPill.className = "navigationPill";

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

    productCardFront.appendChild(navigationPill);
    productCardFront.appendChild(productInfo);
    productCardFront.appendChild(productImageContainer);

    const productCardBack = document.createElement("div");
    productCardBack.className = "productCardBack";

    const productDescriptionContainer = document.createElement("div");
    productDescriptionContainer.className = "productDescriptionContainer";

    const productDescription = document.createElement("div");
    productDescription.className = "productDescription";
    productDescription.textContent = product.productDescription;

    const buyNowButton = document.createElement("button");
    buyNowButton.className = "buyNowButton";
    buyNowButton.textContent = "Buy Now";
    buyNowButton.addEventListener("click", () => {
        console.log(`Product selected: ${product.productName}`);
    });

    productDescriptionContainer.appendChild(productDescription);
    productDescriptionContainer.appendChild(buyNowButton);
    productCardBack.appendChild(productDescriptionContainer);

    productCardInner.appendChild(productCardFront);
    productCardInner.appendChild(productCardBack);

    productCard.appendChild(productCardInner);
    cardContainer.appendChild(productCard);
});

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Function to update button text
    const updateButtonText = () => {
        if (body.classList.contains('darkMode')) {
            darkModeToggle.textContent = 'Switch to Light Mode';
        } else {
            darkModeToggle.textContent = 'Switch to Dark Mode';
        }
    };

    // Set initial button text
    updateButtonText();

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('darkMode');
        updateButtonText();
    });
});