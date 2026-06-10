# Gallery Authoring Guide

How to add an interactive media gallery to a case study. The Gallery supports six media
types in one ordered list: static images, Cloudinary videos, GIFs, YouTube embeds, Instagram
Reels, and Instagram Posts. It renders a main display, a thumbnail scroll strip, and a
fullscreen modal, with full keyboard and screen-reader support.

Introduced in Phase 19.6.1. Architecture and rationale are in `docs/DECISIONS.md` (DEC-079).

---

## Adding a gallery via Keystatic

1. Run the site locally (`pnpm dev`) and open `http://localhost:3000/keystatic`.
2. Open Projects, then the case study you want to edit.
3. In the Body editor, place the cursor where the gallery should appear, type `/`, and choose
   **Gallery** from the insert menu.
4. The block appears with an **Edit** button. Click it to open the gallery form.
5. Click **Add** to add an item. Pick the **Media type**, fill the fields for that type, then
   **Add**. Repeat for each item. Items display in the order listed.
6. Click **Done**, then **Create** (new entry) or **Save** (existing entry).

The block is stored in the `.mdoc` file as a markdoc tag, for example:

```
{% Gallery
   items=[{discriminant: "image", value: {cloudinaryId: "...", alt: "..."}}] /%}
```

You can hand-edit that tag in the file if you prefer, but the Keystatic form is the
supported path and avoids syntax mistakes.

Note: the site's fixed navigation bar can overlap the Keystatic Save/Create button. If a
click does not register, scroll the editor or use the keyboard to submit.

---

## Cloudinary: URL or public ID

Image, video, and GIF items take a **Cloudinary URL or public ID**. Either works:

- Full URL: `https://res.cloudinary.com/ddgwzcrim/image/upload/Lily_9_ce4kp1.jpg`
- Public ID: `Lily_9_ce4kp1`

The Gallery extracts the public ID and applies `f_auto,q_auto` plus a width per surface
(thumbnail 200px, main 1600px, fullscreen 2400px). Do not bake transformations into the URL;
let the Gallery size each tier.

---

## Media types and fields

Required fields must be filled. Optional fields can be left blank.

### Image
- `cloudinaryId` (required): Cloudinary URL or public ID.
- `alt` (required): describes the image for screen readers.
- `caption` (optional): shown below the main display.
- `aspectRatio` (optional): e.g. `16/9`, `4/5`. Defaults to `16/9`.

### Video (Cloudinary MP4)
- `cloudinaryId` (required): Cloudinary URL or public ID of the video.
- `accessibleName` (required): used as the video's accessible name.
- `caption`, `aspectRatio` (optional).
- `autoplay` (optional, default off): only autoplays when it is the current item and the
  visitor has not requested reduced motion.
- `loop` (optional, default off).
Shows the first frame as a poster and standard video controls.

### GIF (Cloudinary)
- `cloudinaryId` (required): Cloudinary URL or public ID.
- `alt` (required).
- `caption`, `aspectRatio` (optional).
Delivered as an efficient autoplay-loop MP4. Under reduced motion it shows the static first
frame instead of looping. Upload the GIF to Cloudinary; it serves the optimized form.

### YouTube
- `videoId` (required): the 11-character ID, not the full URL. From
  `https://www.youtube.com/watch?v=16SzQjJ58Dc` the ID is `16SzQjJ58Dc`. From a short link
  `https://youtu.be/16SzQjJ58Dc` it is also `16SzQjJ58Dc`.
- `accessibleName` (required): used as the iframe title.
- `caption` (optional).
- `thumbnailUrl` (optional): override. If blank, the YouTube thumbnail is fetched
  automatically (maxres, falling back to hq if maxres is missing).
Shows a thumbnail with a play button; clicking loads the privacy-enhanced
youtube-nocookie embed.

### Instagram Reel and Instagram Post
- `postUrl` (required): the full Instagram URL, e.g.
  `https://www.instagram.com/reel/C3tHZnFsSlt` or `https://www.instagram.com/p/XXXXacode/`.
- `accessibleName` (required).
- `caption` (optional).
- `thumbnailUrl` (optional): a Cloudinary URL or public ID for a custom thumbnail. If blank,
  a brand-neutral gradient placeholder with a REEL or POST label is shown until the visitor
  clicks to load the embed.
Instagram's embed script loads only after the first Instagram item is activated on the page.

---

## Aspect ratio

`aspectRatio` controls the display frame, not the media's own proportions. The media is
contained inside the frame (letterboxed if needed), so nothing is cropped. Use it to keep a
consistent frame shape. Common values: `16/9` (default), `4/5`, `1/1`, `9/16` for vertical
Reels. Leave blank for the `16/9` default.

---

## Accessibility requirements (do not skip)

- Every image and GIF needs real `alt` text. Describe what is shown, not "image of".
- Every video, YouTube, and Instagram item needs a meaningful `accessibleName`.
- These are the screen-reader names for each item and the thumbnail labels. Blank or lazy
  values degrade the experience for assistive-technology users.

---

## Behavior notes

- A single-item gallery hides the thumbnail strip and the previous/next controls.
- Keyboard: Left/Right arrows move between items, Home/End jump to first/last, Enter or Space
  activates a focused thumbnail, Escape closes the fullscreen modal.
- The fullscreen modal traps focus and returns focus to the control that opened it.
- Reduced motion (visitor setting) disables slide and fade transitions, video autoplay, and
  GIF looping.

---

## Verifying all six types

The internal `/design-system` page carries a six-item demo matrix (one of each type) plus a
debug table. It is noindex and excluded from `robots.txt`. Use it to sanity-check rendering
after any change to the Gallery.

---

## ImageGrid: static prose images (when not to use the Gallery)

Introduced in Phase 19.6.2 (DEC-080). `ImageGrid` is a separate block from `Gallery`. Use it when
the images belong at a fixed point in the article body as illustrations, not as a media set the
visitor browses.

### Gallery vs ImageGrid

- **Gallery**: interactive. Carousel with a thumbnail strip, a fullscreen modal, keyboard navigation,
  and six media types including video and embeds. Use it for the project's screenshot and video set.
- **ImageGrid**: static. A plain CSS grid of images, two columns, stacking to one column on narrow
  screens. No carousel, no fullscreen, no interactivity, images only. Use it for inline body images
  such as press clippings or a small set of figures that should sit together at one position.

If you are unsure, default to Gallery. Reach for ImageGrid only when the images are prose
illustrations that must stay in place.

### Adding an ImageGrid

1. In the Body editor, place the cursor where the grid should appear, type `/`, and choose
   **Image Grid**.
2. Click **Edit**, then **Add** for each image. Fill the fields, then **Done** and **Save**.

The block is stored as a markdoc tag, for example:

```
{% ImageGrid
   items=[{src: "https://res.cloudinary.com/ddgwzcrim/image/upload/Example_abc123.png", alt: "What the image shows"}] /%}
```

### Fields (per image)

- `src` (required): Cloudinary URL or public ID. Same rule as the Gallery: do not bake
  transformations into the URL; ImageGrid sizes the image itself.
- `alt` (required): describes the image for screen readers. Every image needs real alt text.
- `caption` (optional): shown below the image in mono type.

### Layout

Items flow into a two-column grid in order: four items render as 2x2, two as a single row, six as
three rows, and so on. Below 600px the grid stacks to a single column. There is no animation beyond a
border highlight on hover and focus, so reduced motion needs no special handling.
