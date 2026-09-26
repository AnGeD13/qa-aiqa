import { Locator, Page } from '@playwright/test';
import { ROUTES } from '../helpers/routes';

export class LoginPage {
  readonly page: Page;

  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitButton: Locator;

  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginEmailInput = page.getByLabel('Email');
    this.loginPasswordInput = page.getByLabel('Пароль');
    this.loginSubmitButton = page.getByRole('button', { name: 'Войти' });

    this.errorMessage = page.getByText('Неверный email или пароль');
  }

  async goto() {
    await this.page.goto(ROUTES.login);
  }

  async fillEmail(email: string) {
    await this.loginEmailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.loginPasswordInput.fill(password);
  }

  async submit() {
    await this.loginSubmitButton.click();
  }
}
