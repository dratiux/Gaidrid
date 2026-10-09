// MV3 service worker: clicking the toolbar icon opens the side panel.
try {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
} catch (e) { /* browser without sidePanel support */ }

// Keyboard shortcut (manifest "commands"): open the side panel anywhere.
try {
  if (chrome.commands && chrome.commands.onCommand) {
    chrome.commands.onCommand.addListener((cmd) => {
      if (cmd !== 'open-side-panel') return;
      try {
        if (!chrome.sidePanel || !chrome.sidePanel.open) return;
        if (chrome.windows && chrome.windows.getCurrent) {
          chrome.windows.getCurrent({}, (w) => {
            if (chrome.runtime && chrome.runtime.lastError) return;
            try { chrome.sidePanel.open({ windowId: w.id }).catch(() => {}); } catch (e) {}
          });
        } else {
          chrome.sidePanel.open({}).catch(() => {});
        }
      } catch (e) {}
    });
  }
} catch (e) {}
