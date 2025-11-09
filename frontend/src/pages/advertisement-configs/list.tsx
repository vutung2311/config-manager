import { useTranslate, useNavigation, type HttpError } from '@refinedev/core';
import { CreateButton } from '@refinedev/antd';

import { List, useTable, DateField } from '@refinedev/antd';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Input, theme } from 'antd';
import { useState } from 'react';

import type { IAdvertisementConfig, IAdvertisementConfigFilterVariables } from '../../interfaces';

export const AdvertisementConfigList = () => {
  const { token } = theme.useToken();
  const [nameFilter, setNameFilter] = useState('');

  const { tableProps, filters, setFilters } = useTable<
    IAdvertisementConfig,
    HttpError,
    IAdvertisementConfigFilterVariables
  >({
    resource: 'advertisement_configs',
    filters: {
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: nameFilter,
        },
      ],
    },
  });

  const t = useTranslate();
  const { show } = useNavigation();

  const handleNameFilterChange = (value: string) => {
    setNameFilter(value);
    setFilters([
      {
        field: 'name',
        operator: 'contains',
        value: value || undefined,
      },
    ]);
  };

  return (
    <List
      headerButtons={[
        <Input
          key="name-filter"
          placeholder={t('advertisement_configs.filter.name.placeholder')}
          prefix={<SearchOutlined />}
          value={nameFilter}
          onChange={e => handleNameFilterChange(e.target.value)}
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
              show('advertisement_configs', record.id);
            },
          };
        }}
      >
        <Table.Column key="name" dataIndex="name" title={t('advertisement_configs.fields.name')} />
        <Table.Column
          key="experiment_id"
          dataIndex="experiment_id"
          title={t('advertisement_configs.fields.experiment_id')}
        />
        <Table.Column
          key="game_id"
          dataIndex="game_id"
          title={t('advertisement_configs.fields.game_id')}
          render={value => (Array.isArray(value) ? value.join(', ') : value)}
        />
        <Table.Column
          key="created"
          dataIndex="created"
          title={t('advertisement_configs.fields.created')}
          render={value => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 1 }}
        />
        <Table.Column
          key="updated"
          dataIndex="updated"
          title={t('advertisement_configs.fields.updated')}
          render={value => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 1 }}
        />
      </Table>
    </List>
  );
};
