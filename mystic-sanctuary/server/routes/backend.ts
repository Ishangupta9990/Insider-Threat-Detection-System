// mystic-sanctuary/server/routes/backend.ts
import { Request, Response, Router } from "express";

const BACKEND = process.env.BACKEND_URL || "http://127.0.0.1:8000";
export const backendRouter = Router();

async function passThrough(res: Response, target: string) {
  try {
    const r = await fetch(target);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(502).json({ error: "Backend unreachable", detail: String(e) });
  }
}

backendRouter.get("/status", async (_req: Request, res: Response) => {
  return passThrough(res, `${BACKEND}/api/status`);
});
backendRouter.get("/logs", async (req: Request, res: Response) => {
  const n = req.query.n ?? 100;
  return passThrough(res, `${BACKEND}/api/logs?n=${n}`);
});
backendRouter.get("/events", async (req: Request, res: Response) => {
  const n = req.query.n ?? 200;
  return passThrough(res, `${BACKEND}/api/events?n=${n}`);
});

// (you can add POST endpoints similarly if you need enroll/verify from UI)
