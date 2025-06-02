// const Package = require('../models/Package');
const Package = require('../models/Package');
const fs = require('fs');
const path = require('path');

const addPackage = async ({ packageName, amount, discountAmount, className, image }) => {
  const newPackage = new Package({
    packageName,
    amount,
    discountAmount,
    className,
    image,
  });
  await newPackage.save();
  return newPackage;
};

const deletePackage = async (id) => {
  const packageToDelete = await Package.findById(id);
  if (!packageToDelete) {
    throw new Error('Package not found');
  }

  if (packageToDelete.image) {
    const imagePath = path.resolve(packageToDelete.image);
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete image:', err);
    });
  }

  await Package.findByIdAndDelete(id);
  return;
};

const getAllPackages = async () => {
  return await Package.find();
};

module.exports = {
  addPackage,
  deletePackage,
  getAllPackages
};
