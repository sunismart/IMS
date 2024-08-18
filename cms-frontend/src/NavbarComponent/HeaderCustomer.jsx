import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderCustomer = () => {
  let navigate = useNavigate();

  const userLogout = () => {
    toast.success("Logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    sessionStorage.removeItem("active-customer");
    sessionStorage.removeItem("customer-jwtToken");
    window.reload(true);

    // Wait for the toast to finish before navigating
    setTimeout(() => {
      navigate("/home");
    }, 1000); // Delay matches the toast autoClose duration
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li className="nav-item">
        <Link
          to="/customer/policy/application/view"
          className="nav-link active"
          aria-current="page"
        >
          <b className="text-color">My Policies</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/customer/policy/claim/view"
          className="nav-link active"
          aria-current="page"
        >
          <b className="text-color">My Claims</b>
        </Link>
      </li>

      <li className="nav-item">
        <Link
          to=""
          className="nav-link active"
          aria-current="page"
          onClick={userLogout}
        >
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default HeaderCustomer;
