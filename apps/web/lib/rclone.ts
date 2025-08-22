import axios from "axios";

const baseURL = process.env.RCLONE_RC_URL || "http://rclone:5572";

export const rclone = axios.create({
  baseURL,
  auth: {
    username: process.env.RCLONE_RC_USER || "rclone",
    password: process.env.RCLONE_RC_PASS || "rclone",
  },
});

// Call any rc command via /rc
export async function rc<T = any>(command: string, params: Record<string, any> = {}): Promise<T> {
  const { data } = await rclone.post("/rc", { command, ...params });
  return data as T;
}
