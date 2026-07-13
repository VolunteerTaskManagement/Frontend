import { Avatar, Box, Button, Flex, HStack, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuUserRoundX } from "react-icons/lu";
import { getProfile } from "../../services/profileService";
import { useTaskImage } from "../../hooks/useTaskImage";
import { disconnectNotificationSocket } from "../../services/notificationSocket";
import type { ProfileResponse } from "../../types/profile";
import NotificationBell from "./NotificationBell";


const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse["value"] | null>(null);
  const { imageSrc: avatarSrc } = useTaskImage(profile?.picUrl);

  const handleLogout = () => {
    disconnectNotificationSocket();
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.value);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

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

      <Image
        src="/logo.png"
        alt="Logo"
        h="24px"
        boxSize={8}
        objectFit="contain"
        cursor="pointer"
        onClick={() => navigate("/tasks")}
      />
    </Flex>
  );
};

export default Header;