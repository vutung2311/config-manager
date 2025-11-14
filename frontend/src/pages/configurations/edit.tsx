import React from "react";
import { useTranslate, useNavigation, useUpdate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Button, Switch } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useGame } from "../../context";
import type { IConfiguration } from "../../interfaces";

export const ConfigurationEdit = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { mutate } = useUpdate();
  const { selectedGame } = useGame();

  const { formProps, saveButtonProps, form, query } = useForm<IConfiguration>({
    onMutationSuccess: () => {
      list("configurations");
    },
  });

  // Transform data for form display
  const initialValues = query?.data?.data ? {
    ...query.data.data,
    data: JSON.stringify(query.data.data.data, null, 2),
  } : undefined;

  return (
    <Edit
      title={t("configurations.titles.edit")}
      headerButtons={[
        <Button
          key="back"
          type="text"
          icon={<LeftOutlined />}
          onClick={() => list("configurations")}
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
            resource: "configurations",
            id: query?.data?.data?.id,
            values: {
              ...values,
              data: parsedData,
            },
          }, {
            onSuccess: () => {
              list("configurations");
            },
          });
        } catch (error) {
          throw new Error("Invalid JSON in data field");
        }
      }}>
        <Form.Item
          label={t("configurations.fields.name")}
          name="name"
          rules={[
            {
              required: true,
              message: t("configurations.fields.name") + " is required",
            },
          ]}
        >
          <Input placeholder={t("configurations.fields.name")} />
        </Form.Item>


        <Form.Item
          label={t("configurations.fields.is_latest")}
          name="is_latest"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={t("configurations.fields.data")}
          name="data"
          rules={[
            {
              required: true,
              message: t("configurations.fields.data") + " is required",
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
