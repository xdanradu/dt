const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// multer handles multipart/form-data — the encoding browsers use for file uploads.
// Unlike JSON (application/json) or form data (application/x-www-form-urlencoded),
// multipart encoding can transmit binary data (images, documents, etc.).
// memoryStorage() keeps the file in RAM (Buffer) instead of writing to disk.
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, 'public')));

// upload.single('file') is middleware that extracts the file from the multipart body.
// 'file' matches the name="file" attribute on the <input> element.
// After this middleware runs, req.file contains the file metadata and buffer.
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`  -> Received: ${req.file.originalname} (${req.file.size} bytes)`);

    // Show students what the server actually received:
    // - originalname: the filename from the client's filesystem
    // - mimetype: the Content-Type of the file (e.g. image/png, text/plain)
    // - size: file size in bytes
    // - encoding: transfer encoding (usually '7bit')
    // - bufferPreview: first 200 bytes as text, showing raw binary data
    res.json({
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        encoding: req.file.encoding,
        bufferPreview: req.file.buffer.toString('utf8', 0, Math.min(200, req.file.size)),
        // Content-Type header that the browser sent for this request.
        // For file uploads, it's multipart/form-data with a boundary string
        // that separates the different parts of the body.
        contentType: req.headers['content-type']
    });
});

app.listen(3003, () => {
    console.log('');
    console.log('=== File Upload Demo ===');
    console.log('http://localhost:3003');
    console.log('');
});
