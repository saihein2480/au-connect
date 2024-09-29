// src/app/api/contacts/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Contact from '@/app/models/Contact';
import fs from 'fs';
import path from 'path';

// GET: Fetch a specific contact by ID
export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params; // Get contact ID from dynamic route

  if (!id) {
    return NextResponse.json({ message: 'Contact ID is required' }, { status: 400 });
  }

  try {
    // Fetch the contact by ID
    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch contact', error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing contact
export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params; // Get contact ID from dynamic route

  if (!id) {
    return NextResponse.json({ message: 'Contact ID is required' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const faculty = formData.get('faculty');
    const role = formData.get('role');
    const department = formData.get('department');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const facebook = formData.get('facebook');
    const line = formData.get('line');
    const profilePicture = formData.get('profilePicture');

    if (!name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let profilePicturePath = null;

    if (profilePicture && profilePicture.size > 0) {
      const profilePictureName = `${Date.now()}-${profilePicture.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, profilePictureName);
      const fileBuffer = Buffer.from(await profilePicture.arrayBuffer());
      fs.writeFileSync(filePath, fileBuffer);
      profilePicturePath = `${profilePictureName}`;
    }

    // Find and update the contact
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        name,
        faculty,
        role,
        department,
        email,
        phone,
        facebook,
        line,
        profilePicture: profilePicturePath || undefined, // Update only if a new picture is provided
      },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update contact', error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a contact by ID
export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = params; // Get contact ID from dynamic route

  if (!id) {
    return NextResponse.json({ message: 'Contact ID is required' }, { status: 400 });
  }

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete contact', error: error.message }, { status: 500 });
  }
}
