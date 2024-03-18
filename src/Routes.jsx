import {Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ROUTES} from "@/data/RouteData.js";

const AppRoutes = observer(() => {
  return (
    <Routes>
      {
        ROUTES.map(({path, Component}) => (
          <Route
            exact={true}
            key={path}
            path={path}
            element={<Component />}
          />
        ))
      }
    </Routes>
  );
});

export default AppRoutes;
