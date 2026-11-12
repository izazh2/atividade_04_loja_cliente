import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Carrinho } from '../service/carrinho';
import { ApiService, ItemApi } from '../service/api.service';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class ServicosComponent implements OnInit {
  servicos: any[] = [];
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
    this.listarServicos();
  }

  listarServicos(): void {
    this.carregando = true;
    this.erro = '';

    this.apiService.listarServicos().subscribe({
      next: (dados: ItemApi[]) => {
        this.servicos = dados.map(item => ({
          id: item.idItem,
          idCategoria: item.idCategoria,
          categoria: item.categoria,
          nome: item.item,
          descricao: item.descricaoItem,
          preco: item.preco,
          tipo: item.tipoItem
        }));

        const categoriasUnicas = new Map<number, string>();

        this.servicos.forEach(servico => {
          categoriasUnicas.set(
            servico.idCategoria,
            servico.categoria
          );
        });

        this.categorias = Array.from(
          categoriasUnicas,
          ([idCategoria, nome]) => ({ idCategoria, nome })
        );

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar serviços:', erro);
        this.erro = 'Não foi possível carregar os serviços.';
        this.carregando = false;
      }
    });
  }

  get servicosFiltrados(): any[] {
    if (this.categoriaSelecionada === null) {
      return this.servicos;
    }

    return this.servicos.filter(
      servico => servico.idCategoria === this.categoriaSelecionada
    );
  }

  selecionarCategoria(idCategoria: number | null): void {
    this.categoriaSelecionada = idCategoria;
  }

  adicionarAoCarrinho(servico: any): void {
    const adicionado = this.carrinho.adicionarProduto(servico);

    if (adicionado) {
      this.mensagem = servico.nome + ' foi adicionado ao carrinho!';
    } else {
      this.mensagem = 'Não foi possível adicionar este serviço.';
    }
  }
}