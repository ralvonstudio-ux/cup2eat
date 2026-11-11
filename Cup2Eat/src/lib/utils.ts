import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const IG_DM = "https://ig.me/m/cup2eat"
export const IG_PROFILE = "https://www.instagram.com/cup2eat/"
