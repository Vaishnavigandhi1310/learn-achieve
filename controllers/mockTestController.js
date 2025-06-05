const mockTestService = require('../services/mockTestService');

const createMockTest = async (req, res) => {
  try {
    const mockTestData = req.body;
    const mockTest = await mockTestService.createMockTest(mockTestData);

    res.status(201).json({
      message: "Mock test created successfully",
      data: mockTest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMockTests = async (req,res)=>{
    try {
        const tests = await mockTestService.getAllMockTests();
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

module.exports = {
    createMockTest,
    getAllMockTests
}