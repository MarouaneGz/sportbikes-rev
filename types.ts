export interface Manufacturer {
    id: number;
    name: string;
    country: string;
    founded: number;
    logoUrl: string;
  }
  
  export interface Motorcycle {
    id: number;
    name: string;
    description: string;
    engineCapacity: number;
    isActive: boolean;
    releaseDate: string;
    imageUrl: string;
    category: string;
    features: string[];
    manufacturer: Manufacturer;
  }
  