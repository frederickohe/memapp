import { PixelRatio, Platform, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Get actual device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Baseline dimensions (iPhone 11)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

// Calculate scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
const scale = Math.min(widthScale, heightScale); 

const DEFAULT_MIN_FONT = 12;
const DEFAULT_MAX_FONT = 42;

export const scaleFont = (
  px,
  { min = DEFAULT_MIN_FONT, max = DEFAULT_MAX_FONT, respectFontScale = true } = {}
) => {
  let val = px * scale;

  if (respectFontScale) {
    const userScale = PixelRatio.getFontScale?.() ?? 1;
    
    // Cap Android's font scale to prevent extreme values
    const cappedScale = Platform.OS === 'android' 
      ? Math.min(userScale, 1.3) // Limit Android to 1.3x max
      : userScale;
    
    val *= cappedScale;
  }

  // Clamp and round
  const clamped = Math.max(min, Math.min(val, max));
  return Math.round(PixelRatio.roundToNearestPixel(clamped));
};

// Alternative: Use aspect-ratio aware scaling
export const scaleFont2 = (
  px,
  { min = DEFAULT_MIN_FONT, max = DEFAULT_MAX_FONT, respectFontScale = true } = {}
) => {
  // Calculate based on shorter dimension to handle various aspect ratios
  const shortDimension = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
  const baseShortDimension = Math.min(BASE_WIDTH, BASE_HEIGHT);
  const scaleFactor = shortDimension / baseShortDimension;
  
  let val = px * scaleFactor;

  if (respectFontScale) {
    const userScale = PixelRatio.getFontScale?.() ?? 1;
    const cappedScale = Platform.OS === 'android' 
      ? Math.min(userScale, 1.3)
      : userScale;
    val *= cappedScale;
  }

  const clamped = Math.max(min, Math.min(val, max));
  return Math.round(PixelRatio.roundToNearestPixel(clamped));
};

export const sw = (percent) => wp(`${percent}%`);
export const sh = (percent) => hp(`${percent}%`);