import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';

export default async function handler(req, res) {
  await connectToDatabase();

  const { code, gcashRefNumber, amount, date } = req.body;

  const user = await User.findOne({ 'subscription.code': code });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const newExpiryDate = new Date(date);
  newExpiryDate.setDate(newExpiryDate.getDate() + 30); // Assuming 30 days renewal

  user.subscription.isActive = true;
  user.subscription.expiryDate = newExpiryDate;
  user.subscription.paymentHistory.push({ gcashRefNumber, amount, date });
  await user.save();

  res
    .status(200)
    .json({ success: true, message: 'Subscription renewed', expiryDate: newExpiryDate });
}
