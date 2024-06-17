import {observer} from "mobx-react-lite";
import PageHeader from "@/components/header/PageHeader";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {dataStore} from "@/stores";
import {Loader, Tabs} from "@mantine/core";
import {LiveRecordingCopiesProps} from "components/components";
import {useNavigate} from "react-router-dom";
import classes from "@/assets/stylesheets/Tabs.module.css";
import {flowResult} from "mobx";

const StreamDetails = observer(() => {
  const params = useParams();
  const [streamSlug, setStreamSlug] = useState("");
  const [recordingData, setRecordingData] = useState<LiveRecordingCopiesProps | null>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string|null>("details");
  const [status, setStatus] = useState("");

  const TABS = [
    {title: "Details", value: "details"},
    // {title: "Ingest", value: "ingest"},
    // {title: "Status", value: "status"},
    {title: "Playout", value: "playout"},
    {title: "Audio", value: "audio"}
    // {title: "View Stream", value: "view-stream"},
  ];

  const LoadStatus = async () => {
    const response = await flowResult(dataStore.LoadStreamStatus({
      objectId: params.id!,
      update: true
    }));

    if(response?.state) {
      setStatus(response.state);
    }
  };

  const LoadEdgeWriteTokenData = async() => {
    const metadata = await dataStore.LoadEdgeWriteTokenData({
      objectId: params.id!
    }) as LiveRecordingCopiesProps;

    if(metadata) {
      metadata.live_offering = (metadata.live_offering || []).map((item, i) => ({
        ...item,
        id: i
      }));

      setRecordingData(metadata);
    }
  };

  useEffect(() => {
    let eventSource: EventSource;
    const Load = async() => {
      if(!dataStore.streams) {
        await dataStore.LoadAllStreamData();
        await dataStore.LoadAllStreamStatus();
      }

      if(params.id) {
        const slug = dataStore.StreamIdToSlug({objectId: params.id});
        setStreamSlug(slug);

        await LoadStatus();
        await LoadEdgeWriteTokenData();
        // eventSource = await dataStore.ListenForUpdate({objectId: params.id}) as EventSource;
      }
    };

    Load();

    return () => {
      eventSource?.close();
    };
  }, [params.id]);

  const stream = dataStore.streams[streamSlug];

  if(!stream) { return <Loader />; }

  return (
    <>
      <PageHeader
        title={`Edit ${stream.title || "Livestream"}`}
        status={status}
        actions={[
          {
            label: "Back",
            variant: "filled",
            uppercase: true,
            onClick: () => navigate(-1)
          },
          {
            label: "Delete This Stream",
            variant: "outline",
            uppercase: true
          }
        ]}
      />
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          {
            TABS.map(({value, title}) => (
              <Tabs.Tab
                className={classes.tab}
                value={value}
                key={`tabs-${value}`}
              >
                { title }
              </Tabs.Tab>
            ))
          }
        </Tabs.List>
      </Tabs>
    </>
  );
});

export default StreamDetails;
