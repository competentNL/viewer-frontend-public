const url = 'https://api.github.com/repos/competentNL/viewer-frontend-public/releases/latest';
const baseUrl = 'https://competentnl.github.io/viewer-frontend-public/releases';
const backendUrl = document.currentScript.getAttribute('backend-url');
let version = document.currentScript.getAttribute('version');

const currentScript = document.currentScript;
const args = Object.fromEntries(new URL(document.currentScript.src).searchParams);
console.log(currentScript, args);

async function init() {
    if (!version) {
        version = await getLatestReleaseVersion();
    }

    if (!version) {
        throw new Error("No Version Found, please contact maintainer");
    }

    if (!backendUrl) {
        throw new Error("No Backend Url Found, please contact maintainer");
    }

    injectAssets(version);
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