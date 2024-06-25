import classes from "@/assets/stylesheets/Tabs.module.css";
import {Flex, Tabs} from "@mantine/core";
import Button from "@/components/common/Button";
import {ReactElement, useState} from "react";

interface TabToolbarProps {
  defaultTab: string;
  tabs: {value: string, label: string, Component: () => ReactElement}[];
  rightActions?: {label: string, OnClick: () => void}[];
}

const TabToolbar = ({
  defaultTab,
  tabs=[],
  rightActions=[]
}: TabToolbarProps) => {
  const [activeTab, setActiveTab] = useState<string|null>(defaultTab);

  return (
    <>
      <Tabs value={activeTab} onChange={setActiveTab} flex={1}>
        <Flex direction="row" w="100%" className={classes.flexbox}>
          <Tabs.List className={classes.list}>
            {
              tabs.map(({value, label}) => (
                <Tabs.Tab
                  className={classes.tab}
                  value={value}
                  key={`tabs-${value}`}
                >
                  { label }
                </Tabs.Tab>
              ))
            }
          </Tabs.List>
          {
            rightActions.map(({label, OnClick}) => (
              <Button onClick={OnClick} key={`right-action-${label}`}>{ label }</Button>
            ))
          }
        </Flex>
          {
            tabs.map(tab => (
              <Tabs.Panel
                key={`tab-panel-${tab.value}`}
                value={tab.value}
                pt={16}
              >
                <tab.Component />
              </Tabs.Panel>
            ))
          }
      </Tabs>
    </>
  );
};

export default TabToolbar;
