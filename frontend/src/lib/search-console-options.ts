export type SearchDimension = "query" | "page" | "country" | "device" | "date";
const DIMENSIONS: SearchDimension[] = ["query", "page", "country", "device", "date"];

/** Validate reporting inputs before any Google request. No credentials or writes. */
export function searchConsoleOptions(params: URLSearchParams) {
  const dimensions = (params.get("dimensions") || "page").split(",");
  if (dimensions.some((d) => !DIMENSIONS.includes(d as SearchDimension)) || new Set(dimensions).size !== dimensions.length) {
    throw new Error("dimensions must be unique query,page,country,device,date values");
  }
  const pageEquals = params.get("page_equals") || undefined;
  if (pageEquals) {
    const url = new URL(pageEquals);
    if (url.origin !== "https://www.defencepathshala.in" || url.search || url.hash || url.username || url.password) {
      throw new Error("page_equals must be a canonical Defence Pathshala URL without query or fragment");
    }
  }
  const startDate = params.get("start_date") || undefined;
  const endDate = params.get("end_date") || undefined;
  for (const date of [startDate, endDate]) {
    if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) {
      throw new Error("Dates must be valid YYYY-MM-DD values");
    }
  }
  if (Boolean(startDate) !== Boolean(endDate) || (startDate && endDate && startDate > endDate)) {
    throw new Error("Supply both dates with start_date <= end_date");
  }
  const rawStartRow = params.get("start_row") || "0";
  if (!/^\d+$/.test(rawStartRow) || !Number.isSafeInteger(Number(rawStartRow))) throw new Error("start_row must be a non-negative integer");
  return {
    dimensions: dimensions as SearchDimension[], pageEquals,
    pageContains: pageEquals ? undefined : params.get("page_contains") || "/pyqs/",
    startDate, endDate, startRow: Number(rawStartRow), rowLimit: 1000,
  };
}
