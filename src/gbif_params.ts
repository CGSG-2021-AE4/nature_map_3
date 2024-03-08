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
type Partial<T> = {
  [P in keyof T]?: T[P];
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

export type Habitat = 
  'MARINE' |
  'FRESHWATER' |
  'TERRESTRIAL'
; // End of 'Habitat' constraint

/********
 * The folowing types are parameters and responses of requests
 * I didn't better solution for getting keys except making a default const variable (ts-transform-keys does not work with React!!!!?)
 *   so every type has its const variable that contains default values.
 ********/

// Paging parameters type
export type Page = {
  limit: number;
  offset: number;
}; // End of 'Page' type
const pageDefault: Page = {
  limit: 100,
  offset: 0,
}; // End of 'pageDefault' object

// Paging response type
export type PagingResponse<Content> = {
  endOfRecords: boolean;
  count: number;
  results: Array<Content>;
} & Page; // End of 'PagingResponse' type
const pagingResponseDefault: PagingResponse<any> = {
  endOfRecords: true,
  count: 0,
  results: [],
  ...pageDefault,
};  // End of 'pagingResponseDefault' object

// Parsed name type
export type ParsedName = {
  key: number;
  scientificName: string;
  authorship: string;
  year: string;
  rankMarker: TaxonRank;
}; // End of 'ParsedName' type
const parsedNameDefault: ParsedName = {
  key: 0,
  scientificName: "",
  authorship: "",
  year: "",
  rankMarker: "KINGDOM",
};

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
const nameUsageMetricsDefault: NameUsageMetrics = {
  key: 0,
  numPhylum: 0,
  numClass: 0,
  numOrder: 0,
  numFamily: 0,
  numGenus: 0,
  numSubGenus: 0,
  numSpecies: 0,
  numChildren: 0,
  numDescendants: 0,
  numSynonyms: 0,
};

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
const nameUsageDefault: NameUsage = {
  key: 0,
  nubKey: 0,
  nameKey: 0,
  taxonId: "",
  sourceTaxonId: "",
  kingdom: "",
  phylum: "",
  order: "",
  family: "",
  genus: "",
  subgenus: "",
  species: "",
  class: "",
  kingdomKey: 0,
  phylumKey: 0,
  orderKey: 0,
  familyKey: 0,
  genusKey: 0,
  subgenusKey: 0,
  speciesKey: 0,
  datasetKey: "",
  parent: "",
  parentKey: 0,
  scientificName: "",
  vernacularName: "",
  authorship: "",
  rank: "KINGDOM",
};

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
const nameUsageSuggestResultDefault: NameUsageSuggestResult = {
  key: 0,
  nubKey: 0,
  nameKey: 0,
  kingdom: "",
  phylum: "",
  order: "",
  family: "",
  genus: "",
  subgenus: "",
  species: "",
  class: "",
  kingdomKey: 0,
  phylumKey: 0,
  orderKey: 0,
  familyKey: 0,
  genusKey: 0,
  subgenusKey: 0,
  speciesKey: 0,
  classKey: 0,
  datasetKey: "",
  parent: "",
  parentKey: 0,
  scientificName: "",
  canonicalName: "",
  rank: "KINGDOM",
};

// Taxon description parameters (for requests like suggest)
export type TaxonDescription = {
  datasetKey: string;
  rank: TaxonRank;
  higherTaxonKey: number;
  habitat: Habitat;
}; // End of 'TaxonDescription' type
const taxonDescriptionDefault: TaxonDescription = {
  datasetKey: "",
  rank: "KINGDOM",
  higherTaxonKey: 0,
  habitat: "MARINE",
};

/* All possible reuests */
export type RequestBase = {
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
      NameUsageMetrics
    >;
    children: SearchBaseData<
      { usageKey: number; },
      Page,
      PagingResponse<NameUsage>
    >;
    suggest: SearchBaseData<
      {},
      { q: string; } & TaxonDescription,
      Array<NameUsageSuggestResult>
    >;
  };
}; /* End of 'RequestBase' type */

/* All possible reuests */
export const requestBaseDefault: RequestBase = {
  species: {
    default: {
      required: { usageKey: 0 },
      query: {},
      response: parsedNameDefault,
    },
    name: {
      required: { usageKey: 0 },
      query: {},
      response: parsedNameDefault,
    },
    metrics: {
      required: { usageKey: 0 },
      query: {},
      response: nameUsageMetricsDefault,
    },
    children: {
      required: { usageKey: 0, },
      query: pageDefault,
      response: pagingResponseDefault,
    },
    suggest: {
      required: {},
      query: {...taxonDescriptionDefault, q: "" },
      response: [],
    },
  },
}; /* End of 'requestBaseDefault' type */

/* Seach params support types */

// Search props type
export type ReqProps = {
  required: any;
  query: any;
};// End of 'ReqProps' type
// Search response type
export type ReqResponse = {
  count?: number;
  results: any;
}; // End of 'ReqResponse' type

// Some additional keys
export type ReqApiKey = keyof RequestBase;
export type ReqTypeKey<Api extends ReqApiKey> = keyof PropType<RequestBase, Api>;

// Get exact data options
type GetPropsData<ReqData> = ReqData extends SearchBaseData<any, any, any> ? {
  required: ReqData["required"];
  query: ReqData["query"];
} : never;
type GetResponseData<ReqData> = ReqData extends SearchBaseData<any, any, any> ? ReqData["response"] : never;

// Main reqest types getters 
export type GetReqProps<Api extends ReqApiKey, Type extends ReqTypeKey<Api>> = GetPropsData<PropType<PropType<RequestBase, Api>, Type>>;
// Main search response type getter
export type GetReqResponse<Api extends ReqApiKey, Type extends ReqTypeKey<Api>> = GetResponseData<PropType<PropType<RequestBase, Api>, Type>>;

/* END OF 'gbif_params.ts' FILE */
