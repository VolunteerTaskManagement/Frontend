import { Box, HStack, Text } from '@chakra-ui/react';
import { FiStar } from 'react-icons/fi';
import { brandColors } from '../../theme/tokens';

const ProfileMatchBanner = () => {
  return (
    <Box
      w="full"
      px="3"
      py="2.5"
      borderRadius="12px"
      bg={brandColors.primaryLight}
      border="1px solid"
      borderColor="#B3E8EA"
    >
      <HStack align="center" gap="2">
        <Box color={brandColors.primary} flexShrink={0}>
          <FiStar size={16} />
        </Box>
        <Text fontSize="xs" color={brandColors.textSecondary} lineHeight="1.5">
          <Text as="span" fontWeight="bold" color={brandColors.primary}>
            تطبیق خودکار:
          </Text>
          {' '}
          وظایف در ابتدا بر اساس مهارت‌ها و محله‌های پروفایل شما فیلتر شده‌اند.
        </Text>
      </HStack>
    </Box>
  );
};

export default ProfileMatchBanner;
