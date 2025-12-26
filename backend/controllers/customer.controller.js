import generateId from "../services/generateId.js";
import { GoogleSheetService } from "./../services/GoogleSheetService.js";
const sheet = new GoogleSheetService();

export const AddCustomer = async (req, res) => {
  //   "customer_id",
  //   "shop_id", // Array of Shop IDs
  //   "full_name",
  //   "image_url",
  //   "phone",
  //   "gender",
  //   "address",
  //   "tags", // VIP, Regular, Problematic, High value
  //   "created_at",
  //   "updated_at",

  try {
    const { fullName, phone, gender, address, tags } = req.body;
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found." });
    }

    const customer_id = generateId();
    const created_at = new Date();

    const customer = await sheet.insert("Customers", [
      customer_id,
      JSON.stringify([userDoc?.shopId]),
      fullName,
      "",
      phone,
      gender,
      address,
      JSON.stringify(tags),
      created_at,
      created_at,
    ]);

    console.log("Customer added successfully!", customer);

    res.status(200).json({ message: "Customer added successfully!", customer });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const CustomerProfile = async (req, res) => {
  try {
    const { userDoc } = req;
    const { customer_id } = req.params;

    if (!customer_id)
      return res.status(400).json({ message: "Customer ID not found." });

    if (!userDoc) {
      res.status(401).json({ message: "User not found.", data: [] });
    }

    const customer = await sheet.findById("Customers", customer_id);
    console.log(customer);

    if (customer?.length == 0)
      res.status(200).json({ message: "No data found", data: [] });

    console.log(customer);

    res.status(200).json({ message: "Success", data: customer });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", data: [] });
  }
};

export const AllCustomers = async (req, res) => {
  try {
    const { userDoc } = req;

    if (!userDoc) {
      res.status(401).json({ message: "User not found.", data: [] });
    }

    const result = await sheet.read("Customers");

    if (result?.length == 0)
      res.status(200).json({ message: "No data found", data: [] });

    console.log(result);

    const filteredResult =
      userDoc?.shopId &&
      result?.length > 0 &&
      result.filter((item) => {
        return JSON.parse(item.shop_id)?.includes(userDoc?.shopId?.toString());
      });

    res.status(200).json({ message: "Success", data: filteredResult });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", data: [] });
  }
};
