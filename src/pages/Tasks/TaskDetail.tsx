import { useParams } from 'react-router-dom';
import MobileLayout from '../../layouts/MobileLayout';
import TaskDetailContent from '../../components/tasks/TaskDetailContent';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const numericTaskId = Number(taskId);

  return (
    <MobileLayout>
      <TaskDetailContent taskId={Number.isNaN(numericTaskId) ? -1 : numericTaskId} />
    </MobileLayout>
  );
};

export default TaskDetail;