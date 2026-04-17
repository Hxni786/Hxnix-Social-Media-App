const { pool } = require('../config/db');

async function createTableAndSeed() {
  const createSQL = `
    CREATE TABLE IF NOT EXISTS posts (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      title      VARCHAR(255)  NOT NULL,
      body       TEXT          NOT NULL,
      userId     INT           NOT NULL DEFAULT 1,
      createdAt  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const countSQL = `SELECT COUNT(*) AS total FROM posts;`;

  const seedSQL = `
    INSERT INTO posts (title, body, userId) VALUES
    (
      'Neural Grid Activation — System Boot',
      'The Hxnix neural grid came online at 04:17 UTC. All distributed nodes have acknowledged handshake sequences. Latency across the mesh is holding at sub-3ms. The mainframe reports no anomalies in the primary signal matrix. Operators should monitor sector-7 output registers for potential cascade drift over the next 48 cycles.',
      1
    ),
    (
      'Thermal Core Stabilized After Override',
      'Following last night''s manual override event, the thermal core has returned to nominal operating range. Engineers confirmed the coolant bypass valve was misaligned by 0.4 degrees — well within tolerance but enough to trigger the early-warning sensors. The automated correction subroutine logged 312 micro-adjustments before full stabilization was achieved.',
      2
    ),
    (
      'Sector-9 Relay Network — Live Dispatch',
      'All relay towers in sector-9 have completed their firmware push to v4.2.1. Signal propagation tests returned 99.7% fidelity on the eastern corridor. The western array showed minor interference from the geomagnetic anomaly near grid coordinate 44.8N — a passive filter has been applied and will be reviewed after the next maintenance window.',
      3
    ),
    (
      'Pulse Archive: Historical Data Upload Complete',
      'The migration of 18 months of archival pulse data is now complete. A total of 4.2 terabytes were transferred to the redundant cold-storage array without a single checksum failure. Query access to the archive is available via the standard API endpoints. Operators are reminded to use indexed lookups only — full-table scans remain restricted.',
      1
    ),
    (
      'Incident Log #0447 — Power Surge Recovery',
      'At 22:09 local time, a power surge from the auxiliary line caused an unscheduled restart of the primary logic cluster. UPS units performed as designed, and the cluster was back online within 38 seconds. Post-event diagnostics found no data corruption. The surge origin has been traced to a faulty capacitor in sub-panel C. Replacement is scheduled for tomorrow morning.',
      4
    ),
    (
      'Operator Broadcast: Scheduled Maintenance Window',
      'A 4-hour maintenance window is scheduled for this Saturday, 02:00–06:00 UTC. During this time the primary API will be in read-only mode. Background jobs will be paused and the diagnostic subsystem will run full-spectrum hardware validation. All external integrations should account for potential delays. Status updates will be posted to the ops channel every 30 minutes.',
      2
    ),
    (
      'Signal Integrity Report — Week 22',
      'Week 22 signal integrity analysis is complete. Overall system health scored 97.4 out of 100. The primary data bus maintained 99.9% uptime. Two minor packet-loss events were recorded on the auxiliary channel, both self-corrected by the error-correction layer within one transmission cycle. No operator intervention was required. Full report has been archived in the weekly digest.',
      5
    );
  `;

  try {
    await pool.query(createSQL);
    const [rows] = await pool.query(countSQL);
    if (rows[0].total === 0) {
      await pool.query(seedSQL);
      console.log('[Model] ✅ Posts table seeded with 7 records');
    } else {
      console.log(`[Model] ℹ️  Posts table already has ${rows[0].total} records — skipping seed`);
    }
  } catch (err) {
    console.error('[Model] ❌ Table init/seed failed:', err.message);
    throw err;
  }
}

// ── CRUD ──────────────────────────────────────────────

async function getAllPosts() {
  const [rows] = await pool.query(
    'SELECT id, title, body, userId, createdAt FROM posts ORDER BY createdAt DESC'
  );
  return rows;
}

async function getPostById(id) {
  const [rows] = await pool.query(
    'SELECT id, title, body, userId, createdAt FROM posts WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createPost({ title, body, userId }) {
  const [result] = await pool.query(
    'INSERT INTO posts (title, body, userId) VALUES (?, ?, ?)',
    [title, body, userId || 1]
  );
  const [newPost] = await pool.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
  return newPost[0];
}

async function deletePost(id) {
  const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { createTableAndSeed, getAllPosts, getPostById, createPost, deletePost };
