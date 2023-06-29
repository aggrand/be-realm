import React from 'react';

import {message} from './models/Task';
import {TaskManager} from './components/TaskManager';

import {useQuery} from '@realm/react';

export const AppNonSync = () => {
  const [showMessages, setShowMessages] = React.useState(false);
  const tasks = useQuery(
    message,
    collection =>
      showMessages
        ? collection.sorted('createdAt')
    // TODO: Figure this out
      : collection.filtered('messageText == "secret_backdoor_intentional_easter_egg"').sorted('createdAt'),
    [showMessages],
  );

  return (
    <TaskManager tasks={tasks} setShowMessages={setShowMessages} showMessages={showMessages} />
  );
};
