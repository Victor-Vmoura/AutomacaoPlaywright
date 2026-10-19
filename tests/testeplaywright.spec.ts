import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/Checkoutpage';

test.describe('Suite de Testes E2E - Swag Labs E-commerce', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let checkoutPage: CheckoutPage;

  // Refatoração: setup comum isolado para não repetir navegação em todo teste
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.acessarPagina();
  });

  test('CT01: Realizar login com credenciais válidas', async ({ page }) => {
    await loginPage.realizarLogin('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('CT02: Impedir login e exibir mensagem de erro com senha incorreta', async () => {
    await loginPage.realizarLogin('standard_user', 'senha_errada');
    await loginPage.validarMensagemDeErro('Username and password do not match');
  });

  test('CT03: Adicionar um produto ao carrinho a partir da listagem', async () => {
    await loginPage.realizarLogin('standard_user', 'secret_sauce');
    await inventoryPage.adicionarAoCarrinho('Sauce Labs Backpack');
    
    await inventoryPage.validarContadorDoCarrinho('1');
  });

  test('CT04: Navegar para o carrinho e validar a persistência do produto', async ({ page }) => {
    await loginPage.realizarLogin('standard_user', 'secret_sauce');
    await inventoryPage.adicionarAoCarrinho('Sauce Labs Backpack');
    await inventoryPage.acessarCarrinho();

    await expect(page).toHaveURL(/.*cart.html/);
    const itemNoCarrinho = page.locator('.inventory_item_name').filter({ hasText: 'Sauce Labs Backpack' });
await expect(itemNoCarrinho).toBeVisible(); // Se estiver visível, o teste passa
  });

  test('CT05: Concluir fluxo de checkout com sucesso', async ({ page }) => {
    // Precondições
    await loginPage.realizarLogin('standard_user', 'secret_sauce');
    await inventoryPage.adicionarAoCarrinho('Sauce Labs Backpack');
    await inventoryPage.acessarCarrinho();
    
    // Interações de Checkout
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.preencherDadosDeEnvio('Teste', 'Automatizado', '50000-000');
    
    // Validação de página de resumo e conclusão
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await checkoutPage.finalizarCompra();
    await checkoutPage.validarSucessoDaCompra();
  });
});