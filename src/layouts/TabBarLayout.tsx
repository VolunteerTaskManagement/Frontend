import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import TabBar from "../components/common/TabBar";
import Header from "../components/common/Header";

type Props = {
  children: ReactNode;
};

const TabBarLayout = ({ children }: Props) => {
  return (
    <Box
      minH="100dvh"
      w="100%"
      bg="#F5F5F5"
      display="flex"
      justifyContent="center"
      px={{ base: "0", sm: "24px" }}
      py={{ base: "0", sm: "24px" }}
    >
      <Box
        position="relative"
        w="100%"
        maxW="430px"
        h={{ base: "100dvh", sm: "calc(100dvh - 45px)" }}
        bg="white"
        borderRadius={{ base: "0", sm: "24px" }}
        boxShadow={{
          base: "none",
          sm: "0 0 24px rgba(0,0,0,0.08)",
        }}
        overflow="hidden"
      >
        <Header />

        <Box
          h="100%"
          overflowY="auto"
          px="24px"
          pt="24px"
          pb="80px"
        >
          {children}
        </Box>

        <Box
          position="fixed"
          bottom="0px"
          width="100%"
          maxW="430px"
        >
          <TabBar />
        </Box>
      </Box>
    </Box>
  );
};

export default TabBarLayout;