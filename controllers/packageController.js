const { get } = require('../routes/authRoutess');
const packageService = require('../services/packageService');

const addPackage = async (req, res) => {
  try {
    const { packageName, amount, discountAmount, className } = req.body;
    const file = req.file;

    const image = file
      ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      : null;

    const newPackage = await packageService.addPackage({
      packageName,
      amount,
      discountAmount,
      className,
      image,
    });

    res.status(201).json({ message: 'Package added successfully', package: newPackage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add package', error: error.message });
  }
};


const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    await packageService.deletePackage(id);

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete package', error: error.message });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const all = await packageService.getAllPackages();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packages', error: err.message });
  }
};


module.exports = {
  addPackage,
  deletePackage,
  getAllPackages
};
