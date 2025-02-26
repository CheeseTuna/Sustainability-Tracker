// Function to start fetching data based on user input
function startFetchingData(template) {
    const searchInput = document.getElementById("search");
    const resultsWrapper = document.getElementById("food-results");
    const submitButton = document.querySelector(".food-submit-button");

    if (!searchInput || !resultsWrapper || !template || !submitButton) {
        console.error("❌ Missing essential elements for search functionality.");
        return;
    }

    let lastQuery = "";  // Cache last query to prevent redundant API calls
    let controller;  // Controller to cancel slow API calls

    // Function to fetch food data from Open Food Facts API efficiently
    async function fetchFoodData() {
        const query = searchInput.value.trim();
        if (!query || query === lastQuery) return;  // Avoid duplicate searches
        lastQuery = query;

        // Cancel previous request if still running
        if (controller) controller.abort();
        controller = new AbortController();

        // Show loading indicator
        resultsWrapper.innerHTML = "<p>Loading results...</p>";

        const url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&json=true&search_terms=${encodeURIComponent(query)}&fields=product_name,brands,image_url,carbon_footprint_percent_of_known_ingredients,serving_quantity,quantity`;

        try {
            const response = await fetch(url, { method: "GET", mode: "cors", signal: controller.signal });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);

            const data = await response.json();
            if (!data.products || !Array.isArray(data.products)) {
                resultsWrapper.innerHTML = "<p>No food products found.</p>";
                return;
            }

            displayResults(data.products.slice(0, 10), template); // Show first 10 results
        } catch (error) {
            if (error.name === "AbortError") {
                console.warn("⚠️ Request aborted due to slow response.");
            } else {
                resultsWrapper.innerHTML = "<p>Error fetching data. Please try again.</p>";
                console.error("❌ Fetch error:", error);
            }
        }
    }

    // Function to display food products efficiently
    function displayResults(products, template) {
        resultsWrapper.innerHTML = ""; // Clear previous results

        if (products.length === 0) {
            resultsWrapper.innerHTML = "<p>No food products found.</p>";
            return;
        }

        const fragment = document.createDocumentFragment(); // Optimize rendering

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

            let carbonGrams = "N/A";
            if (carbonPercentage > 0 && totalWeight > 0) {
                carbonGrams = ((carbonPercentage / 100) * totalWeight).toFixed(2) + " g CO₂";
            }

            const imageUrl = product.image_url || "https://via.placeholder.com/100";
            card.querySelector(".body").innerHTML = `
                <img src="${imageUrl}" alt="${productName}">
                <h3>${productName}</h3>
                <p><strong>Brand:</strong> ${brand}</p>
                <p><strong>Carbon Footprint:</strong> ${carbonGrams}</p>
            `;

            fragment.appendChild(card);
        });

        resultsWrapper.appendChild(fragment); // Append all results at once (faster rendering)
    }

    // Fetch data when the submit button is clicked
    submitButton.addEventListener("click", fetchFoodData);

    // Fetch data when Enter key is pressed
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            fetchFoodData();
        }
    });
}

// Wait for the template to load before running the script
const observer = new MutationObserver(() => {
    const foodCardTemplate = document.querySelector("[data-food-card-template]");
    if (foodCardTemplate) {
        observer.disconnect();
        startFetchingData(foodCardTemplate);
    }
});

observer.observe(document.body, { childList: true, subtree: true });
