import {Navigate, Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ROUTES} from "@/utils/constants";

const AppRoutes = observer(() => {
  return (
    <Routes>
      {/* Set default route */}
      <Route
        path="/"
        element={<Navigate replace to="/content" />}
      />
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
