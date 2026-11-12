
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {

  get clienteLogado(): boolean {
    return localStorage.getItem('idPessoa') !== null;
  }

}
