import {
  Field,
  Input,
  Box,
  Text,
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useEffect, useState } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface SkillDropdownProps {
  label?: string;
  placeholder: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (text: string) => void;
  showLabel?: boolean;
  px?: string | number;
  maxMenuHeight?: string | number;
  allowClear?: boolean;
  clearText?: string;
}

const SkillDropdown = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  onSearch,
  showLabel = true,
  px = "4",
  maxMenuHeight = "180px",
  allowClear = true,
  clearText = "-",
}: SkillDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!value) return;

    const selected = options.find((o) => o.value === value);

    if (selected) {
      setSearch(selected.label);
    }
  }, [value, options]);

  const menuOffset = px === "0" || px === 0 ? "0" : "16px";
  const arrowOffset = px === "0" || px === 0 ? "12px" : "28px";

  return (
    <Field.Root w="full">
      {showLabel && label && (
        <Box w="full" textAlign="right" pr="6">
          <Field.Label display="inline" fontWeight="bold">
            {label}
          </Field.Label>
        </Box>
      )}

      <Box position="relative" w="full" px={px}>
        <Input
          value={search}
          placeholder={placeholder}
          onChange={(e) => {
            const text = e.target.value;
            setSearch(text);
            setOpen(true);
            onSearch?.(text);
          }}
          onFocus={() => {
            setOpen(true);
            onSearch?.(search);
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
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
          left={arrowOffset}
          transform="translateY(-50%)"
          pointerEvents="none"
          display="flex"
          alignItems="center"
        >
          <MdKeyboardArrowDown size={22} />
        </Box>

        {open && (
          <Box
            position="absolute"
            top="45px"
            left={menuOffset}
            right={menuOffset}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="8px"
            overflowY="auto"
            maxH={maxMenuHeight}
            zIndex={100}
            boxShadow="sm"
          >
            {allowClear && (
              <Box
                px="12px"
                py="10px"
                cursor="pointer"
                textAlign="right"
                color="gray.500"
                borderBottom="1px solid"
                borderColor="gray.100"
                _hover={{ bg: "gray.50" }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSearch("");
                  onChange?.("");
                  onSearch?.("");
                  setOpen(false);
                }}
              >
                <Text>{clearText}</Text>
              </Box>
            )}

            {options.length > 0 ? (
              options.map((opt) => (
                <Box
                  key={opt.value}
                  px="12px"
                  py="10px"
                  cursor="pointer"
                  textAlign="right"
                  _hover={{ bg: "gray.50" }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSearch("");
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                >
                  <Text>{opt.label}</Text>
                </Box>
              ))
            ) : (
              <Box
                px="12px"
                py="10px"
                textAlign="right"
                color="gray.500"
              >
                گزینه‌ای پیدا نشد
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Field.Root>
  );
};

export default SkillDropdown;