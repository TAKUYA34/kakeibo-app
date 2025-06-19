import React from 'react';
import styles from '../../styles/TransactionStatic/TransactionAdd.module.css';
import { useLocation } from 'react-router-dom';

const TransactionAdd = () => {

  const location = useLocation();

  return (
    <p>こんにちは、{location.pathname}ページへようこそ！</p>
  );
};

export default TransactionAdd;