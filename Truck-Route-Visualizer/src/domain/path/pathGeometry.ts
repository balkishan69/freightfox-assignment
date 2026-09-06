export function clampProgress(progress: number): number {
  return Math.max(0, Math.min(1, progress));
}
export function getPointAtProgress(path: SVGPathElement, progress: number): DOMPoint {
  const length = path.getTotalLength();
  const clampedProgress = clampProgress(progress);
  return path.getPointAtLength(clampedProgress * length);
}
export function getRotationAtProgress(path: SVGPathElement, progress: number): number {
  const length = path.getTotalLength();
  const clampedProgress = clampProgress(progress);
  const delta = 0.001; 
  const progressBefore = Math.max(0, clampedProgress - delta);
  const progressAfter = Math.min(1, clampedProgress + delta);
  const ptBefore = path.getPointAtLength(progressBefore * length);
  const ptAfter = path.getPointAtLength(progressAfter * length);
  const dx = ptAfter.x - ptBefore.x;
  const dy = ptAfter.y - ptBefore.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return angle;
}
