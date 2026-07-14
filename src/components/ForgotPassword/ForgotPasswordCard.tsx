import {
  VStack,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import InputBox from "../common/Inputbox";
import PasswordBox from "../common/PasswordBox";
import MainButton from "../common/MainButton";
import {
  forgotPassword,
  ChangeForgotPassword,
} from "../../services/auth.service";
import { toaster } from "../../utils/toaster";
import logo from "../../assets/images/logo.svg";
import { FiUser } from "react-icons/fi";

type Step = "username" | "code" | "password" | "success";

const CODE_DURATION_SECONDS = 60;

const ForgotPasswordCard = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("username");
  const [userName, setUserName] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] =
    useState("");
  const [loading, setLoading] = useState(false);

  const [remainingSeconds, setRemainingSeconds] =
    useState(CODE_DURATION_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    if (step !== "code") {
      return;
    }

    setRemainingSeconds(CODE_DURATION_SECONDS);
    setCanResend(false);

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(intervalId);
          setCanResend(true);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [step, timerKey]);

  const formattedTime = `${String(
    Math.floor(remainingSeconds / 60)
  ).padStart(2, "0")}:${String(
    remainingSeconds % 60
  ).padStart(2, "0")}`;

  const handleUsernameSubmit = async () => {
    if (!userName.trim()) {
      toaster.create({
        title: "خطا",
        description: "لطفاً نام کاربری را وارد کنید",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(
        userName.trim()
      );

      if (!response.isSuccess) {
        throw new Error(
          response.message ||
            response.error?.message ||
            "ارسال درخواست ناموفق بود"
        );
      }

      toaster.create({
        title: "کد ارسال شد",
        description: "کد بازیابی برای شما ارسال شده است",
        type: "success",
      });

      setCode("");
      setTimerKey((currentKey) => currentKey + 1);
      setStep("code");
    } catch (error: any) {
      toaster.create({
        title: "خطا",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "مشکلی پیش آمد",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const numericCode = value
      .replace(/\D/g, "")
      .slice(0, 4);

    setCode(numericCode);

    // The code step is mocked, but it is not submitted automatically.
  };

  const handleVerifyCode = () => {
    if (canResend) {
      return;
    }

    if (code.length !== 4) {
      toaster.create({
        title: "خطا",
        description: "لطفاً کد ۴ رقمی را وارد کنید",
        type: "warning",
      });
      return;
    }

    // No API is required for code verification.
    setStep("password");
  };

  const handleResendCode = async () => {
    if (!canResend || !userName.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(
        userName.trim()
      );

      if (!response.isSuccess) {
        throw new Error(
          response.message ||
            response.error?.message ||
            "ارسال دوباره کد ناموفق بود"
        );
      }

      setCode("");
      setTimerKey((currentKey) => currentKey + 1);

      toaster.create({
        title: "کد دوباره ارسال شد",
        description: "۶۰ ثانیه برای واردکردن کد فرصت دارید",
        type: "success",
      });
    } catch (error: any) {
      toaster.create({
        title: "خطا",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "ارسال دوباره کد انجام نشد",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || !confirmedPassword) {
      toaster.create({
        title: "خطا",
        description:
          "لطفاً رمز جدید و تکرار آن را وارد کنید",
        type: "warning",
      });
      return;
    }

    if (newPassword !== confirmedPassword) {
      toaster.create({
        title: "خطا",
        description: "رمز عبور و تکرار آن یکسان نیستند",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await ChangeForgotPassword({
        userName: userName.trim(),
        newPassword,
        confirmedNewPassword: confirmedPassword,
      });

      if (!response.isSuccess) {
        throw new Error(
          response.message ||
            response.error?.message ||
            "تغییر رمز عبور ناموفق بود"
        );
      }

      setStep("success");

      toaster.create({
        title: "موفق",
        description: "رمز عبور با موفقیت تغییر کرد",
        type: "success",
      });
    } catch (error: any) {
      toaster.create({
        title: "خطا در تغییر رمز",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "تغییر رمز عبور انجام نشد",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack
      gap="4"
      w="full"
      align="center"
      py="4"
      dir="rtl"
    >
      <Image
        src={logo}
        boxSize="200px"
        alignSelf="center"
        mb="-4"
      />

      <Text fontSize="4xl" fontWeight="bold">
        بازیابی رمز عبور
      </Text>

      {step === "username" && (
        <>
          <Text
            fontSize="md"
            color="gray.400"
            textAlign="center"
            lineHeight="1.7"
          >
            لطفا نام کاربری خود را وارد کنید
          </Text>

          <InputBox
            label="نام کاربری"
            placeholder="نام کاربری خود را وارد کنید"
            value={userName}
            onChange={(value: string) => setUserName(value)}
            icon={FiUser}
          />

          <MainButton
            text={loading ? "در حال ارسال..." : "ادامه"}
            onClick={handleUsernameSubmit}
            disabled={loading}
            {...({ mt: "4" } as any)}
          />
        </>
      )}

      {step === "code" && (
        <>
          <Text
            fontSize="md"
            color="gray.400"
            textAlign="center"
            lineHeight="1.7"
          >
            کد ۴ رقمی ارسال شده را وارد کنید
          </Text>

          <Text
            fontSize="lg"
            fontWeight="bold"
            color={canResend ? "red.500" : "orange.500"}
            dir="ltr"
          >
            {canResend
              ? "زمان به پایان رسید"
              : formattedTime}
          </Text>

          <InputBox
            label="کد تأیید"
            placeholder="کد ۴ رقمی را وارد کنید"
            value={code}
            readOnly={canResend || loading}
            onChange={handleCodeChange}
          />

          {!canResend && (
            <MainButton
              text="تأیید کد"
              onClick={handleVerifyCode}
              disabled={loading}
              {...({ mt: "4" } as any)}
            />
          )}

          {canResend && (
            <VStack gap="2" w="full">
              <Text
                fontSize="sm"
                color="gray.500"
                textAlign="center"
              >
                برای دریافت کد جدید، روی گزینه زیر بزنید
              </Text>

              <MainButton
                text={
                  loading
                    ? "در حال ارسال..."
                    : "ارسال دوباره"
                }
                onClick={handleResendCode}
                disabled={loading}
                {...({ mt: "2" } as any)}
              />
            </VStack>
          )}
        </>
      )}

      {step === "password" && (
        <>
          <Text
            fontSize="md"
            color="gray.400"
            textAlign="center"
            lineHeight="1.7"
          >
            رمز عبور جدید خود را وارد کنید
          </Text>

          <PasswordBox
            label="رمز عبور جدید"
            placeholder="رمز عبور جدید را وارد کنید"
            value={newPassword}
            onChange={(value: string) =>
              setNewPassword(value)
            }
          />

          <PasswordBox
            label="تکرار رمز عبور جدید"
            placeholder="رمز عبور جدید را وارد کنید"
            value={confirmedPassword}
            onChange={(value: string) =>
              setConfirmedPassword(value)
            }
          />

          <MainButton
            text={
              loading ? "در حال تغییر..." : "تغییر رمز عبور"
            }
            onClick={handlePasswordSubmit}
            disabled={loading}
            {...({ mt: "4" } as any)}
          />
        </>
      )}

      {step === "success" && (
        <>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="green.500"
            textAlign="center"
          >
            رمز عبور با موفقیت تغییر کرد
          </Text>

          <Text
            fontSize="md"
            color="gray.400"
            textAlign="center"
            lineHeight="1.7"
          >
            اکنون می‌توانید با رمز عبور جدید
            <br />
            وارد حساب خود شوید
          </Text>

          <MainButton
            text="بازگشت به ورود"
            onClick={() => navigate("/login")}
            {...({ mt: "4", w: "50%" } as any)}
          />
        </>
      )}

      {step !== "success" && (
        <Link
          asChild
          color="orange.500"
          fontWeight="bold"
          mt="2"
        >
          <RouterLink to="/login">
            بازگشت به صفحه ورود
          </RouterLink>
        </Link>
      )}
    </VStack>
  );
};

export default ForgotPasswordCard;
