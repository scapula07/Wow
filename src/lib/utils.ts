import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saveToSessionStorage(key: string, value: string) {
  return sessionStorage.setItem(key, value);
}

export function getFromSessionStorage(key: string) {
  return sessionStorage.getItem(key);
}

export function removeFromSessionStorage(key: string) {
  return sessionStorage.removeItem(key);
}
