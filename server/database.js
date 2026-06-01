import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';

// Open SQLite database
export async function openDb() {
  return open({
    filename: path.resolve(process.cwd(), 'server/database.sqlite'),
    driver: sqlite3.Database
  });
}

// Initialize tables
export async function initializeDb() {
  const db = await openDb();

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Create Routes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  // Create Settings table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT
    )
  `);

  // Create Gallery table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT
    )
  `);

  // Create default admin user if none exists
  const adminExists = await db.get('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!adminExists) {
    const defaultPassword = 'admin'; // You can change this
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
    console.log('Default admin user created. Username: admin, Password: admin');
  }

  // Check if routes are empty, initialize with defaults to mirror previous state
  const routesExist = await db.get('SELECT COUNT(*) as count FROM routes');
  if (routesExist && routesExist.count === 0) {
    await db.run(
      'INSERT INTO routes (title, date, type, image, description) VALUES (?, ?, ?, ?, ?)',
      ['Ascenso al Nevado Condoriri', '15 de Mayo, 2026', 'Alta Montaña', '/images/route_snow.png', 'Una expedición inolvidable a una de las cumbres más icónicas de la Cordillera Real.']
    );
    await db.run(
      'INSERT INTO routes (title, date, type, image, description) VALUES (?, ?, ?, ?, ?)',
      ['Trekking Valle de las Ánimas', '22 de Mayo, 2026', 'Senderismo', '/images/route_green.png', 'Recorrido por las increíbles y místicas formaciones geológicas a pocos minutos de La Paz.']
    );
    console.log('Default routes inserted.');
  }

  // Check if settings are empty, initialize with defaults
  const settingsExist = await db.get('SELECT COUNT(*) as count FROM settings');
  if (settingsExist && settingsExist.count === 0) {
    const defaultSettings = [
      { key: 'hero_title', value: 'NO SOMOS AGENCIA, SOMOS VIAJEROS' },
      { key: 'hero_subtitle', value: 'Descubre las mejores rutas y ascensos con Club Cabritas' },
      { key: 'philosophy_text', value: 'Creemos en la montaña como un estilo de vida y fomentamos el respeto por la naturaleza en cada paso que damos.' },
      { key: 'contact_email', value: 'info@clubcabritas.com' },
      { key: 'contact_phone', value: '+591 12345678' }
    ];
    for (const setting of defaultSettings) {
      await db.run('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [setting.key, setting.value]);
    }
    console.log('Default settings inserted.');
  }

  return db;
}
