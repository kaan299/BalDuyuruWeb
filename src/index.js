import React, {Suspense} from "react";
import "./assets/scss/style.scss";
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Loader from "./layouts/loader/Loader";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Suspense fallback={<Loader/>}>
        <App/>
    </Suspense>
);

reportWebVitals();
