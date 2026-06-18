import { c as defineEventHandler, j as getQuery } from '../../_/nitro.mjs';
import { a as query, q as queryOne } from '../../_/client.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pg';

const index_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const q = getQuery(event);
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(50, Number(q.limit) || 24);
  const offset = (page - 1) * limit;
  const search = ((_a = q.search) == null ? void 0 : _a.trim()) || "";
  const sort = q.sort || "number";
  const conditions = [];
  const params = [];
  let pi = 1;
  if (search) {
    conditions.push(`(p.name ILIKE $${pi} OR p.number::text ILIKE $${pi})`);
    params.push(`%${search}%`);
    pi++;
  }
  if (q.generations) {
    const gens = String(q.generations).split(",").map(Number).filter(Boolean);
    if (gens.length) {
      conditions.push(`g.number = ANY($${pi}::int[])`);
      params.push(gens);
      pi++;
    }
  }
  if (q.releaseTypeSlugs) {
    const slugs = String(q.releaseTypeSlugs).split(",").filter(Boolean);
    if (slugs.length) {
      conditions.push(`rt.slug = ANY($${pi}::text[])`);
      params.push(slugs);
      pi++;
    }
  }
  if (q.hasFlocking === "true") {
    conditions.push("p.has_flocking = true");
  }
  if (q.hasMagnet === "true") {
    conditions.push("p.has_magnet = true");
  }
  if (q.hasGlitter === "true") {
    conditions.push("p.has_glitter = true");
  }
  if (q.moldIds) {
    const ids = String(q.moldIds).split(",").filter(Boolean);
    if (ids.length) {
      conditions.push(`p.mold_id = ANY($${pi}::uuid[])`);
      params.push(ids);
      pi++;
    }
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const sortMap = {
    number: "p.number ASC",
    name: "p.name ASC",
    rarity: "rt.sort_order ASC",
    generation: "g.number ASC, p.number ASC"
  };
  const orderBy = (_b = sortMap[sort]) != null ? _b : sortMap.number;
  const sql = `
    SELECT
      p.id, p.number, p.name,
      p.has_flocking, p.has_magnet, p.has_glitter,
      p.image_url, p.created_at,
      p.release_type_id,
      m.id AS mold_id, m.name AS mold_name, m.species AS mold_species,
      g.id AS generation_id, g.number AS gen_number, g.label AS gen_label,
      rt.id AS release_type_id, rt.slug AS release_type_slug, rt.label AS release_type_label, rt.is_exclusive
    FROM pets p
    JOIN molds m       ON m.id = p.mold_id
    JOIN generations g ON g.id = p.generation_id
    LEFT JOIN release_types rt ON rt.id = p.release_type_id
    ${where}
    ORDER BY ${orderBy}
    LIMIT $${pi} OFFSET $${pi + 1}
  `;
  const countSql = `
    SELECT COUNT(*) AS total
    FROM pets p
    JOIN generations g ON g.id = p.generation_id    LEFT JOIN release_types rt ON rt.id = p.release_type_id    ${where}
  `;
  const [rows, countRow] = await Promise.all([
    query(sql, [...params, limit, offset]),
    queryOne(countSql, params)
  ]);
  const total = Number((_c = countRow == null ? void 0 : countRow.total) != null ? _c : 0);
  return {
    items: rows.map((r) => ({
      id: r.id,
      number: r.number,
      name: r.name,
      hasFlocking: r.has_flocking,
      hasMagnet: r.has_magnet,
      hasGlitter: r.has_glitter,
      imageUrl: r.image_url,
      createdAt: r.created_at,
      releaseType: r.release_type_id ? { id: r.release_type_id, slug: r.release_type_slug, label: r.release_type_label, isExclusive: r.is_exclusive } : null,
      mold: { id: r.mold_id, name: r.mold_name, species: r.mold_species },
      generation: { id: r.generation_id, number: r.gen_number, label: r.gen_label }
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
