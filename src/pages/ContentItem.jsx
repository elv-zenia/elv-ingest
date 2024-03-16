import PageHeader from "@/components/header/PageHeader.jsx";

const ContentItem = () => {
  return (
    <PageHeader
      // TODO: Set object title
      title={"Test"}
      actions={[
        {
          label: "Back",
          variant: "filled",
          uppercase: true
        },
        {
          label: "Delete This Object",
          variant: "outline",
          uppercase: true
        }
      ]}
    />
  );
};

export default ContentItem;
