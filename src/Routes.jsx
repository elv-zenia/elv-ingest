import Content from "@/pages/Content.jsx";
import {Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";

const AppRoutes = observer(() => {
  const routes = [
    {path: "/", Component: <Content />, label: "Home"}
  ];

  return (
    <Routes>
      {
        routes.map(({path, Component}) => (
          <Route
            exact={true}
            key={path}
            path={path}
            element={Component}
          />
        ))
      }
    </Routes>
  );
});

export default AppRoutes;
