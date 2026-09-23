import {
  APIRequestContext,
  BrowserContext,
  expect,
  Page,
} from '@playwright/test';
import { RegisterPage } from '../pages/register-page';
import { ROUTES } from './routes';

export type TestUser = {
  name: string;
  email: string;
  password: string;
};

export type RegisteredParticipant = {
  id: string;
  name: string;
  email: string;
};

export function makeUser(role: string, runId: number): TestUser {
  return {
    name: `${role} Автотест`,
    email: `${role}-${runId}@example.com`,
    password: "testpass123",
  };
}

export async function registerUser(page: Page, user: TestUser) {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  await registerPage.fillName(user.name);
  await registerPage.fillEmail(user.email);
  await registerPage.fillPassword(user.password);
  await registerPage.submit();

  await expect(page).toHaveURL(/\/pomidorqa\/?$/);
}

export async function registerUserViaApi(
  request: APIRequestContext,
  user: TestUser,
): Promise<RegisteredParticipant> {
  const response = await request.post(ROUTES.testAccounts, { data: user });

  if (response.status() !== 201) {
    throw new Error(
      `Регистрация ${user.email} не удалась: ${response.status()} ${await response.text()}`,
    );
  }

  return response.json();
}

export async function deleteUserViaApi(
  request: APIRequestContext,
): Promise<void> {
  const response = await request.delete(ROUTES.testAccounts);

  if (response.status() !== 200) {
    throw new Error(
      `Удаление аккаунта не удалось: ${response.status()} ${await response.text()}`,
    );
  }
}

export async function cleanupUsersViaApi(
  contexts: BrowserContext[],
): Promise<void> {
  const failures: unknown[] = [];

  for (const context of contexts) {
    try {
      await deleteUserViaApi(context.request);
    } catch (error) {
      failures.push(error);
    } finally {
      await context.close();
    }
  }

  if (failures.length > 0) {
    throw failures[0];
  }
}
