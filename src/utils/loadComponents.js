function loadComponent(componentPath, targetId, cssFiles = []) {
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${componentPath}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
            console.log(`✅ Loaded: ${componentPath}`);

            // Load all required CSS files for this component
            cssFiles.forEach(cssFile => loadCSS(cssFile));
        })
        .catch(error => console.error(`❌ Error loading ${componentPath}:`, error));
}

function loadCSS(cssPath) {
    if (!document.querySelector(`link[href="${cssPath}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssPath;
        document.head.appendChild(link);
        console.log(`✅ Loaded CSS: ${cssPath}`);
    }
}

// Auto-load ALL components and their respective CSS files
document.addEventListener("DOMContentLoaded", function () {
    // Global styles
    loadCSS('/src/css/styles.css');
    loadCSS('/src/css/index.css');

    // Component-specific styles
    loadComponent('/src/components/navbar.html', 'navbar-section', ['/src/css/navbar.css']);
    loadComponent('/src/components/header.html', 'header-section', ['/src/css/header.css']);
    loadComponent('/src/components/tracker.html', 'tracker-section', ['/src/css/tracker.css']);
    loadComponent('/src/components/dataCard.html', 'dataCard-section', ['/src/css/dataCard.css']);
    // loadComponent('/src/components/savingTips.html', 'saving-tips-section', []); // Add CSS if needed
});
