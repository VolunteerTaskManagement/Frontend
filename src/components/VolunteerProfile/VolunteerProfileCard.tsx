import {
  VStack,
  Text,
  Box,
  Wrap,
  WrapItem,
  Image,
  Input,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import InputBox from "../common/Inputbox";
import Dropdown from "../common/Dropdown";
import MainButton from "../common/MainButton";
import Calendar from "./Calender";
import SkillDropdown from "./SkillDropdown";

import { searchNeighborhoods } from "../../services/neighborhood";
import { getSkills } from "../../services/skillsDropdown";
import { getProfile, updateProfile } from "../../services/profileService";

import {
  IoTextOutline,
  IoPersonOutline,
  IoCameraOutline,
  IoClose,
} from "react-icons/io5";

import {
  HiOutlineIdentification,
  HiOutlinePhone,
} from "react-icons/hi";

// تابع کمکی برای نرمال‌سازی متن‌های فارسی/عربی (جهت مقایسه دقیق عنوان محله)
const normalizeText = (str?: string | null): string => {
  if (!str) return "";
  return str
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200C/g, " ")
    .replace(/\s+/g, " ");
};

const VolunteerProfileCard = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [profileImage, setProfileImage] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodTitle, setNeighborhoodTitle] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState<number>(0);

  const [abilities, setAbilities] = useState<string[]>([]);
  const [abilityIds, setAbilityIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isDirty, setIsDirty] = useState(false);

  const [originalProfile, setOriginalProfile] = useState<any>(null);

  const [neighborhoodOptions, setNeighborhoodOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const isoToCalendar = (iso?: string | null) => {
    if (!iso) return "";
    // استخراج مستقیم سال، ماه و روز از رشته (جلوگیری از تغییر روز و ماه به دلیل اختلاف ساعت محلی و UTC در جاوااسکریپت)
    const clean = iso.split("T")[0].replace(/-/g, "/");
    const parts = clean.split("/");
    if (parts.length === 3) {
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      const d = Number(parts[2]);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return `${y}/${m}/${d}`;
      }
    }
    return clean;
  };

  const calendarToIso = (date: string) => {
    if (!date) return "";
    const [y, m, d] = date.split("/");
    const yy = Number(y) || 1400;
    const mm = String(Number(m) || 1).padStart(2, "0");
    const dd = String(Number(d) || 1).padStart(2, "0");
    // ساخت رشته استاندارد ISO بدون استفاده از toISOString برای جلوگیری از جابجایی روز به عقب
    return `${yy}-${mm}-${dd}T00:00:00`;
  };

  const handleNeighborhoodSearch = useCallback(async (text: string) => {
    try {
      const res = await searchNeighborhoods(text);

      if (res.isSuccess) {
        setNeighborhoodOptions(
          res.value.map((item) => ({
            label: item.title,
            value: item.id.toString(),
          }))
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSkillSearch = useCallback(async (text: string) => {
    try {
      const res = await getSkills();

      if (res.isSuccess) {
        const filtered = res.value.filter((s) =>
          s.value.includes(text)
        );

        setSkillOptions(
          filtered.map((item) => ({
            label: item.value,
            value: item.key.toString(),
          }))
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addAbility = (value: string) => {
    if (!value) return;

    if (abilityIds.includes(Number(value))) return;

    const skill = skillOptions.find(
      (x) => x.value === value
    );

    if (!skill) return;

    setAbilityIds((prev) => [...prev, Number(value)]);
    setAbilities((prev) => [...prev, skill.label]);
  };

  const removeAbility = (label: string) => {
    const skill = skillOptions.find(
      (x) => x.label === label
    );

    if (!skill) return;

    setAbilities((prev) =>
      prev.filter((x) => x !== label)
    );

    setAbilityIds((prev) =>
      prev.filter((x) => x !== Number(skill.value))
    );
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileFile(file);

    setProfileImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    handleNeighborhoodSearch("");
    handleSkillSearch("");
  }, [handleNeighborhoodSearch, handleSkillSearch]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        if (!res.isSuccess) return;

        const p = res.value;

        setFirstName(p.firstName);
        setLastName(p.lastName);
        setPhoneNumber(p.phoneNumber ?? "");
        setBirthDate(isoToCalendar(p.birthDate));

        setAbilities(p.skillTitles);
        setAbilityIds(p.skills);

        // تنظیم محله (با نرمال‌سازی و جستجوی جامع)
        let resolvedId = p.neighborhoodId || 0;
        let resolvedTitle = p.neighborhoodTitle || "";

        try {
          // ۱. دریافت لیست کل محله‌ها برای دراپ‌داون و تطبیق دقیق
          let allItems: { id: number; title: string }[] = [];
          const allRes = await searchNeighborhoods("");
          if (allRes.isSuccess && allRes.value) {
            allItems = [...allRes.value];
          }

          // ۲. اگر لیست اولیه خالی بود یا عنوان در آن پیدا نشد، با خود عنوان جستجو می‌کنیم
          if (
            p.neighborhoodTitle &&
            !allItems.some(
              (i) => normalizeText(i.title) === normalizeText(p.neighborhoodTitle)
            )
          ) {
            const titleRes = await searchNeighborhoods(p.neighborhoodTitle);
            if (titleRes.isSuccess && titleRes.value) {
              const existingIds = new Set(allItems.map((i) => i.id));
              titleRes.value.forEach((item) => {
                if (!existingIds.has(item.id)) {
                  allItems.push(item);
                }
              });
            }
          }

          // به‌روزرسانی گزینه‌های دراپ‌داون
          if (allItems.length > 0) {
            setNeighborhoodOptions(
              allItems.map((item) => ({
                label: item.title,
                value: item.id.toString(),
              }))
            );
          }

          // ۳. پیدا کردن محله انتخاب شده بر اساس ID یا عنوان نرمال‌شده (رفع مشکل کاراکترهای عربی/فارسی و فاصله‌ها)
          let selected = null;
          if (p.neighborhoodId && p.neighborhoodId !== 0) {
            selected = allItems.find((item) => item.id === p.neighborhoodId);
          }

          if (!selected && p.neighborhoodTitle) {
            const normTitle = normalizeText(p.neighborhoodTitle);
            selected = allItems.find(
              (item) =>
                normalizeText(item.title) === normTitle ||
                normalizeText(item.title).includes(normTitle) ||
                normTitle.includes(normalizeText(item.title))
            );
          }

          if (selected) {
            resolvedId = selected.id;
            resolvedTitle = selected.title;
            setNeighborhood(selected.id.toString());
            setNeighborhoodId(selected.id);
            setNeighborhoodTitle(selected.title);
          } else {
            setNeighborhoodTitle(resolvedTitle);
          }
        } catch (err) {
          console.error("Error setting neighborhood:", err);
          setNeighborhoodTitle(resolvedTitle);
        }

        if (p.picUrl) {
          setProfileImage(
            `http://89.42.199.196:5213/api/MediaFiles/StramImg?FileUrl=${encodeURIComponent(
              p.picUrl
            )}`
          );
        }

        setOriginalProfile({
          firstName: p.firstName,
          lastName: p.lastName,
          phoneNumber: p.phoneNumber,
          birthDate: isoToCalendar(p.birthDate),
          skills: p.skills,
          neighborhoodId: resolvedId,
          neighborhoodTitle: resolvedTitle,
          image: p.picUrl,
        });
      } catch (err) {
        console.error("Error loading profile:", err);
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
      birthDate !== originalProfile.birthDate ||
      neighborhood !== originalProfile.neighborhoodId?.toString() ||
      JSON.stringify(abilityIds.sort()) !==
        JSON.stringify([...(originalProfile.skills || [])].sort()) ||
      profileFile !== null;

    setIsDirty(changed);
  }, [
    firstName,
    lastName,
    phoneNumber,
    birthDate,
    neighborhood,
    abilityIds,
    profileFile,
    originalProfile,
  ]);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfile({
        firstName,
        lastName,
        phoneNumber,
        birthDate: calendarToIso(birthDate),
        neighborhoodId,
        skills: abilityIds,
        profilePic: profileFile,
      });

      const res = await getProfile();

      if (res.isSuccess) {
        const p = res.value;

        // اگر سرور همچنان در ریسپانس GET آی‌دی محله را 0 برگرداند، از آخرین آی‌دی معتبر ست‌شده در state استفاده می‌کنیم
        const savedNeighborhoodId =
          p.neighborhoodId && p.neighborhoodId !== 0
            ? p.neighborhoodId
            : neighborhoodId;
        const savedNeighborhoodTitle =
          p.neighborhoodTitle || neighborhoodTitle;

        setOriginalProfile({
          firstName: p.firstName,
          lastName: p.lastName,
          phoneNumber: p.phoneNumber,
          birthDate: isoToCalendar(p.birthDate),
          skills: p.skills,
          neighborhoodId: savedNeighborhoodId,
          neighborhoodTitle: savedNeighborhoodTitle,
          image: p.picUrl,
        });

        setProfileFile(null);
        setIsDirty(false);
      }
    } catch (err) {
      console.error(err);
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
        placeholder=""
        icon={IoTextOutline}
        value={firstName}
        onChange={setFirstName}
        readOnly
      />

      <InputBox
        label="نام خانوادگی"
        placeholder=""
        icon={HiOutlineIdentification}
        value={lastName}
        onChange={setLastName}
        readOnly
      />

      <Calendar
        label="تاریخ تولد"
        value={birthDate}
        onChange={setBirthDate}
      />

      <Dropdown
        label="محله"
        placeholder="محله را انتخاب کنید"
        options={neighborhoodOptions}
        value={neighborhood}
        displayValue={neighborhoodTitle}
        onSearch={handleNeighborhoodSearch}
        onChange={(value) => {
          setNeighborhood(value);

          const selected = neighborhoodOptions.find(
            (x) => x.value === value
          );

          if (selected) {
            setNeighborhoodTitle(selected.label);
            setNeighborhoodId(Number(selected.value));
          }
        }}
      />

      <Box>
        <SkillDropdown
          label="مهارت ها"
          placeholder=" مهارت های خود را انتخاب کنید"
          options={skillOptions}
          onSearch={handleSkillSearch}
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
                  _hover={{
                    bg: "teal.100",
                  }}
                  onClick={() => removeAbility(item)}
                >
                  <IoClose size={16} />
                  <Text>{item}</Text>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Box>

      <InputBox
        label="شماره تلفن"
        placeholder="شماره تلفن"
        icon={HiOutlinePhone}
        value={phoneNumber}
        onChange={setPhoneNumber}
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

export default VolunteerProfileCard;
