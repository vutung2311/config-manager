import {
  useTranslate,
  useNavigation,
  type HttpError,
} from "@refinedev/core";
import { useGame } from "../../context";
import { CreateButton } from "@refinedev/antd";

import {
  List,
  useTable,
  DateField,
} from "@refinedev/antd";
import { Table, Typography, theme } from "antd";
import { useEffect } from "react";

import type {
  IConfigurationTemplate,
  IConfigurationTemplateFilterVariables,
} from "../../interfaces";
import { ConfigurationTemplateActions } from "../../components/configuration-template-actions";

export const ConfigurationTemplateList = () => {
  const { token } = theme.useToken();
  const { selectedGame } = useGame();

  const { tableProps, setFilters } = useTable<
    IConfigurationTemplate,
    HttpError,
    IConfigurationTemplateFilterVariables
  >({
    resource: "configuration_templates",
  });

  useEffect(() => {
    if (selectedGame) {
      setFilters([
        {
          field: "game_id",
          operator: "eq",
          value: selectedGame.game_id,
        },
      ]);
    } else {
      setFilters([]);
    }
  }, [selectedGame, setFilters]);

  const t = useTranslate();
  const { show } = useNavigation();

  return (
    <List
      headerButtons={[
        <CreateButton key="create" />,
      ]}
    >
      <Table
        {...tableProps}
        rowKey="id"
        style={{
          cursor: "pointer",
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              show("configuration_templates", record.id);
            },
          };
        }}
      >
        <Table.Column
          key="name"
          dataIndex="name"
          title={t("configuration_templates.fields.name")}
        />
        <Table.Column
          key="game_id"
          dataIndex="game_id"
          title={t("configuration_templates.fields.game_id")}
        />
        <Table.Column
          key="data"
          dataIndex="data"
          title={t("configuration_templates.fields.data")}
          render={(value) => {
            // Extract first few words from the data for preview
            const getDataPreview = (data: any): string => {
              try {
                if (typeof data === 'string') {
                  // If it's already a string, take first 50 characters
                  return data.length > 50 ? data.substring(0, 50) + '...' : data;
                }

                // If it's an object, stringify and take first 50 characters
                const jsonString = JSON.stringify(data);
                return jsonString.length > 50 ? jsonString.substring(0, 50) + '...' : jsonString;
              } catch {
                return 'Invalid data';
              }
            };

            return (
              <Typography.Text
                style={{
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  backgroundColor: "#f6f8fa",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #e1e4e8",
                  color: "#24292f",
                  display: "inline-block",
                }}
                title={JSON.stringify(value)} // Show full data on hover
              >
                {getDataPreview(value)}
              </Typography.Text>
            );
          }}
        />
        <Table.Column
          key="created"
          dataIndex="created"
          title={t("configuration_templates.fields.created")}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 1 }}
        />
        <Table.Column
          key="updated"
          dataIndex="updated"
          title={t("configuration_templates.fields.updated")}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 2 }}
        />
        <Table.Column<IConfigurationTemplate>
          fixed="right"
          title={t("table.actions")}
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_, record) => (
            <ConfigurationTemplateActions record={record} />
          )}
        />
      </Table>
    </List>
  );
};
