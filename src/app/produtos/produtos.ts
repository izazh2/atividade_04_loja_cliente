
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Carrinho } from '../service/carrinho';
import { ApiService, ItemApi } from '../service/api.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class ProdutosComponent implements OnInit {

  produtos: any[] = [];
  mensagem = '';
  carregando = true;
  erro = '';

  constructor(
    private carrinho: Carrinho,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.apiService.listarProdutos().subscribe({
      next: (dados: ItemApi[]) => {
        this.produtos = dados.map(item => ({
          id: item.idItem,
          nome: item.item,
          descricao: item.descricaoItem,
          preco: item.preco,
          tipo: item.tipoItem
        }));

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);
        this.erro = 'Não foi possível carregar os produtos.';
        this.carregando = false;
      }
    });
  }

  adicionarAoCarrinho(produto: any): void {
    this.carrinho.adicionarProduto(produto);
    this.mensagem = produto.nome + ' foi adicionado ao carrinho!';
  }
}
