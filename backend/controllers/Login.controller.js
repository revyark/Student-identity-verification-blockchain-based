
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/user.models.js";
import { Institute } from "../models/institute.models.js";
import { Verifier } from "../models/verifier.models.js";
import bcrypt from "bcryptjs";
import { generateAccessTokenAndRefreshTokens } from "../utils/tokenGenerator.js";

const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const student = await Student.findOne({ email });
  if (!student) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, student.password);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const { accessToken, refreshToken, type } =
    await generateAccessTokenAndRefreshTokens(student._id);

  const loggedinStudent = await Student.findById(student._id).select(
    "-password -refreshToken -__v"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json({
      accessToken,
      student: loggedinStudent,
      refreshToken,
      type,
      message: "Student logged in successfully",
    });
});


const loginInstitute = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const institute = await Institute.findOne({ email });
  if (!institute) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, institute.password);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const { accessToken, refreshToken, type } =
    await generateAccessTokenAndRefreshTokens(institute._id);

  const loggedinInstitute = await Institute.findById(institute._id).select(
    "-password -refreshToken -__v"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json({
      accessToken,
      institute: loggedinInstitute,
      refreshToken,
      type,
      message: "Institute logged in successfully",
    });
});

const loginVerifier = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const verifier = await Verifier.findOne({ email });
  if (!verifier) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, verifier.password);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const { accessToken, refreshToken, type } =
    await generateAccessTokenAndRefreshTokens(verifier._id);

  const loggedinVerifier = await Verifier.findById(verifier._id).select(
    "-password -refreshToken -__v"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json({
      accessToken,
      verifier: loggedinVerifier,
      refreshToken,
      type,
      message: "Verifier logged in successfully",
    });
});

export { loginStudent, loginInstitute, loginVerifier };
