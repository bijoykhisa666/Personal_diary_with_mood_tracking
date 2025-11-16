/** @format */

const DiaryEntry = require("../models/diaryEntryModel");

// GET all
exports.getAll = async (req, res) => {
  const entries = await DiaryEntry.find().sort({ date: -1 });
  res.json(entries);
};

// GET single
exports.getOne = async (req, res) => {
  const entry = await DiaryEntry.findById(req.params.id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });
  res.json(entry);
};

// CREATE
// controllers/diaryControllers.js
exports.create = async (req, res) => {
  const { title, content, tags, mood } = req.body;

  try {
    const newEntry = new DiaryEntry({
      user: req.user._id, // ✅ use authenticated user
      title,
      content,
      tags,
      mood,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: "Create failed", error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  const { title, content, tags, mood } = req.body;

  const updated = await DiaryEntry.findByIdAndUpdate(
    req.params.id,
    { title, content, tags, mood },
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Entry not found" });
  res.json(updated);
};

// DELETE
exports.remove = async (req, res) => {
  const deleted = await DiaryEntry.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Entry not found" });
  res.json({ message: "Entry deleted" });
};

// Get diaries by user ID
exports.getDiariesByUserId = async (req, res) => {
  try {
    const diaries = await DiaryEntry.find({ user: req.params.userId }).populate(
      "user",
      "-password"
    );

    if (!diaries.length) {
      return res
        .status(404)
        .json({ message: "No diaries found for this user." });
    }

    res.json(diaries);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch diaries", error: err.message });
  }
};

// Get diaries by user and specific date
exports.getByUserAndDate = async (req, res) => {
  const { userId, date } = req.params;

  try {
    // Normalize the date to match only that day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const entries = await DiaryEntry.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ date: -1 });

    res.json(entries);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching diaries", error: err.message });
  }
};

exports.getByUserAndMood = async (req, res) => {
  const { userId, moodType } = req.params;

  try {
    const entries = await DiaryEntry.find({
      user: userId,
      "mood.moodType": moodType,
    }).sort({ date: -1 });

    res.json(entries);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching diaries by mood", error: err.message });
  }
};

// Search diaries for authenticated user
exports.searchDiaries = async (req, res) => {

  const { q } = req.query;
  const userId = req.user?._id;

  if (!q) return res.status(400).json({ message: "Search query is required." });
  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  try {
    const regex = new RegExp(q, "i");
    const entries = await DiaryEntry.find({
      user: userId,
      $or: [
        { title: { $regex: regex } },
        { content: { $regex: regex } },
        { tags: { $elemMatch: { $regex: regex } } },
      ],
    }).sort({ date: -1 });

    res.json({ success: true, entries });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Search failed", error: err.message });
  }
};
