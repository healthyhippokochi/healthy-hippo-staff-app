# Healthy Hippo Staff App — setup (Malayalam)

1. Google Sheet: https://docs.google.com/spreadsheets/d/1praisMlnMHSYO9ToXcJk7eC_D6xWWwcvjPVDs1F5P9I/edit
2. Open Extensions > Apps Script. Replace Code.gs with the content of Code.gs here. Add an HTML file named Index, paste Index.html here.
3. Deploy > New deployment > Web app. Execute as: Me; Who has access: Anyone. Authorize and copy the /exec URL.
4. In this repository's index.html, replace PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE with the /exec URL.
5. GitHub Settings > Pages > Deploy from branch > main / root > Save.
6. Open GitHub Pages URL and test one sale; check Sales tab.

The GitHub page links to the Apps Script app, which securely saves to private Google Sheets. Never upload passwords or credentials. Anyone with the web app URL can submit sales; this is intentional (no PIN).
