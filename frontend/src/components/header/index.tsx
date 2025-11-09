import {
  useGetLocale,
  useSetLocale,
  useGetIdentity,
  useTranslate,
  useList,
} from "@refinedev/core";
import { DownOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons";

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
} from "antd";

import { useTranslation } from "react-i18next";

import { useConfigProvider, useGame } from "../../context";
import { IconMoon, IconSun } from "../../components/icons";
import type { IIdentity, IGame } from "../../interfaces";
import { useStyles } from "./styled";
import { authProvider } from "../../authProvider";

const { Header: AntdHeader } = AntdLayout;
const { useToken } = theme;
const { Text } = Typography;
const { useBreakpoint } = Grid;


export const Header: React.FC = () => {
  const { token } = useToken();
  const { styles } = useStyles();
  const { mode, setMode } = useConfigProvider();
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity<IIdentity>();
  const screens = useBreakpoint();
  const t = useTranslate();
  const { selectedGame, setSelectedGame } = useGame();

  // Fetch games for the game selector
  const { query } = useList<IGame>({
    resource: "games",
  });

  const { data } = query;
  const games = data?.data || [];

  const currentLocale = locale();

  const menuItems: MenuProps["items"] = [...(i18n.languages || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      onClick: () => changeLanguage(lang),
      icon: (
        <span style={{ marginRight: 8 }}>
          <Avatar size={16} src={`/images/flags/${lang}.svg`} />
        </span>
      ),
      label: "English",
    }));

  const gameMenuItems: MenuProps["items"] = [
    // Add "All Games" option to clear filter
    {
      key: "all",
      onClick: () => {
        setSelectedGame(null);
      },
      label: "All Games",
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
        padding: "0 24px",
      }}
    >
      <Row
        align="middle"
        style={{
          justifyContent: screens.sm ? "space-between" : "end",
        }}
      >
        <Col xs={0} sm={8} md={12}>
          <Input
            size="large"
            placeholder={t("search.placeholder")}
            prefix={<SearchOutlined className={styles.inputPrefix} />}
            style={{
              maxWidth: "550px",
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
              <Button onClick={(e) => e.preventDefault()}>
                <Space>
                  <Text className={styles.languageSwitchText}>
                    {selectedGame ? selectedGame.game_id : "All Games"}
                  </Text>
                  <DownOutlined className={styles.languageSwitchIcon} />
                </Space>
              </Button>
            </Dropdown>

            <Button
              className={styles.themeSwitch}
              type="text"
              icon={mode === "light" ? <IconMoon /> : <IconSun />}
              onClick={() => {
                setMode(mode === "light" ? "dark" : "light");
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
