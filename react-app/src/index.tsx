import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store/store';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Toaster/>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
