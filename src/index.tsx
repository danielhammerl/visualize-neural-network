import 'regenerator-runtime';
import React from 'react';
import ReactDOM from 'react-dom';

const Shell = () => {
    return (
        <h1>Hello world</h1>
    );
};

window.onload = () => {
    ReactDOM.render(<Shell />, document.getElementById('root'));
};
