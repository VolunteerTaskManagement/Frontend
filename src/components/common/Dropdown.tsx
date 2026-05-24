import {
  Field,
  Input,
  Box,
  Text,
} from "@chakra-ui/react";

import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
}

const Dropdown = ({
  label,
  placeholder,
  options,
  value,
  onChange,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(
    (opt) => opt.value === value
  );

  return (
    <Field.Root w="full">
      <Box w="full" textAlign="right" pr="6">
        <Field.Label
          display="inline"
          fontWeight="bold"
        >
          {label}
        </Field.Label>
      </Box>

      <Box position="relative" w="full" px="4">
        <Input
          readOnly
          value={selectedOption?.label || ""}
          placeholder={placeholder}
          onClick={() => setOpen(!open)}
          cursor="pointer"
          variant="outline"
          dir="rtl"
          textAlign="right"
          borderColor="gray.200"
          borderRadius="8px"
          pl="40px"
          pr="8px"
          _placeholder={{
            color: "gray.400",
          }}
          _focus={{
            borderColor: "teal.500",
            boxShadow: "none",
          }}
        />

        <Box
          position="absolute"
          top="50%"
          left="28px"
          transform="translateY(-50%)"
          pointerEvents="none"
          display="flex"
          alignItems="center"
          color="black"
        >
          <MdKeyboardArrowDown size={22} />
        </Box>

        {open && (
          <Box
            position="absolute"
            top="45px"
            left="16px"
            right="16px"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="8px"
            overflow="hidden"
            zIndex="10"
            boxShadow="sm"
          >
            {options.map((opt) => (
              <Box
                key={opt.value}
                px="12px"
                py="10px"
                cursor="pointer"
                textAlign="right"
                fontSize="md"
                _hover={{
                  bg: "gray.50",
                }}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                <Text>{opt.label}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Field.Root>
  );
};

export default Dropdown;