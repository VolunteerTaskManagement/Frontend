import { Avatar, Box, Button, Flex, HStack, IconButton, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuUserRoundX } from "react-icons/lu";
import { getProfile } from "../../services/profileService";
import type { ProfileResponse } from "../../types/profile";


const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse["value"] | null>(null);
  const avatarUrl = profile?.picUrl
  ? `http://89.42.199.196:5213/api/MediaFiles/StramImg?FileUrl=${encodeURIComponent(profile.picUrl)}`
  : undefined;

  const handleLogout = () => {
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
            <Avatar.Image src={avatarUrl} />
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

        <IconButton
          aria-label="Notifications"
          variant="plain"
          size="sm"
        >
          <LuBell />
        </IconButton>
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