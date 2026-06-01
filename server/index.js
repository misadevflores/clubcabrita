import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeDb, openDb } from './database.js';
import { requireAuth } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'clubcabritassecretkey_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Initialize Database
initializeDb().catch(err => {
    console.error('Failed to initialize database:', err);
});

// --- API ROUTES ---

// LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
});

// GET ROUTES (Public)
app.get('/api/routes', async (req, res) => {
    try {
        const db = await openDb();
        const routes = await db.all('SELECT * FROM routes ORDER BY id DESC');
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE ROUTE (Public)
app.get('/api/routes/:id', async (req, res) => {
    try {
        const db = await openDb();
        const route = await db.get('SELECT * FROM routes WHERE id = ?', [req.params.id]);
        if (!route) return res.status(404).json({ message: 'Not found' });
        res.json(route);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE ROUTE (Protected)
app.post('/api/routes', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, date, type, description } = req.body;
        let imageUrl = '';

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            // Fallback if they pass an explicit URL instead of file
            imageUrl = req.body.imageUrl;
        }

        if (!title || !date || !type || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const db = await openDb();
        const result = await db.run(
            'INSERT INTO routes (title, date, type, image, description) VALUES (?, ?, ?, ?, ?)',
            [title, date, type, imageUrl, description]
        );

        const newRoute = await db.get('SELECT * FROM routes WHERE id = ?', [result.lastID]);
        res.status(201).json(newRoute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE ROUTE (Protected)
app.put('/api/routes/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, date, type, description } = req.body;
        const db = await openDb();
        const route = await db.get('SELECT * FROM routes WHERE id = ?', [req.params.id]);
        if (!route) return res.status(404).json({ message: 'Route not found' });

        let imageUrl = route.image;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl && req.body.imageUrl !== '') {
            imageUrl = req.body.imageUrl;
        }

        await db.run(
            'UPDATE routes SET title = ?, date = ?, type = ?, image = ?, description = ? WHERE id = ?',
            [title || route.title, date || route.date, type || route.type, imageUrl, description || route.description, req.params.id]
        );

        const updatedRoute = await db.get('SELECT * FROM routes WHERE id = ?', [req.params.id]);
        res.json(updatedRoute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE ROUTE (Protected)
app.delete('/api/routes/:id', requireAuth, async (req, res) => {
    try {
        const db = await openDb();
        await db.run('DELETE FROM routes WHERE id = ?', [req.params.id]);
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SETTINGS API ---

// GET SETTINGS (Public)
app.get('/api/settings', async (req, res) => {
    try {
        const db = await openDb();
        const settings = await db.all('SELECT * FROM settings');
        const settingsObj = {};
        settings.forEach(s => { settingsObj[s.setting_key] = s.setting_value });
        res.json(settingsObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE SETTINGS (Protected)
app.put('/api/settings', requireAuth, async (req, res) => {
    try {
        const db = await openDb();
        const settings = req.body;
        for (const [key, value] of Object.entries(settings)) {
            await db.run(
                'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value',
                [key, value]
            );
        }
        res.json({ message: 'Settings updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GALLERY API ---

// GET GALLERY (Public)
app.get('/api/gallery', async (req, res) => {
    try {
        const db = await openDb();
        const gallery = await db.all('SELECT * FROM gallery ORDER BY id DESC');
        res.json(gallery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE GALLERY ITEM (Public)
app.get('/api/gallery/:id', async (req, res) => {
    try {
        const db = await openDb();
        const item = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE GALLERY ITEM (Protected)
app.post('/api/gallery', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }

        if (!title || !imageUrl) {
            return res.status(400).json({ message: 'Title and image are required' });
        }

        const db = await openDb();
        const result = await db.run(
            'INSERT INTO gallery (title, image, description) VALUES (?, ?, ?)',
            [title, imageUrl, description || '']
        );
        const newItem = await db.get('SELECT * FROM gallery WHERE id = ?', [result.lastID]);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE GALLERY ITEM (Protected)
app.put('/api/gallery/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const db = await openDb();
        const item = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
        if (!item) return res.status(404).json({ message: 'Not found' });

        let imageUrl = item.image;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl && req.body.imageUrl !== '') {
            imageUrl = req.body.imageUrl;
        }

        await db.run(
            'UPDATE gallery SET title = ?, image = ?, description = ? WHERE id = ?',
            [title !== undefined ? title : item.title, imageUrl, description !== undefined ? description : item.description, req.params.id]
        );

        const updatedItem = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE GALLERY ITEM (Protected)
app.delete('/api/gallery/:id', requireAuth, async (req, res) => {
    try {
        const db = await openDb();
        await db.run('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ message: 'Gallery item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
