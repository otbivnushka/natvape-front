# Telegram Mini App Authentication

## Общая схема

```
Фронт (Telegram Mini App)                Бэкенд (NestJS)
       │                                        │
       │  retrieveLaunchParams()                 │
       │  получает initDataRaw                   │
       │                                        │
       │  POST /api/auth/telegram               │
       │  { initData: "query_id=...&hash=..." }  │
       │───────────────────────────────────────>│
       │                                        │  validate(initData, BOT_TOKEN)
       │                                        │  parse(initData)
       │                                        │  проверка auth_date (< 1 hour)
       │                                        │  findByTelegramId / create user
       │                                        │  JWT.sign({ sub: user.id })
       │ <───────────────────────────────────────│
       │  { accessToken, user }                   │
       │                                        │
       │  сохраняет accessToken                   │
       │  Bearer token во все запросы             │
```

---

## Таблица `users`

| Колонка              | Тип                            | Описание                       |
| -------------------- | ------------------------------ | ------------------------------ |
| `id`                 | `INTEGER` (PK, auto increment) | Уникальный ID пользователя     |
| `telegram_id`        | `BIGINT` (UNIQUE, NOT NULL)    | Telegram user ID               |
| `telegram_username`  | `VARCHAR(255)` (nullable)      | Username из Telegram           |
| `telegram_photo_url` | `VARCHAR(500)` (nullable)      | Аватар из Telegram             |
| `name`               | `VARCHAR(100)`                 | Имя (из `first_name` Telegram) |
| `phone`              | `VARCHAR(20)` (nullable)       | Номер телефона                 |
| `avatar`             | `VARCHAR(500)` (nullable)      | Кастомный URL аватара          |
| `is_admin`           | `BOOLEAN` (default `false`)    | Флаг администратора            |
| `created_at`         | `TIMESTAMP` (auto)             | Дата создания                  |
| `updated_at`         | `TIMESTAMP` (auto)             | Дата обновления                |

### Связи

- `cartItems` → `CartItem[]` — корзина
- `wishlistItems` → `WishlistItem[]` — избранное
- `orders` → `Order[]` — заказы

### Entity (`src/users/entities/user.entity.ts`)

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  telegramId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  telegramUsername: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  telegramPhotoUrl: string | null;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string | null;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, (item) => item.user)
  cartItems: CartItem[];

  @OneToMany(() => WishlistItem, (item) => item.user)
  wishlistItems: WishlistItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
```

### Что изменилось

**Удалены:** `email`, `password` (и вся связанная логика — bcrypt, валидация email, `findByEmail`)

**Добавлены:** `telegramId`, `telegramUsername`, `telegramPhotoUrl`

---

## Эндпоинт: `POST /api/auth/telegram`

### DTO (`src/auth/dto/telegram-auth.dto.ts`)

```typescript
export class TelegramAuthDto {
  @IsString()
  initData: string;
}
```

**Body запроса:**

```json
{
  "initData": "query_id=AAHd...&user=%7B%22id%22%3A123...%7D&auth_date=171679...&hash=abc..."
}
```

### Ответ (200)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "telegramId": 123456789,
    "telegramUsername": "ivan_petrov",
    "telegramPhotoUrl": "https://t.me/i/userpic/...",
    "name": "Иван",
    "phone": null,
    "avatar": null,
    "isAdmin": false,
    "createdAt": "2026-05-27T10:00:00.000Z",
    "updatedAt": "2026-05-27T10:00:00.000Z"
  }
}
```

В ответе **нет** полей `email`, `password`, а также связанных коллекций (`cartItems`, `wishlistItems`, `orders`).

---

## Логика `AuthService.telegramAuth()`

**Файл:** `src/auth/auth.service.ts`

### Пошагово

1. **Проверка `BOT_TOKEN`** — если не задан в `.env` → `401 Unauthorized`

2. **Валидация initData**
   - Используется `validate(initData, botToken)` из `@telegram-apps/init-data-node`
   - Проверяет HMAC-SHA256 подпись по официальной схеме Telegram
   - Если невалидна → `401 Unauthorized`

3. **Парсинг initData**
   - `parse(initData)` возвращает объект с camelCase-ключами
   - Извлекается `authDate` (Date), `user` (Telegram user info)

4. **Проверка `auth_date`**
   - Разница с текущим временем не должна превышать 1 час
   - Если старше → `401 Unauthorized`

5. **Получение Telegram user**
   - Из `parsed.user`: `id`, `firstName`, `username`, `photoUrl`
   - Если `user` отсутствует → `401 Unauthorized`

6. **Find or create**
   - `usersService.findByTelegramId(tgUser.id)` — поиск по `telegramId`
   - Если найден — используем существующего
   - Если не найден — создаём нового:
     - `telegramId` = `tgUser.id`
     - `telegramUsername` = `tgUser.username` (или null)
     - `telegramPhotoUrl` = `tgUser.photoUrl` (или null)
     - `name` = `tgUser.firstName` (или `'User'`)

7. **JWT generation**
   - `jwtService.sign({ sub: user.id })`
   - Срок действия: **7 дней** (задаётся в `AuthModule`)
   - Подпись: `JWT_SECRET` из `.env`

8. **Response**
   - Из user удаляются связанные коллекции (`cartItems`, `wishlistItems`, `orders`)
   - Возвращается `{ accessToken, user }`

### Код

```typescript
async telegramAuth(dto: TelegramAuthDto) {
  if (!this.botToken) {
    throw new UnauthorizedException('BOT_TOKEN not configured');
  }

  let parsed: Record<string, unknown>;
  try {
    validate(dto.initData, this.botToken);
    parsed = parse(dto.initData);
  } catch {
    throw new UnauthorizedException('Invalid Telegram data');
  }

  const authDate = new Date(parsed.authDate as string).getTime();
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  if (now - authDate > oneHour) {
    throw new UnauthorizedException('Auth data expired');
  }

  const tgUser = parsed.user as
    | { id: number; firstName?: string; username?: string; photoUrl?: string }
    | undefined;

  if (!tgUser) {
    throw new UnauthorizedException('No user data in initData');
  }

  let user = await this.usersService.findByTelegramId(tgUser.id);

  if (!user) {
    user = await this.usersService.create({
      telegramId: tgUser.id,
      telegramUsername: tgUser.username ?? null,
      telegramPhotoUrl: tgUser.photoUrl ?? null,
      name: tgUser.firstName ?? 'User',
    });
  }

  const accessToken = this.jwtService.sign({ sub: user.id });

  const {
    cartItems: _cartItems,
    wishlistItems: _wishlistItems,
    orders: _orders,
    ...safeUser
  } = user;
  return { accessToken, user: safeUser };
}
```

---

## JWT Strategy (`src/auth/jwt.strategy.ts`)

Без изменений относительно предыдущей версии.

- Токен из заголовка `Authorization: Bearer <token>`
- Верификация по `JWT_SECRET`
- `validate(payload: { sub: number })` — загружает `User` из БД по `payload.sub`
- Если пользователь удалён или не найден — `401 Unauthorized`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET', 'natvape-secret-key'),
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
```

---

## Guards

### JwtAuthGuard (`src/common/guards/jwt-auth.guard.ts`)

Наследует `AuthGuard('jwt')` от `@nestjs/passport`. Если токен отсутствует/невалиден → `401 Unauthorized`.

Используется на:

- `CartController`
- `WishlistController`
- `OrdersController`
- `ProfileController`
- `AddressesController`
- `AdminController`

### AdminGuard (`src/common/guards/admin.guard.ts`)

Проверяет `request.user.isAdmin === true`. Если нет → `403 Forbidden`.

Используется **в паре с JwtAuthGuard** на всех маршрутах `AdminController`.

---

## Profile Controller (`src/profile/profile.controller.ts`)

Из response удалено поле `email`. Теперь profile возвращает:

```json
{
  "id": 1,
  "name": "Иван",
  "avatar": null,
  "phone": null,
  "isAdmin": false,
  "telegramUsername": "ivan_petrov",
  "telegramPhotoUrl": "https://t.me/i/userpic/...",
  "addresses": [...],
  "totalSpent": 300,
  "ordersCount": 5
}
```

---

## UsersService (`src/users/users.service.ts`)

- `findByEmail()` удалён
- Добавлен `findByTelegramId(telegramId: number)`:

```typescript
async findByTelegramId(telegramId: number): Promise<User | null> {
  return this.usersRepository.findOne({ where: { telegramId } });
}
```

Остальные методы (`findById`, `create`, `update`) без изменений.

---

## AuthModule (`src/auth/auth.module.ts`)

Без изменений. Импортирует:

- `UsersModule` — для `UsersService`
- `PassportModule`
- `JwtModule.registerAsync` — `JWT_SECRET` из ConfigService, `expiresIn: '7d'`

---

## Seed (`src/seed.ts`)

- Удалён `import * as bcrypt`
- User создаётся без `email`/`password`:

```typescript
const savedUser = await queryRunner.manager.save(User, {
  name: 'Максим Волков',
  telegramId: 123456789,
  telegramUsername: 'maxvolkov',
  phone: '+375291234567',
  isAdmin: true,
});
```

---

## Установленные пакеты

| Пакет                                  | Действие   |
| -------------------------------------- | ---------- |
| `@telegram-apps/init-data-node@2.0.10` | Установлен |
| `bcrypt@6.0.0`                         | Удалён     |
| `@types/bcrypt`                        | Удалён     |

---

## Переменные окружения (`.env`)

```
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="2342"
DB_NAME="natvape"
JWT_SECRET="123456"
UPLOAD_DIR="D:/uploads/natvape"
BASE_URL="http://localhost:3000"
BOT_TOKEN="7312345678:AAGxxxxxxxxxxxx"
```

**Новый параметр:** `BOT_TOKEN` — токен Telegram Bot (получается у [BotFather](https://t.me/botfather)).

---

## Пример запроса с фронта (Telegram Mini App)

```typescript
import { retrieveLaunchParams } from '@telegram-apps/sdk';

const { initDataRaw } = retrieveLaunchParams();

const res = await fetch('https://api.natvape.ru/api/auth/telegram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ initData: initDataRaw }),
});

const { accessToken, user } = await res.json();

// Сохраняем токен
localStorage.setItem('accessToken', accessToken);

// Используем во всех запросах
fetch('/api/cart', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

---

## Сводка изменений

| Компонент              | Было                                           | Стало                                                 |
| ---------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Регистрация            | `POST /auth/register` (email + password)       | —                                                     |
| Вход                   | `POST /auth/login` (email + password + bcrypt) | `POST /auth/telegram` (initData + validate)           |
| User: email            | `VARCHAR(255) UNIQUE`                          | удалён                                                |
| User: password         | `VARCHAR(255)` (bcrypt hash)                   | удалён                                                |
| User: telegramId       | —                                              | `BIGINT UNIQUE NOT NULL`                              |
| User: telegramUsername | —                                              | `VARCHAR(255) NULL`                                   |
| User: telegramPhotoUrl | —                                              | `VARCHAR(500) NULL`                                   |
| JWT payload            | `{ sub: user.id }`                             | без изменений                                         |
| JWT expiresIn          | 7d                                             | без изменений                                         |
| Guards                 | JwtAuthGuard + AdminGuard                      | без изменений                                         |
| Зависимости            | `bcrypt`                                       | `@telegram-apps/init-data-node`                       |
| Seed                   | user с email + bcrypt password                 | user с telegramId                                     |
| Profile response       | включает `email`                               | без `email`, с `telegramUsername`, `telegramPhotoUrl` |

---

## Публичные маршруты (без авторизации)

- `POST /api/auth/telegram`
- `GET /api/categories` (+ по ID)
- `GET /api/products` (+ по ID)
- `GET /api/images/:filename`
