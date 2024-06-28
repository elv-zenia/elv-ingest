import {Flex, Title} from "@mantine/core";
import {observer} from "mobx-react-lite";
import SearchBar from "@/components/header/SearchBar";
import JobsActivity from "@/components/header/JobsActivity";
import TopActions, {ActionProps} from "@/components/header/TopActions";
import {StatusType} from "components/stream";
import StatusText from "@/components/header/StatusText";

interface PageHeaderProps {
  title: string;
  showSearchBar?: boolean;
  showJobsButton?: boolean;
  actions?: ActionProps[];
  searchValue?: string;
  SearchValueCallback?: (arg: string) => void;
  status?: StatusType
}

const PageHeader = observer(({
  title,
  showSearchBar=false,
  showJobsButton=true,
  actions=[],
  searchValue,
  SearchValueCallback,
  status
}: PageHeaderProps) => {
  return (
    <Flex direction="column" mb="15px">
      <Flex direction="row" align="center" justify="space-between">
        {showSearchBar && <SearchBar value={searchValue!} setValue={SearchValueCallback!} />}
        {
          actions.length > 0 ?
            <TopActions actions={actions} /> : null
        }
        {showJobsButton && <JobsActivity />}
      </Flex>
      {
        title &&
        <Flex direction="row" align="center" mt="32px" gap={10}>
          <Title size="h3">{title}</Title>
          {
            status &&
            <StatusText status={status} withBorder />
          }
        </Flex>
      }
    </Flex>
  );
});

export default PageHeader;
