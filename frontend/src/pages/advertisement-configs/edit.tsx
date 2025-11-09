import React, { useEffect, useState } from 'react';
import { useDataProvider } from '@refinedev/core';
import { Edit, useForm } from '@refinedev/antd';
import { DynamicForm } from '../../components/form/dynamic-form';
import type { DynamicField } from '../../components/form/dynamic-form';

// PocketBase field interface
interface PocketBaseField {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  system?: boolean;
  hidden?: boolean;
  [key: string]: unknown;
}

export const AdvertisementConfigEdit = () => {
  const dataProvider = useDataProvider();
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [loading, setLoading] = useState(true);

  const { formProps, saveButtonProps } = useForm();

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        // Check if user has admin/superuser access (required for collections.getOne)
        const authCollection = localStorage.getItem('auth_collection');
        const hasAdminAccess = authCollection === '_superusers';

        if (!hasAdminAccess) {
          console.log('User does not have admin access, using fallback fields');
          throw new Error('No admin access');
        }

        const response = await (dataProvider as any).getCollectionSchema({
          collection: 'advertisement_configs',
        });
        const collection = response.data;

        // Transform PocketBase fields to our DynamicField format
        const dynamicFields: DynamicField[] =
          collection.fields?.map((field: PocketBaseField) => {
            const { id, name, type, required, system, hidden, ...rest } = field;
            return {
              id,
              name,
              type,
              required: required || false,
              system: system || false,
              hidden: hidden || false,
              ...rest, // Include any additional field-specific properties
            };
          }) || [];

        setFields(dynamicFields);
      } catch (error) {
        console.error('Failed to fetch collection schema:', error);
        // Fallback to hardcoded fields for now - include all fields from migration
        setFields([
          {
            id: 'name_field',
            name: 'name',
            type: 'text',
            required: true,
            system: false,
            hidden: false,
          },
          {
            id: 'experiment_id_field',
            name: 'experiment_id',
            type: 'text',
            required: true,
            system: false,
            hidden: false,
          },
          {
            id: 'game_id_field',
            name: 'game_id',
            type: 'json',
            required: true,
            system: false,
            hidden: false,
          },
          {
            id: 'banner_ad_unit_id_field',
            name: 'banner_ad_unit_id',
            type: 'text',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'interstitial_ad_unit_id_field',
            name: 'interstitial_ad_unit_id',
            type: 'text',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'rewarded_ad_unit_id_field',
            name: 'rewarded_ad_unit_id',
            type: 'text',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'auto_hide_banner_field',
            name: 'auto_hide_banner',
            type: 'bool',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'banner_position_field',
            name: 'banner_position',
            type: 'number',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'banner_refresh_rate_field',
            name: 'banner_refresh_rate',
            type: 'number',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'banner_memory_threshold_field',
            name: 'banner_memory_threshold',
            type: 'number',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'destroy_banner_on_low_memory_field',
            name: 'destroy_banner_on_low_memory',
            type: 'bool',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'preload_interstitial_field',
            name: 'preload_interstitial',
            type: 'bool',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'preload_rewarded_field',
            name: 'preload_rewarded',
            type: 'bool',
            required: false,
            system: false,
            hidden: false,
          },
          {
            id: 'enable_consent_flow_field',
            name: 'enable_consent_flow',
            type: 'bool',
            required: false,
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
      <Edit saveButtonProps={saveButtonProps}>
        <div>Loading form...</div>
      </Edit>
    );
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <DynamicForm fields={fields} formProps={formProps as any} />
    </Edit>
  );
};
