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

Versión actual: **1.29.16**.

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

## Prueba adaptativa

La prueba adaptativa comienza con tres ejercicios de calibración. Después, una respuesta correcta tiende a llevar el siguiente ejercicio a una dificultad interna mayor, mientras que una respuesta incorrecta tiende a reducirla. También se alternan las familias de ejercicios para evitar que el resultado dependa demasiado de un solo tipo de patrón.

Cuatro opciones son independientes y están desactivadas por defecto: mostrar correcto/incorrecto, mostrar explicación, mostrar valores numéricos durante la prueba y mostrar valores numéricos en el resumen final.

## Comentarios y explicaciones

Cuando están activados, BlackWingMatrix explica la regla visual prevista y, tras una respuesta incorrecta, se centra en la opción que realmente se eligió. La explicación intenta usar evidencias visibles de la matriz actual, separar lo que la respuesta tiene de correcto y señalar una contradicción concreta que permita descartarla.

## Familias de ejercicios

El generador incluye movimientos en rejilla, relaciones entre forma exterior y símbolo interior, disposiciones de puntos, composiciones de líneas, lógica de mini-rejillas, rotaciones de poliominós, formas y rellenos, rellenos diagonales, orden de símbolos, patrones radiales, equilibrio de bloques y puntos, superposición de segmentos y otras transformaciones mixtas.

## Dificultad y resultados

La dificultad es una escala interna relativa utilizada para comparar ejercicios generados y elegir el siguiente elemento de la prueba adaptativa. El resumen final puede mostrar solo categorías cualitativas o también valores numéricos. La dificultad máxima con respuesta correcta es el ejercicio evaluado más difícil que se respondió correctamente.

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
2. Elige **Prueba adaptativa** o **Ejercicio individual**.
3. Si es necesario, configura el límite de tiempo y el máximo de ejercicios.
4. Inicia la sesión y elige una de las ocho respuestas para cada matriz.
5. Al final consulta el resumen. Los comentarios y explicaciones solo aparecen si los has activado.

## Licencia y atribución

El material original de BlackWingMatrix cuyos derechos pertenecen a los autores del repositorio se distribuye bajo la **Apache License 2.0**. Consulta [LICENSE](LICENSE), [NOTICE](NOTICE) y [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix deriva en parte del trabajo y las ideas de **pyRavenMatrices — Can Mekik**. Los derechos sobre material de terceros siguen perteneciendo a sus respectivos titulares; la declaración Apache-2.0 solo cubre material sobre el que los autores de este repositorio tienen autoridad.

## Informar de problemas

Son especialmente útiles los informes sobre matrices ambiguas, respuestas aparentemente duplicadas, explicaciones poco claras, fallos de renderizado, dificultad incoherente, reglas no inferibles y problemas en móviles. Cuando sea posible, incluye semilla, familia, nivel, captura de pantalla y navegador.

---

BlackWingMatrix es un proyecto experimental dedicado al estudio y la práctica del razonamiento visual generado procedimentalmente.
