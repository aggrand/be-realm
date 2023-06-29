import React from 'react';

import {Task} from './models/Task';
import {TaskManager} from './components/TaskManager';

import {useQuery} from '@realm/react';

export const AppNonSync = () => {
  const [showMessages, setShowMessages] = React.useState(false);
  const tasks = useQuery(
    Task,
    collection =>
      showMessages
        ? collection.sorted('createdAt')
        : collection.filtered('isComplete == false').sorted('createdAt'),
    [showMessages],
  );

  return (
    <TaskManager tasks={tasks} setShowMessages={setShowMessages} showMessages={showMessages} />
  );
};
