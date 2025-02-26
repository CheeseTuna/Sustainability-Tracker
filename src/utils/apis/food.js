// Function to start fetching data based on user input
function startFetchingData(template) {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("foodCard-search-section");

    // Function to fetch food data from Open Food Facts API
    async function fetchFoodData(query) {
        if (!query || query.trim() === "") {
            console.warn("⚠️ No search term provided. Clearing results.");
            resultsContainer.innerHTML = ""; // Clear results when input is empty
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
                resultsContainer.innerHTML = "<p>No food products found.</p>";
                return;
            }

            displayResults(data.products, template);
        } catch (error) {
            console.error("❌ Error fetching data:", error.message);
            resultsContainer.innerHTML = "<p>Error fetching data. Please try again.</p>";
        }
    }

    
    function displayResults(products, template) {
        const existingResults = document.querySelectorAll(".food-cards"); 
        const searchBar = document.querySelector(".food-search_wrapper");

        // Remove only previous search results, keeping the search bar
        existingResults.forEach(result => result.remove());

        if (products.length === 0) {
            resultsContainer.innerHTML += "<p>No food products found.</p>";
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

            resultsContainer.appendChild(card);
        });

     
        if (!document.contains(searchBar)) {
            resultsContainer.prepend(searchBar);
        }
    }

    
    let debounceTimer;
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                fetchFoodData(query);
            } else {
                resultsContainer.innerHTML = ""; // Clear results when input is empty
            }
        }, 500); 
    });
}


const observer = new MutationObserver(() => {
    const foodCardTemplate = document.querySelector("[data-food-card-template]");
    if (foodCardTemplate) {
        console.log("✅ Template found!", foodCardTemplate);
        observer.disconnect(); // Stop observing once found
        startFetchingData(foodCardTemplate);
    }
});


observer.observe(document.body, { childList: true, subtree: true });
