import axios from "axios";
import serviceAccount from "./tutorial-3d280-firebase-adminsdk-rgpp9-35131f4eb6.json";
import { GoogleAuth } from "google-auth-library";

/**
 APIにアクセスし、notification_keyの作成やデバイストークンの追加を行う
 */

// アクセストークンを非同期で取得する関数
async function getAccessTokenAsync() {
  try {
    // Google APIクライアントのインスタンスを作成
    const auth = new GoogleAuth({
      credentials: serviceAccount, // サービスアカウントのキー
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"], // 必要なスコープ
    });
    // サービスアカウントのキーを使って認証クライアントを作成
    const client = await auth.getClient();

    // アクセストークンを取得
    const accessTokenResponse = await client.getAccessToken();
    console.log(accessTokenResponse.token);
    // アクセストークンを返す
    return accessTokenResponse.token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Unable to obtain access token");
  }
}

// グループデバイスを作るためのnotification_keyを取得する
export const createNotificationKey = async (
  user_id: string,
  FCMDeviceToken: string
) => {
  const url = "https://fcm.googleapis.com/fcm/notification"; // FCM APIエンドポイント
  const message = {
    operation: "create", // デバイスグループの作成
    notification_key_name: user_id, // グループ名（任意の識別名）
    registration_ids: [FCMDeviceToken],
  };
  try {
    const accessToken = getAccessTokenAsync();
    const response = await axios.post(url, message, {
      headers: {
        "Content-Type": "application/json",
        access_token_auth: true,
        Authorization: `Bearer ${accessToken}`,
        project_id: "332801672964", // FirebaseのプロジェクトID
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
  }
};

export const addFCMDeviceToken = async (
  user_id: string,
  FCMDeviceToken: string,
  notificatino_key: string
) => {
  const url = "https://fcm.googleapis.com/fcm/notification"; // FCM APIエンドポイント
  const message = {
    operation: "add", // デバイスグループの作成
    notification_key_name: user_id, // グループ名（任意の識別名）
    notificatino_key: notificatino_key,
    registration_ids: [FCMDeviceToken],
  };
  try {
    const accessToken = getAccessTokenAsync();
    const response = await axios.post(url, message, {
      headers: {
        "Content-Type": "application/json",
        access_token_auth: true,
        Authorization: `Bearer ${accessToken}`,
        project_id: "332801672964", // FirebaseのプロジェクトID
      },
    });
    console.log("notification_key:", response.data);
  } catch (error: any) {
    console.error(error.response.data);
  }
};
