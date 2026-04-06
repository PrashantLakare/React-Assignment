import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Col, Empty, Row, Typography } from "antd";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import { fetchUsers } from "../store/usersSlice";

function HomePage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Typography.Title level={2} style={{ marginBottom: 24 }}>
        All users
      </Typography.Title>

      {error ? (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary" onClick={() => dispatch(fetchUsers())}>
              Retry
            </Button>
          }
        />
      ) : null}

      {!loading && items.length === 0 && !error ? (
        <Empty description="No users to display" />
      ) : null}

      <Row gutter={[16, 16]}>
        {items.map((user) => (
          <Col key={user.id} xs={24} sm={12} md={8} xl={6}>
            <UserCard user={user} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default HomePage;
