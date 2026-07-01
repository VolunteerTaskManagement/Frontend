import { useState } from 'react';
import { Field, Input, Box } from '@chakra-ui/react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

interface PasswordBoxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const PasswordBox = ({ label, placeholder, value, onChange }: PasswordBoxProps) => {
  const [show, setShow] = useState(false);

  return (
    <Field.Root w="full">
      <Box w="full" textAlign="right" pr="6">
        <Field.Label display="inline" fontWeight="bold">{label}</Field.Label>
      </Box>

      <Box position="relative" w="full" px="4">
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
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
          display="flex"
          alignItems="center"
          cursor="pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShow(!show);
          }}
        >
          {show ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
        </Box>
      </Box>
    </Field.Root>
  );
};

export default PasswordBox;
