import {observer} from "mobx-react-lite";
import {ReactNode, useEffect} from "react";
import {dataStore} from "@/stores";

interface DataWrapperProps {
  children: ReactNode;
}

const DataWrapper = observer(({children}: DataWrapperProps) => {
  useEffect(() => {
    const Load = async() => {
      await dataStore.LoadTenantData();
      await dataStore.LoadSiteData();
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
