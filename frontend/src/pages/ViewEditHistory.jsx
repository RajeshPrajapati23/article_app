import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { getToken, getUser } from "../common/helper";
import axios from "axios";
import { toast } from "react-toastify";

export default function ViewEditHistory({ data }) {
  const [articles, setArticles] = useState([]);

  const navigator = useNavigate();
  const api = import.meta.env.VITE_API;
  let { id } = useParams() || {};

  const headers = {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  };

  const [formErrors, setFormErrors] = useState({});

  const fetchArticlesById = async (id) => {
    try {
      const res = await axios.get(
        api + "/api/get/article/history/" + id,
        headers
      );
      setArticles(res.data.data || []);
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
    fetchArticlesById(id);
  }, []);

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">History</h2>
        <Link
          to="/"
          className="bg-danger p-2 text-white"
          style={{ borderRadius: "6px" }}
          variant="danger"
          onClick={() => handleShow({ type: "add" })}
        >
          Go Back
        </Link>
      </div>

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
                    {article.tags}
                  </span>
                </div>
                <div className="card-footer text-end text-muted small">
                  updated on &nbsp;
                  {article.created_at
                    ? new Date(article.created_at).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
