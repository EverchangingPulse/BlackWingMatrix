# BlackWingMatrix

<details>
<summary>🌐 Idioma: Português</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** é uma aplicação web autónoma para praticar raciocínio abstrato e visuoespacial com matrizes lógicas 3×3 geradas proceduralmente.

Versão atual: **1.29.15**.

## Experimentar online

**[Abrir o BlackWingMatrix no navegador](https://everchangingpulse.github.io/BlackWingMatrix/)**

A versão GitHub Pages abre diretamente no navegador: não é necessário descarregar nem instalar nada. Para utilização offline, o repositório também inclui o ficheiro HTML autónomo completo.

## O que o programa faz

Cada exercício apresenta uma matriz 3×3 com a célula inferior direita em falta. É necessário escolher a peça correta entre oito alternativas. O gerador cria muitas famílias de regras visuais em vez de usar um conjunto fixo de perguntas feitas manualmente.

- identificação de padrões visuais e relações entre linhas e colunas
- alterações de forma, posição, rotação, espelhamento e escala
- preenchimentos, sequências de símbolos, quantidades e composições
- operações em mini-grelhas e lógica de conjuntos/booleana
- problemas com várias regras independentes a acompanhar em simultâneo

## Teste adaptativo

O teste adaptativo começa com três exercícios de calibração. Depois, uma resposta correta tende a deslocar o exercício seguinte para uma dificuldade interna maior, enquanto uma resposta errada tende a reduzi-la. As famílias de exercícios também variam para evitar que o resultado dependa demasiado de um único tipo de padrão.

Quatro opções são independentes e estão desativadas por predefinição: mostrar correto/incorreto, mostrar explicação, mostrar valores numéricos durante o teste e mostrar valores numéricos no resumo final.

## Feedback e explicações

Quando ativado, o BlackWingMatrix explica a regra visual pretendida e, após uma resposta errada, concentra-se na opção que foi realmente escolhida. A explicação procura usar evidência visível da matriz atual, distinguir o que está correto na resposta e apontar uma contradição concreta que permita rejeitá-la.

## Famílias de exercícios

O gerador inclui movimentos em grelha, relações entre forma exterior e símbolo interior, disposições de pontos, composições de linhas, lógica em mini-grelhas, rotações de poliminós, formas e preenchimentos, preenchimentos diagonais, ordem de símbolos, padrões radiais, equilíbrio de blocos e pontos, sobreposição de segmentos e outras transformações mistas.

## Dificuldade e resultados

A dificuldade é uma escala interna relativa usada para comparar exercícios gerados e escolher o próximo item no teste adaptativo. O resumo final pode mostrar apenas categorias qualitativas ou também valores numéricos. A dificuldade máxima com resposta correta corresponde ao exercício avaliado mais difícil respondido corretamente.

## Modo de exercício único

O modo de exercício único permite escolher família, dificuldade e, quando aplicável, transformações ou operações booleanas. É útil para praticar uma lógica visual específica ou reproduzir um exercício concreto.

## Reprodutibilidade

Cada matriz gerada tem uma seed. A mesma seed com as mesmas definições recria o mesmo exercício, facilitando relatórios de bugs e comparações entre versões.

## Utilização offline

O BlackWingMatrix também é distribuído como um único ficheiro HTML. Pode descarregar `blackwingmatrix.html` e abri-lo num navegador moderno sem backend, conta, base de dados, Node.js ou Python.

## Limitação importante

O BlackWingMatrix é uma ferramenta experimental de treino e avaliação relativa. **Não é um teste de inteligência padronizado**, não fornece um QI validado, não substitui as Raven's Progressive Matrices oficiais e não deve ser usado isoladamente para conclusões clínicas ou psicológicas.

## Início rápido

1. Abra a versão online ou o ficheiro HTML autónomo.
2. Escolha **Teste adaptativo** ou **Exercício único**.
3. Se necessário, defina o limite de tempo e o número máximo de exercícios.
4. Inicie a sessão e escolha uma das oito respostas para cada matriz.
5. No final, consulte o resumo. Feedback e explicações só aparecem se tiverem sido ativados.

## Licença e atribuição

O material original do BlackWingMatrix cujos direitos pertencem aos autores do repositório é distribuído sob a **Apache License 2.0**. Consulte [LICENSE](LICENSE), [NOTICE](NOTICE) e [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

O BlackWingMatrix deriva parcialmente de trabalho e ideias de **pyRavenMatrices — Can Mekik**. Os direitos sobre material de terceiros permanecem com os respetivos titulares; a declaração Apache-2.0 cobre apenas material sobre o qual os autores deste repositório têm autoridade.

## Reportar problemas

São especialmente úteis relatos de matrizes ambíguas, respostas aparentemente duplicadas, explicações pouco claras, problemas de renderização, dificuldade incoerente, regras não inferíveis e problemas em dispositivos móveis. Sempre que possível, inclua seed, família, nível, captura de ecrã e navegador.

---

BlackWingMatrix é um projeto experimental dedicado ao estudo e à prática de raciocínio visual gerado proceduralmente.
