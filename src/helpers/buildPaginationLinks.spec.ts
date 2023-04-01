import buildPaginationLinks from "./buildPaginationLinks";

describe("buildPaginationLinks", () => {
  it("should build JSON:API pagination links from the baseURL, the current path and pagination metadata", () => {
    const baseUrl = "http://localhost:3000";
    const path = "/tasks";
    const paginationMeta = {
      pageSize: 2,
      pageNumber: 2,
      pageCount: 10,
    };

    const links = buildPaginationLinks(baseUrl, path, paginationMeta);

    expect(links).toEqual({
      self: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=2",
      first: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=1",
      last: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=10",
      prev: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=1",
      next: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=3",
    });
  });

  it("prev link should be null if in the first page", () => {
    const baseUrl = "http://localhost:3000";
    const path = "/tasks";
    const paginationMeta = {
      pageSize: 2,
      pageNumber: 2,
      pageCount: 10,
    };

    const links = buildPaginationLinks(baseUrl, path, paginationMeta);

    expect(links).toEqual({
      self: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=2",
      first: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=1",
      last: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=10",
      prev: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=1",
      next: "http://localhost:3000/tasks?page%5Bsize%5D=2&page%5Bnumber%5D=3",
    });
  });
});
