import { useState, useEffect } from "react";
export interface Coordinates { latitude: number; longitude: number; }
export function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setCoords({ latitude: coords.latitude, longitude: coords.longitude }),
      () => setCoords(null)
    );
  }, []);
  return { coords };
}
