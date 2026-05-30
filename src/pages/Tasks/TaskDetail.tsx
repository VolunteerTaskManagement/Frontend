import { useParams } from 'react-router-dom';
import MobileLayout from '../../layouts/MobileLayout';
import TaskDetailContent from '../../components/tasks/TaskDetailContent';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();

  return (
    <MobileLayout>
      <TaskDetailContent taskId={taskId ?? ''} />
    </MobileLayout>
  );
};

export default TaskDetail;
