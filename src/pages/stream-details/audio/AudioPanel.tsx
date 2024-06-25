import {observer} from "mobx-react-lite";
import {Box, Loader} from "@mantine/core";
import {useParams} from "react-router";
import {FormEventHandler, useEffect, useState} from "react";
import AudioTracksTable from "@/pages/stream-details/audio/AudioTracksTable";
import {dataStore} from "@/stores";
import {flowResult} from "mobx";
import {AudioFormDataProps} from "components/components";

const AudioPanel = observer(() => {
  const params = useParams();
  const [audioTracks, setAudioTracks] = useState([]);
  const [formData, setFormData] = useState<AudioFormDataProps>();
  const [applyingChanges, setApplyingChanges] = useState(false);

  const LoadConfigData = async () => {
    const {audioStreams, audioData} = await flowResult(dataStore.LoadStreamProbeData({
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
    try {
      setApplyingChanges(true);

      // await streamStore.UpdateStreamAudioSettings({
      //   objectId: params.id,
      //   slug,
      //   audioData: formData
      // });

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
            <button
              type="submit"
              className="button__primary"
              disabled={applyingChanges}
            >
              {applyingChanges ? <Loader type="dots" className="modal__loader"/> : "Apply"}
            </button>
          </Box>
        </form>
      </Box>
    </>
  );
});

export default AudioPanel;
