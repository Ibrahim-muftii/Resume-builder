'use client';

import { GripVertical, Plus, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';

interface SortableBulletProps {
  id: string;
  index: number;
  register: UseFormRegister<any>;
  fieldName: string;
  onRemove: (index: number) => void;
  placeholder?: string;
}

function SortableBullet({ id, index, register, fieldName, onRemove, placeholder }: SortableBulletProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 group">
      <div
        {...attributes}
        {...listeners}
        className="mt-2.5 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-emerald-500"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Input
        placeholder={placeholder || "Describe a feature or contribution..."}
        {...register(`${fieldName}.${index}`)}
        className="border-zinc-200 bg-white focus:bg-white"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface BulletFieldArrayProps {
  label: string;
  fieldName: string;
  fieldArray: any;
  register: UseFormRegister<any>;
  errors?: any;
  placeholder?: string;
  onReorder?: () => void;
}

export default function BulletFieldArray({
  label,
  fieldName,
  fieldArray,
  register,
  errors,
  placeholder,
  onReorder
}: BulletFieldArrayProps) {
  const { fields, append, remove, move } = fieldArray;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f: any) => f.id === active.id);
      const newIndex = fields.findIndex((f: any) => f.id === over.id);
      move(oldIndex, newIndex);
      if (onReorder) {
        onReorder();
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label className="font-semibold text-zinc-800">{label}</Label>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append('')}
        className="w-full gap-2 border-dashed border-zinc-300 hover:border-emerald-400 hover:bg-emerald-50"
      >
        <Plus className="h-4 w-4" />
        Add Bullet Point
      </Button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f: any) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {fields.map((field: any, index: number) => (
              <SortableBullet
                key={field.id}
                id={field.id}
                index={index}
                register={register}
                fieldName={fieldName}
                onRemove={remove}
                placeholder={placeholder}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {errors && <p className="text-xs font-medium text-red-500">{errors.message as string}</p>}
    </div>
  );
}
