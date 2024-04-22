import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {dataStore} from "@/stores/index.js";

const DataWrapper = observer(({children}) => {
  useEffect(() => {
    const Load = async() => {
      dataStore.LoadTenantData();
    };

    Load();
  }, []);
  return (
    <>
      { children }
    </>
  );
});

export default DataWrapper;
