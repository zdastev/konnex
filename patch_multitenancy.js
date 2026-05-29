const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'backend', 'controllers');

const filesToPatch = [
  'categoriasController.js',
  'contactosController.js',
  'productosController.js',
  'estadosController.js',
  'agendaController.js',
  'dashboardController.js',
  'serviciosController.js'
];

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Simple string replacements for common patterns

  // Categorias
  if (file.includes('categoriasController.js')) {
    content = content.replace(
      "await pool.query('SELECT * FROM categorias ORDER BY created_at ASC')",
      "await pool.query('SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY created_at ASC', [req.user.id])"
    );
    content = content.replace(
      "'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',\n      [nombre, descripcion]",
      "'INSERT INTO categorias (nombre, descripcion, usuario_id) VALUES ($1, $2, $3) RETURNING *',\n      [nombre, descripcion, req.user.id]"
    );
    content = content.replace(
      "'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',\n      [nombre, descripcion, id]",
      "'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 AND usuario_id = $4 RETURNING *',\n      [nombre, descripcion, id, req.user.id]"
    );
    content = content.replace(
      "await pool.query('DELETE FROM categorias WHERE id = $1', [id])",
      "await pool.query('DELETE FROM categorias WHERE id = $1 AND usuario_id = $2', [id, req.user.id])"
    );
    content = content.replace(
      "WHERE cp.categoria_id = $1",
      "WHERE cp.categoria_id = $1 AND p.usuario_id = $2"
    );
    content = content.replace(
      "[id]",
      "[id, req.user.id]"
    );
  }

  // Contactos
  if (file.includes('contactosController.js')) {
    content = content.replace(
      "WHERE 1=1",
      "WHERE c.usuario_id = $1"
    );
    content = content.replace(
      "const params = []",
      "const params = [req.user.id]"
    );
    content = content.replace(
      "WHERE c.id = $1",
      "WHERE c.id = $1 AND c.usuario_id = $2"
    );
    content = content.replace(
      "`, [id])",
      "`, [id, req.user.id])"
    );
    // Insert contacto
    content = content.replace(
      "INSERT INTO contactos (nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id)\n       VALUES ($1, $2, $3, $4, $5)",
      "INSERT INTO contactos (nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id, usuario_id)\n       VALUES ($1, $2, $3, $4, $5, $6)"
    );
    content = content.replace(
      "[nombre_negocio, whatsapp, ubicacion, tiene_web || false, categoria_id]",
      "[nombre_negocio, whatsapp, ubicacion, tiene_web || false, categoria_id, req.user.id]"
    );
    // Update contacto
    content = content.replace(
      "WHERE id = $6",
      "WHERE id = $6 AND usuario_id = $7"
    );
    content = content.replace(
      "[nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id, id]",
      "[nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id, id, req.user.id]"
    );
    // Delete contacto
    content = content.replace(
      "'DELETE FROM contactos WHERE id = $1', [id]",
      "'DELETE FROM contactos WHERE id = $1 AND usuario_id = $2', [id, req.user.id]"
    );
  }

  // Productos
  if (file.includes('productosController.js')) {
    content = content.replace(
      "'SELECT * FROM productos ORDER BY created_at ASC'",
      "'SELECT * FROM productos WHERE usuario_id = $1 ORDER BY created_at ASC', [req.user.id]"
    );
    content = content.replace(
      "'INSERT INTO productos (nombre, descripcion) VALUES ($1, $2) RETURNING *',\n      [nombre, descripcion]",
      "'INSERT INTO productos (nombre, descripcion, usuario_id) VALUES ($1, $2, $3) RETURNING *',\n      [nombre, descripcion, req.user.id]"
    );
    content = content.replace(
      "'UPDATE productos SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',\n      [nombre, descripcion, id]",
      "'UPDATE productos SET nombre = $1, descripcion = $2 WHERE id = $3 AND usuario_id = $4 RETURNING *',\n      [nombre, descripcion, id, req.user.id]"
    );
    content = content.replace(
      "await pool.query('DELETE FROM productos WHERE id = $1', [id])",
      "await pool.query('DELETE FROM productos WHERE id = $1 AND usuario_id = $2', [id, req.user.id])"
    );
  }

  fs.writeFileSync(file, content);
}

filesToPatch.forEach(f => patchFile(path.join(controllersDir, f)));
console.log('Patching complete');
