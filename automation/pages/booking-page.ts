import {Page, Locator} from "@playwright/test";
import { ROUTES } from "../helpers/routes";

export class BookingPage {
  readonly page: Page;

  readonly catalogFilterInput: Locator;
  readonly catalogFilterSubmit: Locator;
  readonly catalogCard: Locator;

  readonly slotsDateInput: Locator;
  readonly slotsTimeInput: Locator;
  readonly slotsAddSubmit: Locator;
  readonly slotsCard: Locator;

  readonly personName: Locator;

  readonly bookingCalendarDay: Locator;
  readonly bookingCalendarTime: Locator;

  readonly bookingConfirmDialog: Locator;
  readonly bookingConfirmButton: Locator;
  readonly bookingConfirmSuccess: Locator;
  readonly bookingConfirmError: Locator;
  readonly bookingCloseButton: Locator;

  readonly bookingsUpcomingSection: Locator;
  readonly bookingsUpcomingCards: Locator;
  readonly bookingsCardName: Locator;
  readonly bookingCardCancelButton: Locator;

  readonly bookingCancelledSection: Locator;
  readonly bookingsCancelledCardName: Locator;

  constructor(page: Page) {
    this.page = page;

    this.catalogFilterInput = page.locator("#pomidorqa-catalog-skill-filter");
    this.catalogFilterSubmit = page.getByRole("button", { name: "Найти" });
    this.catalogCard = page.getByTestId("person-card");

    this.slotsDateInput = page.locator("#pomidorqa-slots-date");
    this.slotsTimeInput = page.locator("#pomidorqa-slots-time");
    this.slotsAddSubmit = page.getByRole("button", { name: "Добавить слот" });
    this.slotsCard = page.locator("[data-slot-id]");

    this.personName = page.getByRole("heading", { level: 1 });

    this.bookingCalendarDay = page.getByRole("group", { name: "Дни со слотами" }).getByRole("button");
    this.bookingCalendarTime = page.getByRole("group", { name: "Время слотов" }).getByRole("button");

    this.bookingConfirmDialog = page.getByRole("dialog");
    this.bookingConfirmButton = page.getByRole("dialog").getByRole("button", { name: "Подтвердить" });
    this.bookingConfirmSuccess = page.getByRole("dialog").getByRole("status");
    this.bookingConfirmError = page.getByRole("dialog").getByRole("alert");
    this.bookingCloseButton = page.getByRole("dialog").getByRole("button", { name: "Закрыть" });

    this.bookingsUpcomingSection = page.getByTestId("upcoming-meetings");
    this.bookingsUpcomingCards = this.bookingsUpcomingSection.locator("[data-booking-id]");
    this.bookingsCardName = this.bookingsUpcomingSection.locator("[data-booking-id]").first().locator("p").first();
    this.bookingCardCancelButton = this.bookingsUpcomingSection.locator("[data-booking-id]").first().getByRole("button", { name: "Отменить" });
  
    this.bookingCancelledSection = page.locator('section').filter({ hasText: 'Прошедшие и отменённые' });
    this.bookingsCancelledCardName = this.bookingCancelledSection.locator("[data-booking-id]").first().locator("p").first();
  }

  async gotoSlots() {
    await this.page.goto(ROUTES.slots);
  }

  async gotoBookings() {
    await this.page.goto(ROUTES.bookings);
  }

  async reload() {
    await this.page.reload();
  }

  async findSkill(skill: string) {
    await this.catalogFilterInput.fill(skill);
    await this.catalogFilterSubmit.click();
  }

  async fillDate(date: string) {
    await this.slotsDateInput.fill(date);
  }

  async fillTime(time: string) {
    await this.slotsTimeInput.fill(time);
  }

  async addSlot() {
    await this.slotsAddSubmit.click();
  }

  async addNewSlot({date, time}: {date: string, time: string}) {
    await this.fillDate(date);
    await this.fillTime(time);
    await this.addSlot();
  }

  async openPersonCard(name: string) {
    await this.catalogCard.filter({hasText: name}).first().click();
  }

  async openBookingDialog() {
    await this.bookingCalendarDay.first().click();
    await this.bookingCalendarTime.first().click();
  }

  async closeBookingDialog() {
    await this.bookingCloseButton.click();
  }

  async confirmBooking() {
    await this.bookingConfirmButton.click();
  }

  async cancelBooking() {
    await this.bookingCardCancelButton.click();
  }
}
