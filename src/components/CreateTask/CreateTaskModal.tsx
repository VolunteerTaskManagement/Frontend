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
import { useState } from "react";
import Dropdown from "../common/Dropdown";
import InputBox from "../common/Inputbox";


interface CreateTaskProbs {
  open: boolean;
  onClose: () => void;
}

const neighborhoods = [
  {
    label: "سعادت آباد",
    value: "saadat-abad",
  },
  {
    label: "ونک",
    value: "vanak",
  },
  {
    label: "پونک",
    value: "ponak",
  },
];

const skills = [
  {
    label: "React",
    value: "react",
  },
  {
    label: "TypeScript",
    value: "typescript",
  },
  {
    label: "UI Design",
    value: "ui-design",
  },
];

export default function CreateTaskModal({open, onClose}: CreateTaskProbs)
{
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [peopleCount, setPeopleCount] = useState("1");

  const handleSkillSelect = (value: string) => {
    if (value && !selectedSkills.includes(value))
    {
      setSelectedSkills((prev) => [
        ...prev,
        value,
      ]);
    }
  };

  const removeSkill = (skillValue: string) => {
    setSelectedSkills((prev) =>
      prev.filter(
        (item) => item !== skillValue
      )
    );
  };

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
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

                {/* Neighborhood */}
                <Dropdown
                  label="محله"
                  placeholder="محله خود را انتخاب کنید"
                  options={neighborhoods}
                  value={neighborhood}
                  onChange={setNeighborhood}
                />

                {/* Address */}
                <InputBox
                  label="آدرس"
                  placeholder="آدرس کامل را وارد کنید"
                  value={address}
                  onChange={setAddress}
                />

                {/* Skills */}
                <Dropdown
                  label="مهارت ها"
                  placeholder="می‌توانید چند مهارت انتخاب کنید"
                  options={skills}
                  onChange={handleSkillSelect}
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
                          <Box
                            as="span"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <IoClose size={16} />
                          </Box>

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
                    value={peopleCount}
                    onValueChange={(e) => setPeopleCount(e.value)}
                    width="140px"
                    mx="auto"
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
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
              >
                ذخیره فعالیت
              </Button>

              <Button w="full" borderRadius="8px" variant="ghost" onClick={onClose}>
                انصراف
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}