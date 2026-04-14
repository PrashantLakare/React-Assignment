import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Modal, message } from "antd";
import { updateUser } from "../store/usersSlice";

function EditUserModal({ open, user, onClose }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        street: user.address?.street,
        suite: user.address?.suite,
        city: user.address?.city,
        zipcode: user.address?.zipcode,
        companyName: user.company?.name,
      });
    }
  }, [open, user, form]);

  const handleOk = () => {
    if (!user) return;
    form
      .validateFields()
      .then((values) => {
        dispatch(
          updateUser({
            id: user.id,
            name: values.name,
            username: values.username,
            email: values.email,
            phone: values.phone,
            website: values.website,
            address: {
              ...user.address,
              street: values.street,
              suite: values.suite,
              city: values.city,
              zipcode: values.zipcode,
            },
            company: {
              ...user.company,
              name: values.companyName,
            },
          }),
        );
        message.success("Profile updated");
        onClose();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Edit profile"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Save"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="Username">
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "Valid email is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="website" label="Website">
          <Input />
        </Form.Item>
        <Form.Item name="street" label="Street">
          <Input />
        </Form.Item>
        <Form.Item name="suite" label="Suite">
          <Input />
        </Form.Item>
        <Form.Item name="city" label="City">
          <Input />
        </Form.Item>
        <Form.Item name="zipcode" label="Zip code">
          <Input />
        </Form.Item>
        <Form.Item name="companyName" label="Company">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditUserModal;
