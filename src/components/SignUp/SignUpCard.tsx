import { VStack, Text, Link } from "@chakra-ui/react";
import InputBox from "../common/Inputbox";
import PasswordBox from "../common/PasswordBox";
import MainButton from "../common/MainButton";
import Dropdown from "../common/Dropdown";

import { FiUser } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";
import { IoTextOutline } from "react-icons/io5";

import { useState } from "react";

const SignUpCard = () => {

  const [role, setRole] = useState("");

  return (
    <VStack gap="4" width="full" maxW="400px" pt="4" dir="rtl">
      <Text fontSize="lg" fontWeight="bold">
        برای شروع اطلاعات زیر را وارد کنید
      </Text>

      <InputBox
        label="نام"
        placeholder="نام خود را وارد کنید"
        icon={IoTextOutline}
      />

      <InputBox
        label="نام خانوادگی"
        placeholder="نام خانوادگی خود را وارد کنید"
        icon={HiOutlineIdentification}
      />

      <Dropdown
        label="نقش"
        placeholder="نقش خود را انتخاب کنید"
        value={role}
        onChange={setRole}
        options={[
          { label: "کارفرما", value: "employer" },
          { label: "حمال", value: "hamal" },
        ]}
      />

      <InputBox
        label="نام کاربری"
        placeholder="نام کاربری را وارد کنید"
        icon={FiUser}
      />

      <PasswordBox
        label="رمز عبور"
        placeholder="رمز عبور را وارد کنید"
      />

      <PasswordBox
        label="تکرار رمز عبور"
        placeholder="تکرار رمز عبور را وارد کنید"
      />

      <MainButton text="ثبت‌نام" {...({ mt: "4" } as any)} />

      <VStack
        w="full"
        align="center"
        gap="2"
        mt="2"
      >
        <Text
          fontSize="md"
          fontWeight="bold"
          textAlign="center"
        >
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