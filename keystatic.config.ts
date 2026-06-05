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

        displayOrder: fields.number({
          label: 'Display order (1 = first on /work)',
          defaultValue: 1,
        }),

        summary: fields.text({ label: 'Summary', multiline: true }),

        // Quarter notation: "Q2 2024" or "Q4 2023 to Q2 2024"
        date: fields.text({ label: 'Date (quarter notation)' }),

        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Released',         value: 'released'   },
            { label: 'Work in progress', value: 'wip'        },
            { label: 'Archived',         value: 'archived'   },
            { label: 'Cancelled',        value: 'cancelled'  },
          ],
          defaultValue: 'released',
        }),

        role:   fields.text({ label: 'Role' }),
        engine: fields.text({ label: 'Engine' }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags' },
        ),

        client: fields.text({ label: 'Client' }),

        featured: fields.checkbox({ label: 'Featured on homepage', defaultValue: false }),

        tintClass: fields.select({
          label: 'Card tint',
          options: [
            { label: 'wc-1 (teal)',        value: 'wc-1' },
            { label: 'wc-2 (purple)',      value: 'wc-2' },
            { label: 'wc-3 (pink)',        value: 'wc-3' },
            { label: 'wc-4 (cyan)',        value: 'wc-4' },
          ],
          defaultValue: 'wc-1',
        }),

        thumbnail: fields.object({
          src: fields.text({ label: 'Thumbnail URL (Cloudinary)' }),
          alt: fields.text({ label: 'Thumbnail alt text' }),
        }),

        // Discriminated union: image or YouTube video.
        // Stored in YAML as { discriminant: 'image'|'video', value: { ... } }.
        // Data layer normalises to { type: 'image'|'video', ...rest }.
        cover: fields.conditional(
          fields.select({
            label: 'Cover type',
            options: [
              { label: 'Image',           value: 'image' },
              { label: 'Video (YouTube)', value: 'video' },
            ],
            defaultValue: 'video',
          }),
          {
            image: fields.object({
              src: fields.text({ label: 'Image URL (Cloudinary)' }),
              alt: fields.text({ label: 'Alt text' }),
            }),
            video: fields.object({
              youtubeId: fields.text({ label: 'YouTube video ID (11 chars)' }),
              title:     fields.text({ label: 'Descriptive title for accessibility' }),
            }),
          }
        ),

        // Array of typed gallery items. Stored per item as
        // { discriminant: 'image'|'video'|'instagram', value: { ... } }.
        gallery: fields.array(
          fields.conditional(
            fields.select({
              label: 'Item type',
              options: [
                { label: 'Image',     value: 'image'     },
                { label: 'YouTube',   value: 'video'     },
                { label: 'Instagram', value: 'instagram' },
              ],
              defaultValue: 'image',
            }),
            {
              image: fields.object({
                src: fields.text({ label: 'Image URL (Cloudinary)' }),
                alt: fields.text({ label: 'Alt text' }),
              }),
              video: fields.object({
                youtubeId: fields.text({ label: 'YouTube ID (11 chars)' }),
                title:     fields.text({ label: 'Video title' }),
              }),
              instagram: fields.object({
                permalink: fields.text({ label: 'Instagram permalink (full URL)' }),
                title:     fields.text({ label: 'Descriptive title' }),
              }),
            }
          ),
          { label: 'Gallery' }
        ),

        // href renamed to url. Shape otherwise identical to Phase 10.
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Link label' }),
            url:   fields.text({ label: 'URL' }),
          }),
          { label: 'External links', itemLabel: props => props.fields.label.value }
        ),

        // Optional hover-to-reveal links for gated content.
        // Zero items means no spoiler section renders on the page.
        spoilerLinks: fields.array(
          fields.object({
            label:   fields.text({ label: 'Label (always visible)' }),
            url:     fields.text({ label: 'URL (hidden until hover/tap)' }),
            warning: fields.text({ label: 'Warning text (always visible)' }),
          }),
          { label: 'Spoiler links (NSFW gating)', itemLabel: props => props.fields.label.value }
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
            YouTubeEmbed: block({
              label: 'YouTube Embed',
              schema: {
                id:    fields.text({ label: 'YouTube video ID (11 chars)' }),
                title: fields.text({ label: 'Accessible title' }),
              },
            }),
            InstagramEmbed: block({
              label: 'Instagram Embed',
              schema: {
                permalink: fields.text({ label: 'Instagram permalink (full URL)' }),
                title:     fields.text({ label: 'Accessible title' }),
              },
            }),
          },
        }),
      },
    }),
  },
})
