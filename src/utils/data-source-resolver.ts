import { Client } from '@notionhq/client';

export class DataSourceResolver {
    private client: Client;
    private cache: Map<string, string>;

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map();
    }

    /**
     * Resolves a database_id to its primary data_source_id
     */
    async resolve(databaseId: string): Promise<string> {
        if (this.cache.has(databaseId)) {
            return this.cache.get(databaseId)!;
        }

        try {
            const db = await this.client.databases.retrieve({ database_id: databaseId });

            // The API version 2025-09-03 introduces data_sources array
            const dataSources = (db as any).data_sources;

            if (!dataSources || dataSources.length === 0) {
                throw new Error(`No data sources found for database ${databaseId}. Make sure you are using API version 2025-09-03.`);
            }

            const dataSourceId = dataSources[0].id;
            this.cache.set(databaseId, dataSourceId);
            return dataSourceId;
        } catch (error: any) {
            throw new Error(`Failed to resolve data_source_id for database ${databaseId}: ${error.message}`);
        }
    }

    /**
     * Clears the internal cache
     */
    clearCache(): void {
        this.cache.clear();
    }
}
