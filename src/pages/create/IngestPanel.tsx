import {Title, Text, Anchor, Radio, Stack} from "@mantine/core";
import {UPLOAD_TYPES} from "@/utils/constants";
import {useState} from "react";
import classes from "@/assets/stylesheets/Title.module.css";

const IngestPanel = () => {
  const [uploadType, setUploadType] = useState(UPLOAD_TYPES[0].value);

  return (
    <>
      <Title size="1.25rem" fw={600} className={classes.title} mb="16px">Upload New Media</Title>
      <Text size="xs" mb="8px">
        {/* TODO: Add links here */}
        Current ingest settings will apply to all videos. <Anchor href="/">View/Edit Defaults</Anchor>
      </Text>
      <Text size="xs" mb="16px">
        If your video/audio are in separate files, <Anchor href="/">click here</Anchor>.
      </Text>
      <Radio.Group
        name="uploadType"
        value={uploadType}
        onChange={setUploadType}
      >
        <Stack>
          {
            UPLOAD_TYPES.map(type => (
              <Radio
                key={`upload-type-${type.value}`}
                label={type.label}
                value={type.value}
                size="xs"
                variant="outline"
              />
            ))
          }
        </Stack>
      </Radio.Group>
    </>
  );
};

export default IngestPanel;
