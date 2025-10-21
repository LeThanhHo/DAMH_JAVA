import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: "#0c2d48",
      color: "#f5f5f5",
      fontFamily: "'Poppins', sans-serif",
      paddingTop: "3rem",
      paddingBottom: "3rem",
      marginTop: "4rem",
    },
    heading: {
      color: "#00b894",
      fontWeight: 600,
      marginBottom: "1rem",
    },
    text: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    list: {
      listStyle: "none",
      padding: 0,
    },
    link: {
      color: "#f5f5f5",
      textDecoration: "none",
      display: "block",
      marginBottom: "0.5rem",
      transition: "color 0.3s",
    },
    linkHover: {
      color: "#00cec9",
    },
    socialContainer: {
      display: "flex",
      gap: "10px",
    },
    socialLink: {
      backgroundColor: "#00b894",
      color: "white",
      width: "35px",
      height: "35px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      transition: "all 0.3s",
      fontSize: "18px",
    },
    divider: {
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      marginTop: "2rem",
      marginBottom: "1.5rem",
    },
    copyright: {
      textAlign: "center",
      color: "#dfe6e9",
      fontSize: "0.9rem",
    },
  };

  return (
    <footer style={styles.footer}>
      <Container>
        <Row className="mb-4">
          {/* Giới thiệu */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 style={styles.heading}>BikeZone</h5>
            <p style={styles.text}>
              🚴‍♀️ Nơi bạn tìm thấy những chiếc xe đạp thể thao chất lượng nhất,
              phụ kiện chính hãng và dịch vụ bảo trì tận tâm.
            </p>
          </Col>

          {/* Liên kết nhanh */}
          <Col md={3} className="mb-4 mb-md-0">
            <h5 style={styles.heading}>Liên kết nhanh</h5>
            <ul style={styles.list}>
              {["Trang chủ", "Xe đạp", "Phụ kiện", "Liên hệ"].map((item, index) => (
                <li key={index}>
                  <a
                    href={
                      item === "Trang chủ"
                        ? "/"
                        : item === "Xe đạp"
                        ? "/products"
                        : item === "Phụ kiện"
                        ? "/accessories"
                        : "/contact"
                    }
                    style={styles.link}
                    onMouseEnter={(e) => (e.target.style.color = "#00cec9")}
                    onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Liên hệ */}
          <Col md={3} className="mb-4 mb-md-0">
            <h5 style={styles.heading}>Liên hệ</h5>
            <ul style={styles.list}>
              <li>Email: lethanhho.hb2005@gmail.com</li>
              <li>Điện thoại: 0398820547</li>
              <li>Địa chỉ: Cao Đẳng Công Thương TP.HCM</li>
            </ul>
          </Col>

          {/* Mạng xã hội */}
          <Col md={2}>
            <h5 style={styles.heading}>Kết nối</h5>
            <div style={styles.socialContainer}>
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={styles.socialLink}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#55efc4";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#00b894";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </Col>
        </Row>

        <hr style={styles.divider} />
        <div style={styles.copyright}>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} BikeZone. Mọi quyền được bảo lưu.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
