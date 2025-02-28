"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "./slider.css";
import { getAllBanners } from "api/banner/bannerApi";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await getAllBanners();
        if (response.success) {
          // Map the API response to match the slide data structure
          const bannerSlides = response.data.map((banner, index) => ({
            id: banner.bannerID,
            title: banner.title,
            description: banner.subTitle,
            img: banner.image,
            url: banner.buttonLink,
            bg: `gradient-${
              ["yellow-pink", "pink-blue", "blue-yellow"][index % 3]
            }`,
          }));
          setSlides(bannerSlides);
        } else {
          setError("Failed to load banners");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching banners");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [slides]);

  if (error) {
    return (
      <div className="slider-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="slider-container">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div className={`slide ${slide.bg}`} key={slide.id}>
            <Container fluid className="h-100">
              <Row className="h-100 flex-column flex-xl-row">
                {/* TEXT CONTAINER */}
                <Col
                  xl={6}
                  className="text-center d-flex flex-column justify-content-center align-items-center text-container"
                >
                  <h2 className="description mb-1 mb-md-4">
                    {slide.description}
                  </h2>
                  <h1 className="title mb-1 mb-md-4">{slide.title}</h1>
                  <Link href={slide.url}>
                    <Button variant="dark" className="px-4 py-2">
                      SHOP NOW
                    </Button>
                  </Link>
                </Col>
                {/* IMAGE CONTAINER */}
                <Col xl={6} className="image-container">
                  <div className="image-wrapper">
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      sizes="100%"
                      className="slider-img-fit"
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {slides.map((slide, index) => (
          <div
            className={`dot-wrapper ${current === index ? "active" : ""}`}
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
            {current === index && <div className="dot-inner"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
