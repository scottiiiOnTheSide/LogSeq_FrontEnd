/**
 * Sets user authentication as global context,
 * accessible by any nested component, 
 */
import * as React from "react";
import APIaccess from './apiaccess';
const authContext = React.createContext();
const accessAPI = APIaccess();


function useAuth() {

	const [authed, setAuth] = React.useState(() => {
		if(sessionStorage.getItem('userKey')) {
			return true;
		} else {
			return false;
		}
	});
	/**
	 * 09. 18. 2023
	 * If context works correctly, will create stateVars for userKey & and ID
	 * instead
	 */
	

	React.useEffect(()=> { //everytime site is accessed while logged in, this 'should' work
		
	}, [authed]);

	return {
		authed,

		async login(loginCredentials) {
				// let data = APIaccess.logInUser(loginCredentials);
				// sessionStorage.setItem('userKey', data.userKey);
				// sessionStorage.setItem('userID', data.userID);
				// setAuth(true);

				await APIaccess().logInUser(loginCredentials).then((data) => {
					console.log(data);
					sessionStorage.setItem('userKey', data.userToken);
					sessionStorage.setItem('userID', data.userID);
				});

				setAuth(true);

				return true; //confirms login successful and user details stored
		},
		logout() {
			return new Promise((res) => {
				sessionStorage.removeItem('userKey');
				setAuth(false);
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