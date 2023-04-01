export interface JSONApiErrorData<MetaType = never> {
  id?: string;
  links?: {
    about?: string;
    type?: string;
  };
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
  meta?: MetaType;
}

export default class JSONAPIError<MetaType = never> extends Error {
  public readonly statusCode: number;
  public readonly jsonError: JSONApiErrorData<MetaType>;

  constructor(data: JSONApiErrorData<MetaType>, statusCode: number = 500) {
    super(data.detail);
    this.jsonError = data;
    this.name = JSONAPIError.name.replace(/[A-Z]/g, "_$1").toUpperCase();
    this.statusCode = statusCode;
  }
}
