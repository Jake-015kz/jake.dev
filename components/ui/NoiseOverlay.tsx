"use client";

import React, { useState, useEffect } from "react";
import styles from "./NoiseOverlay.module.scss";

export const NoiseOverlay: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <div className={styles.noise} aria-hidden="true" />;
};

export default NoiseOverlay;
