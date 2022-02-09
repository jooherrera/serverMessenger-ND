class ServerMessenger {
    constructor(errors, successes) {
        this.sendMessageError = (errorType, error, from) => {
            if (errorType !== '') {
                if (this.errors[errorType]) {
                    return this.errors[errorType];
                }
                else {
                    return { serverMsg: 'No existe el tipo de error ingresado' };
                }
            }
            else {
                return Object.assign(Object.assign({}, error), { from: (error === null || error === void 0 ? void 0 : error.from) ? error.from : from, serverMsg: (error === null || error === void 0 ? void 0 : error.serverMsg) ? error.serverMsg : error === null || error === void 0 ? void 0 : error.message });
            }
        };
        this.sendMessageOk = (successType) => {
            return this.successes[successType];
        };
        this.errors = errors;
        this.successes = successes;
    }
}
class ResponseND {
    constructor(customMsg) {
        this.success = ({ res, clientMsg, data = '' }) => {
            res.status(clientMsg.code || 200).send({
                error: '',
                body: {
                    message: clientMsg.clientMsg || '',
                    data: data,
                },
            });
        };
        this.error = ({ res, err }) => {
            res.status(err.code || 500).send({
                error: err.clientMsg || this.customMsg,
                body: '',
            });
        };
        this.customMsg = customMsg;
    }
}
export { ResponseND, ServerMessenger };
