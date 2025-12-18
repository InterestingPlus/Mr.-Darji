import mongoose from "mongoose";
import User from "../models/User.model.js";
import Shop from "../models/Shop.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const registerOwnerShop = async (req, res) => {
  const {
    name,
    phone,
    password,
    shopName,
    language = "en",
    shopType = "Tailor",
    addressLine1 = "N/A",
    city = "N/A",
    state = "N/A",
  } = req.body;

  if (
    !email ||
    !password ||
    !shopName ||
    !shopType ||
    !addressLine1 ||
    !city ||
    !state
  ) {
    return res
      .status(400)
      .json({ message: "Missing required registration fields." });
  }

  // validate and logging
  console.log("Registration for,", req.body);
  console.log(
    "Name",
    name,
    "Phone",
    phone,
    "Password",
    password,
    "Shop Name",
    shopName,
    "Address",
    address
  );

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new Error("Phone already used");
    }

    const passwordHash = password ? await bcrypt.hash(password, 12) : null;

    const user = await User.create({
      name,
      phone,
      password: passwordHash,
      role: "owner",
      language,
      // dob, language
    });

    console.log("Created User", user);

    const shopCode = await Shop.generateShopCode(city, state);
    const slug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const shop = await Shop.create([
      {
        name: shopName,
        slug: slug,
        shopCode: shopCode, // <--- New generated code added
        owner_id: user._id,
        shopType: shopType, // <--- Required as per schema
        contact: {
          phone: req.body.phone || "0000000000", // Mandatory Contact field needed
          address: {
            line1: addressLine1,
            city: city,
            state: state,
            // Pincode is optional here but helpful
          },
        },
      },
    ]);

    console.log("Created Shop", shop);

    await User.updateOne({ _id: user._id }, { $set: { shopId: shop._id } });

    const token = signToken({
      userId: user._id,
      role: "owner",
      shopId: shop._id,
    });

    console.log("Token", token);
    console.log("Successfully Created");

    res.json({ ok: true, user, shop, token });
  } catch (error) {
    console.error("Registration failed:", error);

    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Shop or Owner ID already registered." });
    }
    res
      .status(500)
      .json({ message: "Registration failed due to server error." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log(phone, password);

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required." });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken({
      userId: user._id,
      role: user.role,
      shopId: user.shopId,
      language: user.language,
    });

    console.log("token bhej diya gaya hai", token);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        shopId: user.shopId,
        language: user.language,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};
