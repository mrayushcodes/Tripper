'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  const monasteries = [
    {
      id: 1,
      name: 'Rumtek Monastery',
      lat: 27.3389,
      lng: 88.5603,
      description:
        'The largest monastery in Sikkim, also known as Dharmachakra Centre',
      slug: 'rumtek-monastery',
    },
    {
      id: 2,
      name: 'Enchey Monastery',
      lat: 27.3314,
      lng: 88.6138,
      description: "A 200-year-old monastery meaning 'solitary temple'",
      slug: 'enchey-monastery',
    },
    {
      id: 3,
      name: 'Pemayangtse Monastery',
      lat: 27.2051,
      lng: 88.2467,
      description: 'One of the oldest monasteries in Sikkim',
      slug: 'pemayangtse-monastery',
    },
    {
      id: 4,
      name: 'Tashiding Monastery',
      lat: 27.2167,
      lng: 88.2833,
      description: 'Sacred hilltop monastery',
      slug: 'tashiding-monastery',
    },
    {
      id: 5,
      name: 'Dubdi Monastery',
      lat: 27.2097,
      lng: 88.2483,
      description: 'First monastery built in Sikkim',
      slug: 'dubdi-monastery',
    },
    {
      id: 6,
      name: 'Phensang Monastery',
      lat: 27.7333,
      lng: 88.5167,
      description: 'Ancient monastery in North Sikkim',
      slug: 'phensang-monastery',
    },
    {
      id: 7,
      name: 'Ralang Monastery',
      lat: 27.2167,
      lng: 88.2667,
      description: 'Important spiritual monastery',
      slug: 'ralang-monastery',
    },
    {
      id: 8,
      name: 'Sang Monastery',
      lat: 27.2333,
      lng: 88.2667,
      description: 'Historic monastery with beautiful architecture',
      slug: 'sang-monastery',
    },
  ];

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        const leaflet = await import('leaflet');
        const L = leaflet.default;

        if (!mounted || !mapRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = L.map(mapRef.current).setView(
          [27.3389, 88.6065],
          10
        );

        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18,
          }
        ).addTo(map);

        const monasteryIcon = L.divIcon({
          html: `
            <div style="
              width:32px;
              height:32px;
              background:#dc2626;
              border-radius:50%;
              border:4px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              <div style="
                width:10px;
                height:10px;
                background:white;
                border-radius:50%;
              "></div>
            </div>
          `,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        monasteries.forEach((monastery) => {
          const marker = L.marker(
            [monastery.lat, monastery.lng],
            {
              icon: monasteryIcon,
            }
          ).addTo(map);

          marker.bindPopup(`
            <div style="padding:8px;min-width:220px;">
              <h3 style="font-weight:bold;margin-bottom:8px;">
                ${monastery.name}
              </h3>
              <p style="font-size:13px;margin-bottom:8px;">
                ${monastery.description}
              </p>
              <a
                href="/map/${monastery.slug}"
                style="color:#2563eb;text-decoration:none;"
              >
                Learn More
              </a>
            </div>
          `);
        });

        mapInstanceRef.current = map;

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Map loading error:', error);

        if (mounted) {
          setMapError(true);
          setIsLoading(false);
        }
      }
    };

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

    document.head.appendChild(link);

    initializeMap();

    return () => {
      mounted = false;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  if (mapError) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p>Failed to load map.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">
          Sacred Monasteries of Sikkim
        </h1>
        <p className="text-gray-600">
          Explore spiritual heritage on the map
        </p>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}

        <div
          ref={mapRef}
          className="h-[600px] w-full rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}
