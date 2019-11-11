import React, { useState } from 'react';
import TextField from 'components/Textfield';
import styles from './tasks.scss';


const InlineTaskCreationField = ({ onCreate }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className={styles.inlineFieldContainer}>
      <TextField
        transparent
        controlled
        placeholder={'New task'}
        value={inputValue}
        onChange={setInputValue}
        onCancel={() => setInputValue('')}
        className={styles.inlineField}
        onEnter={(e) => {
          onCreate(inputValue);
          setInputValue('');
          e.preventDefault();
        }}
      />
    </div>
  );
};

export default InlineTaskCreationField;
