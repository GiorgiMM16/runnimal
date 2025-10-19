import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

interface ActivityState {
  isActive: boolean;
  activityType: string | null;
  startTime: number | null;
  distance: number;
  speed: number;
  heartRate: number;
  path: [number, number][];
  elapsedTime: number;
}

interface ActivityTrackingContextType {
  activityState: ActivityState;
  startActivity: (activityType: string) => void;
  endActivity: () => void;
  currentLocation: Location.LocationObject | null;
}

const ActivityTrackingContext = createContext<ActivityTrackingContextType | undefined>(undefined);

export function ActivityTrackingProvider({ children }: { children: React.ReactNode }) {
  const [activityState, setActivityState] = useState<ActivityState>({
    isActive: false,
    activityType: null,
    startTime: null,
    distance: 0,
    speed: 0,
    heartRate: 0,
    path: [],
    elapsedTime: 0,
  });

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const timeInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activityState.isActive) {
      startLocationTracking();
      startTimeTracking();
    } else {
      stopLocationTracking();
      stopTimeTracking();
    }

    return () => {
      stopLocationTracking();
      stopTimeTracking();
    };
  }, [activityState.isActive]);

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const currentPos = await Location.getCurrentPositionAsync({});
      setCurrentLocation(currentPos);

      setActivityState(prev => ({
        ...prev,
        path: [[currentPos.coords.latitude, currentPos.coords.longitude]],
      }));

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5,
          timeInterval: 1000,
        },
        (location) => {
          setCurrentLocation(location);
          updateActivityMetrics(location);
        }
      );
    } catch (error) {
      console.error('Location tracking error:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const startTimeTracking = () => {
    timeInterval.current = setInterval(() => {
      setActivityState(prev => {
        if (!prev.startTime) return prev;
        return {
          ...prev,
          elapsedTime: Date.now() - prev.startTime,
          heartRate: 120 + Math.floor(Math.random() * 40),
        };
      });
    }, 1000);
  };

  const stopTimeTracking = () => {
    if (timeInterval.current) {
      clearInterval(timeInterval.current);
      timeInterval.current = null;
    }
  };

  const updateActivityMetrics = (location: Location.LocationObject) => {
    setActivityState(prev => {
      const newPath = [...prev.path, [location.coords.latitude, location.coords.longitude] as [number, number]];

      let newDistance = prev.distance;
      if (prev.path.length > 0) {
        const lastPoint = prev.path[prev.path.length - 1];
        newDistance += calculateDistance(
          lastPoint[0],
          lastPoint[1],
          location.coords.latitude,
          location.coords.longitude
        );
      }

      const speed = location.coords.speed ? location.coords.speed * 3.6 : prev.speed * 0.9 + (2 + Math.random() * 8) * 0.1;

      return {
        ...prev,
        path: newPath,
        distance: newDistance,
        speed: Math.max(0, speed),
      };
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

  const startActivity = (activityType: string) => {
    setActivityState({
      isActive: true,
      activityType,
      startTime: Date.now(),
      distance: 0,
      speed: 0,
      heartRate: 85 + Math.floor(Math.random() * 20),
      path: [],
      elapsedTime: 0,
    });
  };

  const endActivity = () => {
    setActivityState({
      isActive: false,
      activityType: null,
      startTime: null,
      distance: 0,
      speed: 0,
      heartRate: 0,
      path: [],
      elapsedTime: 0,
    });
  };

  return (
    <ActivityTrackingContext.Provider
      value={{
        activityState,
        startActivity,
        endActivity,
        currentLocation,
      }}
    >
      {children}
    </ActivityTrackingContext.Provider>
  );
}

export function useActivityTracking() {
  const context = useContext(ActivityTrackingContext);
  if (context === undefined) {
    throw new Error('useActivityTracking must be used within an ActivityTrackingProvider');
  }
  return context;
}
