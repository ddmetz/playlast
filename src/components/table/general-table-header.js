import { Box, Flex, chakra, Text } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
// import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

// export interface GeneralTableHeaderProps<T> {
//   table: Table<T>;
// }

const GeneralTableHeader = ({ table }) => (
  <Box
    width="min-content"
    minW="100%"
    position="sticky"
    top="0"
    zIndex={5}
    bg="var(--ck-colors-chakra-body-bg)"
    borderBottom="1px solid"
    borderBottomColor="var(--ck-colors-chakra-border-color)"
  >
    {table.getHeaderGroups().map((headerGroup) => (
      <Flex key={headerGroup.id} width="100%" alignItems="stretch">
        {headerGroup.headers.map((header) => (
          <Box
            key={header.id}
            position="relative"
            // borderX="1px solid"
            // borderColor="gray.700"
            marginLeft="-1px"
            width={`${header.getSize()}px`}
            _first={{
              borderLeft: "none",
            }}
          >
            <Box
              h="100%"
              role={header.id !== "select" ? "button" : undefined}
              textTransform="capitalize"
              fontWeight="600"
              fontSize="sm"
              letterSpacing="normal"
              p={0}
            >
              <Box height="100%" p={2}>
                <Flex
                  height="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    flex="1 1 auto"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    // textOverflow="ellipsis"
                    borderRadius="4px"
                    // _hover={{
                    //   bg: header.id !== "select" ? "var(--ck-colors-chakra-subtle-bg)" : "",
                    // }}
                    {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span style={{paddingLeft: 2}}>
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "desc" ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : (
                        <></>
                      )}
                    </span>
                  </Box>
                </Flex>
              </Box>
            </Box>
            {/* {header.column.id !== "select" ? (
              <Box
                opacity={header.column.getIsResizing() ? 1 : 0}
                _hover={{ opacity: 1 }}
                position="absolute"
                width="3px"
                height="100%"
                rounded="1.5px"
                bg="blue.500"
                right="-.5px"
                transform="translateX(50%)"
                top="0"
                zIndex={1}
                cursor="col-resize"
                transition=".345s ease all"
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                sx={{
                  userSelect: "none",
                  touchAction: "none",
                }}
              />
            ) : null} */}
          </Box>
        ))}
      </Flex>
    ))}
  </Box>
);

export default GeneralTableHeader;
