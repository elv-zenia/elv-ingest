import {observer} from "mobx-react-lite";
import {BrowserRouter} from "react-router-dom";
import {AppShell, MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import AppRoutes from "./Routes.jsx";
import {rootStore} from "@/stores";
import MantineTheme from "@/assets/MantineTheme.js";
import "@/assets/stylesheets/reset.scss";
import SideNavigation from "@/components/SideNavigation.jsx";
import DataWrapper from "@/components/DataWrapper.jsx";
import ErrorBoundary from "@/components/error/ErrorBoundary.jsx";

const App = observer(() => {
  return (
    // TODO: Support color scheme switching
    <MantineProvider withCssVariables defaultColorScheme="light" theme={MantineTheme}>
      <BrowserRouter>
        <AppShell padding="lg" navbar={{width: 230, breakpoint: "sm"}}>
          <SideNavigation />
          <AppShell.Main>
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
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
});

export default App;
