import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Main Component
export default function RouteOptimizer() {
    const [coordinates, setCoordinates] = useState([]);
    const [optimizedRoute, setOptimizedRoute] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [addingMode, setAddingMode] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [manualForm, setManualForm] = useState({ lat: '', lng: '', name: '' });
    const [currentLocation, setCurrentLocation] = useState([31.987, 35.891]);
    const [mapBounds, setMapBounds] = useState(null);

    const mapRef = useRef();

    // Get current location on component mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation([latitude, longitude]);
                    updateStatus('📍 تم تحديد موقعك الحالي', 'success');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    updateStatus('⚠️ تعذر الحصول على الموقع الحالي', 'error');
                }
            );
        }
    };

    // Add point with various methods
    const addPoint = useCallback((lat, lng, name = '') => {
        const customerName = name || `عميل ${coordinates.length + 1}`;
        const newPoint = {
            id: Date.now(),
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            name: customerName
        };

        setCoordinates(prev => [...prev, newPoint]);
        updateStatus(`✅ تم إضافة ${customerName}`, 'success');
        setShowAddMenu(false);
    }, [coordinates.length]);

    const handleMapClick = useCallback((latlng) => {
        if (addingMode) {
            addPoint(latlng.lat, latlng.lng);
            setAddingMode(false);
        }
    }, [addingMode, addPoint]);

    const addCurrentLocation = () => {
        if (currentLocation) {
            addPoint(currentLocation[0], currentLocation[1], 'الموقع الحالي');
        } else {
            updateStatus('❌ لم يتم تحديد الموقع الحالي', 'error');
        }
    };

    const addManualPoint = () => {
        const { lat, lng, name } = manualForm;
        if (lat && lng) {
            addPoint(lat, lng, name || `عميل ${coordinates.length + 1}`);
            setManualForm({ lat: '', lng: '', name: '' });
        } else {
            updateStatus('❌ الرجاء إدخال الإحداثيات', 'error');
        }
    };

    const startMapClickMode = () => {
        setAddingMode(true);
        setShowAddMenu(false);
        updateStatus('🗺️ انقر على الخريطة لإضافة نقطة جديدة', 'loading');
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
        updateStatus(`🗑️ تم حذف النقطة`, 'success');
    };

    // Route optimization functions
    const optimizeRoute = async () => {
        if (coordinates.length < 2) {
            updateStatus('❌ يجب إضافة نقطتين على الأقل', 'error');
            return;
        }

        updateStatus('🔧 جاري تحسين المسار...', 'loading');

        try {
            const optimizedOrder = await nearestNeighborWithOSRM();
            await drawOptimizedRoute(optimizedOrder);
        } catch (error) {
            console.error('Error:', error);
            updateStatus('⚠️ تعذر تحسين المسار، جاري استخدام الخوارزمية التقريبية', 'error');
            optimizeWithApproximate();
        }
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
            }
        } catch (error) {
            console.error('OSRM distance error:', error);
        }

        return calculateAirDistance(point1, point2);
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

                updateStatus(`✅ تم تحسين المسار - المسافة: ${(route.distance / 1000).toFixed(2)} كم`, 'success');
            }
        } catch (error) {
            drawApproximateOptimized(optimizedOrder);
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

    const optimizeWithApproximate = () => {
        const optimizedOrder = nearestNeighborApproximate();
        drawApproximateOptimized(optimizedOrder);
    };

    const nearestNeighborApproximate = () => {
        const unvisited = [...coordinates];
        const route = [];
        let current = unvisited.shift();
        route.push(current);

        while (unvisited.length > 0) {
            let nearestIndex = -1;
            let minDistance = Infinity;

            for (let i = 0; i < unvisited.length; i++) {
                const distance = calculateAirDistance(current, unvisited[i]);
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

    const drawApproximateOptimized = (optimizedOrder) => {
        const routeGeometry = optimizedOrder.map(coord => [coord.lat, coord.lng]);
        setOptimizedRoute(routeGeometry);

        setRouteInfo({
            distance: 'غير معروف',
            duration: 'غير معروف',
            pointsCount: optimizedOrder.length,
            order: optimizedOrder,
            approximate: true
        });

        updateStatus('✅ تم تحسين المسار (مسار تقريبي)', 'success');
    };

    const calculateAirDistance = (point1, point2) => {
        const R = 6371000;
        const lat1 = point1.lat * Math.PI / 180;
        const lat2 = point2.lat * Math.PI / 180;
        const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
        const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    };

    const clearAll = () => {
        setCoordinates([]);
        setOptimizedRoute([]);
        setRouteInfo(null);
        setAddingMode(false);
        updateStatus('🗑️ تم مسح جميع النقاط', 'success');
    };

    const updateStatus = (message, type = '') => {
        setStatus({ message, type });

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                setStatus({ message: '', type: '' });
            }, 5000);
        }
    };

    const getStatusClasses = () => {
        switch (status.type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800 border-r-4 border-green-500';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800 border-r-4 border-red-500';
            case 'loading':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800 border-r-4 border-yellow-500';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800 border-r-4 border-blue-500';
        }
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 mb-6 text-center shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        📍 نظام تحسين المسار - إحداثيات دقيقة
                    </h1>
                    <p className="text-blue-100 mb-1">
                        أضف عملاء بسهولة ثم احصل على أفضل مسار للزيارة
                    </p>
                    <p className="text-blue-200 text-sm">
                        React Leaflet - متوافق مع الجوال
                    </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-64 justify-center">
                    {/* Add Point Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAddMenu(!showAddMenu)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 min-w-[160px] justify-center"
                        >
                            <span>➕</span>
                            إضافة عميل
                        </button>

                        {/* Add Menu Dropdown */}
                        {showAddMenu && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
                                <div className="p-4 space-y-3">
                                    <h4 className="font-bold text-gray-800 dark:text-white text-center border-b pb-2">
                                        اختر طريقة الإضافة
                                    </h4>

                                    <button
                                        onClick={startMapClickMode}
                                        className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-right"
                                    >
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                            🗺️
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-blue-700 dark:text-blue-300">النقر على الخريطة</div>
                                            <div className="text-xs text-blue-600 dark:text-blue-400">انقر على أي مكان في الخريطة</div>
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
                                            <div className="font-semibold text-green-700 dark:text-green-300">الموقع الحالي</div>
                                            <div className="text-xs text-green-600 dark:text-green-400">استخدم موقعك الحالي</div>
                                        </div>
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={optimizeRoute}
                        disabled={coordinates.length < 2}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-0.5 min-w-[160px] justify-center"
                    >
                        <span>🔧</span>
                        تحسين المسار
                    </button>

                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 min-w-[160px] justify-center"
                    >
                        <span>🗑️</span>
                        مسح الكل
                    </button>
                </div>

                {/* Adding Mode Indicator */}
                {addingMode && (
                    <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 text-center shadow-lg">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 bg-white text-blue-500 rounded-full flex items-center justify-center animate-pulse">
                                👆
                            </div>
                            <span className="font-bold">وضع الإضافة نشط - انقر على الخريطة لإضافة عميل جديد</span>
                            <button
                                onClick={() => setAddingMode(false)}
                                className="px-3 py-1 bg-white text-blue-500 rounded-lg text-sm font-bold hover:bg-gray-100"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )}

                {/* Status Bar */}
                {status.message && (
                    <div className={`p-4 rounded-lg mb-6 shadow-sm ${getStatusClasses()}`}>
                        <div className="text-center font-semibold">
                            {status.message}
                        </div>
                    </div>
                )}

                {/* Map */}
                <div className="w-full h-96 md:h-[500px] rounded-xl shadow-lg mb-6 border-2 border-blue-200 overflow-hidden">
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
                                                <small>الترتيب: {optimizedIndex + 1}</small>
                                            )}
                                            <hr className="my-1" />
                                            <strong>الإحداثيات:</strong><br />
                                            {point.lat.toFixed(6)}° N<br />
                                            {point.lng.toFixed(6)}° E<br />
                                            <hr className="my-1" />
                                            <button
                                                onClick={() => deletePoint(point.id)}
                                                className="w-full bg-red-500 text-white border-none py-2 px-3 rounded cursor-pointer mt-1 hover:bg-red-600"
                                            >
                                                🗑️ حذف
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
                                color={routeInfo?.approximate ? '#f59e0b' : '#10b981'}
                                weight={6}
                                opacity={0.8}
                                dashArray={routeInfo?.approximate ? '5, 5' : undefined}
                            />
                        )}
                    </MapContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Points List */}
                    <div className="space-y-6">
                        {/* Points List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span>📋</span>
                                قائمة العملاء
                                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                                    {coordinates.length}
                                </span>
                            </h3>

                            {coordinates.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <div className="text-4xl mb-2">👥</div>
                                    <p>لم يتم إضافة أي عملاء بعد</p>
                                    <p className="text-sm mt-2">استخدم زر "إضافة عميل" لبدء الإضافة</p>
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
                                                    <div className={`w-8 h-8 ${
                                                        routeInfo ? 'bg-green-500' : 'bg-blue-500'
                                                    } text-white rounded-full flex items-center justify-center font-bold text-sm`}>
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
                                                    title="حذف النقطة"
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
                        {/* Route Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span>📊</span>
                                معلومات المسار
                            </h3>

                            {!routeInfo ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <div className="text-4xl mb-2">🛣️</div>
                                    <p>أضف العملاء ثم اضغط "تحسين المسار"</p>
                                    <p className="text-sm mt-2">سيظهر هنا معلومات المسار الأمثل</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center border border-green-200 dark:border-green-800">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {routeInfo.distance}
                                            </div>
                                            <div className="text-sm text-green-700 dark:text-green-300">
                                                المسافة (كم)
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-800">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {routeInfo.duration}
                                            </div>
                                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                                الوقت (دقيقة)
                                            </div>
                                        </div>
                                    </div>

                                    {routeInfo.approximate && (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
                                            <span className="text-yellow-700 dark:text-yellow-400 text-sm">
                                                ⚠️ مسار تقريبي - قد تختلف المسافة الفعلية
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                                            ترتيب الزيارات الأمثل:
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
