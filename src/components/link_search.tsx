/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

import React from "react";

/* FILE NAME   : link_search.tsx
 * PURPOSE     : Nature Map 3 project.
 *               Search by link source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 22.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import { ClickButton, OptionSet, ValueType, renderComponent } from "./support";
import { MapInterface } from "../map";
import { LogType, OverlayInterface } from "../overlay";
import { queryToURL } from "../query";

/* Link search React props interface */
export interface LinkSearchProps {
  map: MapInterface;
  overlay: OverlayInterface;
} /* End of 'LinkSearchProps' interface */

/* Preferences interface */
interface SearchPrefs {
  url: string;
} /* End of 'SearchPrefs' interface */

/* Link search React state interface */
interface LinkSearchState {
  optionSetRef: React.RefObject<OptionSet>;
}/* End of 'OptionSetState' interface */

/* Link search main component class */
export class LinkSearch extends React.Component<LinkSearchProps, LinkSearchState> {
  searchPrefs: SearchPrefs;

  /* Constructor function */
  constructor( props: LinkSearchProps ) {
    super(props);

    this.state = {
      optionSetRef: React.createRef(),
    };
    this.searchPrefs = { url: "https://api.gbif.org/v1/species/search" };
  } /* End of 'constructor' function */

  /* React render function */
  render() {
    return (
      <div className="mainBg subB padded">
        <ClickButton name="Preferences" onClick={()=>{
          this.props.overlay.showForm<SearchPrefs>({
            name: "Search props",
            inValues: this.searchPrefs,
            onCloseCallBack: ( newPrefs: SearchPrefs )=>{
              this.props.overlay.log(`Set URL base to "${newPrefs.url}"`);
              this.searchPrefs = newPrefs;
            },
            valuesProps: {
              url: { name: "Base domain", type: ValueType.eString }
            },
          });
        }}/>
        <OptionSet ref={this.state.optionSetRef} optionType={ValueType.eString} onLoad={( os: OptionSet )=>{
          // SOME SHIT

          os.AddOption("q", "");
          os.AddOption("rank", "KINGDOM");
          os.AddOption("dataset_key", "d7dddbf4-2cf0-4f39-9b2a-bb099caae36c");
          os.AddOption("offset", "20");
          os.AddOption("limit", "80");
        }}/>
        <ClickButton name="Show on map"/>
        <ClickButton name="Show link" onClick={()=>{
          if (!this.state.optionSetRef.current)
            return;
          var values: { [name: string]: string } = this.state.optionSetRef.current.getValues<string>();

          console.log(values);
          this.props.overlay.log(`URL: ${queryToURL(this.searchPrefs.url, values)}`, LogType.eMessage);

        }}/>
      </div>
    );
  } /* End of 'render' function */
}; /* End of 'OptionSet' class */

/* Create link component function !!! TEST */
export function createLinkSearch( targetElementID: string, map: MapInterface, overlay: OverlayInterface ): void {
  renderComponent(targetElementID, <LinkSearch map={map} overlay={overlay}/>);
} /* End of 'createLinkSearch' function */

/* END OF 'link_search.tsx' FILE */

/*
https://api.gbif.org/v1/species/search
&q=
&rank=KINGDOM
&dataset_key=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c
&offset=20
&limit=80
*/