/** @format */

"use client";

import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  useDisclosure,
  Button,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { FiMenu, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar"; // npm install react-calendar
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // npm install js-cookie

// Nav items with optional children
const navItems = [
  { label: "Home", href: "/" },
  { label: "Calendar", href: "/calender" }, // will override to modal
  {
    label: "Moods",
    children: [
      { label: "Happy", href: "/moods/happy", icon: "😊" },
      { label: "Sad", href: "/moods/sad", icon: "😢" },
      { label: "Angry", href: "/moods/angry", icon: "😡" },
      { label: "Anxious", href: "/moods/anxious", icon: "😰" },
      { label: "Neutral", href: "/moods/neutral", icon: "😐" },
      { label: "Excited", href: "/moods/excited", icon: "🤩" },
      { label: "Tired", href: "/moods/tired", icon: "🥱" },
    ],
  },
];

interface TopBarProps {
  token?: string;
}

export default function TopBar({ token }: TopBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Sidebar drawer
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure(); // Search drawer

  const {
    isOpen: isCalendarOpen,
    onOpen: onCalendarOpen,
    onClose: onCalendarClose,
  } = useDisclosure(); // Calendar modal

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateSlug = date.toISOString().split("T")[0]; // format YYYY-MM-DD
    router.push(`/date/${dateSlug}`);
    onCalendarClose();
    onClose(); // close drawer if opened from mobile
  };

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("id", { path: "/" });
  
    router.push("/login");
  };

  return (
    <>
      {/* TopBar */}
      <Flex
        px={4}
        py={2}
        align="center"
        justify="space-between"
        bg="white"
        shadow="sm"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Flex align="center" gap={4}>
          {/* Hamburger only visible on mobile */}
          <IconButton
            aria-label="Menu"
            icon={<FiMenu />}
            variant="ghost"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpen}
          />
          <Text fontSize="xl" fontWeight="bold" color="yellow.600" mb={0}>
            Personal Diary
          </Text>
        </Flex>

        {/* Search input for md+ */}
        <Flex
          flex="1"
          maxW="600px"
          ml={8}
          display={{ base: "none", md: "flex" }}
        >
          <Input
            placeholder="Search"
            variant="filled"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                router.push(
                  `/search?q=${encodeURIComponent(searchQuery.trim())}`
                );
              }
            }}
          />
        </Flex>

        {/* Search icon for mobile */}
        <IconButton
          aria-label="Search"
          icon={<FiSearch />}
          variant="ghost"
          display={{ base: "inline-flex", md: "none" }}
          onClick={onSearchOpen}
        />

        {/* ✅ Show logout only if token exists */}
        {token && (
          <Button colorScheme="red" size="sm" onClick={handleLogout} ml={4}>
            Logout
          </Button>
        )}
      </Flex>

      {/* Sidebar Drawer for Mobile */}
      <Box display={{ base: "block", md: "none" }}>
        <DrawerSidebar
          isOpen={isOpen}
          onClose={onClose}
          onCalendarOpen={onCalendarOpen}
        />
      </Box>

      {/* Mobile Search Drawer */}
      <Drawer
        placement="top"
        onClose={onSearchClose}
        isOpen={isSearchOpen}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={20} px={4}>
            <Input
              autoFocus
              placeholder="Search your notes..."
              variant="filled"
              size="lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(
                    `/search?q=${encodeURIComponent(searchQuery.trim())}`
                  );
                  onSearchClose(); // close drawer
                }
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Calendar Modal */}
      <Modal isOpen={isCalendarOpen} onClose={onCalendarClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Calendar
              onClickDay={(date) => handleDateClick(date)}
              value={selectedDate}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// SidebarDrawer Component with links and accordion
interface DrawerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCalendarOpen: () => void;
}

function DrawerSidebar({
  isOpen,
  onClose,
  onCalendarOpen,
}: DrawerSidebarProps) {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody pt={10}>
          <VStack align="start" spacing={4} pl={2}>
            {navItems.map((item) =>
              item.label === "Calender" ? (
                <Text
                  key={item.label}
                  fontWeight="medium"
                  color="gray.700"
                  cursor="pointer"
                  _hover={{ color: "yellow.600" }}
                  onClick={onCalendarOpen}
                  mb="0"
                >
                  {item.label}
                </Text>
              ) : item.children ? (
                <Accordion allowToggle w="full" key={item.label}>
                  <AccordionItem border="none">
                    <AccordionButton px={0}>
                      <Box
                        flex="1"
                        textAlign="left"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        {item.label}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pl={4} py={2}>
                      <VStack align="start" spacing={2}>
                        {item.children.map((child) => (
                          <Link key={child.label} href={child.href} passHref>
                            <Text
                              as="a"
                              fontWeight="normal"
                              color="gray.600"
                              cursor="pointer"
                              _hover={{ color: "yellow.600" }}
                              onClick={onClose} // close drawer on click
                            >
                              <span style={{ marginRight: "8px" }}>
                                {child.icon}
                              </span>
                              {child.label}
                            </Text>
                          </Link>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link key={item.label} href={item.href} passHref>
                  <Text
                    as="a"
                    fontWeight="medium"
                    color="gray.700"
                    cursor="pointer"
                    _hover={{ color: "yellow.600" }}
                    onClick={onClose}
                  >
                    {item.label}
                  </Text>
                </Link>
              )
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
