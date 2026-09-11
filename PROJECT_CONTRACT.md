# Project Contract

## Cel projektu

Zapewnić prostą, statyczną stronę do treningu polskiej ortografii na podstawie ręcznie edytowalnej listy słów.

## Aktualny zakres

- pary `u/ó`, `h/ch` i `ż/rz`;
- sesje po 10 albo 20 losowych, unikalnych zadań;
- osobne zadanie dla każdego kwalifikującego się miejsca w słowie;
- jedna odpowiedź na zadanie, liczona jako poprawna albo błędna;
- po odpowiedzi komentarz i pełny poprawny zapis słowa;
- wynik liczbowy i procentowy;
- końcowa lista wszystkich pozycji treningu: najpierw błędne, potem poprawne;
- historia maksymalnie 100 podsumowań w `localStorage` pod kluczem `ortografia.history.v1`;
- wykres procentowych wyników;
- działanie jako statyczna strona bez procesu budowania.

## Stabilne zachowania — nie zmieniać bez zgody

- Użytkownik zawsze wybiera sesję 10 albo 20 zadań.
- W pojedynczym zadaniu ukryte jest dokładnie jedno wystąpienie.
- Dostępne są dokładnie dwa kafelki z właściwej pary ortograficznej.
- Każde kwalifikujące się wystąpienie w słowie tworzy osobne możliwe zadanie.
- Po odpowiedzi zawsze widoczny jest pełny poprawny zapis i jednoznaczny komentarz.
- Wynik jest liczony na podstawie pierwszej i jedynej odpowiedzi na każde zadanie.
- W podsumowaniu błędne pozycje występują przed poprawnymi; zachowywane są powtórzenia słowa wynikające z różnych zadań.
- Historia zachowuje najwyżej 100 najnowszych wyników i nie opuszcza urządzenia.
- Lista `data/slowa.txt` pozostaje ręcznie edytowalnym źródłem danych.
- Publikacja oraz eksport strony są wykonywane wyłącznie na wyraźne polecenie.

## Pliki stabilne — nie zmieniać bez zgody

- `index.html`
- `app/browser.js`
- `app/logic.js`
- `app/style.css`
- `data/slowa.txt`

## Fragmenty/funkcje stabilne — nie zmieniać bez zgody

- `generateTasks()` — reguły wykrywania fragmentów i tworzenia zadań;
- `createSession()` — liczebność i unikalność zestawu;
- `evaluateAnswer()` oraz `summarizeResults()` — sposób oceniania;
- `appendHistory()` i klucz `ortografia.history.v1` — format historii;
- kolejność sekcji `incorrect` przed `correct` w podsumowaniu.

## Pliki, które można zmieniać przy typowych poprawkach

- `README.md`
- testy odpowiadające zatwierdzonej zmianie;
- nowe pliki dokumentacyjne i narzędziowe, jeśli nie zmieniają stabilnych zachowań.

## Procedura zmiany

Przed każdą zmianą AI ma napisać:

1. jaki problem naprawia,
2. jakie pliki chce zmienić,
3. czy któryś z nich jest na liście stabilnej,
4. czego nie będzie ruszać,
5. jakie testy uruchomi.

Jeżeli zmiana wymaga edycji pliku stabilnego, AI musi najpierw uzyskać zgodę.

## Testy regresyjne

Po każdej zmianie sprawdzić:

- [ ] `node --test tests/*.test.cjs` kończy się powodzeniem;
- [ ] lista 18 słów generuje co najmniej 20 unikalnych zadań;
- [ ] można rozpocząć sesję 10 i 20 zadań;
- [ ] błędna oraz poprawna odpowiedź pokazują pełny poprawny wyraz;
- [ ] odpowiedź blokuje oba kafelki do czasu przejścia dalej;
- [ ] po ostatnim zadaniu pojawia się poprawny procent;
- [ ] błędne słowa są wyświetlane przed poprawnymi;
- [ ] wykres i historia aktualizują się po treningu;
- [ ] konsola przeglądarki nie zawiera błędów;
- [ ] układ pozostaje czytelny na szerokim i wąskim ekranie.

## Otwarte problemy

- GitHub Pages nie jest jeszcze skonfigurowany.
- Awaryjna lista w `app/browser.js` powiela dane początkowe z `data/slowa.txt`; jest używana wyłącznie wtedy, gdy przeglądarka blokuje odczyt pliku tekstowego.
