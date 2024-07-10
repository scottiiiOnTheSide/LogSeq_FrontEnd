/* V I T A L S */
import * as React from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import 'ol/ol.css';
import './map.css';

let accessAPI = APIaccess();

export default function MapComponent ({current }) {

	/* Renders Open Layers Map on Component Mount */
	React.useEffect(()=> {
		const osmLayer = new TileLayer({
			preload: Infinity,
			source: new OSM(),
		});

		const map = new Map({
			target: "ol_map",
			layers: [osmLayer],
			view: new View({
				center: [0, 0],
				zoom: 0
			})
		})

		return ()=> map.setTarget(null);
	}, [])

	return (
		<div id="MAP" className={`${current.transition == true ? 'leave' : ''}`}>
			
			<h2>This is the Map</h2>	

			<div id="ol_map">
				
			</div>

		</div>
	)
}