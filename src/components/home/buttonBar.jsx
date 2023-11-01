/* * * V i t a l s * * */
import * as React from 'react';

export default function ButtonBar({modal, setModal, currentSection}) {


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
		</div>
	)
}