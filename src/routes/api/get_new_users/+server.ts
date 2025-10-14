import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
import { getUsers } from '$lib/server/firebase/firestore';
import { getUnprocessedUsers } from '$lib/server/community-archive-api';
import type { AccountInfo } from '$lib/types';

dotenv.config();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET({ request, url }) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return json({ success: false, error: 'Invalid admin password' });
  }

  try {
    const usersToProcess: AccountInfo[] = [];
    const reprocessDate = url.searchParams.get('reprocessDate');
    const processedUsers = await getUsers();
    usersToProcess.push(...await getUnprocessedUsers(processedUsers.map(user => user.userId)));
    if (reprocessDate) {
      const usersToReprocess = processedUsers
        .filter(user => user.createdAt.toDate() < new Date(reprocessDate))
        .map(user => ({
          accountId: user.userId,
          username: user.username,
          displayName: user.displayName ?? '',
        }));
      usersToProcess.push(...usersToReprocess);
    }
    return json({ success: true, usersToProcess });
  } catch (error) {
    return json({ success: false, error });
  }
}