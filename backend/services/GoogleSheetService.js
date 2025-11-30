import { google } from "googleapis";

export class GoogleSheetService {
  constructor() {
    let credentials;
    if (!process.env.GOOGLE_SERVICE_AUTH) {
      throw new Error("GOOGLE_SERVICE_AUTH environment variable is not set.");
    }

    const rawCredentialsString = process.env.GOOGLE_SERVICE_AUTH;
    credentials = JSON.parse(rawCredentialsString);

    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    } else {
      throw new Error("Private key missing in Google credentials JSON.");
    }

    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.client = null;
  }

  async init() {
    if (!this.client) {
      this.client = await this.auth.getClient();
      this.sheets = google.sheets({ version: "v4", auth: this.client });
    }
    return this;
  }

  async insert(entity, values) {
    await this.init();
    const range = `${entity}!A1:Z1`;

    return this.sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  }

  async read(entity) {
    await this.init();
    const range = `${entity}!A1:Z9999`;

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range,
    });

    return res.data.values || [];
  }

  async update(entity, rowIndex, values) {
    await this.init();
    const range = `${entity}!A${rowIndex}:Z${rowIndex}`;

    return this.sheets.spreadsheets.values.update({
      spreadsheetId: this.sheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  }

  async deleteRow(entity, rowIndex) {
    await this.init();

    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId(entity),
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });
  }
}
