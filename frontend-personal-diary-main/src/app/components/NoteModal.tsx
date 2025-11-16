/** @format */

"use client";

import { useState, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Box,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  FormLabel,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/* ------------------------------------------------------------------ */
/* 1. Helper – render Quill HTML (used only in the card preview)      */
/* ------------------------------------------------------------------ */
function QuillHtml({ html, noOfLines }: { html: string; noOfLines?: number }) {
  return (
    <Box
      noOfLines={noOfLines}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 2. Types                                                          */
/* ------------------------------------------------------------------ */
interface Note {
  _id: string;
  title: string;
  content: string; // HTML from Quill
  tags?: string[];
  mood?: {
    moodType: string;
    intensity: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface NoteModalProps {
  note: Note;
  token: string;
  onUpdate: (updatedNote: Note) => void;
  onDelete: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/* 3. Mood emoji map                                                 */
/* ------------------------------------------------------------------ */
const moodEmojis: Record<string, string> = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  anxious: "Anxious",
  neutral: "Neutral",
  excited: "Excited",
  tired: "Tired",
};

/* ------------------------------------------------------------------ */
/* 4. Quill modules & formats (same as AddDiary)                     */
/* ------------------------------------------------------------------ */
const QuillModules = (uploadHandler?: (file: File) => Promise<string>) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ "code-block": true }],
      ["clean"],
    ],
  },
  ...(uploadHandler && {
    imageUploader: { upload: uploadHandler },
  }),
});

const QuillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "code-block",
];

/* ------------------------------------------------------------------ */
/* 5. Component                                                      */
/* ------------------------------------------------------------------ */
export default function NoteModal({
  note,
  token,
  onUpdate,
  onDelete,
}: NoteModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [moodType, setMoodType] = useState(note.mood?.moodType || "neutral");
  const [intensity, setIntensity] = useState(note.mood?.intensity || 5);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* --------------------------------------------------------------- */
  /* 6. Image upload (reuse your existing uploadImageToS3)           */
  /* --------------------------------------------------------------- */
  // If you already have `uploadImageToS3` in another file, import it:
  // import uploadImageToS3 from "@/lib/uploadImageToS3bucket";
  // For the demo we keep a tiny stub – replace with your real one.
  const imageUploadHandler = async (file: File): Promise<string> => {
    // ----> replace with your real upload logic <----
    // const compressed = await compressIfNeeded(file);
    // return await uploadImageToS3(compressed);
    // ------------------------------------------------
    // For demo we just return a data-url:
    return URL.createObjectURL(file);
  };

  const modules = useMemo(
    () => QuillModules(imageUploadHandler),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* --------------------------------------------------------------- */
  /* 7. API handlers                                                 */
  /* --------------------------------------------------------------- */
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(
        `https://personal-diary-ok2z.onrender.com/api/diary/${note._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            tags,
            mood: { moodType, intensity },
          }),
        }
      );
      if (res.ok) {
        const updatedNote = await res.json();
        onUpdate(updatedNote);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `https://personal-diary-ok2z.onrender.com/api/diary/${note._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        onDelete(note._id);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  /* --------------------------------------------------------------- */
  /* 8. UI                                                          */
  /* --------------------------------------------------------------- */
  return (
    <>
      {/* ------------------- Card preview (click to edit) ------------------- */}
      <Box
        p={4}
        bg="white"
        rounded="md"
        shadow="sm"
        border="1px solid #e2e8f0"
        _hover={{ shadow: "md", cursor: "pointer" }}
        onClick={onOpen}
      >
        <Box fontWeight="bold" mb={2}>
          {note.title}
        </Box>

        {note.createdAt && (
          <Text fontSize="xs" color="gray.500" mb={2}>
            {format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
          </Text>
        )}

        {/* Rich-text preview, truncated */}
        <QuillHtml html={note.content} noOfLines={2} />

        <HStack mt={2} spacing={2} wrap="wrap">
          {(note.tags ?? []).map((tag) => (
            <Tag key={tag} size="sm" colorScheme="blue" borderRadius="full">
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </HStack>

        {note.mood && (
          <Text mt={2} fontSize="sm" color="gray.600">
            Mood:{" "}
            <b>
              {moodEmojis[note.mood.moodType]} {note.mood.moodType}
            </b>{" "}
            ({note.mood.intensity}/10)
          </Text>
        )}
      </Box>

      {/* -------------------------- Edit Modal -------------------------- */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Note</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Title */}
              <Box>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>

              {/* Rich-text editor (replaces Textarea) */}
              <Box>
                <FormLabel>Content</FormLabel>
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={QuillFormats}
                    placeholder="Write your diary entry..."
                    style={{ minHeight: "180px" }}
                  />
                </Box>
              </Box>

              {/* Tags */}
              <Box>
                <FormLabel>Tags</FormLabel>
                <HStack mb={2} spacing={2} wrap="wrap">
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      size="md"
                      borderRadius="full"
                      variant="subtle"
                      colorScheme="blue"
                    >
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => removeTag(tag)} />
                    </Tag>
                  ))}
                </HStack>
                <HStack>
                  <Input
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <Button
                    onClick={addTag}
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                  >
                    Add
                  </Button>
                </HStack>
              </Box>

              {/* Mood */}
              <Box>
                <FormLabel>Mood</FormLabel>
                <Select
                  value={moodType}
                  onChange={(e) => setMoodType(e.target.value)}
                  mb={3}
                >
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="angry">Angry</option>
                  <option value="anxious">Anxious</option>
                  <option value="neutral">Neutral</option>
                  <option value="excited">Excited</option>
                  <option value="tired">Tired</option>
                </Select>

                <FormLabel>Intensity: {intensity}</FormLabel>
                <Slider
                  value={intensity}
                  onChange={setIntensity}
                  min={1}
                  max={10}
                  step={1}
                  colorScheme="teal"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDelete}
              isLoading={deleting}
              isDisabled={!token}
              size="sm"
            >
              Delete
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              isLoading={updating}
              isDisabled={!token}
              size="sm"
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}