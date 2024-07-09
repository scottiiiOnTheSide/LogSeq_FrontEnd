/* * * V i t a l s * * */
import * as React from 'react';

export default function ButtonBar({
	current, 
	setCurrent, 
	dateInView, 
	set_dateInView, 
	cal, 
	selectedDate, 
	set_selectedDate,
	mapData,
	setMapData
}) {

	let [functionName, setFuncName] = React.useState('Create Post');

	React.useEffect(()=> {
		if(current.section == 2) {
			setFuncName('Create Post');
		} else if (current.section == 1) {
			setFuncName('Connections');
		} else if (current.section == 3) {
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
								})
							}, 300)
						}
						else {
							setCurrent({
								...current,
								map: true
							})
						}
					}}>
				<p>{mapData.currentState}</p>
				<p>{mapData.currentCity}</p>

			</button>

			{/* C E N T E R  F U N C T I O N */}
			<button id="main" onClick={()=> {setCurrent({...current, modal: true})}}>{functionName}</button>

			{/*C A L E N D A R*/}
			<button id="monthChartToggle" onClick={()=> {
				if(current.monthChart) {
					setCurrent({
						...current,
						transition: true
					})
					let delay = setTimeout(()=> {
						setCurrent({
							...current,
							monthChart: false,
						})

						const hajime = new Date();
						
						set_selectedDate({
							day: hajime.getDate(),
							month: hajime.getMonth(),
							year: hajime.getFullYear()
						})
					}, 300)
				} else if(!current.monthChart) {
					setCurrent({
						...current,
						monthChart: true
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
				{!current.monthChart &&
					<div id="day">
						<p>Day</p>
						<span>{cal.dayOfTheYear}</span>
						<span>/</span>
						<span>{cal.amountOfDays}</span>
					</div>
				}
				{current.monthChart &&
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