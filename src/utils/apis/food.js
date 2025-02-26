// Function to start fetching data based on user input
function startFetchingData(template) {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("foodCard-search-section");
    const resultsWrapper = document.getElementById("food-results"); // New results container

    if (!searchInput || !resultsContainer || !resultsWrapper || !template) {
        console.error("❌ Missing essential elements for search functionality.");
        return;
    }

    let debounceTimer;

    // Function to fetch food data from Open Food Facts API
    async function fetchFoodData(query) {
        if (!query || query.trim() === "") {
            console.warn("⚠️ No search term provided. Clearing results.");
            resultsWrapper.innerHTML = ""; // Clear only results, NOT the search bar
            return;
        }

        const url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&json=true&search_terms=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url, { method: "GET", mode: "cors" });
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ API Response:", data);

            if (!data.products || !Array.isArray(data.products)) {
                console.error("❌ API did not return a valid product list.");
                resultsWrapper.innerHTML = "<p>No food products found.</p>";
                return;
            }

            displayResults(data.products, template);
        } catch (error) {
            console.error("❌ Error fetching data:", error.message);
            resultsWrapper.innerHTML = "<p>Error fetching data. Please try again.</p>";
        }
    }

    // Function to display food products in the UI
    function displayResults(products, template) {
        resultsWrapper.innerHTML = ""; // Clear previous results

        if (products.length === 0) {
            resultsWrapper.innerHTML = "<p>No food products found.</p>";
            return;
        }

        products.forEach(product => {
            const card = template.content.cloneNode(true).children[0];

            const productName = product.product_name || "Unknown Product";
            const brand = product.brands || "N/A";

            const carbonPercentage = product.carbon_footprint_percent_of_known_ingredients || 0;
            let totalWeight = parseFloat(product.serving_quantity) || 0;

            if (!totalWeight && product.quantity) {
                const weightMatch = product.quantity.match(/(\d+(\.\d+)?)\s*(g|kg)/i);
                if (weightMatch) {
                    totalWeight = parseFloat(weightMatch[1]);
                    if (weightMatch[3].toLowerCase() === "kg") {
                        totalWeight *= 1000; // Convert kg to grams
                    }
                }
            }

            // Convert Carbon Footprint Percentage to Grams
            let carbonGrams = "N/A";
            if (carbonPercentage > 0 && totalWeight > 0) {
                carbonGrams = ((carbonPercentage / 100) * totalWeight).toFixed(2) + " g CO₂";
            }

            const imageUrl = product.image_url || "https://via.placeholder.com/100";

            card.querySelector(".card").innerHTML = `<h3>${productName}</h3>`;
            card.querySelector(".body").innerHTML = `
                <p><strong>Brand:</strong> ${brand}</p>
                <p><strong>Carbon Footprint:</strong> ${carbonGrams}</p>
                <img src="${imageUrl}" alt="${productName}">
            `;

            resultsWrapper.appendChild(card);
        });
    }

    // Listen for user input and fetch data (Debounced to prevent spam)
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            fetchFoodData(query);
        }, 500);
    });
}

// Wait for the template to load before running the script
const observer = new MutationObserver(() => {
    const foodCardTemplate = document.querySelector("[data-food-card-template]");
    if (foodCardTemplate) {
        console.log("✅ Template found!", foodCardTemplate);
        observer.disconnect();
        startFetchingData(foodCardTemplate);
    }
});

observer.observe(document.body, { childList: true, subtree: true });
