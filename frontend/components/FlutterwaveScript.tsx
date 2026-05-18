'use client';
import { useEffect, useState } from 'react';

export default function FlutterwaveScript() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      console.log('Flutterwave script loaded successfully');
      setIsLoaded(true);
      window.dispatchEvent(new Event('flutterwave-loaded'));
    };
    script.onerror = () => {
      console.error('Failed to load Flutterwave script');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}