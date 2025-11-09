import React from 'react';
import { Form, Input, Switch, InputNumber, Select, DatePicker } from 'antd';
import TextArea from 'antd/es/input/TextArea';

// Define the field types based on PocketBase field types
export interface DynamicField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  system: boolean;
  hidden: boolean;
  // Text field properties
  pattern?: string;
  patternMessage?: string;
  min?: number;
  max?: number;
  // Number field properties
  onlyInt?: boolean;
  // Select field properties
  values?: string[];
  maxSelect?: number;
  // Additional properties that might be present in different field types
  [key: string]: unknown;
}

interface DynamicFormProps {
  fields: DynamicField[];
  formProps?: Record<string, unknown>;
  layout?: 'vertical' | 'horizontal';
}

// Map PocketBase field types to Ant Design components
const renderField = (field: DynamicField) => {
  const commonProps = {
    name: field.name,
    label: field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/_/g, ' '),
    rules: field.required ? [{ required: true, message: `${field.name} is required` }] : [],
  };

  // Skip system and hidden fields (like id, created, updated)
  if (field.system || field.hidden) {
    return null;
  }

  switch (field.type) {
    case 'text': {
      const textRules = field.required
        ? [
            { required: true, message: `${field.name} is required` },
            ...(field.pattern
              ? [
                  {
                    pattern: new RegExp(field.pattern),
                    message: field.patternMessage || `Please enter a valid ${field.name}`,
                  },
                ]
              : []),
            ...(field.min !== undefined
              ? [
                  {
                    min: field.min,
                    message: `${field.name} must be at least ${field.min} characters`,
                  },
                ]
              : []),
            ...(field.max !== undefined
              ? [
                  {
                    max: field.max,
                    message: `${field.name} must be no more than ${field.max} characters`,
                  },
                ]
              : []),
          ]
        : [
            ...(field.pattern
              ? [
                  {
                    pattern: new RegExp(field.pattern),
                    message: field.patternMessage || `Please enter a valid ${field.name}`,
                  },
                ]
              : []),
            ...(field.min !== undefined
              ? [
                  {
                    min: field.min,
                    message: `${field.name} must be at least ${field.min} characters`,
                  },
                ]
              : []),
            ...(field.max !== undefined
              ? [
                  {
                    max: field.max,
                    message: `${field.name} must be no more than ${field.max} characters`,
                  },
                ]
              : []),
          ];

      return (
        <Form.Item key={field.id} {...commonProps} rules={textRules}>
          <Input
            placeholder={`Enter ${field.name}`}
            maxLength={field.max}
            showCount={field.max !== undefined}
          />
        </Form.Item>
      );
    }

    case 'number':
      return (
        <Form.Item key={field.id} {...commonProps}>
          <InputNumber
            placeholder={`Enter ${field.name}`}
            style={{ width: '100%' }}
            min={field.min !== undefined ? field.min : field.onlyInt ? 0 : undefined}
            max={field.max !== undefined ? field.max : undefined}
            step={field.onlyInt ? 1 : 0.01}
            precision={field.onlyInt ? 0 : undefined}
          />
        </Form.Item>
      );

    case 'bool':
      return (
        <Form.Item key={field.id} {...commonProps} valuePropName="checked">
          <Switch />
        </Form.Item>
      );

    case 'email':
      return (
        <Form.Item key={field.id} {...commonProps}>
          <Input type="email" placeholder={`Enter ${field.name}`} />
        </Form.Item>
      );

    case 'url':
      return (
        <Form.Item key={field.id} {...commonProps}>
          <Input type="url" placeholder={`Enter ${field.name}`} />
        </Form.Item>
      );

    case 'date':
      return (
        <Form.Item key={field.id} {...commonProps}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      );

    case 'select': {
      // Handle both single and multiple select
      const isMultiple = field.maxSelect && field.maxSelect > 1;
      const options = field.values
        ? field.values.map((value: string) => ({
            label: value,
            value: value,
          }))
        : [];

      return (
        <Form.Item key={field.id} {...commonProps}>
          <Select
            mode={isMultiple ? 'multiple' : undefined}
            placeholder={`Select ${field.name}`}
            options={options}
            allowClear={!field.required}
          />
        </Form.Item>
      );
    }

    case 'json': {
      const jsonRules = field.required
        ? [
            { required: true, message: `${field.name} is required` },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch {
                  return Promise.reject(new Error('Please enter valid JSON'));
                }
              },
            },
          ]
        : [
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch {
                  return Promise.reject(new Error('Please enter valid JSON'));
                }
              },
            },
          ];

      return (
        <Form.Item key={field.id} {...commonProps} rules={jsonRules}>
          <TextArea placeholder={`Enter ${field.name} (JSON format)`} rows={4} />
        </Form.Item>
      );
    }

    case 'file':
      // For file fields, we'll render a simple text input for now
      // In a real implementation, you'd want to use an upload component
      return (
        <Form.Item key={field.id} {...commonProps}>
          <Input placeholder={`File path for ${field.name}`} />
        </Form.Item>
      );

    case 'relation':
      // For relation fields, we'll render a select input
      // In a real implementation, you'd want to fetch related records
      return (
        <Form.Item key={field.id} {...commonProps}>
          <Select
            mode={field.maxSelect && field.maxSelect > 1 ? 'multiple' : undefined}
            placeholder={`Select ${field.name}`}
          />
        </Form.Item>
      );

    case 'password':
      return (
        <Form.Item key={field.id} {...commonProps}>
          <Input.Password placeholder={`Enter ${field.name}`} />
        </Form.Item>
      );

    case 'editor':
      // For editor fields, use a textarea for now
      return (
        <Form.Item key={field.id} {...commonProps}>
          <TextArea placeholder={`Enter ${field.name}`} rows={6} />
        </Form.Item>
      );

    case 'geoPoint':
      // For geoPoint fields, we could render latitude/longitude inputs
      // For now, use a simple text input
      return (
        <Form.Item key={field.id} {...commonProps}>
          <Input placeholder={`Enter ${field.name} (lat,lng format)`} />
        </Form.Item>
      );

    case 'autodate':
      // Auto-generated date fields should not be editable
      return null;

    default:
      return (
        <Form.Item key={field.id} {...commonProps}>
          <Input placeholder={`Enter ${field.name}`} />
        </Form.Item>
      );
  }
};

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  formProps,
  layout = 'vertical',
}) => {
  const formItems = fields.map(field => renderField(field));

  if (formProps) {
    return (
      <Form {...formProps} layout={layout}>
        {formItems}
      </Form>
    );
  }

  return <>{formItems}</>;
};
