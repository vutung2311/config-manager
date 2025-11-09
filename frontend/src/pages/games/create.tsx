import React from "react";
import { useTranslate, useNavigation } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { getStatusCode } from "../../utils";
import type { IGame } from "../../interfaces";

export const GameCreate = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { formProps, saveButtonProps, form } = useForm<IGame>({
    onMutationSuccess: () => {
      list("games");
    },
    errorNotification: (error: any, values, resource) => {
      return {
        message: t("notifications.createError", {
          resource: t("games.games"),
          statusCode: getStatusCode(error),
        }),
        type: "error",
      };
    },
  });

  return (
    <Create
      title={t("games.titles.create")}
      headerButtons={[
        <Button
          key="back"
          type="text"
          icon={<LeftOutlined />}
          onClick={() => list("games")}
        >
          {t("buttons.cancel")}
        </Button>,
      ]}
      saveButtonProps={saveButtonProps}
    >
      <Form {...formProps} form={form} layout="vertical">
        <Form.Item
          label={t("games.fields.game_id")}
          name="game_id"
          rules={[
            {
              required: true,
              message: t("games.fields.game_id") + " is required",
            },
          ]}
        >
          <Input placeholder={t("games.fields.game_id")} />
        </Form.Item>
      </Form>
    </Create>
  );
};
