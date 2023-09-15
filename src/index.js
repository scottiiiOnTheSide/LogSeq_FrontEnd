import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import './index.css';
import { APIaccess } from './apiaccess';
import { useAuth, AuthProvider } from './useAuth';

/**
 * If user is logged in, go to intended route.
 * otherwise? go to login page
 */
function HomeOrEntry({ children }) {

  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? ( children ) : <Navigate to="/login" replace state={{ path: location.pathname }} />
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeOrEntry> <Entry /> </HomeOrEntry>
  },
  {
    path: "/entry",
    element: <Entry />
  },
  {
    path: "/home",
    element: <HomeOrEntry> <Home /> </HomeOrEntry>
  },
  {
    path: "/:user",
    element: <HomeOrEntry> <Userpage /> </HomeOrEntry>
  },
  {
    path: "/:blogpost",
    element: <HomeOrEntry> <Blogpost /> </HomeOrEntry>
  },
  {
    path: "/user/:username/settings",
    element: <HomeOrEntry> <UserSetting /> </HomeOrEntry>
  },
  {
    path: "/:username/:collectionName",
    element: <HomeOrEntry> <Collection /> </HomeOrEntry>
  },
  {
    path: "/group/:groupname",
    element: <HomeOrEntry> <GroupPage /> </HomeOrEntry>
  },
  {
    path: "/tag/:tagname",
    element: <HomeOrEntry> <TagPage /> </HomeOrEntry>
  },
  {
    path: "/global",
    element: <HomeOrEntry> <Global /> </HomeOrEntry>
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/error",
    element: <ErrorPage />
  }
])

const apiAddr = "http://172.19.185.143:3333";
const accessAPI = APIaccess(apiAddr);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
