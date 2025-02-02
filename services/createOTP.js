export const createOTP = async () => {
  try {
    let otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  } catch (error) {
    console.log(error.message);
  }
};
