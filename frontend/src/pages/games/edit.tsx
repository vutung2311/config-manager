import React from "react";
import { useTranslate, useNavigation, useUpdate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import type { IGame } from "../../interfaces";

export const GameEdit = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { mutate } = useUpdate();
  const { formProps, saveButtonProps, form, query } = useForm<IGame>({
    onMutationSuccess: () => {
      list("games");
    },
  });

  return (
    <Edit
      title={t("games.titles.edit")}
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
      <Form {...formProps} form={form} layout="vertical" onFinish={async (values: any) => {
        mutate({
          resource: "games",
          id: query?.data?.data?.id,
          values,
        }, {
          onSuccess: () => {
            list("games");
          },
        });
      }}>
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
    </Edit>
  );
};
