import React, { useEffect, useState } from 'react';
import { useTranslate, useNavigation, useDataProvider } from '@refinedev/core';
import { Create, useForm } from '@refinedev/antd';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { getStatusCode } from '../../utils';
import { DynamicForm } from '../../components/form/dynamic-form';
import type { IGame } from '../../interfaces';
import type { DynamicField } from '../../components/form/dynamic-form';

export const GameCreate = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const dataProvider = useDataProvider();
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [loading, setLoading] = useState(true);

  const { formProps, saveButtonProps } = useForm<IGame>({
    resource: 'games',
    action: 'create',
    redirect: 'list',

    errorNotification: (error: unknown) => {
      // Try to get the actual error message from PocketBase API response
      // PocketBase error structure: { status, message, data }
      const errorMessage =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        t('notifications.createError', {
          resource: t('games.games'),
          statusCode: getStatusCode(error),
        });
      return {
        message: errorMessage,
        type: 'error',
      };
    },
  });

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await dataProvider.getCollectionSchema({ collection: 'games' });
        const collection = response.data;

        // Transform PocketBase fields to our DynamicField format
        const dynamicFields: DynamicField[] =
          collection.fields?.map((field: unknown) => ({
            id: field.id,
            name: field.name,
            type: field.type,
            required: field.required || false,
            system: field.system || false,
            hidden: field.hidden || false,
            ...field, // Include any additional field-specific properties
          })) || [];

        setFields(dynamicFields);
      } catch (error) {
        console.error('Failed to fetch collection schema:', error);
        // Fallback to hardcoded field for now
        setFields([
          {
            id: 'game_id_field',
            name: 'game_id',
            type: 'text',
            required: true,
            system: false,
            hidden: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, [dataProvider]);

  if (loading) {
    return (
      <Create title={t('games.titles.create')}>
        <div>Loading form...</div>
      </Create>
    );
  }

  return (
    <Create
      title={t('games.titles.create')}
      headerButtons={[
        <Button key="back" type="text" icon={<LeftOutlined />} onClick={() => list('games')}>
          {t('buttons.cancel')}
        </Button>,
      ]}
      saveButtonProps={saveButtonProps}
    >
      <DynamicForm fields={fields} formProps={formProps} />
    </Create>
  );
};
