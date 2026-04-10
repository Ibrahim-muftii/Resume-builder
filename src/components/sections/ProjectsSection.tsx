'use client';

import { Plus, Trash2 } from 'lucide-react';
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
        <Button type="button" variant="outline" size="sm" onClick={addTechnology} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Technology
        </Button>
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
            <div key={`${technology}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1 text-sm">
              {technology}
              <button
                type="button"
                onClick={() => removeTechnology(index)}
                className="ml-1 text-zinc-500 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
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

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" className="h-4 w-4" {...register('isCurrent')} />
        This project is ongoing
      </label>

      <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancel</Button>
      </div>
    </form>
  );
}
