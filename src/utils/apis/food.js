// Function to start fetching data based on user input
function startFetchingData(template) {
    const searchInput = document.getElementById("search");

    // Function to fetch food data from Open Food Facts API
    async function fetchFoodData(query) {
        if (!query || query.trim() === "") {
            console.warn("⚠️ No search term provided. Skipping API call.");
            return;
        }

        const url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&json=true&search_terms=${encodeURIComponent(query)}`;


        try {
            const response = await fetch(url, { method: "GET", mode: "cors" });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            console.log("✅ API Response:", data); // Debugging: Check API response in console

            if (!data.products || !Array.isArray(data.products)) {
                console.error("❌ API did not return a valid product list.");
                return;
            }

            displayResults(data.products, template);
        } catch (error) {
            console.error("❌ Error fetching data:", error.message);
            alert("Failed to load food data. The API might be down or your connection is unstable.");
        }
    }

    // Function to display food products in the UI
    function displayResults(products, template) {
        const resultsContainer = document.getElementById("foodCard-search-section");
        resultsContainer.innerHTML = ""; // Clear previous results
    
        if (products.length === 0) {
            resultsContainer.innerHTML = "<p>No food products found.</p>";
            return;
        }
    
        products.forEach(product => {
            const card = template.content.cloneNode(true).children[0];
    
            // Get product name & brand
            const productName = product.product_name || "Unknown Product";
            const brand = product.brands || "N/A";
    
            // Get Carbon Footprint Percentage
            const carbonPercentage = product.carbon_footprint_percent_of_known_ingredients || 0;
    
            // Get Total Weight from API (Try `serving_quantity` first, then `quantity`)
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
    
            // Get Image (Use placeholder if missing)
            const imageUrl = product.image_url || "https://via.placeholder.com/100";
    
            // Fill in product details
            card.querySelector(".card").innerHTML = `<h3>${productName}</h3>`;
            card.querySelector(".body").innerHTML = `
                <p><strong>Brand:</strong> ${brand}</p>
                <p><strong>Carbon Footprint:</strong> ${carbonGrams}</p>
                <img src="${imageUrl}" alt="${productName}">
            `;
    
            resultsContainer.appendChild(card);
        });
    }
    

    // Listen for user input and fetch data (Debounced to prevent spam)
    let debounceTimer;
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query.length > 2) {
                fetchFoodData(query);
            }
        }, 1000); // Wait 1 second before making API request
    });
}

// Watch for the template in the DOM before running the script
const observer = new MutationObserver(() => {
    const foodCardTemplate = document.querySelector("[data-food-card-template]");
    if (foodCardTemplate) {
        console.log("✅ Template found!", foodCardTemplate);
        observer.disconnect(); // Stop observing once found
        startFetchingData(foodCardTemplate);
    }
});

// Start watching the document body for changes
observer.observe(document.body, { childList: true, subtree: true });
