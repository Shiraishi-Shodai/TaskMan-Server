import { db, app } from "./firebase.js";
import { ref, onValue, get } from "firebase/database";
import { deleteApp } from "firebase/app";

/*
午前7時の時点でタスクを設定していないユーザーに一斉送信
*/

// 今日のタスクを設定していないユーザーIDの一覧を取得
const getUsersWithoutTasksToday = async () => {
  // 今日の日付を取得
  const today: Date = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 月は0始まりなので+1
  const day = today.getDate();
  const usersWithoutTasks: string[] = [];

  try {
    // `users` を取得
    const userRef = ref(db, "users");
    let users;

    const usersSnapshot = await get(userRef);
    if (usersSnapshot.exists()) {
      users = usersSnapshot.val();
    } else {
      return usersWithoutTasks;
    }

    // `user_tasks` を取得
    const userTaskRef = ref(db, "user_tasks");
    let userTasks;

    const userTasksSnapshot = await get(userTaskRef);
    if (userTasksSnapshot.exists()) {
      userTasks = userTasksSnapshot.val();
    }

    // 全ユーザーを確認
    for (const [userId, userInfo] of Object.entries(users)) {
      const tasksForToday = userTasks[userId]?.[year]?.[month]?.[day];
      if (!tasksForToday || Object.keys(tasksForToday).length === 0) {
        usersWithoutTasks.push(userId);
      }
    }

    // 結果を出力
    console.log("今日タスクを設定していないユーザー:");
    console.log(usersWithoutTasks);

    // deleteApp(app).then(() => {
    //   console.log("Firebase App を終了しました");
    // });
    return usersWithoutTasks;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
};

// 今日のタスクを設定していないユーザーIDからnotification_keyの一覧を取得する
const getNotificationKey = async () => {
  const usersWithoutTasks = await getUsersWithoutTasksToday();
  const notificationKeys = [];
  const notificationKeyRef = ref(db, "notification_key");
  const notificationKeySnapshot = await get(notificationKeyRef);

  if (notificationKeySnapshot.exists()) {
    const response = notificationKeySnapshot.val();
    notificationKeys = Object.entries(response).filter(([key, value]) =>
      usersWithoutTasks.includes(key)
    );
  }
  return notificationKeys;
};
