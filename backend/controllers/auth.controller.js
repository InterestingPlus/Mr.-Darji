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

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

export const registerOwnerShop = async (req, res) => {
  const {
    name,
    email,
    phone,
    shopName,
    language = "en",
    shopType = "Tailor",
    addressLine1 = "N/A",
    city = "N/A",
    state = "N/A",
    country = "N/A",
  } = req.body;

  if (
    !email ||
    !phone ||
    !shopName ||
    !shopType ||
    !addressLine1 ||
    !city ||
    !state ||
    !country
  ) {
    return res
      .status(400)
      .json({ message: "Missing required registration fields." });
  }

  // validate and logging
  console.log("Registration for,", req.body);

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already used" });
    }

    const existingEmail = await Shop.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already Registered" });
    }

    let languageCode;

    switch (language) {
      case "English":
        languageCode = "en";
        break;
      case "Hindi":
        languageCode = "hi";
        break;
      case "Gujarati":
        languageCode = "mr";
        break;
      default:
        languageCode = "en";
        break;
    }

    const user = await User.create({
      name,
      email,
      phone,
      role: "owner",
      languageCode,
    });

    console.log("Created User", user);

    let slug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const random5 = Math.floor(10000 + Math.random() * 90000);

    slug = `${slug}-${random5}`;

    console.log(slug);

    const shop = await Shop.create([
      {
        name: shopName,
        slug: slug,
        owner_id: user._id,
        shopType: shopType, // <--- Required as per schema
        contact: {
          phone: phone || "0000000000", // Mandatory Contact field needed
          address: {
            line1: addressLine1,
            city: city,
            state: state,
            country: country,
            // Pincode is optional here but helpful
          },
        },
      },
    ]);

    console.log("Created Shop", shop);

    await User.findByIdAndUpdate(user._id, {
      shopId: shop[0]._id,
    });

    const token = signToken({
      userId: user._id,
      role: "owner",
      shopId: shop._id,
      language: user.language,
    });

    console.log("Token", token);
    console.log("Successfully Created");

    res.status(200).json({ ok: true, user, shop, token });
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

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    console.log("ID TOKEN", idToken);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const usertest = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    console.log("Google User", usertest);

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res.status(200).json({ message: "Please Sign up!", user: null });
    }

    const token = signToken({
      userId: user._id,
      role: user.role,
      shopId: user.shopId,
      language: user.language,
    });

    console.log("token bhej diya gaya hai", token, {
      userId: user._id,
      role: user.role,
      shopId: user.shopId,
      language: user.language,
    });

    res.status(200).json({
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

// export const registerOwnerShop = async (req, res) => {
//   const {
//     name,
//     phone,
//     password,
//     shopName,
//     language = "en",
//     shopType = "Tailor",
//     addressLine1 = "N/A",
//     city = "N/A",
//     state = "N/A",
//     country = "N/A",
//   } = req.body;

//   if (
//     !phone ||
//     !password ||
//     !shopName ||
//     !shopType ||
//     !addressLine1 ||
//     !city ||
//     !state ||
//     !country
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Missing required registration fields." });
//   }

//   // validate and logging
//   console.log("Registration for,", req.body);

//   try {
//     const existingUser = await User.findOne({ phone });
//     if (existingUser) {
//       return res.status(400).json({ message: "Phone already used" });
//     }

//     let languageCode;

//     switch (language) {
//       case "English":
//         languageCode = "en";
//         break;
//       case "Hindi":
//         languageCode = "hi";
//         break;
//       case "Gujarati":
//         languageCode = "mr";
//         break;
//       default:
//         languageCode = "en";
//         break;
//     }

//     const passwordHash = password ? await bcrypt.hash(password, 12) : null;

//     const user = await User.create({
//       name,
//       phone,
//       password: passwordHash,
//       role: "owner",
//       languageCode,
//     });

//     console.log("Created User", user);

//     let slug = shopName
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, "-")
//       .replace(/-+/g, "-")
//       .replace(/^-|-$/g, "");

//     const random5 = Math.floor(10000 + Math.random() * 90000);

//     slug = `${slug}-${random5}`;

//     console.log(slug);

//     const shop = await Shop.create([
//       {
//         name: shopName,
//         slug: slug,
//         owner_id: user._id,
//         shopType: shopType, // <--- Required as per schema
//         contact: {
//           phone: phone || "0000000000", // Mandatory Contact field needed
//           address: {
//             line1: addressLine1,
//             city: city,
//             state: state,
//             country: country,
//             // Pincode is optional here but helpful
//           },
//         },
//       },
//     ]);

//     console.log("Created Shop", shop);

//     await User.findByIdAndUpdate(user._id, {
//       shopId: shop[0]._id,
//     });

//     const token = signToken({
//       userId: user._id,
//       role: "owner",
//       shopId: shop._id,
//       language: user.language,
//     });

//     console.log("Token", token);
//     console.log("Successfully Created");

//     res.status(200).json({ ok: true, user, shop, token });
//   } catch (error) {
//     console.error("Registration failed:", error);

//     if (error.code === 11000) {
//       return res
//         .status(409)
//         .json({ message: "Shop or Owner ID already registered." });
//     }
//     res
//       .status(500)
//       .json({ message: "Registration failed due to server error." });
//   }
// };

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

    console.log("token bhej diya gaya hai", token, {
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
