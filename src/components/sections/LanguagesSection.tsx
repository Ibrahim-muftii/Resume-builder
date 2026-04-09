'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { languageSchema, type LanguageSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function LanguagesSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: LanguageSchemaType =
    item.type === 'languages'
      ? {
          type: 'languages',
          name: item.data.name,
          proficiency: item.data.proficiency,
        }
      : {
          type: 'languages',
          name: '',
          proficiency: 'elementary',
        };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LanguageSchemaType>({
    resolver: zodResolver(languageSchema),
    defaultValues: defaults,
  });

  const submit = async (data: LanguageSchemaType): Promise<void> => {
    await Promise.resolve(onSave(data));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Language</Label>
        <Input id="name" {...register('name')} />
        {errors.name ? <p className="text-sm text-red-500">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="proficiency">Proficiency</Label>
        <Select id="proficiency" {...register('proficiency')}>
          <option value="elementary">Elementary</option>
          <option value="limited_working">Limited Working</option>
          <option value="professional_working">Professional Working</option>
          <option value="full_professional">Full Professional</option>
          <option value="native">Native</option>
        </Select>
        {errors.proficiency ? <p className="text-sm text-red-500">{errors.proficiency.message}</p> : null}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </form>
  );
}
