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

    if (!order_id) {
      return res.status(400).json({ message: "Order ID not found." });
    }

    if (!userDoc) {
      return res.status(401).json({ message: "User not found.", data: [] });
    }

    /* ---------------- ORDER ---------------- */
    const order = await sheet.findById("Orders", order_id);
    if (!order) {
      return res.status(200).json({ message: "No data found", data: [] });
    }

    /* ---------------- CUSTOMER ---------------- */
    const customer = await sheet.findById("Customers", order.customer_id);
    order.customer = customer
      ? {
          customer_id: customer.customer_id,
          full_name: customer.full_name,
          phone: customer.phone,
          address: customer.address,
          tags: JSON.parse(customer.tags || "[]"),
        }
      : null;

    /* ---------------- MEASUREMENT MAP ---------------- */
    const measurementItems = JSON.parse(order.measurement_id || "[]");
    // [{ measurement_id, quantity }]
    console.log(measurementItems);

    console.log(
      await sheet.findById(
        "Measurements",
        String(measurementItems[0]?.measurement_id)
      )
    );

    const measurements = await Promise.all(
      measurementItems.map((m) =>
        sheet.findById("Measurements", String(m?.measurement_id))
      )
    );
    console.log(measurements);

    /* ---------------- SERVICES + ITEMS ---------------- */
    order.items = [];
    order.measurementSet = {};

    for (let i = 0; i < measurementItems.length; i++) {
      const mapItem = measurementItems[i];
      const measurement = measurements[i];

      if (!measurement) continue;

      // 🔥 fetch service FIRST
      const service = await sheet.findById("Services", measurement.service_id);

      if (!service) continue;

      // ✅ measurementSet (now service exists)
      order.measurementSet[measurement.measurement_id] = {
        service: service.name, // 👈 frontend friendly
        service_id: measurement.service_id,
        quantity: mapItem.quantity,
        fields: JSON.parse(measurement.fields || "{}"),
      };

      // ✅ items
      order.items.push({
        service_id: service.service_id,
        name: service.name,
        price: Number(service.price),
        estimated_days: service.estimated_days,
        quantity: mapItem.quantity,
        total_price: Number(service.price) * mapItem.quantity,
        images: JSON.parse(service.images || "[]"),
      });
    }

    /* ---------------- ORDER IMAGES ---------------- */
    order.images = JSON.parse(order.images || "[]");

    console.log("here is the order info", order);

    return res.status(200).json({
      message: "Success",
      data: order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
      data: [],
    });
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

    if (!filteredResult) {
      res.status(200).json({ message: "No data found", data: [] });
      return;
    }

    const finalData = await Promise.all(
      filteredResult?.map(async (item) => {
        const customerName = await getCustomerName(item.customer_id);

        return {
          id: item.order_id,
          customer: customerName,
          status: item.status,
          total_price: item.total_price,
          discount: item.discount,
          payment_status: item.payment_status,
          delivery_date: item.delivery_date,
          delivered_date: item.delivered_date,
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

export const UpdateStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found." });
    }

    const updated_at = new Date();

    const prev_data = await sheet.findById("Orders", order_id);

    if (status === "delivered") {
      prev_data.delivered_date = updated_at;
    }

    await sheet.updateById("Orders", order_id, [
      userDoc?.shopId,

      prev_data?.customer_id,
      prev_data?.staff_assigned_id,
      prev_data?.measurement_id,

      status,

      prev_data?.total_price,
      prev_data?.discount,
      prev_data?.payment_status,
      prev_data?.delivery_date,
      prev_data?.delivered_date,
      prev_data?.cancelled_at,
      prev_data?.urgent,
      prev_data?.notes,
      prev_data?.images,
      prev_data?.created_at,

      updated_at,
    ]);

    res.status(200).json({ message: "Order Status updated to " + status });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const UpdatePayment = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { payment_status } = req.body;
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found." });
    }

    const updated_at = new Date();

    const prev_data = await sheet.findById("Orders", order_id);

    await sheet.updateById("Orders", order_id, [
      userDoc?.shopId,

      prev_data?.customer_id,
      prev_data?.staff_assigned_id,
      prev_data?.measurement_id,
      prev_data?.status,
      prev_data?.total_price,
      prev_data?.discount,

      payment_status || new Date(),

      prev_data?.delivery_date,
      prev_data?.delivered_date,
      prev_data?.cancelled_at,
      prev_data?.urgent,
      prev_data?.notes,
      prev_data?.images,
      prev_data?.created_at,

      updated_at,
    ]);

    res.status(200).json({ message: "Payment Recieved! Send Receipt =>" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
