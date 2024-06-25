import {observer} from "mobx-react-lite";
import PageHeader from "@/components/header/PageHeader";
import {DataTable} from "mantine-datatable";
import {useEffect} from "react";
import {ingestStore} from "@/stores";
import {CONTENT_COLUMNS} from "@/utils/constants";
import {Flex, Text} from "@mantine/core";
import CreateDropdown from "@/pages/create/CreateMenu";

const Content = observer(() => {
  useEffect(() => {
    const Initialize = async () => {
      await ingestStore.LoadIngestJobs();
    };

    Initialize();
  }, []);

  const records = Object.keys(ingestStore.jobs || {});

  return (
    <>
      <PageHeader
        showSearchBar
        showJobsButton
        title="Ingested Content"
      />
      <Flex direction="row" gap="xs" align="center" mb={22}>
        <CreateDropdown />
      </Flex>
      <DataTable
        records={records}
        minHeight={records.length > 0 ? 150 : 125}
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
