import UserProfile from '../components/UserProfile';

const Profile = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Your Profile</h1>
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Profile;


