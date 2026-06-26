(function () {
    const baseVersion = '1.3.1';
    //const baseUrl = 'https://compententnl-viewer-37a748.gitlab.io/releases';
    const baseUrl = 'https://competentnl.github.io/viewer-frontend-public/releases';
    const { version, backend_url } = Object.fromEntries(new URL(document.currentScript.src).searchParams);

    // Check if we're on an edit page (should be ignored for duplicate initialization check)
    const isEditPage = /\/page\/edit\//.test(window.location.pathname);

    // // Prevent duplicate initialization (except on edit pages)
    if (window.viewerInitialized && !isEditPage) {
        console.warn("Viewer loader: Duplicate initialization prevented.");
        return;
    }

    if (!backend_url) {
        console.error("Viewer loader: No Backend Url Found, please contact maintainer");
        return;
    }

    window.viewerInitialized = true;

    window.viewer = {
        version: version || baseVersion,
        backendUrl: backend_url
    };

    // Execute asset injection
    try {
        injectAssets(window.viewer.version);
    } catch (err) {
        console.error("Viewer loader failed:", err);
    }

    function injectAssets(resolvedVersion) {
        const assetIdPrefix = `viewer-${resolvedVersion}`;

        // Inject CSS if not already present
        if (!document.getElementById(`${assetIdPrefix}-css`)) {
            const cssLink = document.createElement('link');
            cssLink.id = `${assetIdPrefix}-css`;
            cssLink.rel = 'stylesheet';
            cssLink.href = `${baseUrl}/${resolvedVersion}/styles.css`;
            document.head.appendChild(cssLink);
        }

        // Inject polyfills.js if not already present
        if (!document.getElementById(`${assetIdPrefix}-polyfills`)) {
            const jsPolyScript = document.createElement('script');
            jsPolyScript.id = `${assetIdPrefix}-polyfills`;
            jsPolyScript.src = `${baseUrl}/${resolvedVersion}/polyfills.js`;
            jsPolyScript.defer = true;
            jsPolyScript.type = 'module';
            document.body.appendChild(jsPolyScript);
        }

        // Inject main.js if not already present
        if (!document.getElementById(`${assetIdPrefix}-main`)) {
            const jsScript = document.createElement('script');
            jsScript.id = `${assetIdPrefix}-main`;
            jsScript.src = `${baseUrl}/${resolvedVersion}/main.js`;
            jsScript.defer = true;
            jsScript.type = 'module';
            document.body.appendChild(jsScript);
        }
    }
})();