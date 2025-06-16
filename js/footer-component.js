class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer mt-auto py-4 text-white" role="contentinfo">
        <div class="container-fluid">
          <div class="row">
            <!-- Columna izquierda -->
            <div class="col-md-4 mb-3 mb-md-0">
              <div class="d-flex align-items-center mb-2">
                <img src="assets/images/logo-area.png" alt="Logo de InfoInundaciones" class="me-2">
              </div>
              <p class="mb-0">
                Información actualizada sobre inundaciones para mantener a nuestra comunidad segura e informada.
              </p>
            </div>

            <!-- Columna derecha -->
            <div class="col-md-4 offset-md-4 justify-content-end">
              <h6 class="fw-bold">Enlaces rápidos</h6>
              <ul class="list-unstyled">
                <li><a href="index.html" class="text-white text-decoration-none">Inicio</a></li>
                <li><a href="mapa.html" class="text-white text-decoration-none">Mapa interactivo</a></li>
                <li><a href="proponer.html" class="text-white text-decoration-none">Proponer datos</a></li>
                <li><a href="contacto.html" class="text-white text-decoration-none">Contacto</a></li>
              </ul>
            </div>
          </div>

          <div class="text-center mt-4 small">
            &copy; 2025 InfoInundaciones. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);
