const inputString = document.getElementById("inputString");
const rollNumber = document.getElementById("rollNumber");
const manualSkip = document.getElementById("manualSkip");
const transformButton = document.getElementById("transformButton");
const resultsList = document.getElementById("resultsList");

const getSumOfDigits = roll => {
    const digits = roll.match(/\d/g) || [];
    return digits.map(Number).reduce((acc, val) => acc + val, 0);
};

const selectiveReverse = (str, skipInterval) => {
    if (skipInterval <= 0) return str.split("").reverse().join("");
    const arr = str.split("");
    if (skipInterval > arr.length) return arr.reverse().join("");
    const skipSet = new Set(
        arr.map((_, i) => ((i + 1) % skipInterval === 0 ? i : null)).filter(i => i !== null)
    );
    const movableChars = arr
        .map((ch, i) => skipSet.has(i) ? null : ch)
        .filter(ch => ch !== null)
        .reverse();
    let revIndex = 0;
    return arr.map((ch, i) => skipSet.has(i) ? ch : movableChars[revIndex++]).join("");
};

transformButton.addEventListener("click", () => {
    const originalStr = inputString.value;
    if (!originalStr.trim()) return;
    const sum = getSumOfDigits(rollNumber.value);
    const skipVal = parseInt(manualSkip.value.trim()) || sum;
    const transformedStr = selectiveReverse(originalStr, skipVal);
    addResultToList(originalStr, transformedStr, skipVal);
    inputString.value = "";
});

const addResultToList = (original, transformed, skipInterval) => {
    const li = document.createElement("li");
    li.className = "resultItem";

    const originalDiv = document.createElement("div");
    const transformedDiv = document.createElement("div");

    originalDiv.innerHTML = `
        <div class="label">Original String (Skip: ${skipInterval})</div>
        <div class="value">${original}</div>
      `;
    transformedDiv.innerHTML = `
        <div class="label">Transformed String</div>
        <div class="value">${transformed}</div>
      `;

    li.appendChild(originalDiv);
    li.appendChild(transformedDiv);
    resultsList.prepend(li);
};