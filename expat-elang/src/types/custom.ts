import { EventImageFeature } from './event';
import {
  EnhancedImageAsset,
  ExistingImageType,
} from '../components/common/ImageSelectionManager';

// Enhanced types for images with title, alt, and feature flag
export interface EnhancedEventImageFeature extends EventImageFeature {
  title: string;
  alt: string;
  isFeature: boolean;
}

// Re-export the component types for easier imports elsewhere
export type { EnhancedImageAsset, ExistingImageType };

// Legacy type - to be removed after all uses are migrated to EnhancedImageAsset
export interface EnhancedAsset {
  uri?: string;
  fileName?: string;
  type?: string;
  title: string;
  alt: string;
  isFeature: boolean;
} 