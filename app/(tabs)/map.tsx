import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { MapPin, Navigation, Locate, Flame, Square, Heart, Timer, Footprints } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { WebView } from 'react-native-webview';
import { useActivityTracking } from '@/contexts/ActivityTrackingContext';

interface CharacterMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'earthy' | 'fiery' | 'watery';
  collected: boolean;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function MapScreen() {
  const { activityState, endActivity, currentLocation } = useActivityTracking();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [characters, setCharacters] = useState<CharacterMarker[]>([]);
  const [heading, setHeading] = useState<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    requestLocationPermission();
    requestNotificationPermissions();
    startWatchingHeading();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      Location.hasServicesEnabledAsync().then(() => {
        Location.stopLocationUpdatesAsync('heading-subscription').catch(() => {});
      });
    };
  }, []);

  useEffect(() => {
    if (activityState.isActive && currentLocation) {
      checkCharacterProximity(currentLocation);
    }
  }, [currentLocation, activityState.isActive]);

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
    }
  };

  const startWatchingHeading = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        Location.watchHeadingAsync((headingData) => {
          setHeading(headingData.trueHeading || headingData.magHeading);
        });
      }
    } catch (error) {
      console.log('Heading not available');
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      generateCharacterMarkers(currentLocation.coords.latitude, currentLocation.coords.longitude);
      setLoading(false);
    } catch (error) {
      setErrorMsg('Failed to get location');
      setLoading(false);
    }
  };

  const generateCharacterMarkers = (lat: number, lng: number) => {
    const characterTypes: Array<'earthy' | 'fiery' | 'watery'> = ['earthy', 'fiery', 'watery'];
    const characterNames = [
      'Blazey', 'Sparky', 'Ember',
      'Rocky', 'Terra', 'Boulder',
      'Splash', 'Ripple', 'Wave',
    ];

    const markers: CharacterMarker[] = [];
    const numCharacters = 50; // HEREEEEEEEEEEEEEEEEEEEEEeeeeeeeeeeeeeeeeeeeeee

    for (let i = 0; i < numCharacters; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.1;
      const offsetLng = (Math.random() - 0.5) * 0.1;

      markers.push({
        id: `char-${i}`,
        name: characterNames[i % characterNames.length],
        lat: lat + offsetLat,
        lng: lng + offsetLng,
        type: characterTypes[i % characterTypes.length],
        collected: false,
      });
    }

    setCharacters(markers);
  };

  const playSoundForCharacter = async (type: 'earthy' | 'fiery' | 'watery') => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      let soundFile;
      switch (type) {
        case 'fiery':
          soundFile = require('@/assets/sounds/earth.mp3');
          break;
        case 'watery':
          soundFile = require('@/assets/sounds/water.mp3');
          break;
        case 'earthy':
          soundFile = require('@/assets/sounds/earth.mp3');
          break;
      }

      const { sound } = await Audio.Sound.createAsync(soundFile);
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const sendCharacterNotification = async (name: string, type: 'earthy' | 'fiery' | 'watery') => {
    if (Platform.OS === 'web') {
      return;
    }

    await playSoundForCharacter(type);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Runimal Found!',
        body: `You found ${name}! A ${type} type runimal.`,
        data: { characterName: name, characterType: type },
      },
      trigger: null,
    });
  };

  const checkCharacterProximity = (currentPos: Location.LocationObject) => {
    const proximityThreshold = 0.05;

    setCharacters(prevCharacters => {
      let updated = false;
      const newCharacters = prevCharacters.map(char => {
        if (char.collected) return char;

        const distance = calculateDistance(
          currentPos.coords.latitude,
          currentPos.coords.longitude,
          char.lat,
          char.lng
        );

        if (distance < proximityThreshold) {
          updated = true;
          sendCharacterNotification(char.name, char.type);
          return { ...char, collected: true };
        }
        return char;
      });

      return updated ? newCharacters : prevCharacters;
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
      Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
      Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);
    return (bearing * 180 / Math.PI + 360) % 360;
  };

  const getClosestCharacter = () => {
    const displayLocation = activityState.isActive && currentLocation ? currentLocation : location;
    if (!displayLocation) return null;

    const uncollectedCharacters = characters.filter(char => !char.collected);
    if (uncollectedCharacters.length === 0) return null;

    let closest = uncollectedCharacters[0];
    let minDistance = calculateDistance(
      displayLocation.coords.latitude,
      displayLocation.coords.longitude,
      closest.lat,
      closest.lng
    );

    for (let i = 1; i < uncollectedCharacters.length; i++) {
      const distance = calculateDistance(
        displayLocation.coords.latitude,
        displayLocation.coords.longitude,
        uncollectedCharacters[i].lat,
        uncollectedCharacters[i].lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = uncollectedCharacters[i];
      }
    }

    const bearing = calculateBearing(
      displayLocation.coords.latitude,
      displayLocation.coords.longitude,
      closest.lat,
      closest.lng
    );

    return { character: closest, distance: minDistance, bearing };
  };

  const getDirectionText = (bearing: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  const recenterMap = () => {
    if (location) {
      requestLocationPermission();
    }
  };

  const getCharacterColor = (type: 'earthy' | 'fiery' | 'watery') => {
    switch (type) {
      case 'fiery':
        return '#FF6B35';
      case 'watery':
        return '#4A90E2';
      case 'earthy':
        return '#8B7355';
      default:
        return '#FF6B35';
    }
  };

  const getElementIcon = (type: 'earthy' | 'fiery' | 'watery') => {
    switch (type) {
      case 'fiery':
        return '🔥';
      case 'watery':
        return '💧';
      case 'earthy':
        return '⛰️';
      default:
        return '🔥';
    }
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateMapHTML = () => {
    const displayLocation = activityState.isActive && currentLocation ? currentLocation : location;
    if (!displayLocation) return '';

    const centerLat = displayLocation.coords.latitude;
    const centerLng = displayLocation.coords.longitude;

    const pathCoordinates = activityState.path.length > 0
      ? activityState.path.map(([lat, lng]) => `[${lat}, ${lng}]`).join(',')
      : '';

    const pathHTML = activityState.isActive && pathCoordinates ? `
      var pathCoords = [${pathCoordinates}];
      if (pathCoords.length > 1) {
        L.polyline(pathCoords, {
          color: '#FF6B35',
          weight: 4,
          opacity: 0.8
        }).addTo(map);
      }
    ` : '';

    const markerHTML = characters
      .filter(char => !char.collected)
      .map(char => `
      L.marker([${char.lat}, ${char.lng}], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="font-size: 32px; text-align: center;">${getElementIcon(char.type)}</div>',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }).addTo(map).bindPopup('<b>${char.name}</b><br>Type: ${char.type}');
    `).join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
          #map {
            height: 100%;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${centerLat}, ${centerLng}], ${activityState.isActive ? 16 : 14});

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          ${pathHTML}

          var userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div style="width: 30px; height: 30px; position: relative;"><div style="width: 16px; height: 16px; background: #FFFFFF; border: 3px solid #4A90E2; border-radius: 50%; position: absolute; top: 7px; left: 7px;"></div><div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 12px solid #FF6B35; position: absolute; top: -8px; left: 9px; transform: rotate(${heading}deg); transform-origin: 50% 20px;"></div></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });

          L.marker([${centerLat}, ${centerLng}], {
            icon: userIcon
          }).addTo(map).bindPopup('<b>You are here</b>');

          ${markerHTML}
        </script>
      </body>
      </html>
    `;
  };

  const handleEndActivity = () => {
    Alert.alert(
      'End Activity',
      'Are you sure you want to end this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: () => endActivity(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  if (errorMsg || !location) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
        </View>
        <View style={styles.errorContainer}>
          <MapPin size={48} color="#999" />
          <Text style={styles.errorText}>{errorMsg || 'Location unavailable'}</Text>
          <Text style={styles.errorSubtext}>
            Please enable location permissions to see the map
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={requestLocationPermission}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (activityState.isActive) {
    return (
      <View style={styles.container}>
        <View style={styles.trackingHeader}>
          <Text style={styles.activityTypeText}>
            {activityState.activityType?.toUpperCase()}
          </Text>
        </View>

        <View style={styles.statsOverlay}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Timer size={20} color="#FF6B35" />
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>{formatTime(activityState.elapsedTime)}</Text>
            </View>
            <View style={styles.statItem}>
              <Footprints size={20} color="#4A90E2" />
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>{activityState.distance.toFixed(2)} km</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Navigation size={20} color="#8B7355" />
              <Text style={styles.statLabel}>Speed</Text>
              <Text style={styles.statValue}>{activityState.distance.toFixed(1)} km/h</Text>
            </View>
            <View style={styles.statItem}>
              <Heart size={20} color="#FF6B6B" />
              <Text style={styles.statLabel}>Heart Rate</Text>
              <Text style={styles.statValue}>{activityState.heartRate} bpm</Text>
            </View>
          </View>
        </View>

        {(() => {
          const closestData = getClosestCharacter();
          if (closestData) {
            return (
              <View style={styles.directionsContainer}>
                <MapPin size={18} color="#FF6B35" />
                <Text style={styles.directionsText}>
                  {closestData.character.name} - {(closestData.distance * 1000).toFixed(0)}m {getDirectionText(closestData.bearing)}
                </Text>
              </View>
            );
          }
          return null;
        })()}

        <View style={styles.mapContainerFullScreen}>
          {Platform.OS === 'web' ? (
            <iframe
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              srcDoc={generateMapHTML()}
            />
          ) : (
            <WebView
              style={styles.webViewFullScreen}
              source={{ html: generateMapHTML() }}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.endButtonContainer}>
          <TouchableOpacity style={styles.endButton} onPress={handleEndActivity}>
            <Square size={20} color="#FFFFFF" />
            <Text style={styles.endButtonText}>END ACTIVITY</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity style={styles.locateButton} onPress={recenterMap}>
          <Locate size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Flame size={20} color="#FF6B35" />
            <Text style={styles.statValue}>43</Text>
            <Text style={styles.statLabel}>Active Routes</Text>
          </View>
          <View style={styles.statBox}>
            <MapPin size={20} color="#4A90E2" />
            <Text style={styles.statValue}>{characters.filter(c => !c.collected).length}</Text>
            <Text style={styles.statLabel}>Runimals Nearby</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>Nearby Runimals</Text>
          {Platform.OS === 'web' ? (
            <iframe
              style={{
                width: '100%',
                height: 500,
                border: 'none',
                borderRadius: 12,
              }}
              srcDoc={generateMapHTML()}
            />
          ) : (
            <WebView
              style={styles.webView}
              source={{ html: generateMapHTML() }}
              scrollEnabled={false}
            />
          )}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
              <Text style={styles.legendText}>Fiery</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
              <Text style={styles.legendText}>Watery</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B7355' }]} />
              <Text style={styles.legendText}>Earthy</Text>
            </View>
          </View>
        </View>

        <View style={styles.routesSection}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          <View style={styles.routeCard}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>City Center Loop</Text>
              <Text style={styles.routeDetails}>5.2 km • 234 runs this week</Text>
            </View>
            <View style={styles.routeHeat}>
              <Flame size={20} color="#FF6B35" />
            </View>
          </View>
          <View style={styles.routeCard}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>Park Trail</Text>
              <Text style={styles.routeDetails}>3.8 km • 187 runs this week</Text>
            </View>
            <View style={styles.routeHeat}>
              <Flame size={20} color="#FF6B35" />
            </View>
          </View>
          <View style={styles.routeCard}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>Riverside Path</Text>
              <Text style={styles.routeDetails}>7.5 km • 156 runs this week</Text>
            </View>
            <View style={styles.routeHeat}>
              <Flame size={20} color="#FF8C35" />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Navigation size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start New Route</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  mapContainer: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  webView: {
    width: '100%',
    height: 500,
    borderRadius: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3D3D54',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#999',
  },
  routesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  routeCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 13,
    color: '#999',
  },
  routeHeat: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  trackingHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    alignItems: 'center',
  },
  activityTypeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
    letterSpacing: 1,
  },
  statsOverlay: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(45, 45, 68, 0.95)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  directionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    flex: 1,
  },
  mapContainerFullScreen: {
    flex: 1,
  },
  webViewFullScreen: {
    flex: 1,
  },
  endButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  endButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
