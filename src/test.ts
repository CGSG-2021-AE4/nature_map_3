/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : overlay.ts
 * PURPOSE     : Nature Map 3 project.
 *               Overlay source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 22.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

/**/
import { MapInterface } from './map';
import { OverlayInterface, LogType, FormValueType } from './overlay';

import { createLinkSearch } from './components/link_search';

/* Global init function - because I can't bundle OL with React, don't know why, don't want to spend time on this now */
export function init( map: MapInterface, overlay: OverlayInterface ): void {
  /* Overlay creation */
  console.log(overlay);
  //overlay.log('SKJDHFKLSJDHFKJSHDf');
  
  document.getElementById('test-button').onclick = ()=>{
    overlay.log('Test simple  msg', LogType.eMessage);
    overlay.log('Test debug msg', LogType.eDebug);
    overlay.log('Test warning msg', LogType.eWarning);
    overlay.log('Test error msg', LogType.eError);
  };
  
  interface FormValues {
    str: string;
    number: number;
    bool: boolean;
  };
  
  var values: FormValues = {
    str: "asdfklsdfa",
    number: 1,
    bool: false,
  };
  document.getElementById('show-form-button').onclick = ()=>{
    overlay.showForm<FormValues>({
      name: 'test',
      values: {
        str: {
          name: 'str',
          type: 'STRING',
        },
        number: {
          name: 'number',
          type: 'NUMBER',
        },
        bool: {
          name: 'bool',
          type: 'BOOL',
        },
      },
      defaults: values,
      onCloseCallBack: ( newValues: FormValues )=>{
        console.log('NEW VALUES:');
        console.log(newValues);
        values = newValues;
      }
    });
  };
  
  createLinkSearch("link-search", map, overlay);
} /* End of 'init' function */

/* END OF 'test.ts' FILE */