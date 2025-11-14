// hello.js

export default async function handler(req, res) {
  res.status(200).json({
    name: "Hello World",
    method: req.method,
    url: req.url,
  });
}
