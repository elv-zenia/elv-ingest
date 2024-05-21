import PageHeader from "@/components/header/PageHeader";
import {DataTable} from "mantine-datatable";

const Streams = () => {
  // TODO: Define records type
  const records: {objectId: string}[] = [];

  return (
    <>
      <PageHeader
        showSearchBar
        showJobsButton
        title="Streams"
      />
      <DataTable
        withTableBorder
        highlightOnHover
        idAccessor="objectId"
        minHeight={!records || records.length === 0 ? 150 : 75}
        records={records}
      />
    </>
  );
};

export default Streams;
