import { transporter } from "../../config/mailer.js";

const otpStore = new Map();

// ✅ store verified emails temporarily
export const verifiedEmails = new Set();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // optional: college email restriction
    if (!email.endsWith("@khwopa.edu.np")) {
      return res.status(400).json({
        message: "Only Khwopa college emails allowed"
      });
    }

    const otp = generateOTP();
    otpStore.set(email, otp);

    console.log("OTP:", otp); // debug

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

  const storedOTP = otpStore.get(email);

  if (!storedOTP) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (storedOTP == otp) {
    otpStore.delete(email);

    // ✅ mark email verified
    verifiedEmails.add(email);

    return res.json({ message: "OTP verified!" });
  }

  res.status(400).json({ message: "Invalid OTP" });
};
