import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1 className="h3 mb-4">All users</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {users.map((user) => (
            <div key={user.id} className="col">
              <UserCard user={user} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default HomePage;
