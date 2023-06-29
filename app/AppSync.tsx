import React, {useEffect, useState} from 'react';
import {useApp, useAuth, useQuery, useRealm, useUser} from '@realm/react';
import {Pressable, StyleSheet, Text} from 'react-native';

import {message} from './models/Task';
import {schedule} from './models/Schedule';
import {TaskManager} from './components/TaskManager';
import {buttonStyles} from './styles/button';
import {shadows} from './styles/shadows';
import colors from './styles/colors';
import {OfflineModeButton} from './components/OfflineModeButton';

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

  const lastOpen = scheduleObj.length > 0 ? scheduleObj[0].lastOpen : undefined

  console.log("new lastopen")
  console.log(lastOpen)
  const tasksQuery = useQuery(message);
  const tasks = tasksQuery.filtered(`openTime == $0`, lastOpen).sorted('createdAt')
  console.log(tasks)

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
      <Text style={styles.idText}>Syncing with app id: {app.id}</Text>
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
      <OfflineModeButton />
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
