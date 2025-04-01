import { Manufacturer, Motorcycle } from "./types";
import manufacturers from "./data/manufacturers.json";
import motorcycles from "./data/sportbikes.json";

export function getManufacturers(): Manufacturer[] {
  return manufacturers;
}

export function getMotorcycles(): Motorcycle[] {
  return motorcycles;
}

export function getManufacturerById(id: number): Manufacturer | undefined {
  return manufacturers.find((m: Manufacturer) => m.id === id);
}

export function getMotorcycleById(id: number): Motorcycle | undefined {
  return motorcycles.find((m: Motorcycle) => m.id === id);
}