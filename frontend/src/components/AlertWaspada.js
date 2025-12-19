import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import './AlertWaspada.css'; // Panggil CSS-nya

const AlertWaspada = () => {
  return (
    <div className="alert-waspada">
      <div className="alert-header">
        <ExclamationTriangleIcon className="alert-icon" />
        <h3 className="alert-title">WASPADA PENIPUAN!</h3>
      </div>
      <p className="alert-desc">
        Seluruh layanan Lost & Found UMY adalah <strong>100% GRATIS</strong>. Kami tidak pernah meminta biaya administrasi.
      </p>
      <div className="alert-highlight">Abaikan pihak yang meminta transfer uang!</div>
    </div>
  );
};

export default AlertWaspada;