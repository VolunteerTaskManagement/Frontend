import type { ReactNode } from "react"
import { Box } from "@chakra-ui/react"

type Props = {
  children: ReactNode
}

const MobileLayout = ({ children }: Props) => {
  return (
    <Box
      minH="100dvh" 
      w="100%"
      bg="#F3F4F6"
      display="flex"
      justifyContent="center" 
      alignItems={{ base: "flex-start", md: "center" }} 
    >
      <Box
        w="100%"
        maxW="430px"
        minH={{ base: "100dvh", md: "auto" }} 
        bg="white"
        boxShadow={{ base: "none", md: "0 0 24px rgba(0,0,0,0.1)" }}
        borderRadius={{ base: "0", md: "24px" }}
        overflowY="auto"
                pt="calc(env(safe-area-inset-top, 0px) + 24px)"
                pb = "24px"
        px="16px"
      >
        {children}
      </Box>
    </Box>
  )
}

export default MobileLayout
