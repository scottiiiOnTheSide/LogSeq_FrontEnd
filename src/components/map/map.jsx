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

import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import 'ol/ol.css';
import './map.css';

let accessAPI = APIaccess();


export default function MapComponent ({ current, log, setLog, selectedDate, setSelectedDate, cal }) {

	const navigate = useNavigate();
	const [mapState, setMapState] = React.useState(null);
	const [currentCenter, setCurrentCenter] = React.useState([-73.9249,  40.6943]);
	const [markers, setMarkers] = React.useState([
		// { 
		// 	id: 1, 
		// 	coords: [-73.9249, 40.6943], 
		// 	title: 'First Spot',
		// 	text: 'This is just some filler text to place within this pop up element that we have here. No important information relevant to anything.' 
		// },
		// { 	
		// 	id: 2, 
		// 	coords: [-73.935242, 40.730610], 
		// 	title: 'Second Spot',
		// 	text: 'These are some words that the dev would like to place here as filler content. It is of no importance or effect to anything'
		// }
	]);
	const mapRef = React.useRef();
	const [isMapMounted, setMapMounted] = React.useState(false);
	const [postBoardInfo, setPostBoardInfo] = React.useState({
		title: null,
		text: null
	}); 
	const [postBoardClass, setPostBoardClass] = React.useState('down');//up or down
	const [headerState, setHeaderState] = React.useState('allPosts'); //allPosts, date or macros
	const [dateSelect, setDateSelect] = React.useState({
		open: false,
		month: null,
		year: null,
		date: null
	})

	const onChange = (e) => {

		if(e.target.name == 'yearSelect') {
			setDateSelect({
				...dateSelect,
				year: e.target.value
			})
			if(e.target.value.length == 4) {
				setSelectedDate({
					...selectedDate,
					year: e.target.value
				})
			}
		}
		else if(e.target.name == 'dateSelect') {
			setDateSelect({
				...dateSelect,
				date: e.target.value
			})
			setSelectedDate({
				...selectedDate,
				day: e.target.value
			})
		}
		
	}

	/* 
		Extracts data from log for markers and popUpPanel
	   	and Filters posts based on headerState 
	*/
	React.useEffect(()=> {

		if(headerState == 'allPosts') {
			let num = 0;
			let locations = log.filter(entry => entry.hasOwnProperty('location')).map(entry => {
				return {
					id: num,
					// coords: points,
					coords: [parseFloat(entry.location.lon), parseFloat(entry.location.lat)],
					title: entry.title,
					text: entry.content[0].content,
					tags: entry.tags ? entry.tags.length : null,
					taggedUsers: entry.taggedUsers ? entry.taggedUsers.length : null,
					comments: entry.commentCount,
					postData: entry
				}
				num++
			});
			setMarkers(locations);
		}
		if(headerState == 'date') {

			let num = 0;
			let locations = log.filter((entry) => {
				if(entry.hasOwnProperty('location')) {

					if((entry.postedOn_month == dateSelect.month && entry.postedOn_day == dateSelect.date) 
						&& entry.postedOn_year == dateSelect.year) {
						return entry;
					}
				}
			}).map(entry => {
				return {
					id: num,
					// coords: points,
					coords: [parseFloat(entry.location.lat), parseFloat(entry.location.lon)],
					title: entry.title,
					text: entry.content[0].content,
					tags: entry.tags ? entry.tags.length : null,
					taggedUsers: entry.taggedUsers ? entry.taggedUsers.length : null,
					comments: entry.commentCount,
					postData: entry
				}
				num++
			});
		setMarkers(locations);
		}
	}, [headerState, dateSelect, ])


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

				setPostBoardClass('down')

				let secondStep = setTimeout(()=> {
					// setPostBoardInfo({
					// 	title: data.title,
					// 	text: data.text
					// })
					setPostBoardInfo(data)
				}, 600);
					
				let thirdStep = setTimeout(()=> {
					setPostBoardClass('up')
				}, 1000);

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
	}, [currentCenter, markers, isMapMounted]) 


	return (
		<div id="MAP" className={`${current.transition == true ? 'leave' : ''}`}>
			
			<div id="header">
				{headerState == 'allPosts' &&
					<h2>All Posts</h2>
				}
				{headerState == 'date' &&
					<button className={`buttonDefault`}
							onClick={(e)=> {
								setDateSelect({
									...dateSelect,
									open: true
								})
								let delay = setTimeout(()=> {
									document.getElementById('dateSelection').classList.remove('_enter');				
								}, 200)
					}}>
						{cal.monthsAbrv[selectedDate.month]}. 
						{selectedDate.day}. 
						{selectedDate.year}
					</button>
				}
				{headerState == 'macros' &&
					<p>Function Pending</p>
				}
			</div>	

			{/* T H I S  I S  T H E  O L  M A P */}
			<div id="ol_map" ref={mapRef}></div>


			{/*P O S T  P A N E L  W R A P P E R*/}
			<div id="popUpPost" className={`${postBoardClass}`}>
				
				<div id="exitButtonWrapper">
					<button className={`buttonDefault`}
							onClick={()=> {
								setPostBoardClass('down');
							}}>×</button>
				</div>

				<div id="text" onClick={()=> {
					setTimeout(()=> {
						navigate(`/post/${postBoardInfo.postData._id}`, {
							state: {post: postBoardInfo.postData}
						});
					}, 600)
				}}>
					<h2>{postBoardInfo.title}</h2>
					<p>{postBoardInfo.text}</p>

					<ul>
						{postBoardInfo.tags > 0 &&
							<li>{postBoardInfo.tags} tags</li>
						}
						{postBoardInfo.comments > 0 &&
							<li>{postBoardInfo.comments} comments</li>
						}
						{postBoardInfo.taggedUsers > 0 &&
							<li>{postBoardInfo.taggedUsers} users tagged</li>
						}
					</ul>
				</div>
			</div>

			{/* F I L T E R S*/}
			<div id="filters"> 
				<p>Filter Posts By</p>

				<ul>
					<li>
						<button className={`buttonDefault ${headerState == 'allPosts' ? 'active' : 'inactive'}`} 
								onClick={()=> {
									setHeaderState('allPosts')
								}}>All Posts</button>
					</li>

					<li>
						<button className={`buttonDefault ${headerState == 'date' ? 'active' : 'inactive'}`}
								onClick={()=> {
									setHeaderState('date')
								}}>Date</button>
					</li>

					<li>
						<button className={`buttonDefault ${headerState == 'macros' ? 'active' : 'inactive'}`}
								onClick={()=> {
									setHeaderState('macros')
								}}>Macros</button>
					</li>
				</ul>
			</div>

			{/* D A T E  S E L E C T I O N */}
			{dateSelect.open &&
				<div id="dateSelection" className={`_enter`}>

					<p id="firstNotice">Select the month, type in a year and then close this modal to set a new month</p>

					<ul id="monthSelection">

						{cal.monthsAbrv.map((month, index)=> {

							return (
								<li key={month}>
									<button className={`buttonDefault ${dateSelect.month == index ? 'selected' : ''}`}
											onClick={(e)=> {
												e.preventDefault();
												setDateSelect({
													...dateSelect,
													month: index
												})
												setSelectedDate({
													...selectedDate,
													month: index
												})
											}}>
									{month}</button>
								</li>
							)
						})}
					</ul>

					<input 
						name="dateSelect"
						type="number"
						maxLength="2"
						value={dateSelect.date}
						onChange={onChange}
						/>
					<p id="secondNotice">Input Date 1 - 31</p>

					<input 
						name="yearSelect"
						type="number"
						maxLength="4"
						value={dateSelect.year}
						onChange={onChange}
						/>
					<p id="secondNotice">Input between 1900 - 2100</p>

					<button id="exit"
							className={`buttonDefault`}
							onClick={(e)=> {
								e.preventDefault();
								document.getElementById('dateSelection').classList.add('_enter');
								
								let delay = setTimeout(()=> {
									setDateSelect({
										...dateSelect,
										open: false
									})
								}, 200)
							}}>
						CLOSE
					</button>
				</div>
			}
		</div>
	)
}