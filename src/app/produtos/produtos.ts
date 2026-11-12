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
  categorias: any[] = [];
  categoriaSelecionada: number | null = null;
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
          idCategoria: item.idCategoria,
          categoria: item.categoria,
          nome: item.item,
          descricao: item.descricaoItem,
          preco: item.preco,
          tipo: item.tipoItem,
          quantidadeEstoque: item.quantidadeEstoque
        }));

        const categoriasUnicas = new Map<number, string>();

        this.produtos.forEach(produto => {
          categoriasUnicas.set(
            produto.idCategoria,
            produto.categoria
          );
        });

        this.categorias = Array.from(
          categoriasUnicas,
          ([idCategoria, nome]) => ({ idCategoria, nome })
        );

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);
        this.erro = 'Não foi possível carregar os produtos.';
        this.carregando = false;
      }
    });
  }

  get produtosFiltrados(): any[] {
    if (this.categoriaSelecionada === null) {
      return this.produtos;
    }

    return this.produtos.filter(
      produto => produto.idCategoria === this.categoriaSelecionada
    );
  }

  selecionarCategoria(idCategoria: number | null): void {
    this.categoriaSelecionada = idCategoria;
  }

  adicionarAoCarrinho(produto: any): void {
    const adicionado = this.carrinho.adicionarProduto(produto);

    if (adicionado) {
      this.mensagem = produto.nome + ' foi adicionado ao carrinho!';
    } else {
      this.mensagem = 'Estoque insuficiente para adicionar mais unidades de ' + produto.nome + '.';
    }
  }
}