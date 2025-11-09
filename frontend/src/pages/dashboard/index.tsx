import { Row, Col, theme } from "antd";
import { useTranslation } from "react-i18next";

import { CardWithContent } from "../../components/card";
import { ConfigurationCount, LatestConfiguration } from "../../components/dashboard";
import {
  DatabaseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { List } from "@refinedev/antd";

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <List title={t("dashboard.overview.title")}>
      <Row gutter={[16, 16]}>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: "24px",
              minHeight: "200px",
            }}
            icon={
              <DatabaseOutlined
                style={{
                  fontSize: 16,
                  color: token.colorPrimary,
                }}
              />
            }
            title="Configuration Overview"
          >
            <ConfigurationCount />
          </CardWithContent>
        </Col>

        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: "24px",
              minHeight: "200px",
            }}
            icon={
              <ClockCircleOutlined
                style={{
                  fontSize: 16,
                  color: token.colorWarning,
                }}
              />
            }
            title="Latest Configuration"
          >
            <LatestConfiguration />
          </CardWithContent>
        </Col>
      </Row>
    </List>
  );
};
