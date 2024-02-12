/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : overlay.tsx
 * PURPOSE     : Nature Map 3 project.
 *               Overlay component source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 11.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import React from "react";
import { PushButton, ClickButton, renderComponent } from "./support";

/* Log type enum */
export enum LogType {
  eMessage = 'eMessage',  // Just message
  eDebug = 'eDebug',      // Debug information
  eWarning = 'eWarning',  // Warning
  eError = 'eError',      // Not fatal error
} /* End of 'LogType' enum */

/* Log style for different message types value */
const logStyleTable: { [type: string]: React.CSSProperties } = {
  eMessage: { margin: '0.5em', border: '0.2em solid #a9a9a9', backgroundColor: 'rgb(209 209 209 / 71%)' },
  eDebug: { margin: '0.5em', border: '0.2em solid #3737c8', backgroundColor: 'rgb(115 105 240 / 49%)' },
  eWarning: { margin: '0.5em', border: '0.2em solid #fed01b', backgroundColor: 'rgb(255 255 154 / 67%)' },
  eError: { margin: '0.5em', border: '0.2em solid #d60000', backgroundColor: 'rgb(255 112 112 / 44%)' },
}; /* End of 'logStyleTable' value */

/* Log message interface */
export interface LogMsg {
  type: LogType;
  str: string;
} /* End of 'LogMsg' interface */

/* Overlay props interface */
export interface OverlayProps {
  logLifeTime?: number;
} /* End of 'OverlayProps' interface */

/* Overlay compoent react state interface */
interface OverlayState {
  logStack: Array<LogMsg>;
}/* End of 'OverlayState' interface */

/* Overlay component class */
class OverlayComponent extends React.Component<React.PropsWithRef<OverlayProps>, OverlayState> {

  /* Constructor function */
  constructor( props: React.PropsWithRef<OverlayProps> ) {
    if (!props.logLifeTime)
      props.logLifeTime = 8000; // Default value(8 seconds)
    super(props);
    this.state = {
      logStack: [],
    };
  } /* End of 'constructor' funciton */

  /* React render function */
  render() {
    return (<>
      <div style={{
        zIndex: 900,
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
      }}>
        {this.state.logStack.map((e)=>{
        return (<div style={logStyleTable[e.type]}>
          <p style={{ paddingInline: '0.5em', paddingBlock: '0.2em'}}>{e.str}</p>
        </div>);
      })}
      </div>
    </>);
  } /* End of 'render' function */

  /* shift log message stack function */
  private shiftLogs = (): void => {
    this.state.logStack.shift();
    this.setState({ logStack: this.state.logStack });
  } /* End of 'shiftLogs' function */

  /* Log function */
  log( msg: LogMsg ): void {
    console.log(msg.str);
    this.state.logStack.push(msg);
    this.setState({ logStack: this.state.logStack });
    setTimeout(() => { this.shiftLogs(); }, this.props.logLifeTime);
    console.log(this.state.logStack);
  } /* End of 'log' function */

} /* End of 'OverlaOverlayComponenty' class */

/* Overlay main class */
export class Overlay {
  ref: React.RefObject<OverlayComponent>;
  
  /* Constructor function */
  constructor( targetElementId: string, props: OverlayProps ) {
    this.ref = React.createRef<OverlayComponent>();
    
    const e = React.createElement(OverlayComponent, { ref: this.ref, ...props });
    renderComponent(targetElementId, e);
  } /* End of 'constructor' function */

  /* Log function */
  log( str: string, type: LogType = LogType.eMessage ): void {
    if (this.ref.current)
      this.ref.current.log({ str: str, type: type });
    else
      console.log('LOG *' + String(type) + '* : ' + str + '\n');
  } /* End of 'log' function */

} /* End of 'Overlay' class */

/* END OF 'overlay.tsx' FILE */