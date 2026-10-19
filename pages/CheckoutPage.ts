import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async preencherDadosDeEnvio(nome: string, sobrenome: string, cep: string) {
    await this.page.locator('[data-test="firstName"]').fill(nome);
    await this.page.locator('[data-test="lastName"]').fill(sobrenome);
    await this.page.locator('[data-test="postalCode"]').fill(cep);
    await this.page.locator('[data-test="continue"]').click();
  }

  async finalizarCompra() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async validarSucessoDaCompra() {
    const mensagemSucesso = this.page.locator('.complete-header');
    await expect(mensagemSucesso).toHaveText('Thank you for your order!');
  }
}