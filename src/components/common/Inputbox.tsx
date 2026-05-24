import { Field, Input, Box } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface InputBoxProps {
  label: string;
  placeholder: string;
  icon?: IconType;
}

const InputBox = ({ label, placeholder, icon: IconComponent }: InputBoxProps) => {
  return (
    <Field.Root w="full">
      <Box w="full" textAlign="right" pr="6">
        <Field.Label display="inline" fontWeight="bold">{label}</Field.Label>
      </Box>

      <Box position="relative" w="full" px="4">
        <Input
          placeholder={placeholder}
          variant="outline"
          dir="rtl"
          textAlign="right"
          borderColor="gray.200"
          borderRadius="8px"
          pl="40px"
          pr="8px"
          _placeholder={{ color: "gray.400" }}
          _focus={{ borderColor: "teal.500", boxShadow: "none" }}
        />
        <Box
          position="absolute"
          top="50%"
          left="28px"
          transform="translateY(-50%)"
          pointerEvents="none"
          display="flex"
          alignItems="center"
        >
          {IconComponent && <IconComponent size={22} />}
        </Box>
      </Box>
    </Field.Root>
  );
};

export default InputBox;
