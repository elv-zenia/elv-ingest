import {ReactNode, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";
import {DataTable, DataTableSortStatus} from "mantine-datatable";
import {ActionIcon, Group, MantineSize, Stack, Text} from "@mantine/core";
import {useDebounceCallback, useDebouncedValue} from "@mantine/hooks";

import PageHeader from "@/components/header/PageHeader";
import {CODEC_TEXT, FORMAT_TEXT, STATUS_MAP} from "@/utils/constants";
import {StreamIsActive, SanitizeUrl, VideoBitrateReadable, SortTable} from "@/utils/helpers";
import {dataStore} from "@/stores";
import {StreamProps} from "components/components";
import StatusText from "@/components/header/StatusText";

interface TableCellTextProps {
  fw?: number;
  children: ReactNode;
  truncate?: boolean;
  dimmed?: boolean;
  size?: MantineSize
}

const TableCellText = ({fw=400, children, truncate=false, dimmed=false, size="sm"}: TableCellTextProps) => {
  return (
    <Text
      size={size}
      fw={fw}
      truncate={truncate ? "end" : undefined}
      c={dimmed ? "elv-gray.7" : "black"}
    >
      { children }
    </Text>
  );
};

const Streams = observer(() => {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<StreamProps>>({columnAccessor: "title", direction: "asc"});
  const [filter, setFilter] = useState("");
  const [debouncedFilter] = useDebouncedValue(filter, 200);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const Load = async() => {
      try {
        await dataStore.LoadAllStreamData();
      } finally {
        setLoading(false);
      }
    };

    Load();
  }, []);

  const DebouncedRefresh = useDebounceCallback(async() => {
    await dataStore.LoadAllStreamData();
  }, 500);

  const records = Object.values(dataStore.streams || {})
    .filter(record => !debouncedFilter || (record.title || "").toLowerCase().includes(debouncedFilter.toLowerCase()))
    .sort(SortTable({sortStatus}));

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
        fetching={loading}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        columns={[
          { accessor: "title", title: "Name", sortable: true, render: record => (
              <Stack gap={2}>
                <Link to={`/streams/${record.objectId}`}>
                  <TableCellText fw={600}>{record.title}</TableCellText>
                </Link>
                <TableCellText dimmed size="xs">{record.objectId}</TableCellText>
              </Stack>
            )},
          { accessor: "originUrl", title: "URL", render: record => <TableCellText truncate>{SanitizeUrl({url: record.originUrl})}</TableCellText> },
          { accessor: "format", title: "Format", render: record => <TableCellText>{record.format ? FORMAT_TEXT[record.format] : ""}</TableCellText> },
          { accessor: "video", title: "Video", render: record => <TableCellText fw={600}>{record.codecName ? CODEC_TEXT[record.codecName] : ""} {VideoBitrateReadable(record.videoBitrate)}</TableCellText> },
          { accessor: "audioStreams", title: "Audio", render: record => <TableCellText fw={600}>{record.audioStreamCount ? `${record.audioStreamCount} ${record.audioStreamCount > 1 ? "streams" : "stream"}` : ""}</TableCellText> },
          {
            accessor: "status",
            title: "Status",
            sortable: true,
            render: record => !record.status ? null :
              <StatusText
                status={record.status}
                quality={record.quality}
              />
          },
          // {
          //   accessor: "actions",
          //   title: "",
          //   render: record => {
          //     return (
          //       <Group gap="xxs" justify="right">
          //         {
          //           ![STATUS_MAP.UNINITIALIZED, STATUS_MAP.INACTIVE].includes(record.status) ? null :
          //             <ActionIcon
          //               title="Check Stream"
          //               variant="subtle"
          //               color="gray.6"
          //               onClick={async () => {
          //                 const url = await streamStore.client.ContentObjectMetadata({
          //                   libraryId: await streamStore.client.ContentObjectLibraryId({objectId: record.objectId}),
          //                   objectId: record.objectId,
          //                   metadataSubtree: "live_recording_config/url"
          //                 });
          //
          //                 setModalData({
          //                   objectId: record.objectId,
          //                   showModal: true,
          //                   title: "Check Stream",
          //                   description: record.status === STATUS_MAP.INACTIVE ? "Are you sure you want to check the stream? This will override your saved configuration." : "Are you sure you want to check the stream?",
          //                   loadingText: `Please send your stream to ${SanitizeUrl({url}) || "the URL you specified"}.`,
          //                   ConfirmCallback: async () => {
          //                     await streamStore.ConfigureStream({
          //                       objectId: record.objectId,
          //                       slug: record.slug
          //                     });
          //                   },
          //                   CloseCallback: () => ResetModal()
          //                 });
          //               }}
          //             >
          //               <IconListCheck />
          //             </ActionIcon>
          //         }
          //         {
          //           !record.status || ![STATUS_MAP.INACTIVE, STATUS_MAP.STOPPED].includes(record.status) ? null :
          //             <ActionIcon
          //               title="Start Stream"
          //               variant="subtle"
          //               color="gray.6"
          //               onClick={() => {
          //                 setModalData({
          //                   objectId: record.objectId,
          //                   showModal: true,
          //                   title: "Start Stream",
          //                   description: "Are you sure you want to start the stream?",
          //                   ConfirmCallback: async () => {
          //                     await streamStore.StartStream({slug: record.slug});
          //                   },
          //                   CloseCallback: () => ResetModal()
          //                 });
          //               }}
          //             >
          //               <IconPlayerPlay />
          //             </ActionIcon>
          //         }
          //         {
          //           !record.status || record.status !== STATUS_MAP.STOPPED ? null :
          //             <ActionIcon
          //               title="Deactivate Stream"
          //               variant="subtle"
          //               color="gray.6"
          //               onClick={() => {
          //                 setModalData({
          //                   objectId: record.objectId,
          //                   showModal: true,
          //                   title: "Deactivate Stream",
          //                   description: "Are you sure you want to deactivate the stream?",
          //                   ConfirmCallback: async () => {
          //                     await streamStore.DeactivateStream({
          //                       slug: record.slug,
          //                       objectId: record.objectId
          //                     });
          //                   },
          //                   CloseCallback: () => ResetModal()
          //                 });
          //               }}
          //             >
          //               <IconCircleX />
          //             </ActionIcon>
          //         }
          //         {
          //           !record.status || ![STATUS_MAP.STARTING, STATUS_MAP.RUNNING, STATUS_MAP.STALLED].includes(record.status) ? null :
          //             <>
          //               <ActionIcon
          //                 component={Link}
          //                 to={`/streams/${record.objectId}/preview`}
          //                 title="View Stream"
          //                 variant="subtle"
          //                 color="gray.6"
          //               >
          //                 <IconDeviceAnalytics />
          //               </ActionIcon>
          //               <ActionIcon
          //                 title="Stop Stream"
          //                 variant="subtle"
          //                 color="gray.6"
          //                 onClick={() => {
          //                   setModalData({
          //                     objectId: record.objectId,
          //                     showModal: true,
          //                     title: "Stop Stream",
          //                     description: "Are you sure you want to stop the stream?",
          //                     ConfirmCallback: async () => {
          //                       await streamStore.OperateLRO({
          //                         objectId: record.objectId,
          //                         slug: record.slug,
          //                         operation: "STOP"
          //                       });
          //                     },
          //                     CloseCallback: () => ResetModal()
          //                   });
          //                 }}
          //               >
          //                 <IconPlayerStop />
          //               </ActionIcon>
          //             </>
          //         }
          //         <ActionIcon
          //           title="Open in Fabric Browser"
          //           variant="subtle"
          //           color="gray.6"
          //           onClick={() => editStore.client.SendMessage({
          //             options: {
          //               operation: "OpenLink",
          //               libraryId: record.libraryId,
          //               objectId: record.objectId
          //             },
          //             noResponse: true
          //           })}
          //         >
          //           <IconExternalLink />
          //         </ActionIcon>
          //         <ActionIcon
          //           title="Delete Stream"
          //           variant="subtle"
          //           color="gray.6"
          //           disabled={StreamIsActive(record.status)}
          //           onClick={() => {
          //             setModalData({
          //               objectId: record.objectId,
          //               showModal: true,
          //               title: "Delete Stream",
          //               description: "Are you sure you want to delete the stream? This action cannot be undone.",
          //               ConfirmCallback: async () => {
          //                 await editStore.DeleteStream({objectId: record.objectId});
          //               },
          //               CloseCallback: () => ResetModal()
          //             });
          //           }}
          //         >
          //           <IconTrash />
          //         </ActionIcon>
          //       </Group>
          //     );
          //   }
          // }
        ]}
      />
    </>
  );
});

export default Streams;
