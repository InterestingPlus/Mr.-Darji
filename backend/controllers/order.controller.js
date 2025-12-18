import generateId from "../services/generateId.js";
import { GoogleSheetService } from "./../services/GoogleSheetService.js";
import { AddMeasurement } from "./measurement.controller.js";
const sheet = new GoogleSheetService();

export const CreateOrder = async (req, res) => {
  try {
    const {
      customer_id,
      staff_assigned_id,
      status,
      total_price,
      discount,
      delivery_date,
      urgent,
      notes,

      payment_status,
      due_amount,
      images,
      items = [],
    } = req.body;
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found." });
    }

    const order_id = generateId();
    let created_at = new Date();

    const measurements = [];

    for (const item of items) {
      const measurement_id = generateId();

      const measurementFields = {};

      // convert { chest:{value:40}, waist:{value:34} } → {chest:40, waist:34}
      Object.entries(item.measurement_data).forEach(([key, obj]) => {
        measurementFields[key] = obj.value;
      });

      created_at = new Date();

      await sheet.insert("Measurements", [
        measurement_id,
        customer_id,
        userDoc.shopId,
        JSON.stringify(measurementFields),
        item.service_id,

        created_at,
        created_at,
      ]);
      //   "measurement_id",
      //   "customer_id",
      //   "shop_id",
      //   "fields",
      //   "service_id",
      //   "created_at",
      //   "updated_at",

      measurements.push({
        measurement_id,
        quantity: item.quantity,
      });
      console.log("Measurement added:", measurement_id, measurementFields);
    }

    await sheet.insert("Orders", [
      order_id,
      userDoc.shopId,
      customer_id,
      staff_assigned_id || "",
      JSON.stringify(measurements || []),

      status || "received",
      total_price,
      discount,

      payment_status,
      due_amount,

      delivery_date,

      "",
      "",

      urgent,
      notes,
      JSON.stringify(images || []),

      created_at,
      created_at,
    ]);

    // orderData = {
    //   customer_id: customer.customer_id,
    //   staff_assigned_id: staffAssigned,
    //   status: "pending",
    //   total_price: finalPrice,
    //   discount: parseFloat(totalDiscount),
    //   delivery_date: formatDeliveryDate(deliveryDateObj),
    //   urgent: isUrgent,
    //   notes: orderNotes,

    //   items: orderItems.map((item) => ({
    //     service_id: item.service_id,
    //     quantity: item.quantity,
    //     measurement_data: item.measurement_fields,
    //   })),
    // };

    // await sheet.insert("Orders", [
    //   order_id,
    //   userDoc?.shopId,
    //   customer_id,
    //   staff_assigned_id || "",
    //   measurement_id || "",
    //   total_price,
    //   discount,
    //   payment_status,
    //   due_amount,

    //   delivery_date,
    //   "",
    //   "",
    //   urgent,

    //   notes,
    //   JSON.stringify(images || []),

    //   created_at,
    //   created_at,
    // ]);
    console.log("Order Created successfully!", order_id);

    res.status(200).json({ message: "Order Created Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const OrderInfo = async (req, res) => {
  try {
    const { userDoc } = req;
    const { order_id } = req.params;

    if (!order_id)
      return res.status(400).json({ message: "Order ID not found." });

    if (!userDoc) {
      res.status(401).json({ message: "User not found.", data: [] });
    }

    const order = await sheet.findById("Orders", order_id);

    if (order?.length == 0)
      res.status(200).json({ message: "No data found", data: [] });

    console.log(order);

    res.status(200).json({ message: "Success", data: order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", data: [] });
  }
};

const getCustomerName = async (customer_id) => {
  const customer = await sheet.findById("Customers", customer_id);
  console.log(customer);
  return customer?.full_name || "Unknown";
};

export const AllOrders = async (req, res) => {
  try {
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found.", data: [] });
    }

    const result = await sheet.read("Orders");

    if (result?.length == 0)
      res.status(200).json({ message: "No data found", data: [] });

    const filteredResult =
      userDoc?.shopId &&
      result?.length > 0 &&
      result.filter((item) => {
        return item.shop_id?.includes(userDoc?.shopId?.toString());
      });

    const finalData = await Promise.all(
      filteredResult.map(async (item) => {
        const customerName = await getCustomerName(item.customer_id);

        return {
          id: item.order_id,
          customer: customerName,
          status: item.status,
          total_price: item.total_price,
          discount: item.discount,
          payment_status: item.payment_status,
          delivery_date: item.delivery_date,
          urgent: item.urgent,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      })
    );

    res.status(200).json({ message: "Success", data: finalData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", data: [] });
  }
};
