import { memo, useMemo } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

const CellSkeleton = () => (
  <Skeleton rounded="md" height="20px" minW="20px" width="100%" />
);

function GeneralTableCellDisplay({ cell, isSkeletonRow }) {
  return (
    <Box
      fontSize="sm"
      fontWeight="500"
      p={2}
      position="relative"
      width={`${cell.column.getSize()}px`}
      marginLeft="-1px"
      marginBottom="-1px"
    >
      {isSkeletonRow ? (
        <CellSkeleton />
      ) : (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      )}
    </Box>
  );
}

const MemoGeneralTableCellDisplay = memo(GeneralTableCellDisplay);

function GeneralTableRowDisplay({
  row,
  virtualRow,
  measureElement,
  start,
  isSkeletonRow,
}) {
  return (
    <Box
      data-index={virtualRow.index}
      ref={measureElement}
      position="absolute"
      w="100%"
      top={0}
      left={0}
      style={{ transform: `translateY(${start}px)` }}
      willChange="transform"
      _focusWithin={{
        zIndex: 2,
      }}
      display="flex"
      borderBottom="1px solid"
      borderBottomColor="var(--ck-colors-chakra-border-color)"
    >
      {row.getVisibleCells().map((cell) => (
        <MemoGeneralTableCellDisplay
          key={cell.id}
          cell={cell}
          isSkeletonRow={isSkeletonRow}
        />
      ))}
    </Box>
  );
}

const MemoGeneralTableRowDisplay = memo(GeneralTableRowDisplay);

function GeneralTableRowWrapper({
  rows,
  virtualRow,
  measureElement,
  start,
  isSkeletonRow,
}) {
  const row = useMemo(
    () => (!isSkeletonRow ? rows[virtualRow.index] : rows[rows.length - 1]),
    [isSkeletonRow, rows, virtualRow.index]
  );

  return (
    <MemoGeneralTableRowDisplay
      row={row}
      virtualRow={virtualRow}
      measureElement={measureElement}
      start={start}
      isSkeletonRow={isSkeletonRow}
    />
  );
}

const MemoGeneralTableRowWrapper = memo(GeneralTableRowWrapper);

const GeneralTableRows = ({ rows, tableContainerRef, table }) => {
  const rowCount = rows.length;
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => tableContainerRef ?? undefined,
    getItemKey: (index) => rows[index]?.id ?? index,
    estimateSize: () => 37,
    overscan: 15,
  });

  const width = `${
    table.getTotalSize() - table.getVisibleLeafColumns().length
  }px`;
  const totalSize = rowVirtualizer.getTotalSize();
  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <Box
      height={totalSize}
      flexShrink={0}
      position="relative"
      w={width}
      minW="100%"
    >
      {virtualRows.map((virtualRow) => {
        const isSkeletonRow = virtualRow.index >= rows.length;
        return (
          <MemoGeneralTableRowWrapper
            rows={rows}
            key={isSkeletonRow ? `skeleton_${virtualRow.key}` : virtualRow.key}
            virtualRow={virtualRow}
            measureElement={rowVirtualizer.measureElement}
            start={virtualRow.start}
            isSkeletonRow={isSkeletonRow}
          />
        );
      })}
    </Box>
  );
};

export default GeneralTableRows;
