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
    address,
    // establishedYear,
    // language,
  } = req.body;

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
      // dob, language
    });

    console.log("Created User", user);

    const shop = await Shop.create({
      name: shopName,
      owner_id: user._id,
      address,
      // establishedYear,
    });

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
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
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
