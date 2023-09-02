/*
	Instant.js 
	for handling updates made through websockets
*/

import React, { useState, useReducer, useEffect } from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';

export default function Instant ({userID}) {


	const WS_URL = `ws://172.19.185.143:3333/?${userID}`;
	const [socketURL, setSocketURL] = useState(WS_URL);
	const {sendMessage, lastMessage, readyState} = useWebSocket(socketURL);

	// useWebSocket(socketURL).onOpen = () => {
	// 	console.log("Websocket connection established");
	// }

	useWebSocket(WS_URL, {
		onOpen: ()=> {
			console.log("Websocket connection established")
			sendMessage("HELLO!")
		},
		onMessage: (e)=> {
			console.log(e.data);
		}
	})

	useEffect(() => { //when state of socket changes ...
		if(readyState === ReadyState.OPEN) {

		} else if (readyState === ReadyState.CLOSED) {

		}
	}, [readyState])
}