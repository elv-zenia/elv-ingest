import PageHeader from "@/components/header/PageHeader.jsx";

const ContentItem = () => {
  return (
    <PageHeader
      // TODO: Set object title
      title={"Test"}
      actions={[
        {
          label: "Back",
          variant: "filled"
        },
        {
          label: "Delete This Object",
          variant: "outline"
        }
      ]}
    />
  );
};

export default ContentItem;
