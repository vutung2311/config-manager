import { useList } from '@refinedev/core';
import { Typography, Spin } from 'antd';
import React from 'react';
import type { IGame } from '../../interfaces';

export const GamesCount: React.FC = () => {
  const { query } = useList<IGame>({
    resource: 'games',
    pagination: {
      pageSize: 1, // We only need the total count, not the actual data
    },
  });

  const { data, isLoading } = query;

  const totalGames = data?.total || 0;

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
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <Typography.Title level={1} style={{ margin: 0, color: '#52c41a' }}>
            {totalGames}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
            Total Games
          </Typography.Text>
        </>
      )}
    </div>
  );
};
