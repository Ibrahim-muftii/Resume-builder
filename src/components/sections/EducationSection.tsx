'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { educationSchema, type EducationSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function EducationSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: EducationSchemaType =
    item.type === 'education'
      ? {
          type: 'education',
          institution: item.data.institution,
          degree: item.data.degree,
          field: item.data.field,
          location: item.data.location,
          startDate: item.data.startDate ? item.data.startDate : null,
          endDate: item.data.endDate ? item.data.endDate : null,
          isCurrent: item.data.isCurrent,
          gpa: item.data.gpa ?? '',
        }
      : {
          type: 'education',
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: null,
          endDate: null,
          isCurrent: false,
          gpa: '',
        };

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EducationSchemaType>({
    resolver: zodResolver(educationSchema) as any,
    defaultValues: defaults as any,
  });

  const isCurrent = watch('isCurrent');

  const submit = async (data: EducationSchemaType): Promise<void> => {
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
          <Label htmlFor="institution" className="font-semibold text-zinc-800">Institution</Label>
          <Input id="institution" placeholder="University Name" {...register('institution')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.institution ? <p className="text-xs font-medium text-red-500">{errors.institution.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="degree" className="font-semibold text-zinc-800">Degree</Label>
          <Input id="degree" placeholder="Bachelor of Science" {...register('degree')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.degree ? <p className="text-xs font-medium text-red-500">{errors.degree.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="field" className="font-semibold text-zinc-800">Field of Study</Label>
          <Input id="field" placeholder="Computer Science" {...register('field')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.field ? <p className="text-xs font-medium text-red-500">{errors.field.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="font-semibold text-zinc-800">Location</Label>
          <Input id="location" placeholder="San Francisco, CA" {...register('location')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.location ? <p className="text-xs font-medium text-red-500">{errors.location.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="font-semibold text-zinc-900">Start Date</Label>
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
          <Label htmlFor="endDate" className="font-semibold text-zinc-900">End Date</Label>
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
        I currently study here
      </label>

      <div className="space-y-2">
        <Label htmlFor="gpa" className="font-semibold text-zinc-800">GPA <span className="font-normal text-zinc-500">(optional)</span></Label>
        <Input id="gpa" placeholder="3.8" {...register('gpa')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
        {errors.gpa ? <p className="text-xs font-medium text-red-500">{errors.gpa.message}</p> : null}
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancel</Button>
      </div>
    </form>
  );
}
