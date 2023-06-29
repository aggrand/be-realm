import React, {useCallback} from 'react';
import {View, StyleSheet, Switch, Text} from 'react-native';

import {message} from '../models/Task';
import {IntroText} from './IntroText';
import {AddTaskForm} from './AddTaskForm';
import TaskList from './TaskList';

import {useRealm} from '@realm/react';
import {shadows} from '../styles/shadows';

export const TaskManager: React.FC<{
  tasks: Realm.Results<message & Realm.Object>;
  userID?: string;
  setShowMessages: (showMessages: boolean) => void;
  showMessages: boolean;
}> = ({tasks, userID, setShowMessages, showMessages}) => {
  const realm = useRealm();

  const handleAddTask = useCallback(
    (messageText: string): void => {
      if (!messageText) {
        return;
      }

      // Everything in the function passed to "realm.write" is a transaction and will
      // hence succeed or fail together. A transcation is the smallest unit of transfer
      // in Realm so we want to be mindful of how much we put into one single transaction
      // and split them up if appropriate (more commonly seen server side). Since clients
      // may occasionally be online during short time spans we want to increase the probability
      // of sync participants to successfully sync everything in the transaction, otherwise
      // no changes propagate and the transaction needs to start over when connectivity allows.
      realm.write(() => {
        return realm.create("message", {
          messageText: messageText,
          userID: userID ?? 'SYNC_DISABLED',
        });
      });
      setShowMessages(true);
    },
    [realm, userID],
  );


  return (
    <>
      <View style={styles.content}>
        <AddTaskForm onSubmit={handleAddTask} />
        {tasks.length === 0 ? (
          <IntroText />
        ) : (
          <TaskList
            tasks={tasks}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  switchPanel: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    ...shadows,
  },
  switchPanelText: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
});
