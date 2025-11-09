import { useList } from "@refinedev/core";
import { Typography, Spin } from "antd";
import { useGame } from "../../context";
import type { IConfiguration } from "../../interfaces";

export const LatestConfiguration: React.FC = () => {
  const { selectedGame } = useGame();

  const { query } = useList<IConfiguration>({
    resource: "configurations",
    sorters: [{ field: "created", order: "desc" }],
    pagination: {
      pageSize: 1,
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
  const latestConfig = data?.data?.[0];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "140px",
      }}
    >
      {isLoading ? (
        <Spin size="large" />
      ) : latestConfig ? (
        <>
          <Typography.Title level={4} style={{ margin: 0, textAlign: "center" }}>
            {latestConfig.name || "N/A"}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: "14px", textAlign: "center" }}>
            Last updated: {formatTimestamp(latestConfig.created)}
          </Typography.Text>
        </>
      ) : (
        <Typography.Text type="secondary" style={{ textAlign: "center" }}>
          No configurations yet
        </Typography.Text>
      )}
    </div>
  );
};
