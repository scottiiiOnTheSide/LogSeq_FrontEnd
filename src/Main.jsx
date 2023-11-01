/* * * B a s e  L a y e r * * */
import React from 'react';
import ReactDOM from 'react-dom/client';
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
import useAuth from "./useAuth";
import Calendar from './components/calendar'

import './Main.css';
import './components/home/home.css';

/* * * C o m p o n e n t s * * */
import Entry from './components/entry/entry';
import Header from './components/home/header';
import InteractionsList from './components/instants/interactionsList';
import CarouselNav from './components/home/carouselNav';
import ButtonBar from './components/home/buttonBar';
import SectionsWrapper from './components/sections/sectionsWrapper';
import Post from './components/blog/post';
import Instant from './components/instants/instant'

/*** Sub Sections ***/
import { CreatePost } from './components/sections/userLog';
import { ManageConnections } from './components/sections/socialLog';
import './components/sections/sections.css';


/* * * I n i t i a l i z e * * */
const accessAPI = APIaccess();




/* * * Supporting Functions * * */
function HomeOrEntry({ children }) {

  const { authed } = useAuth();
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
  setUnreadCount
}) {

  const cal = Calendar();
  const [currentSection, setSection] = React.useState(2); //default setting
  const [notifList, setNotifList] = React.useReducer(state => !state, false);
  // const [unreadCount, setUnreadCount] = React.useState(2);
  // const [socketMessage, setSocketMessage] = React.useState({});
  const [modal, setModal] = React.useReducer(state => !state, false);
  const isPost = false;

  /**
   * 10. 08. 2023
   * Make it so USER section is only default on initial load - chosen section
   * should be preserved on refresh
   */

  return (
    <section id="HOME">  
        <Header cal={cal} isPost={isPost} setNotifList={setNotifList} unreadCount={unreadCount}/>
        <CarouselNav currentSection={currentSection} setSection={setSection}/>

        {notifList &&
          <InteractionsList 
            setNotifList={setNotifList} 
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
            setSocketMessage={setSocketMessage}
            socketMessage={socketMessage}/>
        }

        <Outlet />

        <SectionsWrapper currentSection={currentSection} setModal={setModal} modal={modal}/>

        {(modal && currentSection == 2) &&
          <CreatePost setModal={setModal} setSocketMessage={setSocketMessage}/>
        }
        {(modal && currentSection == 1) &&
          <ManageConnections setModal={setModal} setSocketMessage={setSocketMessage}/>
        }

        <ButtonBar cal={cal} modal={modal} setModal={setModal} currentSection={currentSection}/>

          <Instant 
            socketMessage={socketMessage} 
            setSocketMessage={setSocketMessage}
            sendMessage={sendMessage}
            isActive={isActive}
            setActive={setActive}
            accessID={accessID}
            setAccessID={setAccessID}
          />
        
    </section>
  )
}

export default function Main() {

  /**
   * 10. 12. 2023
   * Can move stateVar for all interactions + webSocket connection & functions
   * inside here, so that all individual pages have access
   */

  let userID = sessionStorage.getItem('userID');
  const [socketURL, setSocketURL] = React.useState(``);
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketURL);
  const [socketMessage, setSocketMessage] = React.useState({});
  const [accessID, setAccessID] = React.useState({})
  const [isActive, setActive] = React.useState({
    type: null,   //type of popUp notif to appear
    state: null,  //set class for it to popUp
  })
  const [unreadCount, setUnreadCount] = React.useState('');  

  /**
   * Connects to webSocket server upon verifying user log in
   */
  const { authed } = useAuth();
  React.useEffect(()=> {
    if(authed == true) {
      setSocketURL(`ws://192.168.1.176:3333/?${userID}`);
    }
  }, [authed])


  // Might leave this ...
  // could possibly implement reconnect redundancy here
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
          postTitle: data.postTitle
        });
        setActive({
          type: 2,
          state: true
        })
        setAccessID({ postURL: data.postURL });
      }
      else if(data.type == 'tagging' && data.message == 'recieved') {
        setSocketMessage(data)
        setActive({
          type: 2,
          state: true
        })
        setAccessID({ postURL: data.postURL });
      }
    }
  })


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
  }, [])
  React.useEffect(()=> {
    getUnreadCount();
  }, [socketMessage])


  /**
   * 10. 25. 2023
   * sendMessage, socketMessage, setSocketMessage, isActive, setActive, accessID, setAccessID
   * all need to be passed down to each page's <Instant> component
   */
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
                lastMessage={lastMessage}
                // socket & notif stuff
              />
            </HomeOrEntry>
          } 
        />

        <Route path="/entry" element={<Entry/>} 
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
                lastMessage={lastMessage}
                // socket & notif stuff
              />
            </HomeOrEntry>
          }
        />

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
                lastMessage={lastMessage}
                // socket stuff
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
//     path: "/user/:username/settings",
//     element: <HomeOrEntry> <UserSetting /> </HomeOrEntry>
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