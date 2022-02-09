export declare interface IMsg {
  clientMsg: string
  code: number
}
export declare interface IErrors {
  [errorType: string]: any
  errors?: IMsg
}

export declare interface ISuccesses {
  [successType: string]: any
  successes?: IMsg
}

export declare interface IErr {
  from?: string
  serverMsg?: string
  message?: string
  code?: number
  clientMsg?: string
}

export declare interface IResponseSuccess {
  res: any
  clientMsg: IMsg
  data: any
}

export declare interface IResponseError {
  res: any
  err: IErr
}
