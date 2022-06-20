import React, { useState, useReducer, useEffect } from 'react';
import './App.css';

import Header from './components/header/header';
import UserEntry from './components/userEntry/userEntry';

function App() {

  //section state variables
  const [login, setLogin] = useReducer(state => !state, true);
  const [home, setHome] = useReducer(state => !state, false);

  const [isLoggedIn, set_isLoggedIn] = useState({});

  // if(isLoggedIn) {
  //   setLogin(false);
  //   setHome(true);
  // }

  useEffect(()=> {
    setLogin(false);
    setHome(true);
  }, [isLoggedIn]);
  //isLoggedIn is the dependency this func watches for, as for when to run

  return (
    <div className="">
      <Header login={login} home={home}/>
      {login && 
          <UserEntry login={login} setLogin={setLogin} set_isLoggedIn={set_isLoggedIn}/>
      }
    </div>
  );
}

export default App;
