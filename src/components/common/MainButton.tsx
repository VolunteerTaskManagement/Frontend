import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

interface MainButtonProps extends ButtonProps {
  text: string;
}

const MainButton = ({ text, ...props }: MainButtonProps) => {
  return (
    <Button
      {...props}
      w={props.w ?? '30%'}
      h="40px"
      bg="#008A8F"
      color="white"
      borderRadius="10px"
      fontWeight="bold"
      fontSize="lg"
      boxShadow="0 4px 6px rgba(0, 138, 143, 0.3)"
    >
      {text}
    </Button>
  );
};

export default MainButton;