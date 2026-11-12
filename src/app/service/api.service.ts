
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemApi {
  idItem: number;
  idCategoria: number;
  categoria: string;
  item: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
  codigoPreco?: number | null;
  precoVenda?: number | null;
  unidade?: string | null;
  quantidadeEstoque?: number | null;
}

export interface EnderecoCadastroApi {
  cep: string;
  numero: string;
  complemento: string;
}

export interface ClienteCadastroApi {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: string;
  enderecos: EnderecoCadastroApi[];
}

export interface PedidoItemApi {
  idAtendimento: number;
  idItem: number;
  item: string;
  idFuncionario: number;
  nomeFuncionario: string;
  cargo: string;
  quantidade: number;
  valorUnitario: number;
}

export interface PedidoApi {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: PedidoItemApi[];
}

export interface FuncionarioApi {
  idPessoa: number;
  nome: string;
  ativoPessoa: string;
  cargo: string;
}

export interface AtendimentoItemCadastroApi {
  idItem: number;
  idFuncionario: number;
  quantidade: number;
  valorUnitario: number;
}

export interface AtendimentoCadastroApi {
  idPessoa: number;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: AtendimentoItemCadastroApi[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = 'https://localhost:7227/api';

  constructor(private http: HttpClient) {}

  listarProdutos(): Observable<ItemApi[]> {
    return this.http.get<ItemApi[]>(
      `${this.apiUrl}/Item?tipo=P&ativo=S`
    );
  }

  listarServicos(): Observable<ItemApi[]> {
    return this.http.get<ItemApi[]>(
      `${this.apiUrl}/Item?tipo=S&ativo=S`
    );
  }

  buscarItem(id: number): Observable<ItemApi> {
    return this.http.get<ItemApi>(
      `${this.apiUrl}/Item/${id}`
    );
  }

  cadastrarCliente(cliente: ClienteCadastroApi): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Cliente`,
      cliente
    );
  }

  listarPedidosPorCliente(idPessoa: number): Observable<PedidoApi[]> {
    return this.http.get<PedidoApi[]>(
      `${this.apiUrl}/Atendimento/pessoa/${idPessoa}`
    );
  }

  listarFuncionarios(): Observable<FuncionarioApi[]> {
    return this.http.get<FuncionarioApi[]>(
      `${this.apiUrl}/Funcionario`
    );
  }

  cadastrarAtendimento(
    atendimento: AtendimentoCadastroApi
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Atendimento`,
      atendimento
    );
  }
}
