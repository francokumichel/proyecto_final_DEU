class NavbarComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <nav class="navbar navbar-expand-lg" role="navigation" aria-label="Navegación principal">
          <div class="container-fluid">
            <img src="assets/images/logo-area.png" alt="">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Alternar navegación">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item mx-3">
                  <a class="nav-link" aria-current="page" href="index.html">Inicio</a>
                </li>
                <li class="nav-item mx-3">
                  <a class="nav-link" href="mapa_interactivo.html">Mapa interactivo</a>
                </li>
                <li class="nav-item mx-3">
                  <a class="nav-link" href="proponer_datos.html">Proponer datos</a>
                </li>
              </ul>
              <form role="search" class="search-container">
                  <div class="search-box">
                      <label for="search-input" class="visually-hidden">Buscar</label>
                      <input type="search" id="search-input" placeholder="Busqueda general" aria-label="Ingrese su término de búsqueda" autocomplete="off" class="search-input">
                      <button id="search-button" class="search-button" aria-label="Realizar busqueda" type="submit">
                        <span class="visually-hidden">Buscar</span>
                        <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                      </button>
                  </div>
              </form>
            </div>
          </div>
        </nav>
      `;
  }
}

customElements.define('navbar-component', NavbarComponent);
