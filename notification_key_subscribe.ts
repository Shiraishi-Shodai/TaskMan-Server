// // https://docs.expo.dev/push-notifications/sending-notifications-custom/#payload-formats

import {
  addFCMDeviceToken,
  createNotificationKey,
} from "./notification_controll";

/**
 * データベースにnotification_keyとFCMデバイストークンを登録する
 */

// 初ログイン時にnotification_keyを取得し、関連するデバイストークンをRealtime Databseに記録する
export const firstLoginNotificationSetting = async (
  user_id: string,
  FCMDeviceToken: string
) => {
  try {
    const notification_key = await createNotificationKey(
      user_id,
      FCMDeviceToken
    );
    await database()
      .ref(`notification_key/${user_id}/${notification_key}/${FCMDeviceToken}`)
      .set(true);

    console.log("notification_keyを登録しました");
  } catch (e) {
    console.error(e);
  }
};

// 2回目以降のログイン時の処理
export const sometimesLoginNotificationSetting = async (
  user_id: string,
  FCMDeviceToken: string
) => {
  try {
    // notification_keyは作成済みか？
    const notificationKeyRef = database().ref(`/notificatino_key/${user_id}`);
    const snapshot = await notificationKeyRef.once("value");

    // 作成済みでないならfirstLoginNotificationSettingを実行
    if (!snapshot.exists()) {
      console.log(
        "notificaation_keyが見つからなかったためfirstLogin処理を実行します"
      );
      firstLoginNotificationSetting(user_id, FCMDeviceToken);
      return;
    }

    // デバイストークンの追加処理
    const { notification_key, FCMDeviceTokens } = snapshot.val();

    if (FCMDeviceToken in FCMDeviceTokens) {
      // もし登録されていないデバイストークンであれば、追加登録する
      await addFCMDeviceToken(user_id, FCMDeviceToken, notification_key);

      // データベースにも追加登録
      await database()
        .ref(
          `notification_key/${user_id}/${notification_key}/${FCMDeviceToken}`
        )
        .set(true);
    }
  } catch (e: any) {
    console.log(e);
  }
};
