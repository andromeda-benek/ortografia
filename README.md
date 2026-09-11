# Ortografia

Prosta, statyczna aplikacja do ćwiczenia polskiej ortografii: `u/ó`, `h/ch` oraz `ż/rz`.

## Funkcje

- trening składający się z 10 albo 20 losowych zadań;
- osobne zadanie dla każdego pasującego miejsca w słowie;
- natychmiastowa informacja zwrotna i prezentacja poprawnego zapisu;
- procent poprawnych odpowiedzi;
- końcowy podział na słowa błędne i poprawne;
- wykres maksymalnie 100 ostatnich wyników zapisanych lokalnie w przeglądarce;
- responsywny interfejs bez frameworków i zewnętrznych bibliotek.

## Uruchamianie lokalne

Ze względu na wczytywanie pliku tekstowego stronę najlepiej uruchomić przez prosty serwer HTTP:

```bash
cd ~/projekty/hydepark/ortografia
python3 -m http.server 8765 --bind 127.0.0.1
```

Następnie otwórz:

```text
http://127.0.0.1:8765/
```

Bez serwera strona skorzysta z awaryjnej, wbudowanej kopii początkowej listy.

## Edycja listy słów

Lista źródłowa znajduje się w pliku [`data/slowa.txt`](data/slowa.txt). Każde słowo należy umieścić w osobnym wierszu. Puste wiersze i wiersze rozpoczynające się od `#` są pomijane.

Aplikacja tworzy zadanie dla każdego wystąpienia jednego z fragmentów:

- `u` lub `ó`,
- `h` lub `ch`,
- `ż` lub `rz`.

Jeżeli słowo zawiera kilka takich miejsc, może pojawić się w treningu wielokrotnie — za każdym razem z innym miejscem do uzupełnienia.

## Testy

Wymagany jest Node.js 18 lub nowszy. Projekt nie wymaga instalowania zależności.

```bash
node --test tests/*.test.cjs
```

## Struktura

| Plik | Rola |
|---|---|
| `index.html` | Struktura interfejsu |
| `app/style.css` | Wygląd i układ responsywny |
| `app/logic.js` | Czysta, testowalna logika ćwiczeń |
| `app/browser.js` | Sterowanie interfejsem, historia i wykres |
| `data/slowa.txt` | Edytowalna lista słów |
| `tests/` | Testy logiki i statycznej strony |
| `PROJECT_CONTRACT.md` | Kontrakt stabilnych zachowań projektu |

## GitHub Pages

Struktura strony jest gotowa do publikacji bez procesu budowania. Konfiguracja GitHub Pages zostanie wykonana osobno, na wyraźne polecenie.
