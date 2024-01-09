/**
 * Sets user authentication as global context,
 * accessible by any nested component, 
 */
import * as React from "react";
import APIaccess from './apiaccess';
const authContext = React.createContext();
const accessAPI = APIaccess();


function useAuth() {

	const [authed, setAuth] = React.useState(()=> {
		if(sessionStorage.getItem('userKey')) {
			return true;
		} else {
			return false;
		}
	});
	
	return {
		authed,

		async login(loginCredentials) {

			let request = await APIaccess().logInUser(loginCredentials);

			if(request == true) {
				if(sessionStorage.getItem('userKey')) {
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
				setAuth(false);
				if(sessionStorage.length == 0) {
					res()
				}
			})
		}
	};
}

export function AuthProvider({ children }) {
	const auth = useAuth();

	return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export default function AuthConsumer(){
	return React.useContext(authContext);
}