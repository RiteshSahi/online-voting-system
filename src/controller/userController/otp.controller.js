import { transporter } from "../../config/mailer.js";

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();
    otpStore.set(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully!" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore.get(email) == otp) {
    otpStore.delete(email);
    return res.json({ message: "OTP verified!" });
  }

  res.status(400).json({ message: "Invalid OTP" });
};
