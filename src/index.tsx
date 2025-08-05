import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import ru from 'antd/locale/ru_RU';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import dayjs from 'dayjs';

dayjs.extend(isLeapYear);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ConfigProvider locale={ru}>
        <App />
      </ConfigProvider>
    </React.StrictMode>,
  );
}
