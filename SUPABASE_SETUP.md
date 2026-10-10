# ☁️ Подключение PyTactics к Supabase (проект `informatika`) — пошаговая инструкция

Итог: ученики регистрируются (email + пароль), звёзды за уровни летят в твой
проект `informatika`, ты видишь весь класс. Без входа игра тоже работает
(прогресс в браузере).

Время: ~15 минут. Понадобится доступ к Supabase Dashboard твоего проекта.

---

## Шаг 0. Открой Dashboard

1. Зайди на https://supabase.com/dashboard → выбери проект **`informatika`**.
2. Дальше все пути — от главной страницы проекта.

## Шаг 1. Создай таблицы (2 минуты)

1. Слева в меню: **SQL Editor** → **New query**.
2. Вставь целиком этот SQL и нажми **Run**:

```sql
-- Профили учеников (id = id из auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz default now()
);

-- Прогресс: одна строка = лучший результат ученика на уровне
create table if not exists public.progress (
  user_id uuid references auth.users(id) on delete cascade,
  level_id int,
  stars int check (stars between 0 and 3),
  best_turns int,
  updated_at timestamptz default now(),
  primary key (user_id, level_id)
);

-- Включаем защиту на уровне строк
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

-- Каждый видит и меняет ТОЛЬКО свои строки
create policy "read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

create policy "read own progress"   on public.progress for select using (auth.uid() = user_id);
create policy "insert own progress" on public.progress for insert with check (auth.uid() = user_id);
create policy "update own progress" on public.progress for update using (auth.uid() = user_id);
```

3. Проверка: слева **Table Editor** → должны появиться `profiles` и `progress` (пока пустые — это нормально).

> Таблицы новые, твой существующий проект `informatika` они не трогают.

## Шаг 2. Настрой вход по email (1 минута)

1. Меню **Authentication** → **Providers** → **Email** должен быть **Enabled**.
2. Для школы проще без писем: **Authentication** → **Providers** → **Email** →
   выключи **Confirm email** (ученики смогут играть сразу после регистрации).
   ⚠️ Минус: кто угодно регистрируется на любой email. Для класса — приемлемо,
   для зачётов — оставь подтверждение включённым.
3. (Необязательно) Там же можно включить **Magic Link** — вход без пароля по письму.

## Шаг 3. Скопируй ключи в игру (2 минуты)

1. Меню **Project Settings** (шестерёнка внизу) → **API**.
2. Скопируй два значения:
   - **Project URL** → `https://xyzcompany.supabase.co`
   - **anon public** ключ (длинный, начинается с `eyJ...`).
3. Открой в игре файл **`js/config.js`** и вставь их вместо `PASTE_...`:

```js
window.PYT_CONFIG = {
  SUPABASE_URL: "https://xyzcompany.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
};
```

> ❓ «Ключ же будет виден на GitHub — это безопасно?»
> Да. Это **публичный** anon-ключ, он и так светится в любом фронтенде.
> Чужие данные защищены RLS-политиками из шага 1: каждый читает только свои строки.
> **Никогда** не клади в `config.js` ключ `service_role` (секретный) — он только для сервера.

## Шаг 4. Проверь локально (3 минуты)

1. Открой `index.html` → должна быть вселенная с тремя галактиками.
2. Нажми **Войти / Регистрация** → введи ник, email, пароль (мин. 6 символов) → **Регистрация**.
   - Если выключал Confirm email — сразу войдёшь (шапка покажет `☁️ прогресс в облаке`).
   - Если нет — проверь почту, подтверди, потом **Войти**.
3. Открой любую планету, пройди уровень.
4. Вернись в Dashboard → **Table Editor** → `progress`: появилась строка
   `(user_id, level_id, stars, best_turns)`. В `profiles` — никнейм. ✅
5. Открой игру в другом браузере / инкогнито, войди тем же аккаунтом —
   звёзды подтянутся из облака. ✅

## Шаг 5. Деплой на GitHub Pages

Как обычно: залей файлы (включая `js/config.js`) → Settings → Pages → `main`/`root`.
Дополнительно ничего настраивать не надо. Файл `.github/workflows/static.yml`
задеплоит сам.

## Шаг 6. Как учителю смотреть прогресс класса

Вариант А — глазами: **Table Editor** → `progress` (там же видно `user_id`).

Вариант Б — красивая таблица (SQL Editor → Run):

```sql
select p.nickname as ученик, pr.level_id as уровень,
       pr.stars as звёзды, pr.best_turns as ходов, pr.updated_at as когда
from progress pr
left join profiles p on p.id = pr.user_id
order by ученик, уровень;
```

Вариант В — сводка «кто сколько прошёл»:

```sql
select p.nickname as ученик,
       count(*) as уровней, sum(pr.stars) as звёзд
from progress pr
left join profiles p on p.id = pr.user_id
group by ученик
order by звёзд desc;
```

> Dashboard обходит RLS (у тебя полный доступ), ученики через игру видят только своё.

## Шаг 7. Если что-то не работает

| Симптом | Причина → лечение |
|---|---|
| Шапка пишет «💾 гостевой режим» | `config.js` не заполнен (там `PASTE_...`) → шаг 3 |
| «Не вышло: Email not confirmed» | Включён Confirm email → подтверди письмо или выключи (шаг 2) |
| Звёзды не сохраняются, в консоли `new row violates row-level security` | Политики не созданы / опечатка → повтори шаг 1 целиком |
| `Failed to fetch` в консоли | Нет интернета (CDN supabase-js) или неверный URL → игра молча работает локально |
| Письма подтверждения не приходят | Supabase free-шлёт мало писем → проще выключить Confirm email (шаг 2) |
| Хочу стереть тестовые данные | SQL Editor: `delete from progress; delete from profiles;` |

## Как это устроено в коде (коротко)

- `js/config.js` — URL + anon-ключ.
- `js/backend.js` — `init()` (сессия → подтянуть облако в кэш),
  `saveStars()` (сразу в localStorage + `upsert` в `progress`),
  `signUp/signIn/signOut`. Без конфига или сети — всё работает локально.
- `index.html` + `js/universe.js` — карта вселенной, планеты открываются по порядку
  (планета N — когда есть звезда за N−1), вход/регистрация в модалке.
- `game.html?level=N` + `js/ui.js` — арена, звёзды сохраняются в облако при победе.
