/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

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

import React from "react";

import { ClickButton, OptionSet, Value, ValueType, renderComponent } from "./support";
import { MapInterface } from "../map";
import { LogType, OverlayInterface } from "../overlay";
import { queryToURL } from "../query";
import { GbifSearch } from "../gbif";
import { GetReqProps, GetReqResponse, ReqApiKey, ReqProps, ReqTypeKey, RequestBase, requestBaseDefault } from "../gbif_params";

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
  api: ReqApiKey;
  type: ReqTypeKey<ReqApiKey>;
  reqParamRefs: Array<React.RefObject<Value>>;
  reqParamJSX: Array<JSX.Element>;
  optionSetRef: React.RefObject<OptionSet>;
}/* End of 'OptionSetState' interface */

/* Link search main component class */
export class LinkSearch extends React.Component<LinkSearchProps, LinkSearchState> {
  searchPrefs: SearchPrefs;
  gbifSearch: GbifSearch;
  APIValueRef: React.RefObject<Value>;

  /* Constructor function */
  constructor( props: LinkSearchProps ) {
    super(props);

    this.state = {
      optionSetRef: React.createRef(),
      api: Object.keys(requestBaseDefault)[0] as ReqApiKey,
      type: Object.keys(requestBaseDefault[Object.keys(requestBaseDefault)[0] as ReqApiKey])[0] as ReqTypeKey<ReqApiKey>,
      reqParamRefs: [],
      reqParamJSX: [],
    };
    this.searchPrefs = { url: "https://api.gbif.org/v1/species/search" };
    this.gbifSearch = new GbifSearch({ overlay: props.overlay });
  } /* End of 'constructor' function */

  // Get request value function
  updateReqParams(): void {
    var reqParamRefs: Array<React.RefObject<Value>> = [];
    var reqParamJSX: Array<JSX.Element> = [];
  
    console.log(requestBaseDefault[this.state.api][this.state.type]);
    Object.keys(requestBaseDefault[this.state.api][this.state.type].required).map(( p )=>{
      const ref = React.createRef<Value>();

      reqParamJSX.push(<Value name={p + " *"} type="STRING"/>);
      reqParamRefs.push(ref);
    });
    Object.keys(requestBaseDefault[this.state.api][this.state.type].query).map(( p )=>{
      const ref = React.createRef<Value>();

      reqParamJSX.push(<Value name={p} type="STRING"/>);
      reqParamRefs.push(ref);
    });
    this.setState({ reqParamJSX: reqParamJSX, reqParamRefs: reqParamRefs });
  } // End of 'updateReqParams' function

  // On mount React function
  componentDidMount(): void {
    this.updateReqParams();
  }
  
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
              url: { name: "Base domain", type: 'STRING' }
            },
          });
        }}/>
        <Value name="API:" type="TOGGLE" ref={this.APIValueRef} defValue={this.state.api} arguments={{ options: Object.keys(requestBaseDefault) }} onChange={( newValue: string )=>{
          this.setState({ api: newValue as ReqApiKey });
        }}/>
        <Value name="Type:" type="TOGGLE" ref={this.APIValueRef} defValue={this.state.type} arguments={{ options: Object.keys(requestBaseDefault[this.state.api]) }} onChange={( newValue: string )=>{
          this.setState({ type: newValue as ReqTypeKey<ReqApiKey> }, ()=>{
            console.log(this.state.api);
            console.log(this.state.type);
            this.updateReqParams();
          });
        }}/>
        {this.state.reqParamJSX}
        <ClickButton name="Show on map"/>
        <ClickButton name="Test search" onClick={ async ()=> {
          //const data = await this.gbifSearch.search( "species", "name", { required: { usageKey: 5231190 }, query: { } } );
          Object.keys(requestBaseDefault).map(( key: ReqApiKey )=>{ console.log(key); });

          //console.log(data);
          //this.gbifSearch.search( "species", "name", {required: {}});
        }}/>
        <ClickButton name="Show link" onClick={ async ()=>{
          if (!this.state.optionSetRef.current)
            return;
          var values: { [name: string]: string } = this.state.optionSetRef.current.getValues<string>();

          console.log(values);
          let url = queryToURL(this.searchPrefs.url, values);
          this.props.overlay.log(`URL: ${url}`, LogType.eMessage);

          let result = await fetch(url);
          console.log(await result.json());
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