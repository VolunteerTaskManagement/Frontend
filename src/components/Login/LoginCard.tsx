import {
  VStack,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";

import { useState } from "react";
import InputBox from "../common/Inputbox";
import PasswordBox from "../common/PasswordBox";
import MainButton from "../common/MainButton";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";

const LoginCard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    console.log("username:", username);
    console.log("password:", password);

    try {
      const res = await login(username, password);
      loginUser(
        {
          id: res.value.id,
          userName: res.value.userName,
          role: res.value.role,
          isProfileComplete: res.value.isProfileComplete,
        },
        {
          accessToken: res.value.accessToken,
          refreshToken: res.value.refreshToken,
        }
      );
      navigate("/tasks");
    } catch (err) {
      console.log("login error", err);
    }
  };

  return (
    <VStack gap="4" w="full" align="center" py="4">
      <Image
        src="/src/assets/images/logo.svg"
        boxSize="200px"
        alignSelf="center"
        mb="-4"
      />

      <Text fontSize="4xl" fontWeight="bold">
        خوش آمدید
      </Text>

      <Text
        fontSize="md"
        color="gray.400"
        textAlign="center"
        lineHeight="1.6"
      >
        .خوشحالیم که دوباره شما را می‌بینیم
        <br />
        .برای ادامه، وارد حساب کاربری خود شوید
      </Text>

      <InputBox
        label="نام کاربری"
        placeholder="نام کاربری خود را وارد کنید"
        icon={FiUser}
        value={username}
        onChange={(val: string) => setUsername(val)}
      />

      <PasswordBox
        label="رمز عبور"
        placeholder="رمز عبور خود را وارد کنید"
        value={password}
        onChange={(val: string) => setPassword(val)}
      />

      <MainButton
        text="ورود"
        onClick={handleLogin}
        {...({ mt: "4" } as any)}
      />
      <VStack w="full" align="center" gap="2" mt="2">
        <Text fontSize="md" fontWeight="bold" textAlign="center">
          حساب کاربری ندارید؟
        </Text>

        <Link
          color="orange.500"
          fontWeight="bold"
          _hover={{ textDecoration: "underline" }}
          textAlign="center"
          href="/signup"
        >
          ثبت نام کنید
        </Link>
      </VStack>
    </VStack>
  );
};

export default LoginCard;