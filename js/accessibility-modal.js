class AccessibilityModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal fade" id="accessibilityModal" tabindex="-1" aria-labelledby="accessibilityModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title" id="accessibilityModalLabel">Configuración de accesibilidad</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
              <form id="accessibilityForm">
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="highContrast">
                  <label class="form-check-label" for="highContrast">Activar modo de alto contraste</label>
                </div>
                <div class="mb-3">
                  <label for="fontSizeSelect" class="form-label">Tamaño de fuente:</label>
                  <select class="form-select" id="fontSizeSelect">
                    <option value="normal">Normal</option>
                    <option value="large">Grande</option>
                    <option value="xlarge">Muy grande</option>
                  </select>
                </div>
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="dyslexicFont">
                  <label class="form-check-label" for="dyslexicFont">Usar tipografía más legible</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="highlightFocus">
                  <label class="form-check-label" for="highlightFocus">Resaltar foco del teclado</label>
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>

          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('accessibility-modal', AccessibilityModal);
