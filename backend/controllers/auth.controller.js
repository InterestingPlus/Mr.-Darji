import mongoose from "mongoose";
import User from "../models/User.model.js";
import Shop from "../models/Shop.model.js";

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const registerOwnerShop = async (req, res) => {
  const { name, phone, password, shopName, address } = req.body;
  // validate
  console.log("Registration for,", name);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // check phone unique
    if (await User.findOne({ phone }).session(session)) {
      throw new Error("Phone already used");
    }

    const passwordHash = password ? await bcrypt.hash(password, 12) : null;
    const user = await User.create(
      [
        {
          name,
          phone,
          passwordHash,
          role: "owner",
        },
      ],
      { session }
    );

    const shop = await Shop.create(
      [
        {
          name: shopName,
          owner_id: user[0]._id,
          address,
        },
      ],
      { session }
    );

    // update user with shopId
    await User.updateOne(
      { _id: user[0]._id },
      { $set: { shopId: shop[0]._id } }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    const token = createJwt({
      userId: user[0]._id,
      role: "owner",
      shopId: shop[0]._id,
    });

    res.json({ ok: true, user: user[0], shop: shop[0], token });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
