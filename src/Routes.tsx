import {Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ROUTES} from "@/utils/constants";

const AppRoutes = observer(() => {
  return (
    <Routes>
      {
        ROUTES.map(({path, Component}) => (
          <Route
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
