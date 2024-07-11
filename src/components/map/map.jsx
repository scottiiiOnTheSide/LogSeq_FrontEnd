/* V I T A L S */
import * as React from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import 'ol/ol.css';
import './map.css';

let accessAPI = APIaccess();


export default function MapComponent ({current }) {

	const [mapState, setMapState] = React.useState(null);
	const [currentCenter, setCurrentCenter] = React.useState([-73.9249,  40.6943]);
	const [markers, setMarkers] = React.useState([
		{ id: 1, coords: [-73.9249, 40.6943], name: 'First Spot' },
		{ id: 2, coords: [-73.935242, 40.730610], name: 'Second Spot'}
	]);
	const mapRef = React.useRef();


	/* Renders Open Layers Map on Component Mount */
	React.useEffect(()=> {

		let centerCoordinates = fromLonLat(currentCenter);

		//Creates necessary layer for adding circle spots on map
		const vectorSource = new VectorSource();

		//creates markers from coordinates, adds them to VectorSource
		markers.forEach(marker => {

			let spot = new Feature({
				geometry: new Point(fromLonLat(marker.coords))
			})

			spot.setStyle(new Style({
				image: new CircleStyle({
					radius: 10,
					fill: new Fill({ color: 'grey' }),
					stroke: new Stroke({ color: 'white', width: 2 })
				})
			}));

			vectorSource.addFeature(spot);
		})

		//create vector layer with vectorSource
		const vectorLayer = new VectorLayer({
			source: vectorSource
		})

		const osmLayer = new TileLayer({
			preload: Infinity,
			source: new OSM(),
		});

		const initialMap = new Map({
			target: mapRef.current,
			layers: [osmLayer, vectorLayer],
			view: new View({
				center: centerCoordinates, //lat n lng
				zoom: 10,
				maxZoom: 15
			})
		})

		initialMap.on('click', (event)=> {
			initialMap.forEachFeatureAtPixel(event.pixel, (feature) => {
				const clickedCoords = feature.getGeometry().getCoordinates();

				initialMap.getView().animate({
					center: clickedCoords,
					zoom: 14,
					duration: 750
				});
			});
		});

		setMapState(initialMap)

		//Removes map on unmount
		return ()=> initialMap.setTarget(null);
	}, [currentCenter, markers]) 


	const handleClick = (coords) => {

		const view = mapState.getView();
		view.animate({
			center: fromLonLat(coords),
			zoom: 14,
			duration: 750
		})
	}


	return (
		<div id="MAP" className={`${current.transition == true ? 'leave' : ''}`}>
			
			<h2>This is the Map</h2>	

			{/* T H I S  I S  T H E  O L  M A P */}
			<div id="ol_map" ref={mapRef}></div>

			<ul id="list">
				{markers.map(marker => (
					<li key={marker.id}>
						<button className={`buttonDefault`}
								onClick={()=> {handleClick(marker.coords)}}>
							{marker.name}				
						</button>
					</li>
				))}
			</ul>

		</div>
	)
}