// Standalone Mock Service

// Pre-seeded posts from your database!
let mockPosts = [
  {id:1,title:"Neural Grid Activation — System Boot",body:"The Hxnix neural grid came online at 04:17 UTC. All distributed nodes have acknowledged handshake sequences. Latency across the mesh is holding at sub-3ms. The mainframe reports no anomalies in the primary signal matrix. Operators should monitor sector-7 output registers for potential cascade drift over the next 48 cycles.",userId:1,createdAt:"2026-04-09T12:02:02.000Z"},
  {id:2,title:"Thermal Core Stabilized After Override",body:"Following last night's manual override event, the thermal core has returned to nominal operating range. Engineers confirmed the coolant bypass valve was misaligned by 0.4 degrees — well within tolerance but enough to trigger the early-warning sensors. The automated correction subroutine logged 312 micro-adjustments before full stabilization was achieved.",userId:2,createdAt:"2026-04-09T12:02:02.000Z"},
  {id:3,title:"Sector-9 Relay Network — Live Dispatch",body:"All relay towers in sector-9 have completed their firmware push to v4.2.1. Signal propagation tests returned 99.7% fidelity on the eastern corridor. The western array showed minor interference from the geomagnetic anomaly near grid coordinate 44.8N — a passive filter has been applied and will be reviewed after the next maintenance window.",userId:3,createdAt:"2026-04-09T12:02:02.000Z"},
  {id:4,title:"Pulse Archive: Historical Data Upload Complete",body:"The migration of 18 months of archival pulse data is now complete. A total of 4.2 terabytes were transferred to the redundant cold-storage array without a single checksum failure. Query access to the archive is available via the standard API endpoints. Operators are reminded to use indexed lookups only — full-table scans remain restricted.",userId:1,createdAt:"2026-04-09T12:02:02.000Z"},
  {id:5,title:"Incident Log #0447 — Power Surge Recovery",body:"At 22:09 local time, a power surge from the auxiliary line caused an unscheduled restart of the primary logic cluster. UPS units performed as designed, and the cluster was back online within 38 seconds. Post-event diagnostics found no data corruption. The surge origin has been traced to a faulty capacitor in sub-panel C. Replacement is scheduled for tomorrow morning.",userId:4,createdAt:"2026-04-09T12:02:02.000Z"},
  {id:6,title:"Operator Broadcast: Scheduled Maintenance Window",body:"A 4-hour maintenance window is scheduled for this Saturday, 02:00–06:00 UTC. During this time the primary API will be in read-only mode. Background jobs will be paused and the diagnostic subsystem will run full-spectrum hardware validation. All external integrations should account for potential delays. Status updates will be posted to the ops channel every 30 minutes.",userId:2,createdAt:"2026-04-09T12:02:02.000Z"},
  {id:7,title:"Signal Integrity Report — Week 22",body:"Week 22 signal integrity analysis is complete. Overall system health scored 97.4 out of 100. The primary data bus maintained 99.9% uptime. Two minor packet-loss events were recorded on the auxiliary channel, both self-corrected by the error-correction layer within one transmission cycle. No operator intervention was required. Full report has been archived in the weekly digest.",userId:5,createdAt:"2026-04-09T12:02:02.000Z"}
];

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPosts() {
  await delay(400); 
  return { success: true, count: mockPosts.length, data: [...mockPosts].reverse() };
}

export async function getPostById(id) {
  await delay(200);
  const post = mockPosts.find(p => p.id === parseInt(id));
  if (post) return { success: true, data: post };
  throw new Error('Post not found');
}

export async function createPost({ title, body, userId = 1 }) {
  await delay(500);
  const newPost = {
    id: mockPosts.length > 0 ? Math.max(...mockPosts.map(p => p.id)) + 1 : 1,
    title,
    body,
    userId,
    createdAt: new Date().toISOString()
  };
  mockPosts.push(newPost);
  return { success: true, data: newPost };
}

export async function deletePost(id) {
  await delay(400);
  mockPosts = mockPosts.filter(p => p.id !== parseInt(id));
  return { success: true };
}
