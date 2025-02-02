import JWT from "jsonwebtoken";

export const generateResetToken = async (email) => {
  try {
    const token = await JWT.sign({ email }, "process.env.JWT_SECRET", {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error generating reset token.");
  }
};
