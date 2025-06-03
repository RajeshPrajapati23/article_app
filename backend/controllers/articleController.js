import pool from "../db/db.js";

export const createArticle = async (req, res) => {
  // Basic input validation
  const { title, content, tags, created_by } = req.body;
  if (!title || !content) {
    return res.status(401).json({
      succ: false,
      msg: "Title and content fields are required.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tbl_articles (title, content, tags, created_by) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, tags || [], req.user.id]
    );

    return res.status(200).json({
      succ: true,
      msg: "Added successfully.",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return res.status(500).json({
      succ: false,
      msg: "Server error.",
    });
  }
};

export const getByIdArticle = async (req, res) => {
  // Basic input validation
  const { id } = req.params;
  console.log("id", id);

  let user = req.user;
  console.log("user", user);

  if (!id) {
    return res.status(401).json({
      succ: false,
      msg: "Id is missing.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM tbl_articles WHERE id = $1`,
      [id]
    );

    if (result.rows[0]?.created_by != user.id && user.role === "user") {
      return res.status(401).json({
        succ: false,
        msg: "Permission denied.",
      });
    }
    return res.status(200).json({
      succ: true,
      msg: "get successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return res.status(500).json({
      succ: false,
      msg: "Server error.",
    });
  }
};

export const geteArticle = async (req, res) => {
  // Basic input validation

  try {
    const result = await pool.query(
      `SELECT a.*, u.name AS author 
   FROM tbl_articles a 
   JOIN tbl_users u ON a.created_by = u.id`
    );

    return res.status(200).json({
      succ: true,
      msg: "successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return res.status(500).json({
      succ: false,
      msg: "Server error.",
    });
  }
};

export const updateArticleByid = async (req, res) => {
  // Get current article for revision
  // Basic input validation

  const { title, content, tags, id } = req.body;
  if (!title || !content || !id) {
    return res.status(401).json({
      succ: false,
      msg: "Title, content and id are required.",
    });
  }
  const user = req.user;
  const result = (
    await pool.query(`SELECT * FROM tbl_articles WHERE id = $1`, [id])
  ).rows[0];

  console.log("resul", result);

  if (result?.created_by != user.id && user.role === "user") {
    return res.status(401).json({
      succ: false,
      msg: "Permission denied.",
    });
  }

  const updated = await pool.query(
    `UPDATE tbl_articles SET title = $1, content = $2, tags = $3 WHERE id = $4 RETURNING *`,
    [title, content, tags, id]
  );
  // edit history
  await pool.query(
    `INSERT INTO tbl_edit_history (title, content, tags, created_by, article_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [result.title, result.content, result.tags, user.id, result.id]
  );
  return res.status(200).json({
    succ: true,
    msg: "updated successfully.",
    data: updated.rows[0],
  });
};

export const deleteArticleById = async (req, res) => {
  const { id } = req.params;

  let user = req.user;
  console.log("user", user);
  console.log("id", id);

  if (!id) {
    return res.status(401).json({
      succ: false,
      msg: "Id is missing.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT * from tbl_articles a WHERE a.id = $1`,
      [id]
    );

    console.log("result", result.rows);

    if (result.rows[0]?.created_by != user.id && user.role === "user") {
      return res.status(401).json({
        succ: false,
        msg: "Permission denied.",
      });
    }
    await pool.query(`DELETE FROM tbl_articles WHERE id = $1`, [id]);
    return res.status(200).json({
      succ: true,
      msg: "Deleted successfully.",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return res.status(500).json({
      succ: false,
      msg: "Server error.",
    });
  }
};

export const geteAllArticleHistory = async (req, res) => {
  // Basic input validation
  let { id } = req.params;
  if (!id) {
    return res.status(401).json({
      succ: false,
      msg: "Id is missing.",
    });
  }
  try {
    const article = (
      await pool.query(`SELECT * FROM tbl_articles where id = $1`, [id])
    ).rows[0];
    if (article?.created_by != req.user.id && req.user.role === "user") {
      return res.status(401).json({
        succ: false,
        msg: "Permission denied.",
      });
    }

    let all = await pool.query(
      `SELECT * FROM tbl_edit_history where article_id = $1`,
      [id]
    );

    return res.status(200).json({
      succ: true,
      msg: "successfully.",
      data: all.rows,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      succ: false,
      msg: "Server error.",
    });
  }
};
