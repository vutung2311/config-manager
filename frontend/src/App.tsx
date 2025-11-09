import React from "react";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ThemedLayout,
  ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import {
  ShoppingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider";


import { DashboardPage } from "./pages/dashboard";
import { ConfigurationTemplateList, ConfigurationTemplateShow, ConfigurationTemplateCreate, ConfigurationTemplateEdit } from "./pages/configuration-templates";
import { GameList, GameShow, GameCreate, GameEdit } from "./pages/games";
import { AuthPage } from "./pages/auth";
import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { ConfigProvider, GameProvider } from "./context";

import "@ant-design/v5-patch-for-react-19";
import "@refinedev/antd/dist/reset.css";
import "./sider-styles.css";

const App: React.FC = () => {

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <ConfigProvider>
        <GameProvider>
          <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: "configuration_templates",
                list: "/configuration-templates",
                create: "/configuration-templates/create",
                edit: "/configuration-templates/edit/:id",
                show: "/configuration-templates/:id",
                meta: {
                  label: "Configuration Templates",
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: "games",
                list: "/games",
                create: "/games/create",
                edit: "/games/edit/:id",
                show: "/games/:id",
                meta: {
                  label: "Games",
                  icon: <ShoppingOutlined />,
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayout Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />


                <Route path="/configuration-templates">
                  <Route index element={<ConfigurationTemplateList />} />
                  <Route path="create" element={<ConfigurationTemplateCreate />} />
                  <Route path="edit/:id" element={<ConfigurationTemplateEdit />} />
                  <Route path=":id" element={<ConfigurationTemplateShow />} />
                </Route>

                <Route path="/games">
                  <Route index element={<GameList />} />
                  <Route path="create" element={<GameCreate />} />
                  <Route path="edit/:id" element={<GameEdit />} />
                  <Route path=":id" element={<GameShow />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          email: import.meta.env.VITE_ADMIN_EMAIL,
                          password: import.meta.env.VITE_ADMIN_PASSWORD,
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayout Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
            <RefineKbar />
          </Refine>
        </RefineKbarProvider>
        </GameProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
