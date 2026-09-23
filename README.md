# Personal Diary with Mood Tracking

In today's fast-paced world, mental well-being has become increasingly important. Many people experience stress, anxiety, and emotional challenges but often lack a simple way to reflect on their feelings. The project was developed to support emotional self-awareness by allowing users to record their daily experiences and manually track their moods. By reviewing past entries and mood patterns, users can better understand their emotions, recognize trends, and build healthier self-reflection habits. While the application is not a substitute for professional mental health care, it serves as a practical tool for promoting mindfulness and personal well-being.

## Project Overview
Personal Diary with Mood Tracking gives users a dedicated space to document everyday moments and record how they feel. Reviewing entries and mood history can help users notice recurring patterns and make self-reflection part of their routine.
The application is designed for personal reflection and mindfulness. It does not provide medical advice or replace professional mental health care.
## Features

- **Diary entries:** Create, edit, and review personal journal entries.
- **Photo attachments:** Add photos to entries, with media stored using Amazon S3.
- **Manual mood logging:** Record a mood and rate its intensity on a scale from 1 to 10.
- **Mood tags:** Organize mood records with labels such as work, family, or health.
- **Mood history and insights:** Explore recorded activity through charts, timelines, and calendar views.
- **Account security:** Support for JWT-based authentication and Google OAuth, with password encryption.

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | Next.js 15, Chakra UI |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Media storage | Amazon S3 |
| Authentication | JWT, Google OAuth |

## How It Works

1. Users write a diary entry about their day.
2. They record a mood and choose an intensity rating.
3. Optional tags and photos can add context to an entry.
4. Users revisit their diary and mood history to reflect on changes over time.

## Development Methodology

The project was planned using the Waterfall methodology, with work organized into stages: requirements analysis, design, implementation, and deployment.

The feasibility assessment considered the technical requirements and project costs, including the use of open-source technologies and free-tier hosting options.

## Future Improvements

- Add machine learning for deeper sentiment analysis
- Support offline access
- Add voice input for journaling

## Privacy and Well-being

Diary entries and mood records can contain sensitive personal information. The application is intended to help users reflect on their own experiences. Users should seek qualified professional support for mental health concerns.

## Disclaimer

This application is for journaling, mindfulness, and personal reflection only. It does not diagnose, treat, or prevent any medical or mental health condition, and it is not a substitute for professional care.


