import type { Schema, Attribute } from '@strapi/strapi';

export interface SectionSection extends Schema.Component {
  collectionName: 'components_section_sections';
  info: {
    displayName: 'Section';
    icon: 'briefcase';
  };
  attributes: {
    title: Attribute.String;
    body: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'section.section': SectionSection;
    }
  }
}
