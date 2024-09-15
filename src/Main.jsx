/* * * B a s e  L a y e r * * */
import React from 'react';
import ReactDOM from 'react-dom/client';
import {useNavigate} from 'react-router-dom';
import {
  Routes,
  Route,
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation
} from "react-router-dom";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import APIaccess from './apiaccess';
import useUIC from "./UIcontext";
import Calendar from './components/calendar'
// import {UIContextProvider, UIContext} from './UIcontext';

import './Main.css';
import './components/base/home.css';

/* * * C o m p o n e n t s * * */
import Entry from './components/entry/entry';
import Header from './components/base/header';
import NotificationList from './components/notifs/notifsList';
import CarouselNav from './components/base/carouselNav';
import ButtonBar from './components/base/buttonBar';
import SectionsWrapper from './components/sections/sectionsWrapper';
import Macrospage from './components/macros/macros';
import Post from './components/blog/post';
import Instant from './components/notifs/instant';
import UserSettings from './components/base/userSettings';
import UserProfile from './components/base/userProfile';

/*** Sub Sections ***/
import { CreatePost } from './components/sections/userLog';
import { ManageConnections } from './components/sections/socialLog';
import { ManageMacros } from './components/sections/macros';
import MonthChart from './components/monthChart/monthChart';
import MapComponent from './components/map/map';
import { MapPage } from './components/map/map';
import './components/sections/sections.css';


/* * * I n i t i a l i z e * * */
const accessAPI = APIaccess();




/* * * Supporting Functions * * */
function HomeOrEntry({ children }) {

  const { authed } = useUIC();
  const location = useLocation();

  return authed === true ? ( children ) : <Navigate to="/entry" replace state={{ path: location.pathname }} />
}

/* * * H O M E  C o m p o n e n t * * */
function Home({
  socketURL, 
  socketMessage, 
  setSocketMessage, 
  sendMessage, 
  isActive, 
  setActive, 
  accessID, 
  setAccessID, 
  unreadCount, 
  setUnreadCount,
  getUnreadCount,
  current,
  setCurrent,
  cal,
  selectedDate,
  setSelectedDate,
  mapData,
  setMapData,
  log,
  setLog,
  navOptions,
  setNavOptions
}) {

  const navigate = useNavigate();
  const { logout } = useUIC();
  const [notifList, setNotifList] = React.useReducer(state => !state, false);
  const [userSettings, setUserSettings] = React.useReducer(state => !state, false);
  const [isLogout, setLogout] = React.useReducer(state => !state, false);
  const isPost = false;
  const [dateInView, set_dateInView] = React.useState({
    month: null,
    day: null,
    year: null,
  })

  const [enter, setEnter] = React.useReducer(state => !state, true);
  
  let el = React.useRef();
  let element = el.current

  React.useEffect(()=> {
    if(element) {
      setEnter();
    }
  }, [element]);


  /* for MAIN section transition */
  // const [animState, setAnimState] = React.useState('');
  // React.useEffect(()=> {
  //   if(!current.home && current.transition) {
  //     setAnimState('recede');
  //   }
  //   else if(current.home && current.transition) {
  //     setAnimState('return')
  //   }
  // }, [current])


  return (
    <section id="HOME" ref={el} className={`${enter == true ? '_enter' : ''}`}>  
        <Header 
          cal={cal} 
          isPost={isPost} 
          setNotifList={setNotifList} 
          unreadCount={unreadCount}
          siteLocation={"ss.xyz"}/>

        <CarouselNav current={current} 
                     setCurrent={setCurrent}
                     navOptions={navOptions}
                     setNavOptions={setNavOptions}/>

        {notifList &&
          <NotificationList 
            setNotifList={setNotifList} 
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
            setSocketMessage={setSocketMessage}
            socketMessage={socketMessage}
            accessID={accessID}
            setAccessID={setAccessID}
            setUserSettings={setUserSettings}/>
        }

        {/*{isLogout &&
          <div id="logoutModal" className={``}>
            
            <div id="wrapper">
              <span id="exclaimation">!</span>
              <h2>Are you sure you wish to log out?</h2>

              <div id="options">
                <button className={`buttonDefault`} onClick={setLogout}>Cancel</button>
                <button className={`buttonDefault`} onClick={async()=> {
                  await logout().then(()=> {
                    navigate('/entry');
                  })
                }}>Log Out</button>
              </div>
              </div>
          </div>
        }*/}

        <SectionsWrapper current={current} 
                         setCurrent={setCurrent} 
                         log={log} 
                         setLog={setLog} />

        {(current.modal && current.section == 1) &&
          <CreatePost setCurrent={setCurrent}
                      current={current} 
                      socketMessage={socketMessage}
                      setSocketMessage={setSocketMessage} 
                      selectedDate={selectedDate}/>
        }
        {(current.modal && current.section == 0) &&
          <ManageConnections current={current} 
                             setCurrent={setCurrent} 
                             setSocketMessage={setSocketMessage}/>
        }

        {(current.modal && current.section == 2) &&
          <ManageMacros current={current} 
                        setCurrent={setCurrent} 
                        socketMessage={socketMessage}
                        setSocketMessage={setSocketMessage}/>
        }

        <ButtonBar cal={cal} 
                   current={current} 
                   setCurrent={setCurrent}
                   dateInView={dateInView}
                   set_dateInView={set_dateInView}
                   current={current}
                   setCurrent={setCurrent}
                   selectedDate={selectedDate}
                   setSelectedDate={setSelectedDate}
                   mapData={mapData}
                   setMapData={setMapData}/>

        {current.monthChart &&
          <MonthChart 
            setCurrent={setCurrent} 
            current={current}
            cal={cal} 
            set_dateInView={set_dateInView}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}/>
        }
        {current.map && 
          <MapComponent 
            current={current}
            log={log}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            cal={cal}/>
        }

          <Instant 
            socketMessage={socketMessage} 
            setSocketMessage={setSocketMessage}
            sendMessage={sendMessage}
            isActive={isActive}
            setActive={setActive}
            accessID={accessID}
            setAccessID={setAccessID}
            getUnreadCount={getUnreadCount}
          />
        
    </section>
  )
}









export default function Main() {

  /**
   * W e b  S o c k e t
   * A n d
   * N o t i f i c a t i o n s
   */
  const { authed } = useUIC();
  let userID = sessionStorage.getItem('userID');



  /***
   * S O C K E T  S T U F F
  ***/
  const [socketURL, setSocketURL] = React.useState(``);
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketURL);
  const [socketMessage, setSocketMessage] = React.useState({
    type: null,
    message: null
  });
  const [accessID, setAccessID] = React.useState({})
  const [isActive, setActive] = React.useState({
    type: null,   //type of popUp notif to appear
    state: null,  //set class for it to popUp 
  })
  /**
   * Connects to webSocket server upon verifying user log in
   * & gets unreadNotif count
   */
  React.useEffect(()=> {
    if(authed == true) {
      setSocketURL(`ws://172.19.185.143:3333/?${userID}`);
      getUnreadCount();
    }
  }, [authed])

  React.useEffect(()=> {
    getUnreadCount();
  }, [socketMessage])


  // need to implement reconnect redundancy here
  React.useEffect(() => { 
    if(readyState === ReadyState.OPEN) {
      console.log('Websocket connection established')
    } else if (readyState === ReadyState.CLOSED) {
      console.log('socket connection has closed')
    }
  }, [readyState])

  /**
   * when socket connection R E C I E V E S messages
   */
  useWebSocket(socketURL, {
    onMessage: (e)=> {
      let data = JSON.parse(e.data);
      let details;
      if(data.details) {
        details = JSON.parse(data.details)
      }
      console.log(data);

      // if(data.recipients.includes(userID) {
        //need to implement
      // })

      if(data.type == 'request' && data.message == 'initial') {
        setSocketMessage(data);
        setAccessID({
          ...accessID,
          accept: data.senderID,
          ignore: data.originalID,
        });
        setActive({
          type: 3,
          state: true
        })
        console.log(data);
        console.log(accessID);
      }
      else if (data.type == 'request' && data.message == 'accept') {
        setSocketMessage({
          senderUsername: data.senderUsername,
          type: 'request',
          message: 'accepted'
        });
        setActive({
          type: 1,
          state: true
        })
      }
      else if(data.type == 'comment' && data.message == 'initial-recieved') {
        setSocketMessage({
          senderUsername: data.senderUsername,
          type: 'comment',
          message: 'initial-recieved',
          postTitle: data.postTitle,
        });
        setActive({
          type: 2,
          state: true
        })
        // setAccessID({ postURL: data.postURL, notifID: data._id, commentID: details.commentID });
        setAccessID({ postURL: data.postURL, notifID: data._id });
        console.log(data);
      }
      else if(data.type == 'comment' && data.message == 'response-recieved') {
        setSocketMessage({
          senderUsername: data.senderUsername,
          type: 'comment',
          message: 'response-recieved',
          postTitle: data.postTitle,
        });
        setActive({
          type: 2,
          state: true
        })
        // setAccessID({ postURL: data.postURL, notifID: data._id, commentID: details.commentID });
        setAccessID({ postURL: data.postURL, notifID: data._id });
        console.log(data);
      }
      else if(data.type == 'tagging' && data.message == 'recieved') {
        setSocketMessage(data)
        setActive({
          type: 2,
          state: true
        })
        setAccessID({ postURL: data.url, notifID: data._id });
      }
    },
    shouldReconnect: (event) => true,
    reconnectAttempts: 10,
  })


  
  const cal = Calendar();
  const [current, setCurrent] = React.useState({
    home: true,
    section: null, //0, 1, 2, 3, 4
    social: false, //true, false or social
    monthChart: false, //true or false
    map: false,
    scrollTo: null,
    transition: false //for components mounted dependant on this stateVar, indicates before unmount
  });
  const hajime = new Date(),
      kyou = hajime.getDate(),
      kongetsu = hajime.getMonth(),
      kotoshi = hajime.getFullYear();
  const [selectedDate, setSelectedDate] = React.useState({
    day: null,
    month: null,
    year: null
  })

  const [mapData, setMapData] = React.useState({
    currentCity: 'NY',
    currentState: 'NYC'
  })


  let [initialLogin, setInitialLogin] = React.useState(true);
  if(initialLogin == true) {

    setCurrent({
        ...current,
        section: 1
    })
    setInitialLogin(false);
  }

  

  const [unreadCount, setUnreadCount] = React.useState('');
  /**
   * Fetches unread count of interactions on initial load
   * and when new interactions occur
   */
  let getUnreadCount = async() => {
    let count = await accessAPI.getInteractions('count');
    if(count < 10) {
      count = '0' + count;
    } else if (count > 99) {
      count = '99';
    }
    setUnreadCount(count);
  }


  /*
    Top level state array to house log of posts
    Changes whenever a new section becomes active
  */
  const [log, setLog] = React.useState([]);

  /*
      State array for keeping track of current section in carousel nav
      top level, so it's maintained across pages
  */
  const [navOptions, setNavOptions] = React.useState([
    {name: "Social", active: false, key: 1},
    {name: "User", active: true, key: 2}, //middle is default
    {name: "Macros", active: false, key: 3},
  ]);
  

  return(
        <Routes>

          <Route path="/" element={
              <HomeOrEntry>
                <Home 
                  // socket & notif stuff 
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  // socket & notif stuff
                  cal={cal}
                  current={current}
                  setCurrent={setCurrent}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}

                  mapData={mapData}
                  setMapData={setMapData}

                  log={log}
                  setLog={setLog}

                  navOptions={navOptions}
                  setNavOptions={setNavOptions}
                />
              </HomeOrEntry>
            }>
          </Route>

          <Route path="/entry" element={<Entry />} 
          />

          <Route path="/home" element={
              <HomeOrEntry>
                <Home 
                  // socket & notif stuff
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  // socket & notif stuff
                  cal={cal}
                  current={current}
                  setCurrent={setCurrent}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}

                  mapData={mapData}
                  setMapData={setMapData}

                  log={log}
                  setLog={setLog}

                  navOptions={navOptions}
                  setNavOptions={setNavOptions}
                />
              </HomeOrEntry>
            }>
          </Route>

          <Route path="/post/:postID" element={
              <HomeOrEntry>
                <Post 
                  // socket stuff
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  current={current}
                  setCurrent={setCurrent}
                 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </HomeOrEntry>
            } 
          />

          <Route path="/macros/:name" element={
              <HomeOrEntry>
                <Macrospage
                  // socket stuff
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  current={current}
                  setCurrent={setCurrent}
                  // socket stuff
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </HomeOrEntry>
            } 
          />
          <Route path="/user/:username" element={
            <HomeOrEntry>
              <UserProfile
                  // socket stuff
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  current={current}
                  setCurrent={setCurrent}
                  // socket stuff
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
              />
            </HomeOrEntry>
            }
          />

          <Route path="/settings" element={
              <HomeOrEntry>
                <UserSettings
                  setSocketMessage={setSocketMessage}
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  setAccessID={setAccessID}
                  accessID={accessID}
                  getUnreadCount={getUnreadCount}
                  current={current}
                  setCurrent={setCurrent}
                />
              </HomeOrEntry>
            }
          />
        </Routes>
  )
}

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element:  <HomeOrEntry> 
//                   <Entry 
//                     accessAPI={accessAPI}
//                     useAuth={useAuth}
//                   /> 
//               </HomeOrEntry>
//   },
//   {
//     path: "/entry",
//     element: <Entry />
//   },
//   {
//     path: "/home",
//     element: <HomeOrEntry> <Home /> </HomeOrEntry>
//   },
//   {
//     path: "/:user",
//     element: <HomeOrEntry> <Userpage /> </HomeOrEntry>
//   },
//   {
//     path: "/:blogpost",
//     element: <HomeOrEntry> <Blogpost /> </HomeOrEntry>
//   },
//   {
//     path: "/:username/:collectionName",
//     element: <HomeOrEntry> <Collection /> </HomeOrEntry>
//   },
//   {
//     path: "/group/:groupname",
//     element: <HomeOrEntry> <GroupPage /> </HomeOrEntry>
//   },
//   {
//     path: "/tag/:tagname",
//     element: <HomeOrEntry> <TagPage /> </HomeOrEntry>
//   },
//   {
//     path: "/global",
//     element: <HomeOrEntry> <Global /> </HomeOrEntry>
//   },
//   {
//     path: "/about",
//     element: <About />
//   },
//   {
//     path: "/error",
//     element: <ErrorPage />
//   }
// ])
