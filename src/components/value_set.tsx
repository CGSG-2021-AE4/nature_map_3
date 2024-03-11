/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : value_set.ts
 * PURPOSE     : Nature Map 3 project.
 *               Value set component file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 10.03.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */
import React from "react";
import { Value, ValueType, ValuePossibleTypes, ValueProps, ValuePropsLight, Contains } from "./value";

// Some types
export type ValueSetPropsValues<K> = Record<keyof K, ValueType | ValuePropsLight>;
export type ValueSetPropsDefaults<K> = Record<keyof K, ValuePossibleTypes>;

// Value set props interface
export interface ValueSetProps<K> {
  values?: ValueSetPropsValues<K>;
  defaults?: ValueSetPropsDefaults<K>;
} // End of 'ValueSetProps' interface

// Value set state interface
export interface ValueSetState {
  curValues: Contains<{ ref: React.RefObject<Value>; jsx: JSX.Element }>;
} // End of 'ValueSetState' interface

export class ValueSet extends React.Component<React.PropsWithRef<ValueSetProps<any>>, ValueSetState> {
  
  // Set values function (actually it adds values but it does not matter)
  setValues( values: Contains<ValueType | ValuePropsLight>, defaults?: Contains<ValuePossibleTypes> ) {
    Object.keys(values).map(( valueName: string )=>{
      this.state.curValues[valueName] = { ref: React.createRef(), jsx: undefined };
      if (values[valueName] instanceof Object) // ValuePropsLight - advanced settings
        this.state.curValues[valueName].jsx = (
          <Value name={(values[valueName] as ValuePropsLight).name ? (values[valueName] as ValuePropsLight).name : valueName}
                 type={(values[valueName] as ValuePropsLight).type}
                 arguments={(values[valueName] as ValuePropsLight).arguments}
                 defValue={defaults[valueName] ? defaults[valueName] : (values[valueName] as ValuePropsLight).defValue}
                 ref={this.state.curValues[valueName].ref}
        />);
      else                                     // ValueType - without advanced settings
        this.state.curValues[valueName].jsx = (
          <Value name={valueName}
                 type={values[valueName] as ValueType}
                 defValue={defaults[valueName]}
                 ref={this.state.curValues[valueName].ref}
        />);
    });
  } // End of 'setValues' function

  // Get values function
  getValues(): Contains<ValuePossibleTypes> {
    var out: Contains<ValuePossibleTypes> = {};

    Object.keys(this.state.curValues).map(( valueName: string )=>{
      if (this.state.curValues[valueName].ref.current)
        out[valueName] = this.state.curValues[valueName].ref.current.getValue();
    });
    return out;
  } // End of 'getValues' function

  // Constructor function
  constructor( props: React.PropsWithRef<ValueSetProps<any>> ) {
    super(props);

    this.state = {
      curValues: {},
    };
    this.setValues(this.props.values, this.props.defaults);
  } // End of 'constructor' function

  // Component render function
  render(): React.ReactNode {
    return (<>
      <div>
        {Object.keys(this.state.curValues).map(( valueName: string )=>{
          return this.state.curValues[valueName].jsx;
        })}
      </div>
    </>);
  } // End of 'render' function

} // End of 'ValueSet' class

/* END OF 'value_set.ts' FILE */