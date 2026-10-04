# BlackWingMatrix

<details>
<summary>🌐 Język: Polski</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** to samodzielna aplikacja internetowa do ćwiczenia rozumowania abstrakcyjnego i wzrokowo-przestrzennego za pomocą proceduralnie generowanych macierzy logicznych 3×3.

Aktualna wersja: **1.31.1**.

## Wypróbuj online

**[Otwórz BlackWingMatrix w przeglądarce](https://everchangingpulse.github.io/BlackWingMatrix/)**

Wersja GitHub Pages otwiera się bezpośrednio w przeglądarce — nie trzeba nic pobierać ani instalować. Do pracy offline repozytorium zawiera również pełny samodzielny plik HTML.

## Jak działa program

Każde zadanie pokazuje macierz 3×3 z brakującym polem w prawym dolnym rogu. Należy wybrać właściwy kafelek spośród ośmiu odpowiedzi. Generator tworzy wiele rodzin reguł wizualnych zamiast korzystać ze stałego zestawu ręcznie przygotowanych pytań.

- rozpoznawanie wzorów wizualnych i relacji między wierszami i kolumnami
- zmiany kształtu, położenia, obrotu, odbicia i skali
- wypełnienia, sekwencje symboli, liczebności i kompozycje
- operacje na mini-siatkach oraz logika zbiorów/Boolowska
- zadania z wieloma niezależnymi regułami śledzonymi jednocześnie

## Tryby sesji

Selektor sesji oferuje pięć trybów:

- **Pojedyncze zadanie** — generuje odtwarzalne zadanie; można wybrać rodzinę i zakres jakościowy, a w odpowiednich rodzinach także przekształcenia lub operacje Boolowskie.
- **Test adaptacyjny** — standardowa sesja adaptacyjna po trzech zadaniach kalibracyjnych.
- **Stopniowy test adaptacyjny** — tryb domyślny; łagodniej zbliża się do oszacowanej granicy.
- **Progresywny test panoramiczny** — stopniowo podnosi trudność i zmienia odpowiednie rodziny, bez dostosowywania przebiegu do odpowiedzi.
- **Test według relacji logicznej** — ćwiczy wybraną grupę: przekształcenia przestrzenne, logikę Boolowską, relacje wierszy, kolumn, przekątnych, zewnętrzne/wewnętrzne lub ponownie używane.

## Test adaptacyjny i trudność

Wszystkie generatory korzystają ze wspólnej wewnętrznej skali **0–60** w pojedynczych zadaniach, kalibracji i wszystkich trybach testu; sześć widocznych etykiet to wyłącznie jakościowe zakresy tej skali.

Każda sesja adaptacyjna zaczyna się od trzech wygenerowanych zadań kalibracyjnych. Żądane trudności są wybierane na siatce 0,01: środkowy element ma 23–27, pierwszy 10–16, a trzeci uzupełnia sumę kalibracji 74–76. Rodziny są wybierane wyłącznie z generatorów, które potrafią rzeczywiście utworzyć żądaną trudność.

Po kalibracji następny poziom uwzględnia wcześniejsze wyniki, czas odpowiedzi, serie błędów, najwyższą poprawnie rozwiązaną trudność oraz bliskość błędnej opcji do rozwiązania w danej rodzinie. Tryb stopniowy tłumi początkowy wzrost i zapobiega trwałej eskalacji bez wiarygodnych sukcesów na wysokim poziomie.

Cztery opcje są niezależne i domyślnie wyłączone: pokaż poprawnie/błędnie, pokaż wyjaśnienie, pokaż wartości liczbowe podczas testu oraz pokaż wartości liczbowe w podsumowaniu końcowym.

## Informacja zwrotna i wyjaśnienia

Po włączeniu BlackWingMatrix wyjaśnia zamierzoną regułę wizualną. Po błędnej odpowiedzi opis koncentruje się na faktycznie wybranej opcji, wykorzystuje widoczne dowody z bieżącej macierzy, wskazuje co w odpowiedzi jest poprawne i pokazuje konkretną sprzeczność pozwalającą ją odrzucić.

## Rodziny zadań

Generator obejmuje m.in. przesunięcia na siatce, relacje między kształtem zewnętrznym i symbolem wewnętrznym, układy punktów, kompozycje linii, logikę mini-siatek, obroty poliomin, kształty i wypełnienia, wypełnienia diagonalne, kolejność symboli, wzory radialne, równoważenie bloków i punktów, nakładanie segmentów oraz inne mieszane transformacje.

## Trudność, wyniki i analiza

Podsumowanie pokazuje najtrudniejsze poprawnie rozwiązane oceniane zadanie, pokrycie rodzin, stabilność przebiegu i powód zakończenia sesji. Porównuje też przebieg po kalibracji z symulowanymi ścieżkami wszystkich poprawnych i wszystkich błędnych odpowiedzi o tym samym początku; nie jest to percentyl populacyjny ani wynik IQ.

Karta **Gauss** zapisuje historię lokalną, umożliwia eksport i import CSV, ponowne obliczenie zapisanych trudności oraz symulację 200 profili referencyjnych. Sesje adaptacyjne można też eksportować jako JSON i CSV.

## Tryb pojedynczego zadania

Tryb pojedynczego zadania pozwala wybrać rodzinę, trudność i — gdy ma to zastosowanie — transformacje lub operacje Boolowskie. Przydaje się do ćwiczenia konkretnego rodzaju logiki wizualnej lub odtworzenia wybranego zadania.

## Powtarzalność

Każda wygenerowana macierz ma seed. Ten sam seed i te same ustawienia odtwarzają to samo zadanie, co ułatwia zgłaszanie błędów i porównywanie wersji.

## Użycie offline

BlackWingMatrix jest również dostępny jako pojedynczy plik HTML. Można pobrać `blackwingmatrix.html` i otworzyć go w nowoczesnej przeglądarce bez backendu, konta, bazy danych, Node.js ani Pythona.

## Ważne ograniczenie

BlackWingMatrix jest eksperymentalnym narzędziem do ćwiczeń i względnej oceny. **Nie jest standaryzowanym testem inteligencji**, nie podaje zwalidowanego IQ, nie zastępuje oficjalnych Raven's Progressive Matrices i nie powinien być samodzielnie używany do wniosków klinicznych lub psychologicznych.

## Szybki start

1. Otwórz wersję online albo samodzielny plik HTML.
2. Wybierz tryb sesji. **Stopniowy test adaptacyjny** jest wybrany domyślnie.
3. Ustaw limit czasu i maksymalną liczbę zadań albo wybierz rodzinę i zakres dla pojedynczego zadania.
4. Rozpocznij sesję i dla każdej macierzy wybierz jedną z ośmiu odpowiedzi.
5. Na końcu sprawdź podsumowanie albo wyeksportuj wyniki. Informacja zwrotna i wyjaśnienia pojawiają się tylko wtedy, gdy zostały włączone.

## Licencja i atrybucja

Oryginalny materiał BlackWingMatrix, do którego autorzy repozytorium posiadają prawa, jest udostępniany na licencji **Apache License 2.0**. Zobacz [LICENSE](LICENSE), [NOTICE](NOTICE) i [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix częściowo wywodzi się z pracy i pomysłów projektu **pyRavenMatrices — Can Mekik**. Prawa do materiałów stron trzecich pozostają przy ich właścicielach; deklaracja Apache-2.0 dotyczy wyłącznie materiału, do którego autorzy tego repozytorium mają odpowiednie prawa.

## Zgłaszanie problemów

Szczególnie przydatne są zgłoszenia dotyczące niejednoznacznych macierzy, odpowiedzi wyglądających identycznie, niejasnych wyjaśnień, problemów z renderowaniem, niespójnej trudności, reguł niemożliwych do wywnioskowania i problemów na urządzeniach mobilnych. W miarę możliwości podaj seed, rodzinę, poziom, zrzut ekranu i przeglądarkę.

---

BlackWingMatrix to eksperymentalny projekt poświęcony badaniu i ćwiczeniu proceduralnie generowanego rozumowania wizualnego.
