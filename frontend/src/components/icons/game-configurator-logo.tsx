import React from 'react';

export const GameConfiguratorLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={24}
    viewBox="0 0 28 24"
    fill="none"
    {...props}
  >
    <path
      fill="url(#game-configurator-logo-icon-a)"
      d="M0 11a6.001 6.001 0 0 0 5.176 5.944l-.788 4.727A2 2 0 0 0 6.361 24h1.886a1 1 0 0 0 .996-.917l.472-5.66a1 1 0 0 0-.244-.742l-.976-1.116A2 2 0 0 1 8 14.25v-.607c0-.095.006-.188.023-.281C8.142 12.71 8.74 10 10.5 10c1.76 0 2.358 2.71 2.477 3.36.017.094.023.188.023.282v.607a2 2 0 0 1-.495 1.316l-.976 1.116a1 1 0 0 0-.244.741l.472 5.661a1 1 0 0 0 .997.917h2.492a1 1 0 0 0 .997-.917l.472-5.66a1 1 0 0 0-.244-.742l-.976-1.116A2 2 0 0 1 15 14.25V10.5a.5.5 0 0 1 1 0v3a.5.5 0 0 0 1 0v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 0 1 0v-3a.5.5 0 0 1 1 0v3.748a2 2 0 0 1-.495 1.318l-.976 1.115a1 1 0 0 0-.244.741l.472 5.661a1 1 0 0 0 .996.917h1.886a2 2 0 0 0 1.973-2.329l-.788-4.727a6.001 6.001 0 1 0-3.75-11.183c.454-.562 1.158-1.053 2.036-1.432A8 8 0 0 0 14 0a8 8 0 0 0-7.11 4.329c.878.38 1.582.87 2.036 1.432A5.962 5.962 0 0 0 6.036 5L6 5a6.002 6.002 0 0 0-6 6Z"
    />
    <defs>
      <linearGradient
        id="game-configurator-logo-icon-a"
        x1={14}
        x2={14}
        y1={0}
        y2={24}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF4C4D" />
        <stop offset={1} stopColor="#F93" />
      </linearGradient>
    </defs>
  </svg>
);

export const GameConfiguratorLogoText: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={24}
      viewBox="0 0 200 24"
      fill="none"
      {...props}
    >
      <text
        x="0"
        y="18"
        font-family="Arial, sans-serif"
        font-size="18"
        font-weight="bold"
        fill="currentColor"
      >
        GameConfigurator
      </text>
    </svg>
  );
};
