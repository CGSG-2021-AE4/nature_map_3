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

/* Possible value type */
type PossibleFormValueType = number | string | boolean;

/* From value type */
export enum FormValueType {
  eText = 'eText',     // Text value
  eBool = 'eBool',     // Boolean value
  eNumber = 'eNumber', // Number value
} /* End of 'FormValueType' enum */

/* From value interface */
export interface FormValueProps {
  name: string;
  type: FormValueType;
  ref?: React.RefObject<HTMLInputElement>; // SHIT but for now ok
} /* End of 'FormValueProps' function */

/* Form props interface */
export interface FormProps<ValuesObject> {
  name: string;
  //return_type;
  valuesProps: { [name: string]: FormValueProps };
  inValues: { [name: string]: PossibleFormValueType };
  onCloseCallBack: ( newValues: ValuesObject ) => void;
} /* End of 'FormProps' function */

/* Form component props interface */
interface FormComponentProps<ValuesObject> {
  formProps: FormProps<ValuesObject>;
  onCloseCallBack: ( isApplied: boolean ) => void;
} /* End of 'FormComponentProps' function */

/* Get form value's input element JSX */
function getInputElement( valueProps: FormValueProps, defaultValue: PossibleFormValueType ): JSX.Element {
  console.log('draw');
  switch (valueProps.type)
  {
    case FormValueType.eText:
      if (defaultValue && typeof defaultValue != "string")
        return (<></>);
      return (<input type="text" ref={valueProps.ref} defaultValue={defaultValue as string}/>);
    case FormValueType.eBool:
      if (defaultValue && typeof defaultValue != "boolean")
        return (<></>);
      return (<input type="button" ref={valueProps.ref} defaultValue={defaultValue as number}/>); // WTF
    case FormValueType.eNumber:
      if (defaultValue && typeof defaultValue != "number")
        return (<></>);
      return (<input type="number" ref={valueProps.ref} defaultValue={defaultValue as number}/>);
  }
  return (<></>);
} /* End of 'getInputElement' function */

/* Get HTML element value function */
function getInputElementValue( valueProps: FormValueProps ): PossibleFormValueType {
  if (valueProps && valueProps.ref.current)
  {
    console.log("sucess set value " + valueProps.name);
    switch (valueProps.type)
    {
    case FormValueType.eText:
      return valueProps.ref.current.value as string;
    case FormValueType.eBool:
      return valueProps.ref.current.value as string; // WTF
    case FormValueType.eNumber:
      return valueProps.ref.current.value as string; // WTF
    }
  }

  return undefined;
} /* End of 'getInputElementValue' function */

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
            justifyContent: 'space',
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
class OverlayComponent extends React.Component<React.PropsWithRef<OverlayProps>, OverlayState> {

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

            if (newValue)
              outValues[optionKey] = newValue;
          });

          this.state.formProps.onCloseCallBack(outValues);
          this.setState({ formProps: undefined });
        }}/>
      </div>}
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
  private shiftLogs(): void {
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

  /* Show form function */
  showForm<ValuesType>( props: FormProps<ValuesType> ): void {
    this.setState({ formProps: props });
  } /* End of 'showForm' function */

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

  /* Log string function */
  log = ( str: string, type: LogType = LogType.eMessage ): void => {
    if (this.ref.current)
      this.ref.current.log({ str: str, type: type });
    else
      console.log('LOG *' + String(type) + '* : ' + str + '\n');
  } /* End of 'log' function */

  /* Show form function */
  showForm<ValuesType>( props: FormProps<ValuesType> ): void { // TODO make it arrow function
    if (this.ref.current)
      this.ref.current.showForm(props);
    else
      console.log("ERROR: current is null");
  } /* End of 'showForm' function */

} /* End of 'Overlay' class */

/* END OF 'overlay.tsx' FILE */