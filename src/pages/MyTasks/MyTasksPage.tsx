import { useAuth } from "../../contexts/AuthContext";
import VolunteerTasks from "./VolunteerTasks";
import CoordinatorTasks from "./CoordinatorTasks";

export default function MyTasksPage() {
  const { user } = useAuth();

  if (user?.role === "Coordinator")
    return <CoordinatorTasks />;

  return <VolunteerTasks />;
}