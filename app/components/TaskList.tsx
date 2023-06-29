import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Realm} from '@realm/react';

import {message} from '../models/Task';
import {TaskItem} from './TaskItem';

type TaskListProps = {
  tasks: Realm.Results<message & Realm.Object>;
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
}) => {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={tasks}
        keyExtractor={message => message._id.toString()}
        renderItem={({item}) => (
          <TaskItem
            task={item}
            // Don't spread the Realm item as such: {...item}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default TaskList;
