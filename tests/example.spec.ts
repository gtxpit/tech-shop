import { test, expect } from '@playwright/test'

test('полный цикл: регистрация и вход', async ({ page }) => {
  const uniqueEmail = `test_${Date.now()}@mail.ru`
  const password = 'testpassword123'

  await page.goto('http://localhost:3000/html/registration.html')
  await page.getByRole('textbox', { name: 'Имя' }).fill('Тестовый Юзер')
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail)
  await page.getByRole('textbox', { name: 'Пароль' }).fill(password)

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Успех')
    await dialog.dismiss()
  })

  await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
  await page.waitForURL('http://localhost:3000/')

  await page.goto('http://localhost:3000/html/login.html')
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail)
  await page.getByRole('textbox', { name: 'Пароль' }).fill(password)

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Вы вошли')
    await dialog.dismiss()
  })

  await page.getByRole('button', { name: 'Войти' }).click()
  await page.waitForURL('http://localhost:3000/')
})