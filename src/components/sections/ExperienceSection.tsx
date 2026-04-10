'use client';

import { Plus, Trash2 } from 'lucide-react';
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
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company" className="font-semibold text-zinc-800">Company</Label>
          <Input id="company" placeholder="Acme Corporation" {...register('company')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.company ? <p className="text-xs font-medium text-red-500">{errors.company.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="position" className="font-semibold text-zinc-800">Position</Label>
          <Input id="position" placeholder="Senior Developer" {...register('position')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.position ? <p className="text-xs font-medium text-red-500">{errors.position.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="font-semibold text-zinc-800">Location</Label>
        <Input id="location" placeholder="San Francisco, CA" {...register('location')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
        {errors.location ? <p className="text-xs font-medium text-red-500">{errors.location.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="font-semibold text-zinc-800">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={watch('startDate') ?? ''}
            onChange={(event) => setValue('startDate', event.target.value || null, { shouldValidate: true })}
            className="border-zinc-200 bg-zinc-50 focus:bg-white"
          />
          {errors.startDate ? <p className="text-xs font-medium text-red-500">{errors.startDate.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="font-semibold text-zinc-800">End Date</Label>
          <Input
            id="endDate"
            type="date"
            disabled={isCurrent}
            value={watch('endDate') ?? ''}
            onChange={(event) => setValue('endDate', event.target.value || null, { shouldValidate: true })}
            className="border-zinc-200 bg-zinc-50 focus:bg-white disabled:bg-zinc-100"
          />
          {errors.endDate ? <p className="text-xs font-medium text-red-500">{errors.endDate.message}</p> : null}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
        <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" {...register('isCurrent')} />
        I currently work here
      </label>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-semibold text-zinc-800">Description</Label>
        <Textarea id="description" rows={4} placeholder="Describe your key responsibilities and achievements..." {...register('description')} className="border-zinc-200 bg-zinc-50 focus:bg-white resize-none" />
        {errors.description ? <p className="text-xs font-medium text-red-500">{errors.description.message}</p> : null}
      </div>

      <div className="space-y-3">
        <Label className="font-semibold text-zinc-800">Achievements</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => append('')} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input placeholder="Key achievement..." {...register(`achievements.${index}`)} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {errors.achievements ? <p className="text-xs font-medium text-red-500">{errors.achievements.message as string}</p> : null}
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancel</Button>
      </div>
    </form>
  );
}
