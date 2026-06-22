import { TASKBAR_HEIGHT } from "utils/taskbarHeight";

export const generateRandomPosition = (
  width: number,
  height: number,
  index: number,
  existingPositions: { x: number; y: number }[] = []
) => {
  const padding = 50;
  const taskbarHeight = TASKBAR_HEIGHT;
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth - padding : 1024;
  const viewportHeight =
    typeof window !== "undefined"
      ? window.innerHeight - taskbarHeight - padding
      : 768;

  let position: { x: number; y: number };
  let attempts = 0;
  const maxAttempts = 25;
  const minSpacing = 45;

  const zPoints = [
    { x: 0.15, y: 0.2, variance: 0.1 }, // Top-left
    { x: 0.45, y: 0.2, variance: 0.1 }, // Top-middle
    { x: 0.75, y: 0.3, variance: 0.15 }, // Top-right
    { x: 0.25, y: 0.5, variance: 0.15 }, // Middle-left
    { x: 0.65, y: 0.6, variance: 0.2 }, // Middle-right
  ];

  do {
    const basePoint = zPoints[index % zPoints.length];
    const xVariance = (Math.random() - 0.5) * 2 * basePoint.variance;
    const yVariance = (Math.random() - 0.5) * 2 * basePoint.variance;

    const x = Math.max(
      padding,
      Math.min(
        viewportWidth - width,
        Math.floor(viewportWidth * (basePoint.x + xVariance))
      )
    );

    const y = Math.max(
      padding,
      Math.min(
        viewportHeight - height,
        Math.floor(viewportHeight * (basePoint.y + yVariance))
      )
    );

    position = { x, y };

    const isValidPosition = existingPositions.every((pos) => {
      const xDiff = Math.abs(pos.x - position.x);
      const yDiff = Math.abs(pos.y - position.y);
      const diagonalDistance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      return (
        xDiff > minSpacing &&
        yDiff > minSpacing &&
        diagonalDistance > Math.min(width, height) * 0.45
      );
    });

    if (isValidPosition || attempts >= maxAttempts) break;
    attempts++;
  } while (true);

  return position;
};
