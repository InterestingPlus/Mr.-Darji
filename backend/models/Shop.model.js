import mongoose from "mongoose";

const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: {
      type: String,
      enum: ["work", "design", "before_after", "logo", "cover"],
      default: "work",
    },
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    line1: { type: String, trim: true },
    area: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: "India" },
    pincode: { type: String, trim: true },
  },
  { _id: false }
);

const workingHoursSchema = new Schema(
  {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "19:00" },
  },
  { _id: false }
);

const ShopSchema = new Schema(
  {
    // 🧩 1. Basic Identity & Ownership
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    }, // 1 shop per owner
    name: { type: String, required: true, trim: true, index: true },
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    shopType: {
      type: String,
      enum: [
        "Tailor",
        "Boutique",
        "Fashion Designer",
        "Men Tailor",
        "Women Tailor",
        "Unisex",
      ],
      required: true,
    },
    tagline: { type: String, trim: true, maxlength: 150 },

    // 🧩 2. Branding & Media
    logo: mediaSchema,
    coverImage: mediaSchema,
    gallery: [mediaSchema],

    // 🧩 3. Contact & Location
    contact: {
      phone: { type: String, required: true, trim: true },
      alternatePhone: { type: String, trim: true },
      whatsappNumber: { type: String, trim: true },
      googleMap: { type: String, trim: true },
      address: addressSchema,
      workingHours: {
        monday: workingHoursSchema,
        tuesday: workingHoursSchema,
        wednesday: workingHoursSchema,
        thursday: workingHoursSchema,
        friday: workingHoursSchema,
        saturday: workingHoursSchema,
        sunday: workingHoursSchema,
      },
    },

    // 🧩 4. Social & Online Presence
    socialLinks: {
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
      googleBusiness: { type: String, trim: true },
      website: { type: String, trim: true },
    },

    // 🧩 5. About & Speciality
    about: {
      description: { type: String, trim: true, maxlength: 500 },
      experienceYears: { type: Number, min: 0, default: 0 },
      specialities: [String],
    },

    // 🧩 6. Verification & Trust Layer
    verification: {
      phoneVerified: { type: Boolean, default: false },
      kycStatus: {
        type: String,
        enum: ["not_applied", "pending", "verified", "rejected"],
        default: "not_applied",
      },
      verifiedAt: Date,
      documents: {
        ownerIdProof: String,
        shopLicense: String,
        gstNumber: String,
      },
    },

    // 🧩 7. Meta & System Fields
    memberSince: { type: Date, default: Date.now },
  },
  { timestamps: true }
); // createdAt and updatedAt added automatically

const Shop = mongoose.model("Shop", ShopSchema);
export default Shop;
