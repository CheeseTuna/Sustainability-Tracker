//  Manages individual data sections (e.g., energy, water usage, recycling) 
// and the interactivity to show more details when clicked.

document.addEventListener("DOMContentLoaded", function () {
    function updateProgress() {
        const progressBars = document.querySelectorAll('.progress-bar');
        const percentageTexts = document.querySelectorAll('.percentage');

        console.log("Progress Bars Found:", progressBars.length);
        console.log("Percentage Elements Found:", percentageTexts.length);

        progressBars.forEach((progress, index) => {
            console.log(`Progress ${index + 1}:`, progress.value); // Log each progress value

            if (percentageTexts[index]) { // Ensure corresponding <p> exists
                percentageTexts[index].textContent = progress.value + "%";
                console.log(`Updated Percentage ${index + 1}:`, percentageTexts[index].textContent);
            } else {
                console.warn(`Warning: No matching <p> element for progress ${index + 1}`);
            }
        });
    }

    updateProgress();
    setInterval(updateProgress, 500);
});

