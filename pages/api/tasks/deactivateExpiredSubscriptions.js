import cron from 'node-cron';
import { connectToDatabase } from '../../../src/common/app/lib/mongodb';
import User from '../../../src/common/app/model/Users';

async function deactivateExpiredSubscriptions() {
  await connectToDatabase();

  const now = new Date();
  const users = await User.find({
    'subscription.isActive': true,
    'subscription.expiryDate': { $lte: now },
  });

  users.forEach(async (user) => {
    user.subscription.isActive = false;
    await user.save();
  });

  console.log('Expired subscriptions deactivated');
}

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', () => {
  deactivateExpiredSubscriptions();
});
