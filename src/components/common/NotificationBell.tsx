import { Box, IconButton, Spinner, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { LuBell } from 'react-icons/lu';
import { useNotifications } from '../../hooks/useNotifications';
import { brandColors } from '../../theme/tokens';
import { toPersianDigits } from '../../utils/formatters';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { logs, isLoading, error, unseenCount } = useNotifications();

  return (
    <Box position="relative">
      <IconButton
        aria-label="Notifications"
        variant="plain"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        <LuBell />
      </IconButton>

      {unseenCount > 0 && (
        <Box
          position="absolute"
          top="-2px"
          left="-2px"
          minW="16px"
          h="16px"
          px="1"
          borderRadius="full"
          bg="red.500"
          color="white"
          fontSize="9px"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {toPersianDigits(unseenCount > 9 ? '۹+' : unseenCount)}
        </Box>
      )}

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left="-20px"
          w="280px"
          maxH="320px"
          overflowY="auto"
          bg="white"
          borderRadius="12px"
          boxShadow="lg"
          zIndex={1000}
          p="2"
        >
          {isLoading ? (
            <VStack py="6">
              <Spinner size="sm" color="brand.500" />
            </VStack>
          ) : error ? (
            <Text fontSize="xs" color="red.500" textAlign="center" py="4">
              {error}
            </Text>
          ) : logs.length === 0 ? (
            <Text fontSize="xs" color={brandColors.textSecondary} textAlign="center" py="4">
              اعلانی وجود ندارد.
            </Text>
          ) : (
            <VStack align="stretch" gap="1">
              {logs.map((log) => (
                <Box
                  key={log.id}
                  p="2"
                  borderRadius="8px"
                  bg={log.isSeen ? 'transparent' : brandColors.primaryLight}
                >
                  <Text
                    fontSize="xs"
                    fontWeight={log.isSeen ? 'normal' : 'bold'}
                    color={brandColors.textPrimary}
                    lineHeight="1.6"
                  >
                    {log.title}
                  </Text>
                  {log.createDateFa && (
                    <Text fontSize="10px" color={brandColors.textMuted} mt="1">
                      {toPersianDigits(log.createDateFa)}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationBell;