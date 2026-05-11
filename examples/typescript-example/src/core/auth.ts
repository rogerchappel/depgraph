// Core auth module
import { Logger } from '../utils/logger';
import { UserService } from '../services/user';

export class Auth {
  private logger: Logger;
  private userService: UserService;

  constructor() {
    this.logger = new Logger('Auth');
    this.userService = new UserService();
  }

  login(username: string, password: string): boolean {
    this.logger.info(`Login attempt for ${username}`);
    return this.userService.validate(username, password);
  }
}
