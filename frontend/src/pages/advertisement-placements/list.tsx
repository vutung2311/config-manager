import { useTranslate, useNavigation, type HttpError } from '@refinedev/core';
import { CreateButton } from '@refinedev/antd';

import { List, useTable, DateField } from '@refinedev/antd';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Input, theme, Select } from 'antd';
import { useState } from 'react';

import type {
  IAdvertisementPlacement,
  IAdvertisementPlacementFilterVariables,
} from '../../interfaces';

export const AdvertisementPlacementList = () => {
  const { token } = theme.useToken();
  const [placementIdFilter, setPlacementIdFilter] = useState('');

  const { tableProps, filters, setFilters } = useTable<
    IAdvertisementPlacement,
    HttpError,
    IAdvertisementPlacementFilterVariables
  >({
    resource: 'advertisements_placements',
    filters: {
      initial: [
        {
          field: 'placement_id',
          operator: 'eq',
          value: placementIdFilter,
        },
      ],
    },
  });

  const t = useTranslate();
  const { show } = useNavigation();

  const handlePlacementIdFilterChange = (value: string) => {
    setPlacementIdFilter(value);
    setFilters([
      {
        field: 'placement_id',
        operator: 'eq',
        value: value || undefined,
      },
    ]);
  };

  const placementOptions = [
    'AppReady',
    'LevelStart',
    'Button/Undo/Click',
    'Button/Hint/Click',
    'Button/Shuffle/Click',
    'Button/Revive/Click',
    'LevelProgress_50',
    'Screen/NoMoreMove/Open',
    'Screen/LevelComplete/Open',
  ];

  return (
    <List
      headerButtons={[
        <Select
          key="placement_id-filter"
          placeholder={t('advertisement_placements.filter.placement_id.placeholder')}
          value={placementIdFilter}
          onChange={handlePlacementIdFilterChange}
          style={{ width: 250, marginRight: 8 }}
          allowClear
        >
          {placementOptions.map(option => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>,
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
              show('advertisements_placements', record.id);
            },
          };
        }}
      >
        <Table.Column
          key="advertisement_id"
          dataIndex="advertisement_id"
          title={t('advertisement_placements.fields.advertisement_id')}
        />
        <Table.Column
          key="placement_id"
          dataIndex="placement_id"
          title={t('advertisement_placements.fields.placement_id')}
        />
        <Table.Column
          key="ad_format"
          dataIndex="ad_format"
          title={t('advertisement_placements.fields.ad_format')}
        />
        <Table.Column
          key="action"
          dataIndex="action"
          title={t('advertisement_placements.fields.action')}
        />
        <Table.Column
          key="min_level"
          dataIndex="min_level"
          title={t('advertisement_placements.fields.min_level')}
        />
        <Table.Column
          key="show_loading"
          dataIndex="show_loading"
          title={t('advertisement_placements.fields.show_loading')}
          render={value => (value ? 'Yes' : 'No')}
        />
        <Table.Column
          key="created"
          dataIndex="created"
          title={t('advertisement_placements.fields.created')}
          render={value => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 1 }}
        />
        <Table.Column
          key="updated"
          dataIndex="updated"
          title={t('advertisement_placements.fields.updated')}
          render={value => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 1 }}
        />
      </Table>
    </List>
  );
};
