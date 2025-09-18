import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  dropdowns = {
    clientes: false,
    productos: false,
    facturacion: false
  };

  @HostListener('document:click', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDocumentClick(event: Event) {
    this.closeDropdowns();
  }

  toggleDropdown(dropdown: string, event: Event) {
    event.stopPropagation();
    const currentState =
      this.dropdowns[dropdown as keyof typeof this.dropdowns];

    // Cierra todos los dropdowns primero
    Object.keys(this.dropdowns).forEach((key) => {
      this.dropdowns[key as keyof typeof this.dropdowns] = false;
    });

    // Si estaba cerrado, lo abre. Si estaba abierto, se queda cerrado
    this.dropdowns[dropdown as keyof typeof this.dropdowns] = !currentState;
  }

  closeDropdowns() {
    Object.keys(this.dropdowns).forEach((key) => {
      this.dropdowns[key as keyof typeof this.dropdowns] = false;
    });
  }
}
