// Legacy admin copy is keyed by its original text; values have all supported locales.
const rows = [
 ['Демо-режим · только этот браузер', 'Demo mode · this browser only', 'Tryb demo · tylko ta przeglądarka'],
 ['Открыть сайт', 'Open website', 'Otwórz stronę'],
 ['Panel administracyjny', 'Administration panel', 'Panel administracyjny', 'Панель управления'],
 ['Управление кафе', 'Café management', 'Zarządzanie kawiarnią'],
 ['Изменяйте данные для будущего сайта: расписание, цены, события, доступность и информацию о котах.', 'Edit local draft data: schedule, prices, events, availability and cats. Your custom text is not translated automatically.', 'Edytuj lokalny szkic: godziny, ceny, wydarzenia, dostępność i koty. Własne teksty nie są tłumaczone automatycznie.'],
 ['Сбросить', 'Reset', 'Przywróć dane'], ['Сохранить изменения', 'Save changes', 'Zapisz zmiany'], ['Сохранено в этом браузере.', 'Saved in this browser.', 'Zapisano w tej przeglądarce.'],
 ['Расписание', 'Opening hours', 'Godziny otwarcia'], ['День', 'Day', 'Dzień'], ['Часы работы', 'Hours', 'Godziny'], ['Удалить день', 'Remove day', 'Usuń dzień'], ['Добавить день', 'Add day', 'Dodaj dzień'],
 ['Цены меню', 'Menu prices', 'Ceny menu'], ['Позиция меню', 'Menu item', 'Pozycja menu'], ['Цена', 'Price', 'Cena'], ['Удалить позицию', 'Remove item', 'Usuń pozycję'], ['Добавить позицию', 'Add item', 'Dodaj pozycję'],
 ['События', 'Events', 'Wydarzenia'], ['Название события', 'Event name', 'Nazwa wydarzenia'], ['Дата события', 'Event date', 'Data wydarzenia'], ['Количество мест', 'Number of places', 'Liczba miejsc'], ['Статус события', 'Event status', 'Status wydarzenia'],
 ['Записи открыты', 'Registration open', 'Zapisy otwarte'], ['Планируется', 'Planned', 'Planowane'], ['Завершено', 'Completed', 'Zakończone'], ['Удалить событие', 'Remove event', 'Usuń wydarzenie'], ['Добавить событие', 'Add event', 'Dodaj wydarzenie'],
 ['Свободные места', 'Availability', 'Wolne miejsca'], ['Статус', 'Status', 'Status'], ['Спокойно', 'Quiet', 'Spokojnie'], ['Умеренно занято', 'Moderately busy', 'Umiarkowanie zajęte'], ['Почти нет мест', 'Almost full', 'Prawie pełno'], ['Полностью занято', 'Full', 'Brak miejsc'], ['Подпись', 'Caption', 'Podpis'],
 ['Этот статус можно вывести на главном экране рядом с кнопкой бронирования.', 'This is a local draft, not live availability. Saving does not publish this status.', 'To lokalny szkic, a nie dostępność na żywo. Zapis nie publikuje tego statusu.'],
 ['Информация о котах', 'Cat information', 'Informacje o kotach'], ['Имя кота', 'Cat name', 'Imię kota'], ['Статус кота', 'Cat status', 'Status kota'], ['Короткое описание кота', 'Short cat description', 'Krótki opis kota'], ['Добавить кота', 'Add cat', 'Dodaj kota'],
 ['Важно:', 'Important:', 'Ważne:'],
 ['это локальная демонстрационная админка. Данные сохраняются только в localStorage текущего браузера и пока не меняют публичные данные на Vercel. Для запуска нужны авторизация, база данных и серверный API.', 'This is a local demo editor, not a secured production admin panel. Data stays in this browser and does not change the public Vercel site. A real launch needs authentication, a database and a server API.', 'To lokalny edytor demonstracyjny, a nie zabezpieczona administracja produkcyjna. Dane pozostają w tej przeglądarce i nie zmieniają publicznej strony Vercel. Prawdziwe uruchomienie wymaga logowania, bazy danych i serwerowego API.'],
 ['Новый день', 'New day', 'Nowy dzień'], ['Новая позиция', 'New item', 'Nowa pozycja'], ['Новое событие', 'New event', 'Nowe wydarzenie'], ['Дата и время', 'Date and time', 'Data i godzina'], ['Новый кот', 'New cat', 'Nowy kot'], ['Новый статус', 'New status', 'Nowy status'], ['Возраст · характер', 'Age · personality', 'Wiek · charakter'],
 ['Удалить {name}', 'Remove {name}', 'Usuń {name}'],
 ['Сбросить все локальные изменения?', 'Reset all local changes?', 'Przywrócić wszystkie lokalne dane?'],
 ['Не удалось сохранить. Разрешите хранение данных в браузере.', 'Could not save. Allow browser storage and try again.', 'Nie udało się zapisać. Zezwól na przechowywanie danych w przeglądarce.'],
 ['Проверьте поля: цены и количество мест не могут быть отрицательными или пустыми.', 'Check the fields: prices and places must be valid non-negative numbers; text fields cannot be empty.', 'Sprawdź pola: ceny i liczba miejsc muszą być poprawnymi nieujemnymi liczbami; pola tekstowe nie mogą być puste.'],
 ['Есть несохранённые изменения.', 'You have unsaved changes.', 'Masz niezapisane zmiany.'],
];
const result = Object.fromEntries(rows.map(([source,en,pl,ru=source])=>[source,{pl,en,ru}]));
const defaults = [
 ['Poniedziałek','Monday','Понедельник'],['Wtorek–Piątek','Tuesday–Friday','Вторник–пятница'],['Sobota–Niedziela','Saturday–Sunday','Суббота–воскресенье'],['zamknięte','closed','закрыто'],
 ['Każda niedziela · 10:00','Every Sunday · 10:00','Каждое воскресенье · 10:00'],['Każdy piątek · 18:00','Every Friday · 18:00','Каждую пятницу · 18:00'],
 ['Dużo wolnych miejsc · aktualizacja ręczna','Plenty of places · manually updated','Много свободных мест · обновляется вручную'],
 ['Zapisy otwarte','Registration open','Запись открыта'],['Planowane','Planned','Планируется'],['Zakończone','Completed','Завершено'],['Spokojnie','Quiet','Спокойно'],['Umiarkowanie zajęte','Moderately busy','Умеренно занято'],['Prawie pełno','Almost full','Почти нет мест'],['Brak miejsc','Full','Полностью занято'],
 ['Stała gospodyni','Permanent host','Постоянная хозяйка'],['Stały gospodarz','Permanent host','Постоянный хозяин'],['Szuka domu','Looking for a home','Ищет дом'],
];
for(const [pl,en,ru] of defaults) result[pl]={pl,en,ru};
export default result;
