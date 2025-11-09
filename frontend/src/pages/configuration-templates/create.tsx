import React from "react";
import { useTranslate, useCreate, useNavigation } from "@refinedev/core";
import { Create, useForm, getValueFromEvent } from "@refinedev/antd";
import { Form, Input, Button, message, Upload } from "antd";
import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { getStatusCode } from "../../utils";
import type { IConfigurationTemplate } from "../../interfaces";

export const ConfigurationTemplateCreate = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { mutate } = useCreate();
  const { formProps, saveButtonProps, form } = useForm<IConfigurationTemplate>({
    onMutationSuccess: () => {
      list("configuration_templates");
    },
    errorNotification: (error: any, values, resource) => {
      return {
        message: t("notifications.createError", {
          resource: t("configuration_templates.configuration_templates"),
          statusCode: getStatusCode(error),
        }),
        type: "error",
      };
    },
  });

  // Watch for changes to the import file field
  const importFileList = Form.useWatch('importFile', form);

  // Process the imported file when it changes
  React.useEffect(() => {
    if (importFileList && importFileList.length > 0) {
      const file = importFileList[0];
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;

            // Validate that content is not empty
            if (!content || content.trim().length === 0) {
              throw new Error("File is empty");
            }

            // Validate that it's valid JSON by parsing it
            JSON.parse(content);

            // Put the entire JSON content into the data field
            form.setFieldsValue({
              data: content,
              importFile: [], // Clear the import file after processing
            });

            message.success("Configuration template imported successfully");
          } catch (error) {
            console.error("Import error:", error);
            if (error instanceof SyntaxError) {
              message.error("Invalid JSON format: Please check your JSON syntax");
            } else {
              message.error("Invalid JSON file: " + (error as Error).message);
            }
            form.setFieldsValue({ importFile: [] });
          }
        };
        reader.onerror = () => {
          message.error("Failed to read file");
          form.setFieldsValue({ importFile: [] });
        };
        reader.readAsText(file.originFileObj);
      }
    }
  }, [importFileList, form]);



  return (
    <Create
      title={t("configuration_templates.titles.create")}
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
      <Form {...formProps} form={form} layout="vertical" onFinish={async (values: any) => {
        // Remove the importFile field from submission as it's only used for file selection
        const { importFile, ...submitValues } = values;

        // Parse the data field from string to JSON object
        try {
          const parsedData = JSON.parse(submitValues.data);
          await mutate({
            resource: "configuration_templates",
            values: {
              ...submitValues,
              data: parsedData,
            },
          });
        } catch (error: any) {
          if (error instanceof SyntaxError) {
            // This is a JSON parsing error - let form validation handle it
            throw new Error("Invalid JSON in data field");
          }
          // Re-throw API errors to be handled by errorNotification
          throw error;
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
          name="importFile"
          valuePropName="fileList"
          getValueFromEvent={getValueFromEvent}
          noStyle
        >
          <Upload
            accept=".json"
            showUploadList={false}
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>
              {t("buttons.import")}
            </Button>
          </Upload>
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
    </Create>
  );
};
