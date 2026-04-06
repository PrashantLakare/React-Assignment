import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";

function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return (
      <div className="alert alert-warning" role="alert">
        <p className="mb-2">Could not load this profile.</p>
        <Link to="/" className="alert-link">
          Back to all users
        </Link>
      </div>
    );
  }

  const avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;

  return (
    <div className="user-profile card shadow-sm">
      <div className="card-body">
        <p className="mb-3">
          <Link to="/" className="text-decoration-none">
            ← Back to list
          </Link>
        </p>

        <div className="d-flex gap-4 align-items-start flex-wrap">
          <img
            src={avatar}
            alt={`${user.name} avatar`}
            className="rounded border bg-light"
            width={120}
            height={120}
          />
          <div>
            <h1 className="h3 mb-1">{user.name}</h1>
            <p className="text-muted mb-0">@{user.username}</p>
          </div>
        </div>

        <hr />

        <div className="row g-3">
          <div className="col-md-6">
            <h2 className="h6 text-uppercase text-muted">Contact</h2>
            <p className="mb-1">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="mb-1">
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="mb-0">
              <strong>Website:</strong> {user.website}
            </p>
          </div>
          <div className="col-md-6">
            <h2 className="h6 text-uppercase text-muted">Address</h2>
            <p className="mb-0">
              {user.address.street}, {user.address.suite}
              <br />
              {user.address.city}, {user.address.zipcode}
            </p>
          </div>
          <div className="col-12">
            <h2 className="h6 text-uppercase text-muted">Company</h2>
            <p className="mb-1">
              <strong>{user.company.name}</strong>
            </p>
            <p className="mb-0 text-muted fst-italic">
              “{user.company.catchPhrase}”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
