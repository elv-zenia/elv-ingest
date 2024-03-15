import {Flex, Title} from "@mantine/core";
import {observer} from "mobx-react-lite";
import SearchBar from "@/components/header/SearchBar.jsx";
import JobsActivity from "@/components/header/JobsActivity.jsx";
import TopActions from "@/components/header/TopActions.jsx";

const PageHeader = observer(({
  title,
  showSearchBar=false,
  showJobsButton=true,
  actions=[]
}) => {
  return (
    <Flex direction="column">
      <Flex direction="row" align="center" justify="space-between">
        {showSearchBar && <SearchBar/>}
        {
          actions.length > 0 ?
            <TopActions actions={actions} /> : null
        }
        {showJobsButton && <JobsActivity />}
      </Flex>
      {title && <Title size="h3" mt="32px">{title}</Title>}
    </Flex>
  );
});

export default PageHeader;
