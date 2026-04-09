'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { certificationSchema, type CertificationSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function CertificationsSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: CertificationSchemaType =
    item.type === 'certifications'
      ? {
          type: 'certifications',
          name: item.data.name,
          issuer: item.data.issuer,
          issueDate: item.data.issueDate,
          expiryDate: item.data.expiryDate,
          credentialId: item.data.credentialId ?? '',
          url: item.data.url ?? '',
        }
      : {
          type: 'certifications',
          name: '',
          issuer: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          url: '',
        };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CertificationSchemaType>({
    resolver: zodResolver(certificationSchema),
    defaultValues: defaults,
  });

  const submit = async (data: CertificationSchemaType): Promise<void> => {
    await Promise.resolve(onSave(data));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name ? <p className="text-sm text-red-500">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuer">Issuer</Label>
          <Input id="issuer" {...register('issuer')} />
          {errors.issuer ? <p className="text-sm text-red-500">{errors.issuer.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input id="issueDate" type="date" {...register('issueDate')} />
          {errors.issueDate ? <p className="text-sm text-red-500">{errors.issueDate.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
          <Input id="expiryDate" type="date" {...register('expiryDate')} />
          {errors.expiryDate ? <p className="text-sm text-red-500">{errors.expiryDate.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="credentialId">Credential ID (optional)</Label>
          <Input id="credentialId" {...register('credentialId')} />
          {errors.credentialId ? <p className="text-sm text-red-500">{errors.credentialId.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL (optional)</Label>
          <Input id="url" {...register('url')} />
          {errors.url ? <p className="text-sm text-red-500">{errors.url.message}</p> : null}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </form>
  );
}
