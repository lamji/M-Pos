import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';
import { decrypt } from '../../utils/cryptoUtils'; // Adjust the path as needed
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment variables

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectToDatabase();

    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    try {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or code' });
      }

      // Decrypt the stored subscription code
      const decryptedCode = decrypt(user.subscription.code);

      console.log('decryptedCode', decryptedCode);

      // Check if the provided code matches the decrypted code
      if (decryptedCode !== code) {
        return res.status(401).json({ success: false, message: 'Invalid email or code' });
      }

      // Check if subscription is active
      if (!user.subscription.isActive || user.subscription.expiryDate < new Date()) {
        return res
          .status(403)
          .json({ success: false, message: 'Subscription is inactive or expired' });
      }

      // Generate a token without expiration
      const token = jwt.sign({ email: user.email }, JWT_SECRET);

      // Return success with token
      res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
