import JSONAPIError from "./jsonApi.error";

export default class RecordNotFoundError extends JSONAPIError {
  constructor(detail: string) {
    super(
      {
        status: "Not Found",
        title: "Record not found",
        detail: detail,
      },
      404
    );
    this.name = RecordNotFoundError.name.replace(/[A-Z]/g, "_$1").toUpperCase();
    this.message = detail;
  }
}
