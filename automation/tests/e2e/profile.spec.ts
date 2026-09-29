import {test, expect} from "@playwright/test";
import { ProfilePage } from "../../pages/profile-page";
import { deleteUserViaApi, makeUser, registerUserViaApi } from "../../helpers/user";


test.describe("Профиль: действия с полями", () => {
    let profilePage: ProfilePage;
    
    test.beforeEach(async ({page}) => {
        profilePage = new ProfilePage(page);
        const user = makeUser("profile", Date.now());
        await registerUserViaApi(page.request, user);
        await profilePage.goto();
    });

    test.afterEach(async ({page}) => {
        await deleteUserViaApi(page.request);
    })

    test("Изменённое имя сохраняется после перезагрузки", async () => {
        const newName = `Тест Тестович ${Date.now()}`;
    
        await test.step("Ввести новое значение и сохранить", async () => {
          await profilePage.fillName(newName);
          await profilePage.saveProfile();
        });
    
        await test.step("Проверить, что после перезагрузки с сервера пришло введенное значение", async () => {
          await profilePage.reload();
          await expect(profilePage.profileNameInput).toHaveValue(newName);
        });
    });

    test("Пустое имя не сохраняется", async () => {
        const savedName = await test.step("Запомнить текущее имя", async () => {
            return profilePage.profileNameInput.inputValue();
        });

        await test.step("Очистить имя и сохранить данные", async () => {
          await profilePage.clearName();
          await profilePage.submitProfile();
        });
        await test.step("Браузер не дал отправить форму", async () => {
          await expect(profilePage.profileNameInput).toHaveValue("");
          await expect(profilePage.profileNameInput).toHaveJSProperty("validity.valueMissing", true);
        });
        await test.step("После перезагрузки на сервере осталось прежнее имя", async () => {
          await profilePage.reload();
          await expect(profilePage.profileNameInput).toHaveValue(savedName);
        });
    });

    test("Telegram сохраняется, поле остаётся необязательным", async () => {
        const telegram = `@qa_${Date.now()}`;
      
        await test.step("Ввести Telegram и сохранить", async () => {
          await profilePage.fillTelegram(telegram);
          await profilePage.saveProfile();
        });
      
        await test.step("После перезагрузки с сервера пришёл введённый Telegram", async () => {
          await profilePage.reload();
          await expect(profilePage.profileTelegramInput).toHaveValue(telegram);
        });
      
        await test.step("Очистить Telegram и сохранить", async () => {
          await profilePage.clearTelegram();
          await profilePage.saveProfile();
        });
      
        await test.step("После перезагрузки поле пустое", async () => {
          await profilePage.reload();
          await expect(profilePage.profileTelegramInput).toHaveValue("");
        });
    });

    test("Описание 'О себе' сохраняется, поле остаётся необязательным", async () => {
        const description = `about ${Date.now()}`;
      
        await test.step("Заполнить поле и сохранить", async () => {
          await profilePage.fillBio(description);
          await profilePage.saveProfile();
        });
      
        await test.step("После перезагрузки с сервера пришло введённое описание", async () => {
          await profilePage.reload();
          await expect(profilePage.profileBioInput).toHaveValue(description);
        });
      
        await test.step("Очистить описание и сохранить", async () => {
          await profilePage.clearBio();
          await profilePage.saveProfile();
        });
      
        await test.step("После перезагрузки поле пустое", async () => {
          await profilePage.reload();
          await expect(profilePage.profileBioInput).toHaveValue("");
        });
    });

    test("Выбранный часовой пояс сохраняется после перезагрузки", async () => {
        // По умолчанию стоит Europe/Moscow — берём заведомо другой,
        // иначе проверка прошла бы и без всякого выбора.
        const timezone = "Asia/Yekaterinburg";
    
        await test.step("Выбрать другой часовой пояс и сохранить", async () => {
          await profilePage.changeTimezone(timezone);
          await profilePage.saveProfile();
        });
    
        await test.step("Проверить, что после перезагрузки выбран новый пояс", async () => {
          await profilePage.reload();
          await expect(profilePage.profileTimezoneSelect).toHaveValue(timezone);
        });
    });

    test("В списке часовых поясов доступны все десять значений из требований", async () => {
        const timezones = [
            "Europe/Kaliningrad",
            "Europe/Moscow",
            "Europe/Samara",
            "Asia/Yekaterinburg",
            "Asia/Omsk",
            "Asia/Novosibirsk",
            "Asia/Krasnoyarsk",
            "Asia/Irkutsk",
            "Asia/Yakutsk",
            "Asia/Vladivostok",
          ];

        await test.step("В селекте ровно эти десять поясов", async () => {
            await expect(profilePage.profileTimezoneOptions).toHaveText(timezones);
        });
    });
});



