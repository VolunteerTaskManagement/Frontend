// src/components/common/MainButton.tsx
import { Button } from '@chakra-ui/react';

interface MainButtonProps {
  text: string;
}

const MainButton = ({ text, ...props }: MainButtonProps) => {
  return (
    <Button
    {...props}
      w="30%"
      h="40px"
      bg="#008A8F" 
      color="white"
      borderRadius="10px"
      fontWeight="bold"
      fontSize="lg"
    //   boxShadow="0 4px 0px rgba(0, 0, 0, .08)"
    boxShadow="0 4px 6px rgba(0, 138, 143, 0.3)" 
    >
      {text}
    </Button>
  );
};

export default MainButton;
