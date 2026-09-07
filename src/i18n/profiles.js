import { catProfiles } from '../data/catProfiles.js';
const entries = {};
const set = (source, en, ru) => { entries[source] = { pl: source, en, ru }; };
[
  ['szczepienia podstawowe aktualne', 'core vaccinations up to date', 'основные прививки актуальны'],
  ['regularnie odrobaczana', 'regularly dewormed', 'регулярно обработана от глистов'], ['regularnie odrobaczany', 'regularly dewormed', 'регулярно обработан от глистов'],
  ['wysterylizowana', 'spayed', 'стерилизована'], ['wykastrowany', 'neutered', 'кастрирован'], ['zaczipowana', 'microchipped', 'чипирована'], ['zaczipowany', 'microchipped', 'чипирован'],
  ['testy FIV/FeLV ujemne', 'FIV/FeLV tests negative', 'тесты FIV/FeLV отрицательные'], ['delikatna dieta dla wrażliwego żołądka', 'gentle diet for a sensitive stomach', 'щадящая диета для чувствительного желудка'],
  ['kontrola stomatologiczna co 6 miesięcy', 'dental check every 6 months', 'осмотр зубов каждые 6 месяцев'], ['odrobaczony i zabezpieczony przeciw pasożytom', 'dewormed and protected against parasites', 'обработан от глистов и защищён от паразитов'],
  ['ciekawość', 'curiosity', 'любопытство'], ['zabawa', 'playfulness', 'игривость'], ['bliskość', 'closeness', 'общительность'], ['przytulanie', 'cuddles', 'ласка'],
].forEach(row => set(...row));
const translated = {
  luna: {
    imageAlt: ['Luna, a calm cat resting in the café', 'Луна — спокойная кошка, отдыхающая в кафе'],
    age: ['4 years', '4 года'], birth: ['born around 12 August 2022', 'родилась примерно 12 августа 2022'], joined: ['14 October 2024', '14 октября 2024'],
    story: [
      ['Luna was not born in the café. She spent her early years in a quiet home. When her guardians moved abroad, a partner rescue foundation took her into care.', 'Луна не родилась в кафе. Первые годы она жила в спокойном доме. После переезда хозяев за границу её взял под опеку дружественный фонд.'],
      ['She arrived at Niebieski Kot on 14 October 2024. She settled into a separate room first. A week later she chose the armchair beside the bookshelf as her spot to watch guests.', 'Она приехала в Niebieski Kot 14 октября 2024 года. Сначала адаптировалась в отдельной комнате. Через неделю сама выбрала кресло у книжного шкафа, чтобы наблюдать за гостями.'],
      ['Her birth date is approximate, based on records given to the foundation and a veterinary examination.', 'Дата рождения приблизительная: её определили по документам фонда и ветеринарному осмотру.'],
    ],
    healthIntro: ['Luna is under regular veterinary care. She has a sensitive digestive system, so she receives tried-and-tested food and must not be fed by guests.', 'Луна под постоянным наблюдением ветеринара. У неё чувствительное пищеварение, поэтому она получает проверенный корм. Гостям нельзя её подкармливать.'],
    routine: [
      ['Breakfast with food for a sensitive stomach.', 'Завтрак с кормом для чувствительного желудка.'], ['A walk around the room before the first guests arrive.', 'Обход зала перед приходом первых гостей.'], ['A nap on the shelf or in the rest room.', 'Сон на полке или в комнате отдыха.'], ['Quiet time with guests near the bookshelf.', 'Спокойные встречи с гостями у книжного шкафа.'], ['Dinner, brushing and a quiet evening.', 'Ужин, расчёсывание и вечернее спокойствие.'],
    ],
    seoDescription: ['Meet Luna: her story, calm personality, health, favourite places and daily routine at Niebieski Kot.', 'Познакомьтесь с Луной: её история, спокойный характер, здоровье, любимые места и распорядок в Niebieski Kot.'],
  },
  mochi: {
    imageAlt: ['Mochi, a gentle tomcat and nap champion', 'Мочи — ласковый кот и мастер сна'], age: ['6 years', '6 лет'], birth: ['born around 2 March 2020', 'родился примерно 2 марта 2020'], joined: ['18 June 2025', '18 июня 2025'],
    story: [
      ['Mochi was found at allotments in Opole. He was used to people, but no one came forward to claim him. After a check-up he moved into a foster home run by a local foundation.', 'Мочи нашли на садовых участках в Ополе. Он был ручным, но хозяева не объявились. После обследования он поселился во временном доме местного фонда.'],
      ['He arrived at the café on 18 June 2025. His first night was in the settling-in room. The next morning he fell asleep on his carer’s blanket — that was when we knew he felt safe.', 'Он приехал в кафе 18 июня 2025 года. Первую ночь провёл в комнате адаптации. Утром заснул на пледе опекуна — тогда мы поняли, что ему спокойно.'],
      ['His age is an estimate. The vet assessed his teeth, body development and the results of his first tests.', 'Возраст приблизительный. Ветеринар оценил зубы, телосложение и результаты первых обследований.'],
    ],
    healthIntro: ['Mochi feels well and takes no regular medication. Following earlier dental treatment, we check his teeth regularly and mainly feed him wet food.', 'Мочи чувствует себя хорошо и не принимает постоянных лекарств. После стоматологического лечения мы регулярно проверяем зубы и даём преимущественно влажный корм.'],
    likes: [null, null, null, null, null, ['paper bags without handles', 'бумажные пакеты без ручек']],
    routine: [
      ['Wet food, water and a quick wellbeing check.', 'Влажный корм, вода и короткая проверка самочувствия.'], ['Gentle play with a ball or a sniffing mat.', 'Спокойная игра с мячиком или нюхательным ковриком.'], ['The longest nap in the quiet part of the café.', 'Самый длинный сон в тихой части кафе.'], ['Time with guests at the book tables.', 'Компания гостей у столиков с книгами.'], ['Dinner, coat care and rest.', 'Ужин, уход за шерстью и отдых.'],
    ],
    seoDescription: ['Meet Mochi: his story, gentle personality, health, favourite rituals and daily life at Niebieski Kot.', 'Познакомьтесь с Мочи: его история, мягкий характер, здоровье, любимые ритуалы и жизнь в Niebieski Kot.'],
  },
  pixel: {
    imageAlt: ['Pixel, a young cat looking for a home', 'Пиксель — молодой кот, который ищет дом'], age: ['2 years', '2 года'], birth: ['born around 18 May 2024', 'родился примерно 18 мая 2024'], joined: ['3 February 2026', '3 февраля 2026'],
    story: [
      ['Pixel was not born in the café. He was found as a young cat at allotments in Opole and placed in a local foster home.', 'Пиксель не родился в кафе. Его нашли молодым котом на садовых участках в Ополе и передали в местный временный дом.'],
      ['He arrived at Niebieski Kot on 3 February 2026. He spent two days in a quiet settling-in room. On day three he explored the café himself, and a week later found his favourite hideaway under the table by the window.', 'Он приехал в Niebieski Kot 3 февраля 2026 года. Два дня провёл в тихой комнате адаптации. На третий сам вышел осматривать зал, а через неделю нашёл любимое укрытие под столиком у окна.'],
      ['His birth date is approximate: the vet estimated May 2024 from his teeth and general development.', 'Дата рождения приблизительная: ветеринар определил май 2024 года по зубам и общему развитию.'],
    ],
    placeText: ['Pixel could live with a calm adult cat after a careful introduction. We prefer a home without very young children, with secured windows and at least two short play sessions a day.', 'Пиксель может жить со спокойным взрослым котом после правильного знакомства. Предпочтителен дом без очень маленьких детей, с защищёнными окнами и минимум двумя короткими играми в день.'],
    routine: [
      ['Breakfast and a quick wellbeing check.', 'Завтрак и короткая проверка самочувствия.'], ['His most energetic play session with the carer.', 'Самая активная игра с опекуном.'], ['A nap in a quiet place away from the café room.', 'Сон в тихом месте вне гостевого зала.'], ['Watching guests and hunting the toy wand.', 'Наблюдение за гостями и охота на удочку.'], ['Dinner, winding down and a night patrol of the boxes.', 'Ужин, отдых и ночной обход коробок.'],
    ],
    seoDescription: ['Meet Pixel: his story, personality, health, favourite games and ideal home.', 'Познакомьтесь с Пикселем: его история, характер, здоровье, любимые игры и желанный дом.'],
  },
};
for (const [slug, fields] of Object.entries(translated)) {
  const cat = catProfiles[slug];
  for (const [field, translations] of Object.entries(fields)) {
    if (['story', 'likes', 'routine'].includes(field)) {
      translations.forEach((pair, i) => { if (pair) set(field === 'routine' ? cat[field][i][1] : cat[field][i], ...pair); });
    } else set(cat[field], ...translations);
  }
}
export default entries;
