import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async acessarPagina() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async realizarLogin(usuario: string, senha: string) {
    await this.page.locator('[data-test="username"]').fill(usuario);
    await this.page.locator('[data-test="password"]').fill(senha);
    await this.page.locator('[data-test="password"]').press('Enter'); 
  }

  async validarMensagemDeErro(mensagemEsperada: string) {
    const elementoErro = this.page.locator('[data-test="error"]');
    await expect(elementoErro).toBeVisible();
    await expect(elementoErro).toContainText(mensagemEsperada);
  }
}