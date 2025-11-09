import React from "react";
import { useTranslate, useNavigation, useDelete } from "@refinedev/core";
import { Button, Popconfirm, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import type { IConfiguration } from "../interfaces";

type Props = {
  record: IConfiguration;
};

type ButtonClickEvent = React.MouseEvent<HTMLElement>;

export const ConfigurationActions: React.FC<Props> = ({ record }) => {
  const t = useTranslate();
  const { edit, show, list } = useNavigation();
  const { mutateAsync: mutateDeleteAsync } = useDelete();

  const handleDelete = async () => {
    try {
      await mutateDeleteAsync({
        resource: "configurations",
        id: record.id,
        successNotification: {
          message: t("notifications.deleteSuccess", {
            resource: t("configurations.configurations"),
          }),
          type: "success",
        },
      });
      // Navigate to list page after successful deletion
      list("configurations");
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
          edit("configurations", record.id);
        }}
        title={t("actions.edit")}
      />
      <Popconfirm
        title={t("buttons.confirm")}
        description={t("notifications.deleteSuccess", {
          resource: t("configurations.configurations"),
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
