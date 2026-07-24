// backend/src/controllers/ad.controller.ts
import { Request, Response } from 'express';
import adService from '../services/ad.service';   // ← Singular

const adController = {
  async getAllAds(req: Request, res: Response) {
    try {
      const ads = await adService.getAllAds();
      res.json(ads);
    } catch (error: any) {
      console.error('💥 Get All Ads Error:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ message: 'Failed to fetch ads' });
    }
  },

  async getAdById(req: Request, res: Response) {
    try {
      const ad = await adService.getAdById(req.params.id as string);
      if (!ad) return res.status(404).json({ message: 'Ad not found' });
      res.json(ad);
    } catch (error: any) {
      console.error('💥 Get Ad By ID Error:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ message: 'Failed to fetch ad' });
    }
  },

  async createAd(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const isAdmin = (req as any).user?.isAdmin;
      const isAdminPost = req.body.isAdminPost === 'true';
      
      if (!userId) return res.status(401).json({ message: 'Authentication required' });

      // Pass admin flag to service so it can auto-approve
      const ad = await adService.createAd(userId, req.body, isAdmin && isAdminPost);
      res.status(201).json({ message: 'Ad created successfully', ad });
    } catch (error: any) {
      console.error('💥 Create Ad Error:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('Full error:', JSON.stringify(error, null, 2));
      res.status(500).json({ message: error.message || 'Failed to create ad' });
    }
  },

  async getMyAds(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const ads = await adService.getMyAds(userId);
      res.json(ads);
    } catch (error: any) {
      console.error('💥 Get My Ads Error:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ message: 'Failed to fetch your ads' });
    }
  },

  async updateAd(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const adId = req.params.id as string;
      
      if (!userId) return res.status(401).json({ message: 'Authentication required' });

      const ad = await adService.updateAd(adId, userId, req.body);
      res.json({ message: 'Ad updated successfully', ad });
    } catch (error: any) {
      console.error('💥 Update Ad Error:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      if (error.message === 'Ad not found') {
        return res.status(404).json({ message: 'Ad not found' });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: 'You can only update your own ads' });
      }
      
      res.status(500).json({ message: error.message || 'Failed to update ad' });
    }
  },

  async deleteAd(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const adId = req.params.id as string;
      
      if (!userId) return res.status(401).json({ message: 'Authentication required' });

      await adService.deleteAd(adId, userId);
      res.json({ message: 'Ad deleted successfully' });
    } catch (error: any) {
      console.error('💥 Delete Ad Error:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      if (error.message === 'Ad not found') {
        return res.status(404).json({ message: 'Ad not found' });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: 'You can only delete your own ads' });
      }
      
      res.status(500).json({ message: error.message || 'Failed to delete ad' });
    }
  }
};

export default adController;