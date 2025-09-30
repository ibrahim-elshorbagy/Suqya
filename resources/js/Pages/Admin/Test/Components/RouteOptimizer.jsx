import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAlert } from '@/Hooks/useAlert';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hook for map events
function MapEvents({ onMapClick, addingMode }) {
  useMapEvents({
    click: (e) => {
      if (addingMode) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// Component to handle map view changes
function MapController({ center, bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (center) {
      map.setView(center, 15);
    }
  }, [map, center, bounds]);

  return null;
}

// Fullscreen control component
function FullscreenControl({ isFullscreen, toggleFullscreen, t }) {
  return (
    <div className={`fixed ${isFullscreen ? 'top-4 right-4' : 'hidden'} z-[1000]`}>
      <button
        onClick={toggleFullscreen}
        className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg shadow-lg border border-gray-300 transition-colors"
        title={t('exit_fullscreen')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Main Component
export default function RouteOptimizer({ t }) {
  const { showSuccess, showError, showWarning, showInfo } = useAlert();

  const [coordinates, setCoordinates] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [addingMode, setAddingMode] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [currentLocation, setCurrentLocation] = useState([31.987, 35.891]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const locationWatcherRef = useRef(null);

  // Loading states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);

  const mapRef = useRef();
  const addButtonRef = useRef();

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
    return () => {
      stopLocationTracking();
    };
  }, []);

  // Handle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isFullscreen]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(newLocation);
          setIsLocating(false);
          showSuccess(`📍 ${t('location_found')}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              showError(`❌ ${t('location_permission_denied')}`);
              break;
            case error.POSITION_UNAVAILABLE:
              showError(`❌ ${t('location_unavailable')}`);
              break;
            case error.TIMEOUT:
              showError(`❌ ${t('location_timeout')}`);
              break;
            default:
              showError(`⚠️ ${t('location_error')}`);
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation && !locationWatcherRef.current) {
      locationWatcherRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(newLocation);
        },
        (error) => {
          console.error('Location tracking error:', error);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              showError(`❌ ${t('tracking_permission_denied')}`);
              break;
            case error.POSITION_UNAVAILABLE:
              showError(`❌ ${t('tracking_unavailable')}`);
              break;
            case error.TIMEOUT:
              showError(`❌ ${t('tracking_timeout')}`);
              break;
            default:
              showError(`⚠️ ${t('tracking_error')}`);
              break;
          }

          stopLocationTracking();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );

      setIsTracking(true);
      showSuccess(`🎯 ${t('tracking_started')}`);
    }
  };

  const stopLocationTracking = () => {
    if (locationWatcherRef.current) {
      navigator.geolocation.clearWatch(locationWatcherRef.current);
      locationWatcherRef.current = null;
      setIsTracking(false);
      showSuccess(`⏹️ ${t('tracking_stopped')}`);
    }
  };

  // Add point with various methods
  const addPoint = useCallback((lat, lng, name = '') => {
    const customerName = name || `${t('customer')} ${coordinates.length + 1}`;
    const newPoint = {
      id: Date.now(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name: customerName
    };

    setCoordinates(prev => [...prev, newPoint]);
    showSuccess(`✅ ${t('point_added')}: ${customerName}`);
    setShowAddMenu(false);
  }, [coordinates.length, t]);

  const handleMapClick = useCallback((latlng) => {
    if (addingMode) {
      addPoint(latlng.lat, latlng.lng);
      setAddingMode(false);
    }
  }, [addingMode, addPoint]);

  const addCurrentLocation = () => {
    if (currentLocation) {
      addPoint(currentLocation[0], currentLocation[1], t('current_location'));
    } else {
      showError(`❌ ${t('location_not_found')}`);
    }
  };

  const startMapClickMode = () => {
    setAddingMode(true);
    setShowAddMenu(false);
    showInfo(`🗺️ ${t('click_map_to_add')}`);
  };

  // Create custom icons
  const createCustomIcon = (number, color = 'blue') => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="w-8 h-8 bg-${color}-500 text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-lg text-xs">
          ${number}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const deletePoint = (id) => {
    setCoordinates(prev => prev.filter(point => point.id !== id));
    showSuccess(`🗑️ ${t('point_deleted')}`);
  };

  // Route optimization functions
  const optimizeRoute = async () => {
    if (coordinates.length < 2) {
      showError(`❌ ${t('need_two_points')}`);
      return;
    }

    setIsOptimizing(true);
    showInfo(`🔧 ${t('optimizing_route')}`);

    try {
      const optimizedOrder = await nearestNeighborWithOSRM();
      await drawOptimizedRoute(optimizedOrder);
    } catch (error) {
      console.error('Error:', error);
      showError(`❌ ${t('optimization_failed')}`);
    }
    setIsOptimizing(false);
  };

  const nearestNeighborWithOSRM = async () => {
    const unvisited = [...coordinates];
    const route = [];

    let current = unvisited.shift();
    route.push(current);

    while (unvisited.length > 0) {
      let nearestIndex = -1;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const distance = await getOSRMDistance(current, unvisited[i]);
        if (distance === null) {
          throw new Error('OSRM_FAILED');
        }
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      }

      if (nearestIndex !== -1) {
        current = unvisited.splice(nearestIndex, 1)[0];
        route.push(current);
      }
    }

    return route;
  };

  const getOSRMDistance = async (point1, point2) => {
    try {
      const coordsString = `${point1.lng},${point1.lat};${point2.lng},${point2.lat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=false`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.routes[0].distance;
      } else {
        showError(`❌ ${t('route_service_unavailable')}`);
        return null;
      }
    } catch (error) {
      console.error('OSRM distance error:', error);
      showError(`❌ ${t('route_service_connection_error')}`);
      return null;
    }
  };

  const drawOptimizedRoute = async (optimizedOrder) => {
    const coordsString = optimizedOrder.map(coord => `${coord.lng},${coord.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const route = data.routes[0];

        const coords = route.geometry.coordinates;
        const routeGeometry = coords.map(coord => [coord[1], coord[0]]);

        setOptimizedRoute(routeGeometry);
        displayOptimizedInfo(optimizedOrder, route);

        showSuccess(`✅ ${t('route_optimized')}: ${(route.distance / 1000).toFixed(2)} ${t('km')}`);
      }
    } catch (error) {
      showWarning(`⚠️ ${t('route_loading_failed')}`);
    }
  };

  const displayOptimizedInfo = (optimizedOrder, route) => {
    const distance = (route.distance / 1000).toFixed(2);
    const duration = (route.duration / 60).toFixed(1);

    setRouteInfo({
      distance,
      duration,
      pointsCount: optimizedOrder.length,
      order: optimizedOrder
    });
  };

  const clearAll = () => {
    setCoordinates([]);
    setOptimizedRoute([]);
    setRouteInfo(null);
    setAddingMode(false);
    showSuccess(`🗑️ ${t('all_cleared')}`);
  };

  // Calculate bounds for all markers
  useEffect(() => {
    if (coordinates.length > 0 && mapRef.current) {
      const group = new L.featureGroup(
        coordinates.map(coord => L.marker([coord.lat, coord.lng]))
      );
      setMapBounds(group.getBounds());
    }
  }, [coordinates]);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-[999] bg-gray-900' : 'min-h-screen  py-6'}`}>
      <div className={`${isFullscreen ? 'w-full h-full p-4' : ' mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {/* Header - Hidden in fullscreen */}

        {/* Main Action Buttons - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {/* Add Point Button */}
            <div className="relative" ref={addButtonRef}>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 min-w-[160px] justify-center"
              >
                <span>➕</span>
                {t('add_customer')}
              </button>

              {/* Add Menu Dropdown - Positioned above */}
              {showAddMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-gray-800 dark:text-white text-center border-b pb-2">
                      {t('choose_add_method')}
                    </h4>

                    <button
                      onClick={startMapClickMode}
                      className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-right"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                        🗺️
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-blue-700 dark:text-blue-300">{t('click_on_map')}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">{t('click_anywhere_map')}</div>
                      </div>
                    </button>

                    <button
                      onClick={addCurrentLocation}
                      className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-right"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                        🌍
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-green-700 dark:text-green-300">{t('current_location')}</div>
                        <div className="text-xs text-green-600 dark:text-green-400">{t('use_current_location')}</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optimize Route Button */}
            <button
              onClick={optimizeRoute}
              disabled={coordinates.length < 2 || isOptimizing}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-0.5 min-w-[160px] justify-center"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('optimizing')}
                </>
              ) : (
                <>
                  <span>🔧</span>
                  {t('optimize_route')}
                </>
              )}
            </button>

            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 min-w-[160px] justify-center"
            >
              <span>🗑️</span>
              {t('clear_all')}
            </button>

            {/* Tracking Button */}
            {!isTracking ? (
              <button
                onClick={startLocationTracking}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 min-w-[160px] justify-center"
              >
                <span>🎯</span>
                {t('live_tracking')}
              </button>
            ) : (
              <button
                onClick={stopLocationTracking}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 min-w-[160px] justify-center"
              >
                <span>⏹️</span>
                {t('stop_tracking')}
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 min-w-[160px] justify-center"
            >
              <span>🔍</span>
              {t('fullscreen_map')}
            </button>
          </div>
        )}

        {/* Map */}
        <div className={`${isFullscreen ? 'w-full h-full' : 'w-full h-96 md:h-[500px] mb-6'} rounded-xl shadow-lg border-2 border-blue-200 overflow-hidden`}>
          <MapContainer
            center={currentLocation}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapEvents onMapClick={handleMapClick} addingMode={addingMode} />
            <MapController center={currentLocation} bounds={mapBounds} />

            {/* Render markers */}
            {coordinates.map((point, index) => {
              const isOptimized = routeInfo?.order?.find(p => p.id === point.id);
              const optimizedIndex = routeInfo?.order?.findIndex(p => p.id === point.id);

              return (
                <Marker
                  key={point.id}
                  position={[point.lat, point.lng]}
                  icon={createCustomIcon(
                    optimizedIndex !== undefined ? optimizedIndex + 1 : index + 1,
                    routeInfo ? 'green' : 'blue'
                  )}
                >
                  <Popup>
                    <div className="text-center min-w-[200px]">
                      <strong>📍 {point.name}</strong><br />
                      {routeInfo && (
                        <small>{t('order')}: {optimizedIndex + 1}</small>
                      )}
                      <hr className="my-1" />
                      <strong>{t('coordinates')}:</strong><br />
                      {point.lat.toFixed(6)}° N<br />
                      {point.lng.toFixed(6)}° E<br />
                      <hr className="my-1" />
                      <button
                        onClick={() => deletePoint(point.id)}
                        className="w-full bg-red-500 text-white border-none py-2 px-3 rounded cursor-pointer mt-1 hover:bg-red-600"
                      >
                        🗑️ {t('delete')}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Render optimized route */}
            {optimizedRoute.length > 0 && (
              <Polyline
                positions={optimizedRoute}
                weight={6}
                opacity={0.8}
                color="#10b981"
              />
            )}
          </MapContainer>
        </div>

        {/* Fullscreen Control */}
        <FullscreenControl isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} t={t} />

        {/* Adding Mode Indicator */}
        {addingMode && !isFullscreen && (
          <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 bg-white text-blue-500 rounded-full flex items-center justify-center animate-pulse">
                👆
              </div>
              <span className="font-bold">{t('adding_mode_active')}</span>
              <button
                onClick={() => setAddingMode(false)}
                className="px-3 py-1 bg-white text-blue-500 rounded-lg text-sm font-bold hover:bg-gray-100"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Content sections - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Points List */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>📋</span>
                  {t('customers_list')}
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {coordinates.length}
                  </span>
                </h3>

                {coordinates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">👥</div>
                    <p>{t('no_customers_added')}</p>
                    <p className="text-sm mt-2">{t('use_add_button')}</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {coordinates.map((point, index) => {
                      const optimizedIndex = routeInfo?.order?.findIndex(p => p.id === point.id);
                      return (
                        <div
                          key={point.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-8 h-8 ${routeInfo ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                              {optimizedIndex !== undefined ? optimizedIndex + 1 : index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 dark:text-white">
                                {point.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deletePoint(point.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={t('delete_point')}
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Route Information */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>📊</span>
                  {t('route_info')}
                </h3>

                {!routeInfo ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">🛣️</div>
                    <p>{t('add_customers_then_optimize')}</p>
                    <p className="text-sm mt-2">{t('optimal_route_info_will_appear')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {routeInfo.distance}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          {t('distance_km')}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                        {t('optimal_visit_order')}:
                      </h4>
                      <ol className="space-y-2">
                        {routeInfo.order.map((point, index) => (
                          <li
                            key={point.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="text-gray-700 dark:text-gray-300 font-medium">
                                {point.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {showAddMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowAddMenu(false)}
        />
      )}
    </div>
  );
}
