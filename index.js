// // https://docs.expo.dev/push-notifications/sending-notifications-custom/#payload-formats

/*
午前7時の時点でタスクを設定していないユーザーに一斉送信
*/

import axios from "axios";
import { GoogleAuth } from "google-auth-library";
import "dotenv/config";
import admin from "firebase-admin";
import serviceAccount from "./tutorial-3d280-firebase-adminsdk-rgpp9-35131f4eb6.json" assert { type: "json" };
import { constructNow } from "date-fns";

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
const getNotificationKey = async () => {
  const url = "https://fcm.googleapis.com/fcm/notification"; // FCM APIエンドポイント
  const message = {
    operation: "create", // デバイスグループの作成
    notification_key_name: "test", // グループ名（任意の識別名）
    registration_ids: [
      "fihUrH8PRxmuiOmXen5tRp:APA91bEGhgolijoD183ZDB0lLIOR0364qB7la2HmW-RbUYtrcjMMh6oJJ7QDsCZGtdR_IyS03EFFffNCU_g5x911PWCqhIsdQz0Bn7rWh9kU58I6La3yumk", // 1つ目のデバイストークン
      "dwDvIxPxStmxEjCcNWyvG1:APA91bF7L0NqhmfjWgH6Ff_o3tk_HWZWiuSI4O4Vf1VMKUHUdJEc0R8FmMet9YGA36PaUfaqrfZ-UpUREo2cGY0jJLldcP8f9D-7SWnm6mF_Eymm0js-XGg", // 2つ目のデバイストークン
    ],
  };
  try {
    const accessToken = await getAccessTokenAsync();
    const response = await axios.post(url, message, {
      headers: {
        "Content-Type": "application/json",
        access_token_auth: true,
        Authorization: `Bearer ${accessToken}`,
        project_id: "332801672964", // FirebaseのプロジェクトID
      },
    });
    console.log("notification_key:", response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};

// getNotificationKey();

// notification_key-'APA91bG6EiK2YDNigsmcc6stTPtxciN5ttGx1DtFTXCP2rAuA3T5v8jzcZMJaLVm7mEfpyt2jDoHUhcAAd70936e-nk0HoybAnenKn07PRj2WzjKbJinjC4'
// notification_key: {
//   notification_key: 'APA91bEkxzO6cmQCy3r5PM8NcVjU2IL-I6nctRtUaPYTv4d9f3Z-HqH5BXGYibOphRoJc4yEBUfCt6I6IkPsw-zfv38RknRKeVrrCVjSkIqvv-8n-riIoOM'
// }

// デバイスグループに通知を送信する
const sendNotificationDeviceGroup = async () => {
  const url =
    "https://fcm.googleapis.com/v1/projects/tutorial-3d280/messages:send"; // FCM APIエンドポイント
  const message = {
    message: {
      android: {
        priority: "high",
      },
      token:
        "APA91bEkxzO6cmQCy3r5PM8NcVjU2IL-I6nctRtUaPYTv4d9f3Z-HqH5BXGYibOphRoJc4yEBUfCt6I6IkPsw-zfv38RknRKeVrrCVjSkIqvv-8n-riIoOM",
      data: {
        hello: "This is a Firebase Cloud Messaging device group message!",
      },
    },
  };
  try {
    const accessToken = await getAccessTokenAsync();
    console.log("送信開始");
    const response = await axios.post(url, message, {
      headers: {
        access_token_auth: true,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        project_id: "332801672964", // FirebaseのプロジェクトID
      },
    });
    console.log("送信完了");
  } catch (error) {
    console.error("エラー");
  }
};

// sendNotificationDeviceGroup();

// const message = {
//   android: androidConfig,
//   notification: {
//     title: "お知らせ",
//     body: "新しいアップデートがあります！",
//   },
//   // tokens: tokens, // 複数トークンを指定
//   token:
//     "dwDvIxPxStmxEjCcNWyvG1:APA91bF7L0NqhmfjWgH6Ff_o3tk_HWZWiuSI4O4Vf1VMKUHUdJEc0R8FmMet9YGA36PaUfaqrfZ-UpUREo2cGY0jJLldcP8f9D-7SWnm6mF_Eymm0js-XGg",
// };

// const initializeApp = () => {
//   try {
//     console.log("Firebaseの初期化を開始します...");
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//     console.log("Firebaseの初期化に成功しました");
//   } catch (e) {
//     console.error("Firebase初期化エラー:", e);
//   }
// };

// const sendFCMv1Notification = async () => {
//   try {
//     console.log("通知の送信を開始します...");
//     const response = await admin.messaging().send(message);
//     console.log(`${response.successCount} 件の通知が成功しました`);
//     console.log(`${response.failureCount} 件が失敗しました`);
//   } catch (e) {
//     console.error("通知送信エラー:", e);
//   }
// };

// // initializeApp();
// // sendFCMv1Notification();
