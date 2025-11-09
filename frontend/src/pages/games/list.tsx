import {
  useTranslate,
  useNavigation,
  useCreate,
  type HttpError,
  getDefaultFilter,
} from '@refinedev/core';
import { CreateButton } from '@refinedev/antd';

import { List, useTable, DateField, FilterDropdown } from '@refinedev/antd';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Input, Typography, theme, Button } from 'antd';
import { useState } from 'react';

import type { IGame, IGameFilterVariables } from '../../interfaces';
import { GameActions } from '../../components/gameActions';

export const GameList = () => {
  const { token } = theme.useToken();
  const [gameIdFilter, setGameIdFilter] = useState('');

  const { tableProps, filters, setFilters } = useTable<IGame, HttpError, IGameFilterVariables>({
    resource: 'games',
    filters: {
      initial: [
        {
          field: 'game_id',
          operator: 'contains',
          value: gameIdFilter,
        },
      ],
    },
  });

  const t = useTranslate();
  const { show } = useNavigation();

  const handleGameIdFilterChange = (value: string) => {
    setGameIdFilter(value);
    setFilters([
      {
        field: 'game_id',
        operator: 'contains',
        value: value || undefined,
      },
    ]);
  };

  return (
    <List
      headerButtons={[
        <Input
          key="game_id-filter"
          placeholder={t('games.filter.game_id.placeholder')}
          prefix={<SearchOutlined />}
          value={gameIdFilter}
          onChange={e => handleGameIdFilterChange(e.target.value)}
          style={{ width: 250, marginRight: 8 }}
          allowClear
        />,
        <CreateButton key="create" />,
      ]}
    >
      <Table
        {...tableProps}
        rowKey="id"
        style={{
          cursor: 'pointer',
        }}
        onRow={record => {
          return {
            onClick: () => {
              show('games', record.id);
            },
          };
        }}
      >
        <Table.Column key="game_id" dataIndex="game_id" title={t('games.fields.game_id')} />
        <Table.Column
          key="created"
          dataIndex="created"
          title={t('games.fields.created')}
          render={value => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 1 }}
        />
        <Table.Column<IGame>
          fixed="right"
          title={t('table.actions')}
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_, record) => <GameActions record={record} />}
        />
      </Table>
    </List>
  );
};
