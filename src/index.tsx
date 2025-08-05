import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import ru from 'antd/locale/ru_RU';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import dayjs from 'dayjs';
import ruLocale from 'dayjs/locale/ru';

dayjs.extend(isLeapYear);
dayjs.locale(ruLocale);

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
