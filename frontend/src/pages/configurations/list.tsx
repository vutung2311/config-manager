import {
  useTranslate,
  useNavigation,
  type HttpError,
} from "@refinedev/core";
import { useGame } from "../../context";
import { CreateButton } from "@refinedev/antd";
import { useParams } from "react-router";

import {
  List,
  useTable,
  DateField,
} from "@refinedev/antd";
import { Table, Typography, theme, Tag } from "antd";
import { useEffect } from "react";

import type {
  IConfiguration,
  IConfigurationFilterVariables,
} from "../../interfaces";
import { ConfigurationActions } from "../../components/configurationActions";

export const ConfigurationList = () => {
  const { token } = theme.useToken();
  const { selectedGame } = useGame();
  const { templateId } = useParams<{ templateId?: string }>();

  const { tableProps, setFilters } = useTable<
    IConfiguration,
    HttpError,
    IConfigurationFilterVariables
  >({
    resource: "configurations",
  });

  useEffect(() => {
    const filters = [];

    // Filter by game if selected
    if (selectedGame) {
      filters.push({
        field: "game_id",
        operator: "eq" as const,
        value: selectedGame.game_id,
      });
    }

    // Filter by template if we're in a dynamic menu route
    if (templateId) {
      filters.push({
        field: "template_id",
        operator: "eq" as const,
        value: templateId,
      });
    }

    setFilters(filters);
  }, [selectedGame, setFilters, templateId]);

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
              show("configurations", record.id);
            },
          };
        }}
      >
        <Table.Column
          key="name"
          dataIndex="name"
          title={t("configurations.fields.name")}
        />
        <Table.Column
          key="template_id"
          dataIndex="template_id"
          title={t("configurations.fields.template_id")}
        />
        <Table.Column
          key="game_id"
          dataIndex="game_id"
          title={t("configurations.fields.game_id")}
        />
        <Table.Column
          key="is_latest"
          dataIndex="is_latest"
          title={t("configurations.fields.is_latest")}
          render={(value) => (
            <Tag color={value ? "green" : "default"}>
              {value ? "Latest" : "Not Latest"}
            </Tag>
          )}
        />
        <Table.Column
          key="data"
          dataIndex="data"
          title={t("configurations.fields.data")}
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
          title={t("configurations.fields.created")}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 1 }}
        />
        <Table.Column
          key="updated"
          dataIndex="updated"
          title={t("configurations.fields.updated")}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter={{ multiple: 2 }}
        />
        <Table.Column<IConfiguration>
          fixed="right"
          title={t("table.actions")}
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_, record) => (
            <ConfigurationActions record={record} />
          )}
        />
      </Table>
    </List>
  );
};
