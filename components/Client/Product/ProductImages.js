"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"; // Import the default styles
import styles from "./ProductImages.module.css";

const ProductImages = ({ imageFiles }) => {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before rendering third-party libraries
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!imageFiles?.length) {
    return (
      <Container className="mt-4">
        <div className={`${styles.imageContainer} text-center`}>
          <p>No images found</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Main Image */}
      <div className={styles.imageContainer}>
        {isMounted && (
          <Zoom>
            <Image
              src={imageFiles[index]?.imagePath}
              alt={`Main Product Image`}
              width={600}
              height={450}
              className={styles.mainImage}
            />
          </Zoom>
        )}
      </div>

      {/* Thumbnail Images */}
      <Row className="g-3">
        {imageFiles.map((image, i) => (
          <Col
            xs={3}
            key={image?.imageId || `image-${i}`}
            onClick={() => setIndex(i)}
          >
            <div
              className={`${styles.thumbnailContainer} ${
                i === index ? styles.activeThumbnail : ""
              }`}
            >
              <Image
                src={image?.imagePath}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="30vw"
                className={styles.thumbnail}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductImages;
