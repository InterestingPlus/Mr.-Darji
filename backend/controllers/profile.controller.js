import Shop from "./../models/Shop.model.js"; // Shop Model import
import mongoose from "mongoose";

// Utility function to map React Native fields back to Mongoose structure
const createUpdatePayload = (data) => {
  // Yehi woh step hai jahan hum frontend ke flat state ko backend ke nested schema mein map karte hain
  const update = {};

  // Basic Identity
  if (data.name) update.name = data.name;
  if (data.tagline !== undefined) update.tagline = data.tagline;
  if (data.shopType) update.shopType = data.shopType;

  // Contact & Location (nested fields)
  if (data.phone !== undefined) update["contact.phone"] = data.phone;
  if (data.alternatePhone !== undefined)
    update["contact.alternatePhone"] = data.alternatePhone;
  if (data.whatsappNumber !== undefined)
    update["contact.whatsappNumber"] = data.whatsappNumber;
  if (data.googleMap !== undefined)
    update["contact.googleMap"] = data.googleMap;

  // Address (deeply nested)
  if (data.line1 !== undefined) update["contact.address.line1"] = data.line1;
  if (data.city !== undefined) update["contact.address.city"] = data.city;
  if (data.pincode !== undefined)
    update["contact.address.pincode"] = data.pincode;

  // Social Links (nested)
  if (data.instagram !== undefined)
    update["socialLinks.instagram"] = data.instagram;
  if (data.facebook !== undefined)
    update["socialLinks.facebook"] = data.facebook;
  if (data.website !== undefined) update["socialLinks.website"] = data.website;
  if (data.googleBusiness !== undefined)
    update["socialLinks.googleBusiness"] = data.googleBusiness;

  // About & Speciality (nested)
  if (data.description !== undefined)
    update["about.description"] = data.description;
  if (data.experienceYears !== undefined)
    update["about.experienceYears"] = Number(data.experienceYears);
  if (data.specialities && Array.isArray(data.specialities))
    update["about.specialities"] = data.specialities;

  // NOTE: Media, Working Hours, and KYC update logic should be handled separately

  return update;
};

// --- GET Shop Profile ---
export const getShopProfile = async (req, res) => {
  // Assuming Authentication middleware adds user ID to req.user.id
  const ownerId = req.userDoc.id;

  try {
    const shop = await Shop.findOne({ owner_id: ownerId });

    if (!shop) {
      // Agar shop exist nahi karta, toh new profile banane ka message de
      return res
        .status(404)
        .json({ message: "Shop profile not found. Please create one." });
    }

    // Sensitive verification documents ko hide karna zaroori hai
    const shopData = shop.toObject();
    delete shopData.verification.documents;

    res.status(200).json(shopData);
  } catch (error) {
    console.error("Error fetching shop profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching shop data." });
  }
};

export const getPublicProfile = async (req, res) => {
  // Assuming Authentication middleware adds user ID to req.user.id
  const slug = req.params.slug;

  try {
    const shop = await Shop.findOne({ slug });

    if (!shop) {
      // Agar shop exist nahi karta, toh new profile banane ka message de
      return res
        .status(404)
        .json({ message: "Shop profile not found. Please create one." });
    }

    // Sensitive verification documents ko hide karna zaroori hai
    const shopData = shop.toObject();
    delete shopData.verification.documents;

    res.status(200).json(shopData);
  } catch (error) {
    console.error("Error fetching shop profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching shop data." });
  }
};

// --- UPDATE Shop Profile ---
export const updateShopProfile = async (req, res) => {
  const ownerId = req.userDoc.id;
  const updateData = req.body;

  // Data ko nested MongoDB format mein convert karein
  const updatePayload = createUpdatePayload(updateData);

  // Agar payload empty hai, toh koi update nahi
  if (Object.keys(updatePayload).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update." });
  }

  try {
    // Step 1: Shop find karo (ownerId se)
    const shop = await Shop.findOne({ owner_id: ownerId });

    if (!shop) {
      return res.status(404).json({ message: "Shop profile not found." });
    }

    // Step 2: Update karein
    const updatedShop = await Shop.findOneAndUpdate(
      { owner_id: ownerId },
      { $set: updatePayload }, // $set operator nested fields ko directly update karta hai
      { new: true, runValidators: true } // new: true returns the updated document
    );

    // Step 3: Response dein
    if (updatedShop) {
      const shopResponse = updatedShop.toObject();
      delete shopResponse.verification.documents; // Hide sensitive data
      return res.status(200).json({
        message: "Shop profile updated successfully.",
        shop: shopResponse,
      });
    }
  } catch (error) {
    // Mongoose validation errors ya any other internal error
    console.error("Error updating shop profile:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, details: error.errors });
    }
    res
      .status(500)
      .json({ message: "Internal server error during profile update." });
  }
};

// NOTE: You would need a separate POST function (createShopProfile)
// to handle initial registration which generates shopCode and slug.
