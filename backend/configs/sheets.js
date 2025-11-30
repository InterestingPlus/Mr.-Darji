export const SheetsConfig = {
  customers: {
    sheetName: "Customers",
    columns: ["id", "name", "phone", "address", "created_at"],
    primaryKey: "id",
  },

  measurements: {
    sheetName: "Measurements",
    columns: ["id", "customer_id", "shoulder", "chest", "date"],
    primaryKey: "id",
  },

  orders: {
    sheetName: "Orders",
    columns: [
      "id",
      "customer_id",
      "measurement_id",
      "status",
      "delivery_date",
      "created_at",
    ],
    primaryKey: "id",
  },

  items: {
    sheetName: "Items",
    columns: ["id", "order_id", "title", "price", "qty"],
    primaryKey: "id",
  },
};
