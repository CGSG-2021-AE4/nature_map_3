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

import React from "react";
import { OverlayComponent, OverlayProps, LogType, FormProps, FormValueType } from "./components/overlay";
import { renderComponent, ButtonNameType } from "./components/support";


export { OverlayProps, LogType, FormProps, FormValueType, ButtonNameType };

/* Overlay interface that other classes would get */
export interface OverlayInterface {
  log: ( str: string, type: LogType )=>void;
  showForm: <ValuesType>( props: FormProps<ValuesType> )=> void;
} /* End of 'OverlayInterface'

/* Overlay main class */
export class Overlay {
  ref: React.RefObject<OverlayComponent>;
  
  /* Constructor function */
  constructor( targetElementId: string, props: OverlayProps ) {
    this.ref = React.createRef<OverlayComponent>();
    
    const e = React.createElement(OverlayComponent, { ref: this.ref, ...props });
    renderComponent(targetElementId, e);
  } /* End of 'constructor' function */

  /* Log string function */
  log = ( str: string, type: LogType = LogType.eMessage ): void => {
    if (this.ref.current)
      this.ref.current.log({ str: str, type: type });
    else
      console.log('LOG *' + String(type) + '* : ' + str + '\n');
  } /* End of 'log' function */

  /* Show form function */
  showForm = <ValuesType>( props: FormProps<ValuesType> ): void => { // TODO make it arrow function
    if (this.ref.current)
      this.ref.current.showForm(props);
    else
      console.log("ERROR: current is null");
  } /* End of 'showForm' function */

  /* Get self interface function */
  getInterface(): OverlayInterface {
    return {
      log: this.log,
      showForm: this.showForm,
    };
  } /* End of 'getInterface' function */

} /* End of 'Overlay' class */