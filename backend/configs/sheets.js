export const SheetsConfig = {
  Customers: {
    sheetName: "Customers",
    columns: [
      "customer_id",
      "shop_id", // Array of Shop IDs
      "full_name",
      "image_url",
      "phone",
      "gender",
      "address",
      "tags", // VIP, Regular, Problematic, High value
      "created_at",
      "updated_at",
    ],
    primaryKey: "customer_id",
  },

  Measurements: {
    sheetName: "Measurements",
    columns: [
      "measurement_id",
      "customer_id",
      "shop_id",
      "fields",
      "service_id",
      "created_at",
      "updated_at",
    ],
    primaryKey: "measurement_id",
  },

  Orders: {
    sheetName: "Orders",
    columns: [
      "order_id",
      "shop_id",
      "customer_id",
      "staff_assigned_id",
      "measurement_id",
      "status", // received, cutting, stitching, ready, delivered
      "total_price",
      "discount",
      "payment_status", // paid / partial / unpaid
      "due_amount",
      "delivery_date",
      "delivered_date",
      "cancelled_at",
      "urgent",
      "notes",
      "images",
      "created_at",
      "updated_at",
    ],
    primaryKey: "order_id",
  },

  Ratings: {
    sheetName: "Ratings",
    columns: [
      "rating_id",
      "customer_id",
      "service_id",
      "shop_id",
      "rating",
      "review_text",
      "created_at",
      "updated_at",
    ],
    primaryKey: "rating_id",
  },

  Services: {
    sheetName: "Services",
    columns: [
      "service_id",
      "shop_id",
      "name",
      "description",
      "price",
      "images",
      "estimated_days",
      "created_at",
      "updated_at",
    ],
    primaryKey: "service_id",
  },
};
