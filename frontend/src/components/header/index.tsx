import { useGetIdentity, useTranslate, useList } from '@refinedev/core';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';

import {
  Dropdown,
  Avatar,
  Typography,
  Space,
  Grid,
  Row,
  Col,
  Layout as AntdLayout,
  Button,
  theme,
  type MenuProps,
  Input,
} from 'antd';

import React from 'react';

import { useConfigProvider, useGame } from '../../context';
import { IconMoon, IconSun } from '../../components/icons';
import type { IIdentity, IGame } from '../../interfaces';
import { useStyles } from './styled';

const { Header: AntdHeader } = AntdLayout;
const { useToken } = theme;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export const Header: React.FC = () => {
  const { token } = useToken();
  const { styles } = useStyles();
  const { mode, setMode } = useConfigProvider();
  const { data: user } = useGetIdentity<IIdentity>();
  const screens = useBreakpoint();
  const t = useTranslate();
  const { selectedGame, setSelectedGame } = useGame();

  // Fetch games for the game selector
  const { query } = useList<IGame>({
    resource: 'games',
  });

  const { data } = query;
  const games = data?.data || [];

  const gameMenuItems: MenuProps['items'] = [
    // Add "All Games" option to clear filter
    {
      key: 'all',
      onClick: () => {
        setSelectedGame(null);
      },
      label: 'All Games',
    },
    ...games.map((game: IGame) => ({
      key: game.id,
      onClick: () => {
        setSelectedGame(game);
      },
      label: game.game_id,
    })),
  ];

  return (
    <AntdHeader
      style={{
        backgroundColor: token.colorBgElevated,
        padding: '0 24px',
      }}
    >
      <Row
        align="middle"
        style={{
          justifyContent: screens.sm ? 'space-between' : 'end',
        }}
      >
        <Col xs={0} sm={8} md={12}>
          <Input
            size="large"
            placeholder={t('search.placeholder')}
            prefix={<SearchOutlined className={styles.inputPrefix} />}
            style={{
              maxWidth: '550px',
            }}
          />
        </Col>
        <Col>
          <Space size={screens.md ? 32 : 16} align="center">
            <Dropdown
              menu={{
                items: gameMenuItems,
              }}
            >
              <Button onClick={e => e.preventDefault()}>
                <Space>
                  <Text className={styles.languageSwitchText}>
                    {selectedGame ? selectedGame.game_id : 'All Games'}
                  </Text>
                  <DownOutlined className={styles.languageSwitchIcon} />
                </Space>
              </Button>
            </Dropdown>

            <Button
              className={styles.themeSwitch}
              type="text"
              icon={mode === 'light' ? <IconMoon /> : <IconSun />}
              onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
              }}
            />

            <Space size={screens.md ? 16 : 8} align="center">
              <Text ellipsis className={styles.userName}>
                {user?.name}
              </Text>
              <Avatar size="large" src={user?.avatar} alt={user?.name} />
            </Space>
          </Space>
        </Col>
      </Row>
    </AntdHeader>
  );
};
