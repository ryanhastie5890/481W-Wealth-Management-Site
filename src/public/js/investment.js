const addInvestmentsButton = document.getElementById("add-general-investments-button");
const modal = document.getElementById("modal");
const closeModalButton = document.getElementById("close-modal");
const modalBody = document.getElementById("modal-body");

addInvestmentsButton.addEventListener("click", () => {
    showAddInvestmentModal();
});

closeModalButton.addEventListener("click", () => {
    hideModal();
});

function showAddInvestmentModal() {
    showModal();
    buildInvestmentModal();
}

function showModal() {
    modal.classList.add("show");
}

function hideModal() {
    modal.classList.remove("show");
}

function buildInvestmentModal() {
    modalBody.innerHTML = `
        <h2>Add Investment</h2>

        <form id="investment-form">
            <label>
                Ticker Symbol:
                <input type="text" id="ticker" placeholder="AAPL" required />
            </label>
            <br><br>

            <label>
                Shares:
                <input type="number" id="shares" min="1" required />
            </label>
            <br><br>

            <button type="button" id="check-price-btn">
                Check Live Price
            </button>

            <p id="price-display" style="margin-top:10px;"></p>

            <br>

            <button type="submit">
                Buy Stock
            </button>
        </form>
    `;

    const form = document.getElementById("investment-form");
    const priceDisplay = document.getElementById("price-display");

    let latestPrice = null;

    // Check Live Price
    document.getElementById("check-price-btn").addEventListener("click", async () => {
        const ticker = document.getElementById("ticker").value.trim();

        if (!ticker) {
            priceDisplay.textContent = "Please enter a ticker.";
            return;
        }

        try {
            const res = await fetch(`/api/investments/show?symbol=${ticker}`);
            const data = await res.json();

            const price = data['05. price'];

            if (!price) {
                priceDisplay.textContent = "Invalid ticker or no data.";
                return;
            }

            latestPrice = parseFloat(price);

            priceDisplay.textContent = `Current Price: $${latestPrice.toFixed(2)}`;
        } catch (err) {
            console.error(err);
            priceDisplay.textContent = "Failed to fetch price.";
        }
    });

    // Submit Buy Order
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const symbol = document.getElementById("ticker").value.trim();
        const shares = Number(document.getElementById("shares").value);

        if (!symbol || shares <= 0) {
            alert("Enter valid symbol and shares.");
            return;
        }

        try {
            const res = await fetch(`/api/investments/buy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ symbol, shares })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to buy stock");
                return;
            }

            alert(`Bought ${shares} shares of ${symbol}`);
            hideModal();

        } catch (err) {
            console.error(err);
            alert("Error buying stock");
        }
    });
}