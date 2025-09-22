import React, { useEffect, useRef } from 'react';

export default function MapViewer({ latitude, longitude, name, height = '400px' }) {
    const mapRef = useRef(null);

    useEffect(() => {
        // Load Leaflet CSS and JS dynamically
        if (!window.L) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }

        function initMap() {
            if (mapRef.current && window.L && latitude && longitude) {
                // Clear any existing map
                if (mapRef.current._map) {
                    mapRef.current._map.remove();
                }

                const mapInstance = window.L.map(mapRef.current).setView([latitude, longitude], 15);

                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(mapInstance);

                // Add marker with popup
                const marker = window.L.marker([latitude, longitude]).addTo(mapInstance);

                if (name) {
                    marker.bindPopup(`<b>${name}</b><br/>Lat: ${latitude}<br/>Lng: ${longitude}`).openPopup();
                }

                // Store map instance for cleanup
                mapRef.current._map = mapInstance;
            }
        }

        return () => {
            if (mapRef.current && mapRef.current._map) {
                mapRef.current._map.remove();
            }
        };
    }, [latitude, longitude, name]);

    if (!latitude || !longitude) {
        return (
            <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center" style={{ height }}>
                <div className="text-center">
                    <i className="fa-solid fa-map-marker-alt text-neutral-400 text-3xl mb-2"></i>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        No location coordinates available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={mapRef}
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg"
            style={{ height }}
        ></div>
    );
}
