const rollNumber = "22F3636";
const accountNum = rollNumber.slice(3) + "-" + rollNumber.slice(0, 3).toUpperCase();
const lastDigit = parseInt(rollNumber[rollNumber.length - 1]) || 0;
let transactions = [
    { type: "Deposit", amount: lastDigit * 1000, date: new Date() }
];

const elements = {
    sidebar: document.getElementById("sidebar"),
    themeToggle: document.getElementById("themeToggle"),
    balanceAmount: document.getElementById("balanceAmount"),
    accountNumberEl: document.getElementById("accountNumber"),
    accountBalanceEl: document.getElementById("accountBalance"),
    depositBtn: document.getElementById("depositBtn"),
    withdrawBtn: document.getElementById("withdrawBtn"),
    transactionList: document.querySelectorAll(".transactionList"),
    downloadBtns: document.querySelectorAll(".downloadBtn"),
    overlay: document.getElementById("overlay"),
    modal: document.getElementById("modal"),
    modalTitle: document.getElementById("modalTitle"),
    modalInput: document.getElementById("modalInput"),
    validationMessage: document.getElementById("validationMessage"),
    suggestions: document.getElementById("suggestions"),
    cancelBtn: document.getElementById("cancelBtn"),
    confirmBtn: document.getElementById("confirmBtn"),
    navLinks: document.querySelectorAll(".navLink"),
    pages: document.querySelectorAll(".page"),
    pageTitle: document.getElementById("pageTitle"),
    bankNameInput: document.getElementById("bankName"),
    sidebarHeader: document.querySelector(".sidebarHeader h2"),
    incomeEl: document.querySelector(".statValue.positive"),
    expensesEl: document.querySelector(".statValue.negative"),
    balanceChangeEl: document.querySelector(".balanceChange")
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0
    }).format(amount);
};

const updateUI = () => {
    const currentBalance = transactions.reduce((acc, t) => {
        return t.type === "Deposit" ? acc + t.amount : acc - t.amount;
    }, 0);

    const income = transactions.filter(t => t.type === "Deposit").reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === "Withdraw").reduce((acc, t) => acc + t.amount, 0);
    const balanceChange = ((income - expenses) / (income || 1)) * 100;

    elements.balanceAmount.textContent = formatCurrency(currentBalance);
    elements.accountBalanceEl.textContent = `Balance: ${formatCurrency(currentBalance)}`;
    elements.incomeEl.textContent = `↑ ${formatCurrency(income)}`;
    elements.expensesEl.textContent = `↓ ${formatCurrency(expenses)}`;
    elements.balanceChangeEl.textContent = `${balanceChange.toFixed(2)}%`;

    renderTransactions();
};

const renderTransactions = () => {
    elements.transactionList.forEach(list => list.innerHTML = "");
    transactions.slice().reverse().forEach(t => {
        const item = document.createElement("div");
        item.className = "transactionItem";

        const amountClass = t.type === "Deposit" ? "positive" : "negative";
        const amountPrefix = t.type === "Deposit" ? "+" : "-";

        item.innerHTML = `
            <div class="transactionInfo">
                <div class="transactionType">${t.type}</div>
                <div class="transactionDate">${t.date.toLocaleDateString()}</div>
            </div>
            <div class="transactionAmount ${amountClass}">
                ${amountPrefix}${formatCurrency(t.amount)}
            </div>
        `;
        elements.transactionList.forEach(list => list.appendChild(item.cloneNode(true)));
    });
};

const openModal = (type) => {
    elements.modalTitle.textContent = type;
    elements.modalInput.value = "";
    elements.validationMessage.textContent = "";
    elements.suggestions.innerHTML = "";
    elements.confirmBtn.textContent = type;
    elements.overlay.style.display = "grid";
    elements.modalInput.focus();
};

const closeModal = () => {
    elements.overlay.style.display = "none";
};

const handleConfirm = () => {
    const amount = parseInt(elements.modalInput.value);
    if (!amount || amount <= 0) {
        elements.validationMessage.textContent = "Please enter a valid amount.";
        return;
    }

    const currentBalance = transactions.reduce((acc, t) => {
        return t.type === "Deposit" ? acc + t.amount : acc - t.amount;
    }, 0);

    if (elements.modalTitle.textContent === "Deposit") {
        if (amount % 22 !== 0) {
            elements.validationMessage.textContent = "Deposit amount must be a multiple of 22!";
            const suggestion1 = Math.floor(amount / 22) * 22;
            const suggestion2 = suggestion1 + 22;
            elements.suggestions.innerHTML = `
                <p>Suggestions:</p>
                <ul>
                    <li>${suggestion1}</li>
                    <li>${suggestion2}</li>
                </ul>
            `;
            return;
        }
        transactions.push({ type: "Deposit", amount, date: new Date() });
    } else {
        const maxWithdraw = currentBalance * 0.8;
        if (amount > maxWithdraw) {
            elements.validationMessage.textContent = `Cannot withdraw more than ${formatCurrency(maxWithdraw)}`;
            return;
        }
        transactions.push({ type: "Withdraw", amount, date: new Date() });
    }

    closeModal();
    updateUI();
};

const downloadHistory = () => {
    let data = "Transaction History\n\n";
    transactions.forEach(t => {
        data += `${t.type} - ${formatCurrency(t.amount)}, ${t.date.toLocaleString()}\n`;
    });

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction_history.txt";
    link.click();
    URL.revokeObjectURL(url);
};

const switchPage = (page) => {
    elements.pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
    elements.pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
    elements.navLinks.forEach(link => link.classList.remove("active"));
    document.querySelector(`.navLink[data-page="${page}"]`).classList.add("active");
};

const updateBankName = () => {
    const bankName = elements.bankNameInput.value.trim();
    elements.sidebarHeader.textContent = bankName || "Bank Account System";
};

elements.depositBtn.addEventListener("click", () => openModal("Deposit"));
elements.withdrawBtn.addEventListener("click", () => openModal("Withdraw"));
elements.cancelBtn.addEventListener("click", closeModal);
elements.confirmBtn.addEventListener("click", handleConfirm);
elements.downloadBtns.forEach(btn => btn.addEventListener("click", downloadHistory));
elements.themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
});
elements.navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        switchPage(link.dataset.page);
    });
});
elements.bankNameInput.addEventListener("input", updateBankName);

elements.accountNumberEl.textContent = `Account # ${accountNum}`;
updateBankName();
updateUI();

elements.overlay.addEventListener("click", (e) => {
    if (e.target === elements.overlay) closeModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.overlay.style.display === "grid") {
        closeModal();
    }
});