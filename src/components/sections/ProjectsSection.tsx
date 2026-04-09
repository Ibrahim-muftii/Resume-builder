'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { projectSchema, type ProjectSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function ProjectsSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: ProjectSchemaType =
    item.type === 'projects'
      ? {
          type: 'projects',
          name: item.data.name,
          description: item.data.description,
          technologies: item.data.technologies,
          url: item.data.url ?? '',
          githubUrl: item.data.githubUrl ?? '',
          startDate: item.data.startDate ? item.data.startDate : null,
          endDate: item.data.endDate ? item.data.endDate : null,
          isCurrent: item.data.isCurrent,
        }
      : {
          type: 'projects',
          name: '',
          description: '',
          technologies: [],
          url: '',
          githubUrl: '',
          startDate: null,
          endDate: null,
          isCurrent: false,
        };

  const [techInput, setTechInput] = useState('');

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaults,
  });

  const isCurrent = watch('isCurrent');
  const technologies = watch('technologies');

  const addTechnology = (): void => {
    const next = techInput.trim();
    if (!next) {
      return;
    }

    setValue('technologies', [...technologies, next], { shouldValidate: true });
    setTechInput('');
  };

  const removeTechnology = (index: number): void => {
    setValue(
      'technologies',
      technologies.filter((_, currentIndex) => currentIndex !== index),
      { shouldValidate: true }
    );
  };

  const submit = async (data: ProjectSchemaType): Promise<void> => {
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
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name ? <p className="text-sm text-red-500">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register('description')} />
        {errors.description ? <p className="text-sm text-red-500">{errors.description.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies">Technologies</Label>
        <Input
          id="technologies"
          value={techInput}
          onChange={(event) => setTechInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTechnology();
            }
          }}
          placeholder="Type and press Enter"
        />
        <div className="flex flex-wrap gap-2">
          {technologies.map((technology, index) => (
            <button
              key={`${technology}-${index}`}
              type="button"
              className="rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
              onClick={() => removeTechnology(index)}
            >
              {technology} ×
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" {...register('url')} />
          {errors.url ? <p className="text-sm text-red-500">{errors.url.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" {...register('githubUrl')} />
          {errors.githubUrl ? <p className="text-sm text-red-500">{errors.githubUrl.message}</p> : null}
        </div>
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
        This project is ongoing
      </label>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </form>
  );
}
