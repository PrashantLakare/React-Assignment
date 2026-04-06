import { Link } from "react-router-dom";

function UserCard({ user }) {
  const avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;

  return (
    <Link
      to={`/user/${user.id}`}
      className="text-decoration-none text-dark d-block h-100"
    >
      <div className="user-card card h-100 shadow-sm">
        <div className="card-body text-center">
          <img src={avatar} alt={user.name} className="mb-3" />

          <h2 className="h5 card-title">{user.name}</h2>
          <p className="card-text small mb-1">{user.email}</p>
          <p className="card-text small mb-1">{user.phone}</p>
          <p className="card-text small mb-1">{user.website}</p>

          <p className="card-text small mb-1">
            {user.address.street}, {user.address.city}
          </p>

          <p className="card-text small mb-0">
            <strong>{user.company.name}</strong>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserCard;
