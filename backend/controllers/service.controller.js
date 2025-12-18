import generateId from "../services/generateId.js";
import { GoogleSheetService } from "./../services/GoogleSheetService.js";
const sheet = new GoogleSheetService();

export const AddService = async (req, res) => {
  //   "service_id",
  //   "shop_id",
  //   "name",
  //   "description",
  //   "price",
  //   "images",
  //   "estimated_days",
  //   "created_at",
  //   "updated_at",

  try {
    const { name, description, price, images, estimated_days } = req.body;
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found." });
    }

    const service_id = generateId();
    const created_at = new Date();

    await sheet.insert("Services", [
      service_id,
      userDoc?.shopId,
      name,
      description,
      price,
      images,
      estimated_days,
      created_at,
      created_at,
    ]);

    console.log("Service added successfully!", name);

    res.status(200).json({ message: "Service added successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const AllServices = async (req, res) => {
  try {
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found.", data: [] });
    }

    const result = await sheet.read("Services");

    if (result?.length == 0)
      res.status(200).json({ message: "No data found", data: [] });

    const filteredResult =
      userDoc?.shopId &&
      result?.length > 0 &&
      result.filter((item) => {
        return item.shop_id?.includes(userDoc?.shopId?.toString());
      });

    res.status(200).json({ message: "Success", data: filteredResult });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", data: [] });
  }
};

export const UpdateService = async (req, res) => {
  try {
    const { service_id } = req.params;
    const { name, description, price, images, estimated_days } = req.body;
    const { userDoc } = req;
    console.log(userDoc, service_id);

    if (!userDoc) {
      res.status(401).json({ message: "User not found." });
    }

    const updated_at = new Date();

    await sheet.updateById("Services", service_id, [
      userDoc?.shopId,
      name,
      description,
      price,
      images,
      estimated_days,
      updated_at,
    ]);

    console.log("Service updated successfully!", name);

    res.status(200).json({ message: "Service updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
