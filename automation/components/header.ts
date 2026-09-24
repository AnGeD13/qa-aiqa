import { Locator, Page } from "@playwright/test";

export class Header {
  readonly page: Page;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoutButton = page.getByTestId("PomidorqaHeader-logout-button");
  }
}
