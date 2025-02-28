import * as fs from 'fs';
import csv from 'csv-parser';

/**
 * Reads a CSV file and returns all rows as an array.
 * Optionally, a callback can be provided to process each row.
 *
 * @param filePath - The path to the CSV file.
 * @param onRow - Optional callback executed for each row.
 * @returns A promise that resolves with an array of rows.
 */
export function readCsv<T = any>(filePath: string, onRow?: (row: T) => void): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row: T) => {
                results.push(row);
                if (onRow) {
                    onRow(row);
                }
            })
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

/**
 * Asynchronously iterates over CSV rows.
 *
 * @param filePath - The path to the CSV file.
 * @returns An async generator that yields each row.
 */
export async function* iterateCsv<T = any>(filePath: string): AsyncGenerator<T, void, unknown> {
    const stream = fs.createReadStream(filePath).pipe(csv());
    for await (const row of stream) {
        yield row as T;
    }
}