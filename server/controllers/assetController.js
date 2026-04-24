import Asset from '../models/Asset.js';

// @desc    Create an asset
// @route   POST /api/assets
export const createAsset = async (req, res, next) => {
  try {
    const asset = await Asset.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assets for current user
// @route   GET /api/assets
export const getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(assets);
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
    res.json(asset);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an asset
// @route   PUT /api/assets/:id
export const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
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
