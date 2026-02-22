const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const BACKUP_DIR = path.join(__dirname, '../../backups');
const MAX_BACKUPS = 10;

const createBackup = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup_${timestamp}`);

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const mongoUri = process.env.MONGO_URI;
  const cmd = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;

  console.log(`🔄 Creating backup: ${backupPath}`);

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Backup failed: ${error.message}`);
      return;
    }

    console.log(`✅ Backup created: ${backupPath}`);

    // Clean up old backups
    cleanupOldBackups();
  });
};

const cleanupOldBackups = () => {
  if (!fs.existsSync(BACKUP_DIR)) return;

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith('backup_'))
    .sort()
    .reverse();

  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);
    toDelete.forEach((dir) => {
      const fullPath = path.join(BACKUP_DIR, dir);
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`🗑️  Deleted old backup: ${dir}`);
    });
  }
};

const restoreBackup = (backupName) => {
  const backupPath = path.join(BACKUP_DIR, backupName);

  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup not found: ${backupPath}`);
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  const cmd = `mongorestore --uri="${mongoUri}" --drop "${backupPath}"`;

  console.log(`🔄 Restoring from: ${backupPath}`);

  exec(cmd, (error) => {
    if (error) {
      console.error(`❌ Restore failed: ${error.message}`);
      return;
    }
    console.log('✅ Database restored successfully');
  });
};

// CLI usage
const action = process.argv[2];
if (action === 'restore') {
  const backupName = process.argv[3];
  if (!backupName) {
    console.log('Usage: node backup.js restore <backup_name>');
    console.log('Available backups:');
    if (fs.existsSync(BACKUP_DIR)) {
      fs.readdirSync(BACKUP_DIR).forEach((f) => console.log(`  - ${f}`));
    }
  } else {
    restoreBackup(backupName);
  }
} else {
  createBackup();
}