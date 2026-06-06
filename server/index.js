import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { requireAuth } from './middleware/auth.js';
import { getOne, getAll, run } from './db-config.js';
import { connectSupabase } from './supabase-db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'clubcabritassecretkey_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de public
app.use(express.static(path.join(__dirname, '../public')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from 'uploads'
app.use('/uploads', express.static(uploadsDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ── AUTH ──────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Username and password required' });
    try {
        const user = await getOne('SELECT * FROM users WHERE username = $1', [username]);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── ROUTES ────────────────────────────────────────────────────────────
app.get('/api/routes', async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM routes WHERE is_published = true ORDER BY date DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/routes/admin/all', requireAuth, async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM routes ORDER BY date DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/routes/:id', async (req, res) => {
    try {
        const row = await getOne('SELECT * FROM routes WHERE id = $1', [req.params.id]);
        if (!row) return res.status(404).json({ message: 'Not found' });
        res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/routes', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, date, type, description, difficulty, distance, duration, location } = req.body;
        if (!title || !date || !type || !description)
            return res.status(400).json({ message: 'Missing required fields: title, date, type, description' });

        let imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');

        const result = await run(
            `INSERT INTO routes (title, date, type, image, description, difficulty, distance, duration, location, is_published)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true) RETURNING *`,
            [title, date, type, imageUrl, description, difficulty || null, distance || null, duration || null, location || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/routes/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, date, type, description, difficulty, distance, duration, location } = req.body;
        const route = await getOne('SELECT * FROM routes WHERE id = $1', [req.params.id]);
        if (!route) return res.status(404).json({ message: 'Route not found' });

        let imageUrl = route.image;
        if (req.file) imageUrl = `/uploads/${req.file.filename}`;
        else if (req.body.imageUrl) imageUrl = req.body.imageUrl;

        const result = await run(
            `UPDATE routes SET title=$1, date=$2, type=$3, image=$4, description=$5,
             difficulty=$6, distance=$7, duration=$8, location=$9, updated_at=CURRENT_TIMESTAMP
             WHERE id=$10 RETURNING *`,
            [
                title || route.title, date || route.date, type || route.type,
                imageUrl, description || route.description,
                difficulty !== undefined ? difficulty : route.difficulty,
                distance !== undefined ? distance : route.distance,
                duration !== undefined ? duration : route.duration,
                location !== undefined ? location : route.location,
                req.params.id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/routes/:id', requireAuth, async (req, res) => {
    try {
        await run('DELETE FROM routes WHERE id = $1', [req.params.id]);
        res.json({ message: 'Route deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── SETTINGS ──────────────────────────────────────────────────────────
app.get('/api/settings', async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM settings');
        const obj = {};
        rows.forEach(s => { obj[s.setting_key] = s.setting_value; });
        res.json(obj);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings', requireAuth, async (req, res) => {
    try {
        const entries = req.body;
        for (const [key, value] of Object.entries(entries)) {
            await run(
                `INSERT INTO settings (setting_key, setting_value) VALUES ($1,$2)
                 ON CONFLICT (setting_key) DO UPDATE SET setting_value=$2, updated_at=CURRENT_TIMESTAMP`,
                [key, value]
            );
        }
        res.json({ message: 'Settings updated successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Upload logo image and save URL to settings
app.post('/api/settings/upload-logo', requireAuth, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const { logo_type } = req.body; // 'logo_desktop' or 'logo_mobile'
        if (!logo_type || !['logo_desktop', 'logo_mobile'].includes(logo_type))
            return res.status(400).json({ message: 'logo_type must be logo_desktop or logo_mobile' });

        const imageUrl = `/uploads/${req.file.filename}`;
        await run(
            `INSERT INTO settings (setting_key, setting_value) VALUES ($1,$2)
             ON CONFLICT (setting_key) DO UPDATE SET setting_value=$2, updated_at=CURRENT_TIMESTAMP`,
            [logo_type, imageUrl]
        );
        res.json({ url: imageUrl, key: logo_type });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GALLERY ───────────────────────────────────────────────────────────
app.get('/api/gallery', async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM gallery WHERE is_published = true ORDER BY display_order ASC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/gallery/admin/all', requireAuth, async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM gallery ORDER BY display_order ASC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/gallery/:id', async (req, res) => {
    try {
        const row = await getOne('SELECT * FROM gallery WHERE id = $1', [req.params.id]);
        if (!row) return res.status(404).json({ message: 'Not found' });
        res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gallery', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, display_order } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');
        if (!title || !imageUrl)
            return res.status(400).json({ message: 'Title and image are required' });

        const result = await run(
            `INSERT INTO gallery (title, image, description, category, display_order, is_published)
             VALUES ($1,$2,$3,$4,$5,true) RETURNING *`,
            [title, imageUrl, description || '', category || '', display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/gallery/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, display_order, is_published } = req.body;
        const item = await getOne('SELECT * FROM gallery WHERE id = $1', [req.params.id]);
        if (!item) return res.status(404).json({ message: 'Gallery item not found' });

        let imageUrl = item.image;
        if (req.file) imageUrl = `/uploads/${req.file.filename}`;
        else if (req.body.imageUrl) imageUrl = req.body.imageUrl;

        const result = await run(
            `UPDATE gallery SET title=$1, image=$2, description=$3, category=$4,
             display_order=$5, is_published=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *`,
            [
                title !== undefined ? title : item.title,
                imageUrl,
                description !== undefined ? description : item.description,
                category !== undefined ? category : item.category,
                display_order !== undefined ? display_order : item.display_order,
                is_published !== undefined ? (is_published === 'true' || is_published === true) : item.is_published,
                req.params.id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/gallery/:id', requireAuth, async (req, res) => {
    try {
        await run('DELETE FROM gallery WHERE id = $1', [req.params.id]);
        res.json({ message: 'Gallery item deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── EVENTS ────────────────────────────────────────────────────────────
app.get('/api/events', async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM events WHERE is_published = true ORDER BY event_date DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/events/admin/all', requireAuth, async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM events ORDER BY event_date DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/events', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, event_date, location, capacity, description } = req.body;
        if (!title || !event_date)
            return res.status(400).json({ message: 'Title and date are required' });

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');
        const result = await run(
            `INSERT INTO events (title, event_date, location, capacity, description, image, is_published)
             VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING *`,
            [title, event_date, location || '', capacity || null, description || '', imageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/events/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, event_date, location, capacity, description } = req.body;
        const event = await getOne('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        let imageUrl = event.image;
        if (req.file) imageUrl = `/uploads/${req.file.filename}`;
        else if (req.body.imageUrl) imageUrl = req.body.imageUrl;

        const result = await run(
            `UPDATE events SET title=$1, event_date=$2, location=$3, capacity=$4,
             description=$5, image=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *`,
            [
                title || event.title, event_date || event.event_date,
                location || event.location, capacity || event.capacity,
                description || event.description, imageUrl, req.params.id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/events/:id', requireAuth, async (req, res) => {
    try {
        await run('DELETE FROM events WHERE id = $1', [req.params.id]);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── CONTACT MESSAGES ─────────────────────────────────────────────────
app.post('/api/contact-messages', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ message: 'Name, email and message are required' });

        const result = await run(
            `INSERT INTO contact_messages (name, email, phone, subject, message)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [name, email, phone || '', subject || '', message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/contact-messages', requireAuth, async (req, res) => {
    try {
        const rows = await getAll('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/contact-messages/:id/read', requireAuth, async (req, res) => {
    try {
        const result = await run(
            'UPDATE contact_messages SET is_read=true WHERE id=$1 RETURNING *',
            [req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/contact-messages/:id', requireAuth, async (req, res) => {
    try {
        await run('DELETE FROM contact_messages WHERE id=$1', [req.params.id]);
        res.json({ message: 'Message deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── START ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    try {
        await connectSupabase();
    } catch {
        console.error('⚠️  Could not verify DB connection on startup');
    }
});
