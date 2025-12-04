import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY  // Note: secretKey, not apiKey
});

export default clerk;

export const syncNewUser = async (userData) => {
  console.log('Syncing new user:', userData.id);
  // Your DB logic here
};

export const syncUserUpdate = async (userData) => {
  console.log('Updating user:', userData.id);
  // Your DB update logic here
};
