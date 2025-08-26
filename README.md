# Viewer Frontend Public Releases

This repository serves as a public CDN for all Viewer Frontend releases. It allows seamless integration of the viewer into your web application without requiring manual updates when new versions are released.

## Installation

To Embed the viewer inside your website you need to use the following example.

```html
<app-viewer-root></app-viewer-root>

<script src="viewer-initializer.js?version=<version>&backend_url=<backend_url>"></script>
```

## Viewer initializer 
The viewer-initializer.js script contains all the logic required to render the viewer inside your application. It is hosted on GitHub, ensuring that updates to the viewer are automatically reflected without requiring changes to your website. 

## Config

| Key     | Value                                                                                                                         | Example                 |
|---------|-------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| version | Specify a release version manually, or omit this key to automatically fetch the latest version via the GitHub API. | 0.0.0                   
|backendUrl| URL of the backend API that the viewer will communicate with.                                                                 | https://example.com/api |

## Notes
Make sure the window.viewer object is defined before loading the initializer script.
The viewer is designed to be flexible and automatically adapt to updates pushed to this repository.