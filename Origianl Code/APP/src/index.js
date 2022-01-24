import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';
import {Provider} from "react-redux";
import store from "./store/store";
import App from './App';
import Loading from './components/Loading';

ReactDOM.render(
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <Suspense fallback={<Loading />}>
                    <App/>
                </Suspense>
            </I18nextProvider>
        </Provider>,
    document.getElementById('root')
);
