import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Carrinho {
  itens: any[] = [];

  adicionarProduto(produto: any): boolean {
    const existente = this.itens.find(item => item.id === produto.id);

    // Produtos precisam respeitar o estoque disponível.
    if (produto.tipo === 'P') {
      const estoque = Number(produto.quantidadeEstoque ?? 0);
      const quantidadeAtual = existente ? existente.quantidade : 0;

      if (quantidadeAtual >= estoque) {
        return false;
      }
    }

    if (existente) {
      existente.quantidade++;
    } else {
      this.itens.push({
        ...produto,
        quantidade: 1
      });
    }

    return true;
  }

  listarProdutos(): any[] {
    return this.itens;
  }

  alterarQuantidade(id: number, quantidade: number): void {
    const item = this.itens.find(produto => produto.id === id);

    if (!item) return;

    if (quantidade <= 0) {
      this.removerProduto(id);
      return;
    }

    if (item.tipo === 'P') {
      const estoque = Number(item.quantidadeEstoque ?? 0);

      if (quantidade > estoque) {
        item.quantidade = estoque;
        return;
      }
    }

    item.quantidade = quantidade;
  }

  removerProduto(id: number): void {
    this.itens = this.itens.filter(produto => produto.id !== id);
  }

  calcularTotal(): number {
    return this.itens.reduce(
      (total, item) => total + Number(item.preco) * item.quantidade,
      0
    );
  }

  limparCarrinho(): void {
    this.itens = [];
  }
}