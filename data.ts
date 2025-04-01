import fetch from 'node-fetch';
import { Manufacturer, Motorcycle } from './types';

const manufacturersUrl = 'https://raw.githubusercontent.com/MarouaneGz/sportbikes-rev/refs/heads/main/data/manufacturers.json';
const motorcyclesUrl = 'https://raw.githubusercontent.com/MarouaneGz/sportbikes-rev/refs/heads/main/data/sportbikes.json';

export async function fetchManufacturers(): Promise<Manufacturer[]> {
  const response = await fetch(manufacturersUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch manufacturers');
  }
  const data = await response.json() as Manufacturer[];
  return data;
}

export async function fetchMotorcycles(): Promise<Motorcycle[]> {
  const response = await fetch(motorcyclesUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch motorcycles');
  }
  const data = await response.json() as Motorcycle[];
  return data;
}