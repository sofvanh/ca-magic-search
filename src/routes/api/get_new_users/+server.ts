import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
import { getUsers } from '$lib/server/firebase/firestore';
import { getUnprocessedUsers } from '$lib/server/community-archive-api';


dotenv.config();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET({ request }) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return json({ success: false, error: 'Invalid admin password' });
  }

  try {
    const processedUserIds = await getUsers();
    const allnewUsers = await getUnprocessedUsers(processedUserIds.map(user => user.userId));
    const newUsers = allnewUsers.slice(0, 1);
    return json({ success: true, newUsers });
  } catch (error) {
    return json({ success: false, error: 'Error getting new users' });
  }
}