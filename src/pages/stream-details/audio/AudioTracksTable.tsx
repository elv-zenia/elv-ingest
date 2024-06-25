import {observer} from "mobx-react-lite";
import {DataTable} from "mantine-datatable";
import {Checkbox, Select, Text, TextInput} from "@mantine/core";
import {AudioBitrateReadable, AudioCodec} from "@/utils/helpers";
import {RECORDING_BITRATE_OPTIONS} from "@/utils/constants";
import {AudioFormDataProps, AudioTracksTableProps} from "components/components";

const AudioTracksTable = observer(({
  records,
  audioFormData={},
  setAudioFormData,
  disabled
}: AudioTracksTableProps) => {
  const HandleFormChange = ({index, property, value}: {index: number, property: keyof AudioFormDataProps[number], value: string | boolean | number | null | undefined}) => {
    const audioIndexSpecific: AudioFormDataProps[number] = audioFormData[index];

    if(Object.hasOwn(audioIndexSpecific, property)) {
      (audioIndexSpecific as Record<typeof property, typeof value>)[property] = value;
    }

    const formValue: AudioFormDataProps = {
      ...audioFormData || {},
      [index]: audioIndexSpecific
    };

    setAudioFormData(formValue);
  };

  return (
    <DataTable
      idAccessor="stream_index"
      noRecordsText="No audio tracks found"
      minHeight={records.length > 0 ? 350 : 200}
      fetching={!disabled && !audioFormData}
      records={records}
      withColumnBorders
      groups={[
        {
          id: "input",
          title: "Input",
          style: {fontStyle: "italic", fontSize: "1.125rem"},
          columns: [
            {
              accessor: "stream_index",
              title: "Index",
              render: item => (
                <Text>{ item.stream_index }</Text>
              )
            },
            {
              accessor: "codec_name",
              title: "Codec",
              render: item => (
                <Text>
                  { AudioCodec(item.codec_name) }</Text>
              )
            },
            {
              accessor: "bit_rate",
              title: "Bitrate",
              render: item => (
                <Text>{ AudioBitrateReadable(item.bit_rate) }</Text>
              )
            }
          ]
        },
        {
          id: "output",
          title: "Output",
          style: {fontStyle: "italic", fontSize: "1.125rem"},
          columns: [
            {
              accessor: "playout_label",
              title: "Label",
              render: item => {
                return (
                  <TextInput
                    value={audioFormData[item.stream_index].playout_label}
                    disabled={disabled}
                    required={audioFormData[item.stream_index].record}
                    onInvalid={event => {
                      const targetElement = event.target as HTMLInputElement;
                      targetElement.setCustomValidity("Label cannot be empty when enabling Playout");
                    }}
                    onInput={event => {
                      const targetElement = event.target as HTMLInputElement;
                      targetElement.setCustomValidity("");
                    }}
                    onChange={(event) => {
                      HandleFormChange({
                        index: item.stream_index,
                        property: "playout_label",
                        value: event.target.value
                      });
                    }}
                  />
                );
              }
            },
            {
              accessor: "output_bitrate",
              title: "Bitrate",
              render: item => (
                <Select
                  label=""
                  style={{minWidth: "125px"}}
                  data={RECORDING_BITRATE_OPTIONS}
                  disabled={disabled}
                  onChange={(value) => {
                    HandleFormChange({
                      index: item.stream_index,
                      property: "recording_bitrate",
                      value: value?.toString()
                    });
                  }}
                  value={audioFormData[item.stream_index].recording_bitrate}
                />
              )
            },
            {
              accessor: "action_record",
              title: "Record",
              width: 75,
              render: item => (
                <Checkbox
                  checked={audioFormData[item.stream_index].record}
                  disabled={disabled}
                  onChange={(event) => {
                    const value = event.target.checked;
                    HandleFormChange({
                      index: item.stream_index,
                      property: "record",
                      value
                    });

                    // Make sure playout is set to false when record is false
                    if(!value) {
                      HandleFormChange({
                        index: item.stream_index,
                        property: "playout",
                        value: false
                      });
                    }
                  }}
                />
              )
            },
            {
              accessor: "action_playout",
              title: "Playout",
              width: 75,
              render: item => (
                <Checkbox
                  checked={audioFormData[item.stream_index].playout}
                  onChange={(event) => {
                    HandleFormChange({
                      index: item.stream_index,
                      property: "playout",
                      value: event.target.checked
                    });
                  }}
                  disabled={!audioFormData[item.stream_index].record || disabled}
                />
              )
            }
          ]
        }
      ]}
    />
  );
});

export default AudioTracksTable;
