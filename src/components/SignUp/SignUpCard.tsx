import { VStack, Text, Link } from "@chakra-ui/react";
import InputBox from "../common/Inputbox";
import PasswordBox from "../common/PasswordBox";
import MainButton from "../common/MainButton";
import Dropdown from "../common/Dropdown";

import { FiUser } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";
import { IoTextOutline } from "react-icons/io5";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/auth.service";
import { toaster } from "../../utils/toaster";


const SignUpCard = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !userName || !password || !confirmPassword) {
      toaster.create({
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
        type: "warning",
      });
      return;
    }

    if (password !== confirmPassword) {
      toaster.create({
        title: "خطا",
        description: "رمز عبور و تکرار آن با هم مطابقت ندارند",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userName,
        firstName,
        lastName,
        role: Number(role), 
        password,
        confirmedPassword: confirmPassword,
      };

      console.log("REGISTER PAYLOAD:", payload);

      await register(payload);

      toaster.create({
        title: "ثبت‌نام موفقیت‌آمیز",
        description: "حساب کاربری شما با موفقیت ایجاد شد",
        type: "success",
      });

      navigate("/login");
    } catch (err: any) {
      console.log("register error", err);
      toaster.create({
        title: "خطا در ثبت‌نام",
        description: err?.response?.data?.message || err?.message || "مشکلی پیش آمد، لطفاً دوباره تلاش کنید",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <VStack gap="4" width="full" maxW="400px" pt="4" dir="rtl">
      <Text fontSize="lg" fontWeight="bold">
        برای شروع اطلاعات زیر را وارد کنید
      </Text>

      <InputBox
        label="نام"
        placeholder="نام خود را وارد کنید"
        icon={IoTextOutline}
        value={firstName}
        onChange={setFirstName}
      />

      <InputBox
        label="نام خانوادگی"
        placeholder="نام خانوادگی خود را وارد کنید"
        icon={HiOutlineIdentification}
        value={lastName}
        onChange={setLastName}
      />

      <Dropdown
        label="نقش"
        placeholder="نقش خود را انتخاب کنید"
        value={role.toString()}
        onChange={(val) => setRole(Number(val))} 
        options={[          
          { label: "هماهنگ کننده", value: "1" },
          { label: "داوطلب", value: "2" },
        ]}
      />

      <InputBox
        label="نام کاربری"
        placeholder="نام کاربری را وارد کنید"
        icon={FiUser}
        value={userName}
        onChange={setUserName}
      />

      <PasswordBox
        label="رمز عبور"
        placeholder="رمز عبور را وارد کنید"
        value={password}
        onChange={setPassword}
      />

      <PasswordBox
        label="تکرار رمز عبور"
        placeholder="تکرار رمز عبور"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      <MainButton 
        text={loading ? "در حال ثبت‌نام..." : "ثبت‌نام"} 
        onClick={handleRegister} 
        disabled={loading}
        {...({ mt: "4" } as any)} 
      />

      <VStack w="full" align="center" gap="2" mt="2">
        <Text fontSize="md" fontWeight="bold" textAlign="center">
          از قبل حساب دارید؟
        </Text>

        <Link
          color="orange.500"
          fontWeight="bold"
          _hover={{ textDecoration: "underline" }}
          textAlign="center"
          href="/login"
        >
          وارد شوید
        </Link>
      </VStack>
    </VStack>
  );
};

export default SignUpCard;