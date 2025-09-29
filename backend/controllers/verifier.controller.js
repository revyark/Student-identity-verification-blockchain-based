import { asyncHandler } from "../utils/asyncHandler.js";
import { Verifier } from "../models/verifier.models.js";

// GET /api/verifier/:id/profile
const getVerifierProfile = asyncHandler(async (req, res) => {
  const { id } = req.params; // can be _verifierId or Mongo _id
  let verifier = await Verifier.findOne({ _verifierId: id }).select("-password -__v");
  if (!verifier && id) {
    // try by Mongo ObjectId
    try {
      verifier = await Verifier.findById(id).select("-password -__v");
    } catch (_) {
      // ignore cast error
    }
  }
  if (!verifier && id) {
    // try by wallet address
    verifier = await Verifier.findOne({ walletAddress: id }).select("-password -__v");
  }
  if (!verifier && id) {
    // try by email
    verifier = await Verifier.findOne({ email: id }).select("-password -__v");
  }
  if (!verifier) {
    res.status(404);
    throw new Error("Verifier not found");
  }
  // normalize response similar to InstitutionProfile mapping
  const data = {
    name: verifier.verifierName,
    email: verifier.email,
    location: `${verifier.city}, ${verifier.state}, ${verifier.country}`,
    contact: verifier.phonenumber,
    walletAddress: verifier.walletAddress,
    _verifierId: verifier._verifierId,
    description: verifier.description
  };
  return res.status(200).json(data);
});

// PUT /api/verifier/:id/profile
const updateVerifierProfile = asyncHandler(async (req, res) => {
  const { id } = req.params; // can be _verifierId or Mongo _id
  const { name, email, location, contact, description, city, state, country, phone } = req.body;

  // Resolve target verifier by various identifiers
  let filter = { _verifierId: id };
  let verifier = await Verifier.findOne(filter);
  if (!verifier && id) {
    try {
      verifier = await Verifier.findById(id);
      if (verifier) filter = { _id: verifier._id };
    } catch (_) {}
  }
  if (!verifier && id) {
    verifier = await Verifier.findOne({ walletAddress: id });
    if (verifier) filter = { _id: verifier._id };
  }
  if (!verifier && id) {
    verifier = await Verifier.findOne({ email: id });
    if (verifier) filter = { _id: verifier._id };
  }
  if (!verifier) {
    res.status(404);
    throw new Error("Verifier not found");
  }

  // Build updates only with non-empty values
  const updates = {};
  if (name !== undefined && String(name).trim() !== '') updates.verifierName = String(name).trim();
  if (email !== undefined && String(email).trim() !== '') updates.email = String(email).trim();
  const phoneValue = contact ?? phone;
  if (phoneValue !== undefined && String(phoneValue).trim() !== '') updates.phonenumber = String(phoneValue).trim();
  if (description !== undefined && String(description).trim() !== '') updates.description = String(description).trim();

  // Location handling: accept either combined 'location' or granular fields
  if (location !== undefined && String(location).trim() !== '') {
    const parts = String(location).split(',').map(p => p.trim()).filter(Boolean);
    if (parts[0]) updates.city = parts[0];
    if (parts[1]) updates.state = parts[1];
    if (parts[2]) updates.country = parts[2];
  }
  if (city !== undefined && String(city).trim() !== '') updates.city = String(city).trim();
  if (state !== undefined && String(state).trim() !== '') updates.state = String(state).trim();
  if (country !== undefined && String(country).trim() !== '') updates.country = String(country).trim();

  try {
    const updatedDoc = await Verifier.findOneAndUpdate(
      filter,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -__v');

    const updated = {
      name: updatedDoc.verifierName,
      email: updatedDoc.email,
      location: `${updatedDoc.city}, ${updatedDoc.state}, ${updatedDoc.country}`,
      contact: updatedDoc.phonenumber,
      walletAddress: updatedDoc.walletAddress,
      _verifierId: updatedDoc._verifierId,
      description: updatedDoc.description
    };
    return res.status(200).json(updated);
  } catch (err) {
    // Handle duplicate key errors or validation errors gracefully
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate value for a unique field', details: err.keyValue });
    }
    return res.status(400).json({ message: 'Failed to update verifier profile' });
  }
});

export { getVerifierProfile, updateVerifierProfile };


