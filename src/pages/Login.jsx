import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <AuthForm isLogin={true} />
        </div>
      </div>
    </div>
  );
};

export default Login;
