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

// Auto-load common components (navbar & header)
document.addEventListener("DOMContentLoaded", function () {
    loadComponent('/src/components/navbar.html', 'navbar-section', ['/src/css/navbar.css']);
    loadComponent('/src/components/header.html', 'header-section', ['/src/css/styles.css', '/src/css/index.css']);
});
