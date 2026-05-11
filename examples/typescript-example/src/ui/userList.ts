// UI module that depends on services (cross-layer dependency for testing)
import { UserService } from '../services/user';
import { Logger } from '../utils/logger';

export class UserListPage {
  private userService: UserService;
  private logger: Logger;

  constructor() {
    this.userService = new UserService();
    this.logger = new Logger('UserListPage');
  }

  renderUsers(): string {
    const users = this.userService.getAll();
    return `<ul>${users.map((u) => `<li>${u.name}</li>`).join('')}</ul>`;
  }
}

export function formatUser(name: string): string {
  return `User: ${name}`;
}
