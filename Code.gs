/** Healthy Hippo sales entry — Google Apps Script HTML web app.
 * Deploy as: Execute as Me; access Anyone (anyone with URL can submit).
 * The underlying spreadsheet stays private.
 */
const SPREADSHEET_ID = '1praisMlnMHSYO9ToXcJk7eC_D6xWWwcvjPVDs1F5P9I';
const MAX_QTY = 100;

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Healthy Hippo | Sales Entry')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getMenu() {
  const rows = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheetByName('Menu Prices').getDataRange().getValues().slice(1);
  return rows.filter(r => r[0]).map(r => ({
    item: String(r[0]), offline: Number(r[1]), swiggy: Number(r[2]), zomato: Number(r[3])
  }));
}

function saveSale(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid request');
  const tx = String(data.txId || '');
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(tx)) throw new Error('Invalid transaction ID');
  const item = String(data.item || '');
  const qty = Number(data.quantity);
  const platform = String(data.platform || '');
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new Error('Quantity must be 1–100');
  if (!['Offline', 'Swiggy', 'Zomato'].includes(platform)) throw new Error('Invalid platform');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sales = book.getSheetByName('Sales');
    const last = sales.getLastRow();
    if (last > 1) {
      const existing = sales.getRange(2, 1, last - 1, 1)
        .createTextFinder(tx).matchEntireCell(true).findNext();
      if (existing) return { ok: true, duplicate: true, txId: tx };
    }
    const priceRow = getMenu().find(x => x.item === item);
    if (!priceRow) throw new Error('Item not found in menu');
    const price = platform === 'Offline' ? priceRow.offline : platform === 'Swiggy' ? priceRow.swiggy : priceRow.zomato;
    if (!Number.isFinite(price) || price < 0) throw new Error('Invalid menu price');
    const now = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    // Staff ID is blank by design: no login, no staff identity claims.
    sales.appendRow([tx, now, '', item, qty, platform, price, price * qty, 'Saved']);
    SpreadsheetApp.flush();
    return { ok: true, duplicate: false, txId: tx, total: price * qty };
  } finally {
    lock.releaseLock();
  }
}
