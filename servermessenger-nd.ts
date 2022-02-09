import { IErrors, ISuccesses, IMsg, IErr, IResponseSuccess, IResponseError } from './index'

class ServerMessenger {
  private errors: IErrors
  private successes: ISuccesses

  constructor(errors: IErrors, successes: ISuccesses) {
    this.errors = errors
    this.successes = successes
  }
  sendMessageError = (errorType: string, error?: IErr, from?: string): IErr | IMsg => {
    if (errorType !== '') {
      if (this.errors[errorType]) {
        return this.errors[errorType]
      } else {
        return { serverMsg: 'No existe el tipo de error ingresado' }
      }
    } else {
      return {
        ...error,
        from: error?.from ? error.from : from,
        serverMsg: error?.serverMsg ? error.serverMsg : error?.message,
      }
    }
  }
  sendMessageOk = (successType: string): IMsg => {
    return this.successes[successType]
  }
}

class ResponseND {
  private customMsg: string
  constructor(customMsg: string) {
    this.customMsg = customMsg
  }

  success = ({ res, clientMsg, data = '' }: IResponseSuccess) => {
    res.status(clientMsg.code || 200).send({
      error: '',
      body: {
        message: clientMsg.clientMsg || '',
        data: data,
      },
    })
  }
  error = ({ res, err }: IResponseError) => {
    res.status(err.code || 500).send({
      error: err.clientMsg || this.customMsg,
      body: '',
    })
  }
}

export { ResponseND, ServerMessenger }
