
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApiService,
  ClienteCadastroApi
} from '../service/api.service';

@Component({
  selector: 'app-pessoa-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pessoa-cadastro.html',
  styleUrl: './pessoa-cadastro.css'
})
export class PessoaCadastroComponent {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  cliente: ClienteCadastroApi = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    enderecos: [
      {
        cep: '',
        numero: '',
        complemento: ''
      }
    ]
  };

  mensagem = '';
  erro = false;
  carregando = false;
  tentouEnviar = false;

  cadastrarCliente(formulario: NgForm) {
    this.tentouEnviar = true;
    this.mensagem = '';
    this.erro = false;

    if (formulario.invalid) {
      this.erro = true;
      this.mensagem =
        'Preencha todos os campos obrigatórios antes de cadastrar.';
      return;
    }

    this.carregando = true;

    this.apiService.cadastrarCliente(this.cliente).subscribe({
      next: (resposta: any) => {

        const idPessoa =
          resposta?.idPessoa ??
          resposta?.idpessoa ??
          resposta?.pessoa?.idPessoa ??
          resposta?.cliente?.idPessoa;

        if (idPessoa == null) {
          this.erro = true;
          this.carregando = false;
          this.mensagem =
            'Cadastro realizado, mas a API não retornou o ID do cliente. Precisamos verificar a resposta do backend.';
          console.log('Resposta do cadastro:', resposta);
          return;
        }

        localStorage.setItem('idPessoa', String(idPessoa));

        this.mensagem = 'Cliente cadastrado com sucesso!';
        alert(this.mensagem);

        this.router.navigate(['/area-cliente']);
      },

      error: (erro) => {
        console.error('Erro ao cadastrar cliente:', erro);

        this.erro = true;
        this.carregando = false;

        this.mensagem =
          erro.error?.mensagem ||
          erro.error?.message ||
          'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.';
      }
    });
  }
}
