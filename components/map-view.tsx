import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';

const MapView = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Famous Sikkim Monasteries data
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
      description: "One of the oldest monasteries in Sikkim, meaning 'Perfect Sublime Lotus'",
      slug: "pemayangtse-monastery"
    },
    {
      id: 4,
      name: "Tashiding Monastery",
      lat: 27.2167,
      lng: 88.2833,
      description: "Sacred monastery on a hilltop between Teesta and Rathong rivers",
      slug: "tashiding-monastery"
    },
    {
      id: 5,
      name: "Dubdi Monastery",
      lat: 27.2097,
      lng: 88.2483,
      description: "The first monastery built in Sikkim in 1701",
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
      description: "Important monastery known for its spiritual significance",
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
      // Dynamically import Leaflet to avoid SSR issues
      const L = (await import('leaflet')).default;
      
      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize map centered on Sikkim
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        tap: true
      }).setView([27.3389, 88.6065], 10);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      // Custom monastery icon
      const monasteryIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
              <div class="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
          </div>
        `,
        className: 'custom-monastery-marker',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
      });

      // Add markers for each monastery
      monasteries.forEach(monastery => {
        const marker = L.marker([monastery.lat, monastery.lng], { 
          icon: monasteryIcon 
        }).addTo(map);

        // Create popup content
        const popupContent = `
          <div class="p-4 min-w-64">
            <h3 class="text-lg font-bold text-gray-800 mb-2">${monastery.name}</h3>
            <p class="text-gray-600 mb-3 text-sm leading-relaxed">${monastery.description}</p>
            <div class="flex items-center space-x-2">
              <a 
                href="/map/${monastery.slug}" 
                class="inline-flex items-center px-4 py-2  text-black text-sm font-medium rounded-lg  transition-colors duration-200 no-underline"
                onclick="window.location.href='/map/${monastery.slug}'"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Learn More
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        // Add hover effects
        marker.on('mouseover', function() {
          this.openPopup();
        });
      });

      mapInstanceRef.current = map;
      setIsLoading(false);

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    // Initialize map after CSS loads
    link.onload = () => {
      initializeMap();
    };

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <MapPin size={48} />
          </div>
          <p className="text-gray-600">Failed to load map. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="mt-13 mb-2 text-center aba">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Sacred Monasteries of Sikkim
        </h1>
        <p className="text-gray-600">
          Discover the spiritual heritage and ancient wisdom of Sikkim's monasteries
        </p>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 z-10 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Loading sacred locations...</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-[600px] bg-gray-100"
          style={{ minHeight: '600px' }}
        />
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Map Legend</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-sm text-gray-600">Monastery Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Click for detailed information</span>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .custom-monastery-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: none;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .leaflet-popup-close-button {
          color: #6b7280 !important;
          font-size: 18px !important;
          font-weight: bold !important;
          right: 8px !important;
          top: 8px !important;
        }
        
        .leaflet-popup-close-button:hover {
          color: #374151 !important;
        }
      `}</style>
    </div>
  );
};

export default MapView;
