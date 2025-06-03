import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { getToken, getUser } from "../common/helper";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const navigator = useNavigate();
  const api = import.meta.env.VITE_API;

  const headers = {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  };

  const [typeAddEdit, setTypeAddEdit] = useState("");
  const [targetId, setTargetId] = useState("");
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchArticles = async () => {
    try {
      const res = await axios.get(api + "/api/get/article", headers);
      setArticles(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch articles");
    }
  };

  const fetchArticlesById = async (id) => {
    try {
      const res = await axios.get(api + "/api/get/article/" + id, headers);
      setNewArticle(res.data.data || []);
      setTargetId(id);
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.msg);
      setError(err.response?.data?.msg || "Failed to fetch article");
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigator("/login");
      return;
    }
    fetchArticles();
  }, []);

  const handleShowViewMdl = ({ e, id }) => {
    e.preventDefault();
    setViewModal(true);
    let data = articles.filter((val) => val.id === id);
    if (data.length > 0) {
      setNewArticle(data[0]);
    }
  };

  const handleShow = ({ type, id }) => {
    setTypeAddEdit(type);
    if (type === "add") {
      setNewArticle({ title: "", content: "", tags: "" });
      setFormErrors({});
      setShowModal(true);
    } else {
      fetchArticlesById(id);
    }
  };

  const handleClose = () => setShowModal(false);
  const handleCloseView = () => setViewModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newArticle.title) errors.title = "Title is required";
    if (!newArticle.content) errors.content = "Content is required";
    return errors;
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await axios.post(
        api + "/api/update/article",
        {
          id: targetId,
          ...newArticle,
          tags: String(newArticle.tags)
            .split(",")
            .map((t) => t.trim()),
        },
        headers
      );

      if (res?.data?.succ) {
        toast.success(res?.data?.msg);
        fetchArticles();
      }
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update article");
    }
  };

  const DelArticlesById = async (id) => {
    try {
      const res = await axios.delete(
        api + "/api/delete/article/" + id,
        headers
      );
      if (res.data.succ) {
        toast.success(res.data.msg);
        fetchArticles();
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete article");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await axios.post(
        api + "/api/add/article",
        {
          ...newArticle,
          tags: newArticle.tags.split(",").map((t) => t.trim()),
        },
        headers
      );

      if (res?.data?.succ) {
        toast.success(res?.data?.msg);
        fetchArticles();
      }
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add article");
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">📝 Knowledge Home</h2>
        <Button variant="danger" onClick={() => handleShow({ type: "add" })}>
          ➕ Add Article
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {articles.length === 0 ? (
        <div className="alert alert-warning">No articles found.</div>
      ) : (
        <div className="row g-4">
          {articles.map((article) => (
            <div key={article.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-danger border-1">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-danger">{article.title}</h5>
                  <p className="card-text text-truncate">
                    {article.content.length > 100
                      ? article.content.slice(0, 100) + "..."
                      : article.content}
                  </p>
                  <span style={{ fontSize: "12px", marginBottom: "7px" }}>
                    By {article.author}
                  </span>
                  <div className="mt-auto d-flex justify-content-between">
                    <Link
                      onClick={(e) => handleShowViewMdl({ e, id: article.id })}
                      className="btn btn-outline-danger btn-sm"
                    >
                      View
                    </Link>
                    <Link
                      onClick={() =>
                        handleShow({ id: article.id, type: "edit" })
                      }
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      onClick={() => DelArticlesById(article.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <Link
                    to={`/viewedithistory/${article.id}`}
                    className="w-50 border-0 bg-danger text-center text-white"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    View History
                  </Link>
                  <div className="w-50 card-footer text-end text-muted small">
                    {article.created_at
                      ? new Date(article.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            {typeAddEdit === "add" ? "Add New Article" : "Edit Article"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={typeAddEdit === "add" ? handleSubmit : onUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newArticle.title}
                onChange={handleChange}
                isInvalid={!!formErrors.title}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={newArticle.content}
                onChange={handleChange}
                rows={4}
                isInvalid={!!formErrors.content}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.content}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={newArticle.tags}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary me-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" type="submit">
                Save Article
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal show={viewModal} onHide={handleCloseView} backdrop="static">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>View Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={newArticle.title} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                value={newArticle.content}
                rows={4}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                value={
                  Array.isArray(newArticle.tags)
                    ? newArticle.tags.join(", ")
                    : newArticle.tags
                }
                disabled
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
