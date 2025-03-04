/* * * V i t a l s * * */
import * as React from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';

function CompassButton ({}) {

	return (
		<svg 
			id="compass"
			xmlns="http://www.w3.org/2000/svg" 
			width="40" 
			height="47.06" 
			viewBox="0 0 35 41">
		  <g id="Group_357" data-name="Group 357" transform="translate(-1245 -2162)">
		    <text id="N" transform="translate(1260.5 2170.5)" stroke="rgba(0,0,0,0.05)" stroke-width="0.5" font-size="8" font-family="Raleway-Medium, Raleway" font-weight="500"><tspan x="0" y="0">N</tspan></text>
		    <text id="W" transform="translate(1245.5 2185.5)" stroke="rgba(0,0,0,0.05)" stroke-width="0.5" font-size="8" font-family="Raleway-Medium, Raleway" font-weight="500"><tspan x="0" y="0">W</tspan></text>
		    <text id="E" transform="translate(1274.5 2185.5)" stroke="rgba(0,0,0,0.05)" stroke-width="0.5" font-size="8" font-family="Raleway-Medium, Raleway" font-weight="500"><tspan x="0" y="0">E</tspan></text>
		    <text id="S" transform="translate(1260.5 2200.5)" stroke="rgba(0,0,0,0.05)" stroke-width="0.5" font-size="8" font-family="Raleway-Medium, Raleway" font-weight="500"><tspan x="0" y="0">S</tspan></text>
		    <g id="Group_356" data-name="Group 356">
		      <line id="Line_215" data-name="Line 215" x2="16" transform="translate(1255.5 2182.5)" fill="none" stroke="#000" stroke-width="1"/>
		      <line id="Line_216" data-name="Line 216" x2="16" transform="translate(1263.5 2174.5) rotate(90)" fill="none" stroke="#000" stroke-width="1"/>
		      <line id="Line_217" data-name="Line 217" x2="20" y2="20" transform="translate(1253.5 2172.5)" fill="none" stroke="#000" stroke-width="1"/>
		      <line id="Line_218" data-name="Line 218" x2="20" y2="20" transform="translate(1273.5 2172.5) rotate(90)" fill="none" stroke="#000" stroke-width="1"/>
		    </g>
		  </g>
		</svg>
	)
}

export default function ButtonBar({
	current, 
	setCurrent, 
	dateInView, 
	set_dateInView, 
	cal, 
	selectedDate, 
	setSelectedDate,
	mapData,
	setMapData
}) {
	const location = useLocation();
	const navigate = useNavigate();
	const hajime = new Date();
	let [functionName, setFuncName] = React.useState('Create Post');

	React.useEffect(()=> {
		if(current.map == true) {
			setFuncName('Settings');
		}
		else if(current.section == 1) {
			setFuncName('Create Post');
		} 
		else if (current.section == 0) {
			setFuncName('Connections');
		} 
		else if (current.section == 2) {
			setFuncName('Manage');
		}
	}, [current])

	return (
		<div id="buttonBar">

			{/*M A P  T O G G L E*/}
			<button id="mapToggle" 
					className={`buttonDefault`}
					onClick={()=> {
						if(current.map) {

							setCurrent({
								...current,
								transition: true
							})
							let delay = setTimeout(()=> {
								setCurrent({
									...current,
									map: false,
									transition: false
								})
							}, 300)
						}
						else if(!current.map && !current.calendar) {
							const hajime = new Date();
						
							setSelectedDate({
								day: hajime.getDate(),
								month: hajime.getMonth(),
								year: hajime.getFullYear()
							})
							setCurrent({
								...current,
								map: true
							})
						}
					}}>
					<CompassButton/>
			</button>

			{/* C E N T E R  F U N C T I O N */}
			<button id="main" onClick={(e)=> {
				e.preventDefault();

				let delay = setTimeout(()=> {
					if(!current.modal) {

						setCurrent({
							...current, 
							modal: true
						})

						if(current.map) {
							let delay = setTimeout(()=> {
								document.getElementById('mapSettings').classList.remove('_enter');				
							}, 200)
						}
					}
					else if(current.modal) {

						if(current.map) {

							document.getElementById('mapSettings').classList.add('_enter');

							let delay = setTimeout(()=> {
								setCurrent({
									...current, 
									modal: false
								})			
							}, 250)
						}
						else {
							setCurrent({
								...current, 
								modal: false
							})
						}	
						
					}
				}, 225)	
			}
			}>{functionName}
			</button>

			{/*C A L E N D A R*/}
			<button id="monthChartToggle" 
					className={`buttonDefault`} onClick={()=> {
				if(current.calendar) {
					setCurrent({
						...current,
						transition: true
					})
					let delay = setTimeout(()=> {
						setCurrent({
							...current,
							calendar: false,
						})
						
						setSelectedDate({
							day: hajime.getDate(),
							month: hajime.getMonth(),
							year: hajime.getFullYear()
						})
					}, 300)
				} else if(!current.calendar && !current.map) {

					setSelectedDate({
						day: hajime.getDate(),
						month: hajime.getMonth(),
						year: hajime.getFullYear()
					})

					setCurrent({
						...current,
						calendar: true
					})
				}

				/* resets calendar values each time it's toggled */
				if(dateInView.day) {
					set_dateInView({
						month: null,
						day: null,
						year: null
					})
				}
			}}>				
				{!current.calendar &&
					<div id="day">
						<p>Day</p>
						<span>{cal.dayOfTheYear}</span>
						<span>/</span>
						<span>{cal.amountOfDays}</span>
					</div>
				}
				{current.calendar &&
					<div id="month">
						<p>Month</p>
						<span>{cal.monthInNum}</span>
						<span>/</span>
						<span>12</span>
					</div>
				}

			</button>
		</div>
	)
}