import { Box, HStack, Text } from '@chakra-ui/react';
import { brandColors } from '../../theme/tokens';
import { COORDINATOR_TAB_LABELS, type CoordinatorTaskTab } from '../../stores/coordinatorTaskStore';

interface CoordinatorTaskTabsProps {
  activeTab: CoordinatorTaskTab;
  onTabChange: (tab: CoordinatorTaskTab) => void;
}

const TABS: CoordinatorTaskTab[] = ['open', 'completed', 'cancelled'];

const CoordinatorTaskTabs = ({ activeTab, onTabChange }: CoordinatorTaskTabsProps) => {
  return (
    <HStack
      gap="0"
      w="full"
      bg={brandColors.surface}
      borderRadius="full"
      p="1"
      boxShadow="0 2px 8px rgba(0,0,0,0.06)"
    >
      {TABS.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <Box
            key={tab}
            flex="1"
            py="2"
            textAlign="center"
            borderRadius="full"
            cursor="pointer"
            bg={isActive ? brandColors.primary : 'transparent'}
            onClick={() => onTabChange(tab)}
            transition="all 0.2s ease"
          >
            <Text
              fontSize="sm"
              fontWeight={isActive ? 'bold' : 'medium'}
              color={isActive ? 'white' : brandColors.textSecondary}
            >
              {COORDINATOR_TAB_LABELS[tab]}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
};

export default CoordinatorTaskTabs;