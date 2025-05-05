# Недостающие CRUD API

## Формы и шаблоны

### Управление формами
- `/forms/create`: Создание новой формы
- `/forms/get/{id}`: Получение формы по ID
- `/forms/update/{id}`: Обновление формы
- `/forms/delete/{id}`: Удаление формы
- `/forms/list`: Получение списка форм (с фильтрацией по статусу, организации)
- `/forms/change-status/{id}`: Изменение статуса формы

### Поля форм
- `/form-fields/create`: Создание поля для формы
- `/form-fields/get/{id}`: Получение поля формы
- `/form-fields/update/{id}`: Обновление поля формы
- `/form-fields/delete/{id}`: Удаление поля формы
- `/form-fields/list/{formId}`: Получение списка полей для формы

### Шаблоны форм
- `/form-templates/create`: Создание шаблона формы
- `/form-templates/get/{id}`: Получение шаблона формы
- `/form-templates/update/{id}`: Обновление шаблона формы
- `/form-templates/delete/{id}`: Удаление шаблона формы
- `/form-templates/list`: Получение списка шаблонов форм

### Поля шаблонов
- `/form-template-fields/create`: Создание поля для шаблона
- `/form-template-fields/get/{id}`: Получение поля шаблона
- `/form-template-fields/update/{id}`: Обновление поля шаблона
- `/form-template-fields/delete/{id}`: Удаление поля шаблона
- `/form-template-fields/list/{templateId}`: Получение списка полей для шаблона

### История форм
- `/form-history/get/{id}`: Получение записи истории
- `/form-history/list/{formId}`: Получение истории для формы

## Процесс рассмотрения

### Управление рассмотрением
- `/review-flow/create`: Создание процесса рассмотрения
- `/review-flow/get/{id}`: Получение процесса рассмотрения
- `/review-flow/update/{id}`: Обновление процесса рассмотрения
- `/review-flow/delete/{id}`: Удаление процесса рассмотрения
- `/review-flow/list`: Получение списка процессов рассмотрения
- `/review-flow/change-status/{id}`: Изменение статуса рассмотрения

### Комментарии
- `/comments/create`: Создание комментария
- `/comments/get/{id}`: Получение комментария
- `/comments/update/{id}`: Обновление комментария
- `/comments/delete/{id}`: Удаление комментария
- `/comments/list/{reviewFlowId}`: Получение комментариев для процесса рассмотрения

## Файловая система

### Управление файлами
- `/files/upload`: Загрузка файла
- `/files/get/{id}`: Получение метаданных файла
- `/files/download/{id}`: Скачивание файла
- `/files/update/{id}`: Обновление метаданных файла
- `/files/delete/{id}`: Удаление файла (маркировка как удаленного)
- `/files/list`: Получение списка файлов (с фильтрацией)

### Управление папками
- `/folders/create`: Создание папки
- `/folders/get/{id}`: Получение папки
- `/folders/update/{id}`: Обновление папки
- `/folders/delete/{id}`: Удаление папки
- `/folders/list/{parentId?}`: Получение содержимого папки
- `/folders/get-path/{id}`: Получение полного пути к папке

### Доступ к файлам
- `/file-shares/create`: Предоставление доступа к файлу
- `/file-shares/list/{fileId}`: Получение списка доступов к файлу
- `/file-shares/delete/{id}`: Отзыв доступа к файлу
- `/file-shares/list-shared-with-me`: Получение списка файлов с доступом для текущего пользователя

### Файлы в полях форм
- `/form-field-files/attach`: Привязка файла к полю формы
- `/form-field-files/detach/{id}`: Отвязка файла от поля формы
- `/form-field-files/list/{formFieldId}`: Получение списка файлов для поля формы