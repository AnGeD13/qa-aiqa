import { test, expect } from '@playwright/test';
import {
  deleteUserViaApi,
  makeUser,
  registerUserViaApi,
  TestUser,
} from '../../helpers/user';
import { LoginPage } from '../../pages/login-page';
import { Header } from '../../components/header';

test.describe('Вход в систему', () => {
  let loginPage: LoginPage;
  let user: TestUser;
  let header: Header;

  test.beforeEach(async ({ page }) => {
    user = makeUser('login', Date.now());
    await registerUserViaApi(page.request, user);
    loginPage = new LoginPage(page);
    header = new Header(page);
    await loginPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.request);
  });

  test('Вход с верными email и паролем', async ({ page }) => {
    await test.step('Заполнить форму', async () => {
      await loginPage.fillEmail(user.email);
      await loginPage.fillPassword(user.password);
    });

    await test.step('Отправить форму', async () => {
      await loginPage.submit();
    });

    await test.step('Проверить, что пользователь вошел в систему', async () => {
      await expect(page).toHaveURL(/\/pomidorqa\/?$/);
      await expect(header.logoutButton).toBeVisible();
    });
  });

  test('Вход с валидным email и неверным паролем', async () => {
    const wrongPassword = `${user.password}-wrong`;

    await test.step('Заполнить форму', async () => {
      await loginPage.fillEmail(user.email);
      await loginPage.fillPassword(wrongPassword);
    });

    await test.step('Отправить форму', async () => {
      await loginPage.submit();
    });

    await test.step('Проверить, что ошибка отображается', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test('Вход с несуществующим email и валидным паролем', async () => {
    const nonExistentEmail = makeUser('non-existent', Date.now()).email;

    await test.step('Заполнить форму', async () => {
      await loginPage.fillEmail(nonExistentEmail);
      await loginPage.fillPassword(user.password);
    });

    await test.step('Отправить форму', async () => {
      await loginPage.submit();
    });

    await test.step('Проверить, что ошибка отображается', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });
});
