const url = 'https://api.github.com/repos/competentNL/viewer-frontend-public/releases/latest';
const baseUrl = 'https://competentnl.github.io/viewer-frontend-public/releases';
const {version, backend_url} = Object.fromEntries(new URL(document.currentScript.src).searchParams);

window.viewer = {
    version,
    backendUrl: backend_url
}

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
        const response = await fetch(url);
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
    // Inject CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = `${baseUrl}/${version}/styles.css`;
    document.head.appendChild(cssLink);

    const jsPolyScript = document.createElement('script');
    jsPolyScript.src = `${baseUrl}/${version}/polyfills.js`;
    jsPolyScript.defer = true;
    jsPolyScript.type = 'module';
    document.body.appendChild(jsPolyScript);

    // Inject JS
    const jsScript = document.createElement('script');
    jsScript.src = `${baseUrl}/${version}/main.js`;
    jsScript.defer = true;
    jsScript.type = 'module';
    document.body.appendChild(jsScript);
}

init().catch((err) => {
    console.error(err);
});