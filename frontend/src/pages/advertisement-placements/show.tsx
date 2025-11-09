import { useShow, useOne } from '@refinedev/core';
import { Show, TextField, DateField, BooleanField, NumberField } from '@refinedev/antd';
import { Typography } from 'antd';

const { Title } = Typography;

export const AdvertisementPlacementShow = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Advertisement ID</Title>
      <TextField value={record?.advertisement_id} />

      <Title level={5}>Placement ID</Title>
      <TextField value={record?.placement_id} />

      <Title level={5}>Ad Format</Title>
      <NumberField value={record?.ad_format} />

      <Title level={5}>Action</Title>
      <NumberField value={record?.action} />

      <Title level={5}>Min Level</Title>
      <NumberField value={record?.min_level} />

      <Title level={5}>Time Between</Title>
      <NumberField value={record?.time_between} />

      <Title level={5}>Show Loading</Title>
      <BooleanField value={record?.show_loading} />

      <Title level={5}>Time Out</Title>
      <NumberField value={record?.time_out} />

      <Title level={5}>Retry</Title>
      <NumberField value={record?.retry} />

      <Title level={5}>Show Ad Notice</Title>
      <BooleanField value={record?.show_ad_notice} />

      <Title level={5}>Delay Time</Title>
      <NumberField value={record?.delay_time} />

      <Title level={5}>Custom Ad Unit ID</Title>
      <TextField value={record?.custom_ad_unit_id || 'Not set'} />

      <Title level={5}>Created</Title>
      <DateField value={record?.created} format="LLL" />

      <Title level={5}>Updated</Title>
      <DateField value={record?.updated} format="LLL" />
    </Show>
  );
};
