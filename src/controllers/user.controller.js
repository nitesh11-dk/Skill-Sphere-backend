import User from "../models/user.model.js";
import jwt from "jsonwebtoken";



export const registerUser = async (req, res) => {
  try {
    const { username, email, fullName, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "A user with this email or username already exists. Please use a different email or username.",
      });
    }

    const user = new User({ username, email, password, fullName });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again later.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    let isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      console.error("Missing JWT configuration");
      return res.status(500).json({ message: "Server configuration error",success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" ,success: false});
  }
};

export const editUser = async (req, res) => {
  try {
    const { fullName, username, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let updated = false;

    if (fullName) {
      user.fullName = fullName;
      updated = true;
    }
    if (username) {
      user.username = username;
      updated = true;
    }
    if (email) {
      user.email = email;
      updated = true;
    }

    if (updated) {
      await user.save({ validateModifiedOnly: true });

      return res
        .status(200)
        .json({ message: "User updated successfully", success: true, user });
    } else {
      return res
        .status(200)
        .json({ message: "No changes made", success: true });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", success: false });
  }
};


export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).populate("skills bookings reviews");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().populate("skills");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).populate("skills bookings reviews");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
