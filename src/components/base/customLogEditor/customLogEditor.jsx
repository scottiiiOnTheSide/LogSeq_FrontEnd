import * as React from 'react';
import './customLogEditor.css';

export default function CustomLogEditor({current, setCurrent}) {

	let wrapper = React.useRef();
	React.useEffect(()=> {
		let viewportHeight = window.innerHeight;
		let maxHeight = viewportHeight - 160;
		wrapper.current.style.height = `${maxHeight}px`;
	}, [])

	return <div id="customLogEditor" 
			ref={wrapper} 
			className={`${current.transition == true ? 'leave' : ''}`}>
		


	</div>
}