/***************************************************************
 * Copyright (C) 2023-2024
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : map.tsx
 * PURPOSE     : Nature Map 3 project.
 *               Map source file.
 * PROGRAMMER  : CGSG'2024.
 *               Andrey Egorov.
 * LAST UPDATE : 22.02.2024
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

/* OpenLayer includes */
import {TileImage as OL_TileImage, OSM as OL_OSM, Vector as OL_VectorSource} from 'ol/source.js';
import {Tile as OL_TileLayer, Vector as OL_VectorLayer} from 'ol/layer.js';
import OL_Point from 'ol/geom/Point.js';
import OL_Feature from 'ol/Feature.js';
import {createXYZ} from 'ol/tilegrid.js';
import {Icon as OL_Icon, Style as OL_Style} from 'ol/style.js';
import OL_Map from 'ol/Map.js';
import OL_View from 'ol/View.js';

/* My includes */
import Vec2 from './math/vec2';
import { QueryParams, queryToStr } from './query';

/* Layer base main class */
class LayerBase {
  layer;
  curMap: MyMap;

  /* Constructor function */
  constructor( layer: any ) {
    this.layer = layer;
  } /* End of 'constructor' function */

  /* Remove from map function */
  release() {
    if (this.curMap)
      this.curMap.removeLayer(this);
  } /* End of 'release' function */

} /* End of 'Layer' class */

/* Different Layers types */

/* Tile layer class props interface */
export interface TileLayerProps {
  sourceURL: string;
  projection: string;
  additionalQuery?: QueryParams;
} /* End of 'TileLayerProps' function */

/* Tile layer class */
export class TileLayer extends LayerBase {
  
  /* Constructor function */
  constructor( props: TileLayerProps ) {
    // Variables for create request layer function
    const pixel_ratio = Math.min(window.devicePixelRatio, 4) || 1;
    const tile_grid_16 = createXYZ({
      minZoom: 0,
      maxZoom: 15,
      tileSize: 512,
    });

    super(new OL_TileLayer({
      source: new OL_TileImage({
        projection: props.projection,
        tileGrid: tile_grid_16,
        tilePixelRatio: pixel_ratio,
        url: props.sourceURL + pixel_ratio + 'x.png?' + props.additionalQuery ? queryToStr(props.additionalQuery) : '',
        wrapX: true
      }),
    }));
  } /* End of 'constructor' function */

} /* End of 'TileLayer' class */

/* Vector layer class props interface */
export interface VectorLayerProps {
  points: Array<Vec2>;
  style: OL_Style;
} /* End of 'VectorLayerProps' function */

/* Vector layer class */
export class VectorLayer extends LayerBase {
  
  /* Constructor function */
  constructor( props: VectorLayerProps ) {
    // Variables for create request layer function
    const pixel_ratio = Math.min(window.devicePixelRatio, 4) || 1;
    const tile_grid_16 = createXYZ({
      minZoom: 0,
      maxZoom: 15,
      tileSize: 512,
    });

    super(new OL_VectorLayer({
      source: new OL_VectorSource({
        features: props.points.map(e=>{
          return new OL_Feature({
            type: 'icon',
            geometry: new OL_Point([e.x, e.y]),
          });
        }),
      }),
      style: props.style,
    }));
  } /* End of 'constructor' function */

} /* End of 'VectorLayer' class */

/* OSM layer class */
export class OSMLayer extends LayerBase {

  /* Constructor function */
  constructor() {
    super(new OL_TileLayer({
      source: new OL_OSM(),
    }));
  } /* End of 'constructor' function */
  
} /* End of 'OSMLayer' class */

/* Props interface */
export interface MapProps {
  targetElementId: string;
  center?: Vec2;
  zoom?: number;
  layers?: Array<LayerBase>;
}; /* End of 'MapProps' interface */

/* Main map class */
export class MyMap {
  map: OL_Map;

  /* Constructor function */
  constructor( props: MapProps ) {
    this.map = new OL_Map({
      target: props.targetElementId,
      view: new OL_View({
        center: (props.center ? [props.center.x, props.center.y] : [0, 0]),
        zoom: (props.zoom ? props.zoom : 2)
      }),
      layers: (props.layers ? props.layers.map(e=>{ return e.layer; }) : undefined)
    });
  } /* End of 'constructor' function */

  /* Set view pos function */
  setView( center: Vec2, zoom: number ): void {
    console.log(center);
    console.log(zoom);
    
    this.map.setView(new OL_View({
      center: [center.x, center.y],
      zoom: zoom,
    }));
  } /* End of 'setView' function */

  /* On query update function */
  onQueryUpdate( newQuery: QueryParams ): void {
    // TODO
  } /* End of 'onQueryUpdate' function */

  /* Add layer function */
  addLayer( newLayer: LayerBase ): void {
    if (newLayer.curMap)
      newLayer.release();
    console.log(newLayer);
    this.map.addLayer(newLayer.layer);
    newLayer.curMap = this;
  } /* End of 'addLayer' function */

  /* Remove layer function */
  removeLayer( newLayer: LayerBase ): void {
    this.map.removeLayer(newLayer.layer);
    newLayer.curMap = undefined;
  } /* End of 'removeLayer' function */

}; /* End of 'Map' class */

/* END OF 'map.ts' FILE */