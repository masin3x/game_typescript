# Instalacja
1. Przejście do katalogu gry.
2. Wpisanie komendy
```
npm install && npm start
```
3. Po zakończeniu instalacji w przeglądarce powinna otworzyć się karta pod adresem http://localhost:1234

# O grze
Celem gry jest łapanie jedzenia spadającego z góry ekranu.
Dostępnych jest 5 typów pożywienia:
- pyszności (np. kurczak, piwo): złapane dodają punkty graczowi (1,5 lub 10), niezłapane odejmują życie,
- obrzydliwe (np. robaki,świńki łeb): złapane odejmują punkty graczowi (1,5 lub 10). Należy unikać tego jedzenia,
- niespodzianki, mogą mieć dobry lub zły wpływ na gracza (losowo), więc nie ma obowiązku ich łapania:
  - świecące na zielono: złapane dają punkty graczowi (1,5 lub 10) oraz czasowo zwiększają lub zmniejszają szybkość gracza,
  - świecące na niebiesko: złapane dają punkty graczowi (1,5 lub 10) oraz czasowo zwiększają lub zmniejszają rozmiar gracza,
- regenerujące: świecą na czerwowo, złapane dają życie graczowi. Nie ma obowiązku łapania tego przedmiotu.

W grze dostępnych jest 13 poziomów. 13 poziom to niestety ten pechowy level.

Każdy level charakteryzuje się kilkoma atrybutami:
- częstotliwość generowania jedzenia,
- szybkość opadania jedzenia
- prawdopodobieństwo wystąpienia danego typu jedzenia

Level rośnie wraz z ilością złapnych przedmiotów - zaliczają sie do nich wszystkie typy jedzenia oprócz oczywiście obrzydliwości.
