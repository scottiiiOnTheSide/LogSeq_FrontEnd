/**
 * Sets user authentication as global context,
 * accessible by any nested component, 
 */
import * as React from "react";
import APIaccess from './apiaccess';
const uiContext = React.createContext();
const accessAPI = APIaccess();


/*
	A function which houses other values and functions 
	to operate within the context
*/
export function useUIC() {

	const [authed, setAuth] = React.useState(()=> {
		if(sessionStorage.getItem('userKey')) {
			return true;
		} else {
			return false;
		}
	});
	
	const [colorScheme, setColorScheme] = React.useState({
		bg: null,
		headings: null,
		text: null,
		buttons: null,
		submenus: null
	})


	return {
		authed,
		colorScheme,
		setColorScheme,

		async _login(loginCredentials) {

			let request = await APIaccess().logInUser(loginCredentials);

			if(request.confirm == true) {
				if(sessionStorage.getItem('userKey')) {

					//setColorScheme to options set in request.settings.colorScheme

					setAuth(true);
					return true;
				}
			} else {
				return request;
			}	
		},

		async logout() {
			return new Promise((res, rej) => {
				sessionStorage.removeItem('userKey');
				sessionStorage.removeItem('userName');
				sessionStorage.removeItem('userID');
				sessionStorage.removeItem('privacySetting');
				sessionStorage.removeItem('profilePhoto');
				setAuth(false);
				if(!sessionStorage.userKey) {
					res()
				}
			})
		}
	};
}

export function UIContextProvider({ children }) {
	const UIC = useUIC();

	return <uiContext.Provider value={UIC}>{children}</uiContext.Provider>
}

export default function UICConsumer(){
	return React.useContext(uiContext);
}
