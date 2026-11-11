
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
          nome: item.item,
          descricao: item.descricaoItem,
          preco: item.preco,
          tipo: item.tipoItem
        }));

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar serviços:', erro);
        this.erro = 'Não foi possível carregar os serviços.';
        this.carregando = false;
      }
    });
  }

  adicionarAoCarrinho(servico: any): void {
    this.carrinho.adicionarProduto(servico);
    this.mensagem = servico.nome + ' foi adicionado ao carrinho!';
  }
}
