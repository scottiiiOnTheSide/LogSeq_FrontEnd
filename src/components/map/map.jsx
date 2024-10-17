/* V I T A L S */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import Cluster from 'ol/source/Cluster';
import { Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
import Control from 'ol/control/Control';

import Header from '../../components/base/header';

import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import 'ol/ol.css';
import './map.css';

let accessAPI = APIaccess();

function CenterIcon({}) {

	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			width="20.5" 
			height="21.11" 
			viewBox="0 0 20.706 21.11">
		  <g id="Group_343" data-name="Group 343" transform="translate(1584 -5877)">
		    <g id="Ellipse_27" data-name="Ellipse 27" transform="translate(-1580.482 5880.519)" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2">
		      <circle cx="7.037" cy="7.037" r="7.037" stroke="none" />
		      <circle cx="7.037" cy="7.037" r="6.037" fill="none" />
		    </g>
		    <line id="Line_206" data-name="Line 206" y1="3.518" transform="translate(-1573.445 5877)" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2" />
    		<line id="Line_207" data-name="Line 207" y1="3.451" transform="translate(-1563.294 5887.354) rotate(90)" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2" />
    		<line id="Line_208" data-name="Line 208" y1="3.451" transform="translate(-1580.549 5887.354) rotate(90)" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2" />
    		<line id="Line_209" data-name="Line 209" y1="3.518" transform="translate(-1573.445 5894.592)" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2" />
		  </g>
		</svg>
	)
}

function ArrowIcon({classname}) {
	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			width="25.624" 
			height="7.866" 
			viewBox="0 0 25.624 7.866"
			className={`${classname}`}>
		  <g id="Group_224" data-name="Group 224" transform="translate(-22 -25.634)">
		    <line fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2" id="Line_146" data-name="Line 146" class="cls-1" x2="25" transform="translate(22.624 32.5)"/>
		    <line fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2" id="Line_148" data-name="Line 148" class="cls-1" x2="12" transform="translate(22.5 32.5) rotate(-30)"/>
		  </g>
		</svg>
	)
}

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


	/*  T H E   M A P
		Renders Open Layers Map on Component Mount */
	React.useEffect(()=> {

		let centerCoordinates = fromLonLat(currentCenter);

		//Creates necessary layer for adding circle spots on map
		const vectorSource = new VectorSource();

		//create vector layer with vectorSource
		const vectorLayer = new VectorLayer({
			source: vectorSource
		})

		const clusterSource = new Cluster({
			distance: 40,
			source: vectorSource
		})

		const clusterLayer = new VectorLayer({
			source: clusterSource,
			style: (feature) => {
				const size = feature.get('features').length;

				if(size > 1) {
					return new Style({
				      image: new CircleStyle({
				        radius: 18, // larger radius for clusters
				        fill: new Fill({ color: 'rgba(0, 82, 255, 0.5)' }),
				        stroke: new Stroke({ color: 'white', width: 2 }),
				      }),
				      text: new Text({
				        text: size > 1 ? size.toString(): '', // show the number of posts in the cluster
				        font: '300 16px Raleway',
				        fill: new Fill({ color: 'transparent' }),
				        stroke: new Stroke({ color: 'white', width: 2 }),
				      }),
				    });
				}
				else {
					return new Style({
				      image: new CircleStyle({
				        radius: 10,
				        fill: new Fill({ color: 'rgba(0, 82, 255, 0.5)' }),
				        stroke: new Stroke({ color: 'white', width: 2 }),
				      }),
				    });
				}
			}
		})

		//creates markers from coordinates, adds them to VectorSource
		markers.forEach(marker => {

			let spot = new Feature({
				geometry: new Point(fromLonLat(marker.coords)),
				data: marker
			})

			spot.setStyle(new Style({
				image: new CircleStyle({
					radius: 8,
					fill: new Fill({ color: 'grey' }),
					stroke: new Stroke({ color: 'white', width: 2 })
				})
			}));

			vectorSource.addFeature(spot);
			clusterSource.addFeature(spot);
		})

		// Create a custom Zoom In button control
		class ZoomInControl extends Control {
	      constructor(opt_options) {
	        const options = opt_options || {};

	        // Create a button element
	        const button = document.createElement('button');
	        button.id = 'zoomIn';
	        button.innerHTML = '+';

	        // Create a div element to wrap the button
	        const element = document.createElement('div');
	        element.className = 'zoom-in-button ol-unselectable ol-control';
	        element.appendChild(button);

	        super({
	          element: element,
	          target: options.target
	        });

	        button.addEventListener('click', () => {
	          const view = initialMap.getView();
	          const zoom = view.getZoom();
	          view.animate({
	          	zoom: zoom + 1,
	          	duration: 500
	          });
	        });
	      }
	    }

	    // Create a custom Zoom Out button control (bottom-left)
	    class ZoomOutControl extends Control {
	      constructor(opt_options) {
	        const options = opt_options || {};

	        // Create a button element
	        const button = document.createElement('button');
	        button.id = 'zoomOut';
	        button.innerHTML = '-';

	        // Create a div element to wrap the button
	        const element = document.createElement('div');
	        element.className = 'zoom-out-button ol-unselectable ol-control';
	         // Position it at the bottom-left
	        element.appendChild(button);

	        super({
	          element: element,
	          target: options.target
	        });

	        button.addEventListener('click', () => {
	          const view = initialMap.getView();
	          const zoom = view.getZoom();
	          view.animate({
	          	zoom: zoom - 1,
	          	duration: 500
	          }); 
	        });
	      }
	    }

		// Create a custom "Recenter" button control
	    class RecenterControl extends Control {
	      constructor(opt_options) {
	        const options = opt_options || {};

	        // Create a button element
	        const button = document.createElement('button');
	        button.id = 'recenter';

	        // Create a div element to wrap the button
	        const element = document.createElement('div');
	        element.className = 'recenter-button ol-unselectable ol-control';
	        element.appendChild(button);

	        super({
	          element: element,
	          target: options.target
	        });

	        ReactDOM.render(<CenterIcon />, button);

	        // Handle the button click event
	        button.addEventListener('click', this.handleRecenter.bind(this), false);
	      }

	      handleRecenter() {
	        // Animate the map to recenter on the initial coordinates
	        const view = initialMap.getView();
	        view.animate({
	          center: fromLonLat(currentCenter),
	          zoom: 11,
	          duration: 500
	        });
	      }
	    }

		//create OSM / Tile layer
		const osmLayer = new TileLayer({
			preload: Infinity,
			source: new OSM(),
		});

		const initialMap = new Map({
			target: mapRef.current,
			layers: [osmLayer, clusterLayer],
			view: new View({
				center: centerCoordinates, //lat n lng
				zoom: 11,
				maxZoom: 15
			})
		})

		initialMap.on('click', (event)=> {
			initialMap.forEachFeatureAtPixel(event.pixel, (feature) => {
				const clickedCoords = feature.getGeometry().getCoordinates();

				// let data = feature.get('data');

				const features = feature.get('features');

				if (features.length > 1) { //if multiple posts
					const postData = features.map(f => f.get('data'));
					setPostInfo(postData)
				}
				else {
					const data = features[0].get('data');
					setPostInfo([data]);
				}

				setPostBoardClass('down')

				// let secondStep = setTimeout(()=> {
				// 	setPostBoardInfo(data)
				// }, 600);
					
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

		// initialMap.on('click', (event) => {
		//     initialMap.forEachFeatureAtPixel(event.pixel, (feature) => {
		//       const features = feature.get('features');

		//       if (features.length > 1) {
		//         // Handle cluster (multiple posts)
		//         const postData = features.map(f => f.get('data'));
		//         openPopupWithPosts(postData);  // Implement the popup to show multiple posts
		//       } 

		//       else {
		//         // Handle single post
		//         const data = features[0].get('data');
		//         openPopupWithSinglePost(data);  // Implement the popup for single post
		//       }
		//     });
		//   });

		initialMap.addControl(new RecenterControl());
		initialMap.addControl(new ZoomInControl());
    	initialMap.addControl(new ZoomOutControl());

		setMapState(initialMap)

		//Removes map on unmount
		return ()=> {
			// if(initialMap) {

				initialMap.setTarget(null);

				 // Remove event listeners
				// initialMap.un('click', clickListener);

				// Remove controls (if dynamically added)
				// initialMap.getControls().clear();

				//Detachs map from the DOM
				// initialMap.setTarget(null);

				//Clears the vector layer
				// vectorSource.clear()
			// }
				
		}
	}, [currentCenter, markers, isMapMounted]) 

	function openPopupWithPosts(posts) {
		setPostInfo(posts);
		setCurrentPostIndex(0);
		setPostBoardClass('down');
		setTimeout(() => setPostBoardClass('up'), 1000);
	}

	function openPopupWithSinglePost(post) {
		setPostInfo([post]);
		setCurrentPostIndex(0);
		setPostBoardClass('down');
		setTimeout(() => setPostBoardClass('up'), 1000);
	}

	function handleNextPost() {
		setCurrentPostIndex((prevIndex) => (prevIndex + 1) % postInfo.length);
	}

	function handlePrevPost() {
		setCurrentPostIndex((prevIndex) => (prevIndex - 1 + postInfo.length) % postInfo.length);
	}

	const [cyclePosts, setCyclePosts] = React.useReducer(state => !state, false);
	const [currentPostIndex, setCurrentPostIndex] = React.useState(0);
	const [postInfo, setPostInfo] = React.useState([]);

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
				
				{/* E X I T  B U T T O N */}
				<div id="exitButtonWrapper">
					<button className={`buttonDefault`}
							onClick={()=> {
								setPostBoardClass('down');
							}}>×</button>
				</div>

				{/*T E X T   W R A P P E R*/}
				{postInfo.length > 0 &&

					<div id="text" onClick={()=> {
						setTimeout(()=> {
							navigate(`/post/${postInfo[currentPostIndex].postData._id}`, {
								state: {
									location: null
								}
							});
						}, 600)
					}}>
						<h2>{postInfo[currentPostIndex].title}</h2>
						<p>{postInfo[currentPostIndex].text}</p>

						<ul>
							{postInfo[currentPostIndex].tags > 0 &&
								<li>{postInfo[currentPostIndex].tags} tags</li>
							}
							{postInfo[currentPostIndex].comments > 0 &&
								<li>{postInfo[currentPostIndex].comments} comments</li>
							}
							{postInfo[currentPostIndex].taggedUsers > 0 &&
								<li>{postInfo[currentPostIndex].taggedUsers} users tagged</li>
							}
						</ul>
					</div>	

				}

				{/*C Y C L E  P O S T S*/}
				{postInfo.length > 1 &&
					<ul id="arrowsWrapper">
					
						<li onClick={handlePrevPost}>
							<ArrowIcon classname={''} />
						</li>
						<li onClick={handleNextPost}>
							<ArrowIcon classname={'left'} />
						</li>

					</ul>
				}
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


			// {/*ChatGPT recommended change*/}
			//  <div className={`post-popup ${postBoardClass}`}>
			//     {popupPosts.length > 1 && (
			// 	    <div className="post-navigation">
			// 	    	<button onClick={handlePrevPost}>&lt;</button>
			// 	    	<button onClick={handleNextPost}>&gt;</button>
			// 	    </div>
			//     )}
			//     <div className="post-content">
			//       {popupPosts[currentPostIndex] && (
			//         	<div>
			//           		<h3>{popupPosts[currentPostIndex].title}</h3>
			//           		<p>{popupPosts[currentPostIndex].description}</p>
			//           		{/* Render other post details */}
			//         	</div>
			//        )}
			//     </div>
		  	// </div>