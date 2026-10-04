// MV3 service worker: clicking the toolbar icon opens the side panel.
try {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
} catch (e) { /* browser without sidePanel support */ }
