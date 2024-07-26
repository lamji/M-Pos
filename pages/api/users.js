import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';
import authMiddleware from '../../utils/authMiddleware';

async function handler(req, res) {
  await connectToDatabase();

  const users = await User.find({});
  res.status(200).json({ success: true, users });
}

export default authMiddleware(handler);
