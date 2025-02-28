// import { writeFile, mkdir, unlink } from "fs/promises";
// import { join } from "path";
// import { NextResponse } from "next/server";

// // Helper function to delete old image
// async function deleteOldImage(oldPath) {
//   if (!oldPath) return;

//   try {
//     const fullPath = join(process.cwd(), "public", oldPath);
//     await unlink(fullPath);
//   } catch (error) {
//     console.error("Error deleting old image:", error);
//   }
// }

// // Define the POST handler
// export async function POST(request) {
//   try {
//     const data = await request.json();
//     const { image, oldImagePath } = data;

//     // Delete old image if it exists
//     if (oldImagePath) {
//       await deleteOldImage(oldImagePath);
//     }

//     // Create products directory if it doesn't exist
//     const uploadDir = join(process.cwd(), "public", "products");
//     await mkdir(uploadDir, { recursive: true });

//     // Generate unique filename
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileExtension = ".jpg"; // You can enhance this to handle different file types
//     const filename = `product-${uniqueSuffix}${fileExtension}`;
//     const relativePath = `/products/${filename}`;
//     const fullPath = join(uploadDir, filename);

//     // Convert base64 to buffer and save
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64Data, "base64");
//     await writeFile(fullPath, buffer);

//     return NextResponse.json({ imagePath: relativePath });
//   } catch (error) {
//     console.error("Error handling upload:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// app/api/upload/route.js
import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const { image, oldImagePath } = await request.json();

    // Delete old image if it exists
    if (oldImagePath) {
      try {
        const oldFullPath = path.join(process.cwd(), "public", oldImagePath);
        await unlink(oldFullPath);
      } catch (error) {
        console.error("Error deleting old image:", error);
        // Continue with upload even if delete fails
      }
    }

    // Create products directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "products");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = ".jpg"; // You can enhance this to handle different file types
    const filename = `product-${uniqueSuffix}${fileExtension}`;
    const relativePath = `/products/${filename}`;
    const fullPath = path.join(uploadDir, filename);

    // Convert base64 to buffer and save
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    await writeFile(fullPath, buffer);

    return NextResponse.json({ imagePath: relativePath });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json(
        { error: "Image path is required" },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), "public", imagePath);
    await unlink(fullPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
