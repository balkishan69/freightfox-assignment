import { describe, it, expect } from 'vitest';
import { clampProgress } from './pathGeometry';
describe('pathGeometry utilities', () => {
  it('clamps progress between 0 and 1', () => {
    expect(clampProgress(-0.5)).toBe(0);
    expect(clampProgress(0)).toBe(0);
    expect(clampProgress(0.5)).toBe(0.5);
    expect(clampProgress(1)).toBe(1);
    expect(clampProgress(1.5)).toBe(1);
  });
});
