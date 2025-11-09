import React from 'react';
import { Row, Col, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { CardWithContent } from '../../components/card';
import { CurrentTime, GamesCount } from '../../components/dashboard';
import { ClockCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import { List } from '@refinedev/antd';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <List title={t('dashboard.overview.title')}>
      <Row gutter={[16, 16]}>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: '24px',
              minHeight: '200px',
            }}
            icon={
              <ClockCircleOutlined
                style={{
                  fontSize: 16,
                  color: token.colorPrimary,
                }}
              />
            }
            title="Current Time"
          >
            <CurrentTime />
          </CardWithContent>
        </Col>

        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: '24px',
              minHeight: '200px',
            }}
            icon={
              <AppstoreOutlined
                style={{
                  fontSize: 16,
                  color: token.colorWarning,
                }}
              />
            }
            title="Games Overview"
          >
            <GamesCount />
          </CardWithContent>
        </Col>
      </Row>
    </List>
  );
};
