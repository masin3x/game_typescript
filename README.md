# Instalacja
1. Przejście do katalogu gry.
2. Wpisanie komendy
```
npm install && npm start
```

# O grze
W grze dostępnych jest 5 typów jedzenia:
- pyszności (np. kurczak, piwo): złapane dodają punkty graczowi (1,5 lub 10), niezłapane odejmują życie,
- obrzydliwe (np. robaki,świńki łeb): złapane odejmują punkty graczowi (1,5 lub 10). Należy unikać tego jedzenia,
- niespodzianki, mogą mieć dobry lub zły wpływ na gracza (losowo), więc nie ma obowiązku ich łapania:
  - świecące na zielono: złapane dają punkty graczowi (1,5 lub 10) oraz czasowo zwiększają lub zmniejszają szybkość gracza,
  - świecące na niebiesko: złapane dają punkty graczowi (1,5 lub 10) oraz czasowo zwiększają lub zmniejszają wielkość gracza,
- regenerujące: świecą na czerwowo, złapane dają życie graczowi. Nie ma obowiązku łapania tego przedmiotu.

W grze dostępnych jest 13 poziomów. 13 poziom to niestety ten pechowy level.

Każdy level charakteryzuje się kilkoma atrybutami:
- częstotliwość generowania jedzenia,
- szybkość opadania jedzenia
- prawdopodobieństwo wystąpienia danego typu jedzenia

Level rośnie wraz z ilością złapnych przedmiotów - zaliczają sie do nich wszystkie typy jedzenia oprócz oczywiście obrzydliwości.

# Kilka słów o architekturze gry
plik html: src/index.html
plik js: src/app/app.ts

Głowną jednostką zarządzającą grą jest klasa Game (src/app/game/Game.ts).
Utworzony obiekt typu Game ma za zadanie komunikować ze sobą dwa niezależne moduły gry: 
- moduł logiczny: To tutaj zawarta jest cała logika gry i odbywają sie wszystkie obliczenia. Moduł ten przechowuje aktualny stan gry. Najważniejsze klasy:
  - StateService: Odpowiada za modyfikacje stanu(State.ts) gry oraz tworzy klatkę(Frame.ts) do wyrenderowania.
  - PlayerService: Odpowiada za modyfikacje stanu gracza
  - ItemService: Odpowiada za modyfikacje stanu przedmiotów
- moduł graficzny: Odpowiedzialny jest za renderowanie grafiki. Najważniejsze klasy:
  - RendererService: Odpowiada za tłumaczenie stanu i klatki gry dla silnika graficznego
  - GraphicsEngineBase: Klasa abstrakcyjna odpowiedzialna za renderowanie obrazu.
  - PixiGraphicsEngine: Klasa dziedzicząca z GraphicsEngineBase. Zawiera w sobie odwołania do silnika graficznego - w tym wypadku PixiJS.

Silnik graficzny gry nie ma żadnego powiązania z logiką gry. Takie podejście umożliwi w przyszłości opcjonalą łatwą zmiane silnika gry lub przeportowanie gry na inną platforme. (np. mobilną)

W grze znajduje się również moduł matematyczny (klasa MathService) odpowiedzialny za przeliczenia matematyczne jak np. detekcja kolizji czy liczenie prawdopodobieństwa.

# Rozwój gry
1. Grę można rozwijać dalej tworząć do niej różne nowe tryby gry, np:
- multiplayer: Logika gry zakłada w przyszłości obsługę drugiego gracza - w kodzie znajduję się wiele odwołań do drugiego gracza,
- timetrial: Nie zawiera leveli, Gra kończy się po określonym czasie, a gracz ma za zadanie zdobycie w tym czasie jak największej ilości punktów,
- survival: Jak długo uda się przetrwać graczowi z jednym życiem,
i inne w zależności od pomysłów :-)

2. Do gry można łatwo dodać nowy moduł audio. Na tej samej zasadzie co moduł graficzny intepretowałby on klatkę gry na dany dźwięk (złapanie przedmiotu, zdobycie nowego levelu itp)
3. Do gry można bardzo łatwo dodawać nowe poziomy (LevelRulesSerice), wystarczy dodać nową wartość do tablicy. Możliwe byłoby więc stworzenie konfiguratora poziomów dla użytkownika
4. Dodanie menu głównego gry: zawierałoby ono wybór trybu gry oraz ustawienia (głośność audio itp.)
