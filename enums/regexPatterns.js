module.exports = {
  EMAIL:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Minimum 8 characters, at least one letter and one number
  MOBILE: /^[6-9]\d{9}$/, // Indian mobile numbers starting with 6-9 and 10 digits total
};
