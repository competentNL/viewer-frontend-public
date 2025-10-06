(function () {
    const viewerUrl = 'https://api.github.com/repos/competentNL/viewer-frontend-public/releases/latest';
    const baseUrl = 'https://competentnl.github.io/viewer-frontend-public/releases';
    const { version, backend_url } = Object.fromEntries(new URL(document.currentScript.src).searchParams);

    // Prevent duplicate initialization
    if (window.viewerInitialized) {
        return;
    }

    if (!backend_url) {
        return;
    }

    window.viewerInitialized = true;

    window.viewer = {
        version,
        backendUrl: backend_url
    };

    init().catch((err) => {
        console.error(err);
    });

    async function init() {
        let tempVersion = version;
        if (!tempVersion) {
            tempVersion = await getLatestReleaseVersion();
        }

        if (!tempVersion) {
            throw new Error("No Version Found, please contact maintainer");
        }

        if (!backend_url) {
            throw new Error("No Backend Url Found, please contact maintainer");
        }

        injectAssets(tempVersion);
    }

    async function getLatestReleaseVersion() {
        try {
            const response = await fetch(viewerUrl);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            return data.tag_name || "No release tag found";
        } catch (error) {
            console.error("Error fetching latest release:", error);
            return null;
        }
    }

    function injectAssets(version) {
        const assetIdPrefix = `viewer-${version}`;

        // Inject CSS if not already present
        if (!document.getElementById(`${assetIdPrefix}-css`)) {
            const cssLink = document.createElement('link');
            cssLink.id = `${assetIdPrefix}-css`;
            cssLink.rel = 'stylesheet';
            cssLink.href = `${baseUrl}/${version}/styles.css`;
            document.head.appendChild(cssLink);
        }

        // Inject polyfills.js if not already present
        if (!document.getElementById(`${assetIdPrefix}-polyfills`)) {
            const jsPolyScript = document.createElement('script');
            jsPolyScript.id = `${assetIdPrefix}-polyfills`;
            jsPolyScript.src = `${baseUrl}/${version}/polyfills.js`;
            jsPolyScript.defer = true;
            jsPolyScript.type = 'module';
            document.body.appendChild(jsPolyScript);
        }

        // Inject main.js if not already present
        if (!document.getElementById(`${assetIdPrefix}-main`)) {
            const jsScript = document.createElement('script');
            jsScript.id = `${assetIdPrefix}-main`;
            jsScript.src = `${baseUrl}/${version}/main.js`;
            jsScript.defer = true;
            jsScript.type = 'module';
            document.body.appendChild(jsScript);
        }
    }
})();