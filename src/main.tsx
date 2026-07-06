import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { appSystem } from './theme/system'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from './utils/toaster'
import './index.css'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/Signup'
import Tasks from './pages/Tasks/Tasks'
import TaskDetail from './pages/Tasks/TaskDetail'
import VolunteerProfile from './pages/VolunteerProfile/VolunteerProfile'
import MyTasks from './pages/MyTasks/MyTasks';
import CoordinatorProfile from './pages/CoordinatorProfile/CoordinatorProfile'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={appSystem}>
     <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/volunteerprofile" element={<VolunteerProfile />} />
          <Route path="/coordinatorprofile" element={<CoordinatorProfile />} />
          <Route path="/mytasks" element={<MyTasks />} />
        </Routes>
      </BrowserRouter> 
      </AuthProvider>
      <Toaster />
    </ChakraProvider>
  </StrictMode>
)
