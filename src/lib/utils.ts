import { type ClassValue, clsx } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Генерирует уникальный идентификатор с использованием nanoid
 */
export const generateId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 24)
