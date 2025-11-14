import { useShow, useTranslate } from "@refinedev/core";
import type { IConfiguration } from "../../interfaces";
import { List, ListButton } from "@refinedev/antd";
import { Divider, Flex, Row, Col, Typography, Skeleton, Tag } from "antd";
import { LeftOutlined } from "@ant-design/icons";

export const ConfigurationShow = () => {
  const t = useTranslate();
  const { query: queryResult } = useShow<IConfiguration>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>{t("configurations.configurations")}</ListButton>
      </Flex>
      <Divider />
      <List
        breadcrumb={false}
        title={
          isLoading ? (
            <Skeleton.Input
              active
              style={{
                width: "200px",
                height: "28px",
              }}
            />
          ) : (
            record?.name
          )
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div style={{ marginBottom: "16px" }}>
              <Typography.Title level={5}>
                {t("configurations.fields.name")}
              </Typography.Title>
              <Typography.Text>
                {isLoading ? <Skeleton.Input active /> : record?.name}
              </Typography.Text>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Typography.Title level={5}>
                {t("configurations.fields.template_id")}
              </Typography.Title>
              <Typography.Text>
                {isLoading ? <Skeleton.Input active /> : record?.template_id}
              </Typography.Text>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Typography.Title level={5}>
                {t("configurations.fields.game_id")}
              </Typography.Title>
              <Typography.Text>
                {isLoading ? <Skeleton.Input active /> : record?.game_id}
              </Typography.Text>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Typography.Title level={5}>
                {t("configurations.fields.is_latest")}
              </Typography.Title>
              <Typography.Text>
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Tag color={record?.is_latest ? "green" : "default"}>
                    {record?.is_latest ? "Latest" : "Not Latest"}
                  </Tag>
                )}
              </Typography.Text>
            </div>

            <div>
              <Typography.Title level={5}>
                {t("configurations.fields.data")}
              </Typography.Title>
              <Typography.Text>
                {isLoading ? (
                  <Skeleton.Input active style={{ width: "100%", height: "200px" }} />
                ) : (
                  <pre style={{
                    backgroundColor: "#f5f5f5",
                    padding: "16px",
                    borderRadius: "4px",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                  }}>
                    {JSON.stringify(record?.data, null, 2)}
                  </pre>
                )}
              </Typography.Text>
            </div>
          </Col>
        </Row>
      </List>
    </>
  );
};
