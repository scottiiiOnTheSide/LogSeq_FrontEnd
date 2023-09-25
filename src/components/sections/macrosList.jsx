import * as React from 'react';

function ManageMacros() {

	/* element dimensions to be 100% viewport */
	return (
		<div id="ManageMacros_wrapper"></div>
	)
}

export default function GroupsList({active}) {

	let [modal, setModal] = React.useReducer(state => !state, false);
	let isActive = active;

	// console.log(isActive);

	return (
		<div id="groupsList" className={isActive == 3 ? 'active' : 'not'}>
			
			{modal &&
				<ManageMacros />
			}
		</div>
	)
}