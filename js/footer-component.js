class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer mt-auto py-4 text-white" role="contentinfo">
        <div class="container-fluid">
          <div class="row d-flex justify-content-center justify-content-md-between mx-4 my-3 text-center text-md-start">
            <div class="col-md-6 d-flex flex-column align-items-center align-items-md-start justify-content-start mb-4">
              <img src="assets/images/logo-area.png" alt="Logo infoInundaciones" class="mb-3"/>
              <p class="mb-0 text-no-wrap text-md-wrap">
                Información actualizada sobre inundaciones para mantener a nuestra comunidad segura e informada.
              </p>
            </div>
            <div class="col-md-6 d-flex flex-column align-items-center align-items-md-end justify-content-start mb-3">
              <h6 class="fw-bold">Enlaces rápidos</h6>
              <div>
                <ul class="d-flex flex-md-column flex-row list-unstyled">
                  <li><a href="index.html" class="text-white text-decoration-none">Inicio</a></li>
                  <li><a href="mapa.html" class="text-white text-decoration-none">Mapa interactivo</a></li>
                  <li><a href="proponer.html" class="text-white text-decoration-none">Proponer datos</a></li>
                  <li><a href="contacto.html" class="text-white text-decoration-none">Contacto</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="copyright text-center mt-4 small">
            &copy; 2025 InfoInundaciones. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);
