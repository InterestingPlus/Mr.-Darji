import generateId from "../services/generateId.js";
import { GoogleSheetService } from "./../services/GoogleSheetService.js";
const sheet = new GoogleSheetService();

export const AddMeasurement = async (
  measurement_id,
  customer_id,
  shopId,
  fields,
  service_id
) => {
  //   "measurement_id",
  //   "customer_id",
  //   "shop_id",
  //   "fields",
  //   "service_id",
  //   "created_at",
  //   "updated_at",

  try {
    const created_at = new Date();

    await sheet.insert("Measurements", [
      measurement_id,
      customer_id,
      shopId,
      JSON.stringify(fields),
      service_id,
      created_at,
      created_at,
    ]);

    console.log("Measurement added successfully!");

    return { success: true, message: "Measurement added successfully!" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Server error" };
  }
};

export const GetMeasurement = async (req, res) => {
  //   try {
  //     const { userDoc } = req;
  //     const { measurement_id } = req.params;
};

export const AllMeasurements = async (req, res) => {
  try {
    const { userDoc } = req;

    if (!userDoc) {
      return res.status(401).json({ message: "User not found.", data: [] });
    }

    const result = await sheet.read("Measurements");

    if (!result || result.length === 0) {
      return res.status(200).json({ message: "No data found", data: [] });
    }

    const filteredResult = result.filter(
      (item) => item.shop_id?.toString() === userDoc.shopId?.toString()
    );

    if (filteredResult.length === 0) {
      return res.status(200).json({ message: "No data found", data: [] });
    }

    let finalData = {};

    filteredResult.forEach((item) => {
      const { service_id, fields } = item;

      finalData[service_id] = Object.entries(JSON.parse(fields)).map(
        ([key, value]) => ({
          key,
          label: key,
          default: String(value),
        })
      );
    });

    console.log(finalData);

    res.status(200).json({ message: "Success", data: finalData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", data: [] });
  }
};

export const UpdateMeasurement = async (req, res) => {
  //   try {
  //     const { userDoc } = req;
  // const { measurement_id } = req.params;
};
