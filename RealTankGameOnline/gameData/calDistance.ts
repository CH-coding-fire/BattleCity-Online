export function getDistance(xA: number, yA: number, xB: number, yB: number) {
  var xDiff = xA - xB;
  var yDiff = yA - yB;

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
