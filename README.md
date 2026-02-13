# InfoInundaciones: Observación de Zonas Inundables 🌊

Este es el trabajo final desarrollado para la materia **Diseño de Experiencia de Usuario (UX)** de la Facultad de Informática (**UNLP**). El proyecto consiste en una plataforma colaborativa y bidireccional diseñada para empoderar a los ciudadanos ante emergencias hídricas.

## 🎯 Propósito del Proyecto

InfoInundaciones nace de la necesidad de gestionar información crítica durante tormentas intensas o inundaciones, tomando como punto de partida localidades afectadas como Villa Elvira en La Plata, pero con una arquitectura escalable a cualquier región.

### Funcionalidades Clave:
- **Mapa Interactivo de Riesgos:** Visualización georreferenciada de zonas con niveles de riesgo alto, medio y bajo[cite: 214, 222].
- **Colaboración Comunitaria:** Los usuarios pueden reportar en tiempo real la altura del agua, calles cortadas o necesidad de asistencia[cite: 214, 217].
- **Gestión de Recursos:** Identificación de puntos de encuentro seguros, refugios y centros de evacuación temporales[cite: 220, 221].
- **Panel de Accesibilidad:** Personalización total de la interfaz para usuarios con diversas necesidades visuales o cognitivas[cite: 165].

## 🧠 Metodología de Diseño (UX & Accessibility First)

A diferencia de un enfoque centrado puramente en la funcionalidad, este proyecto integró la **UX y la accesibilidad como pilares éticos y prácticos** desde la primera línea de código.

### Proceso de Investigación
1. **Investigación de Usuarios:** Se definieron perfiles específicos (vecino afectado, colaborador e informante, y usuarios en situación de vulnerabilidad) para entender sus comportamientos bajo estrés.
2. **Contexto de Uso:** Análisis de escenarios de emergencia activa donde la conectividad es inestable y la carga cognitiva es alta.
3. **Análisis Comparativo:** Se estudiaron soluciones existentes como *Riesgo La Plata* y las *Cartas de Riesgo del ADA*, identificando oportunidades de mejora en la simplicidad y participación ciudadana.

### Principios Aplicados
- **Heurísticas de Nielsen:** Especial énfasis en el minimalismo y la visibilidad del estado del sistema.
- **Pautas WCAG 2.x:** Garantía de perceptibilidad, operabilidad y robustez.
- **Filosofía "No me hagas pensar":** Reducción de pasos para tareas críticas como el envío de reportes de emergencia.

## 🛠️ Stack Tecnológico

Se optó por un stack **simple, ligero y de rápido rendimiento**, priorizando la velocidad de carga en situaciones de emergencia donde cada segundo cuenta:

- **Frontend:** HTML5 Semántico, CSS3 y JavaScript Vanilla (sin frameworks pesados para garantizar ligereza).
- **Mapas:** Leaflet para la gestión dinámica de capas de información y GeoJSON.
- **Accesibilidad:** Atributos ARIA, tipografías para dislexia, modo de alto contraste y navegación completa por teclado.

## ♿ Características de Accesibilidad Destacadas

- **Tipografía de Alta Legibilidad:** Opción de cambiar a fuentes diseñadas específicamente para facilitar la lectura en personas con dislexia.
- **Navegación Asistida:** El sistema permite saltar contenido redundante en formularios para usuarios que utilizan lectores de pantalla.
- **Alternativas Textuales:** Inclusión de un formato tabular (listado exhaustivo) para quienes no pueden interactuar con el mapa dinámico.
- **Modo Oscuro/Contraste:** Inversión cromática para reducir la fatiga visual o mejorar la legibilidad en entornos de baja luz.

## Ejecución del proyecto

El proyecto se encuentra desplegado y listo para su uso. Puedes acceder a la versión en vivo [acá](https://francokumichel.github.io/proyecto_final_DEU/).

## 👥 Autores
[**Franco Leandro Kumichel**](https://github.com/francokumichel) 
[**Gustavo Lopez**](https://github.com/tavolop3)
