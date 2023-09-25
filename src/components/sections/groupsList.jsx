import * as React from 'react';

function ManageGroups() {

	/* element dimensions to be 100% viewport */
	return (
		<div id="ManageGroups_wrapper"></div>
	)
}

export default function GroupsList({active}) {

	let [modal, setModal] = React.useReducer(state => !state, false);
	let isActive = active;

	// console.log(isActive);

	return (
		<div id="groupsList" className={isActive == 0 ? 'active' : 'not'}>
			
			{modal &&
				<ManageGroups />
			}
		</div>
	)
}