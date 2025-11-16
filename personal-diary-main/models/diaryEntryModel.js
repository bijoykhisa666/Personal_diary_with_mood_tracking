const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  moodType: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'neutral', 'excited', 'tired'],
    required: true,
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
});

const fileSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileSize: Number,
  fileType: String,
});



const diaryEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }],
    mood: moodSchema,
    // ✅ Add this for file uploads
    files: [fileSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
