import { config, collection, fields } from '@keystatic/core'
import { block } from '@keystatic/core/content-components'

export default config({
  storage: { kind: 'local' },
  collections: {
    writings: collection({
      label: 'Writings',
      slugField: 'title',
      path: 'content/writings/*/',
      format: { contentField: 'body' },
      schema: {
        title:     fields.slug({ name: { label: 'Title' } }),
        summary:   fields.text({ label: 'Summary / deck', multiline: true }),
        published: fields.date({ label: 'Published date' }),
        updated:   fields.date({ label: 'Last updated (optional)' }),
        status:    fields.select({
          label: 'Status',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft',     value: 'draft' },
          ],
          defaultValue: 'draft',
        }),
        tags:     fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        featured: fields.checkbox({ label: 'Featured post', defaultValue: false }),
        body:     fields.markdoc({
          label: 'Body',
          components: {
            Figure: block({
              label: 'Figure',
              schema: {
                src:     fields.text({ label: 'Image URL (Cloudinary)' }),
                alt:     fields.text({ label: 'Alt text' }),
                caption: fields.text({ label: 'Caption' }),
              },
            }),
          },
        }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*/',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        cover: fields.text({ label: 'Cover URL (Cloudinary)' }),
        coverAlt: fields.text({ label: 'Cover alt text' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags' },
        ),
        client: fields.text({ label: 'Client' }),
        year: fields.text({ label: 'Year (e.g. 2023 to 2024)' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Shipped',         value: 'shipped' },
            { label: 'In development',  value: 'in-development' },
            { label: 'Archived',        value: 'archived' },
          ],
          defaultValue: 'shipped',
        }),
        role:   fields.text({ label: 'Role' }),
        engine: fields.text({ label: 'Engine' }),
        gallery: fields.array(
          fields.text({ label: 'Gallery URL' }),
          { label: 'Gallery' },
        ),
        video:    fields.text({ label: 'YouTube video ID' }),
        featured: fields.checkbox({ label: 'Featured on homepage', defaultValue: false }),
        tintClass: fields.select({
          label: 'Tint class',
          options: [
            { label: 'wc-1', value: 'wc-1' },
            { label: 'wc-2', value: 'wc-2' },
            { label: 'wc-3', value: 'wc-3' },
            { label: 'wc-4', value: 'wc-4' },
          ],
          defaultValue: 'wc-1',
        }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Link label' }),
            href:  fields.text({ label: 'URL' }),
          }),
          { label: 'External links', itemLabel: props => props.fields.label.value },
        ),
        body: fields.markdoc({
          label: 'Body',
          components: {
            Figure: block({
              label: 'Figure',
              schema: {
                src:     fields.text({ label: 'Image URL (Cloudinary)' }),
                alt:     fields.text({ label: 'Alt text' }),
                caption: fields.text({ label: 'Caption' }),
              },
            }),
          },
        }),
      },
    }),
  },
})
