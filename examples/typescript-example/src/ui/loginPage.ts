// UI login page
import { Auth } from '../core/auth';
import { Logger } from '../utils/logger';
import { Button } from './button';

export class LoginPage {
  private auth: Auth;
  private logger: Logger;

  constructor() {
    this.auth = new Auth();
    this.logger = new Logger('LoginPage');
  }

  render(): string {
    const submitBtn = new Button('Login');
    return `<form>${submitBtn.render()}</form>`;
  }

  handleSubmit(username: string, password: string): void {
    const success = this.auth.login(username, password);
    if (success) {
      this.logger.info('Login successful');
    } else {
      this.logger.error('Login failed');
    }
  }
}
