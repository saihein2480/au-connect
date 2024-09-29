// src/app/api/announcement/route.js

import dbConnect from "@/app/utils/dbConnect";
import Announcement from '@/app/models/Announcement';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET: Fetch all announcements
export async function GET() {
  try {
    await dbConnect();
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ message: 'Failed to fetch announcements', error }, { status: 500 });
  }
}

// POST: Create a new announcement
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const coverImage = formData.get('coverImage');

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    let coverImageName = null;
    if (coverImage) {
      // Generate a unique name for the image
      coverImageName = `${Date.now()}-${coverImage.name}`;

      // Create the uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save the file to the uploads directory
      const filePath = path.join(uploadDir, coverImageName);
      const fileBuffer = Buffer.from(await coverImage.arrayBuffer());
      fs.writeFileSync(filePath, fileBuffer);
    }

    // Save the announcement with the cover image name
    const newAnnouncement = new Announcement({
      title,
      content,
      coverImage: coverImageName,
    });

    await newAnnouncement.save();
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ message: 'Failed to create announcement', error }, { status: 500 });
  }
}