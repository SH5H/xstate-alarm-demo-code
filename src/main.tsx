import React from 'react';
import ReactDOM from 'react-dom/client';
// 기본
import App1 from './AppWithUseState/App';
// 머신만 사용
import App2 from './AppWithMachine/App';
// Actor 사용
import App3 from './AppWithActor/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <App1 /> */}
    {/* <App2 /> */}
    <App3 />
  </React.StrictMode>,
);
