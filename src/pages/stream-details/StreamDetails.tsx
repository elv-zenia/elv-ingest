import {observer} from "mobx-react-lite";
import PageHeader from "@/components/header/PageHeader";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {streamStore} from "@/stores";
import {Loader} from "@mantine/core";
import {LiveRecordingCopiesProps} from "components/stream";
import {useNavigate} from "react-router-dom";
import {flowResult} from "mobx";
import TabToolbar from "@/components/common/TabToolbar";
import AudioPanel from "@/pages/stream-details/audio/AudioPanel";

const StreamDetails = observer(() => {
  const params = useParams();
  const [streamSlug, setStreamSlug] = useState("");
  const [recordingData, setRecordingData] = useState<LiveRecordingCopiesProps | null>(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const TABS = [
    {label: "Details", value: "details", Component: () => <div></div>},
    // {label: "Ingest", value: "ingest"},
    // {label: "Status", value: "status"},
    {label: "Playout", value: "playout", Component: () => <div></div>},
    {label: "Audio", value: "audio", Component: AudioPanel}
    // {label: "View Stream", value: "view-stream"},
  ];

  const RIGHT_ACTIONS = [
    {label: "Start", OnClick: () => {}}
  ];

  const LoadStatus = async () => {
    const response = await flowResult(streamStore.LoadStreamStatus({
      objectId: params.id!,
      update: true
    }));

    if(response?.state) {
      setStatus(response.state);
    }
  };

  const LoadEdgeWriteTokenData = async() => {
    const metadata = await flowResult(streamStore.LoadEdgeWriteTokenData({
      objectId: params.id!
    })) as LiveRecordingCopiesProps;

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
      if(!streamStore.streams || Object.keys(streamStore.streams || {}).length < 1) {
        await streamStore.LoadAllStreamData();
        await streamStore.LoadAllStreamStatus();
      }

      if(params.id) {
        const slug = streamStore.StreamIdToSlug({objectId: params.id});
        setStreamSlug(slug);

        await LoadStatus();
        await LoadEdgeWriteTokenData();
        // eventSource = await streamStore.ListenForUpdate({objectId: params.id}) as EventSource;
      }
    };

    Load();

    return () => {
      eventSource?.close();
    };
  }, [params.id]);

  const stream = streamStore.streams[streamSlug];

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
      <TabToolbar
        defaultTab="details"
        tabs={TABS}
        rightActions={RIGHT_ACTIONS}
      />
    </>
  );
});

export default StreamDetails;
