# 📊 E2E Test Automation Analytics Dashboard

Современный веб-дашборд для визуализации результатов автоматизированных E2E-тестов, запускаемых на базе **Playwright**, с аналитикой прогонов на графиках **Recharts**, детализацией упавших тестов, стектрейсами и логами шагов.

---

## 🚀 Технологический стек

- **Фреймворк**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Стилизация**: [Tailwind CSS v4](https://tailwindcss.com/) (Dark Mode UI, Glassmorphism)
- **Тестирование**: [Playwright Test](https://playwright.dev/) (Chromium, параллельный запуск, JSON репортер)
- **Визуализация данных**: [Recharts](https://recharts.org/) (Pie/Donut диаграмма распределения статусов, BarChart длительности тестов)
- **Иконки**: [Lucide React](https://lucide.dev/)

---

## 🏛 Архитектура проекта

```text
├── app/
│   ├── api/
│   │   ├── test-results/route.ts  # Парсинг JSON-отчета Playwright и отдача метрик
│   │   └── run-tests/route.ts     # Триггер запуска тестов из UI дашборда
│   ├── globals.css                # Tailwind стили и глобальная палитра
│   ├── layout.tsx                 # Главный шаблон приложения
│   └── page.tsx                   # Клиентский дашборд с графиками, таблицей и логами
├── e2e/
│   └── sample.spec.ts             # Набор моковых E2E-тестов (passed + failed кейсы)
├── playwright-report/
│   └── test-results.json          # Генерируемый JSON-отчет прогона тестов
├── types/
│   └── test-report.ts             # TypeScript интерфейсы структуры отчета и тестов
├── playwright.config.ts           # Конфигурация Playwright (JSON репортер)
└── package.json
```

---

## 🛠️ Возможности дашборда

1. **Интерактивные KPI**:
   - Общее количество тестов.
   - Количество успешных (Passed) и процент успешности (Pass Rate).
   - Количество упавших (Failed) с подсветкой критических ошибок.
   - Суммарная и индивидуальная длительность прогона.

2. **Графики Recharts**:
   - **Donut Chart**: Соотношение Passed / Failed / Skipped тестов.
   - **Bar Chart**: Время выполнения каждого тест-кейса в миллисекундах.

3. **Таблица и диагностика тестов**:
   - Фильтрация по статусам (*All*, *Passed*, *Failed*) и динамический поиск.
   - Раскрывающаяся строка с деталями:
     - Очищенное от ANSI-кодов сообщение об ошибке.
     - Точный сниппет упавшего кода с номерами строк.
     - Полный Stack Trace.
     - Шаги выполнения теста (Steps) и затраченное время.

4. **Запуск тестов в один клик**:
   - Кнопка **"Run All Tests"** вызывает эндпоинт `/api/run-tests`, выполняет `npx playwright test` и моментально обновляет графики.

---

## 📦 Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/<your-username>/e2e-test-dashboard.git
cd e2e-test-dashboard
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Установка браузеров Playwright
```bash
npx playwright install chromium
```

### 4. Запуск E2E-тестов для генерации первого отчета
```bash
npm run test:e2e
```
*(Один тест намеренно настроен на падение для демонстрации работы блока диагностики ошибок).*

### 5. Запуск веб-дашборда
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 🧪 Запуск тестов через Playwright UI

Для интерактивной отладки тестов в UI-режиме:
```bash
npm run test:e2e:ui
```
