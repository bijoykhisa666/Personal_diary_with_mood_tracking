/** @format */
"use client";

import { useState, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Select,
  FormControl,
  FormErrorMessage,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { createDiaryAction } from "../actions/add-diary";

// 🟢 React Quill + Image Upload Imports
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import ImageUploader from "quill-image-uploader";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import ImageResize from "quill-image-resize-module-react";
import imageCompression from "browser-image-compression";
import uploadImageToS3 from "../lib/uploadImageToS3bucket";

// Register Quill modules on client side
if (typeof window !== "undefined") {
  const Quill = require("react-quill").Quill;
  Quill.register("modules/imageUploader", ImageUploader);
  Quill.register("modules/imageResize", ImageResize);
}

export default function AddDiary() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // ReactQuill content
  const [tags, setTags] = useState("");
  const [moodType, setMoodType] = useState("happy");
  const [intensity, setIntensity] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const toast = useToast();
  const router = useRouter();

  // 🔧 Quill Toolbar + Image Upload Module
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "color", "image"],
          [{ "code-block": true }],
          ["clean"],
        ],
      },
      imageUploader: {
        upload: async (file: File) => {
          try {
            setIsUploading(true);

            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
              throw new Error("Image exceeds 5MB limit");
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
              throw new Error("Only JPEG, PNG, GIF allowed");
            }

            // compress if > 1MB
            const options = {
              maxSizeMB: 0.7,
              maxWidthOrHeight: 1000,
              useWebWorker: true,
              fileType: "image/jpeg",
            };

            let imageToUpload = file;

            if (file.size > 1024 * 1024) {
              imageToUpload = await imageCompression(file, options);
            }


            const imageUrl = await uploadImageToS3(imageToUpload);

            toast({
              title: "Image uploaded",
              status: "success",
              duration: 2000,
              isClosable: true,
            });

            return imageUrl;
          } catch (error) {
            console.error("Upload error:", error);
            toast({
              title: "Upload failed",
              description:
                error instanceof Error ? error.message : "Try again later",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            throw error;
          } finally {
            setIsUploading(false);
          }
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    []
  );

  // Allowed formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "indent",
    "image",
    "code-block",
    "color",
  ];

  // 📌 Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content); // ReactQuill HTML
    formData.set("tags", tags);
    formData.set("moodType", moodType);
    formData.set("intensity", intensity.toString());

    const result = await createDiaryAction(formData);

    if (result.success) {
      toast({
        title: "Diary Entry Created",
        description: "Your diary has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset
      setTitle("");
      setContent("");
      setTags("");
      setMoodType("happy");
      setIntensity(5);

      router.refresh();
    } else {
      setError(result.message || "Failed to add diary entry");
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      borderWidth={1}
      borderRadius="md"
      mb={6}
      bg="white"
    >
      <Stack spacing={4}>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* 🔥 ReactQuill Editor With Image Upload */}
        <Box>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            readOnly={isUploading}
          />
          {isUploading && (
            <Text mt={1} fontSize="sm" color="gray.500">
              Uploading image...
            </Text>
          )}
        </Box>

        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Select
          value={moodType}
          onChange={(e) => setMoodType(e.target.value)}
          required
        >
          <option value="happy">😊 Happy</option>
          <option value="sad">😢 Sad</option>
          <option value="angry">😡 Angry</option>
          <option value="anxious">😰 Anxious</option>
          <option value="neutral">😐 Neutral</option>
          <option value="excited">🤩 Excited</option>
          <option value="tired">🥱 Tired</option>
        </Select>

        <FormControl>
          <Text fontWeight="medium" mb={2}>
            Mood Intensity: {intensity}/10
          </Text>
          <Slider
            aria-label="intensity-slider"
            min={1}
            max={10}
            step={1}
            value={intensity}
            onChange={(val) => setIntensity(val)}
          >
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="teal.400" />
            </SliderTrack>
            <SliderThumb boxSize={6}>🔥</SliderThumb>
          </Slider>
        </FormControl>

        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          Add Diary
        </Button>
      </Stack>
    </Box>
  );
}
