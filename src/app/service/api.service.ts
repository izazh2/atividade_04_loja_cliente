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
}