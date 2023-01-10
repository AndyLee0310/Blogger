import algoliasearch from "algoliasearch";

const client = algoliasearch("Application ID", "Search-Only API Key");
// const algolia = client.initIndex("blogger");

const clientUpdate = algoliasearch("Application ID", "API Key");
// const algoliaUpdate = clientUpdate.initIndex("blogger");

export const algolia = client.initIndex("blogger");
export const algoliaUpdate = clientUpdate.initIndex("blogger");