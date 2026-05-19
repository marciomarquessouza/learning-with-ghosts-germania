export function getRequired<T>(
  value: T | undefined | null,
  className: string,
  attributeName: string,
  errorMessage?: string,
): T {
  const message =
    errorMessage ?? `${className} - ${attributeName} was not initialized`;
  if (!value) {
    throw new Error(message);
  }

  return value;
}
