/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : gbif_params.ts
 * PURPOSE     : Nature Map 3 project.
 *               GBIF database requests params and types source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 24.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */


// Common properties' types getter
export type PropType<Obj, Key extends keyof Obj> = Obj[Key];
// Search base data type
type SearchBaseData<Required, Query, Response> = {
  required: Required;
  query: Query;
  response: Response;
};

// Taxon rank contraint
export type TaxonRank =
  'KINGDOM' |
  'PHYLUM'  |
  'ORDER'   |
  'FAMILY'  |
  'GENUS'   |
  'SPECIES' |
  'CLASS'
; // End of 'TaxonRank' constraint

// Paging params type
export type PagingParams = {
  limit: number;
  offset: number;
}; // End of 'PagingParams' type

// Paging response type
export type PagingResponse<Content> = {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count: number;
  results: [Content];
}; // End of 'PagingResponse' type

// Parsed name type
export type ParsedName = {
  key: number;
  scientificName: string;
  authorship: string;
  year: string;
  // Some unnecessary fields
  rankMarker: TaxonRank;
}; // End of 'ParsedName' type

// Name usage metrics type
export type NameUsageMetrics = {
  key: number;
  numPhylum: number;
  numClass: number;
  numOrder: number;
  numFamily: number;
  numGenus: number;
  numSubGenus: number;
  numSpecies: number;
  numChildren: number;
  numDescendants: number; // All
  numSynonyms: number;
}; // End of 'NameUsageMetrics' type

// Name usage type
export type NameUsage = {
  key: number;
  nubKey: number;
  nameKey: number;
  taxonId: string;
  sourceTaxonId: string;

  // Taxonomy
  kingdom: string;
  phylum: string;
  order: string;
  family: string;
  genus: string;
  subgenus: string;
  species: string;
  class: string; // ??? where key for class
  // Keys for them
  kingdomKey: number;
  phylumKey: number;
  orderKey: number;
  familyKey: number;
  genusKey: number;
  subgenusKey: number;
  speciesKey: number;

  // Dataset
  datasetKey: string;

  // Parent
  parent: string;
  parentKey: number;

  // Some personal info
  scientificName: string;
  vernacularName: string; // Common name
  authorship: string;
  rank: TaxonRank;
}; // End of 'NameUsage' type

// Name usage suggest result type
export type NameUsageSuggestResult = {
  key: number;
  nubKey: number;
  nameKey: number;
  
  // Taxonomy
  kingdom: string;
  phylum: string;
  order: string;
  family: string;
  genus: string;
  subgenus: string;
  species: string;
  class: string; // ??? where key for class
  // Keys for them
  kingdomKey: number;
  phylumKey: number;
  orderKey: number;
  familyKey: number;
  genusKey: number;
  subgenusKey: number;
  speciesKey: number;
  classKey: number;

  // Dataset
  datasetKey: string;

  // Parent
  parent: string;
  parentKey: number;

  // Some personal info
  scientificName: string;
  canonicalName: string; // Common name
  rank: TaxonRank;
}; // End of 'NameUsageSuggestResult' type

/* All possible search parameters type */
export type SearchBase = {
  species: {
    default: SearchBaseData<
      { // required
        usageKey: number;
      },
      { // query
      },
      ParsedName // result
    >;
    name: SearchBaseData<
      { usageKey: number; },
      {},
      ParsedName
    >;
    metrics: SearchBaseData<
      { usageKey: number; },
      {},
      ParsedName
    >;
    children: SearchBaseData<
      { usageKey: number; },
      PagingParams,
      PagingResponse<NameUsage>
    >;
    suggest: SearchBaseData<
      {},
      {
        // TODO
      },
      [NameUsageSuggestResult]
    >;
  };
}; /* End of 'SearchBase' type */

/* Seach params support types */

// Search props type
export type SearchProps = {
  required: any;
  query: any;
};
// Search response type
export type SearchResponse = {
  count?: number;
  results: any;
}; /* End of 'SearchResponse' type */

// Some additional keys
export type SearchApiKey = keyof SearchBase;
export type SearchTypeKey<Api extends SearchApiKey> = keyof PropType<SearchBase, Api>;

// Get exact data options
type GetPropsData<SearchData> = SearchData extends SearchBaseData<any, any, any> ? {
  required: SearchData["required"];
  query: SearchData["query"];
} : never;
type GetResponseData<SearchData> = SearchData extends SearchBaseData<any, any, any> ? SearchData["response"] : never;

// Main search types getters 
export type GetSearchProps<Api extends SearchApiKey, Type extends SearchTypeKey<Api>> = GetPropsData<PropType<PropType<SearchBase, Api>, Type>>;
// Main search response type getter
export type GetSearchResponse<Api extends SearchApiKey, Type extends SearchTypeKey<Api>> = GetResponseData<PropType<PropType<SearchBase, Api>, Type>>;

/* END OF 'gbif_params.ts' FILE */
