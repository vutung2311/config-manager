import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Switch, InputNumber, Select } from 'antd';

export const AdvertisementPlacementEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  const { selectProps: advertisementSelectProps } = useSelect({
    resource: 'advertisement_configs',
    optionLabel: 'name',
    optionValue: 'id',
  });

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
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Advertisement Config"
          name="advertisement_id"
          rules={[{ required: true, message: 'Advertisement config is required' }]}
        >
          <Select {...advertisementSelectProps} />
        </Form.Item>

        <Form.Item
          label="Placement ID"
          name="placement_id"
          rules={[{ required: true, message: 'Placement ID is required' }]}
        >
          <Select placeholder="Select a placement">
            {placementOptions.map(option => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Data"
          name="data"
          rules={[{ required: true, message: 'Data is required' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter JSON data" />
        </Form.Item>

        <Form.Item label="Ad Format" name="ad_format">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Action" name="action">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Min Level" name="min_level">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Time Between" name="time_between">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Show Loading" name="show_loading" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Time Out" name="time_out">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Retry" name="retry">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Show Ad Notice" name="show_ad_notice" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Delay Time" name="delay_time">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Custom Ad Unit ID" name="custom_ad_unit_id">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
