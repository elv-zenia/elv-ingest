import {observer} from "mobx-react-lite";
import PageHeader from "@/components/header/PageHeader.jsx";
import {DataTable} from "mantine-datatable";
import {useEffect} from "react";
import {dataStore} from "@/stores/index.js";
import {CONTENT_COLUMNS} from "@/data/ContentData.js";
import {Text} from "@mantine/core";
import CreateSection from "@/components/content/CreateSection.jsx";

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
        title="Ingest Jobs"
      />
      <CreateSection />
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
