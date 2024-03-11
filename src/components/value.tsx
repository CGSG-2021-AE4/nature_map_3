/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : value.ts
 * PURPOSE     : Nature Map 3 project.
 *               Value component file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 10.03.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import React from "react";
import { ButtonNameType, PushButton } from "./support";

// Value type
export type ValueType =
  'STRING' |
  'BOOL' |
  'NUMBER' |
  'TOGGLE'
; // End of 'ValueType' constraint

// Possible value types
export type ValuePossibleTypes = string | boolean | number;
export type Contains<T> = { [name: string]: T };

// Arguments for button
interface ValueButtonArgs {
  type?: ButtonNameType;
} // End of 'ValueButtonArgs' interface

// Arguments for toggle menu
interface ValueToggleArgs {
  options: Array<string>;
} // End of 'ValueToggleArgs' interface

// Light value props
export interface ValuePropsLight {
  name?: string;
  type: ValueType;
  defValue?: ValuePossibleTypes;
  arguments?: ValueButtonArgs | ValueToggleArgs;
} // End of 'ValuePropsLight' interface

// Value props interface
export interface ValueProps extends ValuePropsLight {
  onChange?: ( newValue: ValuePossibleTypes )=>void;
  ref?: React.RefObject<Value>; // WTF TS???? why does not work
} // End of 'ValueProps' interface

// Value state interface
export interface ValueState {
  defValue: ValuePossibleTypes;
} // End of 'ValueState' interface

export class Value extends React.Component<ValueProps, ValueState> {
  inputElementRef: React.RefObject<any>;

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
        return (<input type="text" ref={this.inputElementRef} defaultValue={defValueOut} onChange={(e)=>{
          if (this.props.onChange)
            this.props.onChange(this.getValue());
        }}/>);
      case 'BOOL':
        const args: ValueButtonArgs = this.props.arguments as ValueButtonArgs;

        return (<PushButton ref={this.inputElementRef} value={defValueOut} valueType={(args != undefined && args.type != undefined) ? args.type : ButtonNameType.eYesNo } onChange={(e)=>{
          if (this.props.onChange)
            this.props.onChange(e.valueOf());
        }}/>); // WTF
      case 'NUMBER':
        return (<input type="number" ref={this.inputElementRef} defaultValue={defValueOut} onChange={()=>{
          if (this.props.onChange)
            this.props.onChange(this.getValue());
        }}/>);
      case 'TOGGLE':
        if (!this.props.arguments)
          return (<></>);
        return (
          <select ref={this.inputElementRef} defaultValue={defValueOut} onChange={()=>{
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

    this.inputElementRef = React.createRef();
    this.state = {
      defValue: this.props.defValue,
    }
  }
  
  // Set value function
  setValue( newDefValue: ValuePossibleTypes ) {
    this.setState({ defValue: newDefValue });
  } // End of 'setValue' function

  // Get value function
  getValue<ValueT>(): ValueT {
    if (this.inputElementRef.current)
    {
      switch (this.props.type)
      {
      case 'STRING':
      case 'TOGGLE':
        return String(this.inputElementRef.current.value) as ValueT;
      case 'BOOL':
        return Boolean(this.inputElementRef.current.state.value) as ValueT;
      case 'NUMBER':
        return Number(this.inputElementRef.current.value) as ValueT;
      }
    }
    return undefined;
  } /* End of 'getInputElementValue' function */

  // Component render function
  render(): React.ReactNode {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>{this.props.name}</p>
        {this.getInputElement(this.state.defValue)}
      </div>
    );
  } // End of 'render' function

} // End of 'Value' class

/* END OF 'value.ts' FILE */
