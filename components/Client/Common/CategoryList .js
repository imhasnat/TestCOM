"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./categoryList.css";
import Link from "next/link";

// Dummy category data with Unsplash images
const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
  },
  {
    id: 2,
    name: "Fashion",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
  },
  {
    id: 3,
    name: "Home & Living",
    slug: "home-living",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80",
  },
  {
    id: 4,
    name: "Sports",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
  },
  {
    id: 5,
    name: "Books",
    slug: "books",
    image:
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80",
  },
  {
    id: 6,
    name: "Beauty",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80",
  },
  {
    id: 7,
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
  },
  {
    id: 8,
    name: "Fashion",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
  },
  {
    id: 9,
    name: "Home & Living",
    slug: "home-living",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80",
  },
  {
    id: 10,
    name: "Sports",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
  },
  {
    id: 11,
    name: "Books",
    slug: "books",
    image:
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80",
  },
  {
    id: 12,
    name: "Beauty",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80",
  },
];

const CategoryList = () => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const handleWheelScroll = (e) => {
      if (scrollContainerRef.current) {
        e.preventDefault();
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    };

    const scrollContainer = scrollContainerRef.current;

    // Add wheel event listener only on desktop screens
    if (scrollContainer && window.innerWidth >= 768) {
      scrollContainer.addEventListener("wheel", handleWheelScroll, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  // Handle mouse down for drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Handle mouse move for drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse up/leave
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (window.innerWidth < 768) {
      // Only allow touch on mobile
      setIsDragging(true);
      setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || window.innerWidth >= 768) return; // Disable touch scroll on desktop
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <Container fluid className="category-container px-2">
      <div
        ref={scrollContainerRef}
        className="category-scroll"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
      >
        <Row className="flex-nowrap">
          {categories.map((category) => (
            <Col
              key={category.id}
              xs={12}
              sm={6}
              lg={3}
              xl={2}
              className="category-col"
            >
              <Link
                href=""
                className="category-link"
                onClick={(e) => isDragging && e.preventDefault()}
              >
                <div className="category-card">
                  <div className="category-image-wrapper">
                    <Card.Img
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                      draggable="false"
                    />
                  </div>
                  <Card.Body>
                    <p className="ps-1 mt-3 mb-0">{category.name}</p>
                    {/* <Card.Title className="category-title"></Card.Title> */}
                  </Card.Body>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default CategoryList;
