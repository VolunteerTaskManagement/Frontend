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
} from "@chakra-ui/react";

import { FiUpload } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useCallback } from "react";
import Dropdown from "../common/Dropdown";
import InputBox from "../common/Inputbox";
import { searchNeighborhoods } from "../../services/neighborhood";
import { getSkills } from "../../services/skillsDropdown";
import { createTask } from "../../services/createTaskService";
import { ReverseGeocode } from "../../services/reverseGeocodingService";
import NeshanMap from "../common/Map";
import type { MapLocation } from "../../types/map";


interface CreateTaskProbs {
  open: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({open, onClose}: CreateTaskProbs)
{
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [skillIds, setSkillIds] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [peopleCount, setPeopleCount] = useState("1");
  const [neighborhoodOptions, setNeighborhoodOptions] = useState< {label: string; value: string}[] >([]);
  const [skillOptions, setSkillOptions] = useState< {label: string; value: string}[] >([]);
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [zoom, setZoom] = useState(10);

  const handleSubmit = async () => {
    try {
      if (!image) {
        alert("عکس فعالیت را انتخاب کنید");
        return;
      }
      if (!location) {
        alert("موقعیت را روی نقشه انتخاب کنید.")
        return;
      }

      await createTask({
        pic: image,
        title,
        description,
        neighborhoodId: Number(neighborhood),
        address,
        startDate: new Date().toISOString(),
        count: Number(peopleCount),
        skills: skillIds,
        lat: location.lat,
        lng: location.lng,
      });

      handleClose();
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
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

  useEffect(() => {
    if (open) {
      handleNeighborhoodSearch("");
      handleSkillSearch("");
    }
  }, [open]);

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.500" />

        <Dialog.Positioner>
          <Dialog.Content
            maxW="430px"
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
                fontSize="2xl"
                fontWeight="bold"
              >
                افزودن فعالیت جدید
              </Dialog.Title>

              <Dialog.CloseTrigger asChild>
                <IconButton
                  aria-label="close"
                  variant="ghost"
                  position="absolute"
                  right="4"
                  top="4"
                >
                  <IoClose />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body pb="6">
              <VStack gap="6">
                {/* Upload */}
                <Box w="full" px="16px">
                  <Text mb="2" fontWeight="bold" textAlign="right" pr="8px">
                    عکس فعالیت
                  </Text>

                  <FileUpload.Root
                    alignItems="stretch"
                    maxFiles={1}
                    accept={["image/png", "image/jpeg"]}
                    onFileAccept={(details) => {
                      const file = details.files[0];
                      if (file)
                        setImage(file);
                    }}
                  >
                    <FileUpload.HiddenInput />
                    <FileUpload.Dropzone
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
                      <VStack gap="3">
                        <Box bg="teal.50" p="4" borderRadius="full">
                          <Icon as={FiUpload} boxSize={7} color="teal.600" />
                        </Box>

                        <Text fontWeight="bold">
                          برای آپلود عکس کلیک کنید
                        </Text>

                        <Text fontSize="sm" color="gray.500" >
                          JPG, PNG فرمت قابل پذیرش
                        </Text>
                      </VStack>
                    </FileUpload.Dropzone>
                    <FileUpload.List clearable />
                  </FileUpload.Root>
                </Box>

                {/* Title */}
                <InputBox
                  label="عنوان فعالیت"
                  placeholder="عنوان فعالیت را وارد کنید"
                  value={title}
                  onChange={setTitle}
                />

                {/* Description */}
                <Field.Root w="full" px="4">
                  <Box w="full" textAlign="right" pr="2">
                    <Field.Label display="inline" fontWeight="bold">
                      توضیحات
                    </Field.Label>
                  </Box>

                  <Box w="full">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="توضیحات کامل فعالیت را بنویسید..."
                      dir="rtl"
                      textAlign="right"
                      minH="85px"
                      resize="none"
                      borderColor="gray.200"
                      borderRadius="8px"
                      px="8px"
                      py="10px"
                      _placeholder={{
                        color: "gray.400",
                      }}
                      _focus={{
                        borderColor: "teal.500",
                        boxShadow: "none",
                      }}
                    />
                  </Box>
                </Field.Root>

                {/* Skills */}
                <Dropdown
                  label="مهارت ها"
                  placeholder="می‌توانید چند مهارت انتخاب کنید"
                  options={skillOptions}
                  onChange={addSkill}
                  onSearch={handleSkillSearch}
                />
                {selectedSkills.length > 0 && (
                  <Wrap px="4" gap="2">
                    {selectedSkills.map((skill) => (
                      <WrapItem key={skill}>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap="1"
                          px="3"
                          py="1.5"
                          bg="teal.50"
                          color="teal.600"
                          borderRadius="8px"
                          fontSize="sm"
                          cursor="pointer"
                          transition="0.2s"
                          _hover={{
                            bg: "teal.100",
                          }}
                          onClick={() => removeSkill(skill)}
                        >
                          <IoClose size={16} />
                          <Text>{skill}</Text>
                        </Box>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}

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
                  {/* <Text
                    mb="2"
                    pr="2"
                    fontWeight="bold"
                    textAlign="right"
                  >
                    موقعیت روی نقشه
                  </Text> */}
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
                  value={address}
                  onChange={setAddress}
                />

                {/* Count */}
                <Box w="full" px="16px">
                  <Text mb="2" fontWeight="bold" textAlign="center">
                    تعداد افراد مورد نیاز:
                  </Text>

                  <NumberInput.Root
                    mx="auto"
                    width="140px"
                    min={1}
                    value={peopleCount}
                    onValueChange={(e) => setPeopleCount(e.value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input borderRadius="8px" />
                  </NumberInput.Root>
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer flexDir="column" gap="3" px="10" pb="8" pt="4">
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
                ذخیره فعالیت
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