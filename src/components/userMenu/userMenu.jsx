
import React, {useState} from 'react';
import './userMenu.css';

function LogControls() {

	const [createOpen, set_createOpen] = useState(false);
	const openCreateMenu = () => {} 

	return (
		<ul id="logControls">
			<li onClick="openCreateMenu">Create</li>
			<li onClick="">Update</li>
			<li onClick="">Delete</li>
		</ul>
	)
}

function createForm () {
	return (
		//form with title, content tags
		<>
		</>
	)
}

export default function UserMenu() {

}