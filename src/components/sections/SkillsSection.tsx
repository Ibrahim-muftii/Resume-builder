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
    resolver: zodResolver(skillSchema),
    defaultValues: defaults,
  });

  const submit = async (data: SkillSchemaType): Promise<void> => {
    await Promise.resolve(onSave(data));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Skill Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name ? <p className="text-sm text-red-500">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select id="level" {...register('level')}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </Select>
        {errors.level ? <p className="text-sm text-red-500">{errors.level.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" {...register('category')} />
        {errors.category ? <p className="text-sm text-red-500">{errors.category.message}</p> : null}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </form>
  );
}
