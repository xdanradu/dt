# 06 Image Compression Demo

A minimal practical example for image compression concepts.

Pipeline:

1. Load `forrest.avif` as the source image
2. Quantize from 256 levels to 16 levels (lossy)
3. Apply RLE over quantized pixels (lossless on quantized data)
4. Compare sizes and save output image files in AVIF format

Run:

```bash
node app.js
```

Generated files:

- `original.avif`
- `quantized.avif`

You can open the generated `.avif` files directly in standard image viewers.
