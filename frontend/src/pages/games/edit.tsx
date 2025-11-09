import React, { useEffect, useState } from 'react';
import { useTranslate, useNavigation, useDataProvider } from '@refinedev/core';
import { Edit, useForm } from '@refinedev/antd';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import { DynamicForm } from '../../components/form/dynamic-form';
import type { IGame } from '../../interfaces';
import type { DynamicField } from '../../components/form/dynamic-form';

export const GameEdit = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const dataProvider = useDataProvider();
  const { id } = useParams<{ id: string }>();
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [loading, setLoading] = useState(true);

  const { formProps } = useForm<IGame>({
    resource: 'games',
    action: 'edit',
    id,
    redirect: 'list',
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
      <Edit title={t('games.titles.edit')}>
        <div>Loading form...</div>
      </Edit>
    );
  }

  return (
    <Edit
      title={t('games.titles.edit')}
      headerButtons={[
        <Button key="back" type="text" icon={<LeftOutlined />} onClick={() => list('games')}>
          {t('buttons.cancel')}
        </Button>,
      ]}
    >
      <DynamicForm fields={fields} formProps={formProps} />
    </Edit>
  );
};
