// hello.js

interface VercelRequest {
  method: string;
  url: string;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: any): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    name: "Hello World",
    method: req.method,
    url: req.url,
  });
}
