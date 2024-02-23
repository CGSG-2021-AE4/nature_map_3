/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : overlay.tsx
 * PURPOSE     : Nature Map 3 project.
 *               Overlay component source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 22.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import React from "react";
import { ValueProps, getInputElement, PossibleFormValueType, getInputElementValue } from "./support";

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

/* Form props interface */
export interface FormProps<ValuesObject> {
  name: string;
  //return_type;
  valuesProps: { [name: string]: ValueProps };
  inValues: { [name: string]: any };
  onCloseCallBack: ( newValues: ValuesObject ) => void;
} /* End of 'FormProps' function */

/* Form component props interface */
interface FormComponentProps<ValuesObject> {
  formProps: FormProps<ValuesObject>;
  onCloseCallBack: ( isApplied: boolean ) => void;
} /* End of 'FormComponentProps' function */


function FormComponent<ValuesObject>( props: React.PropsWithRef<FormComponentProps<ValuesObject>> ) {
  const valuesRefs: Array<React.RefObject<HTMLInputElement>> = [];

  // Just create refs
  for (let i = Object.keys(props.formProps.valuesProps).length; i > 0; i--)
    valuesRefs.push(React.createRef());
  
  // Render form
  return (<div style={{
    backgroundColor: 'white',
    border: '0.2em solid gray',
    padding: '0.3em'
  }}>
    <h2>{props.formProps.name}</h2>
    <div>
      {
        Object.keys(props.formProps.valuesProps).map(( optionKey: string )=>{
          props.formProps.valuesProps[optionKey].ref = React.createRef<HTMLInputElement>();

          return (<div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            border: "0.1em solid black",
            margin: "0.1em",
            padding: "0.1em",
          }}>
            <p style={{ padding: 0, marginRight: '1em' }}>{props.formProps.valuesProps[optionKey].name}</p>
            {getInputElement(props.formProps.valuesProps[optionKey], props.formProps.inValues[optionKey])}
          </div>);
        })
        // TODO
      }
    </div>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'end',
    }}>
      <input type="button" value="Save" onClick={()=>{props.onCloseCallBack(true); }}/>
      <input type="button" value="Cancel" onClick={()=>{props.onCloseCallBack(false); }}/>
    </div>
  </div>);
} /* End of 'formComponent' function */

/* Overlay props interface */
export interface OverlayProps {
  logLifeTime?: number;
} /* End of 'OverlayProps' interface */

/* Overlay compoent react state interface */
interface OverlayState {
  formProps: FormProps<any>;
  logStack: Array<LogMsg>;
}/* End of 'OverlayState' interface */

/* Overlay component class */
export class OverlayComponent extends React.Component<React.PropsWithRef<OverlayProps>, OverlayState> {

  /* Constructor function */
  constructor( props: React.PropsWithRef<OverlayProps> ) {
    if (!props.logLifeTime)
      props.logLifeTime = 8000; // Default value(8 seconds)
    super(props);
    this.state = {
      formProps: undefined,
      logStack: [],
    };
  } /* End of 'constructor' funciton */

  /* React render function */
  render() {
    return (<>
      {this.state.formProps && <div style={{
        zIndex: 100,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#00000069',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <FormComponent formProps={this.state.formProps} onCloseCallBack={( isApplied: boolean )=>{
          if (!isApplied)
          {
            this.setState({ formProps: undefined });
            return;
          }
          
          const outValues = this.state.formProps.inValues;

          Object.keys(outValues).map(( optionKey: string )=>{
            const newValue = getInputElementValue(this.state.formProps.valuesProps[optionKey]);

            // if (newValue) ???
            outValues[optionKey] = newValue;
          });

          this.state.formProps.onCloseCallBack(outValues);
          this.setState({ formProps: undefined });
        }}/>
      </div>}
      <div style={{
        zIndex: 900,
        position: 'absolute',
        alignItems: 'flex-start',
        bottom: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
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
  private shiftLogs(): void {
    this.state.logStack.shift();
    this.setState({ logStack: this.state.logStack });
  } /* End of 'shiftLogs' function */

  /* Log function */
  log( msg: LogMsg ): void {
    this.state.logStack.push(msg);
    this.setState({ logStack: this.state.logStack });
    setTimeout(() => { this.shiftLogs(); }, this.props.logLifeTime);
  } /* End of 'log' function */

  /* Show form function */
  showForm<ValuesType>( props: FormProps<ValuesType> ): void {
    this.setState({ formProps: props });
  } /* End of 'showForm' function */

} /* End of 'OverlaOverlayComponenty' class */

/* END OF 'overlay.tsx' FILE */