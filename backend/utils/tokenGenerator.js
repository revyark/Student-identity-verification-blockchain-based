import jwt from "jsonwebtoken";
import { Student } from "../models/user.models.js";
import { Institute } from "../models/institute.models.js";
import { Verifier } from "../models/verifier.models.js";

const generateAccessTokenAndRefreshTokens = async (userID) => {
  try {
    let user = await Student.findById(userID);
    let userType = "student";

    if (!user) {
      user = await Institute.findById(userID);
      userType = "institute";
    }
    if (!user) {
      user = await Verifier.findById(userID);
      userType = "verifier";
    }

    if (!user) throw new Error("User not found");

    const payload = { id: user._id, type: userType };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken, type: userType };
  } catch (error) {
    throw new Error("Error generating tokens: " + error.message);
  }
};

export { generateAccessTokenAndRefreshTokens };
