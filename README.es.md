# BlackWingMatrix

<details>
<summary>🌐 Idioma: Español</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** es una aplicación web autónoma para practicar razonamiento abstracto y visuoespacial mediante matrices lógicas 3×3 generadas de forma procedimental.

Versión actual: **1.31.1**.

## Pruébalo en línea

**[Abrir BlackWingMatrix en el navegador](https://everchangingpulse.github.io/BlackWingMatrix/)**

La versión de GitHub Pages se abre directamente en el navegador: no hace falta descargar ni instalar nada. Para usarlo sin conexión, el repositorio también incluye el archivo HTML autónomo completo.

## Qué hace el programa

Cada ejercicio muestra una matriz 3×3 a la que le falta la casilla inferior derecha. Debes elegir la ficha correcta entre ocho alternativas. El generador crea muchas familias de reglas visuales en lugar de utilizar un conjunto fijo de preguntas hechas a mano.

- detección de patrones visuales y relaciones entre filas y columnas
- cambios de forma, posición, rotación, simetría y escala
- rellenos, secuencias de símbolos, cantidades y composiciones
- operaciones sobre mini-rejillas y lógica de conjuntos/booleana
- problemas con varias reglas independientes que deben seguirse a la vez

## Modos de sesión

El selector ofrece cinco modos:

- **Ejercicio individual** — genera un ejercicio reproducible; permite elegir familia y franja cualitativa y, cuando corresponda, transformaciones u operaciones booleanas.
- **Prueba adaptativa** — sesión adaptativa estándar después de tres ejercicios de calibración.
- **Prueba adaptativa de progresión gradual** — modo predeterminado; se acerca de forma más suave a la frontera estimada.
- **Prueba panorámica progresiva** — aumenta progresivamente la dificultad y alterna familias adecuadas, sin adaptar el recorrido a las respuestas.
- **Prueba por relación lógica** — practica un grupo seleccionado: transformaciones espaciales, lógica booleana, relaciones de filas, columnas, diagonales, exterior/interior o relaciones reutilizadas.

## Prueba adaptativa y dificultad

Todos los generadores usan una escala interna común de **0–60** para ejercicio individual, calibración y todos los modos de prueba; las seis etiquetas visibles solo son franjas cualitativas de esa escala.

Cada sesión adaptativa comienza con tres ejercicios generados de calibración. Las dificultades solicitadas se eligen en una cuadrícula de 0,01: el elemento central está entre 23 y 27, el primero entre 10 y 16 y el tercero completa una suma de calibración entre 74 y 76. Las familias se escogen entre generadores capaces de producir realmente esa dificultad.

Después de la calibración, el siguiente nivel considera el rendimiento anterior, el tiempo de respuesta, las rachas de errores, la dificultad más alta resuelta correctamente y la cercanía de una opción errónea a la solución dentro de esa familia. El modo gradual amortigua la subida inicial y evita una escalada persistente sin aciertos fiables en niveles altos.

Cuatro opciones son independientes y están desactivadas por defecto: mostrar correcto/incorrecto, mostrar explicación, mostrar valores numéricos durante la prueba y mostrar valores numéricos en el resumen final.

## Comentarios y explicaciones

Cuando están activados, BlackWingMatrix explica la regla visual prevista y, tras una respuesta incorrecta, se centra en la opción que realmente se eligió. La explicación intenta usar evidencias visibles de la matriz actual, separar lo que la respuesta tiene de correcto y señalar una contradicción concreta que permita descartarla.

## Familias de ejercicios

El generador incluye movimientos en rejilla, relaciones entre forma exterior y símbolo interior, disposiciones de puntos, composiciones de líneas, lógica de mini-rejillas, rotaciones de poliominós, formas y rellenos, rellenos diagonales, orden de símbolos, patrones radiales, equilibrio de bloques y puntos, superposición de segmentos y otras transformaciones mixtas.

## Dificultad, resultados y análisis

El resumen final informa del ejercicio evaluado más difícil resuelto correctamente, la cobertura de familias, la estabilidad del recorrido y el motivo de finalización. También compara el recorrido posterior a la calibración con referencias simuladas de todo correcto y todo incorrecto con el mismo punto de partida; no es un percentil poblacional ni una puntuación de CI.

La pestaña **Gaussiana** conserva el historial local, permite exportar e importar CSV, recalcular las dificultades guardadas y simular 200 perfiles de referencia. Las sesiones adaptativas también se pueden exportar como JSON y CSV.

## Modo de ejercicio individual

El modo de ejercicio individual permite elegir familia, dificultad y, cuando corresponda, transformaciones u operaciones booleanas. Sirve para practicar una lógica visual concreta o reproducir un ejercicio determinado.

## Reproducibilidad

Cada matriz generada tiene una semilla (seed). Con la misma semilla y los mismos ajustes se reproduce el mismo ejercicio, lo que facilita los informes de errores y las comparaciones entre versiones.

## Uso sin conexión

BlackWingMatrix también se distribuye como un único archivo HTML. Puedes descargar `blackwingmatrix.html` y abrirlo en un navegador moderno sin backend, cuenta, base de datos, Node.js ni Python.

## Limitación importante

BlackWingMatrix es una herramienta experimental de práctica y evaluación relativa. **No es una prueba de inteligencia estandarizada**, no proporciona un CI validado, no sustituye a las Raven's Progressive Matrices oficiales y no debe utilizarse por sí sola para sacar conclusiones clínicas o psicológicas.

## Inicio rápido

1. Abre la versión en línea o el archivo HTML autónomo.
2. Elige un modo de sesión. **Prueba adaptativa de progresión gradual** está seleccionada de forma predeterminada.
3. Configura el límite de tiempo y el máximo de ejercicios, o elige familia y franja para un ejercicio individual.
4. Inicia la sesión y elige una de las ocho respuestas para cada matriz.
5. Al final consulta el resumen o exporta los resultados. Los comentarios y explicaciones solo aparecen si los has activado.

## Licencia y atribución

El material original de BlackWingMatrix cuyos derechos pertenecen a los autores del repositorio se distribuye bajo la **Apache License 2.0**. Consulta [LICENSE](LICENSE), [NOTICE](NOTICE) y [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix deriva en parte del trabajo y las ideas de **pyRavenMatrices — Can Mekik**. Los derechos sobre material de terceros siguen perteneciendo a sus respectivos titulares; la declaración Apache-2.0 solo cubre material sobre el que los autores de este repositorio tienen autoridad.

## Informar de problemas

Son especialmente útiles los informes sobre matrices ambiguas, respuestas aparentemente duplicadas, explicaciones poco claras, fallos de renderizado, dificultad incoherente, reglas no inferibles y problemas en móviles. Cuando sea posible, incluye semilla, familia, nivel, captura de pantalla y navegador.

---

BlackWingMatrix es un proyecto experimental dedicado al estudio y la práctica del razonamiento visual generado procedimentalmente.
