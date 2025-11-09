import { useShow, useOne } from '@refinedev/core';
import { Show, TextField, DateField, BooleanField, NumberField } from '@refinedev/antd';
import { Typography } from 'antd';

const { Title } = Typography;

export const AdvertisementConfigShow = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Name</Title>
      <TextField value={record?.name} />

      <Title level={5}>Experiment ID</Title>
      <TextField value={record?.experiment_id} />

      <Title level={5}>Game ID</Title>
      <TextField
        value={Array.isArray(record?.game_id) ? record.game_id.join(', ') : record?.game_id}
      />

      <Title level={5}>Banner Ad Unit ID</Title>
      <TextField value={record?.banner_ad_unit_id || 'Not set'} />

      <Title level={5}>Interstitial Ad Unit ID</Title>
      <TextField value={record?.interstitial_ad_unit_id || 'Not set'} />

      <Title level={5}>Rewarded Ad Unit ID</Title>
      <TextField value={record?.rewarded_ad_unit_id || 'Not set'} />

      <Title level={5}>Auto Hide Banner</Title>
      <BooleanField value={record?.auto_hide_banner} />

      <Title level={5}>Banner Position</Title>
      <NumberField value={record?.banner_position} />

      <Title level={5}>Banner Refresh Rate</Title>
      <NumberField value={record?.banner_refresh_rate} />

      <Title level={5}>Banner Memory Threshold</Title>
      <NumberField value={record?.banner_memory_threshold} />

      <Title level={5}>Destroy Banner on Low Memory</Title>
      <BooleanField value={record?.destroy_banner_on_low_memory} />

      <Title level={5}>Preload Interstitial</Title>
      <BooleanField value={record?.preload_interstitial} />

      <Title level={5}>Preload Rewarded</Title>
      <BooleanField value={record?.preload_rewarded} />

      <Title level={5}>Enable Consent Flow</Title>
      <BooleanField value={record?.enable_consent_flow} />

      <Title level={5}>Created</Title>
      <DateField value={record?.created} format="LLL" />

      <Title level={5}>Updated</Title>
      <DateField value={record?.updated} format="LLL" />
    </Show>
  );
};
