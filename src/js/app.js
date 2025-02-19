// Entry point for initialising the main logic of the app.//Fetching the FAO API for the 'Food' Category.
async function fetchFAOData(domain, year, country) {
    const url = `https://faostat.api.fao.org/v1/data?domain=${domain}&year=${year}&country=${country}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("FAOSTAT Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching FAOSTAT data:", error);
        return null;
    }
}

// Example Usage
fetchFAOData("agriculture", "2020", "USA");