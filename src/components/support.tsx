/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : support.tsx
 * PURPOSE     : Nature Map 3 project.
 *               Support functionality source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 11.02.2024
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
} /* End of 'ButtonNameType' enum */

/* Push button React props interface */
export interface PushButtonProps {
  name: string;
  value?: boolean;
  valueType?: ButtonNameType;
  onChange?: ( newValue: boolean)=>void;
} /* End of 'PushButtonProps' interface */

/* Push button React state interface */
interface PushButtonState {
  value: boolean;
}/* End of 'PushButtonState' interface */

/* Push button main component class */
export class PushButton extends React.Component<PushButtonProps, PushButtonState> {

  /* Constructor function */
  constructor( props: PushButtonProps ) {
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

/* END OF 'support.tsx' FILE */