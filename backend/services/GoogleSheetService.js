import { google } from "googleapis";
import { SheetsConfig } from "../configs/sheets.js";
import dotenv from "dotenv";

dotenv.config();
export class GoogleSheetService {
  constructor() {
    if (!process.env.GOOGLE_SERVICE_AUTH) {
      throw new Error("GOOGLE_SERVICE_AUTH environment variable is not set.");
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_AUTH);

    if (!credentials.private_key) {
      throw new Error("Private key missing in Google credentials JSON.");
    }

    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

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

  /** Convert array row → object using SheetsConfig columns */
  formatRow(entity, row) {
    const config = SheetsConfig[entity];
    if (!config) throw new Error(`Unknown entity ${entity}`);

    return config.columns.reduce((obj, col, i) => {
      obj[col] = row[i] ?? null;
      return obj;
    }, {});
  }

  /** Convert multiple rows */
  formatRows(entity, rows) {
    return rows.slice(1).map((row) => this.formatRow(entity, row));
  }

  async insert(entity, values) {
    await this.init();
    const { sheetName, columns } = SheetsConfig[entity];

    console.log(values.length, values);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: sheetName, // 🔥 IMPORTANT FIX
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });

    return this.formatRow(entity, values); // return inserted object
  }

  async read(entity) {
    await this.init();
    const { sheetName } = SheetsConfig[entity];

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${sheetName}!A1:Z9999`,
    });

    const rows = res.data.values || [];
    if (rows.length === 0) return [];

    return this.formatRows(entity, rows);
  }

  async findById(entity, id) {
    await this.init();
    const { sheetName } = SheetsConfig[entity];

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${sheetName}!A1:Z9999`,
    });

    const rows = res.data.values || [];
    if (rows.length === 0) return [];

    const found = rows.find((row) => row[0] === id);
    if (found) return this.formatRow(entity, found);

    return [];
  }

  async update(entity, rowIndex, values) {
    await this.init();
    const { sheetName } = SheetsConfig[entity];

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.sheetId,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

    return this.formatRow(entity, values); // return updated object
  }

  async updateById(entity, _id, values) {
    try {
      await this.init();
      const { sheetName } = SheetsConfig[entity];

      // 1️⃣ Get all rows
      const res = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `${sheetName}!A:Z`,
      });

      const rows = res.data.values || [];

      // 2️⃣ Find row index by service_id (assuming ID in column A)
      const rowIndex = rows.findIndex((row) => row[0] === _id);

      if (rowIndex === -1) {
        throw new Error("Service not found in sheet");
      }

      // 3️⃣ Google Sheets = 1-based index
      const sheetRow = rowIndex + 1;

      // 4️⃣ Update row
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: `${sheetName}!A${sheetRow}:ZZ${sheetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[_id, ...values]],
        },
      });

      return this.formatRow(entity, [_id, ...values]);
    } catch (err) {
      console.log(err);
    }
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

  /** Helper to get numeric sheetId for delete operation */
  async getSheetId(entity) {
    await this.init();
    const { sheetName } = SheetsConfig[entity];

    const sheetMeta = await this.sheets.spreadsheets.get({
      spreadsheetId: this.sheetId,
    });

    const sheet = sheetMeta.data.sheets.find(
      (s) => s.properties.title === sheetName
    );

    if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);

    return sheet.properties.sheetId;
  }
}
