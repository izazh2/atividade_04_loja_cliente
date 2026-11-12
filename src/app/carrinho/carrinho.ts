
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrinho } from '../service/carrinho';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class CarrinhoComponent {

  itens: any[] = [];

  constructor(private carrinho: Carrinho) {
    this.atualizarCarrinho();
  }

  atualizarCarrinho(): void {
    this.itens = this.carrinho.listarProdutos();
  }

  aumentarQuantidade(id: number): void {
    const produto = this.itens.find(item => item.id === id);

    if (produto) {
      this.carrinho.alterarQuantidade(
        id,
        Number(produto.quantidade || 1) + 1
      );

      this.atualizarCarrinho();
    }
  }

  diminuirQuantidade(id: number): void {
    const produto = this.itens.find(item => item.id === id);

    if (produto) {
      this.carrinho.alterarQuantidade(
        id,
        Number(produto.quantidade || 1) - 1
      );

      this.atualizarCarrinho();
    }
  }

  removerProduto(id: number): void {
    this.carrinho.removerProduto(id);
    this.atualizarCarrinho();
  }

  calcularTotal(): number {
    return this.carrinho.calcularTotal();
  }
}
