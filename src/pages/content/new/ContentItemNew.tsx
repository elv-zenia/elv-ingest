import PageHeader from "@/components/header/PageHeader";
import {useNavigate} from "react-router-dom";
import {CREATE_TABS} from "@/utils/constants";
import classes from "@/assets/stylesheets/ContentItemNew.module.css";
import TabToolbar from "@/components/common/TabToolbar";

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
      <TabToolbar
        defaultTab="ingest-details"
        tabs={CREATE_TABS}
      />
    </>
  );
};

export default ContentItemNew;
