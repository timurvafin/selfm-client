## Обертка над react-dnd с доп функционалом. 

#### Что сделано:
* Добавлена реализация для сортируемых списков (Sortable, SortableElement). Теперь это готово из коробки.
  * Все выстроено в общую структуру: Sortable использует Droppable, SortableElement использует Draggable.
* Добавлена возможность управлять видом перемещаемого элемента (drag preview) в зависимости от того, над каким Droppable он находится.
  * Надо будет добавить проп canDrop в Draggable из DragLayer'a.
* Расширены пропсы для Droppable.

---
* Перформанс пока не оптимизирован. Возможно стоит перейти к управлению состоянием DOM'а напрямую во время перемещения.
* Пока не поддерживается dragHandle. 
