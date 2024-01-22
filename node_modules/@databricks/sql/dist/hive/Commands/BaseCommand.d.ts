import TCLIService from '../../../thrift/TCLIService';
export default abstract class BaseCommand {
    protected client: TCLIService.Client;
    constructor(client: TCLIService.Client);
    executeCommand<Response>(request: object, command: Function | void): Promise<Response>;
}
