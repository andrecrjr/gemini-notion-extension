export class DataSourceResolver {
    client;
    cache;
    constructor(client) {
        this.client = client;
        this.cache = new Map();
    }
    /**
     * Resolves a database_id to its primary data_source_id
     */
    async resolve(databaseId) {
        if (this.cache.has(databaseId)) {
            return this.cache.get(databaseId);
        }
        try {
            const db = await this.client.databases.retrieve({ database_id: databaseId });
            // The API version 2025-09-03 introduces data_sources array
            const dataSources = db.data_sources;
            if (!dataSources || dataSources.length === 0) {
                throw new Error(`No data sources found for database ${databaseId}. Make sure you are using API version 2025-09-03.`);
            }
            const dataSourceId = dataSources[0].id;
            this.cache.set(databaseId, dataSourceId);
            return dataSourceId;
        }
        catch (error) {
            throw new Error(`Failed to resolve data_source_id for database ${databaseId}: ${error.message}`);
        }
    }
    /**
     * Clears the internal cache
     */
    clearCache() {
        this.cache.clear();
    }
}
//# sourceMappingURL=data-source-resolver.js.map