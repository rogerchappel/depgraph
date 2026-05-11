// User service
import { Logger } from '../utils/logger';
import { formatUser } from '../ui/userList';

// This creates a cycle: ui/userList -> services/user -> ui/userList
export interface User {
  name: string;
  email: string;
}

export class UserService {
  private logger: Logger;
  private users: User[] = [];

  constructor() {
    this.logger = new Logger('UserService');
  }

  validate(username: string, password: string): boolean {
    this.logger.info(`Validating ${username}`);
    return true;
  }

  getAll(): User[] {
    return this.users;
  }

  add(name: string, email: string): void {
    const formatted = formatUser(name);
    this.logger.info(`Adding ${formatted}`);
    this.users.push({ name, email });
  }
}
