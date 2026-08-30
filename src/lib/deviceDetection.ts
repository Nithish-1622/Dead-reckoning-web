import { DeviceType } from './types';

/**
 * Intelligent Client-Side Device Detector
 * Implements Section 23 of the IDR specification:
 * Separate from responsive CSS - used specifically for installation gating & CTA dispatch.
 */
export function detectDevice(): DeviceType {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'desktop';
  }

  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // Android Mobile Check (excl. tablets where possible)
  if (/android/i.test(ua)) {
    if (/mobile/i.test(ua) || maxTouchPoints > 0) {
      // Check for android tablet signatures
      if (/tablet/i.test(ua) || (!/mobile/i.test(ua) && maxTouchPoints > 1)) {
        return 'tablet';
      }
      return 'android-mobile';
    }
    return 'android-mobile';
  }

  // iOS Device Detection (iPhone, iPod, iPad)
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && maxTouchPoints > 1)) {
    if (/iPad/.test(ua) || (navigator.platform === 'MacIntel' && maxTouchPoints > 1)) {
      return 'tablet';
    }
    return 'ios-mobile';
  }

  // General Tablet / Touch screen check
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }

  // Default to Desktop
  return 'desktop';
}

export function getDeviceDetails() {
  const deviceType = detectDevice();
  return {
    type: deviceType,
    isAndroid: deviceType === 'android-mobile',
    isIOS: deviceType === 'ios-mobile',
    isMobile: deviceType === 'android-mobile' || deviceType === 'ios-mobile',
    isDesktop: deviceType === 'desktop'
  };
}
