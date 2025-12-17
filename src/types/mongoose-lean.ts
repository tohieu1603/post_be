/**
 * Utility types for Mongoose lean queries
 * Fixes type mismatch between Document interface and lean() results
 */

import { Document, Types } from 'mongoose';

/**
 * Creates a lean version of a Mongoose Document type
 * Removes Mongoose Document methods, keeping only the data properties
 */
export type LeanDocument<T> = T extends Document
  ? Omit<T, keyof Document> & { _id: Types.ObjectId }
  : T;

/**
 * Helper to cast lean query results
 */
export function asLean<T>(doc: unknown): T {
  return doc as T;
}

/**
 * Helper to cast lean array results
 */
export function asLeanArray<T>(docs: unknown): T[] {
  return docs as T[];
}
