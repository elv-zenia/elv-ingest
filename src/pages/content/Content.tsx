import {observer} from "mobx-react-lite";
import PageHeader from "@/components/header/PageHeader";
import {DataTable} from "mantine-datatable";
import {useEffect} from "react";
import {dataStore} from "@/stores";
import {CONTENT_COLUMNS} from "@/utils/constants";
import {Flex, Text} from "@mantine/core";
import CreateDropdown from "@/pages/create/CreateMenu";

const Content = observer(() => {
  useEffect(() => {
    const Initialize = async () => {
      await dataStore.LoadIngestJobs();
    };

    Initialize();
  }, []);

  const records = Object.keys(dataStore.jobs || {});

  return (
    <>
      <PageHeader
        showSearchBar
        showJobsButton
        title="Ingested Content"
      />
      <Flex direction="row" gap="xs" align="center">
        <CreateDropdown />
        <Text size="xs">Below are your currently ingested raw assets. Sort and edit here or select individual items. Click the New Media Item button to ingest new items.</Text>
      </Flex>
      <DataTable
        records={records}
        columns={CONTENT_COLUMNS.map(column => (
          {accessor: column.title, title: column.title}
        ))}
        emptyState={
          <Text c="dimmed" size="sm">No content available</Text>
        }
      />
    </>
  );
});

export default Content;
