// backend/src/controllers/ad.controller.ts
import { Request, Response } from 'express';
import adService from '../services/ad.service';   // ← Singular

const adController = {
  async getAllAds(req: Request, res: Response) {
    try {
      const ads = await adService.getAllAds();
      res.json(ads);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch ads' });
    }
  },

  async getAdById(req: Request, res: Response) {
    try {
      const ad = await adService.getAdById(req.params.id);
      if (!ad) return res.status(404).json({ message: 'Ad not found' });
      res.json(ad);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch ad' });
    }
  },

  async createAd(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ message: 'Authentication required' });

      const ad = await adService.createAd(userId, req.body);
      res.status(201).json({ message: 'Ad created successfully', ad });
    } catch (error: any) {
      console.error('Create Ad Error:', error);
      res.status(500).json({ message: error.message || 'Failed to create ad' });
    }
  },

  async getMyAds(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const ads = await adService.getMyAds(userId);
      res.json(ads);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch your ads' });
    }
  }
};

export default adController;