import PageHeader from "@/components/header/PageHeader";
import {useNavigate} from "react-router-dom";
import {Tabs, Text} from "@mantine/core";
import {CREATE_TABS} from "@/utils/constants";
import classes from "@/assets/stylesheets/ContentItemNew.module.css";

const ContentItemNew = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        // TODO: Set object title
        title={"Create New Video on Demand"}
        actions={[
          {
            label: "Back",
            variant: "filled",
            uppercase: true,
            onClick: () => navigate(-1)
          },
          {
            label: "Delete This Asset",
            variant: "outline",
            uppercase: true,
            // TODO: Add delete object logic
            onClick: () => {}
          }
        ]}
      />
      <Tabs className={classes.root} defaultValue="ingest-details">
        <Tabs.List className={classes.list}>
          {
            CREATE_TABS.map(tab => (
              <Tabs.Tab value={tab.value} key={`create-tabs-${tab.value}`} className={classes.tab} color="elv-violet.10">
                <Text fw="700" size="sm">{tab.label}</Text>
              </Tabs.Tab>
            ))
          }
        </Tabs.List>
        {
          CREATE_TABS.map(tab => (
            <Tabs.Panel value={tab.value} key={`create-panel-${tab.value}`}>
              <tab.Component />
            </Tabs.Panel>
          ))
        }
      </Tabs>
    </>
  );
};

export default ContentItemNew;
