import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';
import L from 'leaflet';

const MapView = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  const monasteries = [
    {
      id: 1,
      name: "Rumtek Monastery",
      lat: 27.3389,
      lng: 88.5603,
      description: "The largest monastery in Sikkim, also known as Dharmachakra Centre",
      slug: "rumtek-monastery"
    },
    {
      id: 2,
      name: "Enchey Monastery",
      lat: 27.3314,
      lng: 88.6138,
      description: "A 200-year-old monastery meaning 'solitary temple'",
      slug: "enchey-monastery"
    },
    {
      id: 3,
      name: "Pemayangtse Monastery",
      lat: 27.2051,
      lng: 88.2467,
      description: "One of the oldest monasteries in Sikkim",
      slug: "pemayangtse-monastery"
    },
    {
      id: 4,
      name: "Tashiding Monastery",
      lat: 27.2167,
      lng: 88.2833,
      description: "Sacred hilltop monastery",
      slug: "tashiding-monastery"
    },
    {
      id: 5,
      name: "Dubdi Monastery",
      lat: 27.2097,
      lng: 88.2483,
      description: "First monastery built in Sikkim",
      slug: "dubdi-monastery"
    },
    {
      id: 6,
      name: "Phensang Monastery",
      lat: 27.7333,
      lng: 88.5167,
      description: "Ancient monastery in North Sikkim",
      slug: "phensang-monastery"
    },
    {
      id: 7,
      name: "Ralang Monastery",
      lat: 27.2167,
      lng: 88.2667,
      description: "Important spiritual monastery",
      slug: "ralang-monastery"
    },
    {
      id: 8,
      name: "Sang Monastery",
      lat: 27.2333,
      lng: 88.2667,
      description: "Historic monastery with beautiful architecture",
      slug: "sang-monastery"
    }
  ];

  const initializeMap = async () => {
    try {
      const L = (await import('leaflet')).default;

      // Fix Leaflet default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
      });

      // Remove old map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (!mapRef.current) return;

      const map = L.map(mapRef.current as HTMLDivElement, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        tap: true
      }).setView([27.3389, 88.6065], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      const monasteryIcon = L.divIcon({
        html: `
          <div class="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 40],
        iconAnchor: [16, 40]
      });

      monasteries.forEach((monastery) => {
        const marker = L.marker([monastery.lat, monastery.lng], {
          icon: monasteryIcon
        }).addTo(map);

        marker.bindPopup(`
          <div style="padding:10px; min-width:200px;">
            <h3 style="font-weight:bold;">${monastery.name}</h3>
            <p style="font-size:12px;">${monastery.description}</p>
            <a href="/map/${monastery.slug}" style="color:blue;">Learn More</a>
          </div>
        `);

        marker.on('mouseover', function () {
          this.openPopup();
        });
      });

      mapInstanceRef.current = map;
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setMapError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    link.onload = () => {
      initializeMap();
    };

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      link.remove();
    };
  }, []);

  if (mapError) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p>Failed to load map</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">
          Sacred Monasteries of Sikkim
        </h1>
        <p className="text-gray-600">
          Explore spiritual heritage on the map
        </p>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <Loader2 className="animate-spin w-10 h-10" />
          </div>
        )}

        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default MapView;
