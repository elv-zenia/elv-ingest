import {Flex, Title} from "@mantine/core";
import {observer} from "mobx-react-lite";
import SearchBar from "@/components/header/SearchBar";
import JobsActivity from "@/components/header/JobsActivity";
import TopActions, {ActionProps} from "@/components/header/TopActions";

interface PageHeaderProps {
  title: string;
  showSearchBar?: boolean;
  showJobsButton?: boolean;
  actions?: ActionProps[];
}

const PageHeader = observer(({
  title,
  showSearchBar=false,
  showJobsButton=true,
  actions=[]
}: PageHeaderProps) => {
  return (
    <Flex direction="column" mb="15px">
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
