import * as React from 'react';

function ManageCurations() {

	/* element dimensions to be 100% viewport */
	return (
		<div id="ManageCurations_wrapper"></div>
	)
}

export default function GroupsList({active}) {

	let [modal, setModal] = React.useReducer(state => !state, false);
	let isActive = active;

	// console.log(isActive);

	return (
		<div id="groupsList" className={isActive == 4 ? 'active' : 'not'}>
			
			{modal &&
				<ManageCurations />
			}
		</div>
	)
}