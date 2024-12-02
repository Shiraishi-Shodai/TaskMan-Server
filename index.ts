// // npx ts-node index.ts
// // https://docs.expo.dev/push-notifications/sending-notifications-custom/#payload-formats

const dotenv = require("dotenv").config();
// // FCM_SERVER_KEY: FCM秘密鍵ファイルへのパスを設定した環境変数
// // FCM_PROJECT_NAME: Firebase用のプロジェクトID
// // FCM_DEVICE_TOKEN: クライアントのデバイストークン

// const { GoogleAuth, JWT } = require("google-auth-library");

// // トークンを非同期で取得する関数
// async function getAccessTokenAsync(): Promise<string> {
//   try {
//     // FCMサーバーキー (GoogleサービスアカウントのJSONキー)
//     const key = require(process.env.FCM_SERVER_KEY!);

//     // Google APIクライアントのインスタンスを作成
//     const auth = new GoogleAuth({
//       credentials: key, // サービスアカウントのキー
//       scopes: ["https://www.googleapis.com/auth/firebase.messaging"], // 必要なスコープ
//     });
//     // サービスアカウントのキーを使って認証クライアントを作成
//     const client = await auth.getClient();

//     // アクセストークンを取得
//     const accessTokenResponse = await client.getAccessToken();

//     // アクセストークンを返す
//     return accessTokenResponse.token;
//   } catch (error) {
//     console.error("Error getting access token:", error);
//     throw new Error("Unable to obtain access token");
//   }
// }

// async function sendFCMv1Notification() {
//   const firebaseAccessToken = await getAccessTokenAsync();
//   const deviceToken = process.env.FCM_DEVICE_TOKEN;

//   const messageBody = {
//     message: {
//       token: deviceToken,
//       data: {
//         channelId: "default",
//         message: "Testing",
//         title: `This is an FCM notification message`,
//         body: JSON.stringify({ title: "bodyTitle", body: "bodyBody" }),
//         scopeKey: "@shota2/taskman",
//         experienceId: "@shota2/taskman",
//       },
//     },
//   };

//   const response = await fetch(
//     `https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_NAME}/messages:send`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${firebaseAccessToken}`,
//         Accept: "application/json",
//         "Accept-encoding": "gzip, deflate",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(messageBody),
//     }
//   );

//   const readResponse = (response: Response) => response.json();
//   const json = await readResponse(response);

//   console.log(`Response JSON: ${JSON.stringify(json, null, 2)}`);
// }

// sendFCMv1Notification();

import * as admin from "firebase-admin";

// サービスアカウントキー（Firebaseコンソールで取得）
const serviceAccount = require(process.env.FCM_SERVER_KEY!);
const tokens = [
  "dwDvIxPxStmxEjCcNWyvG1:APA91bF7L0NqhmfjWgH6Ff_o3tk_HWZWiuSI4O4Vf1VMKUHUdJEc0R8FmMet9YGA36PaUfaqrfZ-UpUREo2cGY0jJLldcP8f9D-7SWnm6mF_Eymm0js-XGg",
  "fihUrH8PRxmuiOmXen5tRp:APA91bEGhgolijoD183ZDB0lLIOR0364qB7la2HmW-RbUYtrcjMMh6oJJ7QDsCZGtdR_IyS03EFFffNCU_g5x911PWCqhIsdQz0Bn7rWh9kU58I6La3yumk",
];

const androidConfig: admin.messaging.AndroidConfig = {
  priority: "high",
};

const message = {
  android: androidConfig,
  notification: {
    title: "お知らせ",
    body: "新しいアップデートがあります！",
  },
  // tokens: tokens, // 複数トークンを指定
  token: process.env.FCM_DEVICE_TOKEN,
};

const initializeApp = () => {
  try {
    console.log("Firebaseの初期化を開始します...");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebaseの初期化に成功しました");
  } catch (e: any) {
    console.error("Firebase初期化エラー:", e);
  }
};

const sendFCMv1Notification = async () => {
  try {
    console.log("通知の送信を開始します...");
    const response = await admin.messaging().sendMulticast(message);
    console.log(`${response.successCount} 件の通知が成功しました`);
    console.log(`${response.failureCount} 件が失敗しました`);
  } catch (e: any) {
    console.error("通知送信エラー:", e);
  }
};

initializeApp();
sendFCMv1Notification();
