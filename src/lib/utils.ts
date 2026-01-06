/**
 * Team Topologies Designer - Utility Functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID
 */
export function generateId(prefix?: string): string {
  const id = nanoid(10);
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Download a file to the user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse array from semicolon-separated string (for CSV import)
 */
export function parseArrayString(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(';').map(v => v.trim()).filter(Boolean);
}

/**
 * Format array to semicolon-separated string (for CSV export)
 */
export function formatArrayString(values: string[]): string {
  return values.join(';');
}
