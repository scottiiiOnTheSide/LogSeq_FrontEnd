/* * * V i t a l s * * */
import * as React from 'react';

export default function ButtonBar({modal, setModal, currentSection, setMonthChart, monthChart, dateInView, set_dateInView, cal}) {


	let current = currentSection;
	let [functionName, setFuncName] = React.useState('Create Post');

	React.useEffect(()=> {
		if(currentSection == 2) {
			setFuncName('Create Post');
		} else if (currentSection == 1) {
			setFuncName('Manage Connections');
		}
	}, [current])

	return (
		<div id="buttonBar">
			<button id="main" onClick={setModal}>{functionName}</button>

			<button id="monthChartToggle" onClick={()=> {
				setMonthChart()

				/* resets calendar values each time it's toggled */
				if(dateInView.day) {
					set_dateInView({
						month: null,
						day: null,
						year: null
					})
				}
			}}>
				
				{!monthChart &&
					<div id="day">
						<p>Day</p>
						<span>{cal.dayOfTheYear}</span>
						<span>/</span>
						<span>{cal.amountOfDays}</span>
					</div>
				}
				{monthChart &&
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