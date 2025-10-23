import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const icon = formData.get("icon") as File;

    if (!icon) {
      return NextResponse.json(
        { error: "No icon file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
    if (!allowedTypes.includes(icon.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPG, SVG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (icon.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }

    // Get the file buffer
    const bytes = await icon.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the path to save the icon
    const publicIconsPath = path.join(process.cwd(), "public", "icons");

    // Ensure the icons directory exists
    try {
      await fs.access(publicIconsPath);
    } catch {
      await fs.mkdir(publicIconsPath, { recursive: true });
    }

    // Save the file
    const filePath = path.join(publicIconsPath, icon.name);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "Icon uploaded successfully",
      filename: icon.name,
      path: `/icons/${icon.name}`,
    });
  } catch (error) {
    console.error("Error uploading icon:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload icon" },
      { status: 500 }
    );
  }
}
