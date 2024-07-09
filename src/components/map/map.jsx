/* V I T A L S */
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import './map.css';

let accessAPI = APIaccess();

export default function Map ({current }) {


	return (
		<div id="MAP" className={`${current.transition == true ? 'leave' : ''}`}>
			
			<h2>This is the Map</h2>	

		</div>
	)
}