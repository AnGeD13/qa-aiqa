import { test, expect } from '@playwright/test';
import { isPasswordValid } from "../../pyramid-mocks/password";

test.describe("Валидация пароля при регистрации ", () => {
    test("пароль короче 8 символов — невалиден", () => {
      expect(isPasswordValid("1234567")).toBe(false);
    });
  
    test("пароль ровно 8 символов — валиден", () => {
      expect(isPasswordValid("12345678")).toBe(true);
    });
});