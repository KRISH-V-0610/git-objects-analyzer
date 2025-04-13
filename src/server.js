import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeRepository, getObjectDetails, filterObjects } from './analyzer.js';
import opn from 'opn';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startServer(repoPath, port = 3000) {
  const app = express();
  
  // Configure EJS
  app.set('views', path.join(__dirname, 'templates'));
  app.set('view engine', 'ejs');
  
  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Add this helper function at the top of server.js
function getObjectIcon(type) {
  const icons = {
    'commit': 'fa-solid fa-code-commit',
    'tree': 'fa-solid fa-folder-tree', 
    'blob': 'fa-solid fa-file-code'
  };
  return icons[type] || 'fa-solid fa-question';
}
  // Main route
  app.get('/', async (req, res) => {
    try {
      const objects = await analyzeRepository(repoPath);
      res.render('report', { 
        objects, 
        repoPath,
        getObjectIcon // Pass the function to the template
      });
    } catch (error) {
      res.status(500).send(`Analysis failed: ${error.message}`);
    }
  });

  // Object details API endpoint
  app.get('/object/:sha', async (req, res) => {
    try {
      const { sha } = req.params;
      const { type } = req.query;
      const details = await getObjectDetails(repoPath, sha, type);
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // New filter API endpoint
  app.get('/api/filter', async (req, res) => {
    try {
      const { search, type } = req.query;
      const filteredObjects = await filterObjects(repoPath, {
        search: search || '',
        type: type || ''
      });
      res.json(filteredObjects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start server
  const server = app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Server started at ${url}`);
    opn(url);
  });

  return { server };
}