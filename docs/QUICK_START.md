# Quick Start Guide

## Минимальная настройка для запуска

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

```bash
cp .env.example .env
```

Отредактируйте `.env` и заполните минимальные переменные:

```env
# Минимум для запуска приложения (без отправки email)
DATABASE_URL="postgresql://user:password@localhost:5432/roude"
NEXTAUTH_SECRET="any-random-string-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Эти можно оставить пустыми для первого запуска
SENDGRID_API_KEY=""
FROM_EMAIL=""
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID=""
```

### 3. Настройка PostgreSQL

**Вариант A: Локальная установка**

macOS (Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
createdb roude
```

Linux:
```bash
sudo apt-get install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb roude
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

**Вариант B: Docker**

```bash
docker run --name roude-postgres \
  -e POSTGRES_DB=roude \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14
```

Затем обновите `DATABASE_URL` в `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/roude"
```

### 4. Инициализация базы данных

```bash
npm run prisma:generate
npm run prisma:migrate
```

При запросе имени миграции введите: `init`

### 5. Запуск приложения

```bash
npm run dev
```

Откройте http://localhost:3000

## Что работает без дополнительной настройки

✅ Главная страница
✅ Страница логина
✅ Дашборд (после настройки SendGrid)
✅ Роутинг и middleware

## Что требует дополнительной настройки

❌ Отправка magic link (нужен SendGrid)
❌ Оплата подписки (нужен Stripe)
❌ Отправка писем курса (нужен SendGrid)

## Настройка SendGrid для работы с email

1. Зарегистрируйтесь на https://sendgrid.com (бесплатно до 100 писем/день)
2. Verify sender email: Settings → Sender Authentication → Single Sender Verification
3. Создайте API key: Settings → API Keys → Create API Key (Full Access)
4. Добавьте в `.env`:
```env
SENDGRID_API_KEY="SG.xxxxxxxxxxxx"
FROM_EMAIL="your-verified@email.com"
```

## Настройка Stripe для приёма платежей

1. Зарегистрируйтесь на https://stripe.com
2. Переключитесь в Test Mode
3. Получите ключи: Developers → API keys
4. Создайте продукт: Products → Add Product
5. Создайте цену (Price) для продукта
6. Добавьте в `.env`:
```env
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
STRIPE_PRICE_ID="price_xxxxxxxxxxxx"
```

## Проверка работоспособности

```bash
# Проверить что сервер запустился
curl http://localhost:3000

# Проверить API health
curl http://localhost:3000/api/auth/send-link \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Открыть Prisma Studio для просмотра БД
npm run prisma:studio
```

## Типичные ошибки

### "Error: P1001: Can't reach database server"
- PostgreSQL не запущен или неверный DATABASE_URL
- Проверьте: `psql $DATABASE_URL`

### "PrismaClientInitializationError"
- Не запущен `prisma generate`
- Решение: `npm run prisma:generate`

### "MODULE_NOT_FOUND"
- Не установлены зависимости
- Решение: `rm -rf node_modules package-lock.json && npm install`

### "Port 3000 already in use"
- Порт занят другим процессом
- Решение: `lsof -ti:3000 | xargs kill -9`

## Следующие шаги

После успешного запуска переходите к:
- [SETUP.md](./SETUP.md) - полная настройка продакшена
- [AUTH.md](./AUTH.md) - документация аутентификации
- [README.md](./README.md) - обзор проекта
