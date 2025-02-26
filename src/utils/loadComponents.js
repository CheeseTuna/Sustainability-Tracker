async function loadComponent(componentPath, targetId, cssFiles = [], jsFiles = []) {
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement || targetElement.innerHTML.trim() !== "") {
        console.log(`⚠️ Skipping already loaded component: ${componentPath}`);
        return;
    }

    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to fetch ${componentPath}: ${response.statusText}`);

        targetElement.innerHTML = await response.text();
        console.log(`✅ Loaded: ${componentPath}`);

        // Load CSS and JS
        cssFiles.forEach(reloadCSS);
        jsFiles.forEach(reloadJS);
    } catch (error) {
        console.error(`❌ Error loading ${componentPath}:`, error);
    }
}


function reloadCSS(cssPath) {
    if (document.querySelector(`link[href="${cssPath}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath; // Removed cache-busting
    document.head.appendChild(link);
    console.log(`✅ Loaded CSS: ${cssPath}`);
}

function reloadJS(jsPath) {
    if (document.querySelector(`script[src="${jsPath}"]`)) return;

    const script = document.createElement("script");
    script.src = jsPath;
    script.defer = true;
    document.body.appendChild(script);
    console.log(`✅ Loaded JS: ${jsPath}`);
}


// Auto-load components with their respective CSS and JS files
document.addEventListener("DOMContentLoaded", function () {
    loadComponent('/src/components/navbar.html', 'navbar-section', ['/src/css/navbar.css']);
    loadComponent('/src/components/header.html', 'header-section', ['/src/css/header.css'], ['/src/components/tracker.html']);
    loadComponent('/src/components/tracker.html', 'tracker-section', ['/src/css/tracker.css'], ['/src/js/tracker.js']);
    loadComponent('/src/components/dataCard.html', 'dataCard-section', ['/src/css/dataCard.css'], ['/src/js/dataCard.js']);
    loadComponent('/src/components/food/foodCard-diary.html', 'foodCard-diary-section', ['/src/css/food/foodCard-diary.css']);
    loadComponent('/src/components/food/foodCard-search.html', 'foodCard-search-section', ['/src/css/food/foodCard-search.css']);
});
