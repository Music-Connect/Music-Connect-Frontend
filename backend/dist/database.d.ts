import { Pool, type QueryResult } from "pg";
declare const pool: Pool;
export declare const query: (text: string, params?: any[]) => Promise<QueryResult>;
export declare const testConnection: () => Promise<boolean>;
export default pool;
//# sourceMappingURL=database.d.ts.map