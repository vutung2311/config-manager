import React from "react";
import { useTranslate, useNavigation, useDelete } from "@refinedev/core";
import { Button, Popconfirm, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import type { IConfigurationTemplate } from "../interfaces";

type Props = {
  record: IConfigurationTemplate;
};

type ButtonClickEvent = React.MouseEvent<HTMLElement>;

export const ConfigurationTemplateActions: React.FC<Props> = ({ record }) => {
  const t = useTranslate();
  const { edit, show, list } = useNavigation();
  const { mutateAsync: mutateDeleteAsync } = useDelete();

  const handleDelete = async () => {
    try {
      await mutateDeleteAsync({
        resource: "configuration_templates",
        id: record.id,
        successNotification: {
          message: t("notifications.deleteSuccess", {
            resource: t("configuration_templates.configuration_templates"),
          }),
          type: "success",
        },
      });
      // Navigate to list page after successful deletion
      list("configuration_templates");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={(event: ButtonClickEvent) => {
          event.stopPropagation();
          edit("configuration_templates", record.id);
        }}
        title={t("actions.edit")}
      />
      <Popconfirm
        title={t("buttons.confirm")}
        description={t("notifications.deleteSuccess", {
          resource: t("configuration_templates.configuration_templates"),
        })}
        onConfirm={handleDelete}
        okText={t("buttons.confirm")}
        cancelText={t("buttons.cancel")}
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={(event: ButtonClickEvent) => event.stopPropagation()}
          title={t("actions.delete")}
        />
      </Popconfirm>
    </div>
  );
};
