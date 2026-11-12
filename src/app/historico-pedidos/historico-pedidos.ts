
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService, PedidoApi } from '../service/api.service';

@Component({
  selector: 'app-historico-pedidos',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './historico-pedidos.html',
  styleUrl: './historico-pedidos.css'
})
export class HistoricoPedidosComponent implements OnInit {

  pedidos: any[] = [];
  carregando = false;
  mensagemErro = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.listarPedidos();
  }

  listarPedidos(): void {
    const idPessoa = localStorage.getItem('idPessoa');

    if (!idPessoa) {
      this.mensagemErro =
        'Não foi possível identificar o cliente. Faça o cadastro ou entre novamente.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.apiService.listarPedidosPorCliente(Number(idPessoa)).subscribe({
      next: (resposta: PedidoApi[]) => {
        this.pedidos = resposta.map(pedido => {
          const produtos = pedido.itens.map(item => ({
            nome: `${item.item} (x${item.quantidade})`,
            preco: item.valorUnitario * item.quantidade
          }));

          const total = produtos.reduce(
            (soma, produto) => soma + produto.preco,
            0
          );

          return {
            id: pedido.idAtendimento,
            status: pedido.statusAtendimento,
            data: pedido.dataAtendimento,
            produtos,
            total
          };
        });

        this.carregando = false;
      },

      error: (erro) => {
        console.error('Erro ao consultar pedidos:', erro);

        this.mensagemErro =
          erro.error?.mensagem ||
          'Não foi possível carregar seus pedidos. Tente novamente.';

        this.carregando = false;
      }
    });
  }
}
