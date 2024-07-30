import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Admin from '../../src/common/app/model/Admin';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await connectToDatabase();

  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found' });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(200).json({ success: true, token });
}
