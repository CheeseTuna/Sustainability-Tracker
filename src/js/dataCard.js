//  Manages individual data sections (e.g., energy, water usage, recycling) 
// and the interactivity to show more details when clicked.

console.log("✅ dataCard.js is loaded!");

function updateProgress() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const percentageTexts = document.querySelectorAll('.percentage');

    if (progressBars.length === 0) {
        return;
    }

    progressBars.forEach((progress, index) => {
        const percentageText = percentageTexts[index];
        if (percentageText) {
            percentageText.textContent = `${progress.value}%`;
        } else {
        }
    });
}

updateProgress();
setInterval(updateProgress, 50000);


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


