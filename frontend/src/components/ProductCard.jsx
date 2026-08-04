import React from 'react';

import {
  ShoppingCart,
  Star,
  Megaphone
} from 'lucide-react';


export default function ProductCard({
  product,
  onAddToCart
}) {

  const {
    name,
    price,
    originalPrice,
    image,
    category,
    rating,
    isSponsored,
    vendor,
    stock
  } = product;


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {

    if (stock === 0) {
      return;
    }

    if (!onAddToCart) {
      console.error(
        'ProductCard: onAddToCart was not provided.'
      );

      return;
    }

    onAddToCart(product);
  };


  return (

    <div className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      border-gray-100
      hover:shadow-md
      transition
      duration-200
      overflow-hidden
      flex
      flex-col
      justify-between
      group
    ">


      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}

      <div>


        {/* PRODUCT IMAGE */}

        <div className="
          relative
          h-48
          bg-gray-100
          overflow-hidden
        ">

          <img
            src={
              image ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
            }
            alt={name}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition
              duration-300
            "
          />


          {/* BADGES */}

          <div className="
            absolute
            top-3
            left-3
            flex
            flex-col
            gap-1
            items-start
          ">

            {isSponsored && (

              <span className="
                bg-indigo-600/90
                backdrop-blur-md
                text-white
                text-[10px]
                font-bold
                px-2.5
                py-1
                rounded-full
                flex
                items-center
                gap-1
                shadow-sm
                uppercase
                tracking-wider
              ">

                <Megaphone className="w-3 h-3" />

                Sponsored Ad

              </span>

            )}


            {category && (

              <span className="
                bg-white/90
                backdrop-blur-md
                text-gray-800
                text-[10px]
                font-semibold
                px-2
                py-0.5
                rounded-md
                shadow-sm
              ">

                {category}

              </span>

            )}

          </div>

        </div>


        {/* PRODUCT INFO */}

        <div className="p-4 space-y-2">


          {vendor && (

            <p className="
              text-xs
              text-gray-400
              font-medium
            ">
              By {vendor}
            </p>

          )}


          <h3 className="
            font-semibold
            text-gray-900
            line-clamp-1
            group-hover:text-indigo-600
            transition
          ">

            {name}

          </h3>


          {/* RATING */}

          <div className="
            flex
            items-center
            gap-1
            text-amber-500
            text-xs
          ">

            <Star
              className="w-3.5 h-3.5 fill-current"
            />

            <span className="
              font-bold
              text-gray-700
            ">

              {rating || '4.5'}

            </span>

          </div>


          {/* STOCK */}

          {stock !== undefined && (

            <p
              className={`
                text-xs
                font-medium
                ${
                  stock <= 5
                    ? 'text-red-500'
                    : 'text-green-600'
                }
              `}
            >

              {stock <= 5
                ? `Only ${stock} left`
                : `${stock} in stock`
              }

            </p>

          )}

        </div>

      </div>


      {/* =================================================
          PRICE + CART
      ================================================= */}

      <div className="
        p-4
        pt-0
        flex
        items-center
        justify-between
        mt-auto
      ">


        {/* PRICE */}

        <div>

          <span className="
            text-lg
            font-black
            text-gray-900
          ">

            RWF {Number(price).toLocaleString()}

          </span>


          {originalPrice && (

            <span className="
              text-xs
              text-gray-400
              line-through
              ml-2
            ">

              RWF {Number(originalPrice).toLocaleString()}

            </span>

          )}

        </div>


        {/* ADD TO CART BUTTON */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`
            p-2.5
            rounded-xl
            transition
            duration-200
            flex
            items-center
            justify-center
            shadow-sm

            ${
              stock === 0
                ? `
                  bg-gray-100
                  text-gray-400
                  cursor-not-allowed
                `
                : `
                  bg-indigo-50
                  text-indigo-600
                  hover:bg-indigo-600
                  hover:text-white
                `
            }
          `}
          title={
            stock === 0
              ? 'Out of Stock'
              : 'Add to Cart'
          }
        >

          <ShoppingCart className="w-4 h-4" />

        </button>

      </div>

    </div>

  );
}