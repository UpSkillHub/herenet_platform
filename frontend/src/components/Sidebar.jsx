import React, { useState } from 'react';
import { 
  LayoutDashboard, BarChart3, MessageSquare, 
  Store, Zap, HelpCircle, Search, 
  ChevronDown, ChevronUp, Layers, 
  Laptop, Shirt, Home, Sparkles, ShoppingCart, 
  Dumbbell, Wrench, Baby, BookOpen, Package
} from 'lucide-react';

export default function Sidebar({ userRole = 'buyer', activeTab, setActiveTab }) {
  // State to manage whether the Categories dropdown is open or closed
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Predefined hierarchical list of platform categories and subcategories
  const categoriesList = [
    {
      id: 'cat-electronics',
      label: 'Electronics',
      icon: Laptop,
      subcategories: [
        { id: 'phones', label: 'Phones' },
        { id: 'laptops', label: 'Laptops' },
        { id: 'tablets', label: 'Tablets' },
        { id: 'accessories', label: 'Accessories' },
        { id: 'gaming', label: 'Gaming' },
      ]
    },
    {
      id: 'cat-fashion',
      label: 'Fashion & Apparel',
      icon: Shirt,
      subcategories: [
        { id: 'mens-clothing', label: "Men's Clothing" },
        { id: 'womens-clothing', label: "Women's Clothing" },
        { id: 'shoes', label: 'Shoes' },
        { id: 'bags', label: 'Bags' },
        { id: 'jewelry', label: 'Jewelry' },
        { id: 'watches', label: 'Watches' },
      ]
    },
    {
      id: 'cat-home',
      label: 'Home & Living',
      icon: Home,
      subcategories: [
        { id: 'furniture', label: 'Furniture' },
        { id: 'home-decor', label: 'Home Decor' },
        { id: 'kitchen-dining', label: 'Kitchen & Dining' },
        { id: 'bedding', label: 'Bedding' },
        { id: 'storage', label: 'Storage' },
      ]
    },
    {
      id: 'cat-health',
      label: 'Health & Beauty',
      icon: Sparkles,
      subcategories: [
        { id: 'skincare', label: 'Skincare' },
        { id: 'makeup', label: 'Makeup' },
        { id: 'hair-care', label: 'Hair Care' },
        { id: 'perfumes', label: 'Perfumes' },
        { id: 'personal-care', label: 'Personal Care' },
      ]
    },
    {
      id: 'cat-groceries',
      label: 'Groceries & Food',
      icon: ShoppingCart,
      subcategories: [
        { id: 'fresh-food', label: 'Fresh Food' },
        { id: 'beverages', label: 'Beverages' },
        { id: 'snacks', label: 'Snacks' },
        { id: 'pantry-items', label: 'Pantry Items' },
        { id: 'organic-products', label: 'Organic Products' },
      ]
    },
    {
      id: 'cat-sports',
      label: 'Sports & Outdoors',
      icon: Dumbbell,
      subcategories: [
        { id: 'fitness-equipment', label: 'Fitness Equipment' },
        { id: 'sportswear', label: 'Sportswear' },
        { id: 'camping-gear', label: 'Camping Gear' },
        { id: 'cycling', label: 'Cycling' },
        { id: 'outdoor-equipment', label: 'Outdoor Equipment' },
      ]
    },
    {
      id: 'cat-automotive',
      label: 'Automotive',
      icon: Wrench,
      subcategories: [
        { id: 'car-accessories', label: 'Car Accessories' },
        { id: 'spare-parts', label: 'Spare Parts' },
        { id: 'motor-oils', label: 'Motor Oils' },
        { id: 'motorcycle-accessories', label: 'Motorcycle Accessories' },
        { id: 'car-electronics', label: 'Car Electronics' },
      ]
    },
    {
      id: 'cat-kids',
      label: 'Baby & Kids',
      icon: Baby,
      subcategories: [
        { id: 'baby-clothing', label: 'Baby Clothing' },
        { id: 'toys', label: 'Toys' },
        { id: 'baby-care', label: 'Baby Care' },
        { id: 'school-supplies', label: 'School Supplies' },
        { id: 'strollers', label: 'Strollers' },
      ]
    },
    {
      id: 'cat-books',
      label: 'Books, Office & Education',
      icon: BookOpen,
      subcategories: [
        { id: 'books', label: 'Books' },
        { id: 'stationery', label: 'Stationery' },
        { id: 'office-supplies', label: 'Office Supplies' },
        { id: 'educational-materials', label: 'Educational Materials' },
        { id: 'art-supplies', label: 'Art Supplies' },
      ]
    },
    {
      id: 'cat-misc',
      label: 'Other / Miscellaneous',
      icon: Package,
      subcategories: [
        { id: 'gifts', label: 'Gifts' },
        { id: 'handmade-products', label: 'Handmade Products' },
        { id: 'collectibles', label: 'Collectibles' },
        { id: 'seasonal-items', label: 'Seasonal Items' },
        { id: 'other-products', label: "Products that don't fit elsewhere" },
      ]
    }
  ];

  // Menu navigation groups
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: '•' },
  ];

  const storesOrCategories = userRole === 'admin' ? [
    { id: 'all-stores', label: 'All Vendor Stores', icon: Store },
    { id: 'all-ads', label: 'Ad Campaigns', icon: Zap },
  ] : [
    { id: 'fashion-hive', label: 'Fashion Hive', icon: Store },
    { id: 'health-mart', label: 'HealthMart', icon: Store },
    { id: 'technest', label: 'TechNest', icon: Zap },
  ];

  // Helper to check if any subcategory or main category is currently active
  const isCategoryActive = categoriesList.some(cat => 
    cat.id === activeTab || cat.subcategories.some(sub => sub.id === activeTab)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-blue-200">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">Shopacla</span>
      </div>

      {/* Search Input Box */}
      <div className="px-4 mb-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-thin">
        {/* MENU SECTION */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</p>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                  isActive 
                    ? 'bg-blue-50/80 text-blue-600 font-semibold shadow-xs' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
              </button>
            );
          })}

          {/* CATEGORIES ACCORDION ITEM */}
          <div>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                isCategoryActive || isCategoriesOpen
                  ? 'bg-blue-50/40 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-4 h-4 ${isCategoryActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Categories</span>
              </div>
              {isCategoriesOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>

            {/* Sub-list of Categories with Subcategories */}
            {isCategoriesOpen && (
              <div className="pl-4 pt-1 space-y-3 border-l-2 border-blue-100 ml-4 my-1">
                {categoriesList.map((category) => {
                  const CatIcon = category.icon;
                  const isMainCatActive = activeTab === category.id;
                  
                  return (
                    <div key={category.id} className="space-y-1">
                      {/* Main Category Header */}
                      <button
                        onClick={() => setActiveTab && setActiveTab(category.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-bold text-xs transition ${
                          isMainCatActive 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <CatIcon className={`w-3.5 h-3.5 ${isMainCatActive ? 'text-white' : 'text-blue-500'}`} />
                        <span className="truncate">{category.label}</span>
                      </button>

                      {/* Subcategories List */}
                      <div className="pl-4 space-y-0.5 border-l border-gray-100 ml-2">
                        {category.subcategories.map((sub) => {
                          const isSubActive = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setActiveTab && setActiveTab(sub.id)}
                              className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] font-medium transition ${
                                isSubActive
                                  ? 'bg-blue-50 text-blue-600 font-bold'
                                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* STORES / MANAGEMENT SECTION */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            {userRole === 'admin' ? 'Platform Management' : 'Stores'}
          </p>
          {storesOrCategories.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                  isActive 
                    ? 'bg-blue-50/80 text-blue-600 font-semibold shadow-xs' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* OTHERS SECTION */}
        <div className="space-y-1 pb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Others</p>
          <button
            onClick={() => setActiveTab && setActiveTab('help')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition ${
              activeTab === 'help' ? 'bg-blue-50/80 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Get Help</span>
          </button>
        </div>
      </div>
    </aside>
  );
}