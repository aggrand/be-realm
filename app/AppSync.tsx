import React, {useEffect, useState} from 'react';
import {useApp, useAuth, useQuery, useRealm, useUser} from '@realm/react';
import {Pressable, StyleSheet, Text} from 'react-native';

import {Task} from './models/Task';
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
  const tasks = useQuery(
    Task,
    collection =>
      showMessages
        ? collection.sorted('createdAt')
    // TODO: Figure this out
        : collection.filtered('userId == "-1"').sorted('createdAt'),
    [showMessages],
  );

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(tasks);
    });
  }, [realm, tasks]);

  return (
    <>
      <Text style={styles.idText}>Syncing with app id: {app.id}</Text>
      <TaskManager
        tasks={tasks}
        userId={user?.id}
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
