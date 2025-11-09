import React from 'react';
import { useTranslate, useNavigation, useDelete } from '@refinedev/core';
import { Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { IGame } from '../interfaces';

type Props = {
  record: IGame;
};

type ButtonClickEvent = React.MouseEvent<HTMLElement>;

export const GameActions: React.FC<Props> = ({ record }) => {
  const t = useTranslate();
  const { edit, list } = useNavigation();
  const { mutateAsync: mutateDeleteAsync } = useDelete();

  const handleDelete = async () => {
    try {
      await mutateDeleteAsync({
        resource: 'games',
        id: record.id,
        successNotification: {
          message: t('notifications.deleteSuccess', {
            resource: t('games.games'),
          }),
          type: 'success',
        },
      });
      // Navigate to list page after successful deletion
      list('games');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={(event: ButtonClickEvent) => {
          event.stopPropagation();
          edit('games', record.id);
        }}
        title={t('actions.edit')}
      />
      <Popconfirm
        title={t('buttons.confirm')}
        description={t('notifications.deleteSuccess', {
          resource: t('games.games'),
        })}
        onConfirm={handleDelete}
        okText={t('buttons.confirm')}
        cancelText={t('buttons.cancel')}
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={(event: ButtonClickEvent) => event.stopPropagation()}
          title={t('actions.delete')}
        />
      </Popconfirm>
    </div>
  );
};
