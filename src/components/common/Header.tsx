import { Avatar, Box, Button, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuUserRoundX } from "react-icons/lu";
import { useProfileStore } from "../../stores/profileStore";
import { useTaskImage } from "../../hooks/useTaskImage";
import { disconnectNotificationSocket } from "../../services/notificationSocket";
import { useNotificationStore } from "../../stores/notificationStore";
import { brandColors } from "../../theme/tokens";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../contexts/AuthContext";


const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const resetProfile = useProfileStore((state) => state.resetProfile);
  const resetNotifications = useNotificationStore((state) => state.resetNotifications);

  // profile.picUrl هم مثل picUrl تسک‌ها یک presigned URL از MinIO است که فقط از سمت
  // بک‌اند (نه مستقیم از مرورگر) قابل‌دسترسیه؛ پس باید از همون پروکسی مدیا رد بشه.
  const { imageSrc: avatarSrc } = useTaskImage(profile?.picUrl);

  const handleLogout = () => {
    disconnectNotificationSocket();
    resetNotifications();
    resetProfile();
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <Flex
      h="45px"
      align="center"
      justify="space-between"
      px="24px"
      bg="teal.50"
      borderBottom="1px solid"
      borderColor="teal.500"
    >
      <HStack gap="4px">
        <Box position="relative">
          <Avatar.Root
            size="sm"
            cursor="pointer"
            onClick={() => setOpen(!open)}
          >
            <Avatar.Image src={avatarSrc ?? undefined} />
            <Avatar.Fallback
              name={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`}
            />
          </Avatar.Root>

          {open && (
            <Box
              position="absolute"
              top="calc(100% + 6px)"
              left="-20px"
              bg="white"
              borderRadius="8px"
              boxShadow="lg"
              zIndex={1000}
            >
              <Button
                variant="ghost"
                color="red"
                onClick={handleLogout}
              >
                <LuUserRoundX />
                خروج از حساب
              </Button>
            </Box>
          )}
        </Box>

        <NotificationBell />
      </HStack>

      <HStack gap="2" cursor="pointer" onClick={() => navigate("/tasks")}>
        <Text fontSize="sm" fontWeight="bold" color={brandColors.primary}>
          سامانه مدیریت وظایف
        </Text>
        <Image
          src="/logo.png"
          alt="Logo"
          h="24px"
          boxSize={8}
          objectFit="contain"
        />
      </HStack>
    </Flex>
  );
};

export default Header;