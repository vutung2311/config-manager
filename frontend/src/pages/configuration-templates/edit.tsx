import React from "react";
import { useTranslate, useNavigation, useUpdate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import type { IConfigurationTemplate } from "../../interfaces";

export const ConfigurationTemplateEdit = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { mutate } = useUpdate();
  const { formProps, saveButtonProps, form, query } = useForm<IConfigurationTemplate>({
    onMutationSuccess: () => {
      list("configuration_templates");
    },
  });

  // Transform data for form display
  const initialValues = query?.data?.data ? {
    ...query.data.data,
    data: JSON.stringify(query.data.data.data, null, 2),
  } : undefined;

  return (
    <Edit
      title={t("configuration_templates.titles.edit")}
      headerButtons={[
        <Button
          key="back"
          type="text"
          icon={<LeftOutlined />}
          onClick={() => list("configuration_templates")}
        >
          {t("buttons.cancel")}
        </Button>,
      ]}
      saveButtonProps={saveButtonProps}
    >
      <Form {...formProps} form={form} layout="vertical" initialValues={initialValues} onFinish={async (values: any) => {
        // Parse the data field from string to JSON object
        try {
          const parsedData = JSON.parse(values.data);
          mutate({
            resource: "configuration_templates",
            id: query?.data?.data?.id,
            values: {
              ...values,
              data: parsedData,
            },
          }, {
            onSuccess: () => {
              list("configuration_templates");
            },
          });
        } catch (error) {
          throw new Error("Invalid JSON in data field");
        }
      }}>
        <Form.Item
          label={t("configuration_templates.fields.name")}
          name="name"
          rules={[
            {
              required: true,
              message: t("configuration_templates.fields.name") + " is required",
            },
          ]}
        >
          <Input placeholder={t("configuration_templates.fields.name")} />
        </Form.Item>

        <Form.Item
          label={t("configuration_templates.fields.data")}
          name="data"
          rules={[
            {
              required: true,
              message: t("configuration_templates.fields.data") + " is required",
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(new Error("Invalid JSON format"));
                }
              },
            },
          ]}
        >
          <Input.TextArea
            rows={10}
            placeholder='{"key": "value"}'
            style={{ fontFamily: "monospace" }}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
