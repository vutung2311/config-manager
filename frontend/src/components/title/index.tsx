import React from 'react';
import { useLink } from '@refinedev/core';
import { Space, theme } from 'antd';

import { GameConfiguratorLogoIcon, GameConfiguratorLogoText } from '../../components';
import { Logo } from './styled';

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = theme.useToken();
  const Link = useLink();

  return (
    <Logo>
      <Link to="/">
        {collapsed ? (
          <GameConfiguratorLogoIcon />
        ) : (
          <Space size={12}>
            <GameConfiguratorLogoIcon
              style={{
                fontSize: '32px',
                color: token.colorTextHeading,
              }}
            />
            <GameConfiguratorLogoText
              style={{
                color: token.colorTextHeading,
                width: '100%',
                height: 'auto',
              }}
            />
          </Space>
        )}
      </Link>
    </Logo>
  );
};
