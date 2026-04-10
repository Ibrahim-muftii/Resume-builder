'use client';

import { PDFDownloadLink, Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Resume, ResumeSection, SectionItem, TemplateId } from '../../../lib/types/resume';

type ResumePDFProps = {
  resume: Resume;
  templateId: TemplateId;
};

type DownloadButtonProps = {
  resume: Resume;
  templateId: TemplateId;
};

type Palette = {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  surface: string;
};

const palettes: Record<TemplateId, Palette> = {
  modern: {
    primary: '#3730A3',
    secondary: '#E0E7FF',
    accent: '#4F46E5',
    text: '#111827',
    muted: '#6B7280',
    surface: '#EEF2FF',
  },
  classic: {
    primary: '#111111',
    secondary: '#FFFFFF',
    accent: '#111111',
    text: '#111111',
    muted: '#444444',
    surface: '#FFFFFF',
  },
  minimal: {
    primary: '#6B7280',
    secondary: '#FFFFFF',
    accent: '#9CA3AF',
    text: '#1F2937',
    muted: '#9CA3AF',
    surface: '#F9FAFB',
  },
  creative: {
    primary: '#0D9488',
    secondary: '#F0FDFA',
    accent: '#FB7185',
    text: '#0F172A',
    muted: '#475569',
    surface: '#FDF2F8',
  },
  executive: {
    primary: '#0B1F3A',
    secondary: '#F8FAFC',
    accent: '#CA8A04',
    text: '#0F172A',
    muted: '#475569',
    surface: '#F8FAFC',
  },
};

const baseStyles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 30,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 3,
  },
  title: {
    fontSize: 12,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactItem: {
    fontSize: 9,
    marginRight: 10,
  },
  section: {
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  itemBlock: {
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 1,
  },
  itemSubtitle: {
    fontSize: 9,
    marginBottom: 1,
  },
  bodyText: {
    fontSize: 9,
    marginBottom: 2,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  chip: {
    fontSize: 8,
    marginRight: 5,
    marginBottom: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 999,
  },
});

const makeTemplateStyles = (palette: Palette) =>
  StyleSheet.create({
    page: {
      backgroundColor: palette.surface,
    },
    header: {
      borderBottomColor: palette.accent,
    },
    name: {
      color: palette.primary,
    },
    title: {
      color: palette.muted,
    },
    contactItem: {
      color: palette.text,
    },
    summary: {
      color: palette.text,
    },
    section: {
      backgroundColor: palette.secondary,
    },
    sectionTitle: {
      color: palette.primary,
    },
    itemTitle: {
      color: palette.text,
    },
    itemSubtitle: {
      color: palette.primary,
    },
    bodyText: {
      color: palette.text,
    },
    mutedText: {
      color: palette.muted,
    },
    chip: {
      color: palette.primary,
      backgroundColor: palette.secondary,
    },
  });

const sectionOrder = (sections: ResumeSection[]): ResumeSection[] =>
  [...sections]
    .filter((section) => section.isVisible)
    .sort((left, right) => left.sortOrder - right.sortOrder);

const renderList = (
  items: string[],
  textStyle: { color: string }
): JSX.Element | null => {
  if (items.length === 0) {
    return null;
  }

  return (
    <View>
      {items.map((line, index) => (
        <Text key={`${line}-${index}`} style={[baseStyles.bodyText, textStyle]}>
          • {line}
        </Text>
      ))}
    </View>
  );
};

const renderSectionItem = (
  item: SectionItem,
  templateStyles: ReturnType<typeof makeTemplateStyles>
): JSX.Element | null => {
  if (item.type === 'experience') {
    return (
      <View key={item.id} style={baseStyles.itemBlock}>
        {item.data.position ? <Text style={[baseStyles.itemTitle, templateStyles.itemTitle]}>{item.data.position}</Text> : null}
        {item.data.company ? <Text style={[baseStyles.itemSubtitle, templateStyles.itemSubtitle]}>{item.data.company}</Text> : null}
        {item.data.location ? <Text style={[baseStyles.bodyText, templateStyles.mutedText]}>{item.data.location}</Text> : null}
        {item.data.description ? <Text style={[baseStyles.bodyText, templateStyles.bodyText]}>{item.data.description}</Text> : null}
        {renderList(item.data.achievements, templateStyles.bodyText)}
      </View>
    );
  }

  if (item.type === 'education') {
    return (
      <View key={item.id} style={baseStyles.itemBlock}>
        {item.data.degree ? <Text style={[baseStyles.itemTitle, templateStyles.itemTitle]}>{item.data.degree}</Text> : null}
        {item.data.field ? <Text style={[baseStyles.itemSubtitle, templateStyles.itemSubtitle]}>{item.data.field}</Text> : null}
        {item.data.institution ? <Text style={[baseStyles.bodyText, templateStyles.bodyText]}>{item.data.institution}</Text> : null}
        {item.data.location ? <Text style={[baseStyles.bodyText, templateStyles.mutedText]}>{item.data.location}</Text> : null}
        {renderList(item.data.achievements, templateStyles.bodyText)}
      </View>
    );
  }

  if (item.type === 'skills') {
    return (
      <View key={item.id} style={baseStyles.itemBlock}>
        {item.data.name ? <Text style={[baseStyles.itemTitle, templateStyles.itemTitle]}>{item.data.name}</Text> : null}
        {item.data.category ? <Text style={[baseStyles.bodyText, templateStyles.mutedText]}>{item.data.category}</Text> : null}
        <Text style={[baseStyles.bodyText, templateStyles.itemSubtitle]}>{item.data.level}</Text>
      </View>
    );
  }

  if (item.type === 'projects') {
    return (
      <View key={item.id} style={baseStyles.itemBlock}>
        {item.data.name ? <Text style={[baseStyles.itemTitle, templateStyles.itemTitle]}>{item.data.name}</Text> : null}
        {item.data.description ? <Text style={[baseStyles.bodyText, templateStyles.bodyText]}>{item.data.description}</Text> : null}
        {item.data.technologies.length > 0 ? (
          <View style={baseStyles.chipsWrap}>
            {item.data.technologies.map((tech) => (
              <Text key={`${item.id}-${tech}`} style={[baseStyles.chip, templateStyles.chip]}>
                {tech}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    );
  }

  if (item.type === 'certifications') {
    return (
      <View key={item.id} style={baseStyles.itemBlock}>
        {item.data.name ? <Text style={[baseStyles.itemTitle, templateStyles.itemTitle]}>{item.data.name}</Text> : null}
        {item.data.issuer ? <Text style={[baseStyles.bodyText, templateStyles.itemSubtitle]}>{item.data.issuer}</Text> : null}
      </View>
    );
  }

  if (item.type === 'languages') {
    return (
      <View key={item.id} style={baseStyles.itemBlock}>
        {item.data.name ? <Text style={[baseStyles.itemTitle, templateStyles.itemTitle]}>{item.data.name}</Text> : null}
        <Text style={[baseStyles.bodyText, templateStyles.itemSubtitle]}>{item.data.proficiency}</Text>
      </View>
    );
  }

  if (item.type === 'custom') {
    return (
      <View key={item.id} style={baseStyles.itemBlock}>
        {item.data.title ? <Text style={[baseStyles.itemTitle, templateStyles.itemTitle]}>{item.data.title}</Text> : null}
        {item.data.content ? <Text style={[baseStyles.bodyText, templateStyles.bodyText]}>{item.data.content}</Text> : null}
      </View>
    );
  }

  return null;
};

export function ResumePDF({ resume, templateId }: ResumePDFProps) {
  const palette = palettes[templateId] ?? palettes.modern;
  const templateStyles = makeTemplateStyles(palette);
  const orderedSections = sectionOrder(resume.sections);
  const personalInfoSection = orderedSections.find((section) => section.type === 'personal_info');
  const personalInfoItem = personalInfoSection?.items[0];
  const contentSections = orderedSections.filter((section) => section.type !== 'personal_info');

  return (
    <Document>
      <Page size="A4" style={[baseStyles.page, templateStyles.page]}>
        <View style={[baseStyles.header, templateStyles.header]}>
          {personalInfoItem && personalInfoItem.type === 'personal_info' ? (
            <>
              {personalInfoItem.data.fullName ? (
                <Text style={[baseStyles.name, templateStyles.name]}>{personalInfoItem.data.fullName}</Text>
              ) : null}
              {personalInfoItem.data.jobTitle ? (
                <Text style={[baseStyles.title, templateStyles.title]}>{personalInfoItem.data.jobTitle}</Text>
              ) : null}
              <View style={baseStyles.contactRow}>
                {personalInfoItem.data.email ? <Text style={[baseStyles.contactItem, templateStyles.contactItem]}>{personalInfoItem.data.email}</Text> : null}
                {personalInfoItem.data.phone ? <Text style={[baseStyles.contactItem, templateStyles.contactItem]}>{personalInfoItem.data.phone}</Text> : null}
                {personalInfoItem.data.location ? <Text style={[baseStyles.contactItem, templateStyles.contactItem]}>{personalInfoItem.data.location}</Text> : null}
                {personalInfoItem.data.website ? <Text style={[baseStyles.contactItem, templateStyles.contactItem]}>{personalInfoItem.data.website}</Text> : null}
                {personalInfoItem.data.linkedin ? <Text style={[baseStyles.contactItem, templateStyles.contactItem]}>{personalInfoItem.data.linkedin}</Text> : null}
                {personalInfoItem.data.github ? <Text style={[baseStyles.contactItem, templateStyles.contactItem]}>{personalInfoItem.data.github}</Text> : null}
              </View>
              {personalInfoItem.data.summary ? (
                <Text style={[baseStyles.bodyText, templateStyles.summary]}>{personalInfoItem.data.summary}</Text>
              ) : null}
            </>
          ) : null}
        </View>

        {contentSections.map((section) => {
          if (section.items.length === 0) {
            return null;
          }

          return (
            <View key={section.id} style={[baseStyles.section, templateStyles.section]}>
              <Text style={[baseStyles.sectionTitle, templateStyles.sectionTitle]}>{section.title}</Text>
              {section.items.map((item) => renderSectionItem(item, templateStyles))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export function DownloadButton({ resume, templateId }: DownloadButtonProps) {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
  const filename = `${resume.title}-${formattedDate}.pdf`;

  return (
    <PDFDownloadLink document={<ResumePDF resume={resume} templateId={templateId} />} fileName={filename}>
      {({ loading }) => (
        <span className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
          {loading ? 'Preparing PDF...' : 'Download PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}
