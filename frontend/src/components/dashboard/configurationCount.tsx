import { useList } from "@refinedev/core";
import { Typography, Spin } from "antd";
import { useGame } from "../../context";
import type { IConfiguration } from "../../interfaces";

export const ConfigurationCount: React.FC = () => {
  const { selectedGame } = useGame();

  const { query } = useList<IConfiguration>({
    resource: "configurations",
    pagination: {
      pageSize: 1, // We only need the total count, not the actual data
    },
    filters: selectedGame ? [
      {
        field: "game_id",
        operator: "eq",
        value: selectedGame.game_id,
      },
    ] : [],
  });

  const { data, isLoading } = query;

  const totalConfigurations = data?.total || 0;

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "200px",
      }}
    >
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <Typography.Title level={1} style={{ margin: 0, color: "#1890ff" }}>
            {totalConfigurations}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: "16px" }}>
            Total Configurations
          </Typography.Text>
        </>
      )}
    </div>
  );
};
