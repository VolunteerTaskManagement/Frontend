import { useAuth } from "../../contexts/AuthContext";
import VolunteerProfile from "./VolunteerProfile";
import CoordinatorProfile from "./CoordinatorProfile";

export default function ProfilePage() {
  const { user } = useAuth();

  if (user?.role === "Coordinator")
    return <CoordinatorProfile />;

  return <VolunteerProfile />;
}