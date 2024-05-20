import {observer} from "mobx-react-lite";
import {BrowserRouter} from "react-router-dom";
import {AppShell, MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import AppRoutes from "./Routes";
import {rootStore} from "@/stores";
import MantineTheme from "@/assets/MantineTheme";
import "@/assets/stylesheets/reset.css";
import SideNavigation from "@/components/navigation/SideNavigation";
import DataWrapper from "@/components/DataWrapper";
import ErrorBoundary from "@/components/error/ErrorBoundary";

const App = observer(() => {
  return (
    // TODO: Support color scheme switching
    <MantineProvider withCssVariables defaultColorScheme="light" theme={MantineTheme}>
      <BrowserRouter>
        <AppShell padding="lg" navbar={{width: 210, breakpoint: "sm"}}>
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
