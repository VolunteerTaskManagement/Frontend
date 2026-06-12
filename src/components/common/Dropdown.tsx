import {
  Field,
  Input,
  Box,
  Text,
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useMemo, useState } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  placeholder: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  showLabel?: boolean;
  px?: string | number;
  maxMenuHeight?: string | number;
  allowClear?: boolean;
  clearText?: string;
  centerText?: boolean
}

const Dropdown = ({
  label,
  placeholder,
  options,
  onChange,
  showLabel = true,
  px = "4",
  maxMenuHeight = "180px",
  allowClear = true,
  clearText = "-",
  centerText = false,

}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return options;

    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalizedSearch)
    );
  }, [options, search]);

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
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setSearch("");
            setOpen(true);
          }}
          onClick={() => {
            setSearch("");
            setOpen(true);
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          cursor="text"
          variant="outline"
          dir="rtl"
          textAlign={centerText ? "center" : "right"}
          borderColor="gray.200"
          borderRadius="8px"
          pl="40px"
          pr="8px"
          _placeholder={{
            color: "gray.400",
            textAlign: centerText ? "center" : "right",
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
          color="black"
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
            zIndex="10"
            boxShadow="sm"
          >
            {allowClear && (
              <Box
                px="12px"
                py="10px"
                cursor="pointer"
                textAlign="right"
                fontSize="md"
                color="gray.500"
                borderBottom="1px solid"
                borderColor="gray.100"
                _hover={{
                  bg: "gray.50",
                }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSearch("");
                  onChange?.("");
                  setOpen(false);
                }}
              >
                <Text>{clearText}</Text>
              </Box>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSearch(opt.label);
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
                fontSize="sm"
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

export default Dropdown;
