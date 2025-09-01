import React from "react";

const Spinner = ({ size = 28, style }) => (
  <div
    className="spinner"
    style={{ width: size, height: size, borderWidth: 3, ...style }}
    aria-label="로딩 중"
    role="status"
  />
);

export default Spinner;

