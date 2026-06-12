import {
  VStack,
  Text,
  Box,
  Wrap,
  WrapItem,
  Image,
  Input,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

import InputBox from "../common/Inputbox";
import Dropdown from "../common/Dropdown";
import MainButton from "../common/MainButton";
import Calendar from "./Calender";
import SkillDropdown from "./SkillDropdown";

import {
  IoTextOutline,
  IoPersonOutline,
  IoCameraOutline,
  IoClose,
} from "react-icons/io5";
import { HiOutlineIdentification, HiOutlinePhone } from "react-icons/hi";

const abilityOptions = [
  { label: "برنامه نویسی", value: "برنامه نویسی" },
  { label: "طراحی", value: "طراحی" },
  { label: "تولید محتوا", value: "تولید محتوا" },
  { label: "مدیریت پروژه", value: "مدیریت پروژه" },
];

const VolunteerProfileCard = () => {
  const [birthDate, setBirthDate] = useState("");
  const [abilities, setAbilities] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addAbility = (value: string) => {
    if (!value) return;

    if (!abilities.includes(value)) {
      setAbilities((prev) => [...prev, value]);
    }
  };

  const removeAbility = (value: string) => {
    setAbilities((prev) => prev.filter((item) => item !== value));
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

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
        <Box position="relative" w="110px" h="110px" mx="auto">
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
              <IoPersonOutline size={54} color="white" />
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
            boxShadow="0 2px 8px rgba(0,0,0,0.15)"
            border="2px solid white"
            onClick={handleOpenFilePicker}
          >
            <IoCameraOutline size={18} color="white" />
          </Box>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            display="none"
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
        placeholder="نام خود را وارد کنید"
        icon={IoTextOutline}
      />

      <InputBox
        label="نام خانوادگی"
        placeholder="نام خانوادگی خود را وارد کنید"
        icon={HiOutlineIdentification}
      />

      <Calendar
        label="تاریخ تولد"
        value={birthDate}
        onChange={setBirthDate}
      />

      <Dropdown
        label="محله"
        placeholder="محله خود را انتخاب کنید"
        options={[
          { label: "تهرانپارس", value: "1" },
          { label: "نارمک", value: "2" },
          { label: "پیروزی", value: "3" },
          { label: "تهرانسر", value: "4" },
        ]}
      />

      <Box>
          <SkillDropdown
            label="مهارت ها"
            placeholder="می‌توانید چند مهارت انتخاب کنید"
            options={abilityOptions}
            onChange={addAbility}
          />

        {abilities.length > 0 && (
          <Wrap
            px="4"
            pt="3"
            gap="2"
          >
            {abilities.map((item) => (
              <WrapItem key={item}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="1"
                  px="3"
                  py="1.5"
                  bg="teal.50"
                  color="teal.600"
                  borderRadius="full"
                  fontSize="sm"
                  cursor="pointer"
                  transition="0.2s"
                  _hover={{
                    bg: "teal.100",
                  }}
                  onClick={() => removeAbility(item)}
                >
                  <Box
                    as="span"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IoClose size={16} />
                  </Box>

                  <Text>{item}</Text>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Box>

      <InputBox
        label="شماره تلفن"
        placeholder="شماره تلفن خود را وارد کنید"
        icon={HiOutlinePhone}
      />

    <MainButton text="ذخیره تغییرات" {...({ mt: "4" , bg:"#F97316" , w:"50%"  ,mx:"auto" } as any)} />

    </VStack>
  );
};

export default VolunteerProfileCard;
