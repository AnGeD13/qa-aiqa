import { expect, test } from '@playwright/test';
import { CatalogHost, createCatalogHost } from '../../helpers/catalog-host';
import { cleanupUsersViaApi } from '../../helpers/user';
import { GuestCatalogPage } from '../../pages/guest-catalog-page';

test.describe('Каталог / гость', () => {
  let catalogHost: CatalogHost;
  let catalogGuest: GuestCatalogPage;

  test.beforeAll(async ({ browser }) => {
    catalogHost = await createCatalogHost(browser, Date.now());
  });

  test.beforeEach(async ({ page }) => {
    catalogGuest = new GuestCatalogPage(page);
    await catalogGuest.goto();
  });

  test.afterAll(async () => {
    await cleanupUsersViaApi([catalogHost.context]);
  });

  test('Гость без регистрации видит каталог участников', async () => {
    await test.step('Гость не залогинен и видит главную страницу', async () => {
      await expect(catalogGuest.loginLink).toBeVisible();
    });

    await test.step('По навыку находим карточку хоста', async () => {
      await catalogGuest.findSkill(catalogHost.skillTag);

      await expect(
        catalogGuest.personCardByName(catalogHost.user.name),
      ).toBeVisible();
    });
  });

  test('Гость открывает участника, видит слоты и не может забронировать без аккаунта', async () => {
    await test.step('По навыку находим карточку хоста', async () => {
      await catalogGuest.findSkill(catalogHost.skillTag);

      await expect(
        catalogGuest.personCardByName(catalogHost.user.name),
      ).toBeVisible();
    });

    await test.step('Открываем карточку хоста из каталога', async () => {
      await catalogGuest.openPerson(catalogHost.user.name);
    });

    await test.step('На странице хоста виден свободный слот', async () => {
      await expect(catalogGuest.page).toHaveURL(/\/pomidorqa\/people\//);
      await expect(catalogGuest.personName).toHaveText(catalogHost.user.name);
      await expect(catalogGuest.slotTime.first()).toBeVisible();
    });

    await test.step('Открываем окно бронирования на свободный слот', async () => {
      await expect(async () => {
        await catalogGuest.openBookingDialog();
        await expect(catalogGuest.bookingDialog).toBeVisible();
      }).toPass({ timeout: 10_000 });
    });

    await test.step('Пытаемся подтвердить бронь без аккаунта', async () => {
      await catalogGuest.confirmBooking();
    });

    await test.step('Система просит войти, бронь не создаётся', async () => {
      await expect(catalogGuest.bookingError).toHaveText(
        'Нужно войти в аккаунт PomidorQA',
      );
    });
  });
});
