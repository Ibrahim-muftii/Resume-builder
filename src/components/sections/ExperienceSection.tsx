'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { experienceSchema, type ExperienceSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function ExperienceSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: ExperienceSchemaType =
    item.type === 'experience'
      ? {
          type: 'experience',
          company: item.data.company,
          position: item.data.position,
          location: item.data.location,
          startDate: item.data.startDate ? item.data.startDate : null,
          endDate: item.data.endDate ? item.data.endDate : null,
          isCurrent: item.data.isCurrent,
          description: item.data.description,
          achievements: item.data.achievements,
        }
      : {
          type: 'experience',
          company: '',
          position: '',
          location: '',
          startDate: null,
          endDate: null,
          isCurrent: false,
          description: '',
          achievements: [],
        };

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceSchemaType>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaults,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'achievements',
  });

  const isCurrent = watch('isCurrent');

  const submit = async (data: ExperienceSchemaType): Promise<void> => {
    await Promise.resolve(
      onSave({
        ...data,
        startDate: data.startDate ?? '',
        endDate: data.endDate ?? '',
      })
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register('company')} />
          {errors.company ? <p className="text-sm text-red-500">{errors.company.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" {...register('position')} />
          {errors.position ? <p className="text-sm text-red-500">{errors.position.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register('location')} />
        {errors.location ? <p className="text-sm text-red-500">{errors.location.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={watch('startDate') ?? ''}
            onChange={(event) => setValue('startDate', event.target.value || null, { shouldValidate: true })}
          />
          {errors.startDate ? <p className="text-sm text-red-500">{errors.startDate.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            disabled={isCurrent}
            value={watch('endDate') ?? ''}
            onChange={(event) => setValue('endDate', event.target.value || null, { shouldValidate: true })}
          />
          {errors.endDate ? <p className="text-sm text-red-500">{errors.endDate.message}</p> : null}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input type="checkbox" className="h-4 w-4" {...register('isCurrent')} />
        I currently work here
      </label>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register('description')} />
        {errors.description ? <p className="text-sm text-red-500">{errors.description.message}</p> : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Achievements</Label>
          <Button type="button" variant="outline" onClick={() => append('')}>
            + Add
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input {...register(`achievements.${index}`)} />
              <Button type="button" variant="outline" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        {errors.achievements ? <p className="text-sm text-red-500">{errors.achievements.message as string}</p> : null}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </form>
  );
}
