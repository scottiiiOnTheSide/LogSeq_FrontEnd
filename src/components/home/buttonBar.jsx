/* * * V i t a l s * * */
import * as React from 'react';

export default function ButtonBar({modal, setModal, currentSection}) {


	let current = currentSection;
	let [functionName, setFuncName] = React.useState('Create Post');

	React.useEffect(()=> {
		if(currentSection == 2) {
			setFuncName('Create Post');
			console.log(currentSection)
		} else if (currentSection == 1) {
			setFuncName('Manage Connections');
			console.log(currentSection)
		}
	}, [current])

	let openModal = () => {
		if(currentSection == 2) {
			setModal('2');
			console.log(modal);
		} else if(currentSection == 3) {
			setModal('3')
			console.log(modal)
		}
	}

	return (
		<div id="buttonBar">
			<button id="main" onClick={openModal}>{functionName}</button>
		</div>
	)
}