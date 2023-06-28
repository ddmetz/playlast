import { useState } from "react";
import { useRef } from "react";
import { Flex, VStack } from "@chakra-ui/react";
// import type { Table } from "@tanstack/react-table";
import GeneralTableRows from "./general-table-rows";
import GeneralTableHeader from "./general-table-header";

// interface GeneralTableLayoutProps<T> {
//   table: Table<T>;
//   isSelectable: boolean;
//   children?: ReactElement | ReactElement[];
// }

const GeneralTableLayout = ({ table }) => {
  const { rows } = table.getRowModel();
  const [tableContainerRef, setTableContainerRef] = useState(null);

  return (
    <VStack
      spacing={0}
      align="start"
      width="100%"
      height="100%"
      overflow="hidden"
      flex="0 1 100%"
      alignItems="stretch"
      position="relative"
      zIndex="1"
    >
      <Flex
        flexDirection="column"
        width="100%"
        maxW="100%"
        // bg="white"
        boxShadow="sm"
        flexGrow={1}
        // borderTop="1px solid"
        // borderTopColor="gray.200"
        // borderBottom="1px solid"
        // borderBottomColor="gray.200"
        ref={(ref) => setTableContainerRef(ref)}
        overflow="auto"
      >
        <GeneralTableHeader table={table} />
        <GeneralTableRows
          rows={rows}
          tableContainerRef={tableContainerRef}
          table={table}
        />
      </Flex>
    </VStack>
  );
};

export default GeneralTableLayout;
