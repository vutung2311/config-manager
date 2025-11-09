import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';

export const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        minHeight: '200px',
      }}
    >
      <Typography.Title level={1} style={{ margin: 0, color: '#1890ff' }}>
        {formattedTime}
      </Typography.Title>
    </div>
  );
};
