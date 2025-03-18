import AuthForm from '../components/AuthForm';

const Register = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <AuthForm isLogin={false} />
        </div>
      </div>
    </div>
  );
};

export default Register;

