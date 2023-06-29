import React from 'react';
import Realm from 'realm';
import {View, Text, Pressable, StyleSheet} from 'react-native';

import {shadows} from '../styles/shadows';
import colors from '../styles/colors';
import {message} from '../models/Task';

type TaskItemProps = {
  task: message & Realm.Object;
};

export const TaskItem = React.memo<TaskItemProps>(
  ({task}) => {
    return (
      <View style={styles.task}>
        <Text style={styles.icon}>{'○'}</Text>
        <View style={styles.descriptionContainer}>
          <Text numberOfLines={1} style={styles.description}>
            {task.messageText}
          </Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  task: {
    height: 50,
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 5,
    ...shadows,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    paddingHorizontal: 10,
    color: colors.black,
    fontSize: 17,
  },
  icon: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
