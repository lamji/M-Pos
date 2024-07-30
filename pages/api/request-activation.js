import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';
import { encrypt } from '../../utils/cryptoUtils'; // Adjust the path as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { code, email } = req.body;

      // Validate request body
      if (!code || !email) {
        return res.status(400).json({ success: false, message: 'Code and email are required' });
      }

      // Encrypt the code
      const encryptedCode = encrypt(code);

      // Create a new user
      const user = new User({
        email,
        subscription: {
          code: encryptedCode,
          isActive: true,
          expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      });

      await user.save();
      console.log(user);

      res.status(201).json({
        success: true,
        message: 'User created and 7-day trial activated',
        expiryDate: user.subscription.expiryDate,
      });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
