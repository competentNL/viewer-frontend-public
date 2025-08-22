const repo = "competentNL/viewer-frontend-public";
const url = `https://api.github.com/repos/${repo}/releases/latest`;
const config = window["viewer"];

async function init() {
    let version = config['version'];
    if (!version) {
        version = await getLatestReleaseVersion();
    }

    if (!version) {
        console.error('No Version for viewer found.');
        return;
    }

    if (!config['backendUrl']) {
        console.error('No backend url for viewer found.');
        return;
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
    cssLink.href = `https://competentnl.github.io/viewer-frontend-public/releases/${version}/main.css`;
    document.head.appendChild(cssLink);

    // Inject JS
    const jsScript = document.createElement('script');
    jsScript.src = `https://competentnl.github.io/viewer-frontend-public/releases/${version}/main.js`;
    jsScript.defer = true; // Optional: defer loading
    document.body.appendChild(jsScript);
}

init().then(() => {
    console.log('initializing...');
});