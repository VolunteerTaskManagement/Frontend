import {
  VStack,
  Text,
  Box,
  Image,
  Input,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import InputBox from "../common/Inputbox";
import MainButton from "../common/MainButton";

import { getProfile, updateCoordinatorProfile } from "../../services/profileService";
import {
  IoTextOutline,
  IoFingerPrintOutline,
  IoPersonOutline,
  IoCameraOutline,
} from "react-icons/io5";

import {
  HiOutlineIdentification,
  HiOutlinePhone,
} from "react-icons/hi";

const CoordinatorProfileCard = () => {
  // const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalCode, setNationalCode] = useState("");

  const [profileImage, setProfileImage] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isDirty, setIsDirty] = useState(false);

  const [originalProfile, setOriginalProfile] = useState<any>(null);

  const [accessDenied, setAccessDenied] = useState(false);

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setProfileFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        if (!res.isSuccess) {
          return;
        }

        const p = res.value;

        const role = (p.role || "").toString().toLowerCase();
        const isCoordinator =
          role.includes("coordin") || 
          role.includes("هماهنگ") || 
          role === "coordinator" ||
          role === "1"; 


        if (!isCoordinator) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setFirstName(p.firstName ?? "");
        setLastName(p.lastName ?? "");
        setPhoneNumber(p.phoneNumber ?? "");
        setNationalCode(p.nationalCode ?? "");

        if (p.picUrl) {
          setProfileImage(
            `http://89.42.199.196:5213/api/MediaFiles/StramImg?FileUrl=${encodeURIComponent(
              p.picUrl
            )}`
          );
        }

        setOriginalProfile({
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          phoneNumber: p.phoneNumber ?? "",
          nationalCode: p.nationalCode ?? "",
          image: p.picUrl,
        });
      } catch (err) {
        console.error("Error loading coordinator profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!originalProfile) return;

    const changed =
      firstName !== originalProfile.firstName ||
      lastName !== originalProfile.lastName ||
      phoneNumber !== originalProfile.phoneNumber ||
      nationalCode !== originalProfile.nationalCode ||
      profileFile !== null;

    setIsDirty(changed);
  }, [firstName, lastName, phoneNumber, nationalCode, profileFile, originalProfile]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const updateRes = await updateCoordinatorProfile({
        firstName,
        lastName,
        phoneNumber,
        nationalCode,
        profilePic: profileFile,
      });

      if (!updateRes.isSuccess) {
        return;
      }


      // رفرش مجدد
      const res = await getProfile();

      if (res.isSuccess) {
        const p = res.value;

        setOriginalProfile({
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          phoneNumber: p.phoneNumber ?? "",
          nationalCode: p.nationalCode ?? "",
          image: p.picUrl,
        });

        setProfileFile(null);
        setIsDirty(false);
      }
    } catch (err: any) {
      console.error(err);
      console.error("Save error response:", err?.response?.data);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py="10">
        در حال دریافت اطلاعات...
      </Box>
    );
  }

  if (accessDenied) {
    return (
      <VStack
        w="full"
        gap="4"
        dir="rtl"
        align="center"
        py="16"
        px="6"
        textAlign="center"
      >
        <Box
          fontSize="5xl"
          color="red.500"
        >
          ⛔
        </Box>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="red.500"
        >
          دسترسی غیرمجاز
        </Text>
        <Text color="gray.600" maxW="md">
         شما به این صفحه دسترسی ندارید
        </Text>
        <MainButton
          text="بازگشت به صفحه اصلی"
          onClick={() => {
            window.location.href = "/";
          }}
          {...({
            mt: "4",
            bg: "gray.600",
            w: "auto",
            px: "8",
          } as any)}
        />
      </VStack>
    );
  }

  return (
    <VStack
      w="full"
      gap="5"
      dir="rtl"
      align="stretch"
      pt="2"
    >
      <Text
        textAlign="center"
        fontSize="2xl"
        fontWeight="bold"
        color="teal.500"
      >
        ویرایش اطلاعات 
      </Text>

      <VStack gap="2">
        <Box
          position="relative"
          w="110px"
          h="110px"
          mx="auto"
        >
          <Box
            w="110px"
            h="110px"
            borderRadius="full"
            bg="teal.500"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="profile"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            ) : (
              <IoPersonOutline
                size={54}
                color="white"
              />
            )}
          </Box>

          <Box
            position="absolute"
            bottom="0"
            right="0"
            w="34px"
            h="34px"
            borderRadius="full"
            bg="#F97316"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            border="2px solid white"
            onClick={handleOpenFilePicker}
          >
            <IoCameraOutline
              size={18}
              color="white"
            />
          </Box>

          <Input
            ref={fileInputRef}
            type="file"
            display="none"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Box>

        <Text
          fontSize="sm"
          color="gray.500"
          textAlign="center"
        >
          آپلود تصویر پروفایل
        </Text>
      </VStack>

      <InputBox
        label="نام"
        placeholder="نام"
        icon={IoTextOutline}
        value={firstName}
        onChange={setFirstName}
        readOnly
      />

      <InputBox
        label="نام خانوادگی"
        placeholder="نام خانوادگی"
        icon={HiOutlineIdentification}
        value={lastName}
        onChange={setLastName}
        readOnly
      />

      <InputBox
        label="شماره تلفن"
        placeholder="شماره تلفن"
        icon={HiOutlinePhone}
        value={phoneNumber}
        onChange={setPhoneNumber}
      />

      <InputBox
        label="کد ملی"
        placeholder="کد ملی"
        icon={IoFingerPrintOutline}
        value={nationalCode}
        onChange={setNationalCode}
      />

      <MainButton
        text={saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        onClick={handleSave}
        disabled={!isDirty || saving}
        {...({
          mt: "4",
          mb: "4",
          w: "50%",
          mx: "auto",
          bg: isDirty ? "#F97316" : "gray.400",
        } as any)}
      />
    </VStack>
  );
};

export default CoordinatorProfileCard;
