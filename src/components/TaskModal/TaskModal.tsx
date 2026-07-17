import {
  Dialog,
  Portal,
  Button,
  VStack,
  Textarea,
  Box,
  Text,
  IconButton,
  NumberInput,
  FileUpload,
  Icon,
  Field,
  Wrap,
  WrapItem,
  Image,
} from "@chakra-ui/react";

import { useState, useEffect, useCallback, useMemo } from "react";
import { LuUpload, LuX } from "react-icons/lu";
import { toGregorian } from "jalaali-js";
import Dropdown from "../common/Dropdown";
import InputBox from "../common/Inputbox";
import Calendar from "../VolunteerProfile/Calender";
import NeshanMap from "../common/Map";
import { toaster } from "../../utils/toaster";
import { toEnglishDigits, toPersianDigits } from "../../utils/formatters";
import { useTaskImage } from "../../hooks/useTaskImage";
import { searchNeighborhoods } from "../../services/neighborhood";
import { getSkills } from "../../services/skillsDropdown";
import SkillDropdown from "../VolunteerProfile/SkillDropdown";
import { createTask } from "../../services/createTaskService";
import { updateTask } from "../../services/updateTaskService";
import { ReverseGeocode } from "../../services/reverseGeocodingService";
import type { MapLocation } from "../../types/map";


interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  initialData?: TaskFormData;
}

interface TaskFormData {
  id: number;
  picUrl?: string;
  title: string;
  description: string;
  startDateFa: string;
  neighborhoodTitle: string;
  address: string;
  skills: number[];
  skillTitles: string[];
  count: number;
  lat: number;
  lng: number;
}

export default function TaskModal({open, onClose, onSuccess, mode, initialData}: TaskModalProps)
{
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [skillIds, setSkillIds] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [peopleCount, setPeopleCount] = useState("1");
  const [neighborhoodOptions, setNeighborhoodOptions] = useState< {label: string; value: string}[] >([]);
  const [skillOptions, setSkillOptions] = useState< {label: string; value: string}[] >([]);
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [zoom, setZoom] = useState(9);
  const [imageRemoved, setImageRemoved] = useState(false);
  const { imageSrc } = useTaskImage(initialData?.picUrl);

  const handleSubmit = async () => {
    if (mode === "create" && !image) {
      toaster.create({
        type: "warning",
        title: "عکس فعالیت را انتخاب کنید.",
        meta: { closable: true },
      });
      return;
    }
    if (!title.trim()) {
      toaster.create({
        type: "warning",
        title: "عنوان فعالیت را وارد کنید.",
        meta: { closable: true },
      });
      return;
    }
    if (!description.trim()) {
      toaster.create({
        type: "warning",
        title: "توضیحات فعالیت را وارد کنید.",
        meta: { closable: true },
      });
      return;
    }
    const [year, month, day] = startDate.split("/");
    if (!year || !month || !day) {
      toaster.create({
        type: "warning",
        title: "تاریخ شروع فعالیت را به طور کامل انتخاب کنید.",
        meta: { closable: true },
      });
      return;
    }
    if (!neighborhood) {
      toaster.create({
        type: "warning",
        title: "محله را انتخاب کنید.",
        meta: { closable: true },
      });
      return;
    }
    if (!location) {
      toaster.create({
        type: "warning",
        title: "موقعیت فعالیت را روی نقشه انتخاب کنید.",
        meta: { closable: true },
      });
      return;
    }
    if (!address.trim()) {
      toaster.create({
        type: "warning",
        title: "آدرس را وارد کنید.",
        meta: { closable: true },
      });
      return;
    }
    if (skillIds.length === 0) {
      toaster.create({
        type: "warning",
        title: "حداقل یک مهارت انتخاب کنید.",
        meta: { closable: true },
      });
      return;
    }
    if (Number(toEnglishDigits(peopleCount)) < 1) {
      toaster.create({
        type: "warning",
        title: "تعداد افراد باید حداقل ۱ نفر باشد.",
        meta: { closable: true },
      });
      return;
    }

    try {
      toaster.create({
        id: "create-task",
        type: "loading",
        title: mode === "create" ? "در حال ایجاد فعالیت..." : "در حال ویرایش فعالیت..."
      });

      let response;
      if (mode === "create") {
        response = await createTask({
          pic: image!,
          title,
          description,
          startDate: calendarToIso(startDate),
          neighborhoodId: Number(neighborhood),
          address,
          skills: skillIds,
          count: Number(toEnglishDigits(peopleCount)),
          lat: location.lat,
          lng: location.lng,
        });
      }
      else {
        if (!initialData) return;

        response = await updateTask({
          id: initialData.id,
          pic: image!,
          title,
          description,
          startDate: calendarToIso(startDate),
          neighborhoodId: Number(neighborhood),
          address,
          skills: skillIds,
          count: Number(toEnglishDigits(peopleCount)),
          lat: location.lat,
          lng: location.lng,
        });
      }

      toaster.dismiss("create-task");
      if (response.isSuccess) {
        toaster.create({
          type: "success",
          title: "موفق",
          description: mode === "create" ? "فعالیت با موفقیت ایجاد شد" : "فعالیت با موفقیت ویرایش شد"
        });

        onSuccess();
        setTimeout(() => {handleClose()}, 700);
      }
      else {
        toaster.create({
          type: "error",
          title: "خطا",
          description: response.message,
        });
      }
    }
    catch (err: any) {
      console.error(err);
      toaster.dismiss("create-task");
      toaster.create({
        type: "error",
        title: "خطا",
        description: err.response?.data?.message ?? "خطایی رخ داد.",
      });
    }
  };

  const calendarToIso = (date: string) => {
    if (!date) return "";
    const [jy, jm, jd] = date.split("/").map(Number);
    const { gy, gm, gd } = toGregorian(jy, jm, jd);
    return new Date(gy, gm - 1, gd, 12).toISOString();
  };

  const handleClose = () => {
    if (mode === "create")
      resetForm();

    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setNeighborhood("");
    setAddress("");
    setSkillIds([]);
    setSelectedSkills([]);
    setPeopleCount("1");
    setImage(null);
    setLocation(null);
    setZoom(10);
  };

  const handleNeighborhoodSearch = useCallback(async (text: string) => {
    const res = await searchNeighborhoods(text);

    if (!res.isSuccess) return [];

    const options = res.value.map(item => ({
      label: item.title,
      value: item.id.toString(),
    }));

    setNeighborhoodOptions(options);

    return options;
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

  const addSkill = (value: string) => {
    if (!value) return;

    // is selected already
    if (skillIds.includes(Number(value))) return;

    const skill = skillOptions.find((x) => x.value === value);
    if (!skill) return;

    setSkillIds((prev) => [
      ...prev,
      Number(value),
    ]);

    setSelectedSkills((prev) => [
      ...prev,
      skill.label,
    ]);
  };

  const removeSkill = (label: string) => {
    const skill = skillOptions.find(
      (x) => x.label === label
    );

    if (!skill) return;

    setSelectedSkills((prev) =>
      prev.filter((x) => x !== label)
    );

    setSkillIds((prev) =>
      prev.filter((x) => x !== Number(skill.value))
    );
  };

  const previewUrl = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }

    if (imageRemoved) {
      return null;
    }

    return imageSrc;
  }, [image, imageSrc, imageRemoved]);

  useEffect(() => {
    if (!open) return;

    const initialize = async () => {
      setImageRemoved(false);
      await handleSkillSearch("");
      const options = await handleNeighborhoodSearch("");

      if (mode === "create") {
        resetForm();
        return;
      }

      if (!initialData) return;

      const selectedNeighborhood = options.find(
        x => x.label.startsWith(initialData.neighborhoodTitle)
      );

      setTitle(initialData.title);
      setDescription(initialData.description);
      setStartDate(initialData.startDateFa);
      setNeighborhood(selectedNeighborhood?.value ?? "");
      setAddress(initialData.address);
      setSkillIds(initialData.skills);
      setSelectedSkills(initialData.skillTitles);
      setPeopleCount(initialData.count.toString());
      setLocation({
        lat: initialData.lat,
        lng: initialData.lng,
      });
      setZoom(15);
    };

    initialize();
  }, [open, mode, initialData, handleNeighborhoodSearch, handleSkillSearch]);

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />

        <Dialog.Positioner>
          <Dialog.Content
            w="95%"
            maxW="390px"
            borderRadius="24px"
            dir="rtl"
          >
            <Dialog.Header
              justifyContent="center"
              position="relative"
              py="6"
            >
              <Dialog.Title
                color="teal.600"
                fontSize="20px"
                fontWeight="bold"
              >
                {mode === "create" ? "افزودن فعالیت جدید" : "ویرایش فعالیت"}
              </Dialog.Title>

              <Dialog.CloseTrigger asChild>
                <IconButton
                  aria-label="close"
                  variant="ghost"
                  position="absolute"
                  right="4"
                  top="4"
                >
                  <LuX />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="12px">
              <VStack gap="4">
                {/* Upload */}
                <Box w="full" px="16px">
                  <Text mb="2" fontWeight="bold" textAlign="right" pr="8px">
                    عکس فعالیت
                  </Text>

                  {previewUrl ? (
                    <Box position="relative">
                      <Image
                        src={previewUrl}
                        w="full"
                        h="200px"
                        borderRadius="16px"
                        objectFit="cover"
                        display="block"
                      />

                      <IconButton
                        aria-label="remove image"
                        size="2xs"
                        borderRadius="full"
                        colorPalette="red"
                        position="absolute"
                        top="-2"
                        right="-2"
                        onClick={() => {
                          setImage(null);
                          setImageRemoved(true);
                        }}
                      >
                        <LuX />
                      </IconButton>
                    </Box>
                  ) : (
                    <FileUpload.Root
                      alignItems="stretch"
                      maxFiles={1}
                      maxFileSize={2 * 1024 * 1024}
                      onFileReject={() => {
                        toaster.create({
                          type: "warning",
                          title: "فایل وارد شده قابل پذیرش نیست.",
                          description: "حداکثر حجم فایل ۲ مگابایت است.\nفرمت مورد پذیرش JPG و PNG میباشد.",
                          meta: { closable: true },
                        });
                      }}
                      accept={["image/png", "image/jpeg"]}
                      onFileAccept={(details) => {
                        const file = details.files[0];
                        if (file)
                          setImage(file);
                      }}
                    >
                      <FileUpload.HiddenInput />
                      <FileUpload.Dropzone
                        minH="200px"
                        border="2px dashed"
                        borderColor="gray.200"
                        borderRadius="12px"
                        cursor="pointer"
                        transition="0.2s"
                        _hover={{
                          borderColor: "teal.500",
                          bg: "gray.50",
                        }}
                      >
                        <VStack gap="2">
                          <Box bg="teal.50" p="4" borderRadius="full">
                            <Icon as={LuUpload} boxSize={7} color="teal.600" />
                          </Box>

                          <Text fontWeight="bold">
                            برای آپلود عکس کلیک کنید
                          </Text>

                          <Text fontSize="xs" color="gray.500" >
                            JPG, PNG حداکثر ۲ مگابایت با فرمت
                          </Text>
                        </VStack>
                      </FileUpload.Dropzone>
                    </FileUpload.Root>
                  )}
                </Box>

                {/* Title */}
                <InputBox
                  label="عنوان فعالیت"
                  placeholder="عنوان فعالیت را وارد کنید"
                  value={toPersianDigits(title)}
                  onChange={setTitle}
                />

                {/* Description */}
                <Field.Root w="full" px="4">
                  <Box w="full" textAlign="right" pr="2">
                    <Field.Label display="inline" fontWeight="bold">
                      توضیحات
                    </Field.Label>
                  </Box>

                  <Textarea
                    value={toPersianDigits(description)}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="توضیحات کامل فعالیت را بنویسید..."
                    dir="rtl"
                    textAlign="right"
                    minH="75px"
                    resize="none"
                    borderColor="gray.200"
                    borderRadius="8px"
                    p="8px"
                    _placeholder={{
                      color: "gray.400",
                    }}
                    _focus={{
                      borderColor: "teal.500",
                      boxShadow: "none",
                    }}
                  />
                </Field.Root>

                {/* Start Date */}
                <Calendar
                  futureOnly
                  label="زمان شروع"
                  value={startDate}
                  onChange={setStartDate}
                />

                {/* Neighborhood */}
                <Dropdown
                  label="محله"
                  placeholder="محله خود را انتخاب کنید"
                  options={neighborhoodOptions}
                  value={neighborhood}
                  onChange={setNeighborhood}
                  onSearch={handleNeighborhoodSearch}
                />

                {/* Map */}
                <Box w="full" px="16px">
                  <Text
                    mb="2"
                    pr="1"
                    fontWeight="bold"
                    textAlign="right"
                  >
                    موقعیت روی نقشه
                  </Text>
                  <NeshanMap
                    editable
                    zoom={zoom}
                    value={location}
                    onChange={async (loc) => {
                      setLocation(loc);
                      setZoom(15);
                      try {
                        const result = await ReverseGeocode(loc.lat, loc.lng);
                        setAddress(result.formatted_address);
                      }
                      catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                </Box>

                {/* Address */}
                <InputBox
                  label="آدرس"
                  placeholder="آدرس کامل را وارد کنید"
                  value={toPersianDigits(address)}
                  onChange={setAddress}
                />

                {/* Skills */}
                <SkillDropdown
                  label="مهارت ها"
                  placeholder=" مهارت های خود را انتخاب کنید"
                  options={skillOptions}
                  onSearch={handleSkillSearch}
                  onChange={addSkill}
                />
                {selectedSkills.length > 0 && (
                  <Wrap px="4" gap="2">
                    {selectedSkills.map((skill) => (
                      <WrapItem key={skill}>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap="1"
                          pr="2"
                          pl="3"
                          py="1.5"
                          bg="teal.50"
                          color="teal.600"
                          borderRadius="10px"
                          fontSize="sm"
                          cursor="pointer"
                          transition="0.2s"
                          _hover={{
                            bg: "teal.100",
                          }}
                          onClick={() => removeSkill(skill)}
                        >
                          <LuX size={16} />
                          <Text>{skill}</Text>
                        </Box>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}

                {/* Count */}
                <Box w="full" px="16px">
                  <Text mb="2" fontWeight="bold" textAlign="center">
                    تعداد افراد مورد نیاز:
                  </Text>

                  <NumberInput.Root
                    mx="auto"
                    width="140px"
                    min={1}
                    locale="fa-IR"
                    value={peopleCount}
                    onValueChange={(e) => setPeopleCount(e.value)}
                    formatOptions={{
                      numberingSystem: "arabext",
                      useGrouping: false,
                    }}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input borderRadius="8px" />
                  </NumberInput.Root>
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer flexDir="column" gap="3" px="10">
              <Button
                w="full"
                size="lg"
                fontWeight="bold"
                borderRadius="8px"
                color="white"
                bg="#F97316"
                _hover={{
                  bg: "#ed6c11",
                }}
                onClick={handleSubmit}
              >
                {mode === "create" ? "ایجاد فعالیت" : "ویرایش فعالیت"}
              </Button>

              <Button w="full" borderRadius="8px" variant="ghost" onClick={handleClose}>
                انصراف
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}