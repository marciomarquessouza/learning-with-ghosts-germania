import { useCallback, useEffect, useMemo, useState } from "react";

export interface Pagination<T> {
  list: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPagination: boolean;
  showPrevious: boolean;
  showNext: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
}

export function usePagination<T>(list: T[], limit = 5): Pagination<T> {
  const pageSize = Math.max(1, limit);
  const listSize = list.length;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(listSize / pageSize)),
    [listSize, pageSize]
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const pageItems = useMemo(() => list.slice(start, end), [list, start, end]);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.min(Math.max(1, Math.trunc(page)), totalPages);
      setCurrentPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (!isLastPage) setCurrentPage((p) => p + 1);
  }, [isLastPage]);

  const previousPage = useCallback(() => {
    if (!isFirstPage) setCurrentPage((p) => p - 1);
  }, [isFirstPage]);

  return {
    list: pageItems,
    currentPage,
    totalPages,
    pageSize,
    hasPagination: listSize > pageSize,
    showPrevious: !isFirstPage,
    showNext: !isLastPage,
    nextPage,
    previousPage,
    goToPage,
  };
}
