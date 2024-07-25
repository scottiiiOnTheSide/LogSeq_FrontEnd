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

import Header from '../../components/base/header';

import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import 'ol/ol.css';
import './map.css';

let accessAPI = APIaccess();


export default function MapComponent ({ current, log, setLog }) {

	const [mapState, setMapState] = React.useState(null);
	const [currentCenter, setCurrentCenter] = React.useState([-73.9249,  40.6943]);
	const [markers, setMarkers] = React.useState([
		{ 
			id: 1, 
			coords: [-73.9249, 40.6943], 
			title: 'First Spot',
			text: 'This is just some filler text to place within this pop up element that we have here. No important information relevant to anything.' 
		},
		{ 	
			id: 2, 
			coords: [-73.935242, 40.730610], 
			title: 'Second Spot',
			text: 'These are some words that the dev would like to place here as filler content. It is of no importance or effect to anything'
		}
	]);
	const mapRef = React.useRef();
	const postBoardRef = React.useRef();
	const [postBoardInfo, setPostBoardInfo] = React.useState({
		title: null,
		text: null
	}); 
	const [postBoardClass, setPostBoardClass] = React.useState('down');//up or down

	/* Renders Open Layers Map on Component Mount */
	React.useEffect(()=> {

		let centerCoordinates = fromLonLat(currentCenter);

		//Creates necessary layer for adding circle spots on map
		const vectorSource = new VectorSource();

		//creates markers from coordinates, adds them to VectorSource
		markers.forEach(marker => {

			let spot = new Feature({
				geometry: new Point(fromLonLat(marker.coords)),
				data: marker
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

		//create OSM / Tile layer
		const osmLayer = new TileLayer({
			preload: Infinity,
			source: new OSM(),
		});

		const initialMap = new Map({
			target: mapRef.current,
			layers: [osmLayer, vectorLayer],
			view: new View({
				center: centerCoordinates, //lat n lng
				zoom: 11,
				maxZoom: 15
			})
		})

		initialMap.on('click', (event)=> {
			initialMap.forEachFeatureAtPixel(event.pixel, (feature) => {
				const clickedCoords = feature.getGeometry().getCoordinates();

				let data = feature.get('data');
				console.log(data)

				if(postBoardClass == 'up') {

					setPostBoardClass('down')

					let secondStep = setTimeout(()=> {
						setPostBoardInfo({
							title: data.title,
							text: data.text
						})
					}, 600)
					
					let thirdStep = setTimeout(()=> {
						setPostBoardClass('up')
					}, 1000)
				}
				else {

					setPostBoardInfo({
						title: data.title,
						text: data.text
					})

					let secondStep = setTimeout(()=> {
						setPostBoardClass('up')
					}, 500)
				}

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

	console.log(postBoardInfo)
	console.log(postBoardClass)

	return (
		<div id="MAP" className={`${current.transition == true ? 'leave' : ''}`}>
			
			<h2 id="header">All Posts</h2>	

			{/* T H I S  I S  T H E  O L  M A P */}
			<div id="ol_map" ref={mapRef}></div>

			<div id="popUpPost" ref={postBoardRef} className={`${postBoardClass}`}>
				
				<div id="text">
					<h2>{postBoardInfo.title}</h2>
					<p>{postBoardInfo.text}</p>
				</div>
			</div>

			<div id="filters"> 
				<p>Filter Posts By</p>

				<ul>
					<li>
						<button className={`buttonDefault`}>All Posts</button>
					</li>

					<li>
						<button className={`buttonDefault`}>Date</button>
					</li>

					<li>
						<button className={`buttonDefault`}>Macros</button>
					</li>
				</ul>
			</div>

		</div>
	)
}