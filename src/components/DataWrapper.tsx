import {observer} from "mobx-react-lite";
import {ReactNode, useEffect} from "react";
import {rootStore, streamStore} from "@/stores";

interface DataWrapperProps {
  children: ReactNode;
}

const DataWrapper = observer(({children}: DataWrapperProps) => {
  useEffect(() => {
    const Load = async() => {
      await rootStore.LoadTenantData();
      await streamStore.LoadSiteData();
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
