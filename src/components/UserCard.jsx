const UserCard = ({ user }) => {
    const avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;
  
    return (
      <div className="card">
        <img src={avatar} alt="avatar" />
  
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.website}</p>
  
        <p>
          {user.address.street}, {user.address.city}
        </p>
  
        <p><strong>{user.company.name}</strong></p>
      </div>
    );
  };
  
  export default UserCard;