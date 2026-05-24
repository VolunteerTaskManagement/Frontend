import type { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={{ base: 'white', md: 'gray.100' }}
    >
      <Box
        w="100%"
        maxW="393px"         
        h="100%"
        bg="white"
        borderRadius={{ base: '0', md: '24px' }}
        boxShadow={{ base: 'none', md: '0 0 24px rgba(0,0,0,0.15)' }}
        overflowY="auto"
        position="relative"
        css={{
          '&::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
          },
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MobileLayout;
