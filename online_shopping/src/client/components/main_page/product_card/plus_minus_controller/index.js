import React from 'react';
import { Button } from 'antd';

const PlusMinusControl = ({count, setCount}) => {

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button onClick={() => setCount(count => (count - 1))}>-</Button>
      <div style={{ margin: '0 10px' }}>{count}</div>
      <Button onClick={() => setCount(count => (count + 1))}>+</Button>
    </div>
  );
};

export default PlusMinusControl;
