/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : gbif.ts
 * PURPOSE     : Nature Map 3 project.
 *               GBIF database source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 24.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import TileSource from "ol/source/Tile";
import { SearchProps, SearchResponse, SearchApiKey, SearchTypeKey, GetSearchProps, GetSearchResponse } from "./gbif_params";
import { OverlayInterface } from "./overlay";
import { queryToStr } from "./query";

const defaultSearchLimit = 100;

/* GBIF search class props interface */
export interface GbifSearchProps {
  overlay: OverlayInterface;
} /* End of 'GbifSearchProps' interface */

/* GBIF search class */
export class GbifSearch {
  props: GbifSearchProps;
  offset: Number;
  limit: Number;
  api: SearchApiKey;
  type: SearchTypeKey<SearchApiKey>;
  searchProps: SearchProps;
  
  /* Constructor function */
  constructor( props: GbifSearchProps ) {
    this.props = props;
    this.offset = 0;
    this.limit = defaultSearchLimit;
  } /* End of 'constructor' function */

  /* Set limit function */
  setLimit = ( newLimit: number ): void => {
    this.limit = newLimit;
  } /* End of 'setLimit' function */

  /* First search request function */
  search = async <Api extends SearchApiKey, Type extends SearchTypeKey<Api>>( api: Api, type: Type, props: GetSearchProps<Api, Type> ): Promise<GetSearchResponse<Api, Type>> => {
    // Reset
    this.offset = 0;

    // Set new search props
    this.api = api;
    this.type = type as SearchTypeKey<SearchApiKey>;
    this.searchProps = props;

    console.log(this);
    
    //this.props.overlay.log(`API: ${getS<Api>({} as Api)}`);
    return this.continueSearch(api, type); // MEGA TEMP SHIT
  } /* End of 'search' function */

  /* Continue search with the same params(already set), with right offset function */
  continueSearch = async <Api extends SearchApiKey, Type extends SearchTypeKey<Api>>( api: Api, type: Type ): Promise<GetSearchResponse<Api, Type>> => {
    const queryStr = queryToStr(this.searchProps.query);
    return (await fetch(`https://api.gbif.org/v1/${api}/${this.searchProps.required.usageKey}/${String(type)}${queryStr.length > 0 ? "?" : ""}${queryStr}`)).json().then(( data: any )=>{ return data as GetSearchResponse<Api, Type>; });
  } /* End of 'continueSearch' function */
  
}; /* End of 'GbifSearch' class */

/* GBIF map class */

/* END OF 'gbif.ts' FILE */
