import {observer} from "mobx-react-lite";
import {Box, Loader} from "@mantine/core";
import {useParams} from "react-router";
import {FormEventHandler, useEffect, useState} from "react";
import AudioTracksTable from "@/pages/stream-details/audio/AudioTracksTable";
import {streamStore} from "@/stores";
import {flowResult} from "mobx";
import {AudioFormData} from "components/stream";
import Button from "@/components/common/Button";

const AudioPanel = observer(() => {
  const params = useParams();
  const [audioTracks, setAudioTracks] = useState([]);
  const [formData, setFormData] = useState<AudioFormData>({});
  const [applyingChanges, setApplyingChanges] = useState(false);

  const LoadConfigData = async () => {
    const {audioStreams, audioData} = await flowResult(streamStore.LoadStreamProbeData({
      objectId: params.id
    }));

    setAudioTracks(audioStreams);
    setFormData(audioData);
  };

  useEffect(() => {
    if(params.id) {
      LoadConfigData();
    }
  }, [params.id]);

  const HandleSubmit: FormEventHandler<HTMLFormElement> = async(event) => {
    event.preventDefault();
    if(!params.id) { return; }

    try {
      setApplyingChanges(true);

      const slug = streamStore.StreamIdToSlug({objectId: params.id});

      await flowResult(streamStore.UpdateStreamAudioSettings({
        objectId: params.id,
        slug,
        audioData: formData
      }));

      await LoadConfigData();

      // notifications.show({
      //   title: `${title || params.id} updated`,
      //   message: "Settings have been applied successfully"
      // });
    } catch(error) {
      console.error("Unable to configure audio settings", error);

      // notifications.show({
      //   title: "Error",
      //   color: "red",
      //   message: "Unable to apply settings"
      // });
    } finally {
      setApplyingChanges(false);
    }
  };

  return (
    <>
      <Box mb="24px" maw="60%">
        <form onSubmit={HandleSubmit}>
          <AudioTracksTable
            records={audioTracks}
            audioFormData={formData}
            setAudioFormData={setFormData}
          />
          <Box mt="24px">
            <Button
              type="submit"
              disabled={applyingChanges}
              uppercase
            >
              {applyingChanges ? <Loader type="dots" className="modal__loader"/> : "Apply"}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
});

export default AudioPanel;
