// backend/src/controllers/upload.controller.ts
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const uploadController = {
  async uploadImages(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Save file
        fs.writeFileSync(filepath, file.buffer);

        // Public URL
        const publicUrl = `/uploads/${filename}`;
        uploadedUrls.push(publicUrl);
      }

      res.status(200).json({
        message: 'Images uploaded successfully',
        urls: uploadedUrls,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Image upload failed' });
    }
  }
};

export default uploadController;