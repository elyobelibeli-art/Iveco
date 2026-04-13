/**
 * Smoothly interpolates a numeric value toward a target using a configurable speed.
 * This helper keeps animation math in one place so components stay readable.
 */
export function smoothLerp(current, target, speed = 0.1) {
  return current + (target - current) * speed;
}
