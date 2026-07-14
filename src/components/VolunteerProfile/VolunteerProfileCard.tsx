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
import { useProfileStore } from "../../stores/profileStore";
import { toaster } from "../../utils/toaster";

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

import { authStorage } from "../../services/authStorage";
import { toGregorian, toJalaali } from "jalaali-js";
import { toPersianDigits } from "../../utils/formatters";

const normalizeText = (str?: string | null): string => {
  if (!str) return "";
  return str
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200C/g, " ")
    .replace(/\s+/g, " ");
};

const normalizeDate = (date: string | null | undefined): string => {
  if (!date) return "";
  return date
    .toString()
    .trim()
    .replace(/[\\/]+/g, "/")
    .replace(/0*(\d+)/g, "$1")   
    .replace(/\s+/g, "");
};

const normalizeNeighId = (val: any): number => {
  const n = Number(val);
  return isNaN(n) || n <= 0 ? 0 : n;
};

  const VolunteerProfileCard = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setStoredProfile = useProfileStore((state) => state.setProfile);

  // JWT Protection: redirect to login if no token
  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [profileImage, setProfileImage] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodTitle, setNeighborhoodTitle] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState<number>(0);

  const [selectedSkills, setSelectedSkills] = useState<{ id: number; label: string }[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); 
  const ignoreDirtyUntil = useRef(0);

  useEffect(() => {
    if (hasLoaded) {
      setIsDirty(false);
      ignoreDirtyUntil.current = Date.now() + 0; 
    }
  }, [hasLoaded]);

  const [originalProfile, setOriginalProfile] = useState<any>(null);

  const [neighborhoodOptions, setNeighborhoodOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const isoToCalendar = (iso?: string | null) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "";

      const { jy, jm, jd } = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
      return `${jy}/${jm}/${jd}`;
    } catch {
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
    }
  };

  const calendarToIso = (date: string) => {
    if (!date) return "";
    const [jy, jm, jd] = date.split("/").map(Number);
    const { gy, gm, gd } = toGregorian(jy, jm, jd);
    return new Date(gy, gm - 1, gd, 12).toISOString();
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
    } catch (err: any) {
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
    } catch (err: any) {
    }
  }, []);

  const addSkill = (value: string) => {
    if (!value) return;

    const skillId = Number(value);
    if (selectedSkills.some((s) => s.id === skillId)) return;

    const skill = skillOptions.find(
      (x) => x.value === value
    );

    if (!skill) return;

    setSelectedSkills((prev) => [...prev, { id: skillId, label: skill.label }]);
  };

  const removeSkill = (label: string) => {
    setSelectedSkills((prev) =>
      prev.filter((s) => s.label !== label)
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
    toaster.create({
      title: "عکس انتخاب شد",
      description: "برای ذخیره عکس، دکمه ذخیره تغییرات را بزنید",
      type: "info",
    });
  };

  useEffect(() => {
    handleNeighborhoodSearch("");
    handleSkillSearch("");
  }, [handleNeighborhoodSearch, handleSkillSearch]);

  useEffect(() => {
    // JWT Protection - redirect if no token
    const token = authStorage.getAccessToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await getProfile();

        if (!res.isSuccess) return;

        const p = res.value;

        const role = (p.role || "").toString().toLowerCase();
        const isCoordinator =
          role.includes("coordin") || 
          role.includes("هماهنگ") || 
          role === "coordinator" ||
          role === "1";

        if (isCoordinator) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        const loadedFirstName = p.firstName || "";
        const loadedLastName = p.lastName || "";
        const loadedPhone = p.phoneNumber ?? "";
        const loadedBirth = isoToCalendar(p.birthDate);

        setFirstName(loadedFirstName);
        setLastName(loadedLastName);
        setPhoneNumber(loadedPhone);
        setBirthDate(loadedBirth);

        const initialSkills = (p.skills || []).map((id: number, index: number) => ({
          id: Number(id),
          label: (p.skillTitles && p.skillTitles[index]) || "",
        })).filter((s: any) => s.label);
        setSelectedSkills(initialSkills);

        let resolvedId = p.neighborhoodId || 0;
        let resolvedTitle = p.neighborhoodTitle || "";

        try {
          let allItems: { id: number; title: string }[] = [];
          const allRes = await searchNeighborhoods("");
          if (allRes.isSuccess && allRes.value) {
            allItems = [...allRes.value];
          }

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

          if (allItems.length > 0) {
            setNeighborhoodOptions(
              allItems.map((item) => ({
                label: item.title,
                value: item.id.toString(),
              }))
            );
          }

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
          }

          const finalNeighStr = resolvedId && resolvedId !== 0 ? resolvedId.toString() : "";
          setNeighborhood(finalNeighStr);
          setNeighborhoodId(resolvedId || 0);
          setNeighborhoodTitle(resolvedTitle || "");
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
          firstName: loadedFirstName,
          lastName: loadedLastName,
          phoneNumber: loadedPhone,
          birthDate: loadedBirth,
          skills: (p.skills || []).map((id: any) => Number(id)),
          neighborhoodId: resolvedId || 0,
          neighborhoodTitle: resolvedTitle || "",
          image: p.picUrl || null,
        });

        setStoredProfile(p);

        setProfileFile(null);
        setIsDirty(false);
        setTimeout(() => {
          setIsDirty(false);
          setHasLoaded(true);
        }, 50);

      } catch (err: any) {
        toaster.create({
          title: "خطا",
          description: err?.response?.data?.message || err?.message || "مشکلی در دریافت پروفایل پیش آمد",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!originalProfile || !hasLoaded || Date.now() < ignoreDirtyUntil.current) {
      setIsDirty(false);
      return;
    }

    const nameChanged =
      normalizeText(firstName) !== normalizeText(originalProfile.firstName) ||
      normalizeText(lastName) !== normalizeText(originalProfile.lastName);

    const currentPhone = (phoneNumber || "").trim();
    const origPhone = (originalProfile.phoneNumber || "").trim();
    const phoneChanged = currentPhone !== origPhone;

    const currentBirth = normalizeDate(birthDate);
    const origBirth = normalizeDate(originalProfile.birthDate);
    const birthChanged = currentBirth !== origBirth;

    const currentNeighNum = normalizeNeighId(neighborhood);
    const origNeighNum = normalizeNeighId(originalProfile.neighborhoodId);
    const neighChanged = currentNeighNum !== origNeighNum;

    const currentSkillIds = selectedSkills.map((s) => s.id).sort((a, b) => a - b);
    const originalSkillIds = [...(originalProfile.skills || [])]
      .map((id: any) => Number(id))
      .sort((a, b) => a - b);
    const skillsChanged =
      JSON.stringify(currentSkillIds) !== JSON.stringify(originalSkillIds);

    const imageChanged = profileFile !== null;

    const changed =
      nameChanged ||
      phoneChanged ||
      birthChanged ||
      neighChanged ||
      skillsChanged ||
      imageChanged;

    setIsDirty(changed);
  }, [
    firstName,
    lastName,
    phoneNumber,
    birthDate,
    neighborhood,
    selectedSkills,
    profileFile,
    originalProfile,
    hasLoaded,
  ]);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (profileFile) {
        toaster.create({
          title: "در حال آپلود عکس...",
          type: "info",
        });
      }

      await updateProfile({
        firstName,
        lastName,
        phoneNumber,
        birthDate: calendarToIso(birthDate),
        neighborhoodId,
        skills: selectedSkills.map((s) => s.id),
        profilePic: profileFile,
      });

      const res = await getProfile();

      if (res.isSuccess) {
        const p = res.value;

        const savedNeighborhoodId =
          p.neighborhoodId && p.neighborhoodId !== 0
            ? p.neighborhoodId
            : neighborhoodId;
        const savedNeighborhoodTitle =
          p.neighborhoodTitle || neighborhoodTitle;

        const freshBirth = isoToCalendar(p.birthDate);

        // Update skills from fresh response
        const savedSkills = (p.skills || []).map((id: number, index: number) => ({
          id: Number(id),
          label: (p.skillTitles && p.skillTitles[index]) || "",
        })).filter((s: any) => s.label);

        // Store EXACT fresh values as new original
        setOriginalProfile({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          phoneNumber: p.phoneNumber ?? "",
          birthDate: freshBirth,
          skills: (p.skills || []).map((id: any) => Number(id)),
          neighborhoodId: savedNeighborhoodId || 0,
          neighborhoodTitle: savedNeighborhoodTitle || "",
          image: p.picUrl || null,
        });

        // Sync ALL display states to exactly match what we just saved
        setFirstName(p.firstName || "");
        setLastName(p.lastName || "");
        setPhoneNumber(p.phoneNumber ?? "");
        setBirthDate(freshBirth);

        const finalNeighStr = savedNeighborhoodId && savedNeighborhoodId !== 0 
          ? savedNeighborhoodId.toString() 
          : "";
        setNeighborhood(finalNeighStr);
        setNeighborhoodId(savedNeighborhoodId || 0);
        setNeighborhoodTitle(savedNeighborhoodTitle || "");
        setSelectedSkills(savedSkills);

        setProfileFile(null);
        setIsDirty(false);
        setStoredProfile(p);

        toaster.create({
          title: "موفق",
          description: "اطلاعات با موفقیت ذخیره شد.",
          type: "success",
        });
      }
    } catch (err: any) {
      toaster.create({
        title: "خطا",
        description: err?.response?.data?.message || err?.message || "مشکلی در ذخیره اطلاعات پیش آمد",
        type: "error",
      });
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

      <Box opacity={0.6} pointerEvents="none" w="full" bg="gray.50" borderRadius="md">
        <InputBox
          label="نام"
          placeholder=""
          icon={IoTextOutline}
          value={firstName}
          onChange={setFirstName}
          readOnly
        />
      </Box>

      <Box opacity={0.6} pointerEvents="none" w="full" bg="gray.50" borderRadius="md">
        <InputBox
          label="نام خانوادگی"
          placeholder=""
          icon={HiOutlineIdentification}
          value={lastName}
          onChange={setLastName}
          readOnly
        />
      </Box>

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
          onChange={addSkill}
        />
        {selectedSkills.length > 0 && (
          <Wrap
            px="4"
            pt="3"
            gap="2"
          >
            {selectedSkills.map((skill) => (
              <WrapItem key={skill.id}>
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
                  onClick={() => removeSkill(skill.label)}
                >
                  <IoClose size={16} />
                  <Text>{skill.label}</Text>
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
        value={toPersianDigits(phoneNumber)}
        onChange={setPhoneNumber}
      />

      <MainButton
        text={saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        onClick={handleSave}
        disabled={!hasLoaded || !isDirty || saving}
        {...({
          mt: "4",
          mb: "4",
          w: "50%",
          mx: "auto",
          bg: (!hasLoaded || !isDirty) ? "gray.400" : "#F97316",
        } as any)}
      />
    </VStack>
  );
};

export default VolunteerProfileCard;