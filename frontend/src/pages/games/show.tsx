import { useShow, useTranslate } from '@refinedev/core';
import type { IGame } from '../../interfaces';
import { List, ListButton } from '@refinedev/antd';
import { Divider, Flex, Row, Col, Typography, Skeleton } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

export const GameShow = () => {
  const t = useTranslate();
  const { query: queryResult } = useShow<IGame>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>{t('games.games')}</ListButton>
      </Flex>
      <Divider />
      <List
        breadcrumb={false}
        title={
          isLoading ? (
            <Skeleton.Input
              active
              style={{
                width: '200px',
                height: '28px',
              }}
            />
          ) : (
            record?.game_id
          )
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div>
              <Typography.Title level={5}>{t('games.fields.game_id')}</Typography.Title>
              <Typography.Text>
                {isLoading ? <Skeleton.Input active /> : record?.game_id}
              </Typography.Text>
            </div>
          </Col>
        </Row>
      </List>
    </>
  );
};
