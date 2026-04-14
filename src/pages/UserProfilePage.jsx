import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Card, Col, Row, Space, Typography } from "antd";
import Loader from "../components/Loader";
import { authFetch } from "../auth/api";

const { Title, Text } = Typography;

function UserProfilePage() {
  const { id } = useParams();
  const userId = Number(id);
  const userFromRedux = useSelector((state) =>
    state.users.items.find((u) => u.id === userId),
  );

  const [remoteUser, setRemoteUser] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (userFromRedux) {
      return;
    }

    let cancelled = false;

    authFetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    // authFetch(`https://hbauth.herokuapp.com/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setRemoteUser({ ...data, favorite: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchError(true);
          setRemoteUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, userFromRedux]);

  const user = userFromRedux ?? remoteUser;
  const loading = !user && !fetchError;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Loader />
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <Alert
        type="warning"
        showIcon
        title="Could not load this profile."
        description={
          <Link to="/">Back to all users</Link>
        }
      />
    );
  }

  // const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=256&background=E8E8E8&color=555`;
  const avatarSrc = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;

  return (
    <Card className="user-profile" styles={{ body: { padding: 24 } }}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Link to="/">← Back to list</Link>
        </div>

        <Space align="start" size="large" wrap>
          <img
            src={avatarSrc}
            alt={`${user.name} avatar`}
            style={{ width: 120, height: 120, borderRadius: 8, border: "1px solid #f0f0f0" }}
          />
          <div>
            <Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>
              {user.name}
            </Title>
            <Text type="secondary">@{user.username}</Text>
          </div>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Title level={5} type="secondary" style={{ textTransform: "uppercase", fontSize: 12 }}>
              Contact
            </Title>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Website:</strong> {user.website}
            </p>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5} type="secondary" style={{ textTransform: "uppercase", fontSize: 12 }}>
              Address
            </Title>
            <p style={{ marginBottom: 0 }}>
              {user.address.street}, {user.address.suite}
              <br />
              {user.address.city}, {user.address.zipcode}
            </p>
          </Col>
          <Col span={24}>
            <Title level={5} type="secondary" style={{ textTransform: "uppercase", fontSize: 12 }}>
              Company
            </Title>
            <p>
              <strong>{user.company.name}</strong>
            </p>
            <Text type="secondary" style={{ fontStyle: "italic" }}>
              “{user.company.catchPhrase}”
            </Text>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}

export default UserProfilePage;
