// frontend/types/google-maps.d.ts
declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    fitBounds(bounds: LatLngBounds): void;
  }
  
  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng | null;
    addListener(eventName: string, handler: () => void): unknown;  // Changed to unknown
  }
  
  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map?: Map, marker?: Marker): void;
  }
  
  class LatLng {
    constructor(lat: number, lng: number);
  }
  
  class LatLngBounds {
    constructor();
    extend(point: LatLng | LatLngLiteral): void;
  }
  
  class Size {
    constructor(width: number, height: number);
  }
  
  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeId?: string;
  }
  
  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    animation?: Animation;
    icon?: {
      url: string;
      scaledSize: Size;
    };
  }
  
  interface InfoWindowOptions {
    content?: string;
  }
  
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  
  enum Animation {
    DROP,
    BOUNCE
  }
  
  // Replaced empty interface with a type alias
  type MapsEventListener = unknown;
}