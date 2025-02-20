function loadComponent(componentPath, targetId, cssFiles = [], jsFiles = []) {
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
            cssFiles.forEach(cssFile => reloadCSS(cssFile));

            // Load all required JS files
            jsFiles.forEach(jsFile => reloadJS(jsFile));
        })
        .catch(error => console.error(`❌ Error loading ${componentPath}:`, error));
}

function reloadCSS(cssPath) {
    const existingLink = document.querySelector(`link[href="${cssPath}"]`);
    if (existingLink) {
        existingLink.remove(); // Remove old CSS to force reload
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath + "?v=" + new Date().getTime(); // Cache-busting
    document.head.appendChild(link);
    console.log(`✅ Reloaded CSS: ${cssPath}`);
}

function reloadJS(jsPath) {
    const script = document.createElement("script");
    script.src = jsPath + "?v=" + new Date().getTime(); // Cache-busting
    script.defer = true;
    document.body.appendChild(script);
    console.log(`✅ Reloaded JS: ${jsPath}`);
}

// Auto-load components with their respective CSS and JS files
document.addEventListener("DOMContentLoaded", function () {
    loadComponent('/src/components/navbar.html', 'navbar-section', ['/src/css/navbar.css']);
    loadComponent('/src/components/header.html', 'header-section', ['/src/css/header.css']);
    loadComponent('/src/components/tracker.html', 'tracker-section', ['/src/css/tracker.css'], ['/src/js/tracker.js']);
    loadComponent('/src/components/dataCard.html', 'dataCard-section', ['/src/css/dataCard.css'], ['/src/js/dataCard.js']);
});
