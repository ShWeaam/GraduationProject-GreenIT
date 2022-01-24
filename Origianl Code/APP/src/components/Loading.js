import React from 'react';
import src from '../media/loading.svg';

export default function Loading() {
    return (
        <div className="loading">
            <img src={src} className="loading-icon" />
        </div>
    );
}