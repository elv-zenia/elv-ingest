import {observer} from "mobx-react-lite";
import PageHeader from "@/components/header/PageHeader.jsx";

const Content = observer(() => {
  return (
    <>
      <PageHeader
        showSearchBar
        title="Ingest Jobs"
      />
    </>
  );
});

export default Content;
