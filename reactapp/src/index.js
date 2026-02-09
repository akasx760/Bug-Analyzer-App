import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Handle from './Today/Handle';
import Handle, { Classcomponent } from './Today/Classcomponent';
import Functionalcomponent from './Today/Functionalcomponent';
import Parent from './Today/Parent';
import ListandKey from './Today/ListandKey';
import Css from './Today/Css';
import LoginPage from './Today/LoginPage';
import Effect from './Today/Effect';
import Ref from './Today/Ref';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Handle/> */}
    {/* <Classcomponent/> */}
    {/* <Functionalcomponent/> */}
    {/* <Parent/> */}
    {/* <ListandKey/> */}
    {/* <Css/> */}
    {/* <LoginPage/> */}
    {/* <Effect/> */}
    {/* <Ref/> */}
    <App/>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
