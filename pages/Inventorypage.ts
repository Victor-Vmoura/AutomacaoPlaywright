import { Page, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async adicionarAoCarrinho(nomeProduto: string) {
    // Transforma "Sauce Labs Backpack" no seletor "add-to-cart-sauce-labs-backpack"
    const nomeFormatado = nomeProduto.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="add-to-cart-${nomeFormatado}"]`).click();
  }

  async validarContadorDoCarrinho(quantidade: string) {
    const badge = this.page.locator('.shopping_cart_badge');
    await expect(badge).toHaveText(quantidade);
  }

  async acessarCarrinho() {
    await this.page.locator('.shopping_cart_link').click();
  }
}