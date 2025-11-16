"use client";

import {
  Box,
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar"; // install: npm install react-calendar
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

// Nav items with optional children
const navItems = [
  { label: "Home", href: "/" },
  { label: "Notification", href: "/notification" },
  { label: "Calendar", href: "/calender" }, // will override to modal
  // { label: "Archive", href: "/archive" },
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

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
  
    const dateSlug = `${year}-${month}-${day}`; // YYYY-MM-DD in local time
    router.push(`/date/${dateSlug}`);
    onClose();
  };
  

  return (
    <>
      <Box
        w="250px"
        minH="100vh"
        borderRight="1px solid #e2e8f0"
        position="fixed"
        top="60px"
        left={0}
        bg="white"
        py={4}
        display={{ base: "none", md: "block" }}
      >
        <VStack align="start" spacing={4} pl={6}>
          {navItems.map((item) =>
            item.label === "Calendar" ? (
              <Text
                key={item.label}
                fontWeight="medium"
                color="gray.700"
                cursor="pointer"
                _hover={{ color: "yellow.600" }}
                onClick={onOpen} // open modal instead of navigating
                mb="0"
              >
                {item.label}
              </Text>
            ) : item.children ? (
              <Accordion allowToggle key={item.label} w="full">
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
                >
                  {item.label}
                </Text>
              </Link>
            )
          )}
        </VStack>
      </Box>

      {/* Calendar Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
