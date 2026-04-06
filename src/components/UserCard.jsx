import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  HeartFilled,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Modal, Space, Typography } from "antd";
import { deleteUser, toggleFavorite } from "../store/usersSlice";
import EditUserModal from "./EditUserModal";

const { Text } = Typography;

function UserCard({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  // const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=256&background=E8E8E8&color=555`;
  const avatarSrc = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;
  const handleDelete = () => {
    Modal.confirm({
      title: "Delete this user?",
      content: "This tile will be removed from the list.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(deleteUser(user.id));
      },
    });
  };

  const handleFavorite = () => {
    dispatch(toggleFavorite(user.id));
  };

  return (
    <>
      <Card
        hoverable
        style={{ height: "100%" }}
        onClick={() => navigate(`/user/${user.id}`)}
        cover={
          <div
            style={{
              background: "#f0f0f0",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <Avatar src={avatarSrc} size={128} />
          </div>
        }
        actions={[
          <Button
            key="favorite"
            type="text"
            aria-label={user.favorite ? "Remove from favourites" : "Add to favourites"}
            icon={
              user.favorite ? (
                <HeartFilled style={{ color: "#eb2f96", fontSize: 18 }} />
              ) : (
                <HeartOutlined style={{ fontSize: 18 }} />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          />,
          <Button
            key="edit"
            type="text"
            aria-label="Edit profile"
            icon={<EditOutlined style={{ fontSize: 18 }} />}
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
          />,
          <Button
            key="delete"
            type="text"
            aria-label="Delete user"
            icon={<DeleteOutlined style={{ fontSize: 18 }} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          />,
        ]}
      >
        <Typography.Title level={5} style={{ marginTop: 0 }}>
          {user.name}
        </Typography.Title>
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <div>
            <MailOutlined style={{ marginRight: 8, color: "#8c8c8c" }} />
            <Text type="secondary">{user.email}</Text>
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 8, color: "#8c8c8c" }} />
            <Text type="secondary">{user.phone}</Text>
          </div>
          <div>
            <GlobalOutlined style={{ marginRight: 8, color: "#8c8c8c" }} />
            <Text type="secondary">{user.website}</Text>
          </div>
        </Space>
      </Card>
      <EditUserModal open={editOpen} user={user} onClose={() => setEditOpen(false)} />
    </>
  );
}

export default UserCard;
