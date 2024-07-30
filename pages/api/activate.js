import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';

export default async function handler(req, res) {
  await connectToDatabase();

  const { code } = req.body;

  const user = await User.findOne({ 'subscription.code': code });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const newExpiryDate = new Date();
  newExpiryDate.setDate(newExpiryDate.getDate() + 7);

  user.subscription.isActive = true;
  user.subscription.expiryDate = newExpiryDate;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: 'Subscription activated', expiryDate: newExpiryDate });
}
