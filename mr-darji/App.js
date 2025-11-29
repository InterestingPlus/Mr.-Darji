import AppNavigator from "./app/navigation/AppNavigator";
// import * as Notifications from "expo-notifications";
// import { registerForPushNotificationsAsync } from "./notificationService";
// import { useEffect } from "react";

// Notifications.setNotificationCategoryAsync("ORDER_ACTION", [
//   {
//     identifier: "VIEW_ORDER",
//     buttonTitle: "View Order",
//     options: { opensAppToForeground: true },
//   },
// ]);

// useEffect(() => {
//   (async () => {
//     const t = await registerForPushNotificationsAsync();
//     // backend ko token send kar dena
//     if (t) {
//       await fetch("http://your-backend.com/push/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: t, userId: "darji_bhai_id" }),
//       });
//     }
//   })();

//   // Foreground Listener
//   const sub = Notifications.addNotificationReceivedListener((n) => {
//     console.log("Foreground notification:", n);
//   });

//   const actionSub = Notifications.addNotificationResponseReceivedListener(
//     (res) => {
//       const data = res.notification.request.content.data;
//       if (res.actionIdentifier === "VIEW_ORDER") {
//         // navigate to order
//         navigation.navigate("OrderDetails", { orderId: data.orderId });
//       }
//     }
//   );

//   return () => {
//     sub.remove();
//     actionSub.remove();
//   };
// }, []);

export default function App() {
  return <AppNavigator />;
}
