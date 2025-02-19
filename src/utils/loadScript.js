function loadScript(scriptPath, callback) {
    if (document.querySelector(`script[src="${scriptPath}"]`)) {
        console.warn(`⚠️ Script already loaded: ${scriptPath}`);
        return;
    }

    const script = document.createElement("script");
    script.src = scriptPath;
    script.onload = () => {
        console.log(`✅ Successfully loaded: ${scriptPath}`);
        if (callback) callback();
    };
    script.onerror = () => console.error(`❌ Failed to load script: ${scriptPath}`);
    
    document.body.appendChild(script);
}
