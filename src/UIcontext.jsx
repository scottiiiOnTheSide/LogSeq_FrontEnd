import * as React from 'react';
import {createContext} from 'react';

const UIcontext = createContext();

export function UIContextProvider({children}) {

	const [current, setCurrent] = React.useState({
		section: null, //0, 1, 2, 3, 4
		social: null, //true, false or social
		monthChart: false, //true or false
		scrollTo: null
	})

	const value = {
		current
	}

	return <UIcontext.Provider value={value}>
		{children}
	</UIcontext.Provider>

}

export function UIContext() {
	return React.useContext(UIcontext)
}