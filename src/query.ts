/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : query.ts
 * PURPOSE     : Nature Map 3 project.
 *               Query tools source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 09.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

/* Query options interface */
export interface QueryParams {
  [paramName: string]: string;
} /* End of 'QueryParams' interface */

/* Query to string function */
export function queryToStr( query: QueryParams ): string {
  let queryStr: string = "";
  Object.keys(query).map((e, i)=>{
    if (query[e] != undefined)
      queryStr += (i != 0 ? '&' : '') + e + '=' + query[e];
  });

  return queryStr;
} /* End of 'queryToStr' function */

/* Query to URL string function */
export function queryToURL( url: string, query: QueryParams ): string {
  var queryStr = "";
  Object.keys(query).map((e, i)=>{
    if (query[e] != undefined)
      queryStr += (i != 0 ? '&' : '') + e + '=' + query[e];
  });

  return url + "?" + queryStr;
} /* End of 'queryToURL' function */

/* END OF 'query.ts' FILE */