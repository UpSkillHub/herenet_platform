// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// ==================== DATA STORAGE ====================
// In-memory storage (replace with database in production)
let users = [
  { 
    id: 1, 
    name: 'Admin User', 
    email: 'admin@herenet.com', 
    password: 'admin123', 
    isAdmin: true, 
    phone: '0788000000',
    createdAt: new Date().toISOString()
  },
  { 
    id: 2, 
    name: 'John Doe', 
    email: 'john@gmail.com', 
    password: '123456', 
    isAdmin: false, 
    phone: '0788000001',
    createdAt: new Date().toISOString()
  }
];

let ads = [
  { 
    id: 1, 
    title: 'iPhone 14 Pro - Like New', 
    price: 850000, 
    location: 'Kigali',
    description: 'Excellent condition iPhone 14 Pro, 256GB, Space Black. Comes with original box and charger. No scratches, battery health 98%.',
    status: 'active',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1591332936885-8ebf4e2a51d6?w=800'
    ],
    createdAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 2,
    categoryId: 1,
    views: 45
  },
  { 
    id: 2, 
    title: 'Senior Software Engineer - Full Stack', 
    price: 800000, 
    location: 'Kigali',
    description: 'Looking for an experienced software developer with React, Node.js, and TypeScript skills. Remote work available.',
    status: 'pending',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'
    ],
    createdAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 1,
    categoryId: 3,
    views: 23
  },
  { 
    id: 3, 
    title: 'Modern 2-Bedroom Apartment for Rent', 
    price: 350000, 
    location: 'Kigali Heights',
    description: 'Beautiful 2 bedroom apartment with stunning city view. Fully furnished, 24/7 security, parking included.',
    status: 'active',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    createdAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 2,
    categoryId: 4,
    views: 67
  },
  { 
    id: 4, 
    title: 'Toyota RAV4 2022 - Low Mileage', 
    price: 25000000, 
    location: 'Kigali',
    description: 'Well-maintained Toyota RAV4, 2022 model, 25,000 km. Clean title, full service history.',
    status: 'pending',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1553440567-4c1eace7a96b?w=800'
    ],
    createdAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 1,
    categoryId: 5,
    views: 12
  },
  { 
    id: 5, 
    title: 'Wedding Photography Services', 
    price: 150000, 
    location: 'Kigali',
    description: 'Professional wedding photography package. Includes engagement shoot, full wedding day coverage, and edited digital photos.',
    status: 'active',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1519743813073-8b12ae4ab0a5?w=800',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'
    ],
    createdAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 2,
    categoryId: 2,
    views: 34
  }
];

let nextAdId = 6;
let nextUserId = 3;

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  
  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }
  
  // Create new user
  const newUser = {
    id: nextUserId++,
    name,
    email,
    password,
    isAdmin: false,
    phone: phone || '',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Generate token
  const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');
  
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      phone: newUser.phone
    }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  // Generate simple token
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone
    }
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const userId = parseInt(decoded.split(':')[0]);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ==================== ADS ROUTES ====================

// Get all ads with filters
app.get('/api/ads', (req, res) => {
  let { categoryId, location, search, sort, myAds, userId } = req.query;
  let filteredAds = [...ads];
  
  // Filter by user (for dashboard)
  if (myAds === 'true' && userId) {
    filteredAds = filteredAds.filter(ad => ad.userId === parseInt(userId));
  }
  
  // Filter by category
  if (categoryId) {
    filteredAds = filteredAds.filter(ad => ad.categoryId === parseInt(categoryId));
  }
  
  // Filter by location
  if (location) {
    filteredAds = filteredAds.filter(ad => 
      ad.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // Search by title or description
  if (search) {
    const searchLower = search.toLowerCase();
    filteredAds = filteredAds.filter(ad => 
      ad.title.toLowerCase().includes(searchLower) ||
      ad.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort
  if (sort === 'price-low') {
    filteredAds.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filteredAds.sort((a, b) => b.price - a.price);
  } else if (sort === 'latest') {
    filteredAds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'featured') {
    filteredAds.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  } else {
    // Default: latest first
    filteredAds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  res.json(filteredAds);
});

// Get single ad
app.get('/api/ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ad = ads.find(a => a.id === id);
  
  if (!ad) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  
  // Increment view count
  ad.views = (ad.views || 0) + 1;
  
  res.json(ad);
});

// Create ad
app.post('/api/ads', (req, res) => {
  const { title, description, price, location, categoryId, days, isFeatured, images } = req.body;
  
  // Get user from token
  const authHeader = req.headers.authorization;
  let userId = 2; // Default user
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        userId = parseInt(decoded.split(':')[0]);
      } catch (e) {
        // Use default
      }
    }
  }
  
  const newAd = {
    id: nextAdId++,
    title: title || '',
    description: description || '',
    price: parseFloat(price) || 0,
    location: location || '',
    categoryId: parseInt(categoryId) || 1,
    status: 'pending',
    isFeatured: isFeatured === 'true',
    images: images || [],
    createdAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + (parseInt(days) || 30) * 24 * 60 * 60 * 1000).toISOString(),
    userId: userId,
    views: 0
  };
  
  ads.push(newAd);
  console.log(`✅ New ad created: ${newAd.title} (ID: ${newAd.id})`);
  
  res.status(201).json(newAd);
});

// Update ad
app.put('/api/ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = ads.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  
  // Check authorization (optional)
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        const userId = parseInt(decoded.split(':')[0]);
        const isAdmin = users.find(u => u.id === userId)?.isAdmin || false;
        
        if (!isAdmin && ads[index].userId !== userId) {
          return res.status(403).json({ message: 'You can only edit your own ads' });
        }
      } catch (e) {
        // Continue
      }
    }
  }
  
  ads[index] = { ...ads[index], ...req.body, id: ads[index].id };
  res.json(ads[index]);
});

// Approve ad (admin only)
app.put('/api/ads/:id/approve', (req, res) => {
  const id = parseInt(req.params.id);
  const index = ads.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  
  ads[index].status = 'approved';
  console.log(`✅ Ad approved: ${ads[index].title} (ID: ${id})`);
  
  res.json({ message: 'Ad approved successfully', ad: ads[index] });
});

// Reject ad (admin only)
app.put('/api/ads/:id/reject', (req, res) => {
  const id = parseInt(req.params.id);
  const index = ads.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  
  ads[index].status = 'rejected';
  console.log(`❌ Ad rejected: ${ads[index].title} (ID: ${id})`);
  
  res.json({ message: 'Ad rejected successfully', ad: ads[index] });
});

// Delete ad
app.delete('/api/ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = ads.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  
  const deletedAd = ads[index];
  ads.splice(index, 1);
  console.log(`🗑️ Ad deleted: ${deletedAd.title} (ID: ${id})`);
  
  res.json({ message: 'Ad deleted successfully' });
});

// Get user's ads
app.get('/api/ads/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userAds = ads.filter(ad => ad.userId === userId);
  res.json(userAds);
});

// ==================== CATEGORIES ====================
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Products', icon: '📦', count: ads.filter(a => a.categoryId === 1).length },
    { id: 2, name: 'Services', icon: '🔧', count: ads.filter(a => a.categoryId === 2).length },
    { id: 3, name: 'Jobs', icon: '💼', count: ads.filter(a => a.categoryId === 3).length },
    { id: 4, name: 'Real Estate', icon: '🏠', count: ads.filter(a => a.categoryId === 4).length },
    { id: 5, name: 'Vehicles', icon: '🚗', count: ads.filter(a => a.categoryId === 5).length },
    { id: 6, name: 'Electronics', icon: '📱', count: ads.filter(a => a.categoryId === 6).length },
    { id: 7, name: 'Furniture', icon: '🛋️', count: ads.filter(a => a.categoryId === 7).length },
    { id: 8, name: 'Clothing', icon: '👕', count: ads.filter(a => a.categoryId === 8).length }
  ];
  res.json(categories);
});

// ==================== STATS ====================
app.get('/api/stats', (req, res) => {
  const stats = {
    totalAds: ads.length,
    activeAds: ads.filter(a => a.status === 'active' || a.status === 'approved').length,
    pendingAds: ads.filter(a => a.status === 'pending').length,
    totalUsers: users.length,
    totalRevenue: ads.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.price, 0)
  };
  res.json(stats);
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    adsCount: ads.length,
    usersCount: users.length
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 HereNet Backend Server`);
  console.log(`========================================`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`========================================`);
  console.log(`\n📋 Test Credentials:`);
  console.log(`   👑 Admin:  admin@herenet.com / admin123`);
  console.log(`   👤 User:   john@gmail.com / 123456`);
  console.log(`\n📍 API Endpoints:`);
  console.log(`   ┌─────────────────────────────────────────┐`);
  console.log(`   │ ADS                                     │`);
  console.log(`   ├─────────────────────────────────────────┤`);
  console.log(`   │ GET    /api/ads                         │`);
  console.log(`   │ GET    /api/ads/:id                     │`);
  console.log(`   │ POST   /api/ads                         │`);
  console.log(`   │ PUT    /api/ads/:id                     │`);
  console.log(`   │ PUT    /api/ads/:id/approve             │`);
  console.log(`   │ PUT    /api/ads/:id/reject              │`);
  console.log(`   │ DELETE /api/ads/:id                     │`);
  console.log(`   ├─────────────────────────────────────────┤`);
  console.log(`   │ AUTH                                    │`);
  console.log(`   ├─────────────────────────────────────────┤`);
  console.log(`   │ POST   /api/auth/login                  │`);
  console.log(`   │ POST   /api/auth/register               │`);
  console.log(`   │ GET    /api/auth/me                     │`);
  console.log(`   ├─────────────────────────────────────────┤`);
  console.log(`   │ OTHER                                   │`);
  console.log(`   ├─────────────────────────────────────────┤`);
  console.log(`   │ GET    /api/categories                  │`);
  console.log(`   │ GET    /api/stats                       │`);
  console.log(`   │ GET    /api/health                      │`);
  console.log(`   └─────────────────────────────────────────┘`);
  console.log(`\n💡 Tip: Use Postman or curl to test the endpoints`);
  console.log(`   Example: curl http://localhost:${PORT}/api/health\n`);
});