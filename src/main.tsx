import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route,Navigate} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { appSystem } from './theme/system'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from './utils/toaster'
import './index.css'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/Signup'
import Tasks from './pages/Tasks/Tasks'
import TaskDetail from './pages/Tasks/TaskDetail'
import ProfilePage from './pages/Profile/ProfilePage'
import MyTasksPage from './pages/MyTasks/MyTasksPage'
import {ProtectedRoute,PublicOnlyRoute,} from "./routes/RouteGuards";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={appSystem}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* فقط کاربران بدون توکن به این مسیرها دسترسی دارند */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
            </Route>

            {/* تمام مسیرهای خصوصی سایت */}
            <Route element={<ProtectedRoute />}>
              {/* صفحه اصلی سایت */}
              <Route index element={<Tasks />} />

              <Route path="tasks" element={<Tasks />} />
              <Route
                path="tasks/:taskId"
                element={<TaskDetail />}
              />
              <Route
                path="profile"
                element={<ProfilePage />}
              />
              <Route
                path="myTasks"
                element={<MyTasksPage />}
              />

              {/* مسیرهای ناشناخته */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </ChakraProvider>
  </StrictMode>
)
