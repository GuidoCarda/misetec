import pool from "./db";

export async function select<T>(
  query: string,
  params?: any[]
): Promise<Partial<T>[]> {
  const [results] = await pool.execute(query, params);
  return results as T[];
}

export function getNamedPlaceholders(
  queryParams: Record<string, string | undefined>
) {
  const namedPlaceholders = Object.keys(queryParams)
    .filter((key) => key !== undefined)
    .map((key) => {
      return `${key} = :${key}`;
    })
    .join(" AND ");

  return namedPlaceholders;
}
