import Asset from '../models/Asset.js';
import { encrypt, decrypt } from '../utils/encryption.js';

// Helper: encrypt credentials before saving
function encryptCredentials(body) {
  const data = { ...body };
  if (data.credentialUsername) data.credentialUsername = encrypt(data.credentialUsername);
  if (data.credentialPassword) data.credentialPassword = encrypt(data.credentialPassword);
  if (data.credentialNotes) data.credentialNotes = encrypt(data.credentialNotes);
  return data;
}

// Helper: decrypt credentials for response
function decryptAsset(asset) {
  const obj = asset.toObject ? asset.toObject() : { ...asset };
  if (obj.credentialUsername) obj.credentialUsername = decrypt(obj.credentialUsername);
  if (obj.credentialPassword) obj.credentialPassword = decrypt(obj.credentialPassword);
  if (obj.credentialNotes) obj.credentialNotes = decrypt(obj.credentialNotes);
  return obj;
}

// @desc    Create an asset
// @route   POST /api/assets
export const createAsset = async (req, res, next) => {
  try {
    const data = encryptCredentials(req.body);
    const asset = await Asset.create({
      ...data,
      userId: req.user._id
    });
    res.status(201).json(decryptAsset(asset));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assets for current user
// @route   GET /api/assets
export const getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(assets.map(decryptAsset));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
export const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, userId: req.user._id });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(decryptAsset(asset));
  } catch (error) {
    next(error);
  }
};

// @desc    Update an asset
// @route   PUT /api/assets/:id
export const updateAsset = async (req, res, next) => {
  try {
    const data = encryptCredentials(req.body);
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      data,
      { new: true, runValidators: true }
    );
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(decryptAsset(asset));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an asset
// @route   DELETE /api/assets/:id
export const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json({ message: 'Asset removed' });
  } catch (error) {
    next(error);
  }
};
