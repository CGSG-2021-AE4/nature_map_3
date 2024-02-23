/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : support.tsx
 * PURPOSE     : Nature Map 3 project.
 *               Support functionality source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 22.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import { extendCoordinates } from "ol/extent";
import React from "react";
import { createRoot } from 'react-dom/client';

/* Push button name type enum */
export enum ButtonNameType {
  eValueName = 'ValueName',
  eEnabledDisabled = 'EnabledDisabled',
  eActivePassive = 'ActivePassive',
  eOnOff = 'OnOff',
  eYesNo = 'YesNo',
} /* End of 'ButtonNameType' enum */

/* Push button React props interface */
export interface PushButtonProps {
  name?: string;
  value?: boolean;
  valueType?: ButtonNameType;
  onChange?: ( newValue: boolean)=>void;
} /* End of 'PushButtonProps' interface */

/* Push button React state interface */
interface PushButtonState {
  value: boolean;
}/* End of 'PushButtonState' interface */

/* Push button main component class */
export class PushButton extends React.Component<React.PropsWithRef<PushButtonProps>, PushButtonState> {

  /* Constructor function */
  constructor( props: React.PropsWithRef<PushButtonProps> ) {
    super(props);

    this.state = {
      value: props.value != undefined ? props.value : false,
    };
  } /* End of 'constructor' function */

  /* Button value getter function */
  getValue(): boolean {
    return this.state.value;
  } /* End of 'getValue' function */

  /* Button value setter function */
  setValue( newValue: boolean ): void {
    this.setState({ value: newValue });
  } /* End of 'setValue' function */

  /* Get button name based on name type */
  getButtonName(): string {
    if (this.props.valueType == undefined)
      return this.props.name;

    switch (this.props.valueType) {
      case ButtonNameType.eValueName:
        return this.props.name;
      case ButtonNameType.eActivePassive:
        if (this.state.value)
          return 'Active';
        else
          return 'Passive';
      case ButtonNameType.eEnabledDisabled:
        if (this.state.value)
          return 'Enable';
        else
          return 'Disable';
      case ButtonNameType.eOnOff:
        if (this.state.value)
          return 'On';
        else
          return 'Off';
      case ButtonNameType.eYesNo:
        if (this.state.value)
          return 'Yes';
        else
          return 'No';
    }
  } /* End of 'getButtonName' function */

  /* React render function */
  render() {
    return (
      <input type="button" className={`${this.state.value ? 'active' : ''}`} value={this.getButtonName()} onClick={()=>{
        if (this.props.onChange)
          this.props.onChange(!this.state.value);
        this.setState({ value: !this.state.value });
      }}/>
    );
  } /* End of 'render' function */
}; /* End of 'PushButton' class */

/* Click button component React props interface */
export interface ClickButtonProps {
  name: string;
  onClick?: ()=>void;
} /* End of 'ClickButtonProps' interface */

/* Click button component function */
export function ClickButton( props: ClickButtonProps ) {
  return (
    <input type='button' value={props.name} onClick={()=>{
      if (props.onClick)
        props.onClick();
    }}/>
  );
} /* End of 'ClickButton' function */

/* Component render function */
export function renderComponent( targetElementId: string, dom: any ) {
  const root = createRoot(document.getElementById(targetElementId));
  console.log(dom);
  
  root.render(dom);
} /* End of 'renderComponent' function */

/* Option set React props interface */
export interface OptionSetProps {
  optionType: ValueType;
  onLoad?: ( os: OptionSet )=> void;
} /* End of 'OptionSetProps' interface */

/**** Input elements functionality ****/

/* Possible value type */
export type PossibleFormValueType = number | string | boolean;

/* Value type */
export enum ValueType {
  eString = 'eString', // String value
  eBool = 'eBool',     // Boolean value
  eNumber = 'eNumber', // Number value
} /* End of 'ValueType' enum */

/* Value interface */
export interface ValueProps {
  name?: string;
  type: ValueType;
  ref?: React.RefObject<any>; // SHIT but for now ok
  arguments?: { [name: string]: any } // Other arguments
                                      // BUTTON:
                                      //   type?: ButtonNameType
} /* End of 'ValueProps' function */

/* Get form value's input element JSX */
export function getInputElement( valueProps: ValueProps, defaultValue?: PossibleFormValueType ): JSX.Element {
  // Default value switch
  let defValue;
  switch (valueProps.type)
  {
    case ValueType.eString:
      defValue = (defaultValue && typeof defaultValue != "string") ? "" : defaultValue;
      break;
    case ValueType.eBool:
      defValue = (defaultValue && typeof defaultValue != "boolean") ? false : defaultValue;
      break;
    case ValueType.eNumber:
      defValue =  (defaultValue && typeof defaultValue != "number") ? 0 : defaultValue;
      break;
  }
  
  switch (valueProps.type)
  {
    case ValueType.eString:
      return (<input type="text" ref={valueProps.ref} defaultValue={defValue}/>);
    case ValueType.eBool:
      return (<PushButton ref={valueProps.ref} value={defValue} valueType={(valueProps.arguments != undefined && valueProps.arguments.type != undefined) ? valueProps.arguments.type : ButtonNameType.eYesNo }/>); // WTF
    case ValueType.eNumber:
      return (<input type="number" ref={valueProps.ref} defaultValue={defValue}/>);
  }
} /* End of 'getInputElement' function */

/* Get HTML element value function */
export function getInputElementValue<ValueT>( valueProps: ValueProps ): ValueT {
  if (valueProps && valueProps.ref.current)
  {
    switch (valueProps.type)
    {
    case ValueType.eString:
      return String(valueProps.ref.current.value) as ValueT;
    case ValueType.eBool:
      return Boolean(valueProps.ref.current.getValue()) as ValueT;
    case ValueType.eNumber:
      return Number(valueProps.ref.current.value) as ValueT;
    }
  }
  return undefined;
} /* End of 'getInputElementValue' function */

/* Option state interface */
interface OptionState {
  nameElement: { props: ValueProps; defValue?: any };
  valueElement: { props: ValueProps; defValue?: any };
} /* End of 'OptionState' interface */

/* Option set React state interface */
interface OptionSetState {
  options: Array<OptionState>;
}/* End of 'OptionSetState' interface */

/* Link search main component class */
export class OptionSet extends React.Component<React.PropsWithRef<OptionSetProps>, OptionSetState> {

  /* Constructor function */
  constructor( props: React.PropsWithRef<OptionSetProps> ) {
    super(props);

    this.state = {
      options: [],
    };

    if (this.props.onLoad)
      this.props.onLoad(this);
  } /* End of 'constructor' function */

  /* Values getter function */
  getValues<ValueT>(): { [name: string]: ValueT } {
    var outValues: { [name: string]: ValueT } = {};

    this.state.options.map(( option: OptionState ) => {
      outValues[getInputElementValue<string>(option.nameElement.props)] = getInputElementValue<ValueT>(option.valueElement.props);
    });
    return outValues;
  } /* End of 'getValues' function */

  /* Add option function (mostly for testing ) */
  AddOption( name: string, value: any ) {
    this.state.options.push({
      nameElement: { props: { type: ValueType.eString, ref: React.createRef() }, defValue: name },
      valueElement: { props: { type: this.props.optionType, ref: React.createRef() }, defValue: value }
    });
  } /* End of 'AddOption' function */

  /* React render function */
  render() {
    return (
      <div>
        {
          this.state.options.map(( option: OptionState )=>{
            return (
              <div>
                 {getInputElement(option.nameElement.props, option.nameElement.defValue)}
                 {getInputElement(option.valueElement.props, option.valueElement.defValue)}
              </div>);
          })
        }
        <ClickButton name="Add option" onClick={()=>{
          this.state.options.push({
            nameElement: { props: { type: ValueType.eString, ref: React.createRef() } },
            valueElement: { props: { type: this.props.optionType, ref: React.createRef() } }
          });
          this.setState({ options: this.state.options });
        }}/>
      </div>
    );
  } /* End of 'render' function */
}; /* End of 'OptionSet' class */

/* END OF 'support.tsx' FILE */