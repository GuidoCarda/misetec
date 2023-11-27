import pool from "./db";

export async function select<T>(
  query: string,
  params?: any[]
): Promise<Partial<T>[]> {
  const [results] = await pool.execute(query, params);
  return results as T[];
}

export function getNamedPlaceholders(
  queryParams: Record<string, string | undefined>,
  separator = "AND",
  comparator = "="
) {
  const namedPlaceholders = Object.keys(queryParams)
    .filter((key) => key !== undefined)
    .map((key) => {
      return `${key} ${comparator} :${key}`;
    })
    .join(` ${separator} `);

  return namedPlaceholders;
}

export function getUpdateNamedPlaceholders(
  queryParams: Record<string, string>
) {
  const namedPlaceholders = Object.entries(queryParams)
    .filter(([_, v]) => v !== undefined)
    .map(([key, _]) => `${key} = :${key}`)
    .join(", ");

  return namedPlaceholders;
}

export function getInsertNamedPlacehoders(queryParams: Record<string, string>) {
  const columns = Object.keys(queryParams).join(", ");
  const placeholders = Object.keys(queryParams)
    .map((v) => `:${v}`)
    .join(", ");

  return `(${columns}) VALUES (${placeholders})`;
}
