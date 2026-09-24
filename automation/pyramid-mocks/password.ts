/**
   * Валидация пароля при регистрации.
   * правило: пароль должен быть не короче 8 символов.
   */
export function isPasswordValid(password: string): boolean {
    return password.length >= 8;
}