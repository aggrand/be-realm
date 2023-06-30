import React, {useEffect, useState, useRef} from 'react';
import {useApp, useAuth, useQuery, useRealm, useUser} from '@realm/react';
import {Pressable, StyleSheet, Text, Platform} from 'react-native';

import {message} from './models/Task';
import {schedule} from './models/Schedule';
import {TaskManager} from './components/TaskManager';
import {buttonStyles} from './styles/button';
import {shadows} from './styles/shadows';
import colors from './styles/colors';
import {OfflineModeButton} from './components/OfflineModeButton';

import * as Device from 'expo-device';
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function schedulePushNotification(
  openTime: Date,
) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to BeRealm!",
      sound: 'default',
    },
    trigger: openTime,
  });
  console.log("notif id on scheduling",id)
  console.log("schedule time",openTime)
  return id;
}


async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  return token;
}

export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    null
  );
}

export const AppSync: React.FC = () => {
  const realm = useRealm();
  const user = useUser();
  const app = useApp();
  const {logOut} = useAuth();
  const [showMessages, setShowMessages] = useState(false);
  const scheduleObj = useQuery(
    schedule,
    collection =>
      collection.filtered("truepredicate").sorted("_id"),
  );

  const lastOpen = scheduleObj.length > 0 ? scheduleObj[0].lastOpen : undefined;
  const nextOpen = scheduleObj.length > 0 ? scheduleObj[0].nextOpen : undefined;

  const tasksQuery = useQuery(message);
  const tasks = tasksQuery.filtered(`openTime == $0`, lastOpen).sorted('createdAt')

  useEffect(() => {
    schedulePushNotification(nextOpen);
  }, [nextOpen]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      console.log("running useeffect")
      mutableSubs.removeAll();
      mutableSubs.add(tasks);
      mutableSubs.add(scheduleObj);
    });
  }, [realm, tasks, lastOpen, scheduleObj]);

  return (
    <>
      <TaskManager
        tasks={tasks}
        userID={user?.id}
        setShowMessages={setShowMessages}
        showMessages={showMessages}
      />
      <Pressable style={styles.authButton} onPress={logOut}>
        <Text
          style={styles.authButtonText}>{`Logout ${user?.profile.email}`}</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  idText: {
    color: '#999',
    paddingHorizontal: 20,
  },
  authButton: {
    ...buttonStyles.button,
    ...shadows,
    backgroundColor: colors.purpleDark,
  },
  authButtonText: {
    ...buttonStyles.text,
  },
});
