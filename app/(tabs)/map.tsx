import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { MapPin, Navigation, Locate, Flame } from 'lucide-react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';

interface CharacterMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'earthy' | 'fiery' | 'watery';
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [characters, setCharacters] = useState<CharacterMarker[]>([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
    const numCharacters = 6;

    for (let i = 0; i < numCharacters; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.02;
      const offsetLng = (Math.random() - 0.5) * 0.02;

      markers.push({
        id: `char-${i}`,
        name: characterNames[i % characterNames.length],
        lat: lat + offsetLat,
        lng: lng + offsetLng,
        type: characterTypes[i % characterTypes.length],
      });
    }

    setCharacters(markers);
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

  const generateMapHTML = () => {
    if (!location) return '';

    const centerLat = location.coords.latitude;
    const centerLng = location.coords.longitude;

    const markerHTML = characters.map(char => `
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
          var map = L.map('map').setView([${centerLat}, ${centerLng}], 14);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          L.circleMarker([${centerLat}, ${centerLng}], {
            radius: 8,
            fillColor: '#FFFFFF',
            color: '#4A90E2',
            weight: 3,
            opacity: 1,
            fillOpacity: 1
          }).addTo(map).bindPopup('<b>You are here</b>');

          ${markerHTML}
        </script>
      </body>
      </html>
    `;
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
            <Text style={styles.statValue}>{characters.length}</Text>
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
});
