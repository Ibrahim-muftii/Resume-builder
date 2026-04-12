'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { skillSchema, type SkillSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function SkillsSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: SkillSchemaType =
    item.type === 'skills'
      ? {
          type: 'skills',
          name: item.data.name,
          level: item.data.level,
          category: item.data.category,
        }
      : {
          type: 'skills',
          name: '',
          level: 'beginner',
          category: '',
        };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillSchemaType>({
    resolver: zodResolver(skillSchema) as any,
    defaultValues: defaults as any,
  });

  const submit = async (data: SkillSchemaType): Promise<void> => {
    await Promise.resolve(onSave(data));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold text-zinc-800">Skill Name</Label>
        <Input id="name" placeholder="e.g., React, Python, TypeScript" {...register('name')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
        {errors.name ? <p className="text-xs font-medium text-red-500">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="level" className="font-semibold text-zinc-800">Proficiency Level</Label>
        <Select id="level" {...register('level')} className="border-zinc-200 bg-zinc-50 focus:bg-white">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </Select>
        {errors.level ? <p className="text-xs font-medium text-red-500">{errors.level.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-semibold text-zinc-800">Category</Label>
        <Input id="category" placeholder="e.g., Frontend, Backend, DevOps" {...register('category')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
        {errors.category ? <p className="text-xs font-medium text-red-500">{errors.category.message}</p> : null}
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancel</Button>
      </div>
    </form>
  );
}
