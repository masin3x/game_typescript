# Instalacja
1. Przejście do katalogu gry.
2. Wpisanie komendy
```
npm install && npm start
```
3. Po zakończeniu instalacji w przeglądarce powinna otworzyć się karta pod adresem http://localhost:1234

# O grze
Celem gry jest łapanie jedzenia spadającego z góry ekranu.
Dstępnych jest 5 typów pożywienia:
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

# Kilka słów o architekturze gry
Podstawowe pliki gry:
```
plik html: src/index.html
plik js: src/app/app.ts
```

Głowną jednostką zarządzającą grą jest klasa Game (src/app/game/Game.ts).
Utworzony obiekt typu Game ma za zadanie komunikować ze sobą dwa niezależne moduły gry: 
- moduł logiczny: to tutaj zawarta jest cała logika gry i odbywają sie wszystkie obliczenia. Moduł ten przechowuje aktualny stan gry. Najważniejsze klasy:
  - StateService: odpowiada za modyfikacje stanu gry (State.ts) oraz  tworzy klatkę do wyrenderowania  (Frame.ts).
  - PlayerService: odpowiada za modyfikacje stanu gracza
  - ItemService: odpowiada za modyfikacje stanu przedmiotów
- moduł graficzny: odpowiedzialny jest za renderowanie grafiki. Najważniejsze klasy:
  - RendererService: odpowiada za tłumaczenie stanu (State.ts) i klatki gry (Frame.ts) dla silnika graficznego
  - GraphicsEngineBase: klasa abstrakcyjna odpowiedzialna za renderowanie obrazu.
  - PixiGraphicsEngine: klasa dziedzicząca z GraphicsEngineBase. Zawiera w sobie odwołania do silnika graficznego - w tym wypadku PixiJS.

W grze znajduje się również moduł matematyczny (klasa MathService) odpowiedzialny za przeliczenia matematyczne jak np. detekcja kolizji czy liczenie prawdopodobieństwa.
