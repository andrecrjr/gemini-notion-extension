import { Client } from '@notionhq/client';
export declare class DataSourceResolver {
    private client;
    private cache;
    constructor(client: Client);
    /**
     * Resolves a database_id to its primary data_source_id
     */
    resolve(databaseId: string): Promise<string>;
    /**
     * Clears the internal cache
     */
    clearCache(): void;
}
//# sourceMappingURL=data-source-resolver.d.ts.map