'use client';

import { Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { projectSchema, type ProjectSchemaType } from '../../../lib/validations/resumeSchema';
import BulletFieldArray from './BulletFieldArray';
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
        descriptionTitle: item.data.descriptionTitle,
        descriptionBullets: item.data.descriptionBullets,
        url: item.data.url ?? '',
        githubUrl: item.data.githubUrl ?? '',
      }
      : {
        type: 'projects',
        name: '',
        descriptionTitle: '',
        descriptionBullets: [],
        url: '',
        githubUrl: '',
      };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: defaults as any,
  });

  const fieldArray = useFieldArray({
    control,
    name: 'descriptionBullets' as never,
  });

  const submit = async (data: ProjectSchemaType): Promise<void> => {
    await Promise.resolve(onSave(data));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold text-zinc-800">Project Name</Label>
        <Input id="name" placeholder="e.g., My Awesome Project" {...register('name')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
        {errors.name ? <p className="text-xs font-medium text-red-500">{errors.name.message}</p> : null}
      </div>

      {/* Description — Title + Bullet Points */}
      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
        <div className="space-y-2">
          <Label htmlFor="descriptionTitle" className="font-semibold text-zinc-800">Description Title</Label>
          <Input
            id="descriptionTitle"
            placeholder="e.g., A SaaS platform for team collaboration"
            {...register('descriptionTitle')}
            className="border-zinc-200 bg-white focus:bg-white"
          />
          {errors.descriptionTitle ? <p className="text-xs font-medium text-red-500">{errors.descriptionTitle.message}</p> : null}
        </div>

        <BulletFieldArray
          label="Bullet Points"
          fieldName="descriptionBullets"
          fieldArray={fieldArray}
          register={register}
          errors={errors.descriptionBullets}
          placeholder="Describe a feature or contribution..."
          onReorder={() => setTimeout(() => handleSubmit(submit)(), 0)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="url" className="font-semibold text-zinc-800">URL <span className="font-normal text-zinc-500">(optional)</span></Label>
          <Input id="url" placeholder="https://myproject.com" {...register('url')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.url ? <p className="text-xs font-medium text-red-500">{errors.url.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl" className="font-semibold text-zinc-800">GitHub URL <span className="font-normal text-zinc-500">(optional)</span></Label>
          <Input id="githubUrl" placeholder="https://github.com/user/repo" {...register('githubUrl')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.githubUrl ? <p className="text-xs font-medium text-red-500">{errors.githubUrl.message}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancel</Button>
      </div>
    </form>
  );
}
