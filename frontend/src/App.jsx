import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import AuthInitializer from './components/common/AuthInitializer';
import { ToastProvider } from './context/ToastContext';
import { ShopDataProvider } from './context/ShopDataContext';
import { ModalProvider } from './context/ModalContext';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <ToastProvider>
            <ModalProvider>
              <ShopDataProvider>
                <AppRoutes />
              </ShopDataProvider>
            </ModalProvider>
          </ToastProvider>
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

