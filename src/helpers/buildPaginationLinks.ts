import { PaginationMeta } from "./interfaces";

export default function buildPaginationLinks(
  urlBase: string,
  currentPath: string,
  paginationMeta: PaginationMeta
) {
  const url = new URL(currentPath, urlBase);
  url.searchParams.set("page[size]", paginationMeta.pageSize.toString());
  url.searchParams.set("page[number]", paginationMeta.pageNumber.toString());
  const self = url.toString();

  url.searchParams.set("page[number]", "1");
  const first = url.toString();

  url.searchParams.set("page[number]", paginationMeta.pageCount.toString());
  const last = url.toString();

  let prev = null;
  if (paginationMeta.pageNumber != 1) {
    url.searchParams.set(
      "page[number]",
      (paginationMeta.pageNumber - 1 > 1
        ? paginationMeta.pageNumber - 1
        : 1
      ).toString()
    );
    prev = url.toString();
  }

  let next = null;
  if (paginationMeta.pageNumber < paginationMeta.pageCount) {
    url.searchParams.set(
      "page[number]",
      (paginationMeta.pageNumber + 1 < paginationMeta.pageCount
        ? paginationMeta.pageNumber + 1
        : paginationMeta.pageCount
      ).toString()
    );
    next = url.toString();
  }

  return {
    self,
    first,
    last,
    prev,
    next,
  };
}
