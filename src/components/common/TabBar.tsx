import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { LuUserRoundPen, LuVote, LuNotepadText } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";

interface TabItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

const tabs: TabItem[] = [
  {
    id: "profile",
    label: "پروفایل",
    icon: LuUserRoundPen ,
    path: "/profile",
  },
  {
    id: "myTasks",
    label: "وظایف من",
    icon: LuVote,
    path: "/myTasks",
  },
  {
    id: "tasks",
    label: "آگهی ها",
    icon: LuNotepadText,
    path: "/tasks",
  },
];

export default function TabBar()
{
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      bg="white"
      borderWidth="1px"
      px={6}
      py={1.5}
      boxShadow="md"
      w="100%"
    >
      <Flex justify="space-between">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Box
              key={tab.id}
              onClick={() => navigate(tab.path)}
              cursor="pointer"
              textAlign="center"
              px={8}
              py={2}
              borderRadius="12px"
              bg={ isActive ? "#ECFEFF" : "transparent" }
              transition="all .2s"
            >
              <Icon
                as={tab.icon}
                boxSize={6}
                color={ isActive ? "#008A8F" : "#6A7282" }
              />

              <Text
                mt={1}
                fontSize={12}
                fontWeight="600"
                color={ isActive ? "#008A8F" : "#6A7282" }
              >
                {tab.label}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}