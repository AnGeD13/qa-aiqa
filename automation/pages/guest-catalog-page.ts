import { Locator, Page } from '@playwright/test';
import { ROUTES } from '../helpers/routes';

export class GuestCatalogPage {
  readonly page: Page;

  readonly loginLink: Locator;
  readonly catalogHeading: Locator;
  readonly skillFilter: Locator;
  readonly skillFilterSubmit: Locator;
  readonly personCard: Locator;

  readonly personName: Locator;
  readonly slotsHeading: Locator;
  readonly slotDay: Locator;
  readonly slotTime: Locator;

  readonly bookingDialog: Locator;
  readonly bookingConfirmButton: Locator;
  readonly bookingError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginLink = page.getByRole('link', { name: 'Войти' }).first();
    this.catalogHeading = page.getByRole('heading', {
      name: 'Найти собеседника',
    });
    this.skillFilter = page.getByLabel('Навык');
    this.skillFilterSubmit = page.getByRole('button', { name: 'Найти' });
    this.personCard = page.getByTestId('person-card');

    this.personName = page.getByRole('heading', { level: 1 });
    this.slotsHeading = page.getByRole('heading', {
      name: /Свободные слоты/,
    });
    this.slotDay = page
      .getByRole('group', { name: 'Дни со слотами' })
      .getByRole('button');
    this.slotTime = page
      .getByRole('group', { name: 'Время слотов' })
      .getByRole('button');

    this.bookingDialog = page.getByRole('dialog');
    this.bookingConfirmButton = this.bookingDialog.getByRole('button', {
      name: 'Подтвердить',
    });
    this.bookingError = this.bookingDialog.getByRole('alert');
  }

  personCardByName(name: string): Locator {
    return this.personCard.filter({ hasText: name }).first();
  }

  async goto() {
    await this.page.goto(ROUTES.base);
  }

  async findSkill(skill: string) {
    await this.skillFilter.fill(skill);
    await this.skillFilterSubmit.click();
  }

  async openPerson(name: string) {
    await this.personCardByName(name).click();
  }

  async openBookingDialog() {
    await this.slotDay.first().click();
    await this.slotTime.first().click();
  }

  async confirmBooking() {
    await this.bookingConfirmButton.click();
  }
}
