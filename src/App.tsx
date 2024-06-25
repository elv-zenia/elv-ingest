import {observer} from "mobx-react-lite";
import {BrowserRouter} from "react-router-dom";

import {AppShell, Box, MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";

import AppRoutes from "./Routes";
import {rootStore} from "@/stores";
import MantineTheme from "@/assets/MantineTheme";
import "@/assets/stylesheets/reset.css";
import SideNavigation from "@/components/navigation/SideNavigation";
import DataWrapper from "@/components/DataWrapper";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ErrorBanner from "@/components/error/ErrorBanner";

const App = observer(() => {
  return (
    // TODO: Support color scheme switching
    <MantineProvider withCssVariables defaultColorScheme="light" theme={MantineTheme}>
      <BrowserRouter>
        <AppShell padding="0" navbar={{width: 210, breakpoint: "sm"}}>
          <SideNavigation />
          <AppShell.Main>
            <ErrorBanner />
            <Box p="lg">
              {
                rootStore.loaded ?
                  (
                    <DataWrapper>
                      <ErrorBoundary>
                        <AppRoutes />
                      </ErrorBoundary>
                    </DataWrapper>
                  ) :
                  null
              }
            </Box>
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
});

export default App;
