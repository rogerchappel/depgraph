// Main entry point
import { Auth } from './core/auth';
import { LoginPage } from './ui/loginPage';
import { Logger } from './utils/logger';

const logger = new Logger('App');

const auth = new Auth();
const loginPage = new LoginPage();

logger.info('App initialized');
console.log(loginPage.render());
