import React from 'react';
import './index.css';
import('./utils/log').then(({ log }) => {
    log('Hello World from your main file!');
});
console.log('Hello World from your main file!');
