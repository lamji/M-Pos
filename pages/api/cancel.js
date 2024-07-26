import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';

export default async function handler(req, res) {
  await connectToDatabase();

  const { code } = req.body;

  const user = await User.findOne({ 'subscription.code': code });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.subscription.isActive = false;
  user.subscription.expiryDate = null;
  await user.save();

  res.status(200).json({ success: true, message: 'Subscription cancelled' });
}
