import { Browser, BrowserContext, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking-page';
import { ProfilePage } from '../pages/profile-page';
import {
  cleanupUsersViaApi,
  makeUser,
  registerUserViaApi,
  TestUser,
} from './user';

export type CatalogHost = {
  context: BrowserContext;
  user: TestUser;
  skillTag: string;
};

export async function createCatalogHost(
  browser: Browser,
  runId: number,
): Promise<CatalogHost> {
  const user = makeUser('catalog-host', runId);
  const skillTag = `guest-catalog-${runId}`;

  const context = await browser.newContext();

  try {
    await registerUserViaApi(context.request, user);

    const page = await context.newPage();

    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.addSkill(skillTag, 'can_help');
    await expect(profilePage.skillChip(skillTag)).toBeVisible();

    const bookingPage = new BookingPage(page);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    await bookingPage.gotoSlots();

    await bookingPage.addNewSlot({date: tomorrow, time: '12:00'});

    await expect(bookingPage.slotsCard.first()).toBeVisible();

    return { context, user, skillTag };
  } catch (error) {
    await cleanupUsersViaApi([context]);
    throw error;
  }
}
