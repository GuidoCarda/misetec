import pool from "./db";

export async function select<T>(
  query: string,
  params?: any[]
): Promise<Partial<T>[]> {
  const [results] = await pool.execute(query, params);
  return results as T[];
}
