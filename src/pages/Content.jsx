import {observer} from "mobx-react-lite";
import PageHeader from "@/components/header/PageHeader.jsx";
import {DataTable} from "mantine-datatable";
import {useEffect} from "react";
import {dataStore} from "@/stores/index.js";
import {CONTENT_COLUMNS} from "@/data/ContentData.js";
import {Flex, Text} from "@mantine/core";
import CreateDropdown from "@/components/content/CreateDropdown.jsx";

const Content = observer(() => {
  useEffect(() => {
    const Initialize = async () => {
      dataStore.LoadJobs();
    };

    Initialize();
  }, []);

  const records = Object.keys(dataStore.jobs || {});

  return (
    <>
      <PageHeader
        showSearchBar
        showJobsButton
        title="IngestPanel Jobs"
      />
      <Flex direction="row" gap="xs" align="center" mt="17px">
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
