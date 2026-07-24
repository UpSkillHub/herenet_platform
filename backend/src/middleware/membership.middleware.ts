import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        isAdmin: boolean;
        isMember?: boolean;
      };
    }
  }
}

/**
 * Middleware to check if user is a member (can post ads/products)
 * Members have isMember=true OR isAdmin=true
 */
export const requireMember = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required' 
    });
  }

  // Admins automatically have member privileges
  if (user.isAdmin || user.isMember) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Member access required',
    message: 'You need to be a member to post ads and products. Please upgrade your account to member status.',
    code: 'MEMBER_REQUIRED'
  });
};

/**
 * Middleware to check if user owns the resource (ad/product)
 * Use this after requireMember to ensure members only edit their own items
 */
export const requireOwnership = (resourceKey: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const resourceUserId = req.body[resourceKey] || req.params[resourceKey];

    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // Admins can access any resource
    if (user.isAdmin) {
      return next();
    }

    // Check if user owns the resource
    if (user.userId !== resourceUserId) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You can only manage your own resources.',
        code: 'OWNERSHIP_REQUIRED'
      });
    }

    next();
  };
};
