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
import { Contains, ValuePossibleTypes, ValueProps } from "./value";
import { ValueSet, ValueSetPropsDefaults, ValueSetPropsValues } from "./value_set";

/* Log type enum */
export enum LogType {
  eMessage = 'eMessage',  // Just message
  eDebug = 'eDebug',      // Debug information
  eWarning = 'eWarning',  // Warning
  eError = 'eError',      // Not fatal error
} /* End of 'LogType' enum */

/* Log style for different message types value */
const logStyleTable: Contains<React.CSSProperties> = {
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
export interface FormProps<K> {
  name: string;
  values: ValueSetPropsValues<K>;
  defaults?: ValueSetPropsDefaults<K>;
  onCloseCallBack: ( newValues: K ) => void;
} /* End of 'FormProps' function */

/* Form component props interface */
interface FormComponentProps<ValuesObject> {
  formProps: FormProps<any>;
  onCloseCallBack: ( isApplied: boolean, outValues?: Contains<ValuePossibleTypes> ) => void;
} /* End of 'FormComponentProps' function */

function FormComponent<ValuesObject>( props: React.PropsWithRef<FormComponentProps<ValuesObject>> ) {
  const valueSetRef: React.RefObject<ValueSet> = React.createRef();

  // Render form
  return (<div style={{
    backgroundColor: 'white',
    border: '0.2em solid gray',
    padding: '0.3em'
  }}>
    <h2>{props.formProps.name}</h2>
    <ValueSet ref={valueSetRef} values={props.formProps.values} defaults={props.formProps.defaults}/>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'end',
    }}>
      <input type="button" value="Save" onClick={()=>{ props.onCloseCallBack(true, valueSetRef.current.getValues()); }}/>
      <input type="button" value="Cancel" onClick={()=>{ props.onCloseCallBack(false); }}/>
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
  formRef: React.RefObject<any>;

  /* Constructor function */
  constructor( props: React.PropsWithRef<OverlayProps> ) {
    if (!props.logLifeTime)
      props.logLifeTime = 8000; // Default value(8 seconds)
    super(props);
    this.state = {
      formProps: undefined,
      logStack: [],
    };
    this.formRef = React.createRef();
  } /* End of 'constructor' funciton */

  /* React render function */
  render() {
    return (<> 
      {this.state.formProps && <div style={{ // Render form
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
        <FormComponent formProps={this.state.formProps} onCloseCallBack={( isApplied: boolean, outValues?: Contains<ValuePossibleTypes> )=>{
          if (!isApplied)
          {
            this.setState({ formProps: undefined });
            return;
          }

          this.state.formProps.onCloseCallBack(outValues);
          this.setState({ formProps: undefined });
        }}/>
      </div>}
      <div style={{ // Render logs
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
  showForm<K>( props: FormProps<K> ): void {
    this.setState({ formProps: props });
  } /* End of 'showForm' function */

} /* End of 'OverlaOverlayComponenty' class */

/* END OF 'overlay.tsx' FILE */
