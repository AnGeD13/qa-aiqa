import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/register-page';
import { deleteUserViaApi, makeUser, TestUser } from '../../helpers/user';
import { ProfilePage } from '../../pages/profile-page';
import { Header } from '../../components/header';

test.describe("Регистрация пользователя", () => {
    let registerPage: RegisterPage;
    let user: TestUser;

    test.beforeEach(async ({ page }) => {
        user = makeUser("register", Date.now());

        registerPage = new RegisterPage(page);
        
        await registerPage.goto();
    });

    test("Успешная регистрация создает аккаунт и профиль без подтверждения почты и инвайт-кода", async ({ page }) => {
        const defaultTimezone = "Europe/Moscow";
        const profilePage = new ProfilePage(page);
        const header = new Header(page);
        let registered = false;

        try {
            await test.step("Заполнить форму регистрации", async () => {
                await registerPage.fillName(user.name);
                await registerPage.fillEmail(user.email);
                await registerPage.fillPassword(user.password);
            });
    
            await test.step("Отправить форму регистрации", async () => {
                await registerPage.submit();
            });

            registered = true;
    
            await test.step("Проверить, что аккаунт создан без подтверждения почты и инвайт-кода", async () => {
                await expect(page).toHaveURL(/\/pomidorqa\/?$/);
                await expect(header.logoutButton).toBeVisible();
            });
    
            await test.step("Перейти на страницу профиля", async () => {
                await profilePage.goto();
            });
    
            await test.step(`Проверить, что профиль создан с именем из формы и поясом ${defaultTimezone}`, async () => {
                await expect(profilePage.profileNameInput).toHaveValue(user.name);
                await expect(profilePage.profileTimezoneSelect).toHaveValue(defaultTimezone);
            });
        } finally {
            if (registered) await deleteUserViaApi(page.request);
        }
        
    });

    test("Регистрация не проходит, если не заполнено поле 'Имя'", async ({page}) => {
        await test.step("Заполнить все поля формы кроме имени", async () => {
            await registerPage.fillEmail(user.email);
            await registerPage.fillPassword(user.password);
        });

        await test.step("Отправить форму регистрации", async () => {
            await registerPage.submit();
        });
        
        await test.step("Проверить, что форма регистрации не отправлена", async () => {
            await expect(page).toHaveURL(/\/pomidorqa\/auth\/register/);
            await expect(registerPage.registerNameInput).toHaveJSProperty(
              "validity.valueMissing",
              true,
            );
        });
    });

    test("Регистрация не проходит, если не заполнено поле 'Email'", async ({page}) => {
        await test.step("Заполнить все поля формы кроме email", async () => {
            await registerPage.fillName(user.name);
            await registerPage.fillPassword(user.password);
        });

        await test.step("Отправить форму регистрации", async () => {
            await registerPage.submit();
        });
        
        await test.step("Проверить, что форма регистрации не отправлена", async () => {
            await expect(page).toHaveURL(/\/pomidorqa\/auth\/register/);
            await expect(registerPage.registerEmailInput).toHaveJSProperty(
              "validity.valueMissing",
              true,
            );
        });
    });

    test("Регистрация не проходит, если не заполнено поле 'Пароль'", async ({page}) => {
        await test.step("Заполнить все поля формы кроме пароля", async () => {
            await registerPage.fillName(user.name);
            await registerPage.fillEmail(user.email);
        });

        await test.step("Отправить форму регистрации", async () => {
            await registerPage.submit();
        });
        
        await test.step("Проверить, что форма регистрации не отправлена", async () => {
            await expect(page).toHaveURL(/\/pomidorqa\/auth\/register/);
            await expect(registerPage.registerPasswordInput).toHaveJSProperty(
              "validity.valueMissing",
              true,
            );
        });
    });
});