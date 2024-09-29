// src/app/api/announcement/[id]/route.js

import dbConnect from "@/app/utils/dbConnect";
import Announcement from '@/app/models/Announcement';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

// GET: Fetch a specific announcement by ID
export async function GET(req, { params }) {
  const { id } = params;
  await dbConnect();

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid announcement ID' }, { status: 400 });
  }

  try {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json({ message: 'Failed to fetch announcement', error }, { status: 500 });
  }
}


// PUT: Update an existing announcement
export async function PUT(req, { params }) {
    const { id } = params;
    await dbConnect();
  
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid announcement ID' }, { status: 400 });
    }
  
    try {
      const formData = await req.formData();
      const title = formData.get('title');
      const content = formData.get('content');
      const coverImage = formData.get('coverImage');
  
      if (!title || !content) {
        return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
      }
  
      const updatedData = { title, content };
      if (coverImage) {
        const coverImageName = `${Date.now()}-${coverImage.name}`;
  
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
  
        const filePath = path.join(uploadDir, coverImageName);
        const fileBuffer = Buffer.from(await coverImage.arrayBuffer());
        fs.writeFileSync(filePath, fileBuffer);
  
        updatedData.coverImage = coverImageName;
      }
  
      const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedAnnouncement) {
        return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
      }
  
      return NextResponse.json(updatedAnnouncement);
    } catch (error) {
      console.error('Error updating announcement:', error);
      return NextResponse.json({ message: 'Failed to update announcement', error }, { status: 500 });
    }
  }

// DELETE: Delete an existing announcement by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  await dbConnect();

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid announcement ID' }, { status: 400 });
  }

  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ message: 'Failed to delete announcement', error }, { status: 500 });
  }
}
