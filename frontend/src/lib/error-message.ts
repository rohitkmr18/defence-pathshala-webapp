/** Extract a useful message without assuming a thrown value is an Error. */
export function errorMessage(error: unknown, fallback = "Internal Server Error"): string {
  if (error && typeof error === "object" && "message" in error &&
      typeof error.message === "string" && error.message) return error.message;
  return fallback;
}
