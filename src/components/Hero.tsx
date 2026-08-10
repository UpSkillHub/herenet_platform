
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react';

import { Button } from "@/components/ui/button";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const benefits = [
    "Discover products from trusted sellers",
    "Shop a wide range of products in one place",
    "Enjoy simple and convenient online shopping",
    "Find products at competitive prices",
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary opacity-80" />

        <div
          className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/11/d7/12/11d7123128c96ef744e21c737c1c923d.jpg')] bg-cover bg-center opacity-10"
        />

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-16 flex flex-col md:flex-row items-center">

        {/* Hero Content */}
        <div
          className={`md:w-1/2 text-center md:text-left space-y-6 transition-all duration-700 transform ${
            loaded
              ? 'translate-x-0 opacity-100'
              : '-translate-x-10 opacity-0'
          }`}
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2 animate-fadeIn">
            <ShoppingBag className="h-4 w-4" />
            Shop Everything You Need
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight">
            Shop More.
            <br />
            <span className="text-primary">Live Better.</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Discover quality products from trusted sellers on Shopacla.
            Browse, compare and shop for everything you need from the
            comfort of your home.
          </p>

          {/* Benefits */}
          <div className="pt-2 space-y-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 transition-all duration-500 ${
                  loaded
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-5 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />

                <span className="text-muted-foreground">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">

            {/* Shop */}
            <Button asChild size="lg" className="group">
              <Link to="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />

                Shop Now

                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            {/* Browse */}
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                Explore Products
              </Link>
            </Button>

          </div>
        </div>

        {/* Hero Image */}
        <div
          className={`md:w-1/2 mt-12 md:mt-0 transition-all duration-700 transform ${
            loaded
              ? 'translate-x-0 opacity-100'
              : 'translate-x-10 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="relative">

            <div className="aspect-video md:aspect-square max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                alt="Shopacla online shopping"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Shopping badge */}
            <div className="absolute -bottom-5 -left-5 bg-background shadow-xl rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="font-semibold">
                  Shop With Ease
                </p>

                <p className="text-sm text-muted-foreground">
                  Everything in one place
                </p>
              </div>
            </div>

            {/* Seller badge */}
            <div className="absolute -top-5 -right-5 bg-background shadow-xl rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="font-semibold">
                  Trusted Sellers
                </p>

                <p className="text-sm text-muted-foreground">
                  Quality products
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary rounded-xl opacity-20 animate-float" />

            <div
              className="absolute -top-8 -right-8 w-16 h-16 bg-shopacla-400 rounded-xl opacity-20 animate-float"
              style={{ animationDelay: '1s' }}
            />

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
