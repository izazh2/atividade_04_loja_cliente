
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Carrinho } from '../service/carrinho';

import {
  ApiService,
  FuncionarioApi,
  AtendimentoCadastroApi
} from '../service/api.service';

@Component({
  selector: 'app-finalizacao-compra',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './finalizacao-compra.html',
  styleUrl: './finalizacao-compra.css'
})
export class FinalizacaoCompraComponent {

  itens: any[] = [];

  carregando = false;
  mensagemErro = '';

  constructor(
    private carrinho: Carrinho,
    private apiService: ApiService
  ) {
    this.itens = this.carrinho.listarProdutos();
  }

  calcularTotal(): number {
    return this.itens.reduce((total, produto) => {
      const quantidade = Number(produto.quantidade || 1);
      const preco = Number(produto.preco || 0);

      return total + (preco * quantidade);
    }, 0);
  }

  finalizarCompra(): void {

    this.mensagemErro = '';

    if (this.itens.length === 0) {
      this.mensagemErro = 'Seu carrinho está vazio.';
      return;
    }

    const idPessoa = Number(localStorage.getItem('idPessoa'));

    if (!idPessoa) {
      this.mensagemErro =
        'Não foi possível identificar seu cadastro. Entre novamente na sua conta.';
      return;
    }

    this.carregando = true;

    this.apiService.listarFuncionarios().subscribe({

      next: (funcionarios: FuncionarioApi[]) => {

        const funcionarioAtivo = funcionarios.find(
          funcionario => funcionario.ativoPessoa === 'S'
        );

        if (!funcionarioAtivo) {
          this.carregando = false;
          this.mensagemErro =
            'Não existe funcionário ativo cadastrado para registrar o atendimento.';
          return;
        }

        const itensAgrupados = new Map<number, any>();

        for (const produto of this.itens) {

          const idItem = Number(produto.id);
          const quantidade = Number(produto.quantidade || 1);

          if (itensAgrupados.has(idItem)) {

            itensAgrupados.get(idItem).quantidade += quantidade;

          } else {

            itensAgrupados.set(idItem, {
              idItem: idItem,
              idFuncionario: funcionarioAtivo.idPessoa,
              quantidade: quantidade,
              valorUnitario: Number(produto.preco)
            });

          }
        }

        const hoje = new Date();

        const dataAtendimento =
          `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

        const atendimento: AtendimentoCadastroApi = {
          idPessoa: idPessoa,
          dataAtendimento: dataAtendimento,
          statusAtendimento: 'A',
          itens: Array.from(itensAgrupados.values())
        };

        this.apiService.cadastrarAtendimento(atendimento).subscribe({

          next: () => {

            this.carrinho.limparCarrinho();
            this.itens = [];
            this.carregando = false;

            alert('Pedido realizado com sucesso!');

          },

          error: (erro) => {

            console.error('Erro ao registrar atendimento:', erro);

            this.mensagemErro =
              erro.error?.mensagem ??
              'Não foi possível registrar o pedido. Verifique os dados e tente novamente.';

            this.carregando = false;

          }

        });

      },

      error: (erro) => {

        console.error('Erro ao consultar funcionários:', erro);

        this.mensagemErro =
          'Não foi possível consultar os funcionários.';

        this.carregando = false;

      }

    });
  }
}
