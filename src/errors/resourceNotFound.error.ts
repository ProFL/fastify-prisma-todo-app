import { ReasonPhrases, StatusCodes } from "http-status-codes";
import JSONAPIError from "./jsonApi.error";

export default class ResourceNotFoundError extends JSONAPIError {
  constructor(detail: string) {
    super(
      {
        status: ReasonPhrases.NOT_FOUND,
        title: "Required resource not found",
        detail: detail,
      },
      StatusCodes.NOT_FOUND
    );
    this.name = ResourceNotFoundError.name
      .replace(/[A-Z]/g, "_$1")
      .toUpperCase();
    this.message = detail;
  }
}
