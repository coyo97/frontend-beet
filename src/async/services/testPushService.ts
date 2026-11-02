
import {
  post,
} from "../api";

import {
  notificationRoutes,
} from "../routes/notificationRoutes";

import {
  getAuthToken,
} from "../../features/auth/storage/authToken";

export interface TestPushResult {
  devices: number;

  results: Array<{
    status: string;
    receiptId?: string;
    errorCode?: string;
    message?: string;
  }>;
}

export async function sendMyTestPush():
  Promise<TestPushResult> {

  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "NO_SESSION"
    );
  }

  return post<TestPushResult>(
    notificationRoutes.testPush,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );
}

