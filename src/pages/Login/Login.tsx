import MobileLayout from '../../layouts/MobileLayout';
import LoginCard from '../../components/Login/LoginCard';
import { Box } from '@chakra-ui/react';

const Login = () => {
  return (
    <MobileLayout>
      <Box display="flex" justifyContent="center" alignItems="center" h="100%" backgroundColor= " rgb(255, 255, 255)">
        <LoginCard />
      </Box>
    </MobileLayout>
  );
};

export default Login;
