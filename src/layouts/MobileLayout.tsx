import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

const MobileLayout = ({ children }: Props) => {
  return (
    <Box
      minH="100dvh"
      w="100%"
      bg="#F3F4F6"
      display="flex"
      justifyContent="center"
      px={{ base: "0", md: "20px" }}
      py={{ base: "0", md: "24px" }}
    >
      <Box
        w="100%"
        maxW="430px"
        bg="white"
        borderRadius={{ base: "0", md: "24px" }}
        boxShadow={{
          base: "none",
          md: "0 0 24px rgba(0,0,0,0.08)",
        }}
        overflow="hidden"
        px="24px"
        pt="24px"
        pb="48px"
      >
        {children}
      </Box>
    </Box>
  );
};

export default MobileLayout;