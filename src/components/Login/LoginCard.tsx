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
import { useTaskFiltersStore } from "../../stores/taskFiltersStore";
import { toaster } from "../../utils/toaster";
import logo from "../../assets/images/logo.svg"

const LoginCard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const initFromProfile = useTaskFiltersStore((state) => state.initFromProfile);
  
  const handleLogin = async () => {
    if (!username || !password) {
      toaster.create({
        title: "خطا",
        description: "لطفا نام کاربری و رمز عبور را وارد کنید",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await login(username, password);
      loginUser(
        {
          id: res.value.id,
          userName: res.value.userName,
          role: res.value.role,
          isProfileComplete: res.value.isProfileComplete,
          neighborhoodId: res.value.neighborhoodId ?? null,
          skills: res.value.skills ?? [],
        },
        {
          accessToken: res.value.accessToken,
          refreshToken: res.value.refreshToken,
        }
      );
      
      initFromProfile(res.value.skills ?? [], res.value.neighborhoodId ?? null);
      
      toaster.create({
        title: "ورود موفق",
        description: "با موفقیت وارد شدید",
        type: "success",
      });

      navigate("/tasks");
    } catch (err: any) {
      console.log("login error", err);
      toaster.create({
        title: "خطا در ورود",
        description: err?.response?.data?.message || err?.message || "نام کاربری یا رمز عبور اشتباه است",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack gap="4" w="full" align="center" py="4">
      <Image
        src={logo}
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
        text={loading ? "...در حال ورود" : "ورود"}
        onClick={handleLogin}
        disabled={loading}
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