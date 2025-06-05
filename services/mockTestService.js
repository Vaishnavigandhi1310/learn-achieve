const MockTest = require('../models/mockTestModel');


const createMockTest = async (data) => {
  const {
    mockTestName,
    medium,
    className,
    duration,
    subjects,
    noOfQuestions
  } = data;

  // Split comma-separated values
  const subjectArr = subjects.split(',');
  const questionArr = noOfQuestions.split(',');

  const subjectObjects = subjectArr.map((subject, index) => ({
    subject: subject.trim(),
    noOfQuestions: Number(questionArr[index])
  }));


  const mockTest = await MockTest.create({
    mockTestName,
    medium,
    className,
    duration: Number(duration),
    subjects: subjectObjects
  });

  return mockTest;
};

const getAllMockTests = async ()=>{
    return await MockTest.find();
};

module.exports = {
    createMockTest,
    getAllMockTests
};