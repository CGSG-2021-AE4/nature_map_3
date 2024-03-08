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
  onChange?: ( newValue: boolean )=>void;
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

/* Value type */
export type ValueType =
  'STRING' |
  'BOOL' |
  'NUMBER' |
  'TOGGLE'
; // End of 'ValueType' constraint

// Different values arguments
// For button
interface ValueButtonArgs {
  type?: ButtonNameType;
} // End of 'ValueButtonArgs' interface
// For toggle menu
interface ValueToggleArgs {
  options: Array<string>;
} // End of 'ValueButtonArgs' interface

/* Value interface */
export interface ValueProps {
  name?: string;
  type: ValueType;
  defValue?: any;
  arguments?: ValueButtonArgs | ValueToggleArgs;
  onChange?: ( newValue: any )=>void;
  ref?: React.RefObject<any>; // WTF TS???? why does not work
} /* End of 'ValueProps' function */

export class Value extends React.Component<ValueProps, {}> {
  valueElementRef: React.RefObject<any>;

  // Get form value's input element JSX
  getInputElement<DefaultValueT>( defValue?: any): JSX.Element {
    // Default value switch
    let defValueOut;
    switch (this.props.type)
    {
      case 'STRING':
        defValueOut = (defValue && typeof defValue == "string") ? defValue : "";
        break;
      case 'BOOL':
        defValueOut = (defValue && typeof defValue == "boolean") ? defValue : false;
        break;
      case 'NUMBER':
        defValueOut = (defValue && typeof defValue == "number") ? defValue : 0;
        break;
      case 'TOGGLE':
        defValueOut = (defValue && typeof defValue == "string") ? defValue : 0;
        break;
    }

    switch (this.props.type)
    {
      case 'STRING':
        return (<input type="text" ref={this.valueElementRef} defaultValue={defValueOut} onChange={()=>{
          if (this.props.onChange)
            this.props.onChange(this.getValue());
        }}/>);
      case 'BOOL':
        const args: ValueButtonArgs = this.props.arguments as ValueButtonArgs;

        return (<PushButton ref={this.valueElementRef} value={defValueOut} valueType={(args != undefined && args.type != undefined) ? args.type : ButtonNameType.eYesNo } onChange={()=>{
          if (this.props.onChange)
            this.props.onChange(this.getValue());
        }}/>); // WTF
      case 'NUMBER':
        return (<input type="number" ref={this.valueElementRef} defaultValue={defValueOut} onChange={()=>{
          if (this.props.onChange)
            this.props.onChange(this.getValue());
        }}/>);
      case 'TOGGLE':
        if (!this.props.arguments)
          return (<></>);
        return (
          <select ref={this.valueElementRef} defaultValue={defValueOut} onChange={()=>{
            if (this.props.onChange)
              this.props.onChange(this.getValue());
          }}>
            {this.props.arguments && (this.props.arguments as ValueToggleArgs).options.map((o)=>{
              return (<option value={o}>{o}</option>);
            })}
          </select>
        );
    }
  } /* End of 'getInputElement' function */

  // Constructor function
  constructor( props: ValueProps ) {
    super(props);

    this.valueElementRef = React.createRef();
  }
  
  // Get value function
  getValue<ValueT>(): ValueT {
    if (this.valueElementRef.current)
    {
      switch (this.props.type)
      {
      case 'STRING':
      case 'TOGGLE':
        return String(this.valueElementRef.current.value) as ValueT;
      case 'BOOL':
        return Boolean(this.valueElementRef.current.getValue()) as ValueT;
      case 'NUMBER':
        return Number(this.valueElementRef.current.value) as ValueT;
      }
    }
    return undefined;
  } /* End of 'getInputElementValue' function */

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>{this.props.name}</p>
        {this.getInputElement()}
      </div>
    );
  }
}; // End of 'Value' class

/* Option state interface */
interface Option {
  name: string;
  type: ValueType;
  defValue?: any;
  ref?: React.RefObject<any>;
} /* End of 'Option' interface */

/* Option set React state interface */
interface OptionSetState {
  options: Array<Option>;
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

  // Values getter function
  getValues<ValueT>(): { [name: string]: ValueT } {
    var outValues: { [name: string]: ValueT } = {};

    this.state.options.map(( option: Option ) => {
      if (option.ref.current)
      outValues[option.name] = option.ref.current.getValue();
    });
    return outValues;
  } /* End of 'getValues' function */

  // Add option function (mostly for testing )
  AddOption( name: string, valueType: ValueType, defValue?: any ) {
    this.state.options.push({
      name: name,
      type: valueType,
      defValue: defValue,
      ref: React.createRef(),
    });
    this.setState({ options: this.state.options });
  } /* End of 'AddOption' function */

  // Add several options function
  AddOptions( newOptions: Array<{ name: string, valueType: ValueType, defValue?: any }> ) {
    newOptions.map(( o )=>{ this.AddOption(o.name, o.valueType, o.defValue); });
  } // End of 'AddOptions' function

  // Clear all options function
  Clear() {
    this.setState({ options: [] });
  } // End of 'Clear' function

  // Set options (clear and add) function
  SetOptions( newOptions: Array<{ name: string, valueType: ValueType, defValue?: any }> ) {
    this.Clear();
    this.AddOptions(newOptions);
  } // End of 'SetOptions' function

  /* React render function */
  render() {
    return (
      <div>
        {
          this.state.options.map(( option: Option )=>{
            return (<Value type={option.type} ref={option.ref} defValue={option.defValue}/>);
          })
        }
      </div>
    );
  } /* End of 'render' function */
}; /* End of 'OptionSet' class */

/* END OF 'support.tsx' FILE */