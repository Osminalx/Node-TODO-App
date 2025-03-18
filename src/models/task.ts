import {pipe,string,object,isoDateTime, type InferInput, minLength, maxLength, integer, number} from 'valibot';

const titleSchema = pipe(
  string(),
  minLength(3, 'El título debe tener al menos 3 caracteres')
);

const descriptionSchema = pipe(
  string(),
  maxLength(100, 'La descripción no puede exceder los 100 caracteres')
);

const userIdSchema = pipe(
  number(),
  integer('El ID de usuario debe ser un número entero')
);

const dueDateSchema = pipe(
  string(),
  isoDateTime('La fecha de vencimiento debe ser una fecha válida en formato ISO (ej: 2023-01-01T00:00:00Z)')
);

const createdAtSchema = pipe(
  string(),
  isoDateTime('La fecha de creación debe ser una fecha válida en formato ISO (ej: 2023-01-01T00:00:00Z)')
);

const updatedAtSchema = pipe(
  string(),
  isoDateTime('La fecha de actualización debe ser una fecha válida en formato ISO (ej: 2023-01-01T00:00:00Z)')
);

export const taskSchema = object({
    title: titleSchema,
    description: descriptionSchema,
    dueDate: dueDateSchema,
    userId: userIdSchema,
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
})

export type Task= InferInput<typeof taskSchema> & {
    id: number;
}