/* * * B a s e  L a y e r * * */
import React from 'react';
import ReactDOM from 'react-dom/client';
import {useNavigate} from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation
} from "react-router-dom";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import { UIContextProvider, useUIC } from './UIcontext';
import APIaccess from './apiaccess';
import CalInfo from './components/calInfo'
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
import Macrospage from './components/macrospage/macrospage';
import Post from './components/blog/post';
import Instant from './components/notifs/instant';
import UserSettings from './components/base/userSettings';
import UserProfile from './components/base/userProfile';
import AboutPage from './components/base/aboutPage';

/*** Sub Sections ***/
import { CreatePost } from './components/sections/userLog';
import { ManageConnections } from './components/sections/socialLog';
import { ManageMacros } from './components/sections/macros';
import Calendar from './components/calendar/calendar';
import MapComponent from './components/map/map';
import { MapPage } from './components/map/map';
import DragSlider from './components/base/dragSlider';
import './components/sections/sections.css';
import CustomLogEditor from './components/base/customLogEditor/customLogEditor';


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
  userDocumentSettings,
  setUserDocumentSettings,
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
  setNavOptions,
  tags,
  setTags,
  userTopics,
  setUserTopics
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
    getUnreadCount();
    if(element) {
      setEnter();
    }
  }, [element]);

  React.useEffect(()=> {
      let topics = sessionStorage.getItem('topicsAsString');
      topics = topics.split(', ');
      setUserTopics(topics);

      document.title = 'Syncseq.xyz/home'
  }, [])


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
  // console.log(userDocumentSettings);

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

        <SectionsWrapper current={current} 
                         setCurrent={setCurrent} 
                         log={log} 
                         setLog={setLog}
                         tags={tags}
                         setTags={setTags}
                         userTopics={userTopics}
                         setUserTopics={setUserTopics} />

        {(!current.map &&( current.modal && current.section == 1)) &&
          <CreatePost setCurrent={setCurrent}
                      current={current} 
                      socketMessage={socketMessage}
                      setSocketMessage={setSocketMessage} 
                      selectedDate={selectedDate}/>
        }
        {(!current.map &&( current.modal && current.section == 0)) &&
          <ManageConnections current={current} 
                             setCurrent={setCurrent} 
                             setSocketMessage={setSocketMessage}/>
        }

        {(!current.map &&( current.modal && current.section == 2)) &&
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

        {current.gallery.length > 0 &&
          <DragSlider current={current} setCurrent={setCurrent} siteLocation={'home'}/>
        }
        {/*<DragSlider current={current} setCurrent={setCurrent} />*/}


        {current.calendar &&
          <Calendar 
            setCurrent={setCurrent} 
            current={current}
            cal={cal} 
            set_dateInView={set_dateInView}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}/>
        }
        {current.map && 
          <MapComponent 
            setCurrent={setCurrent}
            current={current}
            log={log}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            cal={cal}
            setSocketMessage={setSocketMessage}
            userDocumentSettings={userDocumentSettings}
            setUserDocumentSettings={setUserDocumentSettings}/>
        }
        {current.customizer &&
          <CustomLogEditor
            current={current}
            setCurrent={setCurrent} 
            setSocketMessage={setSocketMessage}
            socketMessage={setSocketMessage}
          />
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
  const { authed, userDocumentSettings, setUserDocumentSettings } = useUIC();
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

      if(data.type == 'request' && data.message == 'connectionRequestRecieved') {
        setSocketMessage(data);
        setAccessID({
          ...accessID,
          accept: data.senderID,
          notifID: data.originalID,
        });
        setActive({
          type: 3,
          state: true
        })
        console.log(data);
        console.log(accessID);
      }

      else if (data.type == 'request' && data.message == 'connectionAcceptedRecieved') {
        setSocketMessage({
          senderUsername: data.senderUsername,
          type: 'request',
          message: 'connectionAcceptedRecieved'
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

      else if(data.type == 'request' && data.message == 'subscriptionRequestRecieved') {
        setSocketMessage({
          //create text in instants for subscription request notif
          //need requester username, message type and message...
          senderUsername: data.senderUsername,
          message: 'subscriptionRequestRecieved',
          type: 'request',
          data: data
        })

        setAccessID({
          ...accessID,
          accept: data.senderID,
          notifID: data.originalID,
        });

        setActive({
          type: 3,
          state: true
        })
      }

      else if(data.type == 'request' && data.message == 'subscriptionAccepted') {
        setSocketMessage({
          //create text in instants for subscription request notif
          //need requester username, message type and message...
          senderUsername: data.senderUsername,
          message: 'subscriptionAccepted',
          type: 'request'
        })

        setAccessID({
          ...accessID,
          accept: data.senderID,
          notifID: data.originalID,
        });

        setActive({
          type: 1,
          state: true
        })
      }

      else if(data.type == 'request' && data.message == 'subscribed') {
        setSocketMessage({
          //create text in instants for subscription request notif
          //need requester username, message type and message...
          senderUsername: data.senderUsername,
          message: 'subscribed',
          type: 'request'
        })

        setAccessID({
          ...accessID,
          accept: data.senderID,
          notifID: data.originalID,
        });

        setActive({
          type: 1,
          state: true
        })
      }

      else if(data.type == 'updateNotifs') {
        getUnreadCount();

        setSocketMessage({
          type: 'simpleNotif',
          message: `New notifications!`
        })
      }
    },
    shouldReconnect: (event) => true,
    reconnectAttempts: 10,
  })

  
  const cal = CalInfo();
  const [current, setCurrent] = React.useState({
    section: null, //0, 1, 2, 3, 4
    social: false, //true, false or social
    calendar: false, //true or false
    map: false,
    scrollTo: null,
    currentLog: null,
    modal: false, //for <UserProfile>, when user leaves page via a fullList, ensures modal is still up
    customizer: false,
    transition: false, //for components mounted dependant on this stateVar, indicates before unmount
    gallery: [], //for dragslider. should be an array of links
    log: 0
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

  React.useEffect(()=> {
    getUnreadCount();
  }, [socketMessage])

  /*
    Top level state array to house log of posts
    Changes whenever a new section becomes active
  */
  const [log, setLog] = React.useState([]);


  /* Top Level state for tags */
  const [tags, setTags] = React.useState([]);

  /*
    For macrospage to discern whether a user already has a topic saved to their profile
  */
  const [userTopics, setUserTopics] = React.useState([]);

  /*
      State array for keeping track of current section in carousel nav
      top level, so it's maintained across pages
  */
  const [navOptions, setNavOptions] = React.useState([
    {name: "Social", active: false, key: 1},
    {name: "User", active: true, key: 2}, //middle is default
    {name: "Macros", active: false, key: 3},
  ]);
  

  const routerObject = createBrowserRouter([
    
    // E N T R Y 
    { 
      path: "/entry",
      element: <Entry />
    },
    // R O O T
    {
      path: "/",
      element:
        <HomeOrEntry>
          <Home 
                  userDocumentSettings={userDocumentSettings}
                  setUserDocumentSettings={setUserDocumentSettings} 
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
                  tags={tags}
                  setTags={setTags}
                  userTopics={userTopics}
                  setUserTopics={setUserTopics}

                  navOptions={navOptions}
                  setNavOptions={setNavOptions}
          />
        </HomeOrEntry>
      ,
    },
    // H O M E
    {
      path: '/home',
      element:
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
                  tags={tags}
                  setTags={setTags}
                  userTopics={userTopics}
                  setUserTopics={setUserTopics}

                  navOptions={navOptions}
                  setNavOptions={setNavOptions}
            />
        </HomeOrEntry>
    },
    // P O S T
    {
      path: '/post/:postID',
      loader: async({ params }) => {
        let request = await accessAPI.getBlogPost(params.postID);
        return request;
      },
      element:
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
    },
    //M A C R O S P A G E
    {
      path: '/macros/:macroname/:macroid',
      loader: async({ params }) => {
        let macroInfo = await accessAPI.getTagData(params.macroid, params.macroname);
        let macroPosts = await accessAPI.groupPosts({action: 'getPosts', groupID: params.macroid, groupName: params.macroname});
         
        let doesHaveAccess;
        if(macroInfo.response == 'topic') {
          macroInfo.userHasAccess = macroInfo.hasAccess;
          // macroInfo._id = 'topic';
        }
        // else if(macroInfo.hasAccess) {
        else {
          doesHaveAccess = macroInfo.hasAccess.filter(el => el == userID);
          doesHaveAccess = doesHaveAccess.length > 0 ? true : false;
          macroInfo.userHasAccess = doesHaveAccess;
        }
         
        macroInfo.name = macroInfo.name ? macroInfo.name : params.macroname;
        macroInfo.ownerUsername = macroInfo.adminUsernames ? macroInfo.adminUsernames[0] : null;
        macroInfo.ownerID = macroInfo.admins ? macroInfo.admins[0] : null;
        macroInfo.type = macroInfo.type == undefined ? 'topic' : macroInfo.type;
        macroInfo.userCount = macroInfo.hasAccess ? macroInfo.hasAccess.length : null;
        macroInfo.postCount = macroPosts.length ? macroPosts.length : 0

        return {macroInfo, macroPosts}
      },
      element: 
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
                  tags={tags}
                  setTags={setTags}
                  userTopics={userTopics}
                  setUserTopics={setUserTopics}
          />
        </HomeOrEntry>
    },
    //U S E R  P R O F I L E
    {
      path: '/user/:username/:userid',
      loader: async({ params }) => {
        let data = await accessAPI.getSingleUser(params.userid);
        return data;
      },
      element: 
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
    },
    //U S E R  S E T T I N G S
    {
      path: '/:username/settings',
      loader: async({ params }) => {
        let data = await accessAPI.userSettings({option: 'getUserSettings'});
        return data;
      },
      element: 
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
    },
    //A B O U T 
    {
      path: '/about',
      loader: async({ params }) => {
        let data = await accessAPI.getProjectPublicStats();
        return data;
      },
      element: 
        <AboutPage />
    }
  ])

  return (
      <UIContextProvider>
        <RouterProvider router={routerObject} />
      </UIContextProvider>
    )
}

