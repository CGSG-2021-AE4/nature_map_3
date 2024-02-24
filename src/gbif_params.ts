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

/* Taxon rank enum */
export enum TaxonRank {
  eKindom = "KINDOM",
} /* End of 'TaxonRank' enum */

/* All possible search parameters type */
export type SearchParamsBase = {
  species: {
    name: {
      required: {
        usageKey: string;
      };
      query: {
      }
    };
  };
}; /* End of 'SearchParamsBase' type */

/* All possible search results type */
export type SearchResultsBase = {
  species: {
    name: {
    };
  };
}; /* End of 'SearchResultsBase' type */

/* Seach params support types */

// Common properties' types getter
export type PropType<Obj, Key extends keyof Obj> = Obj[Key];

// Search props type
export type SearchProps = {
  required: { [name: string]: any };
  query: { [name: string]: any };
};
// Search result type
export type SearchResultType = {
  count?: number;
  results: any;
}; /* End of 'SearchResult' type */

// Some additional types
type CheckPropsType<T> = T extends SearchProps ? T : never;
type CheckResultType<T> = T extends SearchResultType ? T : never;
export type SearchApi = keyof SearchParamsBase;
export type SearchType<Api extends SearchApi> = keyof PropType<SearchParamsBase, Api>;

// Main search params type getter
export type SeachParams<Api extends SearchApi, Type extends SearchType<Api>> = CheckPropsType<PropType<PropType<SearchParamsBase, Api>, Type>>;
// Main search result type getter
//export type SearchResult<Api extends SearchApi, Type extends SearchType<Api>> = CheckResultType<PropType<PropType<SearchResultsBase, Api>, Type>>;

/* END OF 'gbif_params.ts' FILE */