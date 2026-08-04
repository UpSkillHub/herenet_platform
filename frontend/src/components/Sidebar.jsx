import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Store,
  Zap,
  HelpCircle,
  Search,
  ChevronDown,
  Laptop,
  Shirt,
  Home,
  Sparkles,
  ShoppingCart,
  Dumbbell,
  Wrench,
  Baby,
  BookOpen,
  Package,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  userRole = 'buyer',
  activeTab,
  setActiveTab,
  onNavigate
}) {

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categoriesList = [
    {
      id: 'cat-electronics',
      path: 'electronics',
      label: 'Electronics',
      icon: Laptop,
      subcategories: [
        { id: 'phones', path: 'electronics/phones', label: 'Phones' },
        { id: 'laptops', path: 'electronics/laptops', label: 'Laptops' },
        { id: 'tablets', path: 'electronics/tablets', label: 'Tablets' },
        { id: 'accessories', path: 'electronics/accessories', label: 'Accessories' },
        { id: 'gaming', path: 'electronics/gaming', label: 'Gaming' }
      ]
    },

    {
      id: 'cat-fashion',
      path: 'fashion',
      label: 'Fashion & Apparel',
      icon: Shirt,
      subcategories: [
        {
          id: 'mens-clothing',
          path: 'fashion/mens-clothing',
          label: "Men's Clothing"
        },
        {
          id: 'womens-clothing',
          path: 'fashion/womens-clothing',
          label: "Women's Clothing"
        },
        {
          id: 'shoes',
          path: 'fashion/shoes',
          label: 'Shoes'
        },
        {
          id: 'bags',
          path: 'fashion/bags',
          label: 'Bags'
        },
        {
          id: 'jewelry',
          path: 'fashion/jewelry',
          label: 'Jewelry'
        },
        {
          id: 'watches',
          path: 'fashion/watches',
          label: 'Watches'
        }
      ]
    },

    {
      id: 'cat-home',
      path: 'home-living',
      label: 'Home & Living',
      icon: Home,
      subcategories: [
        {
          id: 'furniture',
          path: 'home-living/furniture',
          label: 'Furniture'
        },
        {
          id: 'home-decor',
          path: 'home-living/home-decor',
          label: 'Home Decor'
        },
        {
          id: 'kitchen-dining',
          path: 'home-living/kitchen-dining',
          label: 'Kitchen & Dining'
        },
        {
          id: 'bedding',
          path: 'home-living/bedding',
          label: 'Bedding'
        },
        {
          id: 'storage',
          path: 'home-living/storage',
          label: 'Storage'
        }
      ]
    },

    {
      id: 'cat-health',
      path: 'health-beauty',
      label: 'Health & Beauty',
      icon: Sparkles,
      subcategories: [
        {
          id: 'skincare',
          path: 'health-beauty/skincare',
          label: 'Skincare'
        },
        {
          id: 'makeup',
          path: 'health-beauty/makeup',
          label: 'Makeup'
        },
        {
          id: 'hair-care',
          path: 'health-beauty/hair-care',
          label: 'Hair Care'
        },
        {
          id: 'perfumes',
          path: 'health-beauty/perfumes',
          label: 'Perfumes'
        },
        {
          id: 'personal-care',
          path: 'health-beauty/personal-care',
          label: 'Personal Care'
        }
      ]
    },

    {
      id: 'cat-groceries',
      path: 'groceries',
      label: 'Groceries & Food',
      icon: ShoppingCart,
      subcategories: [
        {
          id: 'fresh-food',
          path: 'groceries/fresh-food',
          label: 'Fresh Food'
        },
        {
          id: 'beverages',
          path: 'groceries/beverages',
          label: 'Beverages'
        },
        {
          id: 'snacks',
          path: 'groceries/snacks',
          label: 'Snacks'
        },
        {
          id: 'pantry-items',
          path: 'groceries/pantry-items',
          label: 'Pantry Items'
        },
        {
          id: 'organic-products',
          path: 'groceries/organic-products',
          label: 'Organic Products'
        }
      ]
    },

    {
      id: 'cat-sports',
      path: 'sports',
      label: 'Sports & Outdoors',
      icon: Dumbbell,
      subcategories: [
        {
          id: 'fitness-equipment',
          path: 'sports/fitness-equipment',
          label: 'Fitness Equipment'
        },
        {
          id: 'sportswear',
          path: 'sports/sportswear',
          label: 'Sportswear'
        },
        {
          id: 'camping-gear',
          path: 'sports/camping-gear',
          label: 'Camping Gear'
        },
        {
          id: 'cycling',
          path: 'sports/cycling',
          label: 'Cycling'
        },
        {
          id: 'outdoor-equipment',
          path: 'sports/outdoor-equipment',
          label: 'Outdoor Equipment'
        }
      ]
    },

    {
      id: 'cat-automotive',
      path: 'automotive',
      label: 'Automotive',
      icon: Wrench,
      subcategories: [
        {
          id: 'car-accessories',
          path: 'automotive/car-accessories',
          label: 'Car Accessories'
        },
        {
          id: 'spare-parts',
          path: 'automotive/spare-parts',
          label: 'Spare Parts'
        },
        {
          id: 'motor-oils',
          path: 'automotive/motor-oils',
          label: 'Motor Oils'
        },
        {
          id: 'motorcycle-accessories',
          path: 'automotive/motorcycle-accessories',
          label: 'Motorcycle Accessories'
        },
        {
          id: 'car-electronics',
          path: 'automotive/car-electronics',
          label: 'Car Electronics'
        }
      ]
    },

    {
      id: 'cat-kids',
      path: 'kids',
      label: 'Baby & Kids',
      icon: Baby,
      subcategories: [
        {
          id: 'baby-clothing',
          path: 'kids/baby-clothing',
          label: 'Baby Clothing'
        },
        {
          id: 'toys',
          path: 'kids/toys',
          label: 'Toys'
        },
        {
          id: 'baby-care',
          path: 'kids/baby-care',
          label: 'Baby Care'
        },
        {
          id: 'school-supplies',
          path: 'kids/school-supplies',
          label: 'School Supplies'
        },
        {
          id: 'strollers',
          path: 'kids/strollers',
          label: 'Strollers'
        }
      ]
    },

    {
      id: 'cat-books',
      path: 'books-education',
      label: 'Books, Office & Education',
      icon: BookOpen,
      subcategories: [
        {
          id: 'books',
          path: 'books-education/books',
          label: 'Books'
        },
        {
          id: 'stationery',
          path: 'books-education/stationery',
          label: 'Stationery'
        },
        {
          id: 'office-supplies',
          path: 'books-education/office-supplies',
          label: 'Office Supplies'
        },
        {
          id: 'educational-materials',
          path: 'books-education/educational-materials',
          label: 'Educational Materials'
        },
        {
          id: 'art-supplies',
          path: 'books-education/art-supplies',
          label: 'Art Supplies'
        }
      ]
    },

    {
      id: 'cat-misc',
      path: 'miscellaneous',
      label: 'Other / Miscellaneous',
      icon: Package,
      subcategories: [
        {
          id: 'gifts',
          path: 'miscellaneous/gifts',
          label: 'Gifts'
        },
        {
          id: 'handmade-products',
          path: 'miscellaneous/handmade-products',
          label: 'Handmade Products'
        },
        {
          id: 'collectibles',
          path: 'miscellaneous/collectibles',
          label: 'Collectibles'
        },
        {
          id: 'seasonal-items',
          path: 'miscellaneous/seasonal-items',
          label: 'Seasonal Items'
        },
        {
          id: 'other-products',
          path: 'miscellaneous/other-products',
          label: "Products that don't fit elsewhere"
        }
      ]
    }
  ];


  // =====================================================
  // NORMAL MENU ITEMS
  // =====================================================

  const menuItems = [
    {
      id: 'dashboard',
      path: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'analytics',
      path: 'analytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      id: 'chat',
      path: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      badge: '•'
    }
  ];


  // =====================================================
  // STATE
  // =====================================================

  const [selectedCategory, setSelectedCategory] = useState(
    categoriesList[0]
  );

  const [isCategorySelectorOpen, setIsCategorySelectorOpen] =
    useState(false);


  // =====================================================
  // NORMAL NAVIGATION
  // =====================================================

  const handleNavigation = (id, path) => {

    if (setActiveTab) {
      setActiveTab(id);
    }

    if (onNavigate) {
      onNavigate(`/${path}`);
    }
  };


  // =====================================================
  // CATEGORY NAVIGATION
  // =====================================================

  const handleCategoryChange = (category) => {

    setSelectedCategory(category);

    setIsCategorySelectorOpen(false);

    /*
     * IMPORTANT:
     *
     * We cannot navigate to:
     *
     * /categories/fashion
     *
     * because App.jsx expects:
     *
     * /categories/:category/:subcategory
     *
     * Therefore, when selecting a category,
     * we automatically open its first subcategory.
     */

    const firstSubcategory = category.subcategories?.[0];

    if (firstSubcategory && onNavigate) {

      setActiveTab(firstSubcategory.id);

      onNavigate(
        `/categories/${firstSubcategory.path}`
      );
    }
  };


  // =====================================================
  // STORES / MANAGEMENT
  // =====================================================

  const storesOrCategories =
    userRole === 'admin'
      ? [
          {
            id: 'all-stores',
            path: 'stores',
            label: 'All Vendor Stores',
            icon: Store
          },
          {
            id: 'all-ads',
            path: 'ads',
            label: 'Ad Campaigns',
            icon: Zap
          }
        ]
      : [
          {
            id: 'fashion-hive',
            path: 'store/fashion-hive',
            label: 'Fashion Hive',
            icon: Store
          },
          {
            id: 'health-mart',
            path: 'store/health-mart',
            label: 'HealthMart',
            icon: Store
          },
          {
            id: 'technest',
            path: 'store/technest',
            label: 'TechNest',
            icon: Zap
          }
        ];


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside className="
      w-64
      bg-white
      border-r
      border-gray-100
      flex
      flex-col
      h-screen
      sticky
      top-0
      select-none
    ">

      {/* ================================================= */}
      {/* BRAND */}
      {/* ================================================= */}

      <div className="p-5 flex items-center gap-3">

        <div className="
          w-9
          h-9
          bg-blue-600
          rounded-xl
          flex
          items-center
          justify-center
          text-white
          font-black
          shadow-md
          shadow-blue-200
        ">

          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="
              M12 2L2 7l10 5 10-5-10-5z
              M2 17l10 5 10-5
              M2 12l10 5 10-5
            " />
          </svg>

        </div>

        <span className="
          text-xl
          font-bold
          text-gray-900
          tracking-tight
        ">
          Shopacla
        </span>

      </div>


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="px-4 mb-4">

        <div className="relative flex items-center">

          <Search className="
            w-4
            h-4
            text-gray-400
            absolute
            left-3
          " />

          <input
            type="text"
            placeholder="Search"
            className="
              w-full
              bg-gray-50
              border
              border-gray-100
              rounded-xl
              pl-9
              pr-4
              py-2
              text-xs
              text-gray-800
              outline-none
              focus:bg-white
              focus:border-blue-500
              transition
            "
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* SCROLL AREA */}
      {/* ================================================= */}

      <div className="
        flex-1
        overflow-y-auto
        px-4
        space-y-6
        scrollbar-thin
      ">


        {/* ================================================= */}
        {/* MAIN MENU */}
        {/* ================================================= */}

        <div className="space-y-1">

          <p className="
            text-[10px]
            font-bold
            text-gray-400
            uppercase
            tracking-wider
            px-3
            mb-2
          ">
            Menu
          </p>


          {menuItems.map((item) => {

            const Icon = item.icon;

            const isActive =
              activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  handleNavigation(
                    item.id,
                    item.path
                  )
                }
                className={`
                  w-full
                  flex
                  items-center
                  justify-between
                  px-3
                  py-2.5
                  rounded-xl
                  font-medium
                  text-xs
                  transition

                  ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600 font-semibold shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >

                <div className="flex items-center gap-3">

                  <Icon
                    className={`
                      w-4
                      h-4
                      ${
                        isActive
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }
                    `}
                  />

                  <span>
                    {item.label}
                  </span>

                </div>

                {item.badge && (
                  <span className="
                    w-2
                    h-2
                    rounded-full
                    bg-red-500
                  " />
                )}

              </button>
            );
          })}

        </div>


        {/* ================================================= */}
        {/* CATEGORY MENU */}
        {/* ================================================= */}

        <div className="space-y-2">

          {/* CATEGORY SELECTOR */}

          <div className="relative">

            <button
              onClick={() =>
                setIsCategorySelectorOpen(
                  !isCategorySelectorOpen
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-3
                mb-2
                group
              "
            >

              <div className="flex items-center gap-2">

                <span className="
                  text-[10px]
                  font-bold
                  text-gray-400
                  uppercase
                  tracking-wider
                ">
                  {selectedCategory.label}
                </span>

              </div>

              <ChevronDown
                className={`
                  w-3.5
                  h-3.5
                  text-gray-400
                  transition-transform

                  ${
                    isCategorySelectorOpen
                      ? 'rotate-180'
                      : ''
                  }
                `}
              />

            </button>


            {/* CATEGORY DROPDOWN */}

            {isCategorySelectorOpen && (

              <div className="
                absolute
                z-50
                left-0
                right-0
                mt-1
                bg-white
                border
                border-gray-100
                rounded-xl
                shadow-xl
                p-1.5
                max-h-72
                overflow-y-auto
              ">

                {categoriesList.map((category) => {

                  const CatIcon = category.icon;

                  const isSelected =
                    selectedCategory.id === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        handleCategoryChange(category)
                      }
                      className={`
                        w-full
                        flex
                        items-center
                        gap-2.5
                        px-3
                        py-2.5
                        rounded-lg
                        text-xs
                        text-left
                        transition

                        ${
                          isSelected
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >

                      <CatIcon
                        className={`
                          w-4
                          h-4

                          ${
                            isSelected
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }
                        `}
                      />

                      <span className="truncate">
                        {category.label}
                      </span>

                    </button>
                  );

                })}

              </div>

            )}

          </div>


          {/* ================================================= */}
          {/* SUBCATEGORIES */}
          {/* ================================================= */}

          <div className="space-y-1">

            {selectedCategory.subcategories.map(
              (sub) => {

                const isActive =
                  activeTab === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => {

                      if (setActiveTab) {
                        setActiveTab(sub.id);
                      }

                      if (onNavigate) {
                        onNavigate(
                          `/categories/${sub.path}`
                        );
                      }

                    }}
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      px-3
                      py-2.5
                      rounded-xl
                      text-xs
                      font-medium
                      transition

                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <span
                        className={`
                          w-1.5
                          h-1.5
                          rounded-full

                          ${
                            isActive
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }
                        `}
                      />

                      <span>
                        {sub.label}
                      </span>

                    </div>

                    <ChevronRight
                      className={`
                        w-3.5
                        h-3.5

                        ${
                          isActive
                            ? 'text-blue-500'
                            : 'text-gray-300'
                        }
                      `}
                    />

                  </button>
                );

              }
            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* STORES / MANAGEMENT */}
        {/* ================================================= */}

        <div className="space-y-1">

          <p className="
            text-[10px]
            font-bold
            text-gray-400
            uppercase
            tracking-wider
            px-3
            mb-2
          ">
            {userRole === 'admin'
              ? 'Platform Management'
              : 'Stores'}
          </p>


          {storesOrCategories.map((item) => {

            const Icon = item.icon;

            const isActive =
              activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  handleNavigation(
                    item.id,
                    item.path
                  )
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-xl
                  font-medium
                  text-xs
                  transition

                  ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600 font-semibold shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >

                <Icon
                  className={`
                    w-4
                    h-4

                    ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }
                  `}
                />

                <span>
                  {item.label}
                </span>

              </button>
            );

          })}

        </div>


        {/* ================================================= */}
        {/* OTHERS */}
        {/* ================================================= */}

        <div className="
          space-y-1
          pb-4
        ">

          <p className="
            text-[10px]
            font-bold
            text-gray-400
            uppercase
            tracking-wider
            px-3
            mb-2
          ">
            Others
          </p>


          <button
            onClick={() =>
              handleNavigation(
                'help',
                'help'
              )
            }
            className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-xl
              font-medium
              text-xs
              transition

              ${
                activeTab === 'help'
                  ? 'bg-blue-50/80 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >

            <HelpCircle className="
              w-4
              h-4
              text-gray-400
            " />

            <span>
              Get Help
            </span>

          </button>

        </div>

      </div>

    </aside>
  );
}
