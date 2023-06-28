import { Box, Flex } from "@chakra-ui/react";
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import GeneralTableLayout from "./general-table-layout";
import {useState} from "react";

export const GeneralTable = ({ data, columns }) => {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Box
        height="inherit"
        display="flex"
        flex="1 0 auto"
        borderRadius="1rem"
        border="1px solid"
        borderColor="var(--ck-colors-chakra-border-color)"
        padding="1rem"
    >
      <Flex direction="column" flex="1 0 auto">
        <GeneralTableLayout isSelectable={false} table={table} />
      </Flex>
    </Box>
  );
};
