import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { ROUTES } from "../../utils/constants";
import authService from "../../services/authService";
import CartIcon from "../cart/CartIcon";

const AppNavbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const currentUser = authService.getCurrentUser();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.HOME);
  };

  // Kiểm tra nếu đang ở trang admin
  const isAdminPage = location.pathname.startsWith("/admin");

  // 🎨 Style trực tiếp trong component
  const styles = {
    navbar: {
      backgroundColor: "#0c2d48",
      padding: "0.8rem 0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    brand: {
      color: "#00b894",
      fontWeight: 700,
      fontSize: "1.6rem",
      textDecoration: "none",
      letterSpacing: "0.5px",
    },
    navLink: {
      color: "#f5f5f5",
      marginRight: "1rem",
      textDecoration: "none",
      transition: "color 0.3s",
      fontWeight: 500,
    },
    navLinkHover: {
      color: "#00cec9",
    },
    authLink: {
      color: "#f5f5f5",
      marginLeft: "1rem",
      textDecoration: "none",
      fontWeight: 500,
      transition: "color 0.3s",
    },
    button: {
      marginLeft: "1rem",
      borderColor: "#00b894",
      color: "#00b894",
      fontWeight: 600,
      transition: "all 0.3s",
    },
    buttonHover: {
      backgroundColor: "#00b894",
      color: "white",
      borderColor: "#00b894",
    },
    userText: {
      color: "#f5f5f5",
      fontWeight: 500,
      marginRight: "1rem",
    },
  };

  return (
    <Navbar expand="lg" style={styles.navbar} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME} style={styles.brand}>
          🚴‍♂️ BikeZone
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to={ROUTES.HOME}
              style={styles.navLink}
              onMouseEnter={(e) => (e.target.style.color = "#00cec9")}
              onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
            >
              Trang chủ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={ROUTES.PRODUCTS}
              style={styles.navLink}
              onMouseEnter={(e) => (e.target.style.color = "#00cec9")}
              onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
            >
              Xe đạp
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/accessories"
              style={styles.navLink}
              onMouseEnter={(e) => (e.target.style.color = "#00cec9")}
              onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
            >
              Phụ kiện
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              style={styles.navLink}
              onMouseEnter={(e) => (e.target.style.color = "#00cec9")}
              onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
            >
              Liên hệ
            </Nav.Link>
          </Nav>

          <Nav>
            {/* Giỏ hàng chỉ hiện nếu KHÔNG ở trang admin */}
            {!isAdminPage && <CartIcon />}

            {isAuthenticated ? (
              <>
                <Navbar.Text style={styles.userText}>
                  Xin chào, <strong>{currentUser?.username}</strong>
                </Navbar.Text>
                <Button
                  variant="outline-success"
                  style={styles.button}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#00b894";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#00b894";
                  }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to={ROUTES.LOGIN}
                  style={styles.authLink}
                  onMouseEnter={(e) => (e.target.style.color = "#00cec9")}
                  onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
                >
                  Đăng nhập
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={ROUTES.REGISTER}
                  style={styles.authLink}
                  onMouseEnter={(e) => (e.target.style.color = "#00cec9")}
                  onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
                >
                  Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
