export interface Vector2 {
  x: number;
  y: number;
}

export function vector2(x: number, y: number): Vector2 {
  return { x, y };
}

export interface Vector4 {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function vector4(
  x: number,
  y: number,
  width: number,
  height: number
): Vector4 {
  return { x, y, width, height };
}
